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
<g:set var="pageHitCounter" value="${0}" />
<g:set var="offset" value="${0}" />
<g:set var="index" value="${0}" />
<g:message code="ddbnext.favorites_email_body" />
<table cellpadding="0" cellspacing="10" border="border:1px solid #333" id="backgroundTable">
  <tr>
    <td valign="top">
      <!-- Tables are the most common way to format your email consistently. Set your table widths inside cells and in most cases reset cellpadding, cellspacing, and border to zero. Use nested tables as a way to space effectively in your message. -->
      <table cellpadding="10" cellspacing="10" border="border:1px solid #333" align="center">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Favorite Info</th>
          </tr>
        </thead>
        <tbody>
          <g:each in="${results}">
            <g:set var="pageHitCounter" value="${pageHitCounter + 1}" />
            <g:set var="hitNumber" value="${offset + pageHitCounter}" />
            <g:set var="controller" value="item" />
            <g:set var="action" value="findById" />
            <g:if test="${it.preview.category == 'Institution'}">
              <g:set var="controller" value="institution" />
              <g:set var="action" value="showInstitutionsTreeByItemId" />
            </g:if>
            <tr>
              <td><g:link controller="${ controller }" action="${ action }" params="[id: it.id, hitNumber: hitNumber]">
                  <img src="http://dev.escidoc.org<g:if test="${it.preview.thumbnail.contains('binary')}">${confBinary}</g:if>${it.preview.thumbnail}"
                    alt="<g:removeTags>${it.preview.title}</g:removeTags>"
                  />
                </g:link></td>
              <td>
                <span class="title" style=" font-family: KarbidWeb, Calibri, Arial, sans-serif; font-weight: bold; font-size: 1.375em; color: #a5003b;">
                  <g:link class="persist" controller="${ controller }" action="${ action }" params="[id: it.id, hitNumber: hitNumber]"
                    title="${truncateHovercardTitle(title: it.label, length: 350)}"
                  >
                    <g:truncateItemTitle title="${ it.preview.title }" length="${ 100 }"></g:truncateItemTitle>
                  </g:link>
                </span>
                <div class="subtitle">
                  ${it.preview.subtitle}
                </div>
              </td>
            </tr>
          </g:each>
        </tbody>
      </table>
</table>