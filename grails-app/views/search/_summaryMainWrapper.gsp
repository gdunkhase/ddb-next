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
<div class="summary-main-wrapper <g:if test="${viewType != 'grid'}">span7</g:if>">
  <div class="summary-main">
    <h2 class="title">
      <g:link class="persist" controller="${ controller }" action="${ action }" params="[id: item.id, hitNumber: hitNumber]" title="${truncateHovercardTitle(title: item.label, length: 350)}">
      <g:truncateItemTitle title="${ item.preview.title }" length="${ 100 }"></g:truncateItemTitle>
      </g:link>
    </h2>
    <div class="subtitle">${item.preview.subtitle}</div>
    <ul class="matches unstyled">
      <li class="matching-item">
        <span>
          <g:each var="match" in="${item.view}">
            ...${match.replaceAll('match', 'strong')}...
          </g:each>
        </span>
      </li>
    </ul>
  </div>
  <div class="extra">
    <ul class="types unstyled inline">
    <g:each var="mediaType" in="${item.preview.media}">
      <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_007" /></g:set>
      <g:if test="${mediaType == 'audio'}">
        <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_001" /></g:set>
      </g:if>
      <g:if test="${mediaType == 'image'}">
        <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_002" /></g:set>
      </g:if>
      <g:if test="${mediaType == 'text'}">
        <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_003" /></g:set>
      </g:if>
      <g:if test="${mediaType == 'fullText'}">
        <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_004" /></g:set>
      </g:if>
      <g:if test="${mediaType == 'video'}">
        <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_005" /></g:set>
      </g:if>
      <g:if test="${mediaType == 'other'}">
        <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_006" /></g:set>
      </g:if>
      <g:if test="${mediaType == 'Institution'}">
        <g:set var="mediaTitle"><g:message code="ddbnext.Institution" /></g:set>
      </g:if>
      <li class="${mediaType}" classname="${mediaType}" title="${mediaTitle}">${mediaTitle}</li>
    </g:each>
    </ul>
  </div>
</div>
