package de.ddb.next


class SearchController {

    static defaultAction = "results"
    
    def searchService
    
    def results() {

        try {
            def urlQuery = searchService.convertQueryParametersToSearchParameters(params)
            def firstLastQuery = searchService.convertQueryParametersToSearchParameters(params)
            def mainFacetsUrl = searchService.buildMainFacetsUrl(params, urlQuery, request)

            def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)
            
            if(resultsItems["randomSeed"]){
                urlQuery["randomSeed"] = resultsItems["randomSeed"]
                if (!params.sort) {
                    params.sort = urlQuery["randomSeed"]
                }
            }

            if (resultsItems != null && resultsItems["numberOfResults"] != null && (Integer)resultsItems["numberOfResults"] > 0) {
                //check for lastHit and firstHit
                //firstHit
                firstLastQuery["rows"] = 1
                firstLastQuery["offset"] = 0
                def firstHit = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', firstLastQuery)
                if (firstHit != null && firstHit["numberOfResults"] != null && (Integer)firstHit["numberOfResults"] > 0) {
                    params["firstHit"] = firstHit["results"]["docs"][0].id
                }

                //lastHit
                //Workaround, find id of last hit when calling last hit.
                //Set id to "lasthit" to signal ItemController to find id of lasthit.
                params["lastHit"] = "lasthit"

//                firstLastQuery["offset"] = resultsItems["numberOfResults"] - 1
//                def lastHit = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', firstLastQuery)
//                if (lastHit != null && lastHit["numberOfResults"] != null && (Integer)lastHit["numberOfResults"] > 0) {
//                    params["lastHit"] = lastHit["results"]["docs"][0].id
//                }
            }
            
            //create cookie with search parameters
            response.addCookie(searchService.createSearchCookie(params))

            //Calculating results details info (number of results in page, total results number)
            def resultsOverallIndex = (urlQuery["offset"].toInteger()+1)+' - ' +
                    ((urlQuery["offset"].toInteger()+
                    urlQuery["rows"].toInteger()>resultsItems.numberOfResults)? resultsItems.numberOfResults:urlQuery["offset"].toInteger()+urlQuery["rows"].toInteger())

            //Calculating results pagination (previous page, next page, first page, and last page)
            def page = ((urlQuery["offset"].toInteger()/urlQuery["rows"].toInteger())+1).toString()
            def totalPages = (Math.ceil(resultsItems.numberOfResults/urlQuery["rows"].toInteger()).toInteger())

            def resultsPaginatorOptions = searchService.buildPaginatorOptions(urlQuery)
            def numberOfResultsFormatted = String.format("%,d", resultsItems.numberOfResults.toInteger())
            
            def queryString = request.getQueryString()
            
            if(!queryString.contains("sort=random") && urlQuery["randomSeed"])
                queryString = queryString+"&sort="+urlQuery["randomSeed"]

            if(params.reqType=="ajax"){
                def resultsHTML = g.render(template:"/search/resultsList",model:[results: resultsItems.results["docs"], viewType:  urlQuery["viewType"],confBinary: grailsApplication.config.ddb.binary.url,
                    offset: params["offset"]]).replaceAll("\r\n", '')
                def jsonReturn = [results: resultsHTML,
                    resultsPaginatorOptions: resultsPaginatorOptions,
                    resultsOverallIndex:resultsOverallIndex,
                    page: page,
                    totalPages: totalPages,
                    paginationURL: searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString.replaceAll("&reqType=ajax","")),
                    numberOfResults: numberOfResultsFormatted,
                    offset: params["offset"]
                ]
                render (contentType:"text/json"){jsonReturn}
            }
            else{
                //We want to build the subfacets urls only if a main facet has been selected
                def subFacetsUrl = [:]
                def selectedFacets = searchService.buildSubFacets(urlQuery)
                if(urlQuery["facet"]){
                    subFacetsUrl = searchService.buildSubFacetsUrl(selectedFacets, mainFacetsUrl, urlQuery)
                }
                render(view: "results", model: [
                    results: resultsItems,
                    isThumbnailFiltered: params.isThumbnailFiltered,
                    clearFilters: searchService.buildClearFilter(urlQuery, request.forwardURI),
                    viewType:  urlQuery["viewType"],
                    facets: [selectedFacets: selectedFacets, mainFacetsUrl: mainFacetsUrl, subFacetsUrl: subFacetsUrl],
                    resultsPaginatorOptions: resultsPaginatorOptions,
                    resultsOverallIndex:resultsOverallIndex,
                    page: page,
                    totalPages: totalPages,
                    paginationURL: searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString),
                    numberOfResultsFormatted: numberOfResultsFormatted,
                    offset: params["offset"]
                ])
            }

        } catch(MissingPropertyException mpe){
            log.error "results(): There was a missing property.", mpe
            forward controller: "error", action: "serverError"
        } catch(Exception e) {
            log.error "results(): An unexpected error occured.", e
            forward controller: "error", action: "serverError"
        }

    }


}
