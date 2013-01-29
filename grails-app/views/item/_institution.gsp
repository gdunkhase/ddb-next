<div class="objectWrapper">
  <div class="institution">
    <div>
      <span class="provider">Institution</span>
      <a class="institutionName"
      href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/<%=institution.id %>">
        <%= institution.name %>
      </a>
      <a href="<%= institution.uri %>"><%= institution.uri %></a>
    </div>
    <div class="logo">
      <img alt="<%= institution.name %>" src="${institution.logo.a}">
    </div>
  </div>
  <!-- /end of institution -->
</div>
