package de.ddb.next

class ItemResultRenderTagLib {
  /**
   * Renders the item results.
   *
   * @attr orgs REQUIRED organizations list
   */

  def itemResultRender = { attrs, body ->
    out << body() << renderItems(attrs.results)
   }

  def renderItems(results){
    def res = '<ul class="results-list unstyled">'
    results.each{
      it->
      def res_img_thumb = (it.thumbnail.contains("binary"))? grailsApplication.config.ddb.binary+it.thumbnail : it.thumbnail
      res += '<li class="item bb">'
        res += '<div class="summary row">'
          res += '<div class="span7">'
            res += '<div class="summary-main">'
              res += '<h2 class="title">'
                res += '<a class="persist" href="/item/'+it.id+'" title="'+it.title+'"><strong>'+it.title+'</strong></a>'
              res += '</h2>'
              res += '<div class="subtitle">'+it.subtitle+'</div>'
              res += '<ul class="matches unstyled">'
                res += '<li class="matching-item"><span>'+it.view+'</span></li>'
              res += '</ul>'
            res += '</div>'
            res += '<div class="extra">'
              res += '<ul class="types unstyled">'
                res += '<li class="image" classname="image" title="Bild">Bild</li>'
              res += '</ul>'
            res += '</div>'
          res += '</div>'
          res += '<div class="span2">'
            res += '<div class="thumbnail">'
              res += '<a class="persist" href="/item/'+it.id+'">'
                res += '<img src="'+res_img_thumb+'" alt="'+it.title+'">'
              res += '</a>'
            res += '</div>'
            res += '<div class="information"></div>'
          res += '</div>'
        res += '</div>'
      res += '</li>'
    }
    res += '</ul>'
    return res
  }
}
