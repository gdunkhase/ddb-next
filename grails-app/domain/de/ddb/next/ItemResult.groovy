package de.ddb.next

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
	
	public ItemResult(res){
		this.fillItemResultData(res)
	}
	
	void fillItemResultData(JSONArray resultData){
		this.id = resultData.id
		this.view = resultData.view
		this.label = resultData.label
		this.latitude = resultData.latitude
		this.latitude = resultData.longitude
		this.category = resultData.category
		this.fetchPreviewData(resultData.preview)
	}
	private void fetchPreviewData(previewData) {
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
		def titleMatch = previewData =~ /(?m)<div class="title">(.*?)<\/div>$/
		if (titleMatch)
			this.title= titleMatch[0][1]
			
		def subtitleMatch = previewData =~ /(?m)<div class="subtitle">(.*?)<\/div>$/
		if (subtitleMatch)
			this.subtitle= subtitleMatch[0][1]
		
		def thumbnailMatch = previewData =~ /(?m)<img src="(.*?)>$/
		if (thumbnailMatch)
			this.thumbnail= thumbnailMatch[0][1]
	}
}
