package de.ddb.next

class EntityController {

    def show() {
        log.debug('entitycontroller.show')
        render(view: 'entity')
    }
}
