<div class="messages-container">
  <ul class="unstyled">
  <g:each in="${ messages }">
    <li>
      <i class="icon-ok-circle"></i><span><g:message code="${it}" /></span>
    </li>
  </g:each>
  </ul>
</div>
