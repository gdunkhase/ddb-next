<div class="fields">

<g:each in="${fields}">
  <div class="row">
    <div class="span2"><strong>${it.name}: </strong></div>
    <div class="value <g:if test="${binaryList.size != 0}">span5</g:if><g:else>span10</g:else>">${it.value}</div>
  </div>
</g:each>

</div>
