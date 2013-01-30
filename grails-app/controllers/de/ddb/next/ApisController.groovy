package de.ddb.next

import grails.converters.JSON
import groovy.json.JsonSlurper
import org.json.simple.JSONValue

class ApisController {

    def search(){
		def resultList = [:]
		def facets = []
		def highlightedTerms = []
		def docs = []
		def query = [ query: params.query ]
		if(params.offset)
			query["offset"]= params.offset
		if(params.rows)
			query["rows"] = params.rows
		if(params.facet)
			query["facet"] = params.facet
		if(params.minDocs)
			query["minDocs"] = params.minDocs
		if(params.sort)
			query[sort] = params.sort
		
		def json_resp = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsbackend.toString(),'/search', query)
		json_resp.results["docs"].get(0).each{
			
			def tmpResult = [:]
			
			def subtitle
			def thumbnail
			def media
			
			def subtitleMatch = it.preview.toString() =~ /(?m)<div class="subtitle">(.*?)<\/div>$/
			if (subtitleMatch)
				subtitle= subtitleMatch[0][1]
			
			def thumbnailMatch = it.preview.toString() =~ /(?m)<img src="(.*?)" \/>$/
			if (thumbnailMatch)
				thumbnail= thumbnailMatch[0][1]
			
			def mediaMatch = it.preview.toString() =~ /(?m)<div data-media="(.*?)>$/
			if (mediaMatch)
				media= thumbnailMatch[0][1]
				
			tmpResult["id"] = it.id
			tmpResult["view"] = it.view
			tmpResult["label"] = it.label
			tmpResult["latitude"] = it.latitude
			tmpResult["longitude"] = it.longitude
			tmpResult["category"] = it.category
			
			def path = grailsApplication.config.ddb.wsbackend.toString()+'/access/'+it.id+'/components/indexing-profile'
			
			def xml_subresp = ApiConsumer.getTextAsXml(grailsApplication.config.ddb.wsbackend.toString(),'/access/'+it.id+'/components/indexing-profile', [:])
			def json_subresp = new JsonSlurper().parseText(xml_subresp.toString())
			def properties = [affiliate_fct:json_subresp.properties.affiliate_fct, keywords_fct:json_subresp.properties.keywords_fct, type_fct:json_subresp.properties.type_fct, sector_fct:json_subresp.properties.sector_fct, provider_fct:json_subresp.properties.provider_fct, last_update:json_subresp.properties.last_update ]
			
			tmpResult["preview"] = [title:it.label, subtitle: subtitle, media: media, thumbnail: thumbnail]
			tmpResult["properties"] = properties
			
			docs.add(tmpResult)
		}
		resultList["facets"] = json_resp.facets
		resultList["highlightedTerms"] = json_resp.highlightedTerms
		resultList["results"] = [name:json_resp.results.name,docs:docs,numberOfDocs:json_resp.results.numberOfDocs]
		resultList["numberOfResults"] = json_resp.numberOfResults
		resultList["randomSeed"] = json_resp.randomSeed
		render(view: "response", model: [res:JSONValue.toJSONString(resultList)])
	}
}
