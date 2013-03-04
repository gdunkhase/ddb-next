class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?"{ constraints {
                // apply constraints here
            } }

        "/search/$q?" {
            controller="search"
            action=results
        }
        
        "/facets/$q?" {
            controller="facets"
            action=facetsList
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

        "500"(controller: "error", action: "serverError")

        "404"(controller: "error", action: "notFound")
        
    }
}
