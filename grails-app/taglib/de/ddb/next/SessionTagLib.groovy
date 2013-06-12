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

import org.codehaus.groovy.grails.web.servlet.mvc.GrailsHttpSession;

import de.ddb.next.beans.User;

class SessionTagLib {

    def userController

    private boolean isUserInSession() {
        HttpSession sessionObject = request.getSession(false)
        return sessionObject && sessionObject.getAttribute(User.SESSION_USER)
    }

    def isLoggedIn = { attrs, body ->
        def isLoggedIn = isUserInSession()

        if(isLoggedIn){
            out << body()
        }else{
            out << ""
        }
    }

    def isNotLoggedIn = { attrs, body ->
        def isLoggedIn = isUserInSession()

        if(!isLoggedIn){
            out << body()
        }else{
            out << ""
        }
    }

    def getUserName = { attrs, body ->
        def isLoggedIn = isUserInSession()

        if(isLoggedIn){
            out << session.getAttribute(User.SESSION_USER).getUsername()
        }else{
            out << ""
        }
    }

    def getUserEmail = { attrs, body ->
        def isLoggedIn = isUserInSession()

        if(isLoggedIn){
            out << request.getAttribute(User.SESSION_USER).getEmail()
        }else{
            out << ""
        }
    }
}