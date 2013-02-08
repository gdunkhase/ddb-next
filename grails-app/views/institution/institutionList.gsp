<h2>Institutions</h2>

<g:each in="${ all }">
  <li class="institution">
    <a href="${ it.uri }">${ it.name } <span>(${ it.sector })</span></a>
<g:if test="${ it.children?.size() >0 }">
    <ul>
<g:each var="child" in="${ it.children}">
      <li>
        <a href="#${ child.id }">${ child.name } <span>(${ child.sector })</span></a>
      </li>
</g:each>
    </ul>
</g:if>
  </li>
</g:each>