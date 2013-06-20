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
<div class="objects">

  <g:set var="showPictures" value="${entity.searchPreview.pictureCount > 0}" />
  <g:set var="showVideos" value="${entity.searchPreview.videoCount > 0}" />
  <g:set var="showAudios" value="${entity.searchPreview.audioCount > 0}" />
  
  <h3><g:message code="ddbnext.Entity_Objects" />:</h3>
  <div class="preview">
    <a href="#" class="preview-item-previous">
      <span><g:message code="ddbnext.Previous_Label" /></span>
    </a>
    <ul class="preview-item-container">
      <g:each var="item" in="${entity.searchPreview.items}">
        <li class="preview-item">
          <div class="preview-item-image">
            <g:link controller="item" action="findById" params="${["id": item.id]}">
              <img src="${request.getContextPath() + item.preview.thumbnail}" alt="${item.label}" />
            </g:link>
          </div>
          <div class="preview-item-label">
            <g:link controller="item" action="findById" params="${["id": item.id]}">
              ${item.label}
            </g:link>
          </div>
        </li>
      </g:each>
    </ul>
    <a href="#" class="preview-item-next">
      <span><g:message code="ddbnext.Next_Label" /></span>
    </a>
  </div>
  <div>
    <g:if test="${showPictures}">
      <g:link controller="search" action="results" params="${["query": entity.title, "facet": "type_fct", "type_fct": "mediatype_002"]}"><g:message code="ddbnext.Entity_All_Pictures" /> (${entity.searchPreview.pictureCount})</g:link>  
    </g:if>
    <g:if test="${(showPictures && showVideos) || (showPictures && showAudios)}">
      |
    </g:if>
    <g:if test="${showVideos}">
      <g:link controller="search" action="results" params="${["query": entity.title, "facet": "type_fct", "type_fct": "mediatype_005"]}"><g:message code="ddbnext.Entity_All_Videos" /> (${entity.searchPreview.videoCount})</g:link> 
    </g:if>
    <g:if test="${(showVideos && showAudios)}">
      |
    </g:if>
    <g:if test="${showAudios}">
      <g:link controller="search" action="results" params="${["query": entity.title, "facet": "type_fct", "type_fct": "mediatype_001"]}"><g:message code="ddbnext.Entity_All_Audios" /> (${entity.searchPreview.audioCount})</g:link>
    </g:if>
  </div>
</div>
