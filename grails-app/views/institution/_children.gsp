<g:if test="${ children?.size() >0 }">
<ol>
<g:each var="child" in="${ children }">
  <li class="child-institution">
    <i class="icon-child-institution"></i>
    <g:render template="listItem" model="['item': child]"/>
  </li>
</g:each>
</ol>
</g:if>