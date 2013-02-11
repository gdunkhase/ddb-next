package de.ddb.next


class InstitutionController {

    def institutionService

    def show() {
        log.debug 'show all institutions'

        def all = []
        def aMap = institutionService.findAll()
        // TODO: make this more idiomatic groovy
        aMap.each { all.addAll(it.value) }
        
        render (view: 'institutionList',  model: [index: aMap.keySet(), all: all])
    }
}
