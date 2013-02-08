<sel:test name="SearchTest">
  <%--load start page--%>
	<sel:row command="open" target="${request.contextPath}" value="/" />
	
  <%--fill out search slot--%>
	<sel:row command="type"	target="//form[@id='form-search']//input[@name='q']" value="Rom" />
	
  <%--press submit button--%>
	<sel:row line="clickAndWait|//form[@id='form-search']/button[@type='submit']" />
  
  <%--verify that we got a search result--%>
  <sel:row line="verifyElementPresent|//div[@class='search-results']//div[@class='summary-main']" />

  <%--click on the first search hit--%>
  <sel:row line="clickAndWait|//div[@class='search-results']//div[@class='summary-main']//a[1]" />
</sel:test>
