<!--
<g:each in="${binaryList}">
  <div>name: <span>${it.'@name'}</span></div>
  <div>mime: <span>${it.'@mimetype'}</span></div>
  <div>path: <span>${it.'@path'}</span></div>
  <div>position: <span>${it.'@position'}</span></div>
  <div>primary: <span>${it.'@primary'}</span></div>
</g:each>
-->

<!-- TODO: fetch the HTML with JS disabled -->
<div class="objectDisplay slideViewer">

  <div class="binaryViewerContainer" style="">
  <!-- preview -->
    <div class="binaryViewer">
      <img style="cursor: pointer;"
      src="${binary.preview.uri}"
      alt="${binary.preview.title}">
    </div>
  </div>

  <!-- TODO: handle file not found. How to check? -->
  <div class="binaryViewerError" style="display: none;">
    <p class="errorHeader">
      File not found
    </p>
    <p>
      The file
      <span class="mediaFile">
        <a href="${binary.preview.uri}">
          ${binary.preview.title}
        </a>
      </span>
      cannot be displayed.
    </p>
  </div>
  <!-- /end of binaryViewerError -->

  <div class="binaryTitle">
    <span data-bind="text: selectedBinary">
      ${binary.preview.title}
    </span>
  </div>

  <div class="tabs">
    <p class="tab all currentTab">
      All (1)
    </p>
    <div class="scroller all" style="overflow: hidden;">
      <button class="btnPrev" disabled="disabled">
        Prev
      </button>
      <ul style="position: relative;">
        <li style="position: absolute; top: 0px; left: 0px; visibility: visible;">
          <!-- TODO: handle full version -->
          <a
          href="${binary.preview.uri}"
          data-fullsrc="${binary.full.uri} "
          title="${binary.preview.title}">
            <!-- TODO: remove inline style -->
            <div class="thumbnail image" style="background-color: white;
              background-position: initial initial; background-repeat:
              initial initial;"> <img style="display: inline-block;"
            src="${binary.thumbnail.uri} "
            alt="${binary.thumbnail.title}">
            </div>
            <span class="label">${binary.thumbnail.title}</span>
          </a>
        </li>
      </ul>
      <button class="btnNext" disabled="disabled">
        Next
      </button>
    </div>

    <p class="tab divider">
      |
    </p>
    <p class="tab images">
      Images (1)
    </p>
    <div class="scroller images" style="display: none;">
    </div>

    <p class="tab divider">
      |
    </p>
    <p class="tab videos">
      Videos (0)
    </p>
    <div class="scroller videos" style="display: none;">
    </div>

    <p class="tab divider">
      |
    </p>
    <p class="tab audios">
      Audios (0)
    </p>
    <div class="scroller audios" style="display: none;">
    </div>
  </div>
</div>