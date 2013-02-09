package de.ddb.next

import java.lang.reflect.Method;

import java.text.Normalizer.Form;

import org.apache.commons.logging.LogFactory

import sun.misc.IOUtils;

import groovyx.net.http.ContentType;
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

class InstitutionController {

    private static final log = LogFactory.getLog(this)

    def findByItemId() {
        def id = params.id
        
        log.println("---")
        log.println("find insitution by item id: ${id}")
        log.println("---")
        
        // http://dev-backend.deutsche-digitale-bibliothek.de:9998/access/VSHJWG7QLS7Y3NS2HKE43E5Q5NJ7OCLS/components/providerinfo
        
        def componentsPath = "/access/" + id + "/components/"
        def providerInfo = componentsPath + "view" //"providerinfo"
        def test
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
                   println "Text: " + dataString
                   def dataXML = new XmlSlurper().parseText(dataString)
                   
                   println "XML.name = " + dataXML.'name'
                   
                   render(view: "institution", model: [results: dataXML])
                }
                response.'404' = {
                    log.println('Organization item not found!')
                    redirect(controller: 'error')
                }
                response.failure = { resp ->
                    log.println("Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}")
                    redirect(controller: 'error')
                }
            }
        } catch (groovyx.net.http.HttpResponseException ex) {
              ex.printStackTrace()
        } catch (java.net.ConnectException ex) {
              ex.printStackTrace()
        }

        println "to render ..."
        //redirect(controller: 'error')
        //render "find insitution with the id: ${id}"
        //render view: 'institution' , model: [orgId: id, institution: org]
        //render view: 'institution' , model: [orgId: id]
    }
}
