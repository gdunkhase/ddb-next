package de.ddb.next
import grails.converters.JSON

class InstitutionController {

    def institutionService

    def show() {
        log.debug 'show all institutions'
        // TODO sort umlaut
        def aMap = institutionService.findAll()
        // TODO: make this more idiomatic groovy
        def all = []
        aMap.each { all.addAll(it.value) }
        // no institutions
        aMap.each { k,v ->
            if(aMap[k]?.size() == 0) {
                aMap[k] = true
            } else {
                aMap[k] = false
            }
        }
        // TODO: move to service
        def index = []
        aMap.each {
            index.add(it)
        }

        render (view: 'institutionList',  model: [index: index, all: all])
    }

    def getJson() {
        render institutionService.findAll() as JSON
    }
}
