package de.ddb.next

import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder
import net.sf.json.JSONArray

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
	
	
	/*
	public ItemResult(net.sf.json.JSONObject res){
		this.fillItemResultData(res)
	}
	
	void fillItemResultData(resultData){
		this.id = resultData.id
		this.view = resultData.view
		this.label = resultData.label
		this.latitude = resultData.latitude
		this.longitude = resultData.longitude
		this.category = resultData.category
		//		<cortex-item-preview>
		//  <div data-media="image" data-type="Kultur" class="item">
		//    <div class="title"><match>Berlin</match>, Friedrichstra�e</div>
		//    <div class="subtitle">1880, Hessisches Staatsarchiv Darmstadt, HStAD\R 4 Bildersammlung</div>
		//    <div class="thumbnail">
		//      <img src="/binary/GMUGHNCS3TT326F3VWUWOJP55ILXKCBP/list/1.jpg">
		//    </div>
		//  </div>
		//</cortex-item-preview>
		//		println content
		//		println "#######################"
		def titleMatch = resultData.preview.toString() =~ /(?m)<div class="title">(.*?)<\/div>$/
		if (titleMatch)
			this.title= titleMatch[0][1]
			
		def subtitleMatch = resultData.preview.toString() =~ /(?m)<div class="subtitle">(.*?)<\/div>$/
		if (subtitleMatch)
			this.subtitle= subtitleMatch[0][1]
		
		def thumbnailMatch = resultData.preview.toString() =~ /(?m)<img src="(.*?)>$/
		if (thumbnailMatch)
			this.thumbnail= thumbnailMatch[0][1]
		
	}
	*/
	
	static List getAllItemsResult(query){
		def res = []
		def json_resp = ApiConsumer.getTextAsJson("http://localhost:8080",'/ddb-next/apis/search', query)
		//print "---->"+json_resp.results["docs"].get(0)
		print "---->"+json_resp.results["docs"]
		json_resp.results["docs"].each{
			it ->
			println "**********"+it
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
		//println res
		return res
	}
}
