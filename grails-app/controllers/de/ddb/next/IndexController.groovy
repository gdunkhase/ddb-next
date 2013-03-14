package de.ddb.next
import org.springframework.web.servlet.support.RequestContextUtils as RCU

class IndexController {

    def index() {
        try{
            def path
            def staticUrl = grailsApplication.config.ddb.static.url
            def locale = RCU.getLocale(request)

            if(locale.toString().substring(0, 2)=="de") {
                path = "/static/"+SupportedLocales.DE.getISO2()+"/homepage.xml"
            }
            else {
                path = "/static/"+SupportedLocales.EN.getISO2()+"/homepage.xml"
            }

            def query = [ client: "DDB-NEXT" ]
            // Submit a request via GET
            def response = ApiConsumer.getText(staticUrl, path, query)

            if (response == "Not found"){
                forward controller: "error", action: "notfound"
                return;
            }

            def articles=retrieveArguments(response)

            render(view: "index", model: [articles: articles, staticUrl: staticUrl])

        } catch(MissingPropertyException mpe){
            log.error "index(): There was a missing property.", mpe
            forward controller: "error", action: "serverError"
        } catch(Exception e) {
            log.error "index(): An unexpected error occured.", e
            forward controller: "error", action: "serverError"
        }

    }

    private def retrieveArguments(def content){
        def title = fetchTitle(content)
        def uri = fetchUri(content)
        def src = fetchSrc(content)
        def articles = new ArrayList()
        def article
        if (title != null) {
            for(def i=0; i<title.size() ; i++) {
                article = [title:title[i][1], uri:uri[i][1], src:src[i][1]]
                articles.add(article)
            }
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
