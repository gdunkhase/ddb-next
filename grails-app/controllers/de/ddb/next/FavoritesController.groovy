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

import de.ddb.next.beans.User

import grails.converters.JSON

import javax.servlet.http.HttpSession

class FavoritesController {

    def bookmarksService

    def getFavorite() {
        log.info "getFavorite " + params.id
        def result = response.SC_NOT_FOUND
        def HttpSession session = request.getSession(false)
        if (session != null) {
            def User user = session.getAttribute(User.SESSION_USER)
            if (user != null) {
                def folderId = bookmarksService.findFoldersByTitle(user.getId(), BookmarksService.FAVORITES)

                if(folderId) {
                    def bookmarks = bookmarksService.findBookmarksByFolderId(user.getId(), folderId)

                    if (bookmarks && bookmarks.contains(itemId)) {
                        result = response.SC_OK
                    }
                }
            }
            else {
                result = response.SC_UNAUTHORIZED
            }
        }
        else {
            result = response.SC_UNAUTHORIZED
        }
        log.info "getFavorite returns " + result
        render(result)
    }

    def getFavorites() {
        log.info "getFavorites " + request.JSON
        def HttpSession session = request.getSession(false)
        if (session != null) {
            def User user = session.getAttribute(User.SESSION_USER)
            if (user != null) {
                def result = bookmarksService.findBookmarkedItems(user.getId(), request.JSON)
                log.info "getFavorites returns " + result
                render result as JSON
            }
            else {
                log.info "getFavorites returns " + response.SC_UNAUTHORIZED
                render(response.SC_UNAUTHORIZED)
            }
        }
        else {
            log.info "getFavorites returns " + response.SC_UNAUTHORIZED
            render(response.SC_UNAUTHORIZED)
        }
    }

    def addFavorite() {
        log.info "addFavorite " + params.id
        def result = response.SC_BAD_REQUEST
        def HttpSession session = request.getSession(false)
        if (session != null) {
            def User user = session.getAttribute(User.SESSION_USER)
            if (user != null) {
                if (bookmarksService.addFavorite(user.getId(), params.id)) {
                    result = response.SC_CREATED
                }
            }
            else {
                result = response.SC_UNAUTHORIZED
            }
        }
        else {
            result = response.SC_UNAUTHORIZED
        }
        log.info "addFavorite returns " + result
        render(result)
    }

    def delFavorite() {
        log.info "delFavorite " + params.id
        def result = response.SC_NOT_FOUND
        def HttpSession session = request.getSession(false)
        if (session != null) {
            def User user = session.getAttribute(User.SESSION_USER)
            if (user != null) {
                if (bookmarksService.deleteBookmarks(user.getId(), [params.id])) {
                    result = response.SC_OK
                }
            }
            else {
                result = response.SC_UNAUTHORIZED
            }
        }
        else {
            result = response.SC_UNAUTHORIZED
        }
        log.info "delFavorite returns " + result
        render(result)
    }
}