<meta name="layout" content="main" />

<h2>Institutions</h2>

<g:render template="pagination" />

<ol class="institution-list">
  <g:each in="${ all }">
  <li class="institution">
    <i class="icon-institution"></i>
    <g:render template="listItem" model="['item': it]"/>
    <g:render template="children" model="['children': it?.children]"/>
  </li>
  </g:each>
</ol>

<g:render template="filter" />