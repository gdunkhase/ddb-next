package de.ddb.next

import groovy.util.XmlSlurper
import java.net.URI.Parser
import org.springframework.web.servlet.support.RequestContextUtils as RCU

import de.ddb.next.exception.ItemNotFoundException;

class ContentController {
    static defaultAction = "staticcontent"

    def staticcontent(){
        try{

            def firstLvl="news";
            if (params.dir!=null){
                firstLvl=getFirstLvl();
            }
            def browserUrl = request.forwardURI

            //Check if the called url ends with "/content/help" (invalid) or "/content/help/" (valid).
            //If the url does not end with "/", make a redirect, otherwise the relative linking
            //in the static pages won't work: see DDBNEXT-145
            if(browserUrl?.endsWith(firstLvl)){
                redirect uri: browserUrl+"/"
                return
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
                throw new ItemNotFoundException()
            }

            def map= retrieveArguments(response)
            render(view: "staticcontent", model: map)

        } catch(ItemNotFoundException infe){
            log.error "staticcontent(): Request for nonexisting item with id: '" + params?.dir + "'. Going 404..."
            forward controller: "error", action: "notFound"
        }
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
        def bodyMatch = content =~ /(?s)<body\b[^>]*>(.*?)<\/body>/
        return bodyMatch[0][1]
    }

    private def fetchAuthor(content) {
        def authorMatch = content =~ /(?s)<meta name="author" content="(.*?)" \/>/
        if (authorMatch)
            return authorMatch[0][1]
    }

    private def fetchTitle(content) {
        def titleMatch = content =~ /(?s)<title\b[^>]*>(.*?)<\/title>/
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