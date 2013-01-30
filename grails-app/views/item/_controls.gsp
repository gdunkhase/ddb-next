<!-- TODO: rewrite the class controls, disable back to results -->
<div class="row object-controls">
  <!-- buttons -->
  <div class="span6">
    <a class="back tools" href="#" title="Back to the results list">
<span>Back to the results list</span>
    </a>
    <a class="link tools" href="${itemUri}"
      title="Drag the link to an email or another document, or use the context menu to copy the link.">
    <span>Link to this page</span>
    </a>
  </div>
  
  <div class="span6">
    <!-- (DFG) viewer -->
  <g:if test="${!viewerUri?.isEmpty()}">
    <div class="viewers">
      <span class="viewer dfg"><a target="about:blank" href="${viewerUri}">DFG Viewer</a></span>
    </div>
  </g:if>
    
    <!-- search results navigation -->
    <nav class="search-results-nav">
      <ul>
        <li class="first-nav">
          <a class="first" href="#"><span>First</span></a>
        </li>
        <li class="prev-nav">
          <a class="prev" href="#"><span>Previous</span></a>
        </li>
        <li class="page-summary">
          <span>Page 1 of 1</span>
        </li>
        <li class="next-nav">
          <a class="next" href="#"><span>Next</span></a>
        </li>
        <li class="last-nav">
          <a class="last" href="#"><span>Last</span></a>
        </li>
      </ul>
    </nav>
  </div>
</div>
