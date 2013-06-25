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
import de.ddb.next.beans.Folder


/**
 * Set of Methods that encapsulate REST-calls to the BookmarksService
 *
 * @author mih
 *
 */

class BookmarksService {

    def configurationService
    def transactional = false

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

    def findAllFolders(userId) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/folder/_search?q=user:${userId}")
        http.request(Method.GET, ContentType.JSON) { req ->
           response.success = { resp, json ->
               def resultList = json.hits.hits
               log.info "list: ${resultList}"
               def folderList = []
               resultList.each {it ->

                   log.info 'it: ' + it

                    def folder = new Folder(
                       folderId: it._id,
                       userId: it._source.user,
                       title: it._source.title,
                       isPublic: it._source.isPublic
                   )

                   log.info 'id: ' + folder.folderId

                   folderList.add(folder)
               }
               return folderList
           }
       }
    }

    def findAllBookmarks(userId, folderId) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/folder/_search?q=user:${userId}")
        http.request(Method.GET, ContentType.JSON) { req ->
           response.success = { resp, json ->
               def resultList = json.hits.hits
               return resultList
           }
       }
    }

    def saveBookmark(userId, folderId, itemId, creationDate) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/bookmark")
        http.request(Method.POST, ContentType.JSON) { req ->
           body = [
             user: userId,
             folder: folderId,
             item: itemId,
             createdAt: creationDate
           ]

           def bookmarkId = ''
           response.success = { resp, json ->
               log.info "response as application/json: ${json}"
               bookmarkId = json._id
           }
          bookmarkId
       }
    }

    def findBookmarks(userId, idList) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/bookmark/_search?q=user:${userId}")
        http.request(Method.POST, ContentType.JSON) { req ->
            body = [
              filter: [
                terms: [
                  item: idList
                ]
              ]
            ]

            response.success = { resp, json ->
                log.info "response as application/json: ${json}"
                // TODO: use inject if possible
                def items = []
                json.hits.hits.each { it ->
                    log.info it._source.item
                    items.add(it._source.item)
                }
                items
            }
        }
    }

    def deleteBookmarks(userId, idList) {
        def http = new HTTPBuilder("${configurationService.getBookmarkUrl()}/ddb/bookmark/_bulk")
        http.request(Method.POST, ContentType.JSON) { req ->
            // { "delete" : { "_index" : "ddb", "_type" : "bookmark", "_id" : "Oq3T4o34TWO_D-cJ4ok2hA" } }

            def reqBody = ''
            idList.each { id ->
                reqBody = reqBody + '{ "delete" : { "_index" : "ddb", "_type" : "bookmark", "_id" : "' + id + '" } }\n'
            }

            body = reqBody

            response.success = { resp, json ->
                log.info "${json}"
            }

            response.failure = { resp, json ->
                log.info "${resp.statusLine.statusCode}"
            }

        }
    }

}
