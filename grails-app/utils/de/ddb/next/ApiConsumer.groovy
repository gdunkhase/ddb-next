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

import java.util.regex.Pattern

import static groovyx.net.http.ContentType.*

import groovy.json.*
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method
import java.util.regex.Pattern
import org.apache.commons.logging.LogFactory


class ApiConsumer {
    private static final log = LogFactory.getLog(this)
    private static Pattern nonProxyHostsPattern

    static def postText(String baseUrl, String path, query, method = Method.POST) {
        try {
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)

            def timestampStart = System.currentTimeMillis();
            http.request(method, ContentType.TEXT) {
                uri.path = path
                uri.query = query
                response.success = { resp, reader ->
                    log.info "Current request uri: 200, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    log.debug "response status: ${resp.statusLine}"
                    log.debug 'Headers: -----------'
                    resp.headers.each { h ->
                        log.debug " ${h.name} : ${h.value}"
                    }
                    return reader.getText()
                }
                response.'404' = {
                    log.error "Current request uri: 404, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    return 'Not found'
                }
                response.failure = { resp ->
                    log.error "Current request uri: 500, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri+", Unexpected error: ${resp.statusLine} : ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                    return 'Not found'
                }
            }
        } catch (groovyx.net.http.HttpResponseException ex) {
            log.error "A HttpResponseException occured", ex
            return null
        } catch (java.net.ConnectException ex) {
            log.error "A ConnectException occured", ex
            return null
        } catch (java.lang.Exception ex) {
            log.error "An unexpected exception occured", ex
            return null
        }
    }

    static def getText(String baseUrl, String path, query) {
        return postText(baseUrl, path, query, Method.GET)
    }

    static def getTextAsJson(String baseUrl, String path, query, method = Method.GET) {
        try {
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)

            def timestampStart = System.currentTimeMillis();
            http.request(method, JSON) {
                uri.path = path
                uri.query = query
                response.success = { resp, json ->
                    log.info "Current request uri: 200, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    log.debug "response status: ${resp.statusLine}"
                    log.debug 'Headers: -----------'
                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return json
                }
                response.failure = { resp ->
                    log.error "Current request uri: 500, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri+", Unexpected error: ${resp.statusLine} : ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                    //                    response.
                    log.debug 'Headers: -----------'

                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return null
                }
                response.'404' = {resp, reader ->
                    log.error "Current request uri: 404, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    log.debug 'Headers: -----------'
                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return 'Not found'
                }
            }
        } catch (groovyx.net.http.HttpResponseException ex) {
            log.error "A HttpResponseException occured", ex
            return null
        } catch (java.net.ConnectException ex) {
            log.error "A ConnectException occured", ex
            return null
        } catch (java.lang.Exception ex) {
            log.error "An unexpected exception occured", ex
            return null
        }
    }

    static def getTextAsXml(String baseUrl, String path, query, method = Method.GET) {
        try {
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)

            def timestampStart = System.currentTimeMillis();
            http.request(method, XML) {
                uri.path = path
                uri.query = query
                headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                response.success = { resp, xml ->
                    log.info "Current request uri: 200, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    log.debug "response status: ${resp.statusLine}"
                    log.debug 'Headers: -----------'
                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return xml
                }
                response.'404' = {resp, reader ->
                    log.error "Current request uri: 404, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    log.debug 'Headers: -----------'
                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return 'Not found'
                }
                response.failure = { resp ->
                    log.error "Current request uri: 500, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri+", Unexpected error: ${resp.statusLine} : ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                    log.debug 'Headers: -----------'

                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return null
                }
            }
        } catch (groovyx.net.http.HttpResponseException ex) {
            log.error "A HttpResponseException occured", ex
            return null
        } catch (java.net.ConnectException ex) {
            log.error "A ConnectException occured", ex
            return null
        } catch (java.lang.Exception ex) {
            log.error "An unexpected exception occured", ex
            return null
        }
    }

    static def getAnyText(String baseUrl, String path, query, method = Method.GET) {
        try {
            def http = new HTTPBuilder(baseUrl)
            setProxy(http, baseUrl)

            def timestampStart = System.currentTimeMillis();
            http.request(method, ContentType.ANY) {
                uri.path = path
                uri.query = query
                response.success = { resp, reader ->
                    log.info "Current request uri: 200, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    log.debug "response status: ${resp.statusLine}"
                    log.debug 'Headers: -----------'
                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    log.debug reader
                    return reader
                }
                response.'404' = {resp, reader ->
                    log.error "Current request uri: 404, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri
                    log.debug 'Headers: -----------'
                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return 'Not found'
                }
                response.failure = { resp ->
                    log.error "Current request uri: 500, "+(System.currentTimeMillis()-timestampStart)+"ms, "+uri+", Unexpected error: ${resp.statusLine} : ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
                    log.debug 'Headers: -----------'
                    resp.headers.each { h -> log.debug " ${h.name} : ${h.value}" }
                    return null
                }
            }
        } catch (groovyx.net.http.HttpResponseException ex) {
            log.error "A HttpResponseException occured", ex
            return null
        } catch (java.net.ConnectException ex) {
            log.error "A ConnectException occured", ex
            return null
        } catch (java.lang.Exception ex) {
            log.error "An unexpected exception occured", ex
            return null
        }
    }

    static def setProxy(http, String baseUrl) {
        def proxyHost = System.getProperty("http.proxyHost")
        def proxyPort = System.getProperty("http.proxyPort")
        def nonProxyHosts = System.getProperty("http.nonProxyHosts")

        if (proxyHost) {
            if (nonProxyHosts) {
                if (!nonProxyHostsPattern) {
                    nonProxyHosts = nonProxyHosts.replaceAll("\\.", "\\\\.")
                    nonProxyHosts = nonProxyHosts.replaceAll("\\*", "")
                    nonProxyHosts = nonProxyHosts.replaceAll("\\?", "\\\\?")
                    nonProxyHostsPattern = Pattern.compile(nonProxyHosts)
                }
                if (nonProxyHostsPattern.matcher(baseUrl).find()) {
                    return
                }
            }
            if (!proxyPort) {
                proxyPort = "80"
            }
            http.setProxy(proxyHost, new Integer(proxyPort), 'http')
        }
    }

}
