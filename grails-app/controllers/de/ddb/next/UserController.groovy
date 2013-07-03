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

import de.ddb.next.beans.User
import de.ddb.next.exception.AuthorizationException
import de.ddb.next.exception.BackendErrorException
import de.ddb.next.exception.ConflictException
import de.ddb.next.exception.ItemNotFoundException

class UserController {
    private final static String SESSION_CONSUMER_MANAGER = "SESSION_CONSUMER_MANAGER_ATTRIBUTE"
    private final static String SESSION_OPENID_PROVIDER = "SESSION_OPENID_PROVIDER_ATTRIBUTE"

    def aasService
    def sessionService
    def configurationService

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
        if(isUserInSession() || true){
            //2. Get the items from the backend
            def rows=20; //default
            if (params.rows){
                rows = params.rows.toInteger();
            }
            def items = ["TRTRGC6OFUIM2XDY2GUO47AHHOYQOL7B",
                "7OXMALA3A37GLV3QOAE5HEFUDW5ZHVIJ",
                "7IQZX2CP46KWXBF4BCBT6K7J65LZHTBV",
                "SJDLXCQDM7NUQVWAD6LN3XVYQYHWRMUX",
                "VI5VNJQVU4DFNRUPRLX64X677EDX5AY2",
                "V2MGDJLUEBQOMJUZKEGATJTMIW7G27FF",
                "NLQS2WPWPNRWQ5ARBYJU6ABPLQX6EOSA",
                "3JAANL4K5TG2E6ANW35F2IS32M4IPYLP",
                "SC5JE75OBAAUQE7MTCNUAIS7CDWECUUM",
                "F635HM6OBKLKDRA4EFCMMNHS5JHLPPOM",
                "SAHJO7SIH7JKPQTWGR7WSORUXS5HC64K",
                "4T2WWGUIZFVXIQQ4QDKN37KKOUYPGRGQ",
                "GXXKJ3MU6ZLZUKTHW5F5GZOCVNJE32NP",
                "KHGNYHJ5KKQGDC54DKGGUJTQSXWUBVQ5",
                "ZG2L7DT7RYI6BHKXESBJMXER6T2MMXFG",
                "V6VQXHVGXSUTWDNS4QVD2FRCGRECPNLB",
                "6YM2CTWGE7XGZJWSE4I3YGE7NOX454X5",
                "K42KLJO2UKSOV3DZW25N7IROQZLWUR3F",
                "S3K75RXMGPFQ4QTPUATISCGPL23BPBMY",
                "ERGC2QQLALIVEQVDHTDLTXL462TXQS6V",
                "YP4AJQ43346W423C5RZ57MOJWBOYTEWH",
                "E5TMWZVZBBVSSIH3BLWKMHXZZGE6PL3Q",
                "AD5SHFJJAPQODAXDVQBT5CVEOWMPQN2G",
                "4UM4NHFZCP35O7JALCWTBBIS4QAGJZPM",
                "6TQTOHJNU2A2TJUXNE22KNB7THQE2EMF",
                "52UQT3XQWEOYYPLJXAMVS33BZSD67RYV",
                "U3FC6TS7Y2J73SNYFXDCMWQL45W5LHEE",
                "CTDXWJJJX63B2TYB5NKFJ3BV7VY5CDSA",
                "T4IBNVFSZXOJUTN7BBEVQOX2AJQ664XK",
                "VL3D2TRKWJXCGARZQGLDJBIV7MYDGH4T",
                "E6USCXLWO2AA6ORIOZ3JNF3Z4EICJMOL",
                "ZYADPLVNYTG3PFVJQGEW7N4RB6M5A572",
                "2F5KR7L5I4ZOIU5QLZKXTWISVPDFERJF",
                "JJ2XBLEARVCQMSK22KDPOFVLTEYJ7PE4",
                "GXJ7EYSMEZUTHITRPSFHZBYPIPIYGLER",
                "UI3E3QC4AYOOUM7PA6LU5Z5XXQRN2UTA",
                "MPAMCPXOBHPZQ2254U5ZSTWAX5BGOKQH",
                "TDPRZRWRCLPCGMNCXWNOQ2US4YT43VPP",
                "P6THODJUJU3JLNBQ2AVNXS4ZXD7FTSVX",
                "J5AMTTBIL3DVS2VUDHR7RLT4PT3IBNLC",
                "KH32SMB3J7COV3YBCPXOGRDT5UFJDRWU",
                "OFKUJEHYSLWMBCM3DZ4RKP43MKSOPGUD",
                "6TIXPVDT2KO2HZAUKI3KBC3JNQDPXRF7",
                "WOHXUS6YZRYRU7JLH5H6DSYXKGPHALB3",
                "DN2ZLBEHRMIBALJPAKJCYNPFFJX56U4A",
                "BROZH4ECXV4CBQS5IXU62KVS4MSX575F",
                "E2NR45AHMXCSR7XIVQZQW3EHVCVSLGJJ",
                "IRKXPGCBOIHL245BZYA4V74ZPRGAOBKS",
                "GXQKENT3VRM7ZVPIEXL7EBGNETGARKTL",
                "IE3CG3JZICXVY5DD4ADTCLOOCS5OOG7T",
                "OIUEB3SJ56BLB6EGR2DKCFO65IJRSOCV",
                "FQGMUU5VFW2D4YG2RIJGSVXSEVQ4F3BQ",
                "7B2MYHFAOQCBQ4FDXXQKFB6IRNKOXTR2",
                "BOBHYT3TPDFXU6WAIQ6OAXJKFQ3NBDO4",
                "EJ3AQ4IXBFUDKPVLLSKPAOT6NYBGJDDQ",
                "SABB7RTZRKRABUFXIFZWO7YNNJV2TOM4",
                "MIHHDCM6ZB5LGMGX66FE2MOCCLUFSCFH",
                "U64CCGZADVDZNJ5JW7KB4EMYHWPRHUJJ",
                "6UMVWEB5UNKGMQCLL3FTV7WYEFV5NW2A",
                "ANJHPKSTRGPY3WVW7T2DVAMYC2HLWFF3",
                "GOQUXIUABYNVZRGBDET43FORCOU4JS5K",
                "TU635FC4OPZTHPXXIQ3FTMQEJ6NJRPFD",
                "73GPKEUBFYTTRS2TGJCZCFQ6HQPSCSP6",
                "A7GXCZF6CBIQ5GOZ63A2VKBEWK2Z46XG",
                "VHS6UBSAIUNHYLEMEMX7RKZRZWQ75DOS",
                "7NCYC3T27DMV4EWGNHMUCEQZUX47ORIA",
                "ZEBQN3PGNBUC3D3IV4OQRRSUFKBFC22K",
                "X64H5A35SDHV7HHO75CD4D4B5MKN3GZ4",
                "EAN3QF5J5FE6DEDXYS2MYOFZOXMUUJJU",
                "LEYZML5KBE4W6UWVNMV7ZRELOXPKDDIB",
                "I5TKAVKCZIS5LFIGBIV2N356QPK5AS4C",
                "3HPHGOZIL2XQSL7GEPLX4PUIPPNGUPZ2",
                "OAO6BBNAV7DNVJIN2KSP3S2G7UKGERWS",
                "LW2D3GECTL67MSHMBRGNYORC6X5TOUDM",
                "AH3W53Y7B6J5LMHN6H6IXSXLNML2233Y",
                "ACFTKAHGE4EBPOAASP4N2D5CKW74LO4I",
                "SVQXLISGSQCRBEQNUMTCMQSKN7BC7IKZ",
                "WQ6BSXPMMODNHGILLOB3D7CYQDA7OROO",
                "3KH3BK7HN25CPTFUXUVHDMZCAHZ6O6FX",
                "5DRGO2BEU6HFUKSXQM6N6WJNUIAY7VPJ",
                "BK7RS3BUA2SUW4EBVYTJA3YATVF3MIUL",
                "IUD2LT7BMP42GBFR5J2GO6K6UVMCT5WF",
                "UMPYNSQJ57UBMQWXBGQEUO2XOJ5XFADP",
                "LPRBN7LTABFPEKQ36XO2AC6GGF3AHV2R",
                "4TI3CWLJANJN5BERCN6YBSLUZZ64KYH7",
                "ERPWNFB7SIOOCAXOHKQNTFWWSZFFBDJP",
                "NH32GJHT7Z4XTSZ7DFDAVWANPPVNDDIC",
                "2IEJWLZBB2Z746ABZO2IKPCTRR2Y5LWE",
                "FSAXUMVNEZNSYYOWT2I2WUWSLGX3MP2T",
                "GZBE7LJIFKLAKG6ZPLJDZ5Z4ZZX6MOLN",
                "Q2PPCJUYGCODGM3CR4H6QT7CZGQQECH4",
                "37G5YEVNECD5BS22BVDCYQHPCUK6OOP6",
                "AF7OFZXCKUODX5PUNEROT5SSZFNCHB2T",
                "7HXKJSYS5G7JVD6MSZINAIMUKAYB7OE4",
                "QZO5TOCKKJ6WTPNCVKBTO5ANWE62YUEK",
                "Y6D4ZTAUI6YM5SYHWQ7KQXB4Q7JBVZQN",
                "P6G5FHXE4GF6EK4HTAZ5TC63GNNPNJX2",
                "3GWC3DTPQ2MEU646KILPPVONYICAK6HC",
                "KA2XRBKUDTTQTWZNXU6LIU5QUDEB6I4A",
            ];
            //3. Render the results in the page
            def queryItems;
            if (params.offset){
                println "here it is" + params.offset;
                queryItems=items.drop(params.offset.toInteger())
                println "###############" + items
            }else{
                params.offset=0;
                queryItems=items.take(20)
            }
            
            
            println "This is the list" + queryItems;
            
            def orQuery=queryItems[0];
            queryItems.tail().each() { orQuery+=" OR "+ it };
            params.query = "id:("+orQuery+")"


            def locale = SupportedLocales.getBestMatchingLocale(RequestContextUtils.getLocale(request))
            def urlQuery = searchService.convertQueryParametersToSearchParameters(params)
            urlQuery["offset"]=0;
            def apiResponse = ApiConsumer.getJson(configurationService.getApisUrl() ,'/apis/search', false, urlQuery)
            if(!apiResponse.isOk()){
                log.error "Json: Json file was not found"
                apiResponse.throwException(request)
            }
            def resultsItems = apiResponse.getResponse()

            //Calculating results pagination (previous page, next page, first page, and last page)
            def page = ((params.offset.toInteger()/urlQuery["rows"].toInteger())+1).toString()

            def totalPages = (Math.ceil(items.size()/urlQuery["rows"].toInteger()).toInteger())
            def totalPagesFormatted = String.format(locale, "%,d", totalPages.toInteger())

            def resultsPaginatorOptions = searchService.buildPaginatorOptions(urlQuery)
            def numberOfResultsFormatted = String.format(locale, "%,d", resultsItems.numberOfResults.toInteger())

            def queryString = request.getQueryString()


            println "totalPages "+ totalPages;
            println "resultsPaginatorOptions"+ resultsPaginatorOptions;
            println "paginationUrl" + searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString)

