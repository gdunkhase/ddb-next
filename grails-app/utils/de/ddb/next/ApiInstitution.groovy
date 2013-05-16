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

import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.web.json.JSONArray;

import groovy.json.JsonLexer;
import groovy.json.JsonSlurper;
import groovy.json.JsonToken;
import groovyx.net.http.ContentType;
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class ApiInstitution {
   
   private static final log = LogFactory.getLog(this)
   
    def getInstitutionViewByItemId(String id, String url) {
        log.debug("get insitution view by item id: ${id}")
        def uriPath = "/access/" + id + "/components/view"
        return ApiConsumer.getTextAsXml(url, uriPath, null);
    }
    
    def getChildrenOfInstitutionByItemId(String id, String url) {
        log.debug("get chlildren of institution by item id: ${id}")
        def jsonResult;
        def uriPath = "/hierarchy/" + id + "/children"
        jsonResult = ApiConsumer.getTextAsJson(url, uriPath, null)
        return jsonResult;
    }
    
    def getParentsOfInstitutionByItemId(String id, String url) {
        log.debug("get parent of institution by item id: ${id}")
        def jsonResult;
        def uriPath = "/hierarchy/" + id + "/parent"
        jsonResult = ApiConsumer.getTextAsJson(url, uriPath, null)
        return jsonResult;
    }
    
    def getFacetValuesX(String provName, String url) {
        log.debug("get facets values for: ${provName}")
        def jsonResult;
        int shortLength = 50;
        String shortQuery = (provName.length() > shortLength ? provName.substring(0, shortLength) : provName);
        def uriPath = "/search/facets/provider_fct"
        def query = ['query':"${shortQuery}" ]
        jsonResult = ApiConsumer.getTextAsJson(url, uriPath, query)
        return jsonResult;
    }
    
    def getFacetValues(String provName, String url) {
        log.debug("get facets values for: ${provName}")
        def jsonResult;
        def uriPath = "/search"
        def query = ['query':"*","facet":"provider_fct", "provider_fct":"${provName}","rows":"0" ]
        log.debug("query = '" + query + "'");
        jsonResult = ApiConsumer.getTextAsJson(url, uriPath, query);
        log.debug("jsonResult = " + jsonResult.toString());
        log.debug("jsonResult.numberOfResults = " + jsonResult.numberOfResults);
        log.debug("jsonResult.facets[5] = " + (jsonResult.facets.size() >= 6 ? jsonResult.facets[5] : "null"));
        return jsonResult.facets[5];
    }

    
}
