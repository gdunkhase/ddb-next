package de.ddb.next

class FacetsResultsManagerTagLib {
	
  /**
   * Renders the navigation bar for the results.
   *
   * @attr facetValues REQUIRED data for page navigation
   */

  def facetListRender = { attrs, body ->
    out << render(template:"/search/facetList", model:[facetValues: attrs.facetValues])
   }
}
