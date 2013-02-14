package de.ddb.next

import javax.servlet.http.HttpServletRequest
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap

class SearchService {
	private static final facetsList = ["time_fct", "place_fct", "affiliate_fct", "keywords_fct", "language_fct", "type_fct", "sector_fct", "provider_fct"]
	
	static def getFacets(GrailsParameterMap reqParameters, LinkedHashMap urlQuery, String key, int currentDepth){
		def facetValues = []
		def facets = urlQuery
		facets["facet"] = []
		if(reqParameters.get("facetValues[]").size()>1){
			facetValues = reqParameters.get("facetValues[]")
		}else{
			facetValues.add(reqParameters.get("facetValues[]"))
		}
		facetValues.each {
			def tmpVal = java.net.URLDecoder.decode(it.toString(), "UTF-8")
			def tmpSubVal = tmpVal.split("=")
			if(!facets["facet"].contains(tmpSubVal[0]))
				facets["facet"].add(tmpSubVal[0].toString())
			println "****"+facets["facet"]+" tmpSubVal"+tmpSubVal[0]+it
			if(!facets[tmpSubVal[0]]){
				facets[tmpSubVal[0]]=[tmpSubVal[1]]
			}else
				facets[tmpSubVal[0]].add(tmpSubVal[1])
		}
		print "res size: "+facets.size()+" res: "+facets
		return facets
	}
	
	static def getFacets2(GrailsParameterMap reqParameters, LinkedHashMap urlQuery, String key, int currentDepth){
		def res = urlQuery
		res[key] = []
		def facets = []
		def depth = 0
		def facetValues = []
		if(reqParameters.get("facetValues[]") instanceof java.util.List){
			println "**********"+reqParameters.get("facetValues[]")
			facetValues = reqParameters.get("facetValues[]")
		}else{
			facetValues.add(reqParameters.get("facetValues[]"))
		}
		facetValues.each {
			//it = it.toString().replaceAll("=","%3D")
			def subVal = (it.toString().split ("=").size()==0)?it.toString().split("%3D"):it.toString().split ("=")
			def facet = subVal[currentDepth]
			depth = subVal.size()
			println "boh "+subVal
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
		if(currentDepth+1<depth){
			facets.each {
				res = getFacets(reqParameters, res, it, currentDepth+1)
			}
		}
		print "res size: "+res.size()+" res: "+res
		return res
	}
	
	static def facetValuesToString(facetValues){
		def res = ""
		def newFacetValues = []
		if(facetValues instanceof java.util.List){
			newFacetValues = facetValues
		}else{
			newFacetValues.add(facetValues)
		}
		newFacetValues.each{
			res += "&facetValues%5B%5D="+it
		}
		println "facet values: "+res
		return res
	}
	
	static def buildMainFacetsUrl(GrailsParameterMap reqParameters, LinkedHashMap urlQuery, HttpServletRequest requestObject){
		def mainFacetsUrls = [:]
		facetsList.each {
			if(urlQuery["facet"] && urlQuery["facet"].contains(it))
				mainFacetsUrls.put(it,requestObject.forwardURI+'?query='+urlQuery["query"]+"&offset=0&rows="+urlQuery["rows"]+facetValuesToString(reqParameters.get("facetValues[]")))
			else
				mainFacetsUrls.put(it,requestObject.forwardURI+'?query='+urlQuery["query"]+"&offset=0&rows="+urlQuery["rows"]+"&facets%5B%5D="+it+facetValuesToString(reqParameters.get("facetValues[]")))
		}
		println(mainFacetsUrls)
		return mainFacetsUrls
	}
	
	static def buildSubFacetsUrl(List facets, LinkedHashMap mainFacetsUrl, LinkedHashMap urlQuery){
		def res = [:]
		urlQuery["facet"].each{
			facets.each {
				x->
				if(x.field == it && x.numberOfFacets>0){
					res[x.field] = []
					x.facetValues.each{
						y->
						def tmpFacetValuesMap = ["fctValue": y.value,"url":"",cnt: y["count"],selected:""]
						def tmpUrl = mainFacetsUrl[x.field]
						if(mainFacetsUrl[x.field].contains(y["value"])){
							tmpUrl = tmpUrl.replaceAll("facetValues%5B%5D="+x.field+"%3D"+y["value"],"")
							tmpFacetValuesMap["url"] = tmpUrl
							tmpFacetValuesMap["selected"] = "selected"
						}else{
							tmpUrl += "&facetValues%5B%5D="+x.field+"%3D"+y["value"]
							tmpFacetValuesMap["url"] = tmpUrl
						}
						res[x.field].add(tmpFacetValuesMap)
					}
				}
			}
		}
		return res
	}
	
	static def buildPagination(int resultsNumber, LinkedHashMap queryParameters, String getQuery){
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
	
	static def buildPaginatorOptions(LinkedHashMap queryMap){
		def pageFilter = [10,20,40,60,100]
		if(!pageFilter.contains(queryMap["rows"].toInteger()))
			pageFilter.add(queryMap["rows"].toInteger())
		return [pageFilter: pageFilter.sort(), pageFilterSelected: queryMap["rows"].toInteger(), sortResultsSwitch: queryMap["sort"]]
	}
}
