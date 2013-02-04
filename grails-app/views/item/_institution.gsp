<div class="row institution">
  <div class="span10">
    <div class="provider">Institution</div>
    <div>
      <a class="institution-name"
      href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/<%=institution.id %>">
        <%= institution.name %>
      </a>
    </div>
    <div>
      <a href="<%= institution.uri %>"><%= institution.uri %></a>
    </div>
  </div>
  <div class="span2 logo">
    <img alt="<%= institution.name %>" src="${institution.logo.a}">
  </div>

</div>
<!-- /end of institution -->
