package de.ddb.next

import de.ddb.next.exception.ItemNotFoundException

class ItemController {
    static defaultAction = "findById"

    def itemService

    def children() {
        try {
            render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(), "/hierarchy/" + params.id + "/children", null))
        } catch(MissingPropertyException mpe){
            log.error "children(): There was a missing property.", mpe
            forward controller: "error", action: "serverError"
        } catch(Exception e) {
            log.error "children(): An unexpected error occured.", e
            forward controller: "error", action: "serverError"
        }
    }

    def findById() {
        try {
            def id = params.id
            def item = itemService.findItemById(id)

            if("404".equals(item)){
                throw new ItemNotFoundException()
            }

            def binaryList = itemService.findBinariesById(id)
            def binariesCounter = itemService.binariesCounter(binaryList)

            def flashInformation = [:]
            flashInformation.all = [binaryList.size]
            flashInformation.images = [binariesCounter.images]
            flashInformation.audios = [binariesCounter.audios]
            flashInformation.videos = [binariesCounter.videos]

            if (item.pageLabel?.isEmpty()) {
                item.pageLabel= itemService.getItemTitle(id)
            }

            def urlQuery = SearchService.convertQueryParametersToSearchParameters(params)
            def resultsItems
            def hitNumber
            def searchResultUri

            // TODO: what does this method do?
            // TODO: Can we refactor it?
            // TODO: this method does a lot of things at once, maybe it is better to extract the logical functionality
            // into a small private methods.
            // Check if Item-Detail was called from search-result
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
                    'title': item.title, item: item.item, institution : item.institution, fields: fields,
                    binaryList: binaryList, pageLabel: item.pageLabel,
                    itemDetailGetParams: SearchService.getItemDetailGetParameters(params),
                    hitNumber: params["hitNumber"], results: resultsItems, searchResultUri: searchResultUri,
                    'flashInformation': flashInformation])
            }
        } catch(ItemNotFoundException infe){
            log.error "findById(): Request for nonexisting item with id: '" + params?.id + "'. Going 404..."
            forward controller: "error", action: "notFound"
        } catch(MissingPropertyException mpe){
            log.error "findById(): There was a missing property.", mpe
            forward controller: "error", action: "serverError"
        } catch(Exception e) {
            log.error "findById(): An unexpected error occured.", e
            forward controller: "error", action: "serverError"
        }

    }

    def translate(fields) {
        /* TODO: why do we need to catch the Exceptions in this method, is it better to throw them?
         * because the caller already catch the same Exceptions.
         */

        try {
            fields.each {
                def messageKey = 'ddbnext.' + it.'@id'
                def translated = message(code: messageKey)
                if(translated != messageKey) {
                    it.name = translated
                } else {
                    log.warn 'can not find message property: ' + messageKey + ' use ' + it.name + ' instead.'
                }
            }
        } catch(MissingPropertyException mpe){
            // TODO: can we handle the Exception centrally?
            log.error "translate(): There was a missing property.", mpe
            forward controller: "error", action: "serverError"
        } catch(Exception e) {
            log.error "translate(): An unexpected error occured.", e
            forward controller: "error", action: "serverError"
        }
    }

    def parents() {
        try {
            render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(), "/hierarchy/" + params.id + "/parent", null))
        } catch(MissingPropertyException mpe){
            log.error "parents(): There was a missing property.", mpe
            forward controller: "error", action: "serverError"
        } catch(Exception e) {
            log.error "parents(): An unexpected error occured.", e
            forward controller: "error", action: "serverError"
        }

    }
}
