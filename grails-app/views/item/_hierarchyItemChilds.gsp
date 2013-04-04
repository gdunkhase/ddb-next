<ul>
  <g:each in="${item.childs}" var="it">
    <g:renderItem item="${it}" mainItem="${item.mainItem}"/>
  </g:each>
</ul>
