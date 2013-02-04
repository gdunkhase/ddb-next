package de.ddb.next

import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder
import net.sf.json.JSONArray

// TODO: format the code according to Code Style
class ItemResult {
  def id
  def view
  def latitude
  def longitude
  def category
  def media
  def title
  def subtitle
  def thumbnail
  def affiliate_fct
  def keywords_fct
  def type_fct
  def sector_fct
  def provider_fct
  def last_update

  static List getAllItemsResult(query,url){
    def res = []
    def json_resp = ApiConsumer.getTextAsJson(url ,'/ddb-next/apis/search', query)
    //print "---->"+json_resp.results["docs"].get(0)
    json_resp.results["docs"].each{
      it ->
      def itr_tmp = new ItemResult()
      itr_tmp.id = it.id
      itr_tmp.title = it.preview.title
      itr_tmp.view = (it.view[0])?it.view[0]:""
      itr_tmp.latitude = it.latitude
      itr_tmp.longitude = it.longitude
      itr_tmp.category = it.category
      itr_tmp.subtitle = it.preview.subtitle
      itr_tmp.thumbnail = it.preview.thumbnail
      itr_tmp.media = it.preview.media
      itr_tmp.affiliate_fct = it.properties.affiliate_fct
      itr_tmp.keywords_fct = it.properties.keywords_fct
      itr_tmp.type_fct = it.properties.type_fct
      itr_tmp.sector_fct = it.properties.sector_fct
      itr_tmp.provider_fct = it.properties.provider_fct
      itr_tmp.last_update = it.properties.last_update
      res.add(itr_tmp)
    }
    return res
  }
}
