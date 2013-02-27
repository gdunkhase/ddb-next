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
   
        /*
         * Example:
         * request: http://dev-backend.deutsche-digitale-bibliothek.de:9998/access/VSHJWG7QLS7Y3NS2HKE43E5Q5NJ7OCLS/components/providerinfo
         */
        def getInstitutionViewByItemId(String id, String url) {
            log.println("get insitution view by item id: ${id}")
            //String url = "http://dev-backend.deutsche-digitale-bibliothek.de:9998";
            def dataXML = null;
            def componentsPath = "/access/" + id + "/components/"
            def providerInfo = componentsPath + "view" 
            log.println(providerInfo)
            try {
                def http = new HTTPBuilder(url)
                http.request(Method.GET, ContentType.TEXT) { req ->
                    uri.path = providerInfo
                    headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
                    headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    response.success = { resp, reader ->
                       assert resp.statusLine.statusCode == 200
                       log.println("Response status: ${resp.statusLine}")
                       log.println("Content-Type: ${resp.headers.'Content-Type'}")
                       //String dataString = '<?xml version="1.0" encoding="UTF-8"?><root>' + reader.readLines().join() + '</root>'
                       String dataString = reader.readLines().join()
                       log.println("getInstitutionViewByItemId-Response: " + dataString)
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
        
        def getProviderInfoByItemId(String id, String url) {
            log.println("get provider info by item id: ${id}")
            //String url = "http://dev-backend.deutsche-digitale-bibliothek.de:9998";
            def dataXML = null;
            def componentsPath = "/access/" + id + "/components/"
            def providerInfo = componentsPath + "providerinfo"
            log.println(providerInfo)
            try {
                def http = new HTTPBuilder(url)
                http.request(Method.GET, ContentType.TEXT) { req ->
                    uri.path = providerInfo
                    headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
                    headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    response.success = { resp, reader ->
                       assert resp.statusLine.statusCode == 200
                       log.println("Response status: ${resp.statusLine}")
                       log.println("Content-Type: ${resp.headers.'Content-Type'}")
                       String dataString = '<?xml version="1.0" encoding="UTF-8"?><root>' + reader.readLines().join() + '</root>'
                       log.println("getProviderInfoByItemId-Response: " + dataString)
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
    
        /*
         * Example:
         * request: http://dev-backend.deutsche-digitale-bibliothek.de:9998/hierarchy/VSHJWG7QLS7Y3NS2HKE43E5Q5NJ7OCLS/children
         */
        def getChildrenOfInstitutionByItemId(String id, String url) {
            log.println("get chlildren of institution by item id: ${id}")
            //String url = "http://dev-backend.deutsche-digitale-bibliothek.de:9998";
            def jsonResult;
            def componentsPath = "/hierarchy/" + id + "/children"
            log.println("componentsPath = " + componentsPath)
            
            log.println("getChildrenOfInstitutionByItemId.url = " + url)
            log.println("getChildrenOfInstitutionByItemId.uriPath = " + componentsPath)
            jsonResult = ApiConsumer.getTextAsJson(url, componentsPath, null)
            /*
            try {
                def http = new HTTPBuilder(url)
                http.request(Method.GET, ContentType.TEXT) { req ->
                    uri.path = componentsPath
                    headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
                    headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*             /*;q=0.8'
                    response.success = { resp, reader ->
                       assert resp.statusLine.statusCode == 200
                       log.println("Response status: ${resp.statusLine}")
                       log.println("Content-Type: ${resp.headers.'Content-Type'}")
                       String dataString = null;
                       dataString = reader.readLines().join()
                       //log.println("String-Response: " + dataString)
                       def jsonSlurper = new JsonSlurper()
                       jsonResult = jsonSlurper.parseText(dataString)
                       //log.println('jsonResult = ' + jsonResult)
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
            */
            return jsonResult;
        }
        
        /* Example:
         * request: http://dev-backend.deutsche-digitale-bibliothek.de:9998/search/facets/provider_fct?query=Landesarchiv%20Baden-W%C3%BCrttemberg
         * response:{"field":"provider_fct","numberOfFacets":1,"facetValues":[{"value":"Landesarchiv Baden-Württemberg","count":9954}]}
         */
        def getFacetValues(String provName, String url) {
            log.println("get facets values for: ${provName}")
            //String url = "http://dev-backend.deutsche-digitale-bibliothek.de:9998";
            def jsonResult;
            def uriPath = "/search/facets/provider_fct"
            //def urlRequest = "${uriPath}?query=${provName}"
            def query = ['query':"${provName}" ]
            
            log.println("url = " + url)
            log.println("uriPath = " + uriPath)
            //log.println("urlRequest = " + urlRequest)
            log.println("query = " + query)
            jsonResult = ApiConsumer.getTextAsJson(url, uriPath, query)
            /*
            try {
                def http = new HTTPBuilder(url)
                http.request(Method.GET, ContentType.TEXT) { req ->
                    uri.path = uriPath
                    uri.query = query
                    headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
                    headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*                /*;q=0.8'
                    response.success = { resp, reader ->
                       assert resp.statusLine.statusCode == 200
                       log.println("Response status: ${resp.statusLine}")
                       log.println("Content-Type: ${resp.headers.'Content-Type'}")
                       String dataString = null;
                       dataString = reader.readLines().join()
                       //log.println("String-Response: " + dataString)
                       def jsonSlurper = new JsonSlurper()
                       jsonResult = jsonSlurper.parseText(dataString)
                       //log.println('jsonResult = ' + jsonResult)
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
            */
            return jsonResult;
        }
        
}
