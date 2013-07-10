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

<g:set var="resultsPaginatorOptions"
  value="${[pageFilter: [10,20,40], pageFilterSelected: 20]}"></g:set>

<%-- Set dummy variables --%>
<g:set var="bookmarks" value="${bookmarks}"></g:set>
<g:set var="bookmarks"
  value="${[bookmarksLists: [[id:'8b26a230-cdf6-11e2-8b8b-0800200c9a66', name: 'Favorites', isPublic: false, items:[[id: '913f4d70-cdf6-11e2-8b8b-0800200c9a66', itemId: 'YV736GVWYNHQAF5GT2WPO36JAOXK3TMV', createdAt: '2012-11-10T06:42:55Z', preview:[title:'Nofretete', subtitle:'Büste', thumbnail: '/binary/DF5RWG35NM557SVSGOIGG6JS37MUYOFO/list/1.jpg', media:['text']]], [id: 'a36413f0-cdf6-11e2-8b8b-0800200c9a66', itemId: 'TIPOUOBUDBR472NWI27L4N6TXPQ2T6PF', createdAt: '2012-11-10T06:43:15Z', preview:[title:'Nofretete', subtitle:'Büste', thumbnail: '/binary/DF5RWG35NM557SVSGOIGG6JS37MUYOFO/list/1.jpg', media:['text']]]]]], bookmarksListSelectedID: '8b26a230-cdf6-11e2-8b8b-0800200c9a67']}"></g:set>

<g:set var="navigationData"
  value="${[paginationURL: [firstPg: firstPg, lastPg: lastPg, prevPg: prevPg, nextPg: nextPg], page: page, totalPages: totalPages ]}"></g:set>
<g:set var="confBinary" value="/ddb-next"></g:set>
<html>
<head>
<title>- <g:message code="ddbnext.Deutsche_Digitale_Bibliothek" /></title>
<meta name="page" content="favorites" />
<meta name="layout" content="main" />

</head>
<body>
  <div class="favorites-results-container">
    <div class="row favorites-results-head">
      <div class="span8">
        <h1>
          <g:message code="ddbnext.Favorites_Header" />
        </h1>
      </div>
      <div class="span4 results-paginator-options off">
        <div class="page-filter">
          <label><g:message code="ddbnext.SearchResultsPagination_Display" /></label> <span>
            <select class="select">
              <g:each in="${resultsPaginatorOptions.pageFilter}">
                <option value="${it}"
                  <g:if test="${resultsPaginatorOptions.pageFilterSelected == it}">selected</g:if>>
                  ${it}
                </option>
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
            <li
              class="bookmarks-list ${(it.id==bookmarks.bookmarksListSelectedID)?'active':''} bt bb bl br">
              <a class="h3" href="#"> ${it.name} </a> 
              <span class="bookmarks-list-number"> ${resultsNumber}</span> 
              <a class="bookmarks-list-envelope" id="sendbookmarks" href="http://localhost:8080/ddb-next/user/sendfavorites">
              <i class="icon-envelope"></i></a> 
              <a class="bookmarks-list-edit" href="#"><i class="icon-edit"></i></a>
            </li>
          </g:each>
        </ul>
      </div>
      <div class="span9 favorites-results-content">
      <g:if test="${resultsNumber > 0}">
        <g:form id="favorites-remove"
          name="favorites-remove">
          <div class="favorites-results-controls">
            <div class="results-pagination">
              <button type="submit" class="submit">
                <span><g:message code="ddbnext.Delete"></g:message></span>
              </button>
              <g:paginationControlsRender navData="${navigationData}"></g:paginationControlsRender>
            </div>
            <div class="results-sorter">
              <div class="row">
                <div class="span6">
                  <span><input type="checkbox" class="select-all" id="checkall"></span>
                  <span><g:message code="ddbnext.HierarchyHelp_Leaf"></g:message></span>
                  <span> <a href="#"><i class="icon-arrow-up"></i></a> <a
                    href="#"><i class="icon-arrow-down"></i></a>
                  </span>
                </div>
                <div class="span3 added-on">
                  <span><g:message code="ddbnext.Added_On"></g:message></span>
                </div>
              </div>
            </div>
          </div>
          <div class="favorites-results">
            <g:favoritesResultsRender results="${results}"></g:favoritesResultsRender>
          </div>
        </g:form>
        </g:if>
        <g:else>
        <div class="alert"><g:message code="ddnnext.no_favorites"/></div>
</g:else>
      </div>
    </div>
  </div>

<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
<h3 id="myModalLabel"></h3>
</div>
<div class="modal-body">
    <form>
    <fieldset>
    <legend><g:message code="ddbnext.send_favorites"/></legend>
    <label><g:message code="ddbnext.Email" /></label>
    <input type="text" placeholder="Contact Email" >
          <div class="favorites-results">
            <g:favoritesEmailResultsRender results="${results}"></g:favoritesEmailResultsRender>
          </div> 
	
	    <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
	    <button class="btn btn-primary" type="submit">Save changes</button>
	    </fieldset>
	    </form>
	</div>
</div>

</body>
</html>