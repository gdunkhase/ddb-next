package de.ddb.next
import groovy.util.XmlSlurper
import java.net.URI.Parser
import de.ddb.next.ApiConsumer;

import org.springframework.web.servlet.support.RequestContextUtils as RCU

// TODO: do we need this class?
class IndexController {

  def index() {
      try{
    def langDe = "de"
    def langEn = "en"
    def path
    def locale = RCU.getLocale(request)
    grailsApplication.config.locale = locale

    if(locale.toString().substring(0, 2)=="de") {
      path = "/static/"+langDe+"/homepage.xml"
    }
    else {
      path = "/static/"+langEn+"/homepage.xml"
    }

      def query = [ client: "DDB-NEXT" ]
    // Submit a request via GET
    def response = ApiConsumer.getText(grailsApplication.config.ddb.static.url, path, query)

    if (response == "Not found"){
      redirect(controller: "error", action: "notfound")
    }

    def articles=retrieveArguments(response)

    render(view: "index", model: [articles: articles])
    
      } catch(MissingPropertyException mpe){
          log.error("index(): There was a missing property. Check your Config.groovy!", mpe)
          forward controller: "error", action: "serverError"
      } catch(Exception e) {
          log.error("index(): An unexpected error occured.", e)
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
