<g:if test="${ item.isFirst }">
  <a id="${ item.firstChar }" href="${ item?.uri }">${ item?.name } <span>(${ item?.sector })</span></a>
</g:if>
<g:else>
  <a href="${ item?.uri }">${ item?.name } <span>(${ item?.sector })</span></a>
</g:else>