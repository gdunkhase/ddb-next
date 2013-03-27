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

/**
 * Taglib that parses the body of the tag for further tags and removes them. 
 * This is particularly useful, if the body of the tag is dynamically rendered from backend data but you want to
 * ensure there is no html code contained. 
 * @author hla
 */
class MiscellaneousTagLib {

    /**
     * This taglib provides all the general functions that should be useful inside the whole application
     */
    def removeTags = { attrs, body ->
        def inputString = body()
        def outputString = ""
        if(inputString){
            outputString = inputString.replaceAll(/<!--.*?-->/, '').replaceAll(/<.*?>/, '').replaceAll("&", "&amp;")
        }
        out << outputString
    }
    
    def localizeNumbers = { attrs, body ->
        def inputString = body()
        def outputString = ""
        if(inputString){
            outputString = String.format("%,d", inputString.toInteger())
        }
        out << outputString
    }
}
