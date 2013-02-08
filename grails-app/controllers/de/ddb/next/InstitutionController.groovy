package de.ddb.next


class InstitutionController {

    def institutionService

    def show() {
        log.debug 'show all institutions'

        def all = institutionService.findAll()

        render (view: 'institutionList', model: [all: all])
    }
}
