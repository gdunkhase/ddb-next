package de.ddb.next
import groovy.util.XmlSlurper
import java.net.URI.Parser
import de.ddb.next.ApiConsumer;

class IndexController {
	
	def url = "http://141.66.130.151:8003"
	
	def index() {
		def lang = "de"
		def path = "/static/"+lang+"/homepage.xml"
		def query = [ client: "DDB-NEXT" ]
		// Submit a request via GET
		def response = ApiConsumer.getText(url, path, query)

		if (response == "Not found"){
			redirect(controller: "error", action: "notfound")
		}

		def articles=retrieveArguments(response)
		
		System.out.println ("----->"+articles.size())
		System.out.println ("----->"+articles.title)
		System.out.println ("----->"+articles.uri)
		System.out.println ("----->"+articles.src)
		render(view: "index", model: [articles: articles])
	}

	private def retrieveArguments(def content){
		def title = fetchTitle(content)
		def uri = fetchUri(content)
		def src = fetchSrc(content)
		def article
		def articles
		for(def i=0; i<title[0].size ; i++){
			System.out.println ("----->"+title[i][1])
			System.out.println ("----->"+uri[i][1])
			System.out.println ("----->"+src[i][1])
			def t=title[i][1]
			def u=uri[i][1]
			def s=src[i][1]
			 article = [title:t, uri:u, src:i]
			 articles.add(article)
		}	
		return articles
	}
    
	private def fetchTitle(content) {
		def titleMatch = content =~ /(?s)<caption>(.*?)<\/caption>/
		if (titleMatch)
			return titleMatch
		else return titleMatch="debugTitle";
	}

	private def fetchUri(content) {
		def uriMatch = content =~ /(?s)<uri>(.*?)<\/uri>/
		if (uriMatch)
			return uriMatch
		else return uriMatch="debugUri";
	}
	
	private def fetchSrc(content) {
		def imageUriMatch = content =~ /(?s)<imageUri>(.*?)<\/imageUri>/
		if (imageUriMatch)
			return imageUriMatch
		else return imageUriMatch="debugImageUri";
	}
}
