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

        http.get(path: 'institutions') { resp, json ->

            def aMap= buildIndex()
            json.each { it ->
                def firstChar = it?.name[0]?.toUpperCase()

                it.sectorLabelKey = 'ddbnext.' + it.sector

                if(aMap[firstChar].size() == 0) {
                    it.isFirst = true
                    it.firstChar = firstChar
                }

                if(it.children?.size() > 0 ) {
                    it.children.each { child ->
                        child.uri = buildUri(child.id)
                        child.sectorLabelKey = 'ddbnext.' + it.sector
                    }
                }

                def jsonWithUri = addUri(it)
                aMap[firstChar].add(jsonWithUri)
            }
            retVal = aMap
        }

        return retVal
    }

    private def buildIndex() {
        def az = 'A'..'Z'
        def aMap = [:].withDefault{[]}

        az.each { aMap[it] = []}
        return aMap //new TreeMap(aMap)
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
        return uri
    }
}