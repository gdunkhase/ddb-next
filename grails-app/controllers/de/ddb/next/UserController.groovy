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

import de.ddb.next.beans.User;

class UserController {

    private final static String SESSION_CONSUMER_MANAGER = "SESSION_CONSUMER_MANAGER_ATTRIBUTE"
    private final static String SESSION_OPENID_PROVIDER = "SESSION_OPENID_PROVIDER_ATTRIBUTE"

    LinkGenerator grailsLinkGenerator

    def index() {

        render(view: "login", model: [
            'loginStatus': LoginStatus.LOGGED_OUT]
        )
    }

    def doLogin() {

        def loginStatus = LoginStatus.LOGGED_OUT

        // Only perfom login if user is not already logged in
        if(!isUserInSession()){
            def email = params.email
            def password = params.password

            def USERNAMEDUMMY = "FIZ"
            def EMAILDUMMY = "fiz@fiz.fiz"
            def PASSWORDDUMMY = "fiz"

            if(email == EMAILDUMMY && password == PASSWORDDUMMY){
                loginStatus = LoginStatus.SUCCESS
            }else{
                loginStatus = LoginStatus.FAILURE
            }

            if(loginStatus == LoginStatus.SUCCESS){
                User user = new User() // TODO get from AAS
                user.setUsername(USERNAMEDUMMY)
                user.setEmail(EMAILDUMMY)
                user.setPassword(PASSWORDDUMMY)
                user.setOpenIdUser(false)
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
            'loginStatus': LoginStatus.LOGGED_OUT]
        )
    }

    def registration() {

        render(view: "registration", model: [])

    }

    def signup() {
        //        TODO
    }

    def recoverPassword(){

        //TODO
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
            //TODO handle invalid provider
        }

        // --- Forward proxy setup (only if needed) ---
        ProxyProperties proxyProps = new ProxyProperties();
        proxyProps.setProxyHostName("proxy.fiz-karlsruhe.de");
        proxyProps.setProxyPort(8888);
        HttpClientFactory.setProxyProperties(proxyProps);


        log.info "requestOpenIdLogin(): discoveryUrl="+discoveryUrl
        ConsumerManager manager = new ConsumerManager();
        session.setAttribute(SESSION_CONSUMER_MANAGER, manager)
        session.setAttribute(SESSION_OPENID_PROVIDER, provider)
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

        ConsumerManager manager = session.getAttribute(SESSION_CONSUMER_MANAGER)
        if(manager){
            def provider = session.getAttribute(SESSION_OPENID_PROVIDER)

            ParameterList openidResp = new ParameterList(request.getParameterMap());
            DiscoveryInformation discovered = (DiscoveryInformation) session.getAttribute("discovered");
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
                    //TODO handle invalid provider
                }

                log.info "doOpenIdLogin(): credentials:  " + username + " / " + email + " / " + identifier // TODO remove again!!!

                // Create new session, because the old one might be corrupt due to the redirect to the OpenID provider
                session.invalidate()
                HttpSession newSession = request.getSession(true)

                User user = new User()
                user.setEmail(email)
                user.setUsername(username)
                user.setPassword(null)
                user.setOpenIdUser(true)
                newSession.setAttribute(User.SESSION_USER, user)

                loginStatus = LoginStatus.SUCCESS

            }else {
                log.info "doOpenIdLogin(): failure verification"
                loginStatus = LoginStatus.FAILURE
            }
        }

        render(view: "login", model: [
            'loginStatus': loginStatus]
        )

    }

    private boolean isUserInSession() {
        HttpSession sessionObject = request.getSession(false)
        return sessionObject && sessionObject.getAttribute(User.SESSION_USER)
    }
}
