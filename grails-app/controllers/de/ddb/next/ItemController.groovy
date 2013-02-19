package de.ddb.next


class ItemController {
    static defaultAction = "findById"

    def itemService
    
    def children() {
        render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsbackend.toString(), "/hierarchy/" + params.id + "/children", null))
    }

    def findById() {
        def id = params.id
        def item = itemService.findItemById(id)
        def binaryList = itemService.findBinariesById(id)
        def binariesCounter = itemService.binariesCounter(binaryList)

        flash.all = [binaryList.size]
        flash.images = [binariesCounter.images]
        flash.audios = [binariesCounter.audios]
        flash.videos = [binariesCounter.videos]

        if(item == '404') {
            redirect(controller: 'error')
        } else {
            def itemUri = request.getHeader('Host') + request.forwardURI
            render(view: 'item', model: [itemUri: itemUri, viewerUri: item.viewerUri,
            'title': item.title, item: item.item, institution : item.institution, fields: item.fields, binaryList: binaryList])
        }
    }
    
    def parents() {
        render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsbackend.toString(), "/hierarchy/" + params.id + "/parent", null))
    }
}
