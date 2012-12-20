package de.ddb.next

class ItemController {

    def index() {
		def lang = "de"
		def url = "http://dev-backend.deutsche-digitale-bibliothek.de:9998"
		def path = "/access/"+params.id+"/components/view"
		def query = [ client: "DDB-NEXT" ]
		if (params.id!=null){
			redirect(controller: "error", action: "notfound")
		}
		 
		println url+path
		// Submit a request via GET
		def response = ApiConsumer.getAnyText(url, path, query)
		if (response == "Not found"){
			redirect(controller: "error", action: "notfound")
		}

		//def map= retrieveArguments(response)
		def map = [content : response]
		render(view: "index", model: map)
	}
}
