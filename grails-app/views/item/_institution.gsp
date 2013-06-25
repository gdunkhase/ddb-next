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
<%@page import="de.ddb.next.FavoritesService"%>
<%@page import="de.ddb.next.beans.User"%>
<div class="row item-detail">
  <div class="span12 institution">
    <div class="row">
    
        <div class="span9">
            <div><g:message code="ddbnext.Institution" /></div>
            <g:link class="institution-name" controller="institution" action="showInstitutionsTreeByItemId" params="[id: institution.id]">
            ${institution.name}
            </g:link>
            <a class="institution-link" href="${institution.uri}">${institution.uri}</a>
        </div>
        <div class="span3">
            <img alt="${institution.name}" src="${institution.logo.a}"/>
        </div>
        
        <div class="span9">
            <g:if test="${!item.origin?.toString().isEmpty() || !viewerUri?.isEmpty()}">
              <div class="origin">
                  <g:if test="${!item.origin?.toString().isEmpty()}">
                          <a target="_blank" class="show-origin" href="${item.origin.a}" title="<g:message code="ddbnext.stat_008" />">
                          <span class="has-origin"><g:message code="ddbnext.CulturalItem_LinkToOriginalItem_Label" /></span>
                          </a>
                  </g:if>
                  <!-- (DFG) viewer -->
                  <g:if test="${!viewerUri?.isEmpty()}">
                      <a target="_blank" href="${viewerUri}">
                        <span class="viewer dfg"><g:message code="ddbnext.ObjectViewer_dfgKey" /></span>
                      </a>
                  </g:if>
              </div>
            </g:if>
        </div>
        <div class="span3">
        
            <div class="favorite" style="text-align: right;">
                <g:isNotLoggedIn>
                    <g:link controller="user" class="favorite-actions">
                        <span title="<g:message code='ddbnext.stat_010' />">
                            <g:message code="ddbnext.favorit" />
                        </span>
                    </g:link>
                </g:isNotLoggedIn>
                <g:isLoggedIn>
                
                    <g:if test="${(FavoritesService.getFevoritesService().isFavorit(session.getAttribute(User.SESSION_USER).getEmail(), params.id))}">
                        <g:link controller="item" action="changeItemState" params="${params}" class="favorite-actions favorite-selected">
                            <span itemid="${itemId}" title="<g:message code='ddbnext.stat_011' />" id="idFavorite" style="font-weight: bold; color: red;">
                                <g:message code="ddbnext.favorit" />
                            </span>
                        </g:link>
                    </g:if>
                    <g:else>
                        <g:link controller="item" action="changeItemState" params="${params}" class="favorite-actions favorite-add">
                            <span itemid="${itemId}" title="<g:message code='ddbnext.stat_011' />" id="idFavorite" style="font-weight: bold; color: green;">
                                <g:message code="ddbnext.favorit" />
                            </span>
                        </g:link>
                    </g:else>
                    
                    
                </g:isLoggedIn>
            </div>
        </div>
        
    </div>

  </div>
</div>
<!-- /end of institution -->
