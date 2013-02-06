class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?"{ constraints {
                // apply constraints here
            } }

        "/search/$q?" {
            controller="search"
            action=results
        }

        "/advancedsearch" {
            controller="advancedsearch"
            action=[GET: "fillValues", POST: "executeSearch"]
        }
        "/" {
            controller="index"
            action=index
        }
        "/item/$id" {
            controller="item"
            action=findById
        }

		"/about-us/institutions/item/$id" {
			controller="institution"
			action=findById
		}

        "500"(view:'/error')
    }
}
