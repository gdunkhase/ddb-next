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
		if(params.get("facetValues[]")){
			println "facet param size: "+params.get("facetValues[]").size()
			urlQuery = SearchService.getFacets(params, urlQuery,"facet", 0)
		}
		
		if(params.get("facets[]")){
			urlQuery["facet"] = (!urlQuery["facet"])?[]:urlQuery["facet"]
			if(!urlQuery["facet"].contains(params.get("facets[]")))
				urlQuery["facet"].add(params.get("facets[]"))
		}
		
		if(params.minDocs)
			urlQuery["minDocs"] = params.minDocs
			
		if(params.sort == null)
			urlQuery["sort"] = "RELEVANCE"
		else urlQuery["sort"] = params.sort
		
		if(params.viewType == null)
			urlQuery["viewType"] = "list"
		else urlQuery["viewType"] = params.viewType
		
		def mainFacetsUrl = SearchService.buildMainFacetsUrl(params, urlQuery, request) 
			
		def resultsItems = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsItemResults.toString() ,'/apis/search', urlQuery)
		
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
		
		if(params.reqType=="ajax"){
			def resultsHTML = g.render(template:"/search/resultsList",model:[results: resultsItems.results["docs"], viewType:  urlQuery["viewType"],confBinary: grailsApplication.config.ddb.binary]).replaceAll("\r\n", '')
			def jsonReturn = [results: resultsHTML,
								resultsPaginatorOptions: resultsPaginatorOptions,
								resultsOverallIndex:resultsOverallIndex, 
								pagesOverallIndex: pagesOverallIndex,
								paginationURL: SearchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+request.getQueryString().replaceAll("&reqType=ajax",""))
								]
			render (contentType:"text/json"){jsonReturn}
		}
		else{
	        render(view: "results", model: [
				results: resultsItems,
				viewType:  urlQuery["viewType"],
				facets: [mainFacetsUrl: mainFacetsUrl],
				resultsPaginatorOptions: resultsPaginatorOptions,
				resultsOverallIndex:resultsOverallIndex, 
				pagesOverallIndex: pagesOverallIndex,
				paginationURL: SearchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+request.getQueryString())
			])
		}
    }
}