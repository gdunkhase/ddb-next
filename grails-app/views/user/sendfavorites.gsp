<%--<html>
<head>
<title>- <g:message code="ddbnext.Deutsche_Digitale_Bibliothek" /></title>
<meta name="page" content="favorites" />
</head>

--%><g:set var="confBinary" value="/ddb-next"></g:set>
<div id="myModal" class="modal" tabindex="-1" role="dialog" >
<div class="modal-body">
    <form method="POST" id="sendFavorites">
    <fieldset>
    <legend><g:message code="ddbnext.send_favorites"/></legend>
    <label><g:message code="ddbnext.Email" /></label>
    <input type="text" placeholder="Contact Email" type="email" name="email" required>
          <div class="favorites-results">
            <g:favoritesEmailResultsRender results="${results}"></g:favoritesEmailResultsRender>
          </div> 
      <button class="btn" data-dismiss="modal" aria-hidden="true"><g:message code="ddbnext.Close" /></button>
      <button class="btn btn-primary" type="submit" id="btnSubmit"><g:message code="ddbnext.send_now" /></button>
      </fieldset>
      </form>
  </div>
</div>