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

import javax.servlet.http.HttpSession
import org.codehaus.groovy.grails.web.json.JSONObject

import de.ddb.next.beans.User
import de.ddb.next.exception.AuthorizationException
import de.ddb.next.AasService

class UserController {
    
    def aasService
    
    def index() {

        render(view: "login", model: [
            'loginStatus': 0]
        )
    }

    def doLogin() {

        def loginStatus = 0 // -1 == login failed / 0 == undefined or already logged in /  1 == login success

        // Only perfom login if user is not already logged in
        if(!isUserInSession()){
            def email = params.email
            def password = params.password

            User user = aasService.login(email, password)

            if(user != null){
                loginStatus = 1
                putUserInSession(user)
            }else{
                loginStatus = -1
            }

        }

        render(view: "login", model: [
            'loginStatus': loginStatus]
        )
    }

    def doLogout() {

        removeUserFromSession()

        render(view: "login", model: [
            'loginStatus': 0]
        )
    }

    def registration() {

        //TODO
    }

    def profile() {
        def user
        try {
            user = aasService.getPerson(params.id)
        }
        catch (AuthorizationException e) {
            forward controller: "error", action: "auth"
        }
        render(view: "profile", model: [bookmarksCount: "no count yet", user: user])
    }
    
    def save() {
        JSONObject user
        try {
            user = aasService.getPerson(params.id)
        }
        catch (AuthorizationException e) {
            forward controller: "error", action: "auth"
        }
        user.email = params.email
        try {
            user = aasService.updatePerson(params.id, user)
        }
        catch (AuthorizationException e) {
            forward controller: "error", action: "auth"
        }
        render(view: "profile", model: [bookmarksCount: "no count yet", user: user])
    }
    
    def delete() {
        try {
            aasService.deletePerson(params.id)
        }
        catch (AuthorizationException e) {
            forward controller: "error", action: "auth"
        }
        render(view: "profile", model: [bookmarksCount: "no count yet", user: user])
    }
    
    private boolean isUserInSession() {
        HttpSession sessionObject = request.getSession(false)
        return sessionObject && sessionObject.getAttribute(User.SESSION_USER)
    }

    private void putUserInSession(user) {
        session.setAttribute(User.SESSION_USER, user)
    }
    
    private boolean removeUserFromSession() {
        session.removeAttribute(User.SESSION_USER)
        session.invalidate()
    }
}
