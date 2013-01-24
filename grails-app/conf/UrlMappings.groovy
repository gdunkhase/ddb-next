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

  "/item/$id?" {
    controller="item"
    action=findById
  }

  "/"(view:"/index")
    "500"(view:'/error')
  }
}
