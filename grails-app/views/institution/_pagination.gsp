<div id="first-letter-index" class="pagination pagination-small">
  <ul>
    <li><a href="#All">All</a></li>
  <g:each in="${index}">
    <g:if test="${ it.value }">
    <li class="disabled"><a href="#${ it.key }">${ it.key }</a></li>
    </g:if>
    <g:else>
    <li><a href="#${ it.key }">${ it.key }</a></li>
    </g:else>
  </g:each>
    <li class="disabled"><a href="#0-9">0-9</a></li>
  </ul>
<hr>
</div>