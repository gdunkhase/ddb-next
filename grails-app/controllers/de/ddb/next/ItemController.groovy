package de.ddb.next


class ItemController {

    def itemService

    // ddb-next/item/:id
    def findById() {
        def itemUri = request.getHeader('Host') + request.forwardURI
        def item = itemService.findItemById()
        def binary = itemService.findBinariesById()
        render(view: "item", model: [itemUri: itemUri, item: item.item, institution : item.institution,
                    fields: item.fields, binary: binary])
    }
}