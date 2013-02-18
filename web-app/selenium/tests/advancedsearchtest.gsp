<sel:test name="AdvancedSearchTest">
  <%--load start page--%>
	<sel:row command="open" target="${request.contextPath}" value="/" />
	
  <%--click on link "advanced search"--%>
  <sel:row line="clickAndWait|link=Erweiterte Suche" />
</sel:test>
