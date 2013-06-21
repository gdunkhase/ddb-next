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
        
        "/informationitem/$id"{
            controller="search"
            action="informationItem"
        }

        "/content/$dir/$id?" {
            controller="content"
            action="staticcontent"
        }

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
            action="index"
        }

        "/entity/ajax/searchresults" {
            controller="entity"
            action="getAjaxSearchResultsAsJson"
        }

        "/binary/$filename**" {
            controller="apis"
            action="binary"
        }

        "/static/$filename**" {
            controller="apis"
            action="staticFiles"
        }

        "/user/profile" {
            controller="user"
            action="profile"
        }
        "/user/delete" {
            controller="user"
            action="delete"
        }

        "/login" {
            controller="user"
            action="index"
        }

        "/login/doLogin" {
            controller="user"
            action="doLogin"
        }

        "/login/doLogout" {
            controller="user"
            action="doLogout"
        }

        "/login/openId" {
            controller="user"
            action="requestOpenIdLogin"
        }

        "/login/doOpenIdLogin" {
            controller="user"
            action="doOpenIdLogin"
        }

        "/registration" {
            controller="user"
            action="registration"
        }
        
        "/favorites" {
            controller="user"
            action="favorites"
        }

        "/recovery" {
            controller="user"
            action="recoverPassword"
        }

        "/profile" {
            controller="user"
            action="profile"
        }

        "/favorites" {
            controller="user"
            action="favorites"
        }


        "404"(controller: "error", action: "notFound")
        "401"(controller: "error", action: "auth")

        "500"(controller: "error", action: "notFound", exception: de.ddb.next.exception.ItemNotFoundException)
        "500"(controller: "error", action: "serverError", exception: de.ddb.next.exception.ConfigurationException)
        "500"(controller: "error", action: "serverError", exception: de.ddb.next.exception.BackendErrorException)
        "500"(controller: "error", action: "serverError")
        "500"(controller: "error", action: "uncaughtException", exception: Throwable)

    }
}
