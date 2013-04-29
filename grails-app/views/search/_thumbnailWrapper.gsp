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
<%@page import="java.awt.event.ItemEvent"%>
<div class="thumbnail-wrapper <g:if test="${viewType != 'grid'}">span2</g:if>">
  <div class="thumbnail">
    <g:link class="persist" controller="${ controller }" action="${ action }" params="[id: item.id, hitNumber: hitNumber]">
      <img src="<g:if test="${item.preview.thumbnail.contains('binary')}">${confBinary}</g:if>${item.preview.thumbnail}" alt="<g:removeTags>${item.preview.title}</g:removeTags>" />
    </g:link>
  </div>
  <div class="information">
    <div class="hovercard-info-item">
      <h4><g:truncateHovercardTitle title="${ item.preview.title }" length="${ 350 }"></g:truncateHovercardTitle></h4>
      <ul class="unstyled">
        <g:each in="${item.properties}">
          <g:if test="${item.properties[it.key] && it.key != 'last_update'}">
            <li>
              <span class="fieldName"><g:message code="${'ddbnext.facet_'+it.key}" /></span>
              <span class="fieldContent">
              <g:each status="i" in="${item.properties[it.key]}" var="key">
                <g:if test="${(i!=0)}">
                  ,
                </g:if>
                <g:if test="${it.key == 'affiliate_fct' || it.key == 'keywords_fct' || it.key == 'place_fct' || it.key == 'provider_fct'}">
                    ${key}
                </g:if>
                <g:if test="${it.key == 'type_fct' }">
                  <g:message code="ddbnext.type_fct_${key}"/>
                </g:if>
                <g:if test="${it.key == 'time_fct' }">
                  <g:message code="ddbnext.time_fct_${key}"/>
                </g:if>
                <g:if test="${it.key == 'language_fct' }">
                  <g:message code="ddbnext.language_fct_${key}"/>
                </g:if>
                <g:if test="${it.key == 'sector_fct' }">
                  <g:message code="ddbnext.sector_fct_${key}"/>
                </g:if>
              </g:each>
              </span>
            </li>
          </g:if>
        </g:each>
      </ul>
    </div>
  </div>
</div>
