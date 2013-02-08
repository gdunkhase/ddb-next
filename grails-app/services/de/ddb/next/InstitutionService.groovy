package de.ddb.next

import groovyx.net.http.HTTPBuilder
import groovyx.net.http.URIBuilder




class InstitutionService {

    def transactional = false

    def grailsApplication

    def findAll() {
        def cortexHostPort = grailsApplication.config.ddb.backend.url

        def http = new HTTPBuilder(cortexHostPort)
        ApiConsumer.setProxy(http, cortexHostPort)

        def retVal

        http.get(path: 'institutions') {
            resp, json ->
            log.debug "JSON: ${json}"

            def all = []
            json.each { it ->
                if(it.children?.size() > 0 ) {
                    it.children.each {
                        child -> 
                        child.uri = buildUri(child.id)
                    }
                }
                
                def jsonWithUri = addUri(it)
                all.add(jsonWithUri)
            }
            retVal = all
        }

        return retVal
    }

    
    private def addUri(json) {
        json.uri = buildUri(json.id)
        return json
    }

    private String buildUri(id) {
        // TODO: replace this with Grails's inner linking way
        URIBuilder b = new URIBuilder('http://localhost:8080')
        b.setPath("/about-us/institutions/item/${id}")

        def uri = b.toURI().toString()
        log.debug "uri: ${uri}"
        return uri
    }
}
