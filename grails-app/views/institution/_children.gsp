<g:if test="${ children?.size() >0 }">
<ol>
<g:each var="child" in="${ children }">
  <li class="institution-listitem" data-sector="${ child?.sector }" data-child-of="${ child.parentId }" data-institution-id="${ child.id }">
    <i class="icon-child-institution"></i>
    <g:render template="listItem" model="['item': child]"/>
    <g:render template="children" model="['children': child?.children]"/>
  </li>
</g:each>
</ol>
</g:if>