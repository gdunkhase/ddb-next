package de.ddb.next

class ItemController {
    static defaultAction = "findById"

    def itemService

    def children() {
        render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(), "/hierarchy/" + params.id + "/children", null))
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

        if (item.pageLabel?.isEmpty()) {
            item.pageLabel= itemService.getItemTitle(id)
        }

        def urlQuery = SearchService.convertQueryParametersToSearchParameters(params)
        def resultsItems
        def hitNumber
        def searchResultUri
        //Check if Item-Detail was called from search-result
        if (params["hitNumber"]) {
            //Search and return 3 Hits: previous, current and last
            params["hitNumber"] = params["hitNumber"].toInteger()
            urlQuery["rows"] = 3
            if (params["hitNumber"] > 1) {
                urlQuery["offset"] = params["hitNumber"] - 2
            }
            else {
                urlQuery["offset"] = 0
            }
            resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)

            //generate link back to search-result. Calculate Offset.
            def searchGetParameters = SearchService.getSearchGetParameters(params)
            def offset = ((Integer)((params["hitNumber"]-1)/params["rows"]))*params["rows"]
            searchGetParameters["offset"] = offset
            searchResultUri = "/search?"
            MapToGetParametersTagLib mapToGetParametersTagLib = new MapToGetParametersTagLib();
            searchResultUri += mapToGetParametersTagLib.convert(searchGetParameters);
            
        }

        // TODO: handle 404 and failure separately. HTTP Status Code 404, should
        // to `not found` page _and_ Internal Error should go to `internal server
        // error` page. We should send also the HTTP Status Code 404 or 500 to the
        // Client.
        if(item == '404' || item?.failure) {
            redirect(controller: 'error')
        } else {
            def itemUri = request.forwardURI
            def fields = translate(item.fields)
            render(view: 'item', model: [itemUri: itemUri, viewerUri: item.viewerUri,
                'title': item.title, item: item.item, institution : item.institution, fields: item.fields,
                binaryList: binaryList, pageLabel: item.pageLabel, 
                itemDetailGetParams: SearchService.getItemDetailGetParameters(params), 
                hitNumber: params["hitNumber"], results: resultsItems, searchResultUri: searchResultUri])
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

    def parents() {
        render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(), "/hierarchy/" + params.id + "/parent", null))
    }
}
