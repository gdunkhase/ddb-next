package de.ddb.next
import org.apache.commons.lang.builder.ReflectionToStringBuilder
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
		def unstructuredcontent=retrieveArguments(response)
		//		def myRegularExpression = /\{id=+(*.)+\]}/
		//		def matcher = ( unstructuredcontent =~ myRegularExpression )
		//		if (matcher.matches()) {
		//			println(matcher.getCount()+ " occurrence of the regular expression was found in the string.");
		//
		//		}
		def map= retrieveArguments(response)
		render(view: "results", model: map)
	}
	
	private def retrieveArguments(def content){
		def slurper = new JsonSlurper()
		def jsonObject = slurper.parseText(content.toString())
		def results = jsonObject.get("results");
		def hashResults= results.get(0).get("docs")
	
		//println new ReflectionToStringBuilder(hashResults).toString()
		return [content:jsonObject,randomSeed:jsonObject.get("randomSeed"),hashResults:hashResults,results:jsonObject.get("results"),numberOfResults:jsonObject.get("numberOfResults"),facets:jsonObject.get("facets"),highlightedTerms:jsonObject.get("highlightedTerms")]

	}
}
