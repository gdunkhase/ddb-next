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

class BackendVersionTagLib {

    def backendVersion = { attrs, body ->
        def apiResponse = ApiConsumer1.getText(grailsApplication.config.ddb.backend.url, "/version")
        if(!apiResponse.isOk()){
            log.error "Text: text file was not found"
            throw apiResponse.getException()
        }
        out << apiResponse.getResponse()
    }
}
