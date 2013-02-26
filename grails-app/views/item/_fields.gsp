<div class="fields">

<g:each in="${fields}">
  <div class="row">
    <div class="name span3"><g:message code="${'ddbnext.'+ it.@id}" />: </div>
    <div class="value span5">${it.value}</div>
  </div>
</g:each>

</div>
