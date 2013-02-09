package de.ddb.next

import org.apache.commons.logging.LogFactory

import groovy.json.JsonSlurper;
import groovyx.net.http.ContentType;
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class ApiInstitution {
    private static final log = LogFactory.getLog(this)
    
        def getInstitutionViewByItemId(String id) {
            log.println("get insitution view by item id: ${id}")
            def dataXML = null;
            // http://dev-backend.deutsche-digitale-bibliothek.de:9998/access/VSHJWG7QLS7Y3NS2HKE43E5Q5NJ7OCLS/components/providerinfo
            def componentsPath = "/access/" + id + "/components/"
            def providerInfo = componentsPath + "view" 
            log.println(providerInfo)
            try {
                def http = new HTTPBuilder("http://dev-backend.deutsche-digitale-bibliothek.de:9998")
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
        
        def getProviderInfoByItemId(String id) {
            log.println("get provider info by item id: ${id}")
            def dataXML = null;
            // http://dev-backend.deutsche-digitale-bibliothek.de:9998/access/VSHJWG7QLS7Y3NS2HKE43E5Q5NJ7OCLS/components/providerinfo
            def componentsPath = "/access/" + id + "/components/"
            def providerInfo = componentsPath + "providerinfo"
            log.println(providerInfo)
            try {
                def http = new HTTPBuilder("http://dev-backend.deutsche-digitale-bibliothek.de:9998")
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
    
        def getChildrenOfInstitutionByItemId(String id) {
            log.println("get chlildren of institution by item id: ${id}")
            JsonSlurper dataJSON = null;
            // http://dev-backend.deutsche-digitale-bibliothek.de:9998/hierarchy/VSHJWG7QLS7Y3NS2HKE43E5Q5NJ7OCLS/children
            def componentsPath = "/hierarchy/" + id + "/children"
            log.println("componentsPath = " + componentsPath)
            try {
                def http = new HTTPBuilder("http://dev-backend.deutsche-digitale-bibliothek.de:9998")
                http.request(Method.GET, ContentType.TEXT) { req ->
                    uri.path = componentsPath
                    headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
                    headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    response.success = { resp, reader ->
                       assert resp.statusLine.statusCode == 200
                       log.println("Response status: ${resp.statusLine}")
                       log.println("Content-Type: ${resp.headers.'Content-Type'}")
                       String dataString = reader.readLines().join()
                       log.println("getChildrenOfInstitutionByItemId-Response: " + dataString)
                       dataJSON = new JsonSlurper().parseText(dataString)
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
            return dataJSON;
        }
    
}
