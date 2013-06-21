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
import org.codehaus.groovy.grails.web.mapping.LinkGenerator;
import org.openid4java.consumer.ConsumerManager;
import org.openid4java.consumer.VerificationResult;
import org.openid4java.discovery.DiscoveryInformation;
import org.openid4java.discovery.Identifier;
import org.openid4java.message.AuthRequest;
import org.openid4java.message.ParameterList;
import org.openid4java.message.ax.FetchRequest;
import org.openid4java.util.HttpClientFactory;
import org.openid4java.util.ProxyProperties;

class UserController {
    def aasService
    private final static String SESSION_CONSUMER_MANAGER = "SESSION_CONSUMER_MANAGER_ATTRIBUTE"
    private final static String SESSION_OPENID_PROVIDER = "SESSION_OPENID_PROVIDER_ATTRIBUTE"
    LinkGenerator grailsLinkGenerator

    def index() {

        render(view: "login", model: [
            'loginStatus': LoginStatus.LOGGED_OUT]
        )
    }

    def doLogin() {
        log.info "doLogin(): login user "
        def loginStatus = LoginStatus.LOGGED_OUT

        // Only perfom login if user is not already logged in
        if(!isUserInSession()){
            def email = params.email
            def password = params.password

            User user = aasService.login(email, password)

            if(user != null){
                loginStatus = LoginStatus.SUCCESS
                putUserInSession(getSessionObject(true), user)
            }else{
                loginStatus = LoginStatus.FAILURE
            }
        }

        if(loginStatus == LoginStatus.SUCCESS){
            redirect(controller: 'user', action: 'favorites')
        }else{
            render(view: "login", model: ['loginStatus': loginStatus])
        }
    }

    def doLogout() {
        log.info "doLogout(): logout user "

        removeUserFromSession()

        redirect(controller: 'index', action: 'index')

    }
    
    //Favorites page
    def favorites(){
        
        if(isUserInSession() || true){
            //1. Call to fetch the list of favorites items#
            //2. Get the items from the backend
            //3. Render the results in the page
            render(view:"favorites")
        }
        else{
            redirect(controller:"index")
        }
        
    }

    def registration() {

        render(view: "registration", model: [])

    }

    def signup() {

        //        TODO

        def errors = []
        // check variable
        def nextStep = false
        // dummy error added to try the form validation
        errors.add(message(code: "error.500.body"))

        if(!nextStep){
            render(view: "registration" , model: [errors: errors])
            return
        }else{
            //        TODO
        }
    }

    def recoverPassword(){

        //TODO
    }

