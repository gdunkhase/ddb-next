package de.ddb.next

import groovy.util.XmlSlurper
import java.net.URI.Parser
import org.springframework.web.servlet.support.RequestContextUtils as RCU

class ContentController {
	static defaultAction = "staticcontent"

	def staticcontent(){
		def firstLvl="news";
		if (params.dir!=null){
			firstLvl=getFirstLvl();
		}
		def secondLvl = getSecLvl();
		def url = getStaticUrl()
		def lang = getShortLocale()
		def path = "/static/"+lang+"/"+firstLvl+"/index.html"
		if (params.id!=null){
			path = "/static/"+lang+"/"+firstLvl+"/"+secondLvl+".html"
		}
		def query = [ client: "DDB-NEXT" ]
		//Submit a request via GET
		def response = ApiConsumer.getText(url, path, query)
		if (response == "Not found"){
			redirect(controller: "error", action: "notfound")
		}

		def map= retrieveArguments(response)
		render(view: "staticcontent", model: map)

	}

	private def getFirstLvl(){
		String firstLvl = cleanHtml(params.dir, 'none')
		return firstLvl
	}
	
	private String getSecLvl(){		
		if (params.id==null){
			return null
		}
		return cleanHtml(params.id, 'none')
	}

	private def getShortLocale() {
		def locale = RCU.getLocale(request)
		if(locale.toString().substring(0, 2)=="de") {
			return "de"
		}
		return "en"		
	}

	private def getStaticUrl(){
		def url = grailsApplication.config.ddb.static.url
		assert url instanceof String, "This is not a string"
		return url;
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

    private def fetchAuthor(content) {
        def authorMatch = content =~ /(?s)<meta name="author" content="(.*?)" \/>/
        if (authorMatch)
            return authorMatch[0][1]
    }

    private def fetchTitle(content) {
        def titleMatch = content =~ /(?s)<title>(.*?)<\/title>/
        if (titleMatch)
            return titleMatch[0][1]
    }

    private def fetchKeywords(content) {
        def keywordMatch = content =~ /(?s)<meta name="keywords" content="(.*?)" \/>/
        if (keywordMatch)
            return keywordMatch[0][1]
    }

    private def fetchRobots(content) {
        def robotMatch = content =~ /(?s)<meta name="robots" content="(.*?)" \/>/
        if (robotMatch)
            return robotMatch[0][1]
    }
}