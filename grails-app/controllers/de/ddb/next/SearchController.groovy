package de.ddb.next
import net.sf.json.JSONArray
import org.apache.commons.lang.builder.ReflectionToStringBuilder
import grails.converters.JSON
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
		def ress = []
		
		//TODO Give a look to ApiConsumer. THis part is trivial and useless (EMA)
		def slurper = new JsonSlurper()
		def jsonObject = slurper.parseText(response.toString())
		def results = jsonObject.get("results");
		def hashResults= results.get(0).get("docs")
		
		System.out.println (response)
		hashResults.each{
			def tmp_itemRes = new ItemResult(it)
			ress.add(tmp_itemRes)
		}
		
		render(view: "results", model: map)
	}
}
