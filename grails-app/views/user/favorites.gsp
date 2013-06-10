<%--
Copyright (C) 2013 FIZ Karlsruhe
 
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--%>
<g:if test="${resultsPaginatorOptions ==null}">
  <g:set var="resultsPaginatorOptions" value="${[pageFilter: [10,20,40], pageFilterSelected: 20]}"></g:set>
</g:if>
<%-- Set dummy variables --%>
<g:set var="bookmarks" value="${[bookmarksLists: [[id:'8b26a230-cdf6-11e2-8b8b-0800200c9a66', name: 'Favorites', isPublic: false, items:[[id: '913f4d70-cdf6-11e2-8b8b-0800200c9a66', itemId: 'YV736GVWYNHQAF5GT2WPO36JAOXK3TMV', createdAt: '2012-11-10T06:42:55Z'], [id: 'a36413f0-cdf6-11e2-8b8b-0800200c9a66', itemId: 'TIPOUOBUDBR472NWI27L4N6TXPQ2T6PF', createdAt: '2012-11-10T06:43:15Z']]]], bookmarksListSelectedID: '8b26a230-cdf6-11e2-8b8b-0800200c9a67']}"></g:set>
<html>
  <head>
    <title>- <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>
    <meta name="page" content="favorites" />
    <meta name="layout" content="main" />
  
  </head>
  <body>
    <div class="favorites-results-container">
      <div class="row favorites-results-head">
        <div class="span8">
          <h1><g:message code="ddbnext.Favorites_Header"/></h1>
        </div>
        <div class="span4 results-paginator-options off">
          <div class="page-filter">
            <label><g:message code="ddbnext.SearchResultsPagination_Display" /></label>
            <span>
              <select class="select">
                <g:each in="${resultsPaginatorOptions.pageFilter}">
                  <option value="${it}" <g:if test="${resultsPaginatorOptions.pageFilterSelected == it}">selected</g:if> >${it}</option>
                </g:each>
              </select>
            </span>
          </div>
        </div>
        <div class="span12">
          <hr>
        </div>
      </div>
      <div class="row favorites-results-container">
        <div class="span3 bookmarks-container">
          <ul class="bookmarks-lists unstyled">
            <g:each in="${bookmarks.bookmarksLists}">
              <li class="bookmarks-list ${(it.id==bookmarks.bookmarksListSelectedID)?'active':''} bt bb bl br">
                <a class="h3" href="#" data-fctName="#">
                  ${it.name} (${it.items.size()})
                </a>
                <a class="bookmarks-list-envelope" href="#"><i class="icon-envelope"></i></a>
                <a class="bookmarks-list-edit" href="#"><i class="icon-edit"></i></a>
              </li>
            </g:each>
          </ul>
        </div>
        <div class="span9">
          <g:form controller="favorites" action="remove" id="${bookmarkID}" name="favorites-remove">
            <div class="row">
              <div class="span9">
                <%-- Render The pageIndoNavRender --%>
              </div>
            </div>
            <div class="row">
              <div class="span9">
                <div class="favorites-results">
                </div>
              </div>
            </div>
          </g:form>
        </div>
      </div>
    </div>
  </body>
</html>
