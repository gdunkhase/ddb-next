package de.ddb.next

class PageInfoNavTagLib {
  /**
   * Renders the navigation bar for the results.
   *
   * @attr navData REQUIRED data for page navigation
   */

  def pageInfoNavRender = { attrs, body ->
    out << render(template:"/search/pageNavigation", model:[navData: attrs.navData])
   }
}
