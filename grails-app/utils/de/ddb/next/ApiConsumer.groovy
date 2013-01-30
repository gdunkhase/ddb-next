package de.ddb.next
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.ContentType
import groovyx.net.http.Method
import groovyx.net.http.RESTClient

import static groovyx.net.http.ContentType.*
import groovy.json.*
import org.codehaus.groovy.grails.web.json.JSONArray

class ApiConsumer {

	static def postText(String baseUrl, String path, query, method = Method.POST) {
		try {
			def ret = null
			def http = new HTTPBuilder(baseUrl)
			http.request(method, ContentType.TEXT) {
				uri.path = path
				uri.query = query
				headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
				response.success = { resp, reader ->
				println "response status: ${resp.statusLine}"
				println 'Headers: -----------'
				resp.headers.each { h ->
					println " ${h.name} : ${h.value}"
				}
					ret = reader.getText()
				}
				response.'404' = { 
					ret= 'Not found' 
				}
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
			http.request(method, JSON) {
				uri.path = path
				uri.query = query
				headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
				response.success = { resp, json ->
					println "response status: ${resp.statusLine}"
					println 'Headers: -----------'
					resp.headers.each { h ->
						println " ${h.name} : ${h.value}"
					}
					ret = json
				}
				response.failure = { resp ->
					println "response status: ${resp.statusLine}"
					println 'Headers: -----------'
					
					resp.headers.each { h ->
						println " ${h.name} : ${h.value}"
					}
					println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
				}
				response.'404' = {resp, reader ->
				println "response status: ${resp.statusLine}"
				println 'Headers: -----------'
				resp.headers.each { h ->
					println " ${h.name} : ${h.value}"
				}
				println "###########404"
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
	
	static def getTextAsXml(String baseUrl, String path, query, method = Method.GET) {
		try {
			def ret = null
			def http = new HTTPBuilder(baseUrl)
			http.request(method, XML) {
				uri.path = path
				uri.query = query
				headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
				headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
				response.success = { resp, xml ->
					println "response status: ${resp.statusLine}"
					println 'Headers: -----------'
					resp.headers.each { h ->
						println " ${h.name} : ${h.value}"
					}
					ret = xml
				}
				response.failure = { resp ->
					println "response status: ${resp.statusLine}"
					println 'Headers: -----------'
					
					resp.headers.each { h ->
						println " ${h.name} : ${h.value}"
					}
					println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"
				}
				response.'404' = {resp, reader ->
				println "response status: ${resp.statusLine}"
				println 'Headers: -----------'
				resp.headers.each { h ->
					println " ${h.name} : ${h.value}"
				}
				println "###########404"
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
			http.request(method, ContentType.ANY) {
				uri.path = path
				uri.query = query
				headers.'User-Agent' = 'Mozilla/5.0 Ubuntu/8.10 Firefox/3.0.4'
				response.success = { resp, reader ->
					println "response status: ${resp.statusLine}"
					println 'Headers: -----------'
					resp.headers.each { h ->
						println " ${h.name} : ${h.value}"
					}
					println reader
					ret = reader
				}
				response.failure = { resp ->
					println "response status: ${resp.statusLine}"
					println 'Headers: -----------'
					resp.headers.each { h ->
						println " ${h.name} : ${h.value}"
					}
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

}