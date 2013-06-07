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

import de.ddb.next.beans.User;

class UserController {

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

            def USERNAMEDUMMY = "FIZ"
            def EMAILDUMMY = "fiz@fiz.fiz"
            def PASSWORDDUMMY = "fiz"

            if(email == EMAILDUMMY && password == PASSWORDDUMMY){
                loginStatus = 1
            }else{
                loginStatus = -1
            }

            if(loginStatus == 1){
                User user = new User() // TODO get from AAS
                user.setUsername(USERNAMEDUMMY)
                user.setEmail(EMAILDUMMY)
                user.setPassword(PASSWORDDUMMY)
                session.setAttribute(User.SESSION_USER, user)
            }
        }

        render(view: "login", model: [
            'loginStatus': loginStatus]
        )
    }

    def doLogout() {

        session.removeAttribute(User.SESSION_USER)
        session.invalidate()

        render(view: "login", model: [
            'loginStatus': 0]
        )
    }
    
    //Favorites page
    def favorites(){
        
        if(isUserInSession()){
            //1. Call to fetch the list of favorites items#
            //2. Get the items from the backend
            //3. Render the results in the page
            
            redirect(controller:"index")
        }
        else{
            redirect(controller:"index")
        }
        
    }

    def registration() {

        //TODO
    }

    private boolean isUserInSession() {
        HttpSession sessionObject = request.getSession(false)
        return sessionObject && sessionObject.getAttribute(User.SESSION_USER)
    }
}
