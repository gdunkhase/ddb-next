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
            def dataXML = null;
            def uriPath = "/access/" + id + "/components/view"
            //dataXML = ApiConsumer.getTextAsXml(url, uriPath, null)
            try {
                def http = new HTTPBuilder(url)
                http.request(Method.GET, ContentType.TEXT) { req ->
                    uri.path = uriPath
                    headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
                    headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    response.success = { resp, reader ->
                       assert resp.statusLine.statusCode == 200
                       log.println("Response status: ${resp.statusLine}")
                       log.println("Content-Type: ${resp.headers.'Content-Type'}")
                       //String dataString = '<?xml version="1.0" encoding="UTF-8"?><root>' + reader.readLines().join() + '</root>'
                       String dataString = reader.readLines().join()
                       dataXML = new XmlSlurper().parseText(dataString)
                    }
                    response.'404' = {
                        log.println('Organization item not found!')
                    }
                    response.failure = { resp ->
                        log.println("Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}")
                    }
                }
            } catch (groovyx.net.http.HttpResponseException ex) {
                  ex.printStackTrace()
            } catch (java.net.ConnectException ex) {
                  ex.printStackTrace()
            }
            return dataXML;
        }
        
        def getChildrenOfInstitutionByItemId(String id, String url) {
            log.println("get chlildren of institution by item id: ${id}")
            def jsonResult;
            def componentsPath = "/hierarchy/" + id + "/children"
            jsonResult = ApiConsumer.getTextAsJson(url, componentsPath, null)
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