    def profile() {
        def user
        try {
            user = aasService.getPerson("current")
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
        def user
        try {
            user = aasService.getPerson("current")
            aasService.deletePerson(user.id)
        }
        catch (AuthorizationException e) {
            forward controller: "error", action: "auth"
        }
        doLogout()
    }

    def requestOpenIdLogin() {
        def provider = params.provider

        String discoveryUrl = ""

        FetchRequest fetch = FetchRequest.createFetchRequest();

        if(provider == SupportedOpenIdProviders.GOOGLE.toString()){
            discoveryUrl = "https://www.google.com/accounts/o8/id"
            fetch.addAttribute("Email", "http://schema.openid.net/contact/email", true);
            fetch.addAttribute("FirstName", "http://schema.openid.net/namePerson/first", true);
            fetch.addAttribute("LastName", "http://schema.openid.net/namePerson/last", true);
            fetch.setCount("openid.ext1.value.Email", 1);
        }else if(provider == SupportedOpenIdProviders.YAHOO.toString()){
            discoveryUrl = "https://me.yahoo.com"
            fetch.addAttribute("Email", "http://axschema.org/contact/email", true);
            fetch.addAttribute("Fullname", "http://axschema.org/namePerson", true);
        }else{
            render(view: "login", model: [
                'loginStatus': LoginStatus.AUTH_PROVIDER_UNKNOWN]
            )
            return
        }

        setProxy()

        log.info "requestOpenIdLogin(): discoveryUrl="+discoveryUrl
        ConsumerManager manager = new ConsumerManager();
        getSessionObject(true)?.setAttribute(SESSION_CONSUMER_MANAGER, manager)
        getSessionObject(true)?.setAttribute(SESSION_OPENID_PROVIDER, provider)
        String returnURL = grailsLinkGenerator.serverBaseURL + "/login/doOpenIdLogin";
        List discoveries = manager.discover(discoveryUrl);
        DiscoveryInformation discovered = manager.associate(discoveries);
        AuthRequest authReq = manager.authenticate(discovered, returnURL);
        authReq.addExtension(fetch);

        // Leave DDB for login on OpenID-provider
        redirect(url: authReq.getDestinationUrl(true))

    }

    def doOpenIdLogin() {
        def loginStatus = LoginStatus.LOGGED_OUT

        log.info "doOpenIdLogin(): got OpenID login request"

        ConsumerManager manager = getSessionObject(false)?.getAttribute(SESSION_CONSUMER_MANAGER)
        if(manager){
            def provider = getSessionObject(false)?.getAttribute(SESSION_OPENID_PROVIDER)

            ParameterList openidResp = new ParameterList(request.getParameterMap());
            DiscoveryInformation discovered = (DiscoveryInformation) getSessionObject(false)?.getAttribute("discovered");
            String returnURL = grailsLinkGenerator.serverBaseURL + "/login/doOpenIdLogin";
            String receivingURL =  returnURL + "?" + request.getQueryString();
            VerificationResult verification = manager.verify(receivingURL.toString(), openidResp, discovered);
            Identifier verified = verification.getVerifiedId();

            if (verified != null) {
                log.info "doOpenIdLogin(): success verification"

                def username = null
                def email = null
                def identifier = null

                if(provider == SupportedOpenIdProviders.GOOGLE.toString()){
                    def firstName = params["openid.ext1.value.FirstName"]
                    def lastName = params["openid.ext1.value.LastName"]
                    username = firstName + " " + lastName
                    email = params["openid.ext1.value.Email"]
                    identifier = verified.getIdentifier()
                }else if(provider == SupportedOpenIdProviders.YAHOO.toString()){
                    username = params["openid.ax.value.fullname"]
                    email = params["openid.ax.value.email"]
                    identifier = verified.getIdentifier()
                }else{
                    render(view: "login", model: [
                        'loginStatus': LoginStatus.AUTH_PROVIDER_UNKNOWN]
                    )
                    return
                }

                log.info "doOpenIdLogin(): credentials:  " + username + " / " + email + " / " + identifier // TODO remove again!!!

                // Create new session, because the old one might be corrupt due to the redirect to the OpenID provider
                getSessionObject(false)?.invalidate()
                HttpSession newSession = getSessionObject(true)

                User user = new User()
                user.setEmail(email)
                user.setUsername(username)
                user.setPassword(null)
                user.setOpenIdUser(true)

                putUserInSession(newSession, user)

                loginStatus = LoginStatus.SUCCESS

            }else {
                log.info "doOpenIdLogin(): failure verification"
                loginStatus = LoginStatus.AUTH_PROVIDER_DENIED
            }
        }

        if(loginStatus == LoginStatus.SUCCESS){
            redirect(controller: 'user', action: 'favorites')
        }else{
            render(view: "login", model: ['loginStatus': loginStatus])
        }

    }

    private def setProxy(){

        def proxyHost = System.getProperty("http.proxyHost")
        def proxyPortString = System.getProperty("http.proxyPort")
        int proxyPort = 80

        if (proxyHost) {
            if (proxyPortString && !proxyPortString.isEmpty()) {
                try{
                    proxyPort = Integer.parseInt(proxyPortString)
                }catch(NumberFormatException e){
                    log.error "setProxy(): The proxyport of the system properties cannot be cast to an int: '"+proxyPortString"'"
                }
            }

            ProxyProperties proxyProps = new ProxyProperties();
            proxyProps.setProxyHostName(proxyHost);
            proxyProps.setProxyPort(proxyPort);
            HttpClientFactory.setProxyProperties(proxyProps);
        }

    }

    private boolean isUserInSession() {
        HttpSession sessionObject = getSessionObject(false)
        return sessionObject && sessionObject.getAttribute(User.SESSION_USER)
    }

    private void putUserInSession(HttpSession sessionObject, User user) {
        sessionObject.setAttribute(User.SESSION_USER, user)
    }

    private User getUserFromSession() {
        return getSessionObject(false)?.getAttribute(User.SESSION_USER)
    }

    private boolean removeUserFromSession() {
        getSessionObject(false)?.removeAttribute(User.SESSION_USER)
        getSessionObject(false)?.invalidate()
    }

    private HttpSession getSessionObject(boolean createNewSession){
        return request.getSession(createNewSession)
    }
}
