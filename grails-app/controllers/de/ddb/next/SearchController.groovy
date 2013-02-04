package de.ddb.next
import java.util.List;

import net.sf.json.JSONArray
import org.apache.commons.lang.builder.ReflectionToStringBuilder
import grails.converters.JSON
import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder


class SearchController {
	
	static defaultAction = "results"

    def results() { 
		def query = [ client: "DDB-NEXT" ]
		if (params.q!=null){
			query = [ query: params.q ]
		}
		def results = ItemResult.getAllItemsResult(query, grailsApplication.config.ddb.wsItemResults.toString())
		def pagesOverallIndex = message(code:"ddbnext.Page")+" 1 "+message(code:"ddbnext.Of")+" xxxxx"
		
		render(view: "results", model: [results: results, pagesOverallIndex: pagesOverallIndex])
	}
}
