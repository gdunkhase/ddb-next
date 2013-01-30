package de.ddb.next
import groovy.util.XmlSlurper
import java.net.URI.Parser
import de.ddb.next.ApiConsumer;

class IndexController {
	
	def url = "http://141.66.130.151:8003"
	
	def index() {
		
		def langDe = "de"
		def langEn = "en"
		def path
		def msg = g.message(code: "ddbnext.language_fct_ger")
		
		if(msg == "Deutsch")
		  path = "/static/"+langDe+"/homepage.xml"
		else
		  path = "/static/"+langEn+"/homepage.xml"
		
		  def query = [ client: "DDB-NEXT" ]
		// Submit a request via GET
		def response = ApiConsumer.getText(url, path, query)

		if (response == "Not found"){
			redirect(controller: "error", action: "notfound")
		}

		def articles=retrieveArguments(response)
		
		render(view: "index", model: [articles: articles])
	}

	private def retrieveArguments(def content){
		def title = fetchTitle(content)
		def uri = fetchUri(content)
		def src = fetchSrc(content)
		def articles = new ArrayList()
		def article
		for(def i=0; i<title.size() ; i++){
	      article = [title:title[i][1], uri:uri[i][1], src:src[i][1]]
		  articles.add(article)
		}	
		return articles
	}
    
	private def fetchTitle(content) {
		def titleMatch = content =~ /(?s)<caption>(.*?)<\/caption>/
		if (titleMatch)
			return titleMatch
	}

	private def fetchUri(content) {
		def uriMatch = content =~ /(?s)<uri>(.*?)<\/uri>/
		if (uriMatch)
			return uriMatch
	}
	
	private def fetchSrc(content) {
		def imageUriMatch = content =~ /(?s)<imageUri>(.*?)<\/imageUri>/
		if (imageUriMatch)
			return imageUriMatch
	}
}
