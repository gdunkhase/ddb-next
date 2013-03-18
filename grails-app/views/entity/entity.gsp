<html>
<!-- TODO i18n -->
<head>
  <title>${pageLabel} - Deutsche Digitale Bibliothek</title>
  <meta name="layout" content="main" />
  <link rel="stylesheet" href="${resource(dir: 'css', file: 'entity.css')}" />
</head>
<body>
  <g:render template="controls" />
  <div class="row">
    <div class="span9">
      <!-- entity-name -->
      <div class="name">
        <h2>Johann Wolfgang von Goethe</h2>
        <span>Schriftsteller, Politiker, Jurist, Naturwissenschaftler, Maler, Zeichner</span>
      </div>
      <!-- entity-dates -->
      <div class="dates">
        <div>Geboren: 28. August 1749, <a href="">Frankfurt am Main</a></div>
        <div>Gestorben: 28. August 1832, <a href="">Weimar</a></div>
      </div>
      <hr>
      <!-- entity-objects -->
      <div class="objects">
        <h3>Objekte:</h3>
        <div>
          <a href="">Alle Bilder (XX)</a> |
          <a href="">Alle Videos (XX)</a> |
          <a href="">Alle Audios (XX)</a>
        </div>
      </div>
      <!-- entity-works -->
      <div class="works">
        <div class="row">
          <div class="span6">
            <h3>Werke von:</h3>
          </div>
          <div class="span3">
            <label>
              <input type="checkbox">
              Nur Objekte mit Normdaten
              </label>
            <span class="icon-question-sign"></span>
          </div>
        </div>

        <ol class="unstyled">
          <!-- TODO: replace br tag with CSS -->
          <li class="work">
            <i class="icon-work"></i>
            <span>Clavigo: Ein Trauerspiel in fuenf Aufzuegen</span><br>
            <span>Goethe, Johann Wolfgang von - [S.I.]: 1788</span>
          </li>
          <li class="work">
            <i class="icon-work"></i>
            <span>Clavigo: Ein Trauerspiel in fuenf Aufzuegen</span><br>
            <span>Goethe, Johann Wolfgang von - [S.I.]: 1788</span>
          </li>
          <li class="work">
            <i class="icon-work"></i>
            <span>Clavigo: Ein Trauerspiel in fuenf Aufzuegen</span><br>
            <span>Goethe, Johann Wolfgang von - [S.I.]: 1788</span>
          </li>
          <li class="work">
            <i class="icon-work"></i>
            <span>Clavigo: Ein Trauerspiel in fuenf Aufzuegen</span><br>
            <span>Goethe, Johann Wolfgang von - [S.I.]: 1788</span>
          </li>
          <li class="work">
            <i class="icon-work"></i>
            <span>Clavigo: Ein Trauerspiel in fuenf Aufzuegen</span><br>
            <span>Goethe, Johann Wolfgang von - [S.I.]: 1788</span>
          </li>
          <li class="work">
            <i class="icon-work"></i>
            <span>Clavigo: Ein Trauerspiel in fuenf Aufzuegen</span><br>
            <span>Goethe, Johann Wolfgang von - [S.I.]: 1788</span>
          </li>
        </ol>
        <a href="">Alle Objekte (XX)</a>
      </div>
      <!-- entity-themes -->
      <div class="themes">
        <div class="row">
          <div class="span6">
            <h3>Thema in:</h3>
          </div>
          <div class="span3">
            <label>
              <input type="checkbox">
              Nur Objekte mit Normdaten
              </label>
            <span class="icon-question-sign"></span>
          </div>
        </div>
        <ol class="unstyled">
          <!-- TODO: replace br tag with CSS -->
          <li class="theme">
            <i class="icon-theme"></i>
            <span>Goethe ueber den Faust</span><br>
            <span>Dieck, Alfred - Goettigen: Vandenhoeck & Ruprecht, 1963</span>
          </li>
          <!-- TODO: replace br tag with CSS -->
          <li class="theme">
            <i class="icon-theme"></i>
            <span>Goethe ueber den Faust</span><br>
            <span>Dieck, Alfred - Goettigen: Vandenhoeck & Ruprecht, 1963</span>
          </li>
          <!-- TODO: replace br tag with CSS -->
          <li class="theme">
            <i class="icon-theme"></i>
            <span>Goethe ueber den Faust</span><br>
            <span>Dieck, Alfred - Goettigen: Vandenhoeck & Ruprecht, 1963</span>
          </li>
          <!-- TODO: replace br tag with CSS -->
          <li class="theme">
            <i class="icon-theme"></i>
            <span>Goethe ueber den Faust</span><br>
            <span>Dieck, Alfred - Goettigen: Vandenhoeck & Ruprecht, 1963</span>
          </li>
        </ol>
        <a href="">Alle Objekte (XX)</a>
      </div>
    </div>
    <div class="span3">
      <!-- thumbnail -->
      <div class="thumb">
        <div class="thumbinner">
          <a href="//commons.wikimedia.org/wiki/File:Goethe_(Stieler_1828).jpg" class="image">
            <!-- TODO: refactor to use figure element -->
            <!-- TODO: remove width and height, use CSS -->
            <!-- TODO srcset is not a valid attribute -->
            <img alt=""
            src="//upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Goethe_%28Stieler_1828%29.jpg/220px-Goethe_%28Stieler_1828%29.jpg"
            width="220" height="271" class="thumbimage"
            srcset="//upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Goethe_%28Stieler_1828%29.jpg/330px-Goethe_%28Stieler_1828%29.jpg
            1.5x,
            //upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Goethe_%28Stieler_1828%29.jpg/440px-Goethe_%28Stieler_1828%29.jpg
            2x">
          </a>
          <div class="thumbcaption">
            <i>Johann Wolfgang von Goethe</i>,<br>
            Ölgemälde von Joseph Karl Stieler, 1828
          </div>
        </div>
      </div>
      <!-- search -->
      <div class="search">
        <h3>Suche:<h3>
        <div class="input-prepend">
          <span class="add-on"><i class="icon-search"></i></span>		
          <input id="prependedInput" type="text"  class="span3" value="Johann Wolfgang von Goethe in DDB">
        </div>

      </div>
      <!-- external links -->
      <div class="external-links">
        <h3>Externe Links</h3>
        <ul class="unstyled">
          <li class="external-link">
            <a href="https://de.wikipedia.org/wiki/Johann_Wolfgang_von_Goethe"
              rel="external">
              <i class="icon-globe"></i>
              Deutschsprachige Wikipedia
            </a
          </li>
          <li class="external-link">
            <a href="https://en.wikipedia.org/wiki/Johann_Wolfgang_von_Goethe"
              rel="external">
              <i class="icon-globe"></i>
              Englishsprachige Wikipedia
            </a
          </li>
          <li class="external-link">
            <a href="http://swb.bsz-bw.de/DB=2.104/PPNSET?PPN=161142842&INDEXSET=1"
              rel="external">
              <i class="icon-globe"></i>
              GND Eintrag bei der Deutschen Nationalbibliothek
            </a
          </li>
          <li class="external-link">
            <a href="https://portal.dnb.de/opac.htm"
              rel="external">
              <i class="icon-globe"></i>
              Katalog der Deutschen Nationalbibliothek
            </a
          </li>
          <li class="external-link">
            <a href="https://opacplus.bsb-muenchen.de/InfoGuideClient/start.do"
              rel="external">
              <i class="icon-globe"></i>
              Katalog der Bayerischen Staatsbibliothek
            </a
          </li>
          <li class="external-link">
            <a href="http://viaf.org/viaf/24602065/#Goethe,_Johann_Wolfgang_%C2%98von%C2%9C_1749-1832"
              rel="external">
              <i class="icon-globe"></i>
              Virtual International Authority File (VIAF)
            </a
          </li>
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
