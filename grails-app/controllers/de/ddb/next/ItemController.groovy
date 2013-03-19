package de.ddb.next

import de.ddb.next.exception.ItemNotFoundException

class ItemController {
    static defaultAction = "findById"

    def itemService
    def searchService

    def children() {
        try {
            render(contentType:"application/json", text:ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(), "/hierarchy/" + params.id + "/children", ["rows":501]))
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
            //Check if Item-Detail was called from search-result and fill parameters
            def searchResultParameters = handleSearchResultParameters(params, request)
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

            // TODO: handle 404 and failure separately. HTTP Status Code 404, should
            // to `not found` page _and_ Internal Error should go to `internal server
            // error` page. We should send also the HTTP Status Code 404 or 500 to the
            // Client.
            if(item == '404' || item?.failure) {
                redirect(controller: 'error')
            } else {
                def itemUri = request.forwardURI
                def fields = translate(item.fields)

                if(params.print){
                    renderPdf(template: "itemPdf", model: [itemUri: itemUri, viewerUri: item.viewerUri,
                        'title': item.title, item: item.item, itemId: id, institution : item.institution, fields: fields,
                        binaryList: binaryList, pageLabel: item.pageLabel,
                        firstHit: searchResultParameters["searchParametersMap"]["firstHit"], lastHit: searchResultParameters["searchParametersMap"]["lastHit"],
                        hitNumber: params["hitNumber"], results: searchResultParameters["resultsItems"], searchResultUri: searchResultParameters["searchResultUri"], 'flashInformation': flashInformation],
                    filename: "Item-Detail.pdf")
                }else{
                    render(view: "item", model: [itemUri: itemUri, viewerUri: item.viewerUri,
                        'title': item.title, item: item.item, itemId: id, institution : item.institution, fields: fields,
                        binaryList: binaryList, pageLabel: item.pageLabel,
                        firstHit: searchResultParameters["searchParametersMap"]["firstHit"], lastHit: searchResultParameters["searchParametersMap"]["lastHit"],
                        hitNumber: params["hitNumber"], results: searchResultParameters["resultsItems"], searchResultUri: searchResultParameters["searchResultUri"], 'flashInformation': flashInformation])

                }
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
        fields.each {
            def messageKey = 'ddbnext.' + it.'@id'
            def translated = message(code: messageKey)
            if(translated != messageKey) {
                it.name = translated
            } else {
                it.name = it.name.toString().capitalize()
                log.warn 'can not find message property: ' + messageKey + ' use ' + it.name + ' instead.'
            }
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

    /**
     * Get Data to build Search Result Navigation Bar for Item Detail View
     *
     * @param reqParameters requestParameters
     * @return Map with searchResult to build back + next links
     *  and searchResultUri for Link "Back to Search Result"
     */
    def handleSearchResultParameters(reqParameters, httpRequest) {
        def searchResultParameters = [:]
        searchResultParameters["searchParametersMap"] = [:]
        def searchParametersMap
        def resultsItems
        def searchResultUri
        if (reqParameters["hitNumber"]) {
            searchParametersMap = searchService.getSearchCookieAsMap(httpRequest.cookies)
            def urlQuery = searchService.convertQueryParametersToSearchParameters(searchParametersMap)

            //Search and return 3 Hits: previous, current and last
            reqParameters["hitNumber"] = reqParameters["hitNumber"].toInteger()
            urlQuery["rows"] = 3
            if (reqParameters["hitNumber"] > 1) {
                urlQuery["offset"] = reqParameters["hitNumber"] - 2
            }
            else {
                urlQuery["offset"] = 0
            }
            resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)

            //generate link back to search-result. Calculate Offset.
            def searchGetParameters = searchService.getSearchGetParameters(searchParametersMap)
            def offset = ((Integer)((params["hitNumber"]-1)/searchParametersMap["rows"]))*searchParametersMap["rows"]
            searchGetParameters["offset"] = offset
            searchResultUri = "/searchresults?"
            MapToGetParametersTagLib mapToGetParametersTagLib = new MapToGetParametersTagLib()
            searchResultUri += mapToGetParametersTagLib.convert(searchGetParameters)
            searchResultParameters["resultsItems"] = resultsItems
            searchResultParameters["searchResultUri"] = searchResultUri
            searchResultParameters["searchParametersMap"] = searchParametersMap

            //Workaround for last-hit (Performance-issue)
            if (reqParameters.id && reqParameters.id.equals("lasthit")) {
                reqParameters.id = resultsItems.results["docs"][1].id
            }
        }
        return searchResultParameters
    }
}
