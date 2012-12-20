package de.ddb.next

import groovy.json.JsonSlurper


class SearchController {
	
	static defaultAction = "results"

    def results() { 
		def lang = "de"
		def url = "http://dev-backend.deutsche-digitale-bibliothek.de:9998"
		def path = "/search"
		def query = [ client: "DDB-NEXT" ]
		if (params.id!=null){
			query = [ query: params.id ]
		}
		 
		println url+path
		// Submit a request via GET
		def response = ApiConsumer.getTextAsJson(url, path, query)
		if (response == "Not found"){
			redirect(controller: "error", action: "notfound")
		}

		def map= retrieveArguments(response)
		render(view: "results", model: map)
	}
	
	private def retrieveArguments(def content){
		def slurper = new JsonSlurper()
		def result = slurper.parseText(content.toString())
		return [content:result]

	}
}
