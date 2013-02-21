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
            item.fields.each { 
                log.debug it.'@id'
                def bar = 'ddbnext.' + it.'@id'
                def foo = message(code: bar)
                log.debug 'translated: ' + foo

            }

//            def msg = messsage(code: '', args: []) //'ddbnext.' + it.'@id')
            render(view: 'item', model: [itemUri: itemUri,viewerUri: item.viewerUri,
                'title': item.title, item: item.item, institution : item.institution,
                fields: item.fields])
        }
    }
}
