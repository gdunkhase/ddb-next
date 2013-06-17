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
 * Set of Methods that encapsulate REST-calls to the BookmarksService
 * 
 * @author mih
 *
 */

class BookmarksService {

    def configurationService
    def transactional = false

}
