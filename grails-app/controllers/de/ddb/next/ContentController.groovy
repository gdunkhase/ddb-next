package de.ddb.next

import groovy.util.XmlSlurper
import java.net.URI.Parser
import org.springframework.web.servlet.support.RequestContextUtils as RCU

// TODO: do we still need this class?
class ContentController {
	static defaultAction = "news"

	def staticcontent(){
		if ((params.dir==null) && (params.dir=="news")){
			forward action: "news"
		}else{
			def firstLvl =getFirstLvl();
		}
		
	}
	def news() {
		def url = getStaticUrl()
		def lang = getShortLocale()
		def path = "/static/"+lang+"/news/index.html"
		if (params.id!=null){
			path = "/static/"+lang+"/news/"+params.id+".html"
		}
		def query = [ client: "DDB-NEXT" ]
		//Submit a request via GET
		def response = ApiConsumer.getText(url, path, query)

        if (response == "Not found"){
			redirect(controller: "error", action: "notfound")
        }

		def map= retrieveArguments(response)
		render(view: "news", model: map)
    }
	
	private String getFirstLvl(){
		String firstLvl = cleanHtml(params.dir, 'none')
		return firstLvl
	}

	private String getShortLocale() {
		def locale = RCU.getLocale(request)
		if(locale.toString().substring(0, 2)=="de") {
			return "de"
		}
		return "en"		
	}

	def getStaticUrl(){
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

    private fetchAuthor(content) {
        def authorMatch = content =~ /(?s)<meta name="author" content="(.*?)" \/>/
        if (authorMatch)
            return authorMatch[0][1]
    }

    private def fetchTitle(content) {
        def titleMatch = content =~ /(?s)<title>(.*?)<\/title>/
        if (titleMatch)
            return titleMatch[0][1]
    }

    private fetchKeywords(content) {
        def keywordMatch = content =~ /(?s)<meta name="keywords" content="(.*?)" \/>/
        if (keywordMatch)
            return keywordMatch[0][1]
    }

    private fetchRobots(content) {
        def robotMatch = content =~ /(?s)<meta name="robots" content="(.*?)" \/>/
        if (robotMatch)
            return robotMatch[0][1]
    }
}
