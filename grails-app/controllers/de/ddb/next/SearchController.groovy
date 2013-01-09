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
//		println results;
//		Iterator it = results.entrySet().iterator();
//		while (it.hasNext()) {
//			Map.Entry pairs = (Map.Entry)it.next();
//			System.out.println(pairs.getKey());
//			it.remove(); // avoids a ConcurrentModificationException
//		}
//		
//		//println (results.getAt(0))
//		def list = new JsonSlurper().parseText( results.get("docs").toString() )
		
		println new ReflectionToStringBuilder(results ).toString()
		return [content:jsonObject,randomSeed:jsonObject.get("randomSeed"),results:jsonObject.get("results"),numberOfResults:jsonObject.get("numberOfResults"),facets:jsonObject.get("facets"),highlightedTerms:jsonObject.get("highlightedTerms")]

	}
}
