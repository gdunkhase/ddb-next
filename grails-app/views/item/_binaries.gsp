<!--
<g:each in="${binaryList}">
  <div>
    preview title  <span>
      ${it.preview.title}
    </span>
  </div>
  <div>
    preview uri  <span>
      ${it.preview.uri}
    </span>
  </div>
  <div>
    thumbnail title  <span>
      ${it.thumbnail.title}
    </span>
  </div>
  <div>
    thumbnail uri  <span>
      ${it.thumbnail.uri}
    </span>
  </div>
  <div>
    full uri  <span>
      ${it.full.uri}
    </span>
  </div>
</g:each>
-->
<div class="slide-viewer">
  <div class="binary-viewer-container">
    <div class="binary-viewer">
      <g:set var="prev" value="${binaryList[0]}" />
      <img style="cursor: pointer;" src="${prev.preview.uri}" alt="${prev.preview.title}"/>
    </div>
  </div>
  <div class="binaryViewerError" style="display: none;">
    <p class="errorHeader">File not found</p>
    <p>
      The file <span class="mediaFile"><a
        href="http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg">Szene
          mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut</a></span> cannot
      be displayed.
    </p>
  </div>
  <div class="binaryViewerFlashUpgrade" style="display: none;">
    <p class="errorHeader">You need to upgrade your Adobe Flash Player to
      watch this video.</p>
    <p>
      <a href="http://get.adobe.com/flashplayer/">Download the latest Adobe
        Flash Player.</a>
    </p>
    <p>
      The file <span class="mediaFile"><a
        href="http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg">Szene
          mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut</a></span> cannot
      be displayed.
    </p>
  </div>
  <div class="binary-title">
    <span data-bind="text: selectedBinary">${prev.preview.title}</span>
  </div>

  <div class="tabs">
    <p class="tab all currentTab"><g:message code="ddbnext.BinaryViewer_MediaCountLabelFormat_All" /></p>
    <div class="scroller all" style="overflow: hidden;">
      <button class="btnPrev" disabled="disabled">
        Prev<span class="opaque"></span>
      </button>
      <ul style="position: relative;">
        <g:each in="${binaryList}">
          <li style="position: absolute; top: 0px; left: 0px; visibility: visible;">
            <a href="${it.preview.uri}" data-fullsrc="${it.preview.uri}" title="${it.thumbnail.title}">
              <div class="thumbnail image"
               style="background-color: white; background-position: initial initial; background-repeat: initial initial;">
                <img style="display: inline-block;" src="${it.thumbnail.uri}" alt="${it.thumbnail.title}">
              </div>
              <span class="label">${it.preview.title}</span>
            </a>
          </li>
        </g:each>
      </ul>
      <button class="btnNext" disabled="disabled">
        <g:message code="ddbnext.Next_Label" />
        <span class="opaque"></span>
      </button>
    </div>
    <noscript></noscript>
    <script type="text/javascript">
        var category_all = [];
            category_all.push({
                 name : "Szene mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut",
                     uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     full_uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     thumbnail : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvth/1.jpg",
                     primary : true,
                 shortType : "image"
            });
        
        categories.push({name: "all", data: category_all});
    </script>

    <p class="tab divider">|</p>
    <p class="tab images">Images (1)</p>
    <div class="scroller images" style="display: none;">
      <ul></ul>
    </div>
    <noscript></noscript>
    <script type="text/javascript">
        var category_images = [];
            category_images.push({
                 name : "Szene mit Willy Millowitsch (links). Quelle: Deutsches Filminstitut",
                     uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     full_uri : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvpr/1.jpg",
                     thumbnail : "http://www.binary-p2.deutsche-digitale-bibliothek.de/binary/ZFCRNJG2ZARUJRKOMAA36NROCGSGL6TB/mvth/1.jpg",
                     primary : true,
                 shortType : "image"
            });
        
        categories.push({name: "images", data: category_images});
    </script>

    <p class="tab divider">|</p>
    <p class="tab videos">Videos (0)</p>
    <div class="scroller videos" style="display: none;">
      <ul></ul>
    </div>
    <noscript>
      &lt;div class="scroller videos"&gt; &lt;ul&gt;
      &lt;/ul&gt; &lt;/div&gt;
    </noscript>
    <script type="text/javascript">
        var category_videos = [];
        categories.push({name: "videos", data: category_videos});
    </script>

    <p class="tab divider">|</p>
    <p class="tab audios">Audios (0)</p>
    <div class="scroller audios" style="display: none;">
      <ul></ul>
    </div>
    <noscript>
    </noscript>
    <script type="text/javascript">
        var category_audios = [];
        categories.push({name: "audios", data: category_audios});
    </script>
  </div>
</div>