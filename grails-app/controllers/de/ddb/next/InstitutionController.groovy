package de.ddb.next


class InstitutionController {

    def institutionService

    def show() {
        log.debug 'show all institutions'

        // TODO sort umlaut
        def aMap = institutionService.findAll()
        
        // TODO: make this more idiomatic groovy
        def all = []
        aMap.each { all.addAll(it.value) }
        aMap.each { k,v -> 
            log.debug v.size()
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
}
