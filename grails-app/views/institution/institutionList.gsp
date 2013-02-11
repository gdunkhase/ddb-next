<meta name="layout" content="main" />

<h2>Institutions</h2>

<div class="row">
  <div class="span9">
  <g:render template="pagination" />
    <ol class="institution-list">
      <g:each in="${ all }">
      <li class="institution" data-sector="${ it?.sector }">
        <i class="icon-institution"></i>
        <g:render template="listItem" model="['item': it]"/>
        <g:render template="children" model="['children': it?.children]"/>
      </li>
      </g:each>
    </ol>
  </div>
  <div class="span3">
    <g:render template="filter" />
  </div>
</div>