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
        println "################## FavoritesController: GET ";
        changeItemState(1);
    }
    def addFavorite() {
        println "################## FavoritesController: POST ";
        changeItemState(2);
    }
    def delFavorite() {
        println "################## FavoritesController: DELETE ";
        changeItemState(3);
    }
    
    def changeItemState(int pActn) {
        def itemId = params.id;
        def reqType = params.reqType;
        def reqActn = params.reqActn;
        int favStatus = 0;
        println "################## FavoritesController: itemdId = " + itemId;
        
        HttpSession sessionObject = request.getSession(false)
        User vUser = null;
        if ((sessionObject != null) && ((vUser = sessionObject.getAttribute(User.SESSION_USER)) != null)) {
            log.info("Favorite: change itemState User-Email: " + vUser.getEmail() + ", item: " + itemId);
            FavoritesService vFavService = FavoritesService.getFevoritesService();
            if ((vFavService != null)) {
                
                switch (pActn) {
                case 1:
                    log.info("get favorit: ${itemId}");
                    if (vFavService.isFavorit(vUser.getEmail(), itemId)) {
                        favStatus = 1;
                    }
                    break;
                case 2:
                    log.info("add to favorits: ${itemId}");
                    if (vFavService.addToFavorites(vUser.getEmail(), itemId)) {
                        favStatus = 2;
                    }
                    break;
                case 3:
                    log.info("delete from favorits list: ${itemId}");
                    if (vFavService.deleteFromFavoritesList(vUser.getEmail(), itemId)) {
                        favStatus = 1;
                    }
                    break;
                default:
                    log.info("Unbekannte Action = ${pActn}, ItemId: ${itemId}");
                    break;
                }
                
            }
            else {
                log.error("Favorites-Services not found");
            }
        }
        
        println "################## FavoritesController: render - START: AJAX-AJAX-AJAX"
        def jsonResp = '{"favStatus":"' + favStatus + '"}';
        render(contentType:"application/json", text: jsonResp)
        println "################## FavoritesController: render - STOP"
        
    }
}
