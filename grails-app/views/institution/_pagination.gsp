<div class="pagination">
  <ul>
    <li><a href="#All">All</a></li>
  <g:each in="${index}">
    <li><a href="#${ it }">${ it }</a></li>
  </g:each>
    <li><a href="#0-9">0-9</a></li>
  </ul>
<hr>
</div>