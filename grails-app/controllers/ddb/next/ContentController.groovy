package ddb.next
import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.Method.GET
import static groovyx.net.http.ContentType.TEXT

class ContentController {
	static defaultAction = "news"

	def news() {
		def lang = "de"
		def url = "http://141.66.130.151:8003"
		def path = "/static/"+lang+"/news/index.html"
		def query = [ client: "DDB-NEXT" ]

		// Submit a request via GET
		def response = ApiConsumer.getText(url, path, query)

		if (response == "Not found"){
			 redirect(controller: "error", action: "notfound")
		}

		def map = [content: response]
		render(view: "news", model: map)
	}
}
