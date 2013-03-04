class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?"{ constraints {
                // apply constraints here
            } }
        "/about-us/institutions/item/$id" {
            controller="institution"
            action=readByItemId
        }
        "500"(view:'/error')
    }
}
