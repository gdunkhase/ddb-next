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
import groovy.json.*
import groovyx.net.http.Method

import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.web.json.JSONObject
import org.codehaus.groovy.grails.web.util.WebUtils

/**
 * Set of Methods that encapsulate REST-calls to the AASWebService
 * 
 * @author mih
 *
 */

class AasService {

    def configurationService
    def transactional = false

    private static final log = LogFactory.getLog(this)

    private static final String PERSON_URI = "/aas/persons/"

    /**
     * 
     * @param id id of person to retrieve
     * @return person as JSON object
     */
    public User login(String id, String password) {
        String auth = id + ":" + password;
        def apiResponse = ApiConsumer.getJson(configurationService.getAasUrl(), PERSON_URI + id, false, [:], ['Authorization':'Basic ' + auth.bytes.encodeBase64().toString()])
        if(apiResponse.isOk()){
            User user = new User(apiResponse.getResponse())
            user.setPassword(password)
            return user
        }
        else {
            return null
        }
    }

    /**
     * 
     * @param id id of person to retrieve
     * @return person as JSON object
     */
    public JSONObject getPerson(String id) {
        return request(PERSON_URI + id)
    }

    /**
     * 
     * @param id id of person to retrieve
     * @return person as JSON object
     */
    public JSONObject createPerson(String json) {
        return request(PERSON_URI, Method.POST, json)
    }

    /**
     * 
     * @param id id of person to update
     * @param user user-object
     * @return person as JSON object
     */
    public JSONObject updatePerson(String id, String json) {
        return request(PERSON_URI + id, Method.PUT, json)
    }

    /**
     * request AAS via ApiConsumer.
     * 
     * @param url url of request
     * @return JSON-response
     */
    private JSONObject request(String url, Method method = Method.GET, String postParameter = null) {
        def apiResponse
        if (method.equals(Method.GET)) {
            apiResponse = ApiConsumer.getJson(configurationService.getAasUrl(), url, true)
        }
        else if (method.equals(Method.POST)) {
            apiResponse = ApiConsumer.postJson(configurationService.getAasUrl(), url, true)
        }
        else if (method.equals(Method.PUT)) {
            apiResponse = ApiConsumer.putJson(configurationService.getAasUrl(), url, true)
        }
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(WebUtils.retrieveGrailsWebRequest().getCurrentRequest())
        }
        return apiResponse.getResponse()
    }
}
