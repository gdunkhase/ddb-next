package de.ddb.next


class SearchController {

    static defaultAction = "results"

    def results() {
        def urlQuery = [:]
        if (params.q!=null || params.query!=null){
            // FIXME remove q
            urlQuery = (params.q)?[ query: params.q ]:[query: params.query]
        }
        
        if (params.rows == null)
            urlQuery["rows"] = 20
        else urlQuery["rows"] = params.rows
        
        if (params.offset == null)
            urlQuery["offset"] = 0
        else urlQuery["offset"] = params.offset
        
        //<--input query=rom&offset=0&rows=20&facetValues%5B%5D=time_fct%3Dtime_61800&facetValues%5B%5D=time_fct%3Dtime_60100&facetValues%5B%5D=place_fct%3DItalien
        //-->output query=rom&offset=0&rows=20&facet=time_fct&time_fct=time_61800&facet=time_fct&time_fct=time_60100&facet=place_fct&place_fct=Italien
        if(params["facetValues[]"]){
            urlQuery = SearchService.getFacets(params, urlQuery,"facet", 0)
        }
        
        if(params.get("facets[]")){
            urlQuery["facet"] = (!urlQuery["facet"])?[]:urlQuery["facet"]
            if(!urlQuery["facet"].contains(params.get("facets[]")))
                urlQuery["facet"].add(params.get("facets[]"))
        }
        
        if(params.minDocs)
         urlQuery["minDocs"] = params.minDocs
         
        if(params.sort != null)
             urlQuery["sort"] = params.sort
        
        if(params.viewType == null)
            urlQuery["viewType"] = "list"
        else urlQuery["viewType"] = params.viewType
        
        if(params.isThumbnailFiltered){
            urlQuery["facet"] = (!urlQuery["facet"])?[]:urlQuery["facet"]
            if(!urlQuery["facet"].contains("grid_preview") && params.isThumbnailFiltered == "true"){
                urlQuery["facet"].add("grid_preview")
                urlQuery["grid_preview"] = "true"
            }
        }
        
        def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)
        println resultsItems["randomSeed"]
        if(resultsItems["randomSeed"])
            urlQuery["randomSeed"] = resultsItems["randomSeed"]
        
        def mainFacetsUrl = SearchService.buildMainFacetsUrl(params, urlQuery, request)
        
        //Calculating results details info (number of results in page, total results number)
        def resultsOverallIndex = (urlQuery["offset"].toInteger()+1)+' - ' +
                                  ((urlQuery["offset"].toInteger()+
                                  urlQuery["rows"].toInteger()>resultsItems.numberOfResults)? resultsItems.numberOfResults:urlQuery["offset"].toInteger()+urlQuery["rows"].toInteger())
                                  
        //Calculating results pagination (previous page, next page, first page, and last page)
        def pagesOverallIndex = message(code:"ddbnext.Page")+" "+
                                ((urlQuery["offset"].toInteger()/urlQuery["rows"].toInteger())+1).toString()+" "+
                                message(code:"ddbnext.Of")+" "+
                                (Math.ceil(resultsItems.numberOfResults/urlQuery["rows"].toInteger()).toInteger())
                                
        def resultsPaginatorOptions = SearchService.buildPaginatorOptions(urlQuery)
        def numberOfResultsFormatted = String.format("%,d", resultsItems.numberOfResults.toInteger())
        
        def queryString = request.getQueryString()
        if(!queryString.contains("sort=random") && urlQuery["randomSeed"])
            queryString = queryString+"&sort="+urlQuery["randomSeed"]
        
        if(params.reqType=="ajax"){
            def resultsHTML = g.render(template:"/search/resultsList",model:[results: resultsItems.results["docs"], viewType:  urlQuery["viewType"],confBinary: grailsApplication.config.ddb.binary.url]).replaceAll("\r\n", '')
            def jsonReturn = [results: resultsHTML,
                              resultsPaginatorOptions: resultsPaginatorOptions,
                              resultsOverallIndex:resultsOverallIndex, 
                              pagesOverallIndex: pagesOverallIndex,
                              paginationURL: SearchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString.replaceAll("&reqType=ajax","")),
                              numberOfResults: numberOfResultsFormatted
                              ]
            render (contentType:"text/json"){jsonReturn}
        }
        else{
        //We want to build the subfacets urls only if a main facet has been selected
            def subFacetsUrl = [:]
            if(urlQuery["facet"]){
                subFacetsUrl = SearchService.buildSubFacetsUrl(resultsItems.facets, mainFacetsUrl, urlQuery)
            }
            render(view: "results", model: [
                results: resultsItems,
                isThumbnailFiltered: params.isThumbnailFiltered,
                clearFilters: SearchService.buildClearFilter(urlQuery, request.forwardURI),
                viewType:  urlQuery["viewType"],
                facets: [mainFacetsUrl: mainFacetsUrl, subFacetsUrl: subFacetsUrl],
                resultsPaginatorOptions: resultsPaginatorOptions,
                resultsOverallIndex:resultsOverallIndex, 
                pagesOverallIndex: pagesOverallIndex,
                paginationURL: SearchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString),
                numberOfResultsFormatted: numberOfResultsFormatted
            ])
        }
    }
    
    def facets() {
        def urlQuery = [:]
        if (params.q!=null || params.query!=null){
            // FIXME remove q
            urlQuery = (params.q)?[ query: params.q ]:[query: params.query]
        }
        
        if (params.rows == null)
            urlQuery["rows"] = 11
        else urlQuery["rows"] = params.rows
        
        if (params.offset == null)
            urlQuery["offset"] = 0
        else urlQuery["offset"] = params.offset
        
        //<--input query=rom&offset=0&rows=20&facetValues%5B%5D=time_fct%3Dtime_61800&facetValues%5B%5D=time_fct%3Dtime_60100&facetValues%5B%5D=place_fct%3DItalien
        //-->output query=rom&offset=0&rows=20&facet=time_fct&time_fct=time_61800&facet=time_fct&time_fct=time_60100&facet=place_fct&place_fct=Italien
        if(params["facetValues[]"]){
            urlQuery = SearchService.getFacets(params, urlQuery,"facet", 0)
        }
        
        if(params.get("facets[]")){
            urlQuery["facet"] = (!urlQuery["facet"])?[]:urlQuery["facet"]
            if(!urlQuery["facet"].contains(params.get("facets[]")))
                urlQuery["facet"].add(params.get("facets[]"))
        }
        
        if(params["name"]){
            urlQuery = params.name
        }
        
        def mainFacetsUrl = SearchService.buildMainFacetsUrl(params, urlQuery, request)
        
        def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', urlQuery)
        
        def facetsList = SearchService.getSelectedFacetsList(resultsItems.facets, active)
        
        def jsonReturn = [facetsList: facetsList]
        render (contentType:"text/json"){jsonReturn}
    }
}
