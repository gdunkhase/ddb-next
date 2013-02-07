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
		def resultsOverallIndex = (urlQuery["offset"].toInteger()+1)+' - ' +(urlQuery["offset"].toInteger()+urlQuery["rows"].toInteger()+1)
		def pagesOverallIndex = message(code:"ddbnext.Page")+" 1 "+message(code:"ddbnext.Of")+" xxxxx"
        render(view: "results", model: [results: results, resultsOverallIndex:resultsOverallIndex, pagesOverallIndex: pagesOverallIndex])
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
}