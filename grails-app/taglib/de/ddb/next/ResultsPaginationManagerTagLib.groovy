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

class ResultsPaginationManagerTagLib {
  /**
   * Renders the navigation bar for the results.
   *
   * @attrs navData REQUIRED data for page navigation
   */

  def pageInfoNavRender = { attrs, body ->
    out << render(template:"/search/pageNavigation", model:[navData: attrs.navData])
   }
  
  /**
   * Renders the navigation bar for the item detail view.
   *
   * @attrs navData REQUIRED data for page navigation
   */

  def itemDetailInfoNavRender = { attrs, body ->
    out << render(template:"/search/itemNavigation", model:[navData: attrs.navData])
   }
  
  /**
   * Renders the paginator bar for the results.
   *
   * @attrs paginatorData REQUIRED data for paginator
   */
  
  def resultsPaginatorOptionsRender = { attrs, body ->
      out << render(template:"/search/paginator", model:[paginatorData: attrs.paginatorData])
  }
}
