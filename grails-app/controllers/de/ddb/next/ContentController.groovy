package de.ddb.next
import groovy.util.XmlSlurper
import java.net.URI.Parser

import de.ddb.next.ApiConsumer;

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

		def map= retrieveArguments(response)
		render(view: "news", model: map)
	}

	private def retrieveArguments(def content){
		def title = fetchTitle(content)
		def author = fetchAuthor(content)
		def keywords = fetchKeywords(content)
		def robot = fetchRobots(content)
		def body = fetchBody(content)
		return [title:title, author:author, keywords:keywords,robot:robot,content:body]
		
	}
	
	private def fetchBody(content) {
		def bodyMatch = content =~ /(?s)<body>(.*?)<\/body>/
		return bodyMatch[0][1]
	}

	private fetchAuthor(content) {
		def authorMatch = content =~ /(?s)<meta name="author" content="(.*?)" \/>/
		return authorMatch[0][1]
	}

	private def fetchTitle(content) {
		def titleMatch = content =~ /(?s)<title>(.*?)<\/title>/
		return titleMatch[0][1]
	}
	
	private fetchKeywords(content) {
		def keywordMatch = content =~ /(?s)<meta name="keywords" content="(.*?)" \/>/
		return keywordMatch[0][1]
	}
	
	private fetchRobots(content) {
		def robotMatch = content =~ /(?s)<meta name="robots" content="(.*?)" \/>/
		return robotMatch[0][1]
	}
}
