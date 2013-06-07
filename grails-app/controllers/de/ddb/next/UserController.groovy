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
    private final static String OPENID_REENTRY_POINT = "http://localhost:8080/ddb-next/login/doOpenIdLogin"

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

        //TODO
    }

    def requestOpenIdLogin() {
        def provider = params.provider
        println "########################## requestOpenIdLogin(): provider="+provider

        String discoveryUrl = ""

        FetchRequest fetch = FetchRequest.createFetchRequest();


        if(provider == "google"){
            discoveryUrl = "https://www.google.com/accounts/o8/id"
            fetch.addAttribute("Email", "http://schema.openid.net/contact/email", true);
            fetch.addAttribute("FirstName", "http://schema.openid.net/namePerson/first", true);
            fetch.addAttribute("LastName", "http://schema.openid.net/namePerson/last", true);
            fetch.setCount("openid.ext1.value.Email", 1);
        }else if(provider == "yahoo"){
            discoveryUrl = "https://me.yahoo.com"
            fetch.addAttribute("Email", "http://axschema.org/contact/email", true);
            fetch.addAttribute("Fullname", "http://axschema.org/namePerson", true);
        }else{
            //TODO handle invalid provider
        }

        println "########################## requestOpenIdLogin(): setting proxy"
        // --- Forward proxy setup (only if needed) ---
        ProxyProperties proxyProps = new ProxyProperties();
        proxyProps.setProxyHostName("proxy.fiz-karlsruhe.de");
        proxyProps.setProxyPort(8888);
        HttpClientFactory.setProxyProperties(proxyProps);


        println "########################## requestOpenIdLogin(): discoveryUrl="+discoveryUrl
        ConsumerManager manager = new ConsumerManager();
        session.setAttribute(SESSION_CONSUMER_MANAGER, manager)
        session.setAttribute(SESSION_OPENID_PROVIDER, provider)

        String returnURL = OPENID_REENTRY_POINT;

        // perform discovery on the user-supplied identifier
        List discoveries = manager.discover(discoveryUrl);
        println "########################## requestOpenIdLogin(): 1"

        // attempt to associate with the OpenID provider
        // and retrieve one service endpoint for authentication
        DiscoveryInformation discovered = manager.associate(discoveries);
        println "########################## requestOpenIdLogin(): 2"

        // store the discovery information in the user's session for later use
        // leave out for stateless operation / if there is no session
        //session.setAttribute("discovered", discovered);

        // obtain a AuthRequest message to be sent to the OpenID provider
        AuthRequest authReq = manager.authenticate(discovered, returnURL);
        authReq.addExtension(fetch);
        println "########################## requestOpenIdLogin(): authReq.getDestinationUrl="+authReq.getDestinationUrl(true)

        redirect(url: authReq.getDestinationUrl(true))

        //        render(view: "login", model: [
        //            'loginStatus': 0]
        //        )
    }

    def doOpenIdLogin() {
        println "########################## doOpenIdLogin(): params="+params

        def loginStatus = LoginStatus.LOGGED_OUT

        ConsumerManager manager = session.getAttribute(SESSION_CONSUMER_MANAGER)
        if(manager){
            def provider = session.getAttribute(SESSION_OPENID_PROVIDER)

            // extract the parameters from the authentication response
            // (which comes in as a HTTP request from the OpenID provider)
            ParameterList openidResp = new ParameterList(request.getParameterMap());
            println "########################## doOpenIdLogin(): get parameter list"

            // retrieve the previously stored discovery information
            DiscoveryInformation discovered = (DiscoveryInformation) session.getAttribute("discovered");
            println "########################## doOpenIdLogin(): discovery"

            // extract the receiving URL from the HTTP request
            String receivingURL =  OPENID_REENTRY_POINT + "?" + request.getQueryString();

            println "########################## doOpenIdLogin(): receivingURL="+receivingURL
            // verify the response
            VerificationResult verification = manager.verify(receivingURL.toString(), openidResp, discovered);
            println "########################## doOpenIdLogin(): verification"

            // examine the verification result and extract the verified identifier
            Identifier verified = verification.getVerifiedId();

            if (verified != null) {
                println "########################## doOpenIdLogin(): success verified="+verified
                // success, use the verified identifier to identify the user
                println "########################## doOpenIdLogin(): identifier="+verified.getIdentifier()

                def username = null
                def email = null

                if(provider == "google"){
                    def firstName = params["openid.ext1.value.FirstName"]
                    def lastName = params["openid.ext1.value.LastName"]
                    username = firstName + " " + lastName
                    email = params["openid.ext1.value.Email"]
                }else if(provider == "yahoo"){
                    username = params["openid.ax.value.fullname"]
                    email = params["openid.ax.value.email"]
                }

                println "########################## doOpenIdLogin(): "+username+" / "+email



                User user = new User()
                user.setEmail(email)
                user.setUsername(username)
                user.setPassword(null)
                user.setOpenIdUser(true)
                session.setAttribute(User.SESSION_USER, user)

                loginStatus = LoginStatus.SUCCESS

            }else {
                println "########################## doOpenIdLogin(): failure verification"
                // OpenID authentication failed
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
