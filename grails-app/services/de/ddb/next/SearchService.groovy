package de.ddb.next

import javax.servlet.http.HttpServletRequest
import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap

class SearchService {
    private static final facetsList = ["time_fct", "place_fct", "affiliate_fct", "keywords_fct", "language_fct", "type_fct", "sector_fct", "provider_fct"]
    
    static def getFacets(GrailsParameterMap reqParameters, LinkedHashMap urlQuery, String key, int currentDepth){
        List facetValues = []
        def facets = urlQuery
        facets["facet"] = []
        if(reqParameters.get("facetValues[]").getClass().isArray()){
            reqParameters.get("facetValues[]").each{
                facetValues.add(it)
            }
        }else{
        facetValues.add(reqParameters.get("facetValues[]").toString())
        }
        facetValues.each {
            def tmpVal = java.net.URLDecoder.decode(it.toString(), "UTF-8")
            List tmpSubVal = tmpVal.split("=")
            if(!facets["facet"].contains(tmpSubVal[0]))
            facets["facet"].add(tmpSubVal[0].toString())
            if(!facets[tmpSubVal[0]]){
                facets[tmpSubVal[0]]=[tmpSubVal[1]]
            }else
        facets[tmpSubVal[0]].add(tmpSubVal[1])
        }
        return facets
    }
    
    static def facetValuesToString(facetValues){
        def res = ""
        def newFacetValues = []
        if(facetValues != null){
            if(facetValues.getClass().isArray()){
                newFacetValues = facetValues
            }else{
            newFacetValues.add(facetValues)
            }
            newFacetValues.each{
                res += "&facetValues%5B%5D="+it
            }
        }
        
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
        
        return mainFacetsUrls
    }
    
    static def buildSubFacetsUrl(List facets, LinkedHashMap mainFacetsUrl, LinkedHashMap urlQuery){
        def res = [:]
        urlQuery["facet"].each{
            if(it!="grid_preview"){
                facets.each {
                    x->
                    if(x.field == it && x.numberOfFacets>0){
                        res[x.field] = []
                        x.facetValues.each{
                            y->
                            def tmpFacetValuesMap = ["fctValue": y.value,"url":"",cnt: y["count"],selected:""]
                            def tmpUrl = mainFacetsUrl[x.field]
                            if(mainFacetsUrl[x.field].contains(y["value"])){
                                tmpUrl = tmpUrl.replaceAll("&facetValues%5B%5D="+x.field+"="+y["value"],"")
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
    
    static def buildClearFilter(LinkedHashMap urlQuery, String baseURI){
        def res = baseURI+'?'
        urlQuery.each{
            key, value ->
            if(!key.toString().contains("facet") && !key.toString().contains("facetValues[]") && !key.toString().contains("fct")){
                res+='&'+key+'='+value
            }
        }
        return res
    }
    
    static def trimTitle(String title){
        def matches
        def matchesMatch = title =~ /(?m)<match>(.*?)<\/match>/
        def cleanTitle = title.replaceAll("<match>", "").replaceAll("</match>", "")
        def tmpTitle = (cleanTitle.length()>100)?cleanTitle.substring(0,96)+"...":cleanTitle
        if(matchesMatch.size()>0){
            matchesMatch.each{
                tmpTitle = tmpTitle.replaceAll(it[1], "<strong>"+it[1]+"</strong>")
            }
        }
        return tmpTitle
    }
}
