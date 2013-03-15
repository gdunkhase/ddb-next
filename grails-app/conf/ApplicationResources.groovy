modules = {
    ddbnext {
        defaultBundle 'ddbnext'

        // Images
        resource url:'/images/favicon.ico'

        // CSS
        resource url:'/css/bootstrap.css'
        resource url:'/css/bootstrap-responsive.css'
        resource url:'/css/ddb.css'
        resource url:'/css/item.css'
        resource url:'/css/institutionList.css'

        // General Javascripts
        resource url:'/js/onloadManager.js'
        resource url:'/js/jquery-1.8.2.min.js'
        resource url:'/js/jquery.cookies.2.2.0.min.js'
        resource url:'/js/jquery.dotdotdot-1.5.1.js'
        resource url:'/js/jquery.carouFredSel-6.2.0-packed.js'
        resource url:'/js/vendor/bootstrap-collapse.js'
        resource url:'/js/jquery.fancybox.pack.js'
        resource url:'/js/underscore-min.js'
        resource url:'/jwplayer/jwplayer.js'
        resource url:'/js/large-cookie.js'
        resource url:'/js/tooltip.js'
        //        resource url:'/js/ddb.min.js'
        //        resource url:'/js/dateformat.min.js'
        //        resource url:'/js/knockout-latest.js'
        //        resource url:'/js/json2.js'
        //        resource url:'/js/jquery.microdata.js'
        //        resource url:'/js/rx.js'
        //        resource url:'/js/rx.jQuery.js'
        //        resource url:'/js/knockout.mapping-latest.js'
        //        resource url:'/js/amplify.min.js'


        // Page specific Javascripts
        resource url:'/js/advanced-search-page.js'
        resource url:'/js/institution-list.js'
        resource url:'/js/header.js'
        resource url:'/js/start-page.js'
        resource url:'/js/item-hierarchy.js'
        resource url:'/js/binaries-viewer.js'
    }

    // These are page specific bundles which should be merged back into ddbnext in the second step

    openstreetmap {
        resource url:'http://www.openlayers.org/api/OpenLayers.js'
        resource url:'http://www.openstreetmap.org/openlayers/OpenStreetMap.js'
        resource url:'/js/ddb.osm.institutiondetailview.js'
    }

    startpage {
        resource url:'/css/start-page.css'
        resource url:'/js/start-page.js'
    }

    staticcontent { resource url:'/css/staticcontent.css' }

    error { resource url:'/css/error.css' }

    institution {
        resource url:'/css/institution.css'
        resource url:'http://www.openlayers.org/api/OpenLayers.js'
        resource url:'http://www.openstreetmap.org/openlayers/OpenStreetMap.js'
        resource url:'/js/ddb.osm.institutiondetailview.js'
    }

    item {
        resource url:'/css/jquery.fancybox.css'
        resource url:'/css/viewer.css'
        resource url:'/css/item-hierarchy.css'
        resource url:'/js/item-hierarchy.js'
        resource url:'/js/binaries-viewer.js'
    }

    advancedsearch { resource url:'/css/advancedsearch.css' }

    results { resource url:'/css/results.css' }
}