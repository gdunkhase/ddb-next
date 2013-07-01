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

import javax.servlet.http.HttpSession;

import com.sun.org.apache.bcel.internal.generic.RETURN;

import de.ddb.next.beans.User;

import de.ddb.next.exception.ItemNotFoundException

class FavoritesController {

    def getFavorite() {
        log.info("FavoritesController: isFavorite");
        int statusCode = response.SC_NOT_FOUND;
        String statusTxt = null;
        def itemId = params.id;
        HttpSession sessionObject = request.getSession(false)
        User vUser = null;
        if ((sessionObject != null) && ((vUser = sessionObject.getAttribute(User.SESSION_USER)) != null)) {
            log.info("isFavorite: User: " + vUser.getEmail() + ", itemid: " + itemId);
            FavoritesService vFavService = FavoritesService.getFevoritesService();
            if ((vFavService != null)) {
                if (vFavService.isFavorit(vUser.getEmail(), itemId)) {
                    statusTxt = "isFavorit(${vUser.getEmail()}, ${itemId}):${response.SC_OK}";
                    statusCode = response.SC_OK;
                }
                else {
                    statusTxt = "isFavorit(${vUser.getEmail()}, ${itemId}):${response.SC_NOT_FOUND}";
                    statusCode = response.SC_NOT_FOUND;
                }
                log.info(statusTxt);
            }
            else {
                statusTxt = "Favorites-Service not found";
                statusCode = response.SC_INTERNAL_SERVER_ERROR;
                log.error(statusTxt);
            }
        }
        else {
            statusTxt = "UNAUTHORIZED";
            statusCode = response.SC_UNAUTHORIZED;
            //response.status = response.SC_UNAUTHORIZED;
            log.error(statusTxt);
        }
        //response.flushBuffer();
        render(status: statusCode, text: statusTxt);
    }
    
    
    def addFavorite() {
        log.info("FavoritesController: addFavorite");
        int statusCode = response.SC_BAD_REQUEST;
        String statusTxt = "";
        def itemId = params.id;
        HttpSession sessionObject = request.getSession(false)
        User vUser = null;
        if ((sessionObject != null) && ((vUser = sessionObject.getAttribute(User.SESSION_USER)) != null)) {
            log.info("addFavorite: User: " + vUser.getEmail() + ", itemid: " + itemId);
            FavoritesService vFavService = FavoritesService.getFevoritesService();
            if ((vFavService != null)) {
                if (vFavService.addToFavorites(vUser.getEmail(), itemId)) {
                    statusTxt = "add to favorits ${itemId} : ${response.SC_CREATED}";
                    statusCode = response.SC_CREATED;
                }
                else {
                    statusTxt = "add to favorits ${itemId} : ${response.SC_BAD_REQUEST}";
                    statusCode = response.SC_BAD_REQUEST;
                }
                log.info(statusTxt);
            }
            else {
                statusTxt = "Favorites-Service not found";
                statusCode = response.SC_INTERNAL_SERVER_ERROR;
                log.error(statusTxt);
            }
        }
        else {
            statusTxt = "UNAUTHORIZED";
            statusCode = response.SC_UNAUTHORIZED;
            //response.status = response.SC_UNAUTHORIZED;
            log.error(statusTxt);
        }
        //response.flushBuffer();
        render(status: statusCode, text: statusTxt);
    }
    
    
    def delFavorite() {
        log.info("FavoritesController: delFavorite");
        int statusCode = response.SC_NOT_FOUND;
        String statusTxt = "";
        def itemId = params.id;
        HttpSession sessionObject = request.getSession(false)
        User vUser = null;
        if ((sessionObject != null) && ((vUser = sessionObject.getAttribute(User.SESSION_USER)) != null)) {
            log.info("delFavorite: User: " + vUser.getEmail() + ", itemid: " + itemId);
            FavoritesService vFavService = FavoritesService.getFevoritesService();
            if ((vFavService != null)) {
                if (vFavService.deleteFromFavoritesList(vUser.getEmail(), itemId)) {
                    statusTxt = "delete from favorits ${itemId} : ${response.SC_NO_CONTENT}";
                    statusCode = response.SC_NO_CONTENT;
                }
                else {
                    statusTxt = "delete from favorits ${itemId} : ${response.SC_NOT_FOUND}";
                    statusCode = response.SC_NOT_FOUND;
                }
                log.info(statusTxt);
            }
            else {
                statusTxt = "Favorites-Service not found";
                statusCode = response.SC_INTERNAL_SERVER_ERROR;
                log.error(statusTxt);
            }
        }
        else {
            statusTxt = "UNAUTHORIZED";
            statusCode = response.SC_UNAUTHORIZED;
            //response.status = response.SC_UNAUTHORIZED;
            log.error(statusTxt);
        }
        //response.flushBuffer();
        render(status: statusCode, text: statusTxt);
    }
    
    
    def changeItemState() {
        def itemId = params.id;
        def reqType = params.reqType;
        def reqActn = params.reqActn;
        if (reqActn != null) {
            if ("add".equalsIgnoreCase(reqActn)) {
                // -- add
                addFavorite();
            }
            else if ("del".equalsIgnoreCase(reqActn)) {
                // -- delete
                delFavorite();
            }
            else if ("get".equalsIgnoreCase(reqActn)) {
                // -- delete
                getFavorite();
            }
            else {
                // -- reload
                statusTxt = "Favorites-Service not found";
                statusCode = response.SC_NOT_ACCEPTABLE;
                log.error(statusTxt);
                render(status: statusCode, text: statusTxt);
            }
        }
    }
    
    
}
