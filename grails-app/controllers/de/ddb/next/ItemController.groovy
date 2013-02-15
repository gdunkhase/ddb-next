package de.ddb.next


class ItemController {
    static defaultAction = "findById"

    def itemService
    
    def children() {
        render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsbackend.toString(), "/hierarchy/" + params.id + "/children", null))
    }

    // ddb-next/item/:id !!! be aware of the context path
    def findById() {
        def id = params.id
        def item = itemService.findItemById(id)
        if(item == '404') {
            redirect(controller: 'error')
        } else {
            def itemUri = request.getHeader('Host') + request.forwardURI
            render(view: 'item', model: [itemUri: itemUri, viewerUri: item.viewerUri,
                        item: item.item, institution : item.institution, fields: item.fields])
        }
    }
    
    def parent() {
        render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsbackend.toString(), "/hierarchy/" + params.id + "/parent", null))
    }
}