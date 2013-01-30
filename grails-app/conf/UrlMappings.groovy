class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}
		"/search/$q?" {
			controller="search"
			action=results
		}
		"/" {
			controller="index"
			action=index
		}
		//"/"(view:"/index")
		"500"(view:'/error')
	}
}
