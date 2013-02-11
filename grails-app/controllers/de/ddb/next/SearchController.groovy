package de.ddb.next


class SearchController {

    static defaultAction = "results"

    def results() {
        def urlQuery = [ client: "DDB-NEXT" ]
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
			urlQuery = getFacets(urlQuery,"facet", 0)
		}
		if(params.minDocs)
			urlQuery["minDocs"] = params.minDocs
		if(params.sort)
			urlQuery["sort"] = params.sort
		def results	= ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsItemResults.toString() ,'/apis/search', urlQuery)
		println "**************"+request.forwardURI+'?'+request.getQueryString()
		def resultsOverallIndex = (urlQuery["offset"].toInteger()+1)+' - ' +((urlQuery["offset"].toInteger()+urlQuery["rows"].toInteger()>results.numberOfResults)?results.numberOfResults:urlQuery["offset"].toInteger()+urlQuery["rows"].toInteger())
		
		def pagesOverallIndex = message(code:"ddbnext.Page")+" "+
								((urlQuery["offset"].toInteger()/urlQuery["rows"].toInteger())+1).toString()+" "+
								message(code:"ddbnext.Of")+" "+
								(Math.ceil(results.numberOfResults/urlQuery["rows"].toInteger()).toInteger())
        render(view: "results", model: [
			results: results, 
			resultsOverallIndex:resultsOverallIndex, 
			pagesOverallIndex: pagesOverallIndex,
			paginationURL: buildPagination(results.numberOfResults, urlQuery, request.forwardURI+'?'+request.getQueryString())
		])
    }
	
	def getFacets(urlQuery, key, currentDepth){
		def res = urlQuery
		res[key] = []
		def facets = []
		def depth = 0
		params.get("facetValues[]").each {
			def subVal = it.split ("=")
			def facet = subVal[currentDepth]
			depth = subVal.size()
			println facet
			if(!facets.contains(facet)){
				println it
				if(!currentDepth){
					facets.add(facet)
					res[key].add(facet)
				}else{
					if(key==subVal[currentDepth-1])
						res[key].add(facet)
				}
			}
		}
		if(currentDepth+1<depth)
			facets.each {
				res = getFacets(res, it, currentDepth+1)
			}
		print "res size: "+res.size()+" res: "+res
		return res
	}
	
	def buildPagination(resultsNumber, queryParameters, getQuery){
		def res = [firstPg:null,lastPg:null,prevPg:null,nextPg:null]
		//if resultsNumber greater rows number no buttons else we can start to create the pagination
		def currentRows = queryParameters.rows.toInteger()
		def currentOffset = queryParameters.offset.toInteger()
		if(!getQuery.contains("rows"))
			getQuery += "&rows=20"
		if(resultsNumber>currentRows){
			//We are not at the first page
			if(currentOffset>0){
				def prevUrl
				def firstUrl
				def offsetPrev = currentOffset - currentRows
				def offsetFirst = 0
				if(getQuery.contains("offset")){
					prevUrl = getQuery.replaceAll('offset='+currentOffset, 'offset='+offsetPrev)
					firstUrl = getQuery.replaceAll('offset='+currentOffset, 'offset='+offsetFirst)
				}else{
					prevUrl = getQuery+'&offset='+offsetPrev
					firstUrl = getQuery+'&offset='+offsetFirst
				}
				res["firstPg"]= firstUrl
				res["prevPg"]= prevUrl
			}
			//We are not at the last page
			if(currentOffset+currentRows<resultsNumber){
				def offsetNext = currentOffset + currentRows
				def offsetLast = ((Math.ceil(resultsNumber/currentRows)*currentRows)-currentRows).toInteger()
				def nextUrl
				def lastUrl
				if(getQuery.contains("offset")){
					nextUrl = getQuery.replaceAll('offset='+currentOffset, 'offset='+offsetNext)
					lastUrl = getQuery.replaceAll('offset='+currentOffset, 'offset='+offsetLast)
				}else{
					nextUrl = getQuery+'&offset='+offsetNext
					lastUrl = getQuery+'&offset='+offsetLast
				}
				res["lastPg"]= lastUrl
				res["nextPg"]= nextUrl
			}
		}
		return res
	}
}