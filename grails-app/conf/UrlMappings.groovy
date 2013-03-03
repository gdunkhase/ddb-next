class UrlMappings {

    static mappings = {


        //@formatter:off
        "/$controller/$action?/$id?"{ constraints { /* apply constraints here */ } }
        //@formatter:on

        "/search/$q?" {
            controller="search"
            action="results"
        }

        "/advancedsearch" {
            controller="advancedsearch"
            action=[GET: "fillValues", POST: "executeSearch"]
        }

        "/" {
            controller="index"
            action="index"
        }

        "/item/$id" {
            controller="item"
            action="findById"
        }

        "/about-us/institutions" {
            controller="institution"
            action="show"
        }

        "/about-us/institutions/item/$id" {
            controller="institution"
            action="readByItemId"
        }

        "/apis/institutions" {
            controller="institution"
            action="getJson"
        }

        "500"(view:'/error')
    }
}
