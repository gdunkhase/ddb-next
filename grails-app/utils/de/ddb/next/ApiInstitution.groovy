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
            log.println("get insitution view by item id: ${id}")
            def uriPath = "/access/" + id + "/components/view"
            return ApiConsumer.getTextAsXml(url, uriPath, null);
        }
        
        def getChildrenOfInstitutionByItemId(String id, String url) {
            log.println("get chlildren of institution by item id: ${id}")
            def jsonResult;
            def uriPath = "/hierarchy/" + id + "/children"
            jsonResult = ApiConsumer.getTextAsJson(url, uriPath, null)
            return jsonResult;
        }
        
        def getParentsOfInstitutionByItemId(String id, String url) {
            log.println("get parent of institution by item id: ${id}")
            def jsonResult;
            def uriPath = "/hierarchy/" + id + "/parent"
            jsonResult = ApiConsumer.getTextAsJson(url, uriPath, null)
            return jsonResult;
        }
        
        def getFacetValues(String provName, String url) {
            log.println("get facets values for: ${provName}")
            def jsonResult;
            def uriPath = "/search/facets/provider_fct"
            def query = ['query':"${provName}" ]
            jsonResult = ApiConsumer.getTextAsJson(url, uriPath, query)
            return jsonResult;
        }
        
}
