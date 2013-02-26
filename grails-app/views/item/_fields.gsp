<!-- TODO localization -->
<div class="fields">

<g:each in="${fields}">
  <div class="row">
    <div class="span3"><strong><g:message code="${'ddbnext.'+ it.@id}" />: </strong></div>
    <div class="value span5">${it.value}</div>
  </div>
</g:each>

</div>