            def favList =[id:'8b26a230-cdf6-11e2-8b8b-0800200c9a66', name: 'Favorites', isPublic: false];
            def bookmarks =[bookmarksLists:favList, "bookmarksListSelectedID": '8b26a230-cdf6-11e2-8b8b-0800200c9a67']

            render(view: "favorites", model: [
                title: urlQuery["query"],
                results: resultsItems["results"]["docs"],
                isThumbnailFiltered: params.isThumbnailFiltered,
                clearFilters: searchService.buildClearFilter(urlQuery, request.forwardURI),
                correctedQuery:resultsItems["correctedQuery"],
                viewType:  urlQuery["viewType"],
                resultsPaginatorOptions: resultsPaginatorOptions,
                page: page,
                resultsNumber: items.size(),
                firstPg:createFavoritesLinkNavigation(favList.id,urlQuery["offset"],urlQuery["rows"],"sempty"),
                prevPg:createFavoritesLinkNavigation(favList.id,params.offset.toInteger()-rows,urlQuery["rows"],"sempty"),
                nextPg:createFavoritesLinkNavigation(bookmarks["bookmarksLists"]["id"],params.offset.toInteger()+rows,urlQuery["rows"],"sempty"),
                lastPg:createFavoritesLinkNavigation(bookmarks["bookmarksLists"]["id"],(Math.ceil((items.size()-rows)/10)*10).toInteger(),urlQuery["rows"],"sempty"),
                totalPages: totalPages,
                paginationURL: searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString),
                numberOfResultsFormatted: numberOfResultsFormatted,
                offset: params["offset"],
            ])

        }
        else{
            redirect(controller:"index")
        }

    }


    def private createFavoritesLinkNavigation(bid,offset,rows,order){
        return g.createLink(controller:'user', action: 'favorites',params:['fid':bid,offset:offset,rows:rows,order:order])
    }

    def registration() {
        render(view: "registration", model: [])
    }

    def signup() {
        List<String> errors = []
        List<String> messages = []
        errors = Validations.validatorRegistration(params.username, params.fname, params.lname, params.email, params.passwd, params.conpasswd)
        if (errors == null || errors.isEmpty()) {
            JSONObject userjson = aasService.getPersonJson(params.username, null, null, params.lname, params.fname, null, null, params.email, params.passwd, configurationService.getCreateConfirmationLink(), null, null)
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
                aasService.resetPassword(params.username, aasService.getResetPasswordJson(configurationService.getPasswordResetConfirmationLink(), null, null));
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
            render(view: "profile", model: [favoritesCount: "no count yet", user: user])
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
                        aasService.updateEmail(user.getId(), aasService.getUpdateEmailJson(params.email, configurationService.getEmailUpdateConfirmationLink(), null, null));
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
            render(view: "profile", model: [favoritesCount: "no count yet", user: user, errors: errors, messages: messages])
        }
        else{
            redirect(controller:"index")
        }
    }

    def delete() {
        if (isUserLoggedIn()) {
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
            doLogout()
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
                user.setFirstname(lastName)
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
