package de.ddb.next


class ItemController {

    def itemService

    def findById() {
        def id = params.id
        def item = itemService.findItemById(id)

        if(item == '404' || item?.failure) {
            redirect(controller: 'error')
        } else {
            def itemUri = request.getHeader('Host') + request.forwardURI
            render(view: 'item', model: [itemUri: itemUri, viewerUri: item.viewerUri,
                'title': item.title, item: item.item, institution : item.institution, fields: item.fields])
        }
    }
}