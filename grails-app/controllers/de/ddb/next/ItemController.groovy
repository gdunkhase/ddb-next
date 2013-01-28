package de.ddb.next


class ItemController {

    def itemService

    // ddb-next/item/:id
    def findById() {
        def id = params.id
        def item = itemService.findItemById(id)
        if(item == '404') {
            redirect(controller: "error")
        } else {
            def itemUri = request.getHeader('Host') + request.forwardURI
            render(view: "item", model: [itemUri: itemUri, item: item.item, institution : item.institution,
                        fields: item.fields])
        }
    }
}