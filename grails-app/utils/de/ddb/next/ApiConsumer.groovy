package de.ddb.next

import static groovyx.net.http.ContentType.*
import groovy.json.*
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

import org.apache.commons.logging.LogFactory


class ApiConsumer {
    private static final log = LogFactory.getLog(this)

    static def postText(String baseUrl, String path, query, method = Method.POST) {
        try {
            def ret = null
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)
            
            http.request(method, ContentType.TEXT) {
                uri.path = path
                uri.query = query
                response.success = { resp, reader ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'
                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    ret = reader.getText()
                }
                response.'404' = {  ret= 'Not found'  }
                response.failure = { resp ->
                    println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                    ret = 'Not found'
                }
            }
            return ret
        } catch (groovyx.net.http.HttpResponseException ex) {
            ex.printStackTrace()
            return null
        } catch (java.net.ConnectException ex) {
            ex.printStackTrace()
            return null
        }
    }

    static def getText(String baseUrl, String path, query) {
        return postText(baseUrl, path, query, Method.GET)
    }

    static def getTextAsJson(String baseUrl, String path, query, method = Method.GET) {
        try {
            def ret = null
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)
            
            http.request(method, JSON) {
                uri.path = path
                uri.query = query
                response.success = { resp, json ->
                    // FIXME log don't print
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'
                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    ret = json
                }
                response.failure = { resp ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'

                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                }
                response.'404' = {resp, reader ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'
                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    ret= 'Not found'
                }
            }
            return ret
        } catch (groovyx.net.http.HttpResponseException ex) {
            println ex
            // FIXME throw something
        } catch (java.net.ConnectException ex) {
            println ex
            // FIXME throw something
        }
    }

    static def getTextAsXml(String baseUrl, String path, query, method = Method.GET) {
        try {
            def ret = null
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)
            
            http.request(method, XML) {
                uri.path = path
                uri.query = query
                headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                response.success = { resp, xml ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'
                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    ret = xml
                }
                response.failure = { resp ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'

                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                }
                response.'404' = {resp, reader ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'
                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    ret= 'Not found'
                }
            }
            return ret
        } catch (groovyx.net.http.HttpResponseException ex) {
            ex.printStackTrace()
            return null
        } catch (java.net.ConnectException ex) {
            ex.printStackTrace()
            return null
        }
    }

    static def getAnyText(String baseUrl, String path, query, method = Method.GET) {
        try {
            def ret = null
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)
           
            http.request(method, ContentType.ANY) {
                uri.path = path
                uri.query = query
                response.success = { resp, reader ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'
                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    println reader
                    ret = reader
                }
                response.failure = { resp ->
                    println "response status: ${resp.statusLine}"
                    println 'Headers: -----------'
                    resp.headers.each { h -> println " ${h.name} : ${h.value}" }
                    println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                }
            }
            return ret
        } catch (groovyx.net.http.HttpResponseException ex) {
            ex.printStackTrace()
            return null
        } catch (java.net.ConnectException ex) {
            ex.printStackTrace()
            return null
        }
    }

    static def setProxy(http, String baseUrl) {
        if(baseUrl.contains('localhost') || baseUrl.contains('fiz-karlsruhe.de')) {
            log.debug " ${baseUrl} does not need http proxy"
            return
        }
        
        def PROXY_HOST = 'proxy.fiz-karlsruhe.de'
        def PROXY_PORT = 8888
        http.setProxy(PROXY_HOST,PROXY_PORT, 'http')
        
        log.debug " ${baseUrl} will uses HTTP Proxy"
    }
}