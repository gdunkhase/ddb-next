package de.ddb.next


class ItemController {

    def itemService

    def findById() {
        def id = params.id
        def item = itemService.findItemById(id)
        if(item == '404') {
            redirect(controller: 'error')
        } else {
            def itemUri = request.getHeader('Host') + request.forwardURI
            def fields = translate(item.fields)
            render(view: 'item', model: [itemUri: itemUri,viewerUri: item.viewerUri,
                        'title': item.title, item: item.item, institution : item.institution,
                        fields: item.fields])
        }
    }

    def translate(fields) {
        fields.each {
            def messageKey = 'ddbnext.' + it.'@id'
            def translated = message(code: messageKey)
            if(translated != messageKey) {
                it.name = translated
            } else {
                log.warn 'can not find message property: ' + messageKey + ' use ' + it.name + ' instead.'
            }
        }
    }
}
