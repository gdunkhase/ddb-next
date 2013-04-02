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
        dependsOn "images, cssscreen, cssprint, javascript"
    }

    images {  resource url:'/images/favicon.ico' }

    cssscreen {
        resource url:'/css/bootstrap.css', bundle: 'screen'
        resource url:'/css/bootstrap-responsive.css', bundle: 'screen'
        resource url:'/css/ddb.css', bundle: 'screen'
        resource url:'/css/autocomplete/css/blitzer/jquery-ui-1.10.2.custom.min.css', bundle: 'screen'
        resource url:'/css/item.css', bundle: 'screen'
        resource url:'/css/institutionList.css', bundle: 'screen'
        resource url:'/css/results.css', bundle: 'screen'
        resource url:'/css/pdf.css', bundle: 'screen'
        resource url:'/css/staticcontent.css', bundle: 'screen'
        resource url:'/css/error.css', bundle: 'screen'
        resource url:'/css/institution.css', bundle: 'screen'
        resource url:'/css/jquery.fancybox.css', bundle: 'screen'
        resource url:'/css/viewer.css', bundle: 'screen'
        resource url:'/css/item-hierarchy.css', bundle: 'screen'
        resource url:'/css/modalDialog.css', bundle: 'screen'
        resource url:'/css/advancedsearch.css', bundle: 'screen'
        resource url:'/css/entity.css', bundle: 'screen'
    }

    cssprint {
        resource url:'/css/ddb.css', attrs:[media:'print'], bundle: 'print'
        resource url:'/css/item.css', attrs:[media:'print'], bundle: 'print'
        resource url:'/css/institutionList.css', attrs:[media:'print'], bundle: 'print'
        resource url:'/css/results.css', attrs:[media:'print'], bundle: 'print'
        resource url:'/css/print.css', attrs:[media:'print'], bundle: 'print'
    }

    javascript {
        resource url:'/js/jquery-1.8.2.min.js'
        resource url:'/js/jquery.cookies.2.2.0.min.js'
        resource url:'/js/jquery.dotdotdot-1.5.1.js'
        resource url:'/js/jquery.carouFredSel-6.2.0-packed.js'
        resource url:'/js/vendor/bootstrap-collapse.js'
        resource url:'/js/jquery.fancybox.pack.js'
        resource url:'/js/underscore-min.js'
        resource url:'/js/autocomplete/js/jquery-ui-1.10.2.custom.min.js'
        resource url:'/js/myautocomplete.js'
        resource url:'/jwplayer/jwplayer.js'
        resource url:'/js/jwplayer-key.js'
        resource url:'/js/large-cookie.js'
        resource url:'/js/header.js'
        resource url:'/js/tooltip.js'
        resource url:'/js/json2.js'
        resource url:'/js/institution-list.js'
        resource url:'/js/start-page.js'
        resource url:'/js/ddb.osm.institutiondetailview.js'
        resource url:'/js/item-hierarchy.js'
        resource url:'/js/binaries-viewer.js'
        resource url:'/js/persistent-links-modal-dialog.js'
        resource url:'/js/advanced-search-page.js'
        resource url:'/js/search-results.js'
    }


    // These are page specific bundles which should be merged back into ddbnext in the second step

    startpage {
        resource url:'/css/start-page.css', bundle: 'startpage'
        resource url:'/css/start-page.css', attrs:[media:'print'], bundle: 'startpageprint'
    }

    openstreetmap {
        resource url:'http://www.openlayers.org/api/OpenLayers.js'
        resource url:'http://www.openstreetmap.org/openlayers/OpenStreetMap.js'
    }

    pdf {
        resource url:'/css/bootstrap.css'//, exclude:'zip'
        resource url:'/css/ddb.css'//, exclude:'zip'
        resource url:'/css/item.css'//, exclude:'zip'
        resource url:'/css/pdf.css'//, exclude:'zip'
    }
}
