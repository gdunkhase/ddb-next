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
class UrlMappings {

    static mappings = {
        //@formatter:off
        "/$controller/$action?/$id?"{ constraints { /* apply constraints here */ } }
        //@formatter:on

        "/searchresults/$q?" {
            controller="search"
            action="results"
        }

        "/facets/$q?" {
            controller="facets"
            action="facetsList"
        }

        "/content/$dir/$id?" {
            controller="content"
            action="staticcontent"
        }

        //        "/advancedsearch" {
        //            controller="advancedsearch"
        //            action=[GET: "fillValues", POST: "executeSearch"]
        //        }

        "/advancedsearch" {
            controller="advancedsearch"
            action="fillValues"
        }

        "/advancedsearch/search" {
            controller="advancedsearch"
            action="executeSearch"
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
            action="showInstitutionsTreeByItemId"
        }

        "/apis/institutions" {
            controller="institution"
            action="getJson"
        }

        "/entity/$id" {
            controller="entity"
            action="show"
        }

        "500"(controller: "error", action: "serverError")
        "500"(controller: "error", action: "uncaughtException", exception: Throwable)

        "404"(controller: "error", action: "notFound")

    }
}
