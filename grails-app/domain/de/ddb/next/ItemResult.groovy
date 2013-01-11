package de.ddb.next

import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder
import net.sf.json.JSONArray

class ItemResult {
	String id
	String view
	String label
	String latitude
	String longitude
	String preview
	String category
	String title
	String subtitle
	String thumbnail
	
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
		//    <div class="title"><match>Berlin</match>, Friedrichstraﬂe</div>
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
	
	static List getAllItemsResult(query){
		def http = new HTTPBuilder("http://dev-backend.deutsche-digitale-bibliothek.de:9998")
		def res = []
		http.get( path: '/search', query: query){ resp, json ->
			println resp.status
			println "================"+query
			//JSONArray itemsResultList = json.getJSONArray(results["docs"])
			//JSONArray itemsResultList = new JsonSlurper().parseText(json.results.toString())
			// itemsResultlist = new JsonSlurper().parseText( json.results["docs"].get(0) )
			json.results["docs"].get(0).each{
				res.add(new ItemResult(it))
			}
		}
		//println res
		return res
	}
}
