<div class="thumbnail-wrapper <g:if test="${viewType != 'grid'}">span2</g:if>">
  <div class="thumbnail">
    <a class="persist" href="/item/${item.id}">
      <img src="<g:if test="${item.preview.thumbnail.contains('binary')}">${confBinary}</g:if>${item.preview.thumbnail}" alt="${item.preview.title}">
    </a>
  </div>
  <div class="information"></div>
</div>