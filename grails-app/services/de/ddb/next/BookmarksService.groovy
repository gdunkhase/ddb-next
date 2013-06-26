/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.ddb.next


import groovy.json.*
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method
import de.ddb.next.beans.Bookmark
import de.ddb.next.beans.Folder


/**
 * Set of Methods that encapsulate REST-calls to the BookmarksService
 *
 * @author mih
 * @author crh
 *
 */
// TODO: use ApiConsumer if possible
class BookmarksService {

    def configurationService
    def transactional = false

    /**
     * Create a new bookmark folder.
     *
     * @param userId    the ID whose the folder belongs to.
     * @param title     the title of the folder.
     * @param isPublic  boolean flag to mark if a folder should be public visible.
     * @return          the newly created folder ID.
     */
    def newFolder(userId, title, isPublic) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/folder")
        http.request(Method.POST, ContentType.JSON) { req ->
           body = [
             user: userId,
             title : title,
             isPublic : isPublic
           ]

           def folderId
           response.success = { resp, json ->
               folderId = json._id
           }
           folderId
       }
    }

    /**
     * List all folders belong to a user.
     *
     * A Folder {@link Folder} contains following properties:
     * - String folderId
     * - String userId
     * - String title
     * - boolean isPublic
     *
     * @param userId    the ID whose the folders belongs to.
     * @return          a list of folders.
     */
    def findAllFolders(userId) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/folder/_search?q=user:${userId}")
        http.request(Method.GET, ContentType.JSON) { req ->
           response.success = { resp, json ->
               def resultList = json.hits.hits
               def folderList = []
               resultList.each { it ->
                    def folder = new Folder(
                       folderId: it._id,
                       userId: it._source.user,
                       title: it._source.title,
                       isPublic: it._source.isPublic
                   )
                   folderList.add(folder)
               }
               return folderList
           }
       }
    }

    /* TODO: refactor this one
     * URL encode the space character programmatically, _not_ hard code.
     */
    /**
     * List all bookmarks in a folder that belongs to the user.
     *
     * A Bookmark {@link Bookmark} contains following properties:
     * - String bookmarkId,
     * - String userId,
     * - String itemId,
     * - Date creationDate
     *
     * @param userId    the ID whose the folders and bookmarks belongs to.
     * @param folderId  the ID of a certain folder. Use {@link #findAllFolders} to find out the folder IDs.
     * @return          a list of bookmarks.
     */
    def findBookmarksByFolderId(userId, folderId) {
        def http = new HTTPBuilder(
            "${configurationService.getBookmarkUrl()}/ddb/bookmark/_search?q=user:${userId}%20AND%20folder:${folderId}")
        http.request(Method.GET, ContentType.JSON) { req ->
           response.success = { resp, json ->
               def resultList = json.hits.hits
               def all = []
               resultList.each { it ->
                   log.info "created at: ${it._source.createdAt}"
                   def bookmark = new Bookmark(
                        bookmarkId: it._id,
                        userId: it._source.user,
                        itemId: it._source.item,
                        creationDate: new Date(it._source.createdAt.toLong())
                   )
                   all.add(bookmark)
               }
               return all
           }
       }
    }

    /**
     * Bookmark a cultural item in a folder for a certain user.
     *
     * @param userId    the ID whose the folder belongs to.
     * @param folderId  the ID of a certain folder. Use {@link #findAllFolders} to find out the folder IDs.
     * @param itemID    the ID of the DDB cultural item.
     * @return          the created bookmark ID.
     */
    def saveBookmark(userId, folderId, itemId) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/bookmark")
        http.request(Method.POST, ContentType.JSON) { req ->
           body = [
             user: userId,
             folder: folderId,
             item: itemId,
             createdAt: new Date().getTime()
           ]

           def bookmarkId = ''
           response.success = { resp, json ->
               log.info "response as application/json: ${json}"
               bookmarkId = json._id
           }
          bookmarkId
       }
    }

    /**
     * Given a list of cultural item IDs, find which are bookmarked by the user.
     *
     * @param userId     the ID who bookmarked the cultural items.
     * @param itemIdList a list of cultural item IDs.
     * @return           the list of bookmarked items.
     */
    def findBookmarkedItems(userId, itemIdList) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/bookmark/_search?q=user:${userId}")
        http.request(Method.POST, ContentType.JSON) { req ->
            body = [
              filter: [
                terms: [
                  item: itemIdList
                ]
              ]
            ]

            response.success = { resp, json ->
                log.info "response as application/json: ${json}"
                // TODO: use inject if possible
                def items = [] as Set
                json.hits.hits.each { it ->
                    log.info it._source.item
                    items.add(it._source.item)
                }
                items
            }
        }
    }

    /**
     * Delete all bookmarks of cultural items in the {bookmarkIdList} belong to the user.
     *
     * @param userId         the ID who bookmarked the cultural items.
     * @param bookmarkIdList a list of bookmark IDs. NOTE: These are _not_ a list of cultural item IDs.
     */
    def deleteBookmarks(userId, bookmarkIdList) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/bookmark/_bulk")
        http.request(Method.POST, ContentType.JSON) { req ->
            def reqBody = ''
            bookmarkIdList.each { id ->
                reqBody = reqBody + '{ "delete" : { "_index" : "ddb", "_type" : "bookmark", "_id" : "' + id + '" } }\n'
            }

            body = reqBody
        }
    }

}
