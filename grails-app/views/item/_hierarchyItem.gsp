<li>
  <g:if test="${item.isMainItem}" >
    <strong>${item.label}</strong>
  </g:if>
  <g:else>
    ${item.label}
  </g:else>
  <g:if test="${item.hasChildren}">
    <g:renderItemChilds item="${item.item}" mainItem="${item.mainItem}"/>
  </g:if>
</li>