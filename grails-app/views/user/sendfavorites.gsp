<%--<html>
<head>
<title>- <g:message code="ddbnext.Deutsche_Digitale_Bibliothek" /></title>
<meta name="page" content="favorites" />
</head>
--%>
<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
<div class="modal-header">
<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
<h3 id="myModalLabel"></h3>
</div>
<div class="modal-body">
    <form>
    <fieldset>
    <legend><g:message code="ddbnext.send_favorites"/></legend>
    <label><g:message code="ddbnext.Email" /></label>
    <input type="text" placeholder="Contact Email" >
          <div class="favorites-results">
            <g:favoritesEmailResultsRender results="${results}"></g:favoritesEmailResultsRender>
          </div> 
      <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
      <button class="btn btn-primary" type="submit">Save changes</button>
      </fieldset>
      </form>
  </div>
</div>

<div class="modal-body">
    <form>
    <fieldset>
    <legend><g:message code="ddbnext.send_favorites"/></legend>
    <label><g:message code="ddbnext.Email" /></label>
    <input type="text" placeholder="Contact Email" >
          <div class="favorites-results">
            <g:favoritesEmailResultsRender results="${results}"></g:favoritesEmailResultsRender>
          </div> 
      <button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
      <button class="btn btn-primary" type="submit">Save changes</button>
      </fieldset>
      </form>
  </div>