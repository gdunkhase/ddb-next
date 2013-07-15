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

import static groovyx.net.http.ContentType.*
import de.ddb.next.beans.User
import de.ddb.next.exception.BackendErrorException
import groovy.json.*
import groovyx.net.http.Method

import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.web.json.JSONObject
import org.codehaus.groovy.grails.web.util.WebUtils

/**
 * Set of Methods that encapsulate REST-calls to the NewsletterService
 *
 * @author chh
 *
 */

class NewsletterService {

    def configurationService
    def transactional = false

    private static final def SUBSCRIPTION_PATH ='/newsletter/subscription/'

    def addSubscriber(User user) {
        def body = [
            email: user.email
        ]

        def apiResponse = ApiConsumer.postJson(configurationService.getNewsletterUrl(),
                "${SUBSCRIPTION_PATH}${user.id}", false, new JSONObject(body))
        if(!apiResponse.isOk()){
            log.error "fail to add newsletter subscriber ${user.toString()}"
            apiResponse.throwException(WebUtils.retrieveGrailsWebRequest().getCurrentRequest())
        }

        log.info "successfully add newsletter subscriber ${user.toString()}"
    }

    def removeSubscriber(User user) {
        def apiResponse = ApiConsumer.delete(configurationService.getNewsletterUrl(), "${SUBSCRIPTION_PATH}${user.id}")
        if(!apiResponse.isOk()){
            log.error "fail to add remove subscriber ${user.toString()}"
            apiResponse.throwException(WebUtils.retrieveGrailsWebRequest().getCurrentRequest())
        }
        log.info "successfully remove subscriber ${user.toString()}"
    }

    def isSubscriber(User user) {
        def apiResponse = ApiConsumer.getJson(configurationService.getNewsletterUrl(), "${SUBSCRIPTION_PATH}${user.id}")
        def statusCode = apiResponse.status != ApiResponse.HttpStatus.HTTP_404

        // when 200 return true
        // when 404 return false
        // otherwise throw exeption
        if(!apiResponse.isOk()){
            if(apiResponse.status == ApiResponse.HttpStatus.HTTP_404) {
                log.info "The user ${user.toString()} is _not_ a subscriber"
                return false
            }
            apiResponse.throwException(WebUtils.retrieveGrailsWebRequest().getCurrentRequest())
        }

        log.info "The user ${user.toString()} is a subscriber"
        return true

    }
}
