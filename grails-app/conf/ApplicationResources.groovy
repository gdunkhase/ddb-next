/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
        resource url:'/css/results.css'
        resource url:'/css/pdf.css'

        // General Javascripts
        resource url:'/js/onloadManager.js', disposition: 'head'
        resource url:'/js/jquery-1.8.2.min.js', disposition: 'head'
        resource url:'/js/jquery.cookies.2.2.0.min.js', disposition: 'head'
        resource url:'/js/jquery.dotdotdot-1.5.1.js', disposition: 'head'
        resource url:'/js/jquery.carouFredSel-6.2.0-packed.js', disposition: 'head'
        resource url:'/js/vendor/bootstrap-collapse.js', disposition: 'head'
        resource url:'/js/jquery.fancybox.pack.js', disposition: 'head'
        resource url:'/js/underscore-min.js', disposition: 'head'
        resource url:'/jwplayer/jwplayer.js', disposition: 'head'
        resource url:'/js/large-cookie.js', disposition: 'head'
        resource url:'/js/header.js', disposition: 'head'
        resource url:'/js/tooltip.js', disposition: 'head'
        resource url:'/js/json2.js', disposition: 'head' // This file was removed in GIT but still present in dev.escidoc.org: check!
        resource url:'/js/StringBuilder.js', disposition: 'head'
        resource url:'/js/institution-list.js', disposition: 'head'
        resource url:'/js/apis-wrapper.js', disposition: 'head'
    }

    // These are page specific bundles which should be merged back into ddbnext in the second step

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

    institutionlist {
        resource url:'http://www.openlayers.org/api/OpenLayers.js'
        resource url:'/js/map-widget-test.js'
        resource url:'/js/institution-map.js'
    }

    item {
        resource url:'/css/jquery.fancybox.css'
        resource url:'/css/viewer.css'
        resource url:'/css/item-hierarchy.css'
        resource url:'/css/modalDialog.css'
        resource url:'/js/item-hierarchy.js'
        resource url:'/js/binaries-viewer.js'
        resource url:'/js/persistent-links-modal-dialog.js'
    }

    advancedsearch {
        resource url:'/css/advancedsearch.css'
        resource url:'/js/advanced-search-page.js'
    }

    results { resource url:'/js/search-results.js' }

    pdf {
        resource url:'/css/bootstrap.css'//, exclude:'zip'
        resource url:'/css/ddb.css'//, exclude:'zip'
        resource url:'/css/item.css'//, exclude:'zip'
        resource url:'/css/pdf.css'//, exclude:'zip'
    }
}
