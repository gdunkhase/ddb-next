package de.ddb.next

import grails.converters.JSON
import groovy.json.JsonSlurper
import net.sf.json.JSONNull
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
	  
    if(params.facet){
		if(params.facet.getClass().isArray()){
			query["facet"] = []
			params.facet.each {
				query["facet"].add(it)
			}
		}else query["facet"]=params.facet
	}
    if(params.minDocs)
      query["minDocs"] = params.minDocs
	  
    if(params.sort)
      query["sort"] = params.sort
	  
	if(params.time_fct){
		if(params.time_fct.getClass().isArray()){
			query["time_fct"] = []
			params.time_fct.each {
				query["time_fct"].add(it)
			}
		}else query["time_fct"]=params.time_fct
	}
	
	if(params.place_fct){
		if(params.place_fct.getClass().isArray()){
			query["place_fct"] = []
			params.place_fct.each {
				query["place_fct"].add(it)
			}
		}else query["place_fct"]=params.place_fct
	}
	
	if(params.affiliate_fct){
		if(params.affiliate_fct.getClass().isArray()){
			query["affiliate_fct"] = []
			params.affiliate_fct.each {
				query["affiliate_fct"].add(it)
			}
		}else query["affiliate_fct"]=params.affiliate_fct
	}
	
	if(params.keywords_fct){
		if(params.keywords_fct.getClass().isArray()){
			query["keywords_fct"] = []
			params.keywords_fct.each {
				query["keywords_fct"].add(it)
			}
		}else query["keywords_fct"]=params.keywords_fct
	}
	
	if(params.language_fct){
		if(params.language_fct.getClass().isArray()){
			query["language_fct"] = []
			params.language_fct.each {
				query["language_fct"].add(it)
			}
		}else query["language_fct"]=params.language_fct
	}
	
	if(params.type_fct){
		if(params.type_fct.getClass().isArray()){
			query["type_fct"] = []
			params.type_fct.each {
				query["type_fct"].add(it)
			}
		}else query["type_fct"]=params.type_fct
	}
	
	if(params.sector_fct){
		if(params.sector_fct.getClass().isArray()){
			query["sector_fct"] = []
			params.sector_fct.each {
				query["sector_fct"].add(it)
			}
		}else query["sector_fct"]=params.sector_fct
	}
	
	if(params.provider_fct){
		if(params.provider_fct.getClass().isArray()){
			query["provider_fct"] = []
			params.provider_fct.each {
				query["provider_fct"].add(it)
			}
		}else query["provider_fct"]=params.provider_fct
	}
	
	if(params.grid_preview){
		query["grid_preview"]=params.grid_preview
	}
	println request.forwardURI+'?'+request.getQueryString()
    def jsonResp = ApiConsumer.getTextAsJson(grailsApplication.config.ddb.wsbackend.toString(),'/search', query)
    jsonResp.results["docs"].get(0).each{

      def tmpResult = [:]
	  
	  def title
      def subtitle
      def thumbnail
      def media = []
	  
	  def titleMatch = it.preview.toString() =~ /(?m)<div class="title">(.*?)<\/div>$/
	  if (titleMatch)
		title= titleMatch[0][1]

      def subtitleMatch = it.preview.toString() =~ /(?m)<div class="subtitle">(.*?)<\/div>$/
      subtitle= (subtitleMatch)?subtitleMatch[0][1]:""

      def thumbnailMatch = it.preview.toString() =~ /(?m)<img src="(.*?)" \/>$/
      if (thumbnailMatch)
        thumbnail= thumbnailMatch[0][1]

      def mediaMatch = it.preview.toString() =~ /(?m)<div data-media="(.*?)"/
      if (mediaMatch)
	  	mediaMatch[0][1].split (",").each{
			  media.add(it)
		  }	

      tmpResult["id"] = it.id
      tmpResult["view"] = (!it.view instanceof JSONNull)?it.view:""
      tmpResult["label"] = (!it.label instanceof JSONNull)?it.label:""
      tmpResult["latitude"] = (!it.latitude instanceof JSONNull)?it.latitude:""
      tmpResult["longitude"] = (!it.longitude instanceof JSONNull)?it.longitude:""
      tmpResult["category"] = (!it.category instanceof JSONNull)?it.category:""

      def path = grailsApplication.config.ddb.wsbackend.toString()+'/access/'+it.id+'/components/indexing-profile'

      def xmlSubresp = ApiConsumer.getTextAsXml(grailsApplication.config.ddb.wsbackend.toString(),'/access/'+it.id+'/components/indexing-profile', [:])
      def jsonSubresp = new JsonSlurper().parseText(xmlSubresp.toString())
	  
	  def affiliateFct = (jsonSubresp.properties.affiliate_fct)? jsonSubresp.properties.affiliate_fct: ""
	  def keywordsFct = (jsonSubresp.properties.keywords_fct)?jsonSubresp.properties.keywords_fct: ""
	  def typeFct = (jsonSubresp.properties.type_fct)?jsonSubresp.properties.type_fct: ""
	  def sectorFct = (jsonSubresp.properties.sector_fct)?jsonSubresp.properties.sector_fct: ""
	  def providerFct = (jsonSubresp.properties.provider_fct)?jsonSubresp.properties.provider_fct: ""
	  
      def properties = [affiliate_fct:affiliateFct, keywords_fct:keywordsFct, type_fct:typeFct, sector_fct:sectorFct, provider_fct:providerFct, last_update: jsonSubresp.properties.last_update ]

      tmpResult["preview"] = [title:title, subtitle: subtitle, media: media, thumbnail: thumbnail]
      tmpResult["properties"] = properties

      docs.add(tmpResult)
    }
    resultList["facets"] = jsonResp.facets
    resultList["highlightedTerms"] = jsonResp.highlightedTerms
    resultList["results"] = [name:jsonResp.results.name,docs:docs,numberOfDocs:jsonResp.results.numberOfDocs]
    resultList["numberOfResults"] = jsonResp.numberOfResults
    resultList["randomSeed"] = jsonResp.randomSeed
	println jsonResp.numberOfResults
	render (contentType:"text/json"){resultList}
  }
}
