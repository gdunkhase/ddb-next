package de.ddb.next

class ResultsPaginationManagerTagLib {
	
  /**
   * Renders the navigation bar for the results.
   *
   * @attr navData REQUIRED data for page navigation
   */

  def pageInfoNavRender = { attrs, body ->
    out << render(template:"/search/pageNavigation", model:[navData: attrs.navData])
   }
  
  /**
   * Renders the paginator bar for the results.
   *
   * @attr paginatorData REQUIRED data for paginator
   */
  
  def resultsPaginatorOptionsRender = { attrs, body ->
	  out << render(template:"/search/paginator", model:[paginatorData: attrs.paginatorData])
	 }
}
