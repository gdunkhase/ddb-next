/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.ddb.next

import java.util.regex.Pattern;

import net.sf.json.JSONNull
import grails.converters.JSON
import groovy.json.JsonSlurper

class ApisController {

    def apisService

    def search(){

        def resultList = [:]
        def facets = []
        def highlightedTerms = []
        def docs = []
        def query = apisService.getQueryParameters(params)

        def jsonResp = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(),'/search', query)
        jsonResp.results["docs"].get(0).each{

            def tmpResult = [:]
            def title
            def subtitle
            def thumbnail
            def media = []

            def titleMatch = it.preview.toString() =~ /(?m)<div (.*?)class="title"(.*?)>(.*?)<\/div>$/
            if (titleMatch)
                title= titleMatch[0][3]

            def subtitleMatch = it.preview.toString() =~ /(?m)<div (.*?)class="subtitle"(.*?)>(.*?)<\/div>$/
            subtitle= (subtitleMatch)?subtitleMatch[0][3]:""

            def thumbnailMatch = it.preview.toString() =~ /(?m)<img (.*?)src="(.*?)"(.*?)\/>$/
            if (thumbnailMatch)
                thumbnail= thumbnailMatch[0][2]

            def mediaMatch = it.preview.toString() =~ /(?m)<div (.*?)data-media="(.*?)"/
            if (mediaMatch)
                mediaMatch[0][2].split (",").each{ media.add(it) }

            tmpResult["id"] = it.id

            tmpResult["view"] = (it.view instanceof JSONNull)?"":it.view
            tmpResult["label"] = (it.label instanceof JSONNull)?"":it.label
            tmpResult["latitude"] = (it.latitude instanceof JSONNull)?"":it.latitude
            tmpResult["longitude"] = (it.longitude instanceof JSONNull)?"":it.longitude
            tmpResult["category"] = (it.category instanceof JSONNull)?"":it.category

            def properties = [:]

            tmpResult["preview"] = [title:title, subtitle: subtitle, media: media, thumbnail: thumbnail]
            tmpResult["properties"] = properties
            docs.add(tmpResult)
        }
        if(jsonResp.results["docs"].get(0).size()>0){
            apisService.fetchItemsProperties(jsonResp.results["docs"].get(0)).eachWithIndex() {
              obj, i ->
              docs[i].properties = obj
            }
        }
        resultList["facets"] = jsonResp.facets
        resultList["highlightedTerms"] = jsonResp.highlightedTerms
        resultList["results"] = [name:jsonResp.results.name,docs:docs,numberOfDocs:jsonResp.results.numberOfDocs]
        resultList["numberOfResults"] = jsonResp.numberOfResults
        resultList["randomSeed"] = jsonResp.randomSeed
        render (contentType:"text/json"){resultList}
    }
    
    def institutionsmap(){
        def jsonResp = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.url.toString(),'/institutions/map', params)
        render (contentType:"text/json"){jsonResp}
    }
	
	/**
	 * This function should be obsolete once the 
	 * url : "http://backend.deutsche-digitale-bibliothek.de:9998/search/suggest/", would support JSONP and return the callback function
	 * If that happens, the "myautocomplete.js" script should refer to the backend URL and not to this URL.
	 * @return
	 */
	def autocomplete (){
		def query = apisService.getQueryParameters(params)
		def callback = apisService.getQueryParameters(params)
		def result = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.backend.search.autocomplete.url.toString(),'/search/suggest', query)	
		if (callback) {
			render "${params.callback}(${result as JSON})"
		} else {
			render (contentType:"text/json"){result}
		}
	}

	/**
	 * Wrapper to support streaming of files from the backend	
	 * @return OutPutStream
	 */
	def binary(){
		def query = [ client: "DDB-NEXT" ]
		def urlResponse= ApiConsumer.getBinaryContent(getBinaryServerUrl(),getFileNamePath(),query );
		byte[] bytes=urlResponse.get("bytes");
		response.setContentType(urlResponse.get("Content-Type"))
		response.setContentLength(urlResponse.get("Content-Length").toInteger())
		response.setHeader("Content-Disposition", "inline; filename="+getFileNamePath().tokenize('/')[-1])
		response.outputStream << bytes
	}
	
	private def getBinaryServerUrl(){
		def url = grailsApplication.config.ddb.binary.backend.url
		assert url instanceof String, "This is not a string"
		return url;
	}
	
	private def getFileNamePath(){
		String flNamePath = cleanHtml(params.filename, 'none')
		return flNamePath
	}
}
