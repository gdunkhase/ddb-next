class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?"{
            constraints {
                // apply constraints here
            }

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

            "500"(view:'/error')
        }
    }
}
