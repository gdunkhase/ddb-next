<!-- TODO: rewrite the class controls, disable back to results -->

<div class="row">
  <div class="object-controls">
  
    <!-- buttons -->
    <div class="span6 buttons">
      <a class="back tools" href="#" title="Back to the results list">
        <span>Back to the results list</span>
      </a>
      <a class="link tools" href="${itemUri}"
        title="Drag the link to an email or another document, or use the context menu to copy the link.">
      <span>Link to this page</span>
      </a>
    </div>
    
    <!-- (DFG) viewer -->
<g:if test="${!viewerUri?.isEmpty()}">
    <div class="viewers span6">
      <span class="viewer dfg"><a target="about:blank" href="${viewerUri}">DFG Viewer</a></span>
    </div>
</g:if>

    <!-- search results navigation -->
    <nav class="page-nav search-results-nav">
      <ul class="inline">
        <li class="first-page">
        <a href="#">First</a>  
        </li>
        <li class="prev-page br">
        <a href="#">Previous</a> 
        </li>
        <li class="pages-overall-index">
        <span>Page 1 of xxxxx</span>
        </li>
        <li class="next-page bl">
        <a href="#">Next</a> 
        </li>
        <li class="last-page">
        <a href="#">Last</a> 
        </li>
      </ul>
    </nav>
  </div>
</div>
