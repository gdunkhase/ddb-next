package de.ddb.next

import java.security.MessageDigest;

import javax.servlet.http.HttpServletRequest

import org.codehaus.groovy.grails.web.servlet.mvc.GrailsParameterMap

import org.springframework.context.MessageSource
import org.springframework.context.i18n.LocaleContextHolder

/**
 * Set of services used in the SearchController for views/search
 * 
 * @author ema
 *
 */

class SearchService {
    
    //Autowire the grails application bean
    def grailsApplication
    
    private static facetsList = ["time_fct", "place_fct", "affiliate_fct", "keywords_fct", "language_fct", "type_fct", "sector_fct", "provider_fct"]
    
    def transactional=false
    
    def getFacets(GrailsParameterMap reqParameters, LinkedHashMap urlQuery, String key, int currentDepth){
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
    
    def facetValuesToString(facetValues){
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
    
    def buildMainFacetsUrl(GrailsParameterMap reqParameters, LinkedHashMap urlQuery, HttpServletRequest requestObject){
        def mainFacetsUrls = [:]
        facetsList.each {
            def searchQuery = (urlQuery["query"]) ? urlQuery["query"] : ""
            if(urlQuery["facet"] && urlQuery["facet"].contains(it)){
                mainFacetsUrls.put(it,requestObject.forwardURI+'?query='+searchQuery+"&offset=0&rows="+urlQuery["rows"]+facetValuesToString(reqParameters.get("facetValues[]")))
            }
            else{
                mainFacetsUrls.put(it,requestObject.forwardURI+'?query='+searchQuery+"&offset=0&rows="+urlQuery["rows"]+"&facets%5B%5D="+it+facetValuesToString(reqParameters.get("facetValues[]")))
            }
        }
        
        return mainFacetsUrls
    }
    
    def buildSubFacetsUrl(List facets, LinkedHashMap mainFacetsUrl, LinkedHashMap urlQuery){
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
    
    /**
     * 
     * Build the list of facets to be rendered in the non javascript version of search results
     * 
     * @param urlQuery
     * @return list of all facets filtered
     */
    def buildSubFacets(LinkedHashMap urlQuery){
        def emptyFacets = this.facetsList.clone()
        def res = []
        //We want only the first 10 facets
        urlQuery["facet.limit"] = 10
        urlQuery["facet"].each{
            if(it != "grid_preview"){
                emptyFacets.remove(it)
                def tmpUrlQuery = urlQuery.clone()
                tmpUrlQuery["rows"]=1
                tmpUrlQuery["offset"]=0
                tmpUrlQuery.remove(it)
                ApiConsumer.getTextAsJson(grailsApplication.config.ddb.apis.url.toString() ,'/apis/search', tmpUrlQuery).facets.each{
                    facet->
                    if(facet.field==it){
                        res.add(facet)
                    }
                }
            }
        }
        //fill the remaining empty facets
        emptyFacets.each{
            res.add([field: it, numberOfFacets: 0, facetValues: []])
        }
        return res
    }
    
    def buildPagination(int resultsNumber, LinkedHashMap queryParameters, String getQuery){
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
    
    def buildPaginatorOptions(LinkedHashMap queryMap){
        def pageFilter = [10,20,40,60,100]
        if(!pageFilter.contains(queryMap["rows"].toInteger()))
            pageFilter.add(queryMap["rows"].toInteger())
        return [pageFilter: pageFilter.sort(), pageFilterSelected: queryMap["rows"].toInteger(), sortResultsSwitch: queryMap["sort"]]
    }
    
    def buildClearFilter(LinkedHashMap urlQuery, String baseURI){
        def res = baseURI+'?'
        urlQuery.each{
            key, value ->
            if(!key.toString().contains("facet") && !key.toString().contains("facetValues[]") && !key.toString().contains("fct")){
                res+='&'+key+'='+value
            }
        }
        return res
    }
    
    /**
     * 
     * Gives you back the HTML title with "strong" attributes trimmed to desired length
     * 
     * @param title
     * @param length
     * @return String title
     */
    def trimTitle(String title, int length){
        def matches
        def matchesMatch = title =~ /(?m)<match>(.*?)<\/match>/
        def cleanTitle = title.replaceAll("<match>", "").replaceAll("</match>", "")
        def tmpTitle = (cleanTitle.length()>length)?cleanTitle.substring(0,length-3)+"...":cleanTitle
        if(matchesMatch.size()>0){
            matchesMatch.each{
                tmpTitle = tmpTitle.replaceAll(it[1], "<strong>"+it[1]+"</strong>")
            }
        }
        return tmpTitle
    }

    /**
     * Generate Map that can be used to call Search on Search-Server
     * 
     * @param reqParameters
     * @return Map with keys used for Search on Search-Server
     */
    def convertQueryParametersToSearchParameters(GrailsParameterMap reqParameters) {
        def urlQuery = [:]
        if (reqParameters.query!=null){
            urlQuery["query"] = reqParameters.query
        }else{
            urlQuery["query"] = "*"
        }

        if (reqParameters.rows == null) {
            urlQuery["rows"] = 20.toInteger()
        }
        else {
            urlQuery["rows"] = reqParameters.rows.toInteger()
        }
        reqParameters.rows = urlQuery["rows"]
        
        if (reqParameters.offset == null) {
            urlQuery["offset"] = 0.toInteger()
        }
        else {
            urlQuery["offset"] = reqParameters.offset.toInteger()
        }
        reqParameters.offset = urlQuery["offset"]
        
        //<--input query=rom&offset=0&rows=20&facetValues%5B%5D=time_fct%3Dtime_61800&facetValues%5B%5D=time_fct%3Dtime_60100&facetValues%5B%5D=place_fct%3DItalien
        //-->output query=rom&offset=0&rows=20&facet=time_fct&time_fct=time_61800&facet=time_fct&time_fct=time_60100&facet=place_fct&place_fct=Italien
        if(reqParameters["facetValues[]"]){
            urlQuery = this.getFacets(reqParameters, urlQuery,"facet", 0)
        }

        if(reqParameters.get("facets[]")){
            urlQuery["facet"] = (!urlQuery["facet"])?[]:urlQuery["facet"]
            if(!urlQuery["facet"].contains(reqParameters.get("facets[]")))
                urlQuery["facet"].add(reqParameters.get("facets[]"))
        }

        if(reqParameters.minDocs)
            urlQuery["minDocs"] = reqParameters.minDocs

        if(reqParameters.sort != null){
             urlQuery["sort"] = reqParameters.sort
        }

        if(reqParameters.viewType == null) {
            urlQuery["viewType"] = "list"
            reqParameters.viewType = "list"
        }
        else {
            urlQuery["viewType"] = reqParameters.viewType
        }

        if(reqParameters.isThumbnailFiltered){
            urlQuery["facet"] = (!urlQuery["facet"])?[]:urlQuery["facet"]
            if(!urlQuery["facet"].contains("grid_preview") && reqParameters.isThumbnailFiltered == "true"){
                urlQuery["facet"].add("grid_preview")
                urlQuery["grid_preview"] = "true"
            }
        }
        return urlQuery
    }
    
    /**
     * Generate Map that contains GET-parameters used for search-request by ddb-next.
     * 
     * @param reqParameters
     * @return Map with keys used for search-request by ddb-next.
     */
    def getSearchGetParameters(Map reqParameters) {
        def searchParams = [:]
        def requiredParams = ["query", "offset", "rows", "sort", "viewType", "clustered", "isThumbnailFiltered", "facetValues[]"]
        for (entry in reqParameters) {
            if (requiredParams.contains(entry.key)) {
                searchParams[entry.key] = entry.value
            }
        }
        return searchParams
    }

    /**
     * Generate Map that contains GET-parameters used for item-detail-request by ddb-next.
     * 
     * @param reqParameters
     * @return Map with keys used for item-detail-request by ddb-next.
     */
    def getItemDetailGetParameters(Map reqParameters) {
        def itemDetailParams = [:]
        def requiredParams = ["query", "offset", "rows", "sort", "viewType", "clustered", "isThumbnailFiltered", "facetValues[]", "firstHit", "lastHit"]
        for (entry in reqParameters) {
            if (requiredParams.contains(entry.key)) {
                itemDetailParams[entry.key] = entry.value
            }
        }
        return itemDetailParams
    }
    
    /**
     * 
     * Used in FacetsController gives you back an array containing the following Map: {facet value, localized facet value, count results} 
     * 
     * @param facets list of facets fetched from the backend
     * @param fctName name of the facet field required
     * @param numberOfElements number of elements to return
     * @return List of Map
     */
    def getSelectedFacetValues(List facets, String fctName, int numberOfElements){
        def res = [type: fctName, values: []]
        facets.each{
            if(it.field==fctName){
                int max = (numberOfElements != -1 && it.facetValues.size()>numberOfElements)?numberOfElements:it.facetValues.size()
                for(int i=0;i<max;i++){
                    res.values.add([value: it.facetValues[i].value, localizedValue: this.getI18nFacetValue(fctName, it.facetValues[i].value.toString()), count: String.format("%,d", it.facetValues[i].count.toInteger())])
                }
            }
        }
        return res
    }
    
    /**
     * 
     * Gives you back the passed facet value internationalized
     * 
     * @param facetName
     * @param facetValue
     * @return String i18n facet value
     */
    def getI18nFacetValue(facetName, facetValue){
        
        def appCtx = grailsApplication.getMainContext()
        
        def res = ""
        
        if(facetName == 'affiliate_fct' || facetName == 'keywords_fct' || facetName == 'place_fct' || facetName == 'provider_fct'){
            res = facetValue
        }
        else if(facetName == 'type_fct'){
            res = appCtx.getMessage('ddbnext.type_fct_'+facetValue, null, LocaleContextHolder.getLocale() )
        }
        else if(facetName == 'time_fct'){
            res = appCtx.getMessage('ddbnext.time_fct_'+facetValue, null, LocaleContextHolder.getLocale())
        }
        else if(facetName == 'language_fct'){
            res = appCtx.getMessage('ddbnext.language_fct_'+facetValue, null, LocaleContextHolder.getLocale())
        }
        else if(facetName == 'sector_fct'){
            res = appCtx.getMessage('ddbnext.sector_fct_'+facetValue, null, LocaleContextHolder.getLocale())
        }
        return res
    }
}
