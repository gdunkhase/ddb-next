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
package de.ddb.next

import org.springframework.web.servlet.support.RequestContextUtils;


class UserController {

    static defaultAction = ""

    def profilePage() {
        render(view: "profile", model: [
            title: urlQuery["query"],
            results: resultsItems,
            isThumbnailFiltered: params.isThumbnailFiltered,
            clearFilters: searchService.buildClearFilter(urlQuery, request.forwardURI),
            correctedQuery:resultsItems["correctedQuery"],
            viewType:  urlQuery["viewType"],
            facets: [selectedFacets: selectedFacets, mainFacetsUrl: mainFacetsUrl, subFacetsUrl: subFacetsUrl],
            resultsPaginatorOptions: resultsPaginatorOptions,
            resultsOverallIndex:resultsOverallIndex,
            page: page,
            totalPages: totalPages,
            paginationURL: searchService.buildPagination(resultsItems.numberOfResults, urlQuery, request.forwardURI+'?'+queryString),
            numberOfResultsFormatted: numberOfResultsFormatted,
            offset: params["offset"],
            keepFiltersChecked: keepFiltersChecked
        ])
    }


}
