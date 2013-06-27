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
    <div class="hovercard-info-item" data-iid="${item.id}">
      <h4><g:truncateHovercardTitle title="${ item.preview.title }" length="${ 350 }"></g:truncateHovercardTitle></h4>
      <ul class="unstyled">
        <li>
          <div class="small-loader"></div>
        </li>
       </ul>
    </div>
  </div>
</div>
