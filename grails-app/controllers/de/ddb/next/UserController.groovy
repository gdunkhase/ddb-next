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

import org.apache.commons.lang.StringUtils
import org.codehaus.groovy.grails.web.json.JSONObject
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import org.openid4java.consumer.ConsumerManager
import org.openid4java.consumer.VerificationResult
import org.openid4java.discovery.DiscoveryInformation
import org.openid4java.discovery.Identifier
import org.openid4java.message.AuthRequest
import org.openid4java.message.ParameterList
import org.openid4java.message.ax.FetchRequest
import org.openid4java.util.HttpClientFactory
import org.openid4java.util.ProxyProperties

import org.springframework.web.servlet.support.RequestContextUtils;

import de.ddb.next.beans.User
import de.ddb.next.exception.AuthorizationException
import de.ddb.next.exception.BackendErrorException
import de.ddb.next.exception.ConflictException
import de.ddb.next.exception.ItemNotFoundException
import java.text.DateFormat
import java.text.SimpleDateFormat
import grails.converters.*
import org.codehaus.groovy.grails.web.json.*;

class UserController {
    private final static String SESSION_CONSUMER_MANAGER = "SESSION_CONSUMER_MANAGER_ATTRIBUTE"
    private final static String SESSION_OPENID_PROVIDER = "SESSION_OPENID_PROVIDER_ATTRIBUTE"

    def aasService
    def sessionService
    def configurationService
    def messageSource
    def bookmarksService
    def searchService

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
        User user = null
        if(!isUserLoggedIn()){
            def email = params.email
            def password = params.password

            user = aasService.login(email, password)

            if(user != null){
                loginStatus = LoginStatus.SUCCESS
                //TODO: check Newsletter-Subscription and set attribute newsletterSubscribed.

                sessionService.createNewSession()
                sessionService.setSessionAttributeIfAvailable(User.SESSION_USER, user)
            }else{
                loginStatus = LoginStatus.FAILURE
            }
        }

        if(loginStatus == LoginStatus.SUCCESS){
            if (user.getStatus().equals(UserStatus.PW_RESET_REQUESTED.toString())) {
                List<String> messages = []
                messages.add("ddbnext.User.PasswordReset_Change")
                render(view: "changepassword", model: [user: user, messages: messages])
            }
            else {
                redirect(controller: 'user', action: 'favorites')
            }
        }else{
            render(view: "login", model: ['loginStatus': loginStatus])
        }
    }

    def doLogout() {
        log.info "doLogout(): logout user "

        logoutUserFromSession()

        redirect(controller: 'index', action: 'index')

    }

    //Favorites page
    def favorites(){
        if(isUserLoggedIn()){
            def rows=20; //default
            if (params.rows){
                rows = params.rows.toInteger();
            }

            def String result = getFavorites()
            List items = JSON.parse(result) as List
            def totalResults= items.length();
            def allRes = retriveItemMD(items);
            def resultsItems
            if (totalResults <1){
                render(view: "favorites", model: [
                    resultsNumber: totalResults,
                ])
                return;
            }else{
                def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
                def urlQuery = searchService.convertQueryParametersToSearchParameters(params)
                urlQuery["offset"]=0;
                //Calculating results pagination (previous page, next page, first page, and last page)
                def page = ((params.offset.toInteger()/urlQuery["rows"].toInteger())+1).toString()
                def totalPages = (Math.ceil(items.size()/urlQuery["rows"].toInteger()).toInteger())
                def totalPagesFormatted = String.format(locale, "%,d", totalPages.toInteger())
                if (totalPages.toFloat()<page.toFloat()){
                   params.offset= (Math.ceil((items.size()-rows)/10)*10).toInteger()
                   page=totalPages
                }
                def resultsPaginatorOptions = searchService.buildPaginatorOptions(urlQuery)
                def numberOfResultsFormatted = String.format(locale, "%,d", allRes.size().toInteger())
            
                if (params.offset){
                    resultsItems=allRes.drop(params.offset.toInteger())
                    resultsItems=resultsItems.take( rows)                    
                }else{
                    params.offset=0;
                    resultsItems=allRes.take( rows)

                }



                def favList =[id:'8b26a230-cdf6-11e2-8b8b-0800200c9a66', name: 'Favorites', isPublic: false];
                def bookmarks =[bookmarksLists:favList, "bookmarksListSelectedID": '8b26a230-cdf6-11e2-8b8b-0800200c9a67']

                def all = []
                def temp = []
                resultsItems.each { searchItem->
                    temp = []
                    temp = searchItem
                    temp["creationDate"]=formatDate(items,searchItem.id);
                    all.add(temp)
                }
                sessionService.setSessionAttributeIfAvailable("results", allRes);
                if (request.method=="POST"){
                    try {
                        sendMail {
                            to params.email
                            subject "DDB Favorites / "+ getUserFromSession().getFirstnameAndLastnameOrNickname()
                            body( view:"_favoritesEmailBody",
                            model:[fromAddress:'develop@ddb.de',results: resultsItems["results"]["docs"]])
                        }
                        flash.message = "ddbnext.favorites_email_was_sent_succ"
                    } catch (Exception e) {
                        flash.email_error = "ddbnext.favorites_email_was_not_sent_succ"
                    }
                }


                render(view: "favorites", model: [
                    title: urlQuery["query"],
                    results: resultsItems,
                    isThumbnailFiltered: params.isThumbnailFiltered,
                    clearFilters: searchService.buildClearFilter(urlQuery, request.forwardURI),
                    correctedQuery:resultsItems["correctedQuery"],
                    viewType:  urlQuery["viewType"],
                    resultsPaginatorOptions: resultsPaginatorOptions,
                    page: page,
                    resultsNumber: totalResults,
                    firstPg:createFavoritesLinkNavigation(urlQuery["offset"],rows,""),
                    prevPg:createFavoritesLinkNavigation(params.offset.toInteger()-rows,rows,""),
                    nextPg:createFavoritesLinkNavigation(params.offset.toInteger()+rows,rows,""),
                    lastPg:createFavoritesLinkNavigation((Math.ceil((items.size()-rows)/10)*10).toInteger(),rows,""),
                    totalPages: totalPages,
                    //paginationURL: searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString),
                    numberOfResultsFormatted: numberOfResultsFormatted,
                    offset: params["offset"],
                ])
            }
        }
        else{
            redirect(controller:"user", action:"index")
        }
    }

    /**
     * Retrieve from Backend the Metadata for the items retrieved from the favorites list
     * @param items
     * @return
     */
    def private retriveItemMD(List items){
        def totalResults= items.length();
        def step = 20;
        def queryItems;
        def orQuery="";
        def allRes = []
        items.eachWithIndex() { it, i ->
            if ((i==0)||((i-1)%step==0)){
                orQuery=it.itemId;
            }else if (i%step==0){
                i=0
                orQuery=orQuery + " OR "+ it.itemId
                queryBackend(orQuery).each { item ->
                    allRes.add(item);
                }
                orQuery="";
            }else{
                orQuery+=" OR "+ it.itemId
            }
        };
        queryBackend(orQuery).each { item ->
            allRes.add(item);
        }
        return allRes;
    }

    def private queryBackend(String query){
        def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
        params.query = "id:("+query+")"
      
        def urlQuery = searchService.convertQueryParametersToSearchParameters(params)
        urlQuery["offset"]=0;
        def apiResponse = ApiConsumer.getJson(configurationService.getApisUrl() ,'/apis/search', false, urlQuery)
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(request)
        }
        def resultsItems = apiResponse.getResponse()
        return resultsItems["results"]["docs"]

    }
    def sendfavorites(){
        def results = sessionService.getSessionAttributeIfAvailable("results");
        render(view: "sendfavorites", model: [results: results])
    }

    def private String formatDate(items,String id) {
        def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
        def newDate;
        items.each { favItems ->
            if (id== favItems.itemId){
                String pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'";
                SimpleDateFormat oldFormat = new SimpleDateFormat(pattern,locale);
                SimpleDateFormat newFormat = new SimpleDateFormat("dd.MM.yyy HH:mm",locale);
                DateFormat df = DateFormat.getDateInstance(DateFormat.MEDIUM, locale);
                def Date javaDate = oldFormat.parse(favItems.creationDate);
                newDate = newFormat.format(javaDate)

            }
        }
        return newDate.toString()
    }

    def private createFavoritesLinkNavigation(offset,rows,order){
        return g.createLink(controller:'user', action: 'favorites',params:[offset:offset,rows:rows,order:order])
    }

    def getFavorites() {
        def User user = getUserFromSession()
        if (user != null) {
            def result = bookmarksService.findFavoritesByUserId(user.getId())
            return result as JSON
        }
        else {
            log.info "getFavorites returns " + response.SC_UNAUTHORIZED
            return null
        }
    }
    /* end favorites methods */

    def registration() {
        render(view: "registration", model: [])
    }

    def signup() {
        List<String> errors = []
        List<String> messages = []
        errors = Validations.validatorRegistration(params.username, params.fname, params.lname, params.email, params.passwd, params.conpasswd)
        if (errors == null || errors.isEmpty()) {
            def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
            def template = messageSource.getMessage("ddbnext.User.Create_Account_Mailtext", null, locale)
            JSONObject userjson = aasService.getPersonJson(params.username, null, null, params.lname, params.fname, null, null, params.email, params.passwd, configurationService.getCreateConfirmationLink(), template, null)
            try {
                aasService.createPerson(userjson)
                messages.add("ddbnext.User.Create_Success");
                render(view: "confirm" , model: [errors: errors, messages: messages])
            }
            catch (ConflictException e) {
                log.error "Conflict: user with given data already exists. username:" + params.username + ",email:" + params.email, e
                String conflictField = e.getMessage().replaceFirst(".*?'(.*?)'.*", "\$1")
                if (params.username.equals(conflictField)) {
                    errors.add("ddbnext.Conflict_User_Name");
                }
                else if (params.email.equals(conflictField)) {
                    errors.add("ddbnext.Conflict_User_Email");
                }
                else {
                    errors.add("ddbnext.Conflict_User_Common");
                }
                render(view: "registration" , model: [errors: errors, messages: messages, params: params])
            }
        }
        else {
            render(view: "registration" , model: [errors: errors, messages: messages, params: params])
        }
    }

    def passwordResetPage() {
        render(view: "resetpassword", model: [])
    }

    def passwordReset() {
        List<String> messages = []
        List<String> errors = []
        if (StringUtils.isBlank(params.username)) {
            errors.add("ddbnext.Error_Username_Empty")
        }
        if (errors == null || errors.isEmpty()) {
            try {
                def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
                def template = messageSource.getMessage("ddbnext.User.PasswordReset_Mailtext", null, locale)
                aasService.resetPassword(params.username, aasService.getResetPasswordJson(configurationService.getPasswordResetConfirmationLink(), template, null));
                messages.add("ddbnext.User.PasswordReset_Success");
            }
            catch (ItemNotFoundException e) {
                log.error "NotFound: a user with given name " + params.username + " was not found", e
                errors.add("ddbnext.Error_Username_Notfound");
            }
        }
        render(view: "resetpassword" , model: [messages: messages, errors: errors, params: params])
    }

    def profile() {
        if(isUserLoggedIn()){
            User user = getUserFromSession()
            if (!user.isConsistent()) {
                throw new BackendErrorException("user-attributes are not consistent")
            }
            render(view: "profile", model: [favoritesCount: "0", user: user])
        }
        else{
            redirect(controller:"index")
        }
    }

    def passwordChangePage() {
        if(isUserLoggedIn()){
            User user = getUserFromSession()
            if (user.isOpenIdUser()) {
                //password-change is only for aas-users
                redirect(controller:"index")
            }
            if (!user.isConsistent()) {
                throw new BackendErrorException("user-attributes are not consistent")
            }
            render(view: "changepassword", model: [user: user])
        }
        else{
            redirect(controller:"index")
        }
    }

    def passwordChange() {
        if (isUserLoggedIn()) {
            List<String> errors = []
            List<String> messages = []
            User user = getUserFromSession().clone()
            if (user.isOpenIdUser()) {
                //password-change is only for aas-users
                redirect(controller:"index")
            }
            if (user?.getPassword() == null) {
                forward controller: "error", action: "serverError"
            }
            errors = Validations.validatorPasswordChange(user?.getPassword(), params.oldpassword, params.newpassword, params.confnewpassword)
            if (errors == null || errors.isEmpty()) {
                //change password in AAS
                aasService.changePassword(user?.getId(), aasService.getChangePasswordJson(params.newpassword))
                messages.add("ddbnext.User.Password_Change_Success")
                //adapt user-attributes in session
                user.setPassword(params.newpassword)
                sessionService.setSessionAttributeIfAvailable(User.SESSION_USER, user)
                render(view: "changepassword", model: [user: user, errors: errors, messages: messages])
            }
            else {
                render(view: "changepassword", model: [user: user, errors: errors, messages: messages, oldpassword: params.oldpassword, newpassword: params.newpassword, confnewpassword: params.confnewpassword])
            }
        }
        else{
            redirect(controller:"index")
        }
    }

    def saveProfile() {
        if (isUserLoggedIn()) {
            List<String> errors = []
            List<String> messages = []
            boolean eMailDifference = false
            boolean profileDifference = false
            boolean newsletterDifference = false
            User user = getUserFromSession().clone()

            if (!user.isConsistent()) {
                throw new BackendErrorException("user-attributes are not consistent")
            }
            if (!user.getOpenIdUser()) {
                if (StringUtils.isBlank(params.username) || params.username.length() < 2) {
                    errors.add("ddbnext.Error_Username_Empty")
                }
                if (StringUtils.isBlank(params.email)) {
                    errors.add("ddbnext.Error_Email_Empty")
                }
                if (!Validations.validatorEmail(params.email)) {
                    errors.add("ddbnext.Error_Valid_Email_Address");
                }
            }
            if (errors == null || errors.isEmpty()) {
                if (!user.getOpenIdUser()) {
                    if (Validations.isDifferent(user.getFirstname(), params.fname)
                    || Validations.isDifferent(user.getLastname(), params.lname)
                    || Validations.isDifferent(user.getUsername(), params.username)) {
                        profileDifference = true;
                    }
                    if (Validations.isDifferent(user.getEmail(), params.email)) {
                        eMailDifference = true;
                    }
                }
                if ((params.newsletter && !user.newsletterSubscribed)
                || (!params.newsletter && user.newsletterSubscribed)) {
                    newsletterDifference = true
                }

                if (!profileDifference && !eMailDifference && !newsletterDifference) {
                    errors.add("ddbnext.User.Profile_NoValuesChanged")
                }

                if (profileDifference) {
                    //update user in aas
                    JSONObject aasUser = aasService.getPerson(user.getId())
                    aasUser.put(AasService.NICKNAME_FIELD, params.username)
                    aasUser.put(AasService.FIRSTNAME_FIELD, params.fname)
                    aasUser.put(AasService.LASTNAME_FIELD, params.lname)
                    try {
                        user.setUsername(params.username)
                        user.setFirstname(params.fname)
                        user.setLastname(params.lname)
                        aasService.updatePerson(user.getId(), aasUser);
                        messages.add("ddbnext.User.Profile_Update_Success")
                    }
                    catch (ConflictException e) {
                        log.error "Conflict: user with given data already exists. username:" + params.username, e
                        errors.add("ddbnext.Conflict_User_Name");
                    }
                }
                if (eMailDifference && (errors == null || errors.isEmpty())) {
                    try {
                        //update email in aas
                        def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
                        def template = messageSource.getMessage("ddbnext.User.Email_Update_Mailtext", null, locale)
                        aasService.updateEmail(user.getId(), aasService.getUpdateEmailJson(params.email, configurationService.getEmailUpdateConfirmationLink(), template, null));
                        messages.add("ddbnext.User.Email_Update_Success")
                    }
                    catch (ConflictException e) {
                        user.setEmail(params.email)
                        log.error "Conflict: user with given data already exists. email:" + params.email, e
                        errors.add("ddbnext.Conflict_User_Email");
                    }
                }
                if (newsletterDifference && (errors == null || errors.isEmpty())) {
                    if (params.newsletter) {
                        user.setNewsletterSubscribed(true);
                    }
                    else {
                        user.setNewsletterSubscribed(false);
                    }
                    //TODO: change Newsletter Subscription
                    try {
                        //DO change
                        messages.add("ddbnext.User.Newsletter_Update_Success")
                    }
                    catch (Exception e) {
                        //log.error "", e
                        //errors.add("")
                    }
                }
                if (errors == null || errors.isEmpty()) {
                    //adapt user-attributes in session
                    sessionService.setSessionAttributeIfAvailable(User.SESSION_USER, user)
                }
            }
            render(view: "profile", model: [favoritesCount: "0", user: user, errors: errors, messages: messages])
        }
        else{
            redirect(controller:"index")
        }
    }

    def delete() {
        if (isUserLoggedIn()) {
            List<String> errors = []
            List<String> messages = []
            User user = getUserFromSession().clone()
            if (!user.isConsistent()) {
                throw new BackendErrorException("user-attributes are not consistent")
            }
            if (user.isOpenIdUser()) {
                //password-change is only for aas-users
                redirect(controller:"index")
            }
            try {
                aasService.deletePerson(user.id)
            }
            catch (AuthorizationException e) {
                forward controller: "error", action: "auth"
            }
            logoutUserFromSession()

            messages.add("ddbnext.User.Delete_Confirm")

            render(view: "confirm", model: [errors: errors, messages: messages])
        }
    }

    def confirm() {
        if (StringUtils.isBlank(params.type)) {
            forward controller: "error", action: "serverError"
        }
        List<String> messages = [];
        List<String> errors = [];
        def jsonuser
        try {
            jsonuser = aasService.confirm(params.id, params.token);
            if (params.type.equals("emailupdate")) {
                messages.add("ddbnext.User.Email_Confirm_Success");
            }
            else if (params.type.equals("passwordreset")) {
                messages.add("ddbnext.User.Pwreset_Confirm_Success");
            }
            else if (params.type.equals("create")) {
                messages.add("ddbnext.User.Create_Confirm_Success");
            }
            // set changed attributes in user-object in session
            if (isUserLoggedIn()) {
                User user = getUserFromSession().clone()
                if (!user.isConsistent() || StringUtils.isBlank(jsonuser.getString(AasService.EMAIL_FIELD))) {
                    throw new BackendErrorException("user-attributes are not consistent")
                }
                user.setEmail(jsonuser.getString(AasService.EMAIL_FIELD))
                if (jsonuser.containsKey(AasService.PASSWORD_FIELD)) {
                    user.setPassword(jsonuser.getString(AasService.PASSWORD_FIELD))
                }
                sessionService.setSessionAttributeIfAvailable(User.SESSION_USER, user)
            }
        }
        catch (ItemNotFoundException e) {
            log.error "NotFound: confirmation does not exist. uid:" + params.id + ", token:" + params.token, e
            errors.add("ddbnext.Error.Confirmation_Not_Found")
        }
        render(view: "confirm", model: [errors: errors, messages: messages])
    }

    def requestOpenIdLogin() {
        def provider = params.provider

        String discoveryUrl = ""

        FetchRequest fetch = FetchRequest.createFetchRequest()

        if(provider == SupportedOpenIdProviders.GOOGLE.toString()){
            discoveryUrl = "https://www.google.com/accounts/o8/id"
            fetch.addAttribute("Email", "http://schema.openid.net/contact/email", true)
            fetch.addAttribute("FirstName", "http://schema.openid.net/namePerson/first", true)
            fetch.addAttribute("LastName", "http://schema.openid.net/namePerson/last", true)
            fetch.setCount("openid.ext1.value.Email", 1)
        }else if(provider == SupportedOpenIdProviders.YAHOO.toString()){
            discoveryUrl = "https://me.yahoo.com"
            fetch.addAttribute("Email", "http://axschema.org/contact/email", true)
            fetch.addAttribute("Fullname", "http://axschema.org/namePerson", true)
        }else{
            render(view: "login", model: [
                'loginStatus': LoginStatus.AUTH_PROVIDER_UNKNOWN]
            )
            return
        }

        setProxy()

        log.info "requestOpenIdLogin(): discoveryUrl="+discoveryUrl
        ConsumerManager manager = new ConsumerManager()

        sessionService.createNewSession()
        sessionService.setSessionAttributeIfAvailable(SESSION_OPENID_PROVIDER, provider)
        sessionService.setSessionAttributeIfAvailable(SESSION_CONSUMER_MANAGER, manager)

        String returnURL = grailsLinkGenerator.serverBaseURL + "/login/doOpenIdLogin"
        List discoveries = manager.discover(discoveryUrl)
        DiscoveryInformation discovered = manager.associate(discoveries)
        AuthRequest authReq = manager.authenticate(discovered, returnURL)
        authReq.addExtension(fetch)

        // Leave DDB for login on OpenID-provider
        redirect(url: authReq.getDestinationUrl(true))

    }

    def doOpenIdLogin() {
        def loginStatus = LoginStatus.LOGGED_OUT

        log.info "doOpenIdLogin(): got OpenID login request"

        //ConsumerManager manager = getSessionObject(false)?.getAttribute(SESSION_CONSUMER_MANAGER)
        ConsumerManager manager = sessionService.getSessionAttributeIfAvailable(SESSION_CONSUMER_MANAGER)
        if(manager){
            //def provider = getSessionObject(false)?.getAttribute(SESSION_OPENID_PROVIDER)
            def provider = sessionService.getSessionAttributeIfAvailable(SESSION_OPENID_PROVIDER)

            ParameterList openidResp = new ParameterList(request.getParameterMap())
            //DiscoveryInformation discovered = (DiscoveryInformation) getSessionObject(false)?.getAttribute("discovered");
            DiscoveryInformation discovered = (DiscoveryInformation) sessionService.getSessionAttributeIfAvailable("discovered")
            String returnURL = grailsLinkGenerator.serverBaseURL + "/login/doOpenIdLogin"
            String receivingURL =  returnURL + "?" + request.getQueryString()
            VerificationResult verification = manager.verify(receivingURL.toString(), openidResp, discovered)
            Identifier verified = verification.getVerifiedId()

            if (verified != null) {
                log.info "doOpenIdLogin(): success verification"

                def username = null
                def firstName = null
                def lastName = null
                def email = null
                def identifier = null

                if(provider == SupportedOpenIdProviders.GOOGLE.toString()){
                    firstName = params["openid.ext1.value.FirstName"]
                    lastName = params["openid.ext1.value.LastName"]
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
                //                getSessionObject(false)?.invalidate()
                //                HttpSession newSession = getSessionObject(true)
                sessionService.destroySession()
                HttpSession newSession = sessionService.createNewSession()

                User user = new User()
                user.setId(identifier.encodeAsMD5())
                user.setEmail(email)
                user.setUsername(username)
                user.setFirstname(firstName)
                user.setLastname(lastName)
                user.setPassword(null)
                user.setOpenIdUser(true)

                //TODO: check Newsletter-Subscription and set attribute newsletterSubscribed.

                sessionService.setSessionAttribute(newSession, User.SESSION_USER, user)

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

            ProxyProperties proxyProps = new ProxyProperties()
            proxyProps.setProxyHostName(proxyHost)
            proxyProps.setProxyPort(proxyPort)
            HttpClientFactory.setProxyProperties(proxyProps)
        }

    }

    private boolean isUserLoggedIn() {
        return sessionService.getSessionAttributeIfAvailable(User.SESSION_USER)
    }

    private User getUserFromSession() {
        return sessionService.getSessionAttributeIfAvailable(User.SESSION_USER)
    }

    private boolean logoutUserFromSession() {
        sessionService.removeSessionAttributeIfAvailable(User.SESSION_USER)
        sessionService.destroySession()
    }


}
