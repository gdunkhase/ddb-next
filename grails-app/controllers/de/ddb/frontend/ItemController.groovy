package de.ddb.frontend


class ItemController {

    def itemService

    // ddb-next/item/:id
    def findById() {
        def id = params.id
        def item = itemService.findItemById(id)
        if(item == '404') {
            redirect(controller: 'error')
        } else {
            def itemUri = request.getHeader('Host') + request.forwardURI
            log.debug "item viewer uri: ${item.viewerUri}"
            render(view: 'item', model: [itemUri: itemUri, viewerUri: item.viewerUri, 
                item: item.item, institution : item.institution, fields: item.fields])
        }
    }
}