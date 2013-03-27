/*
* basic.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * basic code which is included first for the minified version
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */

// override console to ensure the browser does not complain
// if not in debug/development mode
if (!window.console) {
    window.console = {
        log: function () { },
        dir: function () { },
        info: function () { },
        warn: function () { },
        debug: function () { }
    };
}

var arrayIndex = function(array, obj) {
	if (Array.indexOf) {
		return array.indexOf(obj);
	}
	for (var i = 0; i < array.length; i++) {
		if (array[i] == obj) {
			return i;
		}
	}
	return -1;
}

/* for ISS */
/*
for (var i = 0; i < document.getElementsByTagName("script").length; i++) {
	var script = document.getElementsByTagName("script")[i];
	var index = script.src.search(/geotemco[^\/]*\.js$/);
	if (index == -1) {
		index = script.src.indexOf("geotemco-min.js");
	}
	if (index != -1) {
		GeoTemCoMinifier_urlPrefix = script.src.substring(0, index);
		break;
	}
}
*/

/* for ddb-next */
var GeoTemCo_scripts = document.getElementsByTagName("script");
//console.log("GeoTemCo_all_scripts.length == " + GeoTemCo_scripts.length);
for (var i = 0; i < GeoTemCo_scripts.length; i++) {
	var scriptName = GeoTemCo_scripts[i].src.replace(/\?.*$/,'');
    //console.log("scriptName: " + scriptName);
	var index = scriptName.search(/geotemco[^\/]*\.js$/);
	if (index == -1) {
		index = scriptName.indexOf("geotemco-min.js");
	}
	if (index != -1) {
		GeoTemCoMinifier_urlPrefix = scriptName.substring(0, index);
		break;
	}
}


if (typeof console != "undefined") {
    if (typeof GeoTemCoMinifier_urlPrefix != "undefined") {
        console.log("GeoTemCoMinifier_urlPrefix: " + GeoTemCoMinifier_urlPrefix);
    } else {
        console.warn("GeoTemCoMinifier_urlPrefix: undefined");
    }
}
// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns are not implemented.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Non uniform scaling does not correctly scale strokes.
// * Optimize. There is always room for speed improvements.

// Only add this code if we do not already have a canvas implementation
if (!document.createElement('canvas').getContext) {

(function() {

  // alias some functions to make (compiled) code shorter
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;
  var abs = m.abs;
  var sqrt = m.sqrt;

  // this is used for sub pixel precision
  var Z = 10;
  var Z2 = Z / 2;

  /**
   * This funtion is assigned to the <canvas> elements as element.getContext().
   * @this {HTMLElement}
   * @return {CanvasRenderingContext2D_}
   */
  function getContext() {
    return this.context_ ||
        (this.context_ = new CanvasRenderingContext2D_(this));
  }

  var slice = Array.prototype.slice;

  /**
   * Binds a function to an object. The returned function will always use the
   * passed in {@code obj} as {@code this}.
   *
   * Example:
   *
   *   g = bind(f, obj, a, b)
   *   g(c, d) // will do f.call(obj, a, b, c, d)
   *
   * @param {Function} f The function to bind the object to
   * @param {Object} obj The object that should act as this when the function
   *     is called
   * @param {*} var_args Rest arguments that will be used as the initial
   *     arguments when the function is called
   * @return {Function} A new function that has bound this
   */
  function bind(f, obj, var_args) {
    var a = slice.call(arguments, 2);
    return function() {
      return f.apply(obj, a.concat(slice.call(arguments)));
    };
  }

  var G_vmlCanvasManager_ = {
    init: function(opt_doc) {
      if (/MSIE/.test(navigator.userAgent) && !window.opera) {
        var doc = opt_doc || document;
        // Create a dummy element so that IE will allow canvas elements to be
        // recognized.
        doc.createElement('canvas');
        doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
      }
    },

    init_: function(doc) {
      // create xmlns
      if (!doc.namespaces['g_vml_']) {
        doc.namespaces.add('g_vml_', 'urn:schemas-microsoft-com:vml',
                           '#default#VML');

      }
      if (!doc.namespaces['g_o_']) {
        doc.namespaces.add('g_o_', 'urn:schemas-microsoft-com:office:office',
                           '#default#VML');
      }

      // Setup default CSS.  Only add one style sheet per document
      if (!doc.styleSheets['ex_canvas_']) {
        var ss = doc.createStyleSheet();
        ss.owningElement.id = 'ex_canvas_';
        ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
            // default size is 300x150 in Gecko and Opera
            'text-align:left;width:300px;height:150px}' +
            'g_vml_\\:*{behavior:url(#default#VML)}' +
            'g_o_\\:*{behavior:url(#default#VML)}';

      }

      // find all canvas elements
      var els = doc.getElementsByTagName('canvas');
      for (var i = 0; i < els.length; i++) {
        this.initElement(els[i]);
      }
    },

    /**
     * Public initializes a canvas element so that it can be used as canvas
     * element from now on. This is called automatically before the page is
     * loaded but if you are creating elements using createElement you need to
     * make sure this is called on the element.
     * @param {HTMLElement} el The canvas element to initialize.
     * @return {HTMLElement} the element that was created.
     */
    initElement: function(el) {
      if (!el.getContext) {

        el.getContext = getContext;

        // Remove fallback content. There is no way to hide text nodes so we
        // just remove all childNodes. We could hide all elements and remove
        // text nodes but who really cares about the fallback content.
        el.innerHTML = '';

        // do not use inline function because that will leak memory
        el.attachEvent('onpropertychange', onPropertyChange);
        el.attachEvent('onresize', onResize);

        var attrs = el.attributes;
        if (attrs.width && attrs.width.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setWidth_(attrs.width.nodeValue);
          el.style.width = attrs.width.nodeValue + 'px';
        } else {
          el.width = el.clientWidth;
        }
        if (attrs.height && attrs.height.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setHeight_(attrs.height.nodeValue);
          el.style.height = attrs.height.nodeValue + 'px';
        } else {
          el.height = el.clientHeight;
        }
        //el.getContext().setCoordsize_()
      }
      return el;
    }
  };

  function onPropertyChange(e) {
    var el = e.srcElement;

    switch (e.propertyName) {
      case 'width':
        el.style.width = el.attributes.width.nodeValue + 'px';
        el.getContext().clearRect();
        break;
      case 'height':
        el.style.height = el.attributes.height.nodeValue + 'px';
        el.getContext().clearRect();
        break;
    }
  }

  function onResize(e) {
    var el = e.srcElement;
    if (el.firstChild) {
      el.firstChild.style.width =  el.clientWidth + 'px';
      el.firstChild.style.height = el.clientHeight + 'px';
    }
  }

  G_vmlCanvasManager_.init();

  // precompute "00" to "FF"
  var dec2hex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  function matrixMultiply(m1, m2) {
    var result = createMatrixIdentity();

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;

        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }

        result[x][y] = sum;
      }
    }
    return result;
  }

  function copyState(o1, o2) {
    o2.fillStyle     = o1.fillStyle;
    o2.lineCap       = o1.lineCap;
    o2.lineJoin      = o1.lineJoin;
    o2.lineWidth     = o1.lineWidth;
    o2.miterLimit    = o1.miterLimit;
    o2.shadowBlur    = o1.shadowBlur;
    o2.shadowColor   = o1.shadowColor;
    o2.shadowOffsetX = o1.shadowOffsetX;
    o2.shadowOffsetY = o1.shadowOffsetY;
    o2.strokeStyle   = o1.strokeStyle;
    o2.globalAlpha   = o1.globalAlpha;
    o2.arcScaleX_    = o1.arcScaleX_;
    o2.arcScaleY_    = o1.arcScaleY_;
    o2.lineScale_    = o1.lineScale_;
  }

  function processStyle(styleString) {
    var str, alpha = 1;

    styleString = String(styleString);
    if (styleString.substring(0, 3) == 'rgb') {
      var start = styleString.indexOf('(', 3);
      var end = styleString.indexOf(')', start + 1);
      var guts = styleString.substring(start + 1, end).split(',');

      str = '#';
      for (var i = 0; i < 3; i++) {
        str += dec2hex[Number(guts[i])];
      }

      if (guts.length == 4 && styleString.substr(3, 1) == 'a') {
        alpha = guts[3];
      }
    } else {
      str = styleString;
    }

    return {color: str, alpha: alpha};
  }

  function processLineCap(lineCap) {
    switch (lineCap) {
      case 'butt':
        return 'flat';
      case 'round':
        return 'round';
      case 'square':
      default:
        return 'square';
    }
  }

  /**
   * This class implements CanvasRenderingContext2D interface as described by
   * the WHATWG.
   * @param {HTMLElement} surfaceElement The element that the 2D context should
   * be associated with
   */
  function CanvasRenderingContext2D_(surfaceElement) {
    this.m_ = createMatrixIdentity();

    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];

    // Canvas context properties
    this.strokeStyle = '#000';
    this.fillStyle = '#000';

    this.lineWidth = 1;
    this.lineJoin = 'miter';
    this.lineCap = 'butt';
    this.miterLimit = Z * 1;
    this.globalAlpha = 1;
    this.canvas = surfaceElement;

    var el = surfaceElement.ownerDocument.createElement('div');
    el.style.width =  surfaceElement.clientWidth + 'px';
    el.style.height = surfaceElement.clientHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.position = 'absolute';
    surfaceElement.appendChild(el);

    this.element_ = el;
    this.arcScaleX_ = 1;
    this.arcScaleY_ = 1;
    this.lineScale_ = 1;
  }

  var contextPrototype = CanvasRenderingContext2D_.prototype;
  contextPrototype.clearRect = function() {
    this.element_.innerHTML = '';
  };

  contextPrototype.beginPath = function() {
    // TODO: Branch current matrix so that save/restore has no effect
    //       as per safari docs.
    this.currentPath_ = [];
  };

  contextPrototype.moveTo = function(aX, aY) {
    var p = this.getCoords_(aX, aY);
    this.currentPath_.push({type: 'moveTo', x: p.x, y: p.y});
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.lineTo = function(aX, aY) {
    var p = this.getCoords_(aX, aY);
    this.currentPath_.push({type: 'lineTo', x: p.x, y: p.y});

    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                            aCP2x, aCP2y,
                                            aX, aY) {
    var p = this.getCoords_(aX, aY);
    var cp1 = this.getCoords_(aCP1x, aCP1y);
    var cp2 = this.getCoords_(aCP2x, aCP2y);
    bezierCurveTo(this, cp1, cp2, p);
  };

  // Helper function that takes the already fixed cordinates.
  function bezierCurveTo(self, cp1, cp2, p) {
    self.currentPath_.push({
      type: 'bezierCurveTo',
      cp1x: cp1.x,
      cp1y: cp1.y,
      cp2x: cp2.x,
      cp2y: cp2.y,
      x: p.x,
      y: p.y
    });
    self.currentX_ = p.x;
    self.currentY_ = p.y;
  }

  contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    // the following is lifted almost directly from
    // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

    var cp = this.getCoords_(aCPx, aCPy);
    var p = this.getCoords_(aX, aY);

    var cp1 = {
      x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
      y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
    };
    var cp2 = {
      x: cp1.x + (p.x - this.currentX_) / 3.0,
      y: cp1.y + (p.y - this.currentY_) / 3.0
    };

    bezierCurveTo(this, cp1, cp2, p);
  };

  contextPrototype.arc = function(aX, aY, aRadius,
                                  aStartAngle, aEndAngle, aClockwise) {
    aRadius *= Z;
    var arcType = aClockwise ? 'at' : 'wa';

    var xStart = aX + mc(aStartAngle) * aRadius - Z2;
    var yStart = aY + ms(aStartAngle) * aRadius - Z2;

    var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
    var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

    // IE won't render arches drawn counter clockwise if xStart == xEnd.
    if (xStart == xEnd && !aClockwise) {
      xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                       // that can be represented in binary
    }

    var p = this.getCoords_(aX, aY);
    var pStart = this.getCoords_(xStart, yStart);
    var pEnd = this.getCoords_(xEnd, yEnd);

    this.currentPath_.push({type: arcType,
                           x: p.x,
                           y: p.y,
                           radius: aRadius,
                           xStart: pStart.x,
                           yStart: pStart.y,
                           xEnd: pEnd.x,
                           yEnd: pEnd.y});

  };

  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
  };

  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.stroke();

    this.currentPath_ = oldPath;
  };

  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.fill();

    this.currentPath_ = oldPath;
  };

  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
    var gradient = new CanvasGradient_('gradient');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    return gradient;
  };

  contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
                                                   aX1, aY1, aR1) {
    var gradient = new CanvasGradient_('gradientradial');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.r0_ = aR0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    gradient.r1_ = aR1;
    return gradient;
  };

  contextPrototype.drawImage = function(image, var_args) {
    var dx, dy, dw, dh, sx, sy, sw, sh;

    // to find the original width we overide the width and height
    var oldRuntimeWidth = image.runtimeStyle.width;
    var oldRuntimeHeight = image.runtimeStyle.height;
    image.runtimeStyle.width = 'auto';
    image.runtimeStyle.height = 'auto';

    // get the original size
    var w = image.width;
    var h = image.height;

    // and remove overides
    image.runtimeStyle.width = oldRuntimeWidth;
    image.runtimeStyle.height = oldRuntimeHeight;

    if (arguments.length == 3) {
      dx = arguments[1];
      dy = arguments[2];
      sx = sy = 0;
      sw = dw = w;
      sh = dh = h;
    } else if (arguments.length == 5) {
      dx = arguments[1];
      dy = arguments[2];
      dw = arguments[3];
      dh = arguments[4];
      sx = sy = 0;
      sw = w;
      sh = h;
    } else if (arguments.length == 9) {
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else {
      throw Error('Invalid number of arguments');
    }

    var d = this.getCoords_(dx, dy);

    var w2 = sw / 2;
    var h2 = sh / 2;

    var vmlStr = [];

    var W = 10;
    var H = 10;

    // For some reason that I've now forgotten, using divs didn't work
    vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

    // If filters are necessary (rotation exists), create them
    // filters are bog-slow, so only create them if abbsolutely necessary
    // The following check doesn't account for skews (which don't exist
    // in the canvas spec (yet) anyway.

    if (this.m_[0][0] != 1 || this.m_[0][1]) {
      var filter = [];

      // Note the 12/21 reversal
      filter.push('M11=', this.m_[0][0], ',',
                  'M12=', this.m_[1][0], ',',
                  'M21=', this.m_[0][1], ',',
                  'M22=', this.m_[1][1], ',',
                  'Dx=', mr(d.x / Z), ',',
                  'Dy=', mr(d.y / Z), '');

      // Bounding box calculation (need to minimize displayed area so that
      // filters don't waste time on unused pixels.
      var max = d;
      var c2 = this.getCoords_(dx + dw, dy);
      var c3 = this.getCoords_(dx, dy + dh);
      var c4 = this.getCoords_(dx + dw, dy + dh);

      max.x = m.max(max.x, c2.x, c3.x, c4.x);
      max.y = m.max(max.y, c2.y, c3.y, c4.y);

      vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
                  'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
                  filter.join(''), ", sizingmethod='clip');")
    } else {
      vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
    }

    vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, 'px;',
                ' height:', Z * dh, 'px;"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

    this.element_.insertAdjacentHTML('BeforeEnd',
                                    vmlStr.join(''));
  };

  contextPrototype.stroke = function(aFill) {
    var lineStr = [];
    var lineOpen = false;
    var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
    var color = a.color;
    var opacity = a.alpha * this.globalAlpha;

    var W = 10;
    var H = 10;

    lineStr.push('<g_vml_:shape',
                 ' filled="', !!aFill, '"',
                 ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
                 ' coordorigin="0 0" coordsize="', Z * W, ' ', Z * H, '"',
                 ' stroked="', !aFill, '"',
                 ' path="');

    var newSeq = false;
    var min = {x: null, y: null};
    var max = {x: null, y: null};

    for (var i = 0; i < this.currentPath_.length; i++) {
      var p = this.currentPath_[i];
      var c;

      switch (p.type) {
        case 'moveTo':
          c = p;
          lineStr.push(' m ', mr(p.x), ',', mr(p.y));
          break;
        case 'lineTo':
          lineStr.push(' l ', mr(p.x), ',', mr(p.y));
          break;
        case 'close':
          lineStr.push(' x ');
          p = null;
          break;
        case 'bezierCurveTo':
          lineStr.push(' c ',
                       mr(p.cp1x), ',', mr(p.cp1y), ',',
                       mr(p.cp2x), ',', mr(p.cp2y), ',',
                       mr(p.x), ',', mr(p.y));
          break;
        case 'at':
        case 'wa':
          lineStr.push(' ', p.type, ' ',
                       mr(p.x - this.arcScaleX_ * p.radius), ',',
                       mr(p.y - this.arcScaleY_ * p.radius), ' ',
                       mr(p.x + this.arcScaleX_ * p.radius), ',',
                       mr(p.y + this.arcScaleY_ * p.radius), ' ',
                       mr(p.xStart), ',', mr(p.yStart), ' ',
                       mr(p.xEnd), ',', mr(p.yEnd));
          break;
      }


      // TODO: Following is broken for curves due to
      //       move to proper paths.

      // Figure out dimensions so we can do gradient fills
      // properly
      if (p) {
        if (min.x == null || p.x < min.x) {
          min.x = p.x;
        }
        if (max.x == null || p.x > max.x) {
          max.x = p.x;
        }
        if (min.y == null || p.y < min.y) {
          min.y = p.y;
        }
        if (max.y == null || p.y > max.y) {
          max.y = p.y;
        }
      }
    }
    lineStr.push(' ">');

    if (!aFill) {
      var lineWidth = this.lineScale_ * this.lineWidth;

      // VML cannot correctly render a line if the width is less than 1px.
      // In that case, we dilute the color to make the line look thinner.
      if (lineWidth < 1) {
        opacity *= lineWidth;
      }

      lineStr.push(
        '<g_vml_:stroke',
        ' opacity="', opacity, '"',
        ' joinstyle="', this.lineJoin, '"',
        ' miterlimit="', this.miterLimit, '"',
        ' endcap="', processLineCap(this.lineCap), '"',
        ' weight="', lineWidth, 'px"',
        ' color="', color, '" />'
      );
    } else if (typeof this.fillStyle == 'object') {
      var fillStyle = this.fillStyle;
      var angle = 0;
      var focus = {x: 0, y: 0};

      // additional offset
      var shift = 0;
      // scale factor for offset
      var expansion = 1;

      if (fillStyle.type_ == 'gradient') {
        var x0 = fillStyle.x0_ / this.arcScaleX_;
        var y0 = fillStyle.y0_ / this.arcScaleY_;
        var x1 = fillStyle.x1_ / this.arcScaleX_;
        var y1 = fillStyle.y1_ / this.arcScaleY_;
        var p0 = this.getCoords_(x0, y0);
        var p1 = this.getCoords_(x1, y1);
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        angle = Math.atan2(dx, dy) * 180 / Math.PI;

        // The angle should be a non-negative number.
        if (angle < 0) {
          angle += 360;
        }

        // Very small angles produce an unexpected result because they are
        // converted to a scientific notation string.
        if (angle < 1e-6) {
          angle = 0;
        }
      } else {
        var p0 = this.getCoords_(fillStyle.x0_, fillStyle.y0_);
        var width  = max.x - min.x;
        var height = max.y - min.y;
        focus = {
          x: (p0.x - min.x) / width,
          y: (p0.y - min.y) / height
        };

        width  /= this.arcScaleX_ * Z;
        height /= this.arcScaleY_ * Z;
        var dimension = m.max(width, height);
        shift = 2 * fillStyle.r0_ / dimension;
        expansion = 2 * fillStyle.r1_ / dimension - shift;
      }

      // We need to sort the color stops in ascending order by offset,
      // otherwise IE won't interpret it correctly.
      var stops = fillStyle.colors_;
      stops.sort(function(cs1, cs2) {
        return cs1.offset - cs2.offset;
      });

      var length = stops.length;
      var color1 = stops[0].color;
      var color2 = stops[length - 1].color;
      var opacity1 = stops[0].alpha * this.globalAlpha;
      var opacity2 = stops[length - 1].alpha * this.globalAlpha;

      var colors = [];
      for (var i = 0; i < length; i++) {
        var stop = stops[i];
        colors.push(stop.offset * expansion + shift + ' ' + stop.color);
      }

      // When colors attribute is used, the meanings of opacity and o:opacity2
      // are reversed.
      lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
                   ' method="none" focus="100%"',
                   ' color="', color1, '"',
                   ' color2="', color2, '"',
                   ' colors="', colors.join(','), '"',
                   ' opacity="', opacity2, '"',
                   ' g_o_:opacity2="', opacity1, '"',
                   ' angle="', angle, '"',
                   ' focusposition="', focus.x, ',', focus.y, '" />');
    } else {
      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
                   '" />');
    }

    lineStr.push('</g_vml_:shape>');

    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
  };

  contextPrototype.fill = function() {
    this.stroke(true);
  }

  contextPrototype.closePath = function() {
    this.currentPath_.push({type: 'close'});
  };

  /**
   * @private
   */
  contextPrototype.getCoords_ = function(aX, aY) {
    var m = this.m_;
    return {
      x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
      y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
    }
  };

  contextPrototype.save = function() {
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  contextPrototype.restore = function() {
    copyState(this.aStack_.pop(), this);
    this.m_ = this.mStack_.pop();
  };

  function matrixIsFinite(m) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 2; k++) {
        if (!isFinite(m[j][k]) || isNaN(m[j][k])) {
          return false;
        }
      }
    }
    return true;
  }

  function setM(ctx, m, updateLineScale) {
    if (!matrixIsFinite(m)) {
      return;
    }
    ctx.m_ = m;

    if (updateLineScale) {
      // Get the line scale.
      // Determinant of this.m_ means how much the area is enlarged by the
      // transformation. So its square root can be used as a scale factor
      // for width.
      var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      ctx.lineScale_ = sqrt(abs(det));
    }
  }

  contextPrototype.translate = function(aX, aY) {
    var m1 = [
      [1,  0,  0],
      [0,  1,  0],
      [aX, aY, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.rotate = function(aRot) {
    var c = mc(aRot);
    var s = ms(aRot);

    var m1 = [
      [c,  s, 0],
      [-s, c, 0],
      [0,  0, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.scale = function(aX, aY) {
    this.arcScaleX_ *= aX;
    this.arcScaleY_ *= aY;
    var m1 = [
      [aX, 0,  0],
      [0,  aY, 0],
      [0,  0,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
    var m1 = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
    var m = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, m, true);
  };

  /******** STUBS ********/
  contextPrototype.clip = function() {
    // TODO: Implement
  };

  contextPrototype.arcTo = function() {
    // TODO: Implement
  };

  contextPrototype.createPattern = function() {
    return new CanvasPattern_;
  };

  // Gradient / Pattern Stubs
  function CanvasGradient_(aType) {
    this.type_ = aType;
    this.x0_ = 0;
    this.y0_ = 0;
    this.r0_ = 0;
    this.x1_ = 0;
    this.y1_ = 0;
    this.r1_ = 0;
    this.colors_ = [];
  }

  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
    aColor = processStyle(aColor);
    this.colors_.push({offset: aOffset,
                       color: aColor.color,
                       alpha: aColor.alpha});
  };

  function CanvasPattern_() {}

  // set up externs
  G_vmlCanvasManager = G_vmlCanvasManager_;
  CanvasRenderingContext2D = CanvasRenderingContext2D_;
  CanvasGradient = CanvasGradient_;
  CanvasPattern = CanvasPattern_;

})();

} // if
/*----------------------------------------------------------------------------\
|                                Range Class                                  |
|-----------------------------------------------------------------------------|
|                         Created by Erik Arvidsson                           |
|                  (http://webfx.eae.net/contact.html#erik)                   |
|                      For WebFX (http://webfx.eae.net/)                      |
|-----------------------------------------------------------------------------|
| Used to  model the data  used  when working  with  sliders,  scrollbars and |
| progress bars.  Based  on  the  ideas of  the javax.swing.BoundedRangeModel |
| interface  defined  by  Sun  for  Java;   http://java.sun.com/products/jfc/ |
| swingdoc-api-1.0.3/com/sun/java/swing/BoundedRangeModel.html                |
|-----------------------------------------------------------------------------|
|                Copyright (c) 2002, 2005, 2006 Erik Arvidsson                |
|-----------------------------------------------------------------------------|
| Licensed under the Apache License, Version 2.0 (the "License"); you may not |
| use this file except in compliance with the License.  You may obtain a copy |
| of the License at http://www.apache.org/licenses/LICENSE-2.0                |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| Unless  required  by  applicable law or  agreed  to  in  writing,  software |
| distributed under the License is distributed on an  "AS IS" BASIS,  WITHOUT |
| WARRANTIES OR  CONDITIONS OF ANY KIND,  either express or implied.  See the |
| License  for the  specific language  governing permissions  and limitations |
| under the License.                                                          |
|-----------------------------------------------------------------------------|
| 2002-10-14 | Original version released                                      |
| 2005-10-27 | Use Math.round instead of Math.floor                           |
| 2006-05-28 | Changed license to Apache Software License 2.0.                |
|-----------------------------------------------------------------------------|
| Created 2002-10-14 | All changes are in the log above. | Updated 2006-05-28 |
\----------------------------------------------------------------------------*/


function Range() {
	this._value = 0;
	this._minimum = 0;
	this._maximum = 100;
	this._extent = 0;

	this._isChanging = false;
}

Range.prototype.setValue = function (value) {
	value = Math.round(parseFloat(value));
	if (isNaN(value)) return;
	if (this._value != value) {
		if (value + this._extent > this._maximum)
			this._value = this._maximum - this._extent;
		else if (value < this._minimum)
			this._value = this._minimum;
		else
			this._value = value;
		if (!this._isChanging && typeof this.onchange == "function")
			 this.onchange();
	}
};

Range.prototype.getValue = function () {
	return this._value;
};

Range.prototype.setExtent = function (extent) {
	if (this._extent != extent) {
		if (extent < 0)
			this._extent = 0;
		else if (this._value + extent > this._maximum)
			this._extent = this._maximum - this._value;
		else
			this._extent = extent;
		if (!this._isChanging && typeof this.onchange == "function")
			this.onchange();
	}
};

Range.prototype.getExtent = function () {
	return this._extent;
};

Range.prototype.setMinimum = function (minimum) {
	if (this._minimum != minimum) {
		var oldIsChanging = this._isChanging;
		this._isChanging = true;

		this._minimum = minimum;

		if (minimum > this._value)
			this.setValue(minimum);
		if (minimum > this._maximum) {
			this._extent = 0;
			this.setMaximum(minimum);
			this.setValue(minimum)
		}
		if (minimum + this._extent > this._maximum)
			this._extent = this._maximum - this._minimum;

		this._isChanging = oldIsChanging;
		if (!this._isChanging && typeof this.onchange == "function")
			this.onchange();
	}
};

Range.prototype.getMinimum = function () {
	return this._minimum;
};

Range.prototype.setMaximum = function (maximum) {
	if (this._maximum != maximum) {
		var oldIsChanging = this._isChanging;
		this._isChanging = true;

		this._maximum = maximum;

		if (maximum < this._value)
			this.setValue(maximum - this._extent);
		if (maximum < this._minimum) {
			this._extent = 0;
			this.setMinimum(maximum);
			this.setValue(this._maximum);
		}
		if (maximum < this._minimum + this._extent)
			this._extent = this._maximum - this._minimum;
		if (maximum < this._value + this._extent)
			this._extent = this._maximum - this._value;

		this._isChanging = oldIsChanging;
		if (!this._isChanging && typeof this.onchange == "function")
			this.onchange();
	}
};

Range.prototype.getMaximum = function () {
	return this._maximum;
};
/*----------------------------------------------------------------------------\
|                                Slider 1.02                                  |
|-----------------------------------------------------------------------------|
|                         Created by Erik Arvidsson                           |
|                  (http://webfx.eae.net/contact.html#erik)                   |
|                      For WebFX (http://webfx.eae.net/)                      |
|-----------------------------------------------------------------------------|
| A  slider  control that  degrades  to an  input control  for non  supported |
| browsers.                                                                   |
|-----------------------------------------------------------------------------|
|                Copyright (c) 2002, 2003, 2006 Erik Arvidsson                |
|-----------------------------------------------------------------------------|
| Licensed under the Apache License, Version 2.0 (the "License"); you may not |
| use this file except in compliance with the License.  You may obtain a copy |
| of the License at http://www.apache.org/licenses/LICENSE-2.0                |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| Unless  required  by  applicable law or  agreed  to  in  writing,  software |
| distributed under the License is distributed on an  "AS IS" BASIS,  WITHOUT |
| WARRANTIES OR  CONDITIONS OF ANY KIND,  either express or implied.  See the |
| License  for the  specific language  governing permissions  and limitations |
| under the License.                                                          |
|-----------------------------------------------------------------------------|
| Dependencies: timer.js - an OO abstraction of timers                        |
|               range.js - provides the data model for the slider             |
|               winclassic.css or any other css file describing the look      |
|-----------------------------------------------------------------------------|
| 2002-10-14 | Original version released                                      |
| 2003-03-27 | Added a test in the constructor for missing oElement arg       |
| 2003-11-27 | Only use mousewheel when focused                               |
| 2006-05-28 | Changed license to Apache Software License 2.0.                |
|-----------------------------------------------------------------------------|
| Created 2002-10-14 | All changes are in the log above. | Updated 2006-05-28 |
\----------------------------------------------------------------------------*/

Slider.isSupported = typeof document.createElement != "undefined" &&
	typeof document.documentElement != "undefined" &&
	typeof document.documentElement.offsetWidth == "number";


function Slider(oElement, oInput, sOrientation) {
	if (!oElement) return;
	this._orientation = sOrientation || "horizontal";
	this._range = new Range();
	this._range.setExtent(0);
	this._blockIncrement = 10;
	this._unitIncrement = 1;
	this._timer = new Timer(100);


	if (Slider.isSupported && oElement) {

		this.document = oElement.ownerDocument || oElement.document;

		this.element = oElement;
		this.element.slider = this;
		this.element.unselectable = "on";

		// add class name tag to class name
		this.element.className = this._orientation + " " + this.classNameTag + " " + this.element.className;

		// create line
		this.line = this.document.createElement("DIV");
		this.line.className = "line";
		this.line.unselectable = "on";
		this.line.appendChild(this.document.createElement("DIV"));
		this.element.appendChild(this.line);

		// create handle
		this.handle = this.document.createElement("DIV");
		this.handle.className = "handle";
		this.handle.unselectable = "on";
		this.handle.appendChild(this.document.createElement("DIV"));
		this.handle.firstChild.appendChild(
			this.document.createTextNode(String.fromCharCode(160)));
		this.element.appendChild(this.handle);
	}

	this.input = oInput;

	// events
	var oThis = this;
	this._range.onchange = function () {
		oThis.recalculate();
		if (typeof oThis.onchange == "function")
			oThis.onchange();
	};

	if (Slider.isSupported && oElement) {
		this.element.onfocus		= Slider.eventHandlers.onfocus;
		this.element.onblur			= Slider.eventHandlers.onblur;
		this.element.onmousedown	= Slider.eventHandlers.onmousedown;
		this.element.onmouseover	= Slider.eventHandlers.onmouseover;
		this.element.onmouseout		= Slider.eventHandlers.onmouseout;
		this.element.onkeydown		= Slider.eventHandlers.onkeydown;
		this.element.onkeypress		= Slider.eventHandlers.onkeypress;
		this.element.onmousewheel	= Slider.eventHandlers.onmousewheel;
		this.handle.onselectstart	=
		this.element.onselectstart	= function () { return false; };

		this._timer.ontimer = function () {
			oThis.ontimer();
		};

		// extra recalculate for ie
		window.setTimeout(function() {
			oThis.recalculate();
		}, 1);
	}
	else {
		this.input.onchange = function (e) {
			oThis.setValue(oThis.input.value);
		};
	}
}

Slider.eventHandlers = {

	// helpers to make events a bit easier
	getEvent:	function (e, el) {
		if (!e) {
			if (el)
				e = el.document.parentWindow.event;
			else
				e = window.event;
		}
		if (!e.srcElement) {
			var el = e.target;
			while (el != null && el.nodeType != 1)
				el = el.parentNode;
			e.srcElement = el;
		}
		if (typeof e.offsetX == "undefined") {
			e.offsetX = e.layerX;
			e.offsetY = e.layerY;
		}

		return e;
	},

	getDocument:	function (e) {
		if (e.target)
			return e.target.ownerDocument;
		return e.srcElement.document;
	},

	getSlider:	function (e) {
		var el = e.target || e.srcElement;
		while (el != null && el.slider == null)	{
			el = el.parentNode;
		}
		if (el)
			return el.slider;
		return null;
	},

	getLine:	function (e) {
		var el = e.target || e.srcElement;
		while (el != null && el.className != "line")	{
			el = el.parentNode;
		}
		return el;
	},

	getHandle:	function (e) {
		var el = e.target || e.srcElement;
		var re = /handle/;
		while (el != null && !re.test(el.className))	{
			el = el.parentNode;
		}
		return el;
	},
	// end helpers

	onfocus:	function (e) {
		var s = this.slider;
		s._focused = true;
		s.handle.className = "handle hover";
	},

	onblur:	function (e) {
		var s = this.slider
		s._focused = false;
		s.handle.className = "handle";
	},

	onmouseover:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (e.srcElement == s.handle)
			s.handle.className = "handle hover";
	},

	onmouseout:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (e.srcElement == s.handle && !s._focused)
			s.handle.className = "handle";
	},

	onmousedown:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (s.element.focus)
			s.element.focus();

		Slider._currentInstance = s;
		var doc = s.document;

		if (doc.addEventListener) {
			doc.addEventListener("mousemove", Slider.eventHandlers.onmousemove, true);
			doc.addEventListener("mouseup", Slider.eventHandlers.onmouseup, true);
		}
		else if (doc.attachEvent) {
			doc.attachEvent("onmousemove", Slider.eventHandlers.onmousemove);
			doc.attachEvent("onmouseup", Slider.eventHandlers.onmouseup);
			doc.attachEvent("onlosecapture", Slider.eventHandlers.onmouseup);
			s.element.setCapture();
		}

		if (Slider.eventHandlers.getHandle(e)) {	// start drag
			Slider._sliderDragData = {
				screenX:	e.screenX,
				screenY:	e.screenY,
				dx:			e.screenX - s.handle.offsetLeft,
				dy:			e.screenY - s.handle.offsetTop,
				startValue:	s.getValue(),
				slider:		s
			};
		}
		else {
			return;
			var lineEl = Slider.eventHandlers.getLine(e);
			s._mouseX = e.offsetX + (lineEl ? s.line.offsetLeft : 0);
			s._mouseY = e.offsetY + (lineEl ? s.line.offsetTop : 0);
			s._increasing = null;
			s.ontimer();
		}
	},

	onmousemove:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);

		if (Slider._sliderDragData) {	// drag
			var s = Slider._sliderDragData.slider;

			var boundSize = s.getMaximum() - s.getMinimum();
			var size, pos, reset;

			if (s._orientation == "horizontal") {
				size = s.element.offsetWidth - s.handle.offsetWidth;
				pos = e.screenX - Slider._sliderDragData.dx;
				reset = Math.abs(e.screenY - Slider._sliderDragData.screenY) > 100;
			}
			else {
				size = s.element.offsetHeight - s.handle.offsetHeight;
				pos = s.element.offsetHeight - s.handle.offsetHeight -
					(e.screenY - Slider._sliderDragData.dy);
				reset = Math.abs(e.screenX - Slider._sliderDragData.screenX) > 100;
			}
			s.setValue(reset ? Slider._sliderDragData.startValue :
						s.getMinimum() + boundSize * pos / size);
			return false;
		}
		else {
			return;
			var s = Slider._currentInstance;
			if (s != null) {
				var lineEl = Slider.eventHandlers.getLine(e);
				s._mouseX = e.offsetX + (lineEl ? s.line.offsetLeft : 0);
				s._mouseY = e.offsetY + (lineEl ? s.line.offsetTop : 0);
			}
		}

	},

	onmouseup:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = Slider._currentInstance;
		var doc = s.document;
		if (doc.removeEventListener) {
			doc.removeEventListener("mousemove", Slider.eventHandlers.onmousemove, true);
			doc.removeEventListener("mouseup", Slider.eventHandlers.onmouseup, true);
		}
		else if (doc.detachEvent) {
			doc.detachEvent("onmousemove", Slider.eventHandlers.onmousemove);
			doc.detachEvent("onmouseup", Slider.eventHandlers.onmouseup);
			doc.detachEvent("onlosecapture", Slider.eventHandlers.onmouseup);
			s.element.releaseCapture();
		}

		if (Slider._sliderDragData) {	// end drag
			Slider._sliderDragData = null;
		}
		else {
			return;
			s._timer.stop();
			s._increasing = null;
		}
		Slider._currentInstance = null;
	},

	onkeydown:	function (e) {
		return;
		e = Slider.eventHandlers.getEvent(e, this);
		//var s = Slider.eventHandlers.getSlider(e);
		var s = this.slider;
		var kc = e.keyCode;
		switch (kc) {
			case 33:	// page up
				s.setValue(s.getValue() + s.getBlockIncrement());
				break;
			case 34:	// page down
				s.setValue(s.getValue() - s.getBlockIncrement());
				break;
			case 35:	// end
				s.setValue(s.getOrientation() == "horizontal" ?
					s.getMaximum() :
					s.getMinimum());
				break;
			case 36:	// home
				s.setValue(s.getOrientation() == "horizontal" ?
					s.getMinimum() :
					s.getMaximum());
				break;
			case 38:	// up
			case 39:	// right
				s.setValue(s.getValue() + s.getUnitIncrement());
				break;

			case 37:	// left
			case 40:	// down
				s.setValue(s.getValue() - s.getUnitIncrement());
				break;
		}

		if (kc >= 33 && kc <= 40) {
			return false;
		}
	},

	onkeypress:	function (e) {
		return;
		e = Slider.eventHandlers.getEvent(e, this);
		var kc = e.keyCode;
		if (kc >= 33 && kc <= 40) {
			return false;
		}
	},

	onmousewheel:	function (e) {
		return;
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (s._focused) {
			s.setValue(s.getValue() + e.wheelDelta / 120 * s.getUnitIncrement());
			// windows inverts this on horizontal sliders. That does not
			// make sense to me
			return false;
		}
	}
};



Slider.prototype.classNameTag = "dynamic-slider-control",

Slider.prototype.setValue = function (v) {
	this._range.setValue(v);
	this.input.value = this.getValue();
};

Slider.prototype.getValue = function () {
	return this._range.getValue();
};

Slider.prototype.setMinimum = function (v) {
	this._range.setMinimum(v);
	this.input.value = this.getValue();
};

Slider.prototype.getMinimum = function () {
	return this._range.getMinimum();
};

Slider.prototype.setMaximum = function (v) {
	this._range.setMaximum(v);
	this.input.value = this.getValue();
};

Slider.prototype.getMaximum = function () {
	return this._range.getMaximum();
};

Slider.prototype.setUnitIncrement = function (v) {
	this._unitIncrement = v;
};

Slider.prototype.getUnitIncrement = function () {
	return this._unitIncrement;
};

Slider.prototype.setBlockIncrement = function (v) {
	this._blockIncrement = v;
};

Slider.prototype.getBlockIncrement = function () {
	return this._blockIncrement;
};

Slider.prototype.getOrientation = function () {
	return this._orientation;
};

Slider.prototype.setOrientation = function (sOrientation) {
	if (sOrientation != this._orientation) {
		if (Slider.isSupported && this.element) {
			// add class name tag to class name
			this.element.className = this.element.className.replace(this._orientation,
									sOrientation);
		}
		this._orientation = sOrientation;
		this.recalculate();

	}
};

Slider.prototype.recalculate = function() {
	if (!Slider.isSupported || !this.element) return;

	var w = this.element.offsetWidth;
	var h = this.element.offsetHeight;
	var hw = this.handle.offsetWidth;
	var hh = this.handle.offsetHeight;
	var lw = this.line.offsetWidth;
	var lh = this.line.offsetHeight;

	// this assumes a border-box layout

	if (this._orientation == "horizontal") {
		this.handle.style.left = (w - hw) * (this.getValue() - this.getMinimum()) /
			(this.getMaximum() - this.getMinimum()) + "px";
		this.handle.style.top = (h - hh) / 2 + "px";

		this.line.style.top = (h - lh) / 2 + "px";
		this.line.style.left = hw / 2 + "px";
		//this.line.style.right = hw / 2 + "px";
		this.line.style.width = Math.max(0, w - hw - 2)+ "px";
		this.line.firstChild.style.width = Math.max(0, w - hw - 4)+ "px";
	}
	else {
		this.handle.style.left = (w - hw) / 2 + "px";
		this.handle.style.top = h - hh - (h - hh) * (this.getValue() - this.getMinimum()) /
			(this.getMaximum() - this.getMinimum()) + "px";

		this.line.style.left = (w - lw) / 2 + "px";
		this.line.style.top = hh / 2 + "px";
		this.line.style.height = Math.max(0, h - hh - 2) + "px";	//hard coded border width
		//this.line.style.bottom = hh / 2 + "px";
		this.line.firstChild.style.height = Math.max(0, h - hh - 4) + "px";	//hard coded border width
	}
};

Slider.prototype.ontimer = function () {
	var hw = this.handle.offsetWidth;
	var hh = this.handle.offsetHeight;
	var hl = this.handle.offsetLeft;
	var ht = this.handle.offsetTop;

	if (this._orientation == "horizontal") {
		if (this._mouseX > hl + hw &&
			(this._increasing == null || this._increasing)) {
			this.setValue(this.getValue() + this.getBlockIncrement());
			this._increasing = true;
		}
		else if (this._mouseX < hl &&
			(this._increasing == null || !this._increasing)) {
			this.setValue(this.getValue() - this.getBlockIncrement());
			this._increasing = false;
		}
	}
	else {
		if (this._mouseY > ht + hh &&
			(this._increasing == null || !this._increasing)) {
			this.setValue(this.getValue() - this.getBlockIncrement());
			this._increasing = false;
		}
		else if (this._mouseY < ht &&
			(this._increasing == null || this._increasing)) {
			this.setValue(this.getValue() + this.getBlockIncrement());
			this._increasing = true;
		}
	}

	this._timer.start();
};
/*----------------------------------------------------------------------------\
|                                 Timer Class                                 |
|-----------------------------------------------------------------------------|
|                         Created by Erik Arvidsson                           |
|                  (http://webfx.eae.net/contact.html#erik)                   |
|                      For WebFX (http://webfx.eae.net/)                      |
|-----------------------------------------------------------------------------|
| Object Oriented Encapsulation  of setTimeout  fires ontimer when the  timer |
| is triggered. Does not work in IE 5.00                                      |
|-----------------------------------------------------------------------------|
|                   Copyright (c) 2002, 2006 Erik Arvidsson                   |
|-----------------------------------------------------------------------------|
| Licensed under the Apache License, Version 2.0 (the "License"); you may not |
| use this file except in compliance with the License.  You may obtain a copy |
| of the License at http://www.apache.org/licenses/LICENSE-2.0                |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| Unless  required  by  applicable law or  agreed  to  in  writing,  software |
| distributed under the License is distributed on an  "AS IS" BASIS,  WITHOUT |
| WARRANTIES OR  CONDITIONS OF ANY KIND,  either express or implied.  See the |
| License  for the  specific language  governing permissions  and limitations |
| under the License.                                                          |
|-----------------------------------------------------------------------------|
| 2002-10-14 | Original version released                                      |
| 2006-05-28 | Changed license to Apache Software License 2.0.                |
|-----------------------------------------------------------------------------|
| Created 2002-10-14 | All changes are in the log above. | Updated 2006-05-28 |
\----------------------------------------------------------------------------*/

function Timer(nPauseTime) {
	this._pauseTime = typeof nPauseTime == "undefined" ? 1000 : nPauseTime;
	this._timer = null;
	this._isStarted = false;
}

Timer.prototype.start = function () {
	if (this.isStarted())
		this.stop();
	var oThis = this;
	this._timer = window.setTimeout(function () {
		if (typeof oThis.ontimer == "function")
			oThis.ontimer();
	}, this._pauseTime);
	this._isStarted = false;
};

Timer.prototype.stop = function () {
	if (this._timer != null)
		window.clearTimeout(this._timer);
	this._isStarted = false;
};

Timer.prototype.isStarted = function () {
	return this._isStarted;
};

Timer.prototype.getPauseTime = function () {
	return this._pauseTime;
};

Timer.prototype.setPauseTime = function (nPauseTime) {
	this._pauseTime = nPauseTime;
};
/*

  OpenLayers.js -- OpenLayers Map Viewer Library

  Copyright (c) 2006-2012 by OpenLayers Contributors
  Published under the 2-clause BSD license.
  See http://openlayers.org/dev/license.txt for the full text of the license, and http://openlayers.org/dev/authors.txt for full list of contributors.

  Includes compressed code under the following licenses:

  (For uncompressed versions of the code used, please see the
  OpenLayers Github repository: <https://github.com/openlayers/openlayers>)

*/

/**
 * Contains XMLHttpRequest.js <http://code.google.com/p/xmlhttprequest/>
 * Copyright 2007 Sergey Ilinsky (http://www.ilinsky.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * OpenLayers.Util.pagePosition is based on Yahoo's getXY method, which is
 * Copyright (c) 2006, Yahoo! Inc.
 * All rights reserved.
 * 
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 * 
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * 
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * 
 * * Neither the name of Yahoo! Inc. nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without
 *   specific prior written permission of Yahoo! Inc.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE.
 */
var OpenLayers={VERSION_NUMBER:"Release 2.12",singleFile:!0,_getScriptLocation:function(){for(var a=/(^|(.*?\/))(OpenLayers[^\/]*?\.js)(\?|$)/,b=document.getElementsByTagName("script"),c,d="",e=0,f=b.length;e<f;e++)if(c=b[e].getAttribute("src"))if(c=c.match(a)){d=c[1];break}return function(){return d}}(),ImgPath:""};OpenLayers.Class=function(){var a=arguments.length,b=arguments[0],c=arguments[a-1],d="function"==typeof c.initialize?c.initialize:function(){b.prototype.initialize.apply(this,arguments)};1<a?(a=[d,b].concat(Array.prototype.slice.call(arguments).slice(1,a-1),c),OpenLayers.inherit.apply(null,a)):d.prototype=c;return d};
OpenLayers.inherit=function(a,b){var c=function(){};c.prototype=b.prototype;a.prototype=new c;var d,e,c=2;for(d=arguments.length;c<d;c++)e=arguments[c],"function"===typeof e&&(e=e.prototype),OpenLayers.Util.extend(a.prototype,e)};OpenLayers.Util=OpenLayers.Util||{};OpenLayers.Util.extend=function(a,b){a=a||{};if(b){for(var c in b){var d=b[c];void 0!==d&&(a[c]=d)}!("function"==typeof window.Event&&b instanceof window.Event)&&(b.hasOwnProperty&&b.hasOwnProperty("toString"))&&(a.toString=b.toString)}return a};OpenLayers.String={startsWith:function(a,b){return 0==a.indexOf(b)},contains:function(a,b){return-1!=a.indexOf(b)},trim:function(a){return a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")},camelize:function(a){for(var a=a.split("-"),b=a[0],c=1,d=a.length;c<d;c++)var e=a[c],b=b+(e.charAt(0).toUpperCase()+e.substring(1));return b},format:function(a,b,c){b||(b=window);return a.replace(OpenLayers.String.tokenRegEx,function(a,e){for(var f,g=e.split(/\.+/),h=0;h<g.length;h++)0==h&&(f=b),f=f[g[h]];"function"==
typeof f&&(f=c?f.apply(null,c):f());return"undefined"==typeof f?"undefined":f})},tokenRegEx:/\$\{([\w.]+?)\}/g,numberRegEx:/^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/,isNumeric:function(a){return OpenLayers.String.numberRegEx.test(a)},numericIf:function(a){return OpenLayers.String.isNumeric(a)?parseFloat(a):a}};
OpenLayers.Number={decimalSeparator:".",thousandsSeparator:",",limitSigDigs:function(a,b){var c=0;0<b&&(c=parseFloat(a.toPrecision(b)));return c},format:function(a,b,c,d){b="undefined"!=typeof b?b:0;c="undefined"!=typeof c?c:OpenLayers.Number.thousandsSeparator;d="undefined"!=typeof d?d:OpenLayers.Number.decimalSeparator;null!=b&&(a=parseFloat(a.toFixed(b)));var e=a.toString().split(".");1==e.length&&null==b&&(b=0);a=e[0];if(c)for(var f=/(-?[0-9]+)([0-9]{3})/;f.test(a);)a=a.replace(f,"$1"+c+"$2");
0==b?b=a:(c=1<e.length?e[1]:"0",null!=b&&(c+=Array(b-c.length+1).join("0")),b=a+d+c);return b}};OpenLayers.Function={bind:function(a,b){var c=Array.prototype.slice.apply(arguments,[2]);return function(){var d=c.concat(Array.prototype.slice.apply(arguments,[0]));return a.apply(b,d)}},bindAsEventListener:function(a,b){return function(c){return a.call(b,c||window.event)}},False:function(){return!1},True:function(){return!0},Void:function(){}};
OpenLayers.Array={filter:function(a,b,c){var d=[];if(Array.prototype.filter)d=a.filter(b,c);else{var e=a.length;if("function"!=typeof b)throw new TypeError;for(var f=0;f<e;f++)if(f in a){var g=a[f];b.call(c,g,f,a)&&d.push(g)}}return d}};OpenLayers.Bounds=OpenLayers.Class({left:null,bottom:null,right:null,top:null,centerLonLat:null,initialize:function(a,b,c,d){OpenLayers.Util.isArray(a)&&(d=a[3],c=a[2],b=a[1],a=a[0]);null!=a&&(this.left=OpenLayers.Util.toFloat(a));null!=b&&(this.bottom=OpenLayers.Util.toFloat(b));null!=c&&(this.right=OpenLayers.Util.toFloat(c));null!=d&&(this.top=OpenLayers.Util.toFloat(d))},clone:function(){return new OpenLayers.Bounds(this.left,this.bottom,this.right,this.top)},equals:function(a){var b=!1;null!=
a&&(b=this.left==a.left&&this.right==a.right&&this.top==a.top&&this.bottom==a.bottom);return b},toString:function(){return[this.left,this.bottom,this.right,this.top].join()},toArray:function(a){return!0===a?[this.bottom,this.left,this.top,this.right]:[this.left,this.bottom,this.right,this.top]},toBBOX:function(a,b){null==a&&(a=6);var c=Math.pow(10,a),d=Math.round(this.left*c)/c,e=Math.round(this.bottom*c)/c,f=Math.round(this.right*c)/c,c=Math.round(this.top*c)/c;return!0===b?e+","+d+","+c+","+f:d+
","+e+","+f+","+c},toGeometry:function(){return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(this.left,this.bottom),new OpenLayers.Geometry.Point(this.right,this.bottom),new OpenLayers.Geometry.Point(this.right,this.top),new OpenLayers.Geometry.Point(this.left,this.top)])])},getWidth:function(){return this.right-this.left},getHeight:function(){return this.top-this.bottom},getSize:function(){return new OpenLayers.Size(this.getWidth(),this.getHeight())},
getCenterPixel:function(){return new OpenLayers.Pixel((this.left+this.right)/2,(this.bottom+this.top)/2)},getCenterLonLat:function(){this.centerLonLat||(this.centerLonLat=new OpenLayers.LonLat((this.left+this.right)/2,(this.bottom+this.top)/2));return this.centerLonLat},scale:function(a,b){null==b&&(b=this.getCenterLonLat());var c,d;"OpenLayers.LonLat"==b.CLASS_NAME?(c=b.lon,d=b.lat):(c=b.x,d=b.y);return new OpenLayers.Bounds((this.left-c)*a+c,(this.bottom-d)*a+d,(this.right-c)*a+c,(this.top-d)*a+
d)},add:function(a,b){if(null==a||null==b)throw new TypeError("Bounds.add cannot receive null values");return new OpenLayers.Bounds(this.left+a,this.bottom+b,this.right+a,this.top+b)},extend:function(a){var b=null;if(a){switch(a.CLASS_NAME){case "OpenLayers.LonLat":b=new OpenLayers.Bounds(a.lon,a.lat,a.lon,a.lat);break;case "OpenLayers.Geometry.Point":b=new OpenLayers.Bounds(a.x,a.y,a.x,a.y);break;case "OpenLayers.Bounds":b=a}if(b){this.centerLonLat=null;if(null==this.left||b.left<this.left)this.left=
b.left;if(null==this.bottom||b.bottom<this.bottom)this.bottom=b.bottom;if(null==this.right||b.right>this.right)this.right=b.right;if(null==this.top||b.top>this.top)this.top=b.top}}},containsLonLat:function(a,b){"boolean"===typeof b&&(b={inclusive:b});var b=b||{},c=this.contains(a.lon,a.lat,b.inclusive),d=b.worldBounds;d&&!c&&(c=d.getWidth(),d=Math.round((a.lon-(d.left+d.right)/2)/c),c=this.containsLonLat({lon:a.lon-d*c,lat:a.lat},{inclusive:b.inclusive}));return c},containsPixel:function(a,b){return this.contains(a.x,
a.y,b)},contains:function(a,b,c){null==c&&(c=!0);if(null==a||null==b)return!1;var a=OpenLayers.Util.toFloat(a),b=OpenLayers.Util.toFloat(b),d=!1;return d=c?a>=this.left&&a<=this.right&&b>=this.bottom&&b<=this.top:a>this.left&&a<this.right&&b>this.bottom&&b<this.top},intersectsBounds:function(a,b){"boolean"===typeof b&&(b={inclusive:b});b=b||{};if(b.worldBounds)var c=this.wrapDateLine(b.worldBounds),a=a.wrapDateLine(b.worldBounds);else c=this;null==b.inclusive&&(b.inclusive=!0);var d=!1,e=c.left==
a.right||c.right==a.left||c.top==a.bottom||c.bottom==a.top;if(b.inclusive||!e)var d=a.top>=c.bottom&&a.top<=c.top||c.top>a.bottom&&c.top<a.top,e=a.left>=c.left&&a.left<=c.right||c.left>=a.left&&c.left<=a.right,f=a.right>=c.left&&a.right<=c.right||c.right>=a.left&&c.right<=a.right,d=(a.bottom>=c.bottom&&a.bottom<=c.top||c.bottom>=a.bottom&&c.bottom<=a.top||d)&&(e||f);if(b.worldBounds&&!d){var g=b.worldBounds,e=g.getWidth(),f=!g.containsBounds(c),g=!g.containsBounds(a);f&&!g?(a=a.add(-e,0),d=c.intersectsBounds(a,
{inclusive:b.inclusive})):g&&!f&&(c=c.add(-e,0),d=a.intersectsBounds(c,{inclusive:b.inclusive}))}return d},containsBounds:function(a,b,c){null==b&&(b=!1);null==c&&(c=!0);var d=this.contains(a.left,a.bottom,c),e=this.contains(a.right,a.bottom,c),f=this.contains(a.left,a.top,c),a=this.contains(a.right,a.top,c);return b?d||e||f||a:d&&e&&f&&a},determineQuadrant:function(a){var b="",c=this.getCenterLonLat(),b=b+(a.lat<c.lat?"b":"t");return b+=a.lon<c.lon?"l":"r"},transform:function(a,b){this.centerLonLat=
null;var c=OpenLayers.Projection.transform({x:this.left,y:this.bottom},a,b),d=OpenLayers.Projection.transform({x:this.right,y:this.bottom},a,b),e=OpenLayers.Projection.transform({x:this.left,y:this.top},a,b),f=OpenLayers.Projection.transform({x:this.right,y:this.top},a,b);this.left=Math.min(c.x,e.x);this.bottom=Math.min(c.y,d.y);this.right=Math.max(d.x,f.x);this.top=Math.max(e.y,f.y);return this},wrapDateLine:function(a,b){var b=b||{},c=b.leftTolerance||0,d=b.rightTolerance||0,e=this.clone();if(a){for(var f=
a.getWidth();e.left<a.left&&e.right-d<=a.left;)e=e.add(f,0);for(;e.left+c>=a.right&&e.right>a.right;)e=e.add(-f,0);c=e.left+c;c<a.right&&(c>a.left&&e.right-d>a.right)&&(e=e.add(-f,0))}return e},CLASS_NAME:"OpenLayers.Bounds"});OpenLayers.Bounds.fromString=function(a,b){var c=a.split(",");return OpenLayers.Bounds.fromArray(c,b)};OpenLayers.Bounds.fromArray=function(a,b){return!0===b?new OpenLayers.Bounds(a[1],a[0],a[3],a[2]):new OpenLayers.Bounds(a[0],a[1],a[2],a[3])};
OpenLayers.Bounds.fromSize=function(a){return new OpenLayers.Bounds(0,a.h,a.w,0)};OpenLayers.Bounds.oppositeQuadrant=function(a){var b;b=""+("t"==a.charAt(0)?"b":"t");return b+="l"==a.charAt(1)?"r":"l"};OpenLayers.Element={visible:function(a){return"none"!=OpenLayers.Util.getElement(a).style.display},toggle:function(){for(var a=0,b=arguments.length;a<b;a++){var c=OpenLayers.Util.getElement(arguments[a]),d=OpenLayers.Element.visible(c)?"none":"";c.style.display=d}},remove:function(a){a=OpenLayers.Util.getElement(a);a.parentNode.removeChild(a)},getHeight:function(a){a=OpenLayers.Util.getElement(a);return a.offsetHeight},hasClass:function(a,b){var c=a.className;return!!c&&RegExp("(^|\\s)"+b+"(\\s|$)").test(c)},
addClass:function(a,b){OpenLayers.Element.hasClass(a,b)||(a.className+=(a.className?" ":"")+b);return a},removeClass:function(a,b){var c=a.className;c&&(a.className=OpenLayers.String.trim(c.replace(RegExp("(^|\\s+)"+b+"(\\s+|$)")," ")));return a},toggleClass:function(a,b){OpenLayers.Element.hasClass(a,b)?OpenLayers.Element.removeClass(a,b):OpenLayers.Element.addClass(a,b);return a},getStyle:function(a,b){var a=OpenLayers.Util.getElement(a),c=null;if(a&&a.style){c=a.style[OpenLayers.String.camelize(b)];
c||(document.defaultView&&document.defaultView.getComputedStyle?c=(c=document.defaultView.getComputedStyle(a,null))?c.getPropertyValue(b):null:a.currentStyle&&(c=a.currentStyle[OpenLayers.String.camelize(b)]));var d=["left","top","right","bottom"];window.opera&&(-1!=OpenLayers.Util.indexOf(d,b)&&"static"==OpenLayers.Element.getStyle(a,"position"))&&(c="auto")}return"auto"==c?null:c}};OpenLayers.LonLat=OpenLayers.Class({lon:0,lat:0,initialize:function(a,b){OpenLayers.Util.isArray(a)&&(b=a[1],a=a[0]);this.lon=OpenLayers.Util.toFloat(a);this.lat=OpenLayers.Util.toFloat(b)},toString:function(){return"lon="+this.lon+",lat="+this.lat},toShortString:function(){return this.lon+", "+this.lat},clone:function(){return new OpenLayers.LonLat(this.lon,this.lat)},add:function(a,b){if(null==a||null==b)throw new TypeError("LonLat.add cannot receive null values");return new OpenLayers.LonLat(this.lon+
OpenLayers.Util.toFloat(a),this.lat+OpenLayers.Util.toFloat(b))},equals:function(a){var b=!1;null!=a&&(b=this.lon==a.lon&&this.lat==a.lat||isNaN(this.lon)&&isNaN(this.lat)&&isNaN(a.lon)&&isNaN(a.lat));return b},transform:function(a,b){var c=OpenLayers.Projection.transform({x:this.lon,y:this.lat},a,b);this.lon=c.x;this.lat=c.y;return this},wrapDateLine:function(a){var b=this.clone();if(a){for(;b.lon<a.left;)b.lon+=a.getWidth();for(;b.lon>a.right;)b.lon-=a.getWidth()}return b},CLASS_NAME:"OpenLayers.LonLat"});
OpenLayers.LonLat.fromString=function(a){a=a.split(",");return new OpenLayers.LonLat(a[0],a[1])};OpenLayers.LonLat.fromArray=function(a){var b=OpenLayers.Util.isArray(a);return new OpenLayers.LonLat(b&&a[0],b&&a[1])};OpenLayers.Pixel=OpenLayers.Class({x:0,y:0,initialize:function(a,b){this.x=parseFloat(a);this.y=parseFloat(b)},toString:function(){return"x="+this.x+",y="+this.y},clone:function(){return new OpenLayers.Pixel(this.x,this.y)},equals:function(a){var b=!1;null!=a&&(b=this.x==a.x&&this.y==a.y||isNaN(this.x)&&isNaN(this.y)&&isNaN(a.x)&&isNaN(a.y));return b},distanceTo:function(a){return Math.sqrt(Math.pow(this.x-a.x,2)+Math.pow(this.y-a.y,2))},add:function(a,b){if(null==a||null==b)throw new TypeError("Pixel.add cannot receive null values");
return new OpenLayers.Pixel(this.x+a,this.y+b)},offset:function(a){var b=this.clone();a&&(b=this.add(a.x,a.y));return b},CLASS_NAME:"OpenLayers.Pixel"});OpenLayers.Size=OpenLayers.Class({w:0,h:0,initialize:function(a,b){this.w=parseFloat(a);this.h=parseFloat(b)},toString:function(){return"w="+this.w+",h="+this.h},clone:function(){return new OpenLayers.Size(this.w,this.h)},equals:function(a){var b=!1;null!=a&&(b=this.w==a.w&&this.h==a.h||isNaN(this.w)&&isNaN(this.h)&&isNaN(a.w)&&isNaN(a.h));return b},CLASS_NAME:"OpenLayers.Size"});OpenLayers.Console={log:function(){},debug:function(){},info:function(){},warn:function(){},error:function(){},userError:function(a){alert(a)},assert:function(){},dir:function(){},dirxml:function(){},trace:function(){},group:function(){},groupEnd:function(){},time:function(){},timeEnd:function(){},profile:function(){},profileEnd:function(){},count:function(){},CLASS_NAME:"OpenLayers.Console"};
(function(){for(var a=document.getElementsByTagName("script"),b=0,c=a.length;b<c;++b)if(-1!=a[b].src.indexOf("firebug.js")&&console){OpenLayers.Util.extend(OpenLayers.Console,console);break}})();OpenLayers.Lang={code:null,defaultCode:"en",getCode:function(){OpenLayers.Lang.code||OpenLayers.Lang.setCode();return OpenLayers.Lang.code},setCode:function(a){var b;a||(a="msie"==OpenLayers.BROWSER_NAME?navigator.userLanguage:navigator.language);a=a.split("-");a[0]=a[0].toLowerCase();"object"==typeof OpenLayers.Lang[a[0]]&&(b=a[0]);if(a[1]){var c=a[0]+"-"+a[1].toUpperCase();"object"==typeof OpenLayers.Lang[c]&&(b=c)}b||(OpenLayers.Console.warn("Failed to find OpenLayers.Lang."+a.join("-")+" dictionary, falling back to default language"),
b=OpenLayers.Lang.defaultCode);OpenLayers.Lang.code=b},translate:function(a,b){var c=OpenLayers.Lang[OpenLayers.Lang.getCode()];(c=c&&c[a])||(c=a);b&&(c=OpenLayers.String.format(c,b));return c}};OpenLayers.i18n=OpenLayers.Lang.translate;OpenLayers.Util=OpenLayers.Util||{};OpenLayers.Util.getElement=function(){for(var a=[],b=0,c=arguments.length;b<c;b++){var d=arguments[b];"string"==typeof d&&(d=document.getElementById(d));if(1==arguments.length)return d;a.push(d)}return a};OpenLayers.Util.isElement=function(a){return!!(a&&1===a.nodeType)};OpenLayers.Util.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)};"undefined"===typeof window.$&&(window.$=OpenLayers.Util.getElement);
OpenLayers.Util.removeItem=function(a,b){for(var c=a.length-1;c>=0;c--)a[c]==b&&a.splice(c,1);return a};OpenLayers.Util.indexOf=function(a,b){if(typeof a.indexOf=="function")return a.indexOf(b);for(var c=0,d=a.length;c<d;c++)if(a[c]==b)return c;return-1};
OpenLayers.Util.modifyDOMElement=function(a,b,c,d,e,f,g,h){if(b)a.id=b;if(c){a.style.left=c.x+"px";a.style.top=c.y+"px"}if(d){a.style.width=d.w+"px";a.style.height=d.h+"px"}if(e)a.style.position=e;if(f)a.style.border=f;if(g)a.style.overflow=g;if(parseFloat(h)>=0&&parseFloat(h)<1){a.style.filter="alpha(opacity="+h*100+")";a.style.opacity=h}else if(parseFloat(h)==1){a.style.filter="";a.style.opacity=""}};
OpenLayers.Util.createDiv=function(a,b,c,d,e,f,g,h){var i=document.createElement("div");if(d)i.style.backgroundImage="url("+d+")";a||(a=OpenLayers.Util.createUniqueID("OpenLayersDiv"));e||(e="absolute");OpenLayers.Util.modifyDOMElement(i,a,b,c,e,f,g,h);return i};
OpenLayers.Util.createImage=function(a,b,c,d,e,f,g,h){var i=document.createElement("img");a||(a=OpenLayers.Util.createUniqueID("OpenLayersDiv"));e||(e="relative");OpenLayers.Util.modifyDOMElement(i,a,b,c,e,f,null,g);if(h){i.style.display="none";b=function(){i.style.display="";OpenLayers.Event.stopObservingElement(i)};OpenLayers.Event.observe(i,"load",b);OpenLayers.Event.observe(i,"error",b)}i.style.alt=a;i.galleryImg="no";if(d)i.src=d;return i};OpenLayers.IMAGE_RELOAD_ATTEMPTS=0;
OpenLayers.Util.alphaHackNeeded=null;OpenLayers.Util.alphaHack=function(){if(OpenLayers.Util.alphaHackNeeded==null){var a=navigator.appVersion.split("MSIE"),a=parseFloat(a[1]),b=false;try{b=!!document.body.filters}catch(c){}OpenLayers.Util.alphaHackNeeded=b&&a>=5.5&&a<7}return OpenLayers.Util.alphaHackNeeded};
OpenLayers.Util.modifyAlphaImageDiv=function(a,b,c,d,e,f,g,h,i){OpenLayers.Util.modifyDOMElement(a,b,c,d,f,null,null,i);b=a.childNodes[0];if(e)b.src=e;OpenLayers.Util.modifyDOMElement(b,a.id+"_innerImage",null,d,"relative",g);if(OpenLayers.Util.alphaHack()){if(a.style.display!="none")a.style.display="inline-block";h==null&&(h="scale");a.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+b.src+"', sizingMethod='"+h+"')";if(parseFloat(a.style.opacity)>=0&&parseFloat(a.style.opacity)<
1)a.style.filter=a.style.filter+(" alpha(opacity="+a.style.opacity*100+")");b.style.filter="alpha(opacity=0)"}};OpenLayers.Util.createAlphaImageDiv=function(a,b,c,d,e,f,g,h,i){var j=OpenLayers.Util.createDiv(),i=OpenLayers.Util.createImage(null,null,null,null,null,null,null,i);i.className="olAlphaImg";j.appendChild(i);OpenLayers.Util.modifyAlphaImageDiv(j,a,b,c,d,e,f,g,h);return j};OpenLayers.Util.upperCaseObject=function(a){var b={},c;for(c in a)b[c.toUpperCase()]=a[c];return b};
OpenLayers.Util.applyDefaults=function(a,b){var a=a||{},c=typeof window.Event=="function"&&b instanceof window.Event,d;for(d in b)if(a[d]===void 0||!c&&b.hasOwnProperty&&b.hasOwnProperty(d)&&!a.hasOwnProperty(d))a[d]=b[d];if(!c&&b&&b.hasOwnProperty&&b.hasOwnProperty("toString")&&!a.hasOwnProperty("toString"))a.toString=b.toString;return a};
OpenLayers.Util.getParameterString=function(a){var b=[],c;for(c in a){var d=a[c];if(d!=null&&typeof d!="function"){if(typeof d=="object"&&d.constructor==Array){for(var e=[],f,g=0,h=d.length;g<h;g++){f=d[g];e.push(encodeURIComponent(f===null||f===void 0?"":f))}d=e.join(",")}else d=encodeURIComponent(d);b.push(encodeURIComponent(c)+"="+d)}}return b.join("&")};OpenLayers.Util.urlAppend=function(a,b){var c=a;if(b)var d=(a+" ").split(/[?&]/),c=c+(d.pop()===" "?b:d.length?"&"+b:"?"+b);return c};
OpenLayers.Util.getImagesLocation=function(){return OpenLayers.ImgPath||OpenLayers._getScriptLocation()+"img/"};OpenLayers.Util.getImageLocation=function(a){return OpenLayers.Util.getImagesLocation()+a};OpenLayers.Util.Try=function(){for(var a=null,b=0,c=arguments.length;b<c;b++){var d=arguments[b];try{a=d();break}catch(e){}}return a};
OpenLayers.Util.getXmlNodeValue=function(a){var b=null;OpenLayers.Util.Try(function(){b=a.text;if(!b)b=a.textContent;if(!b)b=a.firstChild.nodeValue},function(){b=a.textContent});return b};OpenLayers.Util.mouseLeft=function(a,b){for(var c=a.relatedTarget?a.relatedTarget:a.toElement;c!=b&&c!=null;)c=c.parentNode;return c!=b};OpenLayers.Util.DEFAULT_PRECISION=14;
OpenLayers.Util.toFloat=function(a,b){if(b==null)b=OpenLayers.Util.DEFAULT_PRECISION;typeof a!=="number"&&(a=parseFloat(a));return b===0?a:parseFloat(a.toPrecision(b))};OpenLayers.Util.rad=function(a){return a*Math.PI/180};OpenLayers.Util.deg=function(a){return a*180/Math.PI};OpenLayers.Util.VincentyConstants={a:6378137,b:6356752.3142,f:1/298.257223563};
OpenLayers.Util.distVincenty=function(a,b){for(var c=OpenLayers.Util.VincentyConstants,d=c.a,e=c.b,c=c.f,f=OpenLayers.Util.rad(b.lon-a.lon),g=Math.atan((1-c)*Math.tan(OpenLayers.Util.rad(a.lat))),h=Math.atan((1-c)*Math.tan(OpenLayers.Util.rad(b.lat))),i=Math.sin(g),g=Math.cos(g),j=Math.sin(h),h=Math.cos(h),k=f,l=2*Math.PI,m=20;Math.abs(k-l)>1.0E-12&&--m>0;){var n=Math.sin(k),o=Math.cos(k),p=Math.sqrt(h*n*h*n+(g*j-i*h*o)*(g*j-i*h*o));if(p==0)return 0;var o=i*j+g*h*o,q=Math.atan2(p,o),r=Math.asin(g*
h*n/p),s=Math.cos(r)*Math.cos(r),n=o-2*i*j/s,t=c/16*s*(4+c*(4-3*s)),l=k,k=f+(1-t)*c*Math.sin(r)*(q+t*p*(n+t*o*(-1+2*n*n)))}if(m==0)return NaN;d=s*(d*d-e*e)/(e*e);c=d/1024*(256+d*(-128+d*(74-47*d)));return(e*(1+d/16384*(4096+d*(-768+d*(320-175*d))))*(q-c*p*(n+c/4*(o*(-1+2*n*n)-c/6*n*(-3+4*p*p)*(-3+4*n*n))))).toFixed(3)/1E3};
OpenLayers.Util.destinationVincenty=function(a,b,c){for(var d=OpenLayers.Util,e=d.VincentyConstants,f=e.a,g=e.b,h=e.f,e=a.lon,a=a.lat,i=d.rad(b),b=Math.sin(i),i=Math.cos(i),a=(1-h)*Math.tan(d.rad(a)),j=1/Math.sqrt(1+a*a),k=a*j,l=Math.atan2(a,i),a=j*b,m=1-a*a,f=m*(f*f-g*g)/(g*g),n=1+f/16384*(4096+f*(-768+f*(320-175*f))),o=f/1024*(256+f*(-128+f*(74-47*f))),f=c/(g*n),p=2*Math.PI;Math.abs(f-p)>1.0E-12;)var q=Math.cos(2*l+f),r=Math.sin(f),s=Math.cos(f),t=o*r*(q+o/4*(s*(-1+2*q*q)-o/6*q*(-3+4*r*r)*(-3+4*
q*q))),p=f,f=c/(g*n)+t;c=k*r-j*s*i;g=Math.atan2(k*s+j*r*i,(1-h)*Math.sqrt(a*a+c*c));b=Math.atan2(r*b,j*s-k*r*i);i=h/16*m*(4+h*(4-3*m));q=b-(1-i)*h*a*(f+i*r*(q+i*s*(-1+2*q*q)));Math.atan2(a,-c);return new OpenLayers.LonLat(e+d.deg(q),d.deg(g))};
OpenLayers.Util.getParameters=function(a){var a=a===null||a===void 0?window.location.href:a,b="";if(OpenLayers.String.contains(a,"?"))var b=a.indexOf("?")+1,c=OpenLayers.String.contains(a,"#")?a.indexOf("#"):a.length,b=a.substring(b,c);for(var a={},b=b.split(/[&;]/),c=0,d=b.length;c<d;++c){var e=b[c].split("=");if(e[0]){var f=e[0];try{f=decodeURIComponent(f)}catch(g){f=unescape(f)}e=(e[1]||"").replace(/\+/g," ");try{e=decodeURIComponent(e)}catch(h){e=unescape(e)}e=e.split(",");e.length==1&&(e=e[0]);
a[f]=e}}return a};OpenLayers.Util.lastSeqID=0;OpenLayers.Util.createUniqueID=function(a){a==null&&(a="id_");OpenLayers.Util.lastSeqID=OpenLayers.Util.lastSeqID+1;return a+OpenLayers.Util.lastSeqID};OpenLayers.INCHES_PER_UNIT={inches:1,ft:12,mi:63360,m:39.3701,km:39370.1,dd:4374754,yd:36};OpenLayers.INCHES_PER_UNIT["in"]=OpenLayers.INCHES_PER_UNIT.inches;OpenLayers.INCHES_PER_UNIT.degrees=OpenLayers.INCHES_PER_UNIT.dd;OpenLayers.INCHES_PER_UNIT.nmi=1852*OpenLayers.INCHES_PER_UNIT.m;
OpenLayers.METERS_PER_INCH=0.0254000508001016;
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT,{Inch:OpenLayers.INCHES_PER_UNIT.inches,Meter:1/OpenLayers.METERS_PER_INCH,Foot:0.3048006096012192/OpenLayers.METERS_PER_INCH,IFoot:0.3048/OpenLayers.METERS_PER_INCH,ClarkeFoot:0.3047972651151/OpenLayers.METERS_PER_INCH,SearsFoot:0.30479947153867626/OpenLayers.METERS_PER_INCH,GoldCoastFoot:0.3047997101815088/OpenLayers.METERS_PER_INCH,IInch:0.0254/OpenLayers.METERS_PER_INCH,MicroInch:2.54E-5/OpenLayers.METERS_PER_INCH,Mil:2.54E-8/OpenLayers.METERS_PER_INCH,
Centimeter:0.01/OpenLayers.METERS_PER_INCH,Kilometer:1E3/OpenLayers.METERS_PER_INCH,Yard:0.9144018288036576/OpenLayers.METERS_PER_INCH,SearsYard:0.914398414616029/OpenLayers.METERS_PER_INCH,IndianYard:0.9143985307444408/OpenLayers.METERS_PER_INCH,IndianYd37:0.91439523/OpenLayers.METERS_PER_INCH,IndianYd62:0.9143988/OpenLayers.METERS_PER_INCH,IndianYd75:0.9143985/OpenLayers.METERS_PER_INCH,IndianFoot:0.30479951/OpenLayers.METERS_PER_INCH,IndianFt37:0.30479841/OpenLayers.METERS_PER_INCH,IndianFt62:0.3047996/
OpenLayers.METERS_PER_INCH,IndianFt75:0.3047995/OpenLayers.METERS_PER_INCH,Mile:1609.3472186944373/OpenLayers.METERS_PER_INCH,IYard:0.9144/OpenLayers.METERS_PER_INCH,IMile:1609.344/OpenLayers.METERS_PER_INCH,NautM:1852/OpenLayers.METERS_PER_INCH,"Lat-66":110943.31648893273/OpenLayers.METERS_PER_INCH,"Lat-83":110946.25736872235/OpenLayers.METERS_PER_INCH,Decimeter:0.1/OpenLayers.METERS_PER_INCH,Millimeter:0.001/OpenLayers.METERS_PER_INCH,Dekameter:10/OpenLayers.METERS_PER_INCH,Decameter:10/OpenLayers.METERS_PER_INCH,
Hectometer:100/OpenLayers.METERS_PER_INCH,GermanMeter:1.0000135965/OpenLayers.METERS_PER_INCH,CaGrid:0.999738/OpenLayers.METERS_PER_INCH,ClarkeChain:20.1166194976/OpenLayers.METERS_PER_INCH,GunterChain:20.11684023368047/OpenLayers.METERS_PER_INCH,BenoitChain:20.116782494375872/OpenLayers.METERS_PER_INCH,SearsChain:20.11676512155/OpenLayers.METERS_PER_INCH,ClarkeLink:0.201166194976/OpenLayers.METERS_PER_INCH,GunterLink:0.2011684023368047/OpenLayers.METERS_PER_INCH,BenoitLink:0.20116782494375873/OpenLayers.METERS_PER_INCH,
SearsLink:0.2011676512155/OpenLayers.METERS_PER_INCH,Rod:5.02921005842012/OpenLayers.METERS_PER_INCH,IntnlChain:20.1168/OpenLayers.METERS_PER_INCH,IntnlLink:0.201168/OpenLayers.METERS_PER_INCH,Perch:5.02921005842012/OpenLayers.METERS_PER_INCH,Pole:5.02921005842012/OpenLayers.METERS_PER_INCH,Furlong:201.1684023368046/OpenLayers.METERS_PER_INCH,Rood:3.778266898/OpenLayers.METERS_PER_INCH,CapeFoot:0.3047972615/OpenLayers.METERS_PER_INCH,Brealey:375/OpenLayers.METERS_PER_INCH,ModAmFt:0.304812252984506/
OpenLayers.METERS_PER_INCH,Fathom:1.8288/OpenLayers.METERS_PER_INCH,"NautM-UK":1853.184/OpenLayers.METERS_PER_INCH,"50kilometers":5E4/OpenLayers.METERS_PER_INCH,"150kilometers":15E4/OpenLayers.METERS_PER_INCH});
OpenLayers.Util.extend(OpenLayers.INCHES_PER_UNIT,{mm:OpenLayers.INCHES_PER_UNIT.Meter/1E3,cm:OpenLayers.INCHES_PER_UNIT.Meter/100,dm:100*OpenLayers.INCHES_PER_UNIT.Meter,km:1E3*OpenLayers.INCHES_PER_UNIT.Meter,kmi:OpenLayers.INCHES_PER_UNIT.nmi,fath:OpenLayers.INCHES_PER_UNIT.Fathom,ch:OpenLayers.INCHES_PER_UNIT.IntnlChain,link:OpenLayers.INCHES_PER_UNIT.IntnlLink,"us-in":OpenLayers.INCHES_PER_UNIT.inches,"us-ft":OpenLayers.INCHES_PER_UNIT.Foot,"us-yd":OpenLayers.INCHES_PER_UNIT.Yard,"us-ch":OpenLayers.INCHES_PER_UNIT.GunterChain,
"us-mi":OpenLayers.INCHES_PER_UNIT.Mile,"ind-yd":OpenLayers.INCHES_PER_UNIT.IndianYd37,"ind-ft":OpenLayers.INCHES_PER_UNIT.IndianFt37,"ind-ch":20.11669506/OpenLayers.METERS_PER_INCH});OpenLayers.DOTS_PER_INCH=72;OpenLayers.Util.normalizeScale=function(a){return a>1?1/a:a};OpenLayers.Util.getResolutionFromScale=function(a,b){var c;if(a){b==null&&(b="degrees");c=1/(OpenLayers.Util.normalizeScale(a)*OpenLayers.INCHES_PER_UNIT[b]*OpenLayers.DOTS_PER_INCH)}return c};
OpenLayers.Util.getScaleFromResolution=function(a,b){b==null&&(b="degrees");return a*OpenLayers.INCHES_PER_UNIT[b]*OpenLayers.DOTS_PER_INCH};
OpenLayers.Util.pagePosition=function(a){var b=[0,0],c=OpenLayers.Util.getViewportElement();if(!a||a==window||a==c)return b;var d=OpenLayers.IS_GECKO&&document.getBoxObjectFor&&OpenLayers.Element.getStyle(a,"position")=="absolute"&&(a.style.top==""||a.style.left==""),e=null;if(a.getBoundingClientRect){a=a.getBoundingClientRect();e=c.scrollTop;b[0]=a.left+c.scrollLeft;b[1]=a.top+e}else if(document.getBoxObjectFor&&!d){a=document.getBoxObjectFor(a);c=document.getBoxObjectFor(c);b[0]=a.screenX-c.screenX;
b[1]=a.screenY-c.screenY}else{b[0]=a.offsetLeft;b[1]=a.offsetTop;e=a.offsetParent;if(e!=a)for(;e;){b[0]=b[0]+e.offsetLeft;b[1]=b[1]+e.offsetTop;e=e.offsetParent}c=OpenLayers.BROWSER_NAME;if(c=="opera"||c=="safari"&&OpenLayers.Element.getStyle(a,"position")=="absolute")b[1]=b[1]-document.body.offsetTop;for(e=a.offsetParent;e&&e!=document.body;){b[0]=b[0]-e.scrollLeft;if(c!="opera"||e.tagName!="TR")b[1]=b[1]-e.scrollTop;e=e.offsetParent}}return b};
OpenLayers.Util.getViewportElement=function(){var a=arguments.callee.viewportElement;if(a==void 0){a=OpenLayers.BROWSER_NAME=="msie"&&document.compatMode!="CSS1Compat"?document.body:document.documentElement;arguments.callee.viewportElement=a}return a};
OpenLayers.Util.isEquivalentUrl=function(a,b,c){c=c||{};OpenLayers.Util.applyDefaults(c,{ignoreCase:true,ignorePort80:true,ignoreHash:true});var a=OpenLayers.Util.createUrlObject(a,c),b=OpenLayers.Util.createUrlObject(b,c),d;for(d in a)if(d!=="args"&&a[d]!=b[d])return false;for(d in a.args){if(a.args[d]!=b.args[d])return false;delete b.args[d]}for(d in b.args)return false;return true};
OpenLayers.Util.createUrlObject=function(a,b){b=b||{};if(!/^\w+:\/\//.test(a)){var c=window.location,d=c.port?":"+c.port:"",d=c.protocol+"//"+c.host.split(":").shift()+d;if(a.indexOf("/")===0)a=d+a;else{c=c.pathname.split("/");c.pop();a=d+c.join("/")+"/"+a}}b.ignoreCase&&(a=a.toLowerCase());c=document.createElement("a");c.href=a;d={};d.host=c.host.split(":").shift();d.protocol=c.protocol;d.port=b.ignorePort80?c.port=="80"||c.port=="0"?"":c.port:c.port==""||c.port=="0"?"80":c.port;d.hash=b.ignoreHash||
c.hash==="#"?"":c.hash;var e=c.search;if(!e){e=a.indexOf("?");e=e!=-1?a.substr(e):""}d.args=OpenLayers.Util.getParameters(e);d.pathname=c.pathname.charAt(0)=="/"?c.pathname:"/"+c.pathname;return d};OpenLayers.Util.removeTail=function(a){var b=null,b=a.indexOf("?"),c=a.indexOf("#");return b=b==-1?c!=-1?a.substr(0,c):a:c!=-1?a.substr(0,Math.min(b,c)):a.substr(0,b)};OpenLayers.IS_GECKO=function(){var a=navigator.userAgent.toLowerCase();return a.indexOf("webkit")==-1&&a.indexOf("gecko")!=-1}();
OpenLayers.CANVAS_SUPPORTED=function(){var a=document.createElement("canvas");return!(!a.getContext||!a.getContext("2d"))}();OpenLayers.BROWSER_NAME=function(){var a="",b=navigator.userAgent.toLowerCase();b.indexOf("opera")!=-1?a="opera":b.indexOf("msie")!=-1?a="msie":b.indexOf("safari")!=-1?a="safari":b.indexOf("mozilla")!=-1&&(a=b.indexOf("firefox")!=-1?"firefox":"mozilla");return a}();OpenLayers.Util.getBrowserName=function(){return OpenLayers.BROWSER_NAME};
OpenLayers.Util.getRenderedDimensions=function(a,b,c){var d,e,f=document.createElement("div");f.style.visibility="hidden";for(var g=c&&c.containerElement?c.containerElement:document.body,h=false,i=null,j=g;j&&j.tagName.toLowerCase()!="body";){var k=OpenLayers.Element.getStyle(j,"position");if(k=="absolute"){h=true;break}else if(k&&k!="static")break;j=j.parentNode}if(h&&(g.clientHeight===0||g.clientWidth===0)){i=document.createElement("div");i.style.visibility="hidden";i.style.position="absolute";
i.style.overflow="visible";i.style.width=document.body.clientWidth+"px";i.style.height=document.body.clientHeight+"px";i.appendChild(f)}f.style.position="absolute";if(b)if(b.w){d=b.w;f.style.width=d+"px"}else if(b.h){e=b.h;f.style.height=e+"px"}if(c&&c.displayClass)f.className=c.displayClass;b=document.createElement("div");b.innerHTML=a;b.style.overflow="visible";if(b.childNodes){a=0;for(c=b.childNodes.length;a<c;a++)if(b.childNodes[a].style)b.childNodes[a].style.overflow="visible"}f.appendChild(b);
i?g.appendChild(i):g.appendChild(f);if(!d){d=parseInt(b.scrollWidth);f.style.width=d+"px"}e||(e=parseInt(b.scrollHeight));f.removeChild(b);if(i){i.removeChild(f);g.removeChild(i)}else g.removeChild(f);return new OpenLayers.Size(d,e)};
OpenLayers.Util.getScrollbarWidth=function(){var a=OpenLayers.Util._scrollbarWidth;if(a==null){var b=null,c=null,b=a=0,b=document.createElement("div");b.style.position="absolute";b.style.top="-1000px";b.style.left="-1000px";b.style.width="100px";b.style.height="50px";b.style.overflow="hidden";c=document.createElement("div");c.style.width="100%";c.style.height="200px";b.appendChild(c);document.body.appendChild(b);a=c.offsetWidth;b.style.overflow="scroll";b=c.offsetWidth;document.body.removeChild(document.body.lastChild);
OpenLayers.Util._scrollbarWidth=a-b;a=OpenLayers.Util._scrollbarWidth}return a};
OpenLayers.Util.getFormattedLonLat=function(a,b,c){c||(c="dms");var a=(a+540)%360-180,d=Math.abs(a),e=Math.floor(d),f=d=(d-e)/(1/60),d=Math.floor(d),f=Math.round((f-d)/(1/60)*10),f=f/10;if(f>=60){f=f-60;d=d+1;if(d>=60){d=d-60;e=e+1}}e<10&&(e="0"+e);e=e+"\u00b0";if(c.indexOf("dm")>=0){d<10&&(d="0"+d);e=e+(d+"'");if(c.indexOf("dms")>=0){f<10&&(f="0"+f);e=e+(f+'"')}}return e=b=="lon"?e+(a<0?OpenLayers.i18n("W"):OpenLayers.i18n("E")):e+(a<0?OpenLayers.i18n("S"):OpenLayers.i18n("N"))};OpenLayers.Format=OpenLayers.Class({options:null,externalProjection:null,internalProjection:null,data:null,keepData:!1,initialize:function(a){OpenLayers.Util.extend(this,a);this.options=a},destroy:function(){},read:function(){throw Error("Read not implemented.");},write:function(){throw Error("Write not implemented.");},CLASS_NAME:"OpenLayers.Format"});OpenLayers.Format.CSWGetRecords=function(a){var a=OpenLayers.Util.applyDefaults(a,OpenLayers.Format.CSWGetRecords.DEFAULTS),b=OpenLayers.Format.CSWGetRecords["v"+a.version.replace(/\./g,"_")];if(!b)throw"Unsupported CSWGetRecords version: "+a.version;return new b(a)};OpenLayers.Format.CSWGetRecords.DEFAULTS={version:"2.0.2"};OpenLayers.Control=OpenLayers.Class({id:null,map:null,div:null,type:null,allowSelection:!1,displayClass:"",title:"",autoActivate:!1,active:null,handler:null,eventListeners:null,events:null,initialize:function(a){this.displayClass=this.CLASS_NAME.replace("OpenLayers.","ol").replace(/\./g,"");OpenLayers.Util.extend(this,a);this.events=new OpenLayers.Events(this);if(this.eventListeners instanceof Object)this.events.on(this.eventListeners);null==this.id&&(this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+
"_"))},destroy:function(){this.events&&(this.eventListeners&&this.events.un(this.eventListeners),this.events.destroy(),this.events=null);this.eventListeners=null;this.handler&&(this.handler.destroy(),this.handler=null);if(this.handlers){for(var a in this.handlers)this.handlers.hasOwnProperty(a)&&"function"==typeof this.handlers[a].destroy&&this.handlers[a].destroy();this.handlers=null}this.map&&(this.map.removeControl(this),this.map=null);this.div=null},setMap:function(a){this.map=a;this.handler&&
this.handler.setMap(a)},draw:function(a){if(null==this.div&&(this.div=OpenLayers.Util.createDiv(this.id),this.div.className=this.displayClass,this.allowSelection||(this.div.className+=" olControlNoSelect",this.div.setAttribute("unselectable","on",0),this.div.onselectstart=OpenLayers.Function.False),""!=this.title))this.div.title=this.title;null!=a&&(this.position=a.clone());this.moveTo(this.position);return this.div},moveTo:function(a){null!=a&&null!=this.div&&(this.div.style.left=a.x+"px",this.div.style.top=
a.y+"px")},activate:function(){if(this.active)return!1;this.handler&&this.handler.activate();this.active=!0;this.map&&OpenLayers.Element.addClass(this.map.viewPortDiv,this.displayClass.replace(/ /g,"")+"Active");this.events.triggerEvent("activate");return!0},deactivate:function(){return this.active?(this.handler&&this.handler.deactivate(),this.active=!1,this.map&&OpenLayers.Element.removeClass(this.map.viewPortDiv,this.displayClass.replace(/ /g,"")+"Active"),this.events.triggerEvent("deactivate"),
!0):!1},CLASS_NAME:"OpenLayers.Control"});OpenLayers.Control.TYPE_BUTTON=1;OpenLayers.Control.TYPE_TOGGLE=2;OpenLayers.Control.TYPE_TOOL=3;OpenLayers.Event={observers:!1,KEY_SPACE:32,KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,element:function(a){return a.target||a.srcElement},isSingleTouch:function(a){return a.touches&&1==a.touches.length},isMultiTouch:function(a){return a.touches&&1<a.touches.length},isLeftClick:function(a){return a.which&&1==a.which||a.button&&1==a.button},isRightClick:function(a){return a.which&&3==a.which||a.button&&2==a.button},stop:function(a,
b){b||(a.preventDefault?a.preventDefault():a.returnValue=!1);a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},findElement:function(a,b){for(var c=OpenLayers.Event.element(a);c.parentNode&&(!c.tagName||c.tagName.toUpperCase()!=b.toUpperCase());)c=c.parentNode;return c},observe:function(a,b,c,d){a=OpenLayers.Util.getElement(a);d=d||!1;if("keypress"==b&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||a.attachEvent))b="keydown";this.observers||(this.observers={});if(!a._eventCacheID){var e=
"eventCacheID_";a.id&&(e=a.id+"_"+e);a._eventCacheID=OpenLayers.Util.createUniqueID(e)}e=a._eventCacheID;this.observers[e]||(this.observers[e]=[]);this.observers[e].push({element:a,name:b,observer:c,useCapture:d});a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},stopObservingElement:function(a){a=OpenLayers.Util.getElement(a)._eventCacheID;this._removeElementObservers(OpenLayers.Event.observers[a])},_removeElementObservers:function(a){if(a)for(var b=a.length-1;0<=
b;b--){var c=a[b];OpenLayers.Event.stopObserving.apply(this,[c.element,c.name,c.observer,c.useCapture])}},stopObserving:function(a,b,c,d){var d=d||!1,a=OpenLayers.Util.getElement(a),e=a._eventCacheID;if("keypress"==b&&(navigator.appVersion.match(/Konqueror|Safari|KHTML/)||a.detachEvent))b="keydown";var f=!1,g=OpenLayers.Event.observers[e];if(g)for(var h=0;!f&&h<g.length;){var i=g[h];if(i.name==b&&i.observer==c&&i.useCapture==d){g.splice(h,1);0==g.length&&delete OpenLayers.Event.observers[e];f=!0;
break}h++}f&&(a.removeEventListener?a.removeEventListener(b,c,d):a&&a.detachEvent&&a.detachEvent("on"+b,c));return f},unloadCache:function(){if(OpenLayers.Event&&OpenLayers.Event.observers){for(var a in OpenLayers.Event.observers)OpenLayers.Event._removeElementObservers.apply(this,[OpenLayers.Event.observers[a]]);OpenLayers.Event.observers=!1}},CLASS_NAME:"OpenLayers.Event"};OpenLayers.Event.observe(window,"unload",OpenLayers.Event.unloadCache,!1);
OpenLayers.Events=OpenLayers.Class({BROWSER_EVENTS:"mouseover mouseout mousedown mouseup mousemove click dblclick rightclick dblrightclick resize focus blur touchstart touchmove touchend keydown".split(" "),listeners:null,object:null,element:null,eventHandler:null,fallThrough:null,includeXY:!1,extensions:null,extensionCount:null,clearMouseListener:null,initialize:function(a,b,c,d,e){OpenLayers.Util.extend(this,e);this.object=a;this.fallThrough=d;this.listeners={};this.extensions={};this.extensionCount=
{};null!=b&&this.attachToElement(b)},destroy:function(){for(var a in this.extensions)"boolean"!==typeof this.extensions[a]&&this.extensions[a].destroy();this.extensions=null;this.element&&(OpenLayers.Event.stopObservingElement(this.element),this.element.hasScrollEvent&&OpenLayers.Event.stopObserving(window,"scroll",this.clearMouseListener));this.eventHandler=this.fallThrough=this.object=this.listeners=this.element=null},addEventType:function(){},attachToElement:function(a){this.element?OpenLayers.Event.stopObservingElement(this.element):
(this.eventHandler=OpenLayers.Function.bindAsEventListener(this.handleBrowserEvent,this),this.clearMouseListener=OpenLayers.Function.bind(this.clearMouseCache,this));this.element=a;for(var b=0,c=this.BROWSER_EVENTS.length;b<c;b++)OpenLayers.Event.observe(a,this.BROWSER_EVENTS[b],this.eventHandler);OpenLayers.Event.observe(a,"dragstart",OpenLayers.Event.stop)},on:function(a){for(var b in a)"scope"!=b&&a.hasOwnProperty(b)&&this.register(b,a.scope,a[b])},register:function(a,b,c,d){a in OpenLayers.Events&&
!this.extensions[a]&&(this.extensions[a]=new OpenLayers.Events[a](this));if(null!=c){null==b&&(b=this.object);var e=this.listeners[a];e||(e=[],this.listeners[a]=e,this.extensionCount[a]=0);b={obj:b,func:c};d?(e.splice(this.extensionCount[a],0,b),"object"===typeof d&&d.extension&&this.extensionCount[a]++):e.push(b)}},registerPriority:function(a,b,c){this.register(a,b,c,!0)},un:function(a){for(var b in a)"scope"!=b&&a.hasOwnProperty(b)&&this.unregister(b,a.scope,a[b])},unregister:function(a,b,c){null==
b&&(b=this.object);a=this.listeners[a];if(null!=a)for(var d=0,e=a.length;d<e;d++)if(a[d].obj==b&&a[d].func==c){a.splice(d,1);break}},remove:function(a){null!=this.listeners[a]&&(this.listeners[a]=[])},triggerEvent:function(a,b){var c=this.listeners[a];if(c&&0!=c.length){null==b&&(b={});b.object=this.object;b.element=this.element;b.type||(b.type=a);for(var c=c.slice(),d,e=0,f=c.length;e<f&&!(d=c[e],d=d.func.apply(d.obj,[b]),void 0!=d&&!1==d);e++);this.fallThrough||OpenLayers.Event.stop(b,!0);return d}},
handleBrowserEvent:function(a){var b=a.type,c=this.listeners[b];if(c&&0!=c.length){if((c=a.touches)&&c[0]){for(var d=0,e=0,f=c.length,g,h=0;h<f;++h)g=c[h],d+=g.clientX,e+=g.clientY;a.clientX=d/f;a.clientY=e/f}this.includeXY&&(a.xy=this.getMousePosition(a));this.triggerEvent(b,a)}},clearMouseCache:function(){this.element.scrolls=null;this.element.lefttop=null;var a=document.body;if(a&&(!(0!=a.scrollTop||0!=a.scrollLeft)||!navigator.userAgent.match(/iPhone/i)))this.element.offsets=null},getMousePosition:function(a){this.includeXY?
this.element.hasScrollEvent||(OpenLayers.Event.observe(window,"scroll",this.clearMouseListener),this.element.hasScrollEvent=!0):this.clearMouseCache();if(!this.element.scrolls){var b=OpenLayers.Util.getViewportElement();this.element.scrolls=[b.scrollLeft,b.scrollTop]}this.element.lefttop||(this.element.lefttop=[document.documentElement.clientLeft||0,document.documentElement.clientTop||0]);this.element.offsets||(this.element.offsets=OpenLayers.Util.pagePosition(this.element));return new OpenLayers.Pixel(a.clientX+
this.element.scrolls[0]-this.element.offsets[0]-this.element.lefttop[0],a.clientY+this.element.scrolls[1]-this.element.offsets[1]-this.element.lefttop[1])},CLASS_NAME:"OpenLayers.Events"});OpenLayers.Events.buttonclick=OpenLayers.Class({target:null,events:"mousedown mouseup click dblclick touchstart touchmove touchend keydown".split(" "),startRegEx:/^mousedown|touchstart$/,cancelRegEx:/^touchmove$/,completeRegEx:/^mouseup|touchend$/,initialize:function(a){this.target=a;for(a=this.events.length-1;0<=a;--a)this.target.register(this.events[a],this,this.buttonClick,{extension:!0})},destroy:function(){for(var a=this.events.length-1;0<=a;--a)this.target.unregister(this.events[a],this,this.buttonClick);
delete this.target},getPressedButton:function(a){var b=3,c;do{if(OpenLayers.Element.hasClass(a,"olButton")){c=a;break}a=a.parentNode}while(0<--b&&a);return c},buttonClick:function(a){var b=!0,c=OpenLayers.Event.element(a);if(c&&(OpenLayers.Event.isLeftClick(a)||!~a.type.indexOf("mouse")))if(c=this.getPressedButton(c)){if("keydown"===a.type)switch(a.keyCode){case OpenLayers.Event.KEY_RETURN:case OpenLayers.Event.KEY_SPACE:this.target.triggerEvent("buttonclick",{buttonElement:c}),OpenLayers.Event.stop(a),
b=!1}else this.startEvt&&(this.completeRegEx.test(a.type)&&(b=OpenLayers.Util.pagePosition(c),this.target.triggerEvent("buttonclick",{buttonElement:c,buttonXY:{x:this.startEvt.clientX-b[0],y:this.startEvt.clientY-b[1]}})),this.cancelRegEx.test(a.type)&&delete this.startEvt,OpenLayers.Event.stop(a),b=!1);this.startRegEx.test(a.type)&&(this.startEvt=a,OpenLayers.Event.stop(a),b=!1)}else delete this.startEvt;return b}});OpenLayers.Control.OverviewMap=OpenLayers.Class(OpenLayers.Control,{element:null,ovmap:null,size:{w:180,h:90},layers:null,minRectSize:15,minRectDisplayClass:"RectReplacement",minRatio:8,maxRatio:32,mapOptions:null,autoPan:!1,handlers:null,resolutionFactor:1,maximized:!1,initialize:function(a){this.layers=[];this.handlers={};OpenLayers.Control.prototype.initialize.apply(this,[a])},destroy:function(){this.mapDiv&&(this.handlers.click&&this.handlers.click.destroy(),this.handlers.drag&&this.handlers.drag.destroy(),
this.ovmap&&this.ovmap.viewPortDiv.removeChild(this.extentRectangle),this.extentRectangle=null,this.rectEvents&&(this.rectEvents.destroy(),this.rectEvents=null),this.ovmap&&(this.ovmap.destroy(),this.ovmap=null),this.element.removeChild(this.mapDiv),this.mapDiv=null,this.div.removeChild(this.element),this.element=null,this.maximizeDiv&&(this.div.removeChild(this.maximizeDiv),this.maximizeDiv=null),this.minimizeDiv&&(this.div.removeChild(this.minimizeDiv),this.minimizeDiv=null),this.map.events.un({buttonclick:this.onButtonClick,
moveend:this.update,changebaselayer:this.baseLayerDraw,scope:this}),OpenLayers.Control.prototype.destroy.apply(this,arguments))},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);if(0===this.layers.length)if(this.map.baseLayer)this.layers=[this.map.baseLayer.clone()];else return this.map.events.register("changebaselayer",this,this.baseLayerDraw),this.div;this.element=document.createElement("div");this.element.className=this.displayClass+"Element";this.element.style.display="none";
this.mapDiv=document.createElement("div");this.mapDiv.style.width=this.size.w+"px";this.mapDiv.style.height=this.size.h+"px";this.mapDiv.style.position="relative";this.mapDiv.style.overflow="hidden";this.mapDiv.id=OpenLayers.Util.createUniqueID("overviewMap");this.extentRectangle=document.createElement("div");this.extentRectangle.style.position="absolute";this.extentRectangle.style.zIndex=1E3;this.extentRectangle.className=this.displayClass+"ExtentRectangle";this.element.appendChild(this.mapDiv);
this.div.appendChild(this.element);if(this.outsideViewport)this.element.style.display="";else{this.div.className+=" "+this.displayClass+"Container";var a=OpenLayers.Util.getImageLocation("layer-switcher-maximize.png");this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv(this.displayClass+"MaximizeButton",null,null,a,"absolute");this.maximizeDiv.style.display="none";this.maximizeDiv.className=this.displayClass+"MaximizeButton olButton";this.div.appendChild(this.maximizeDiv);a=OpenLayers.Util.getImageLocation("layer-switcher-minimize.png");
this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_minimizeDiv",null,null,a,"absolute");this.minimizeDiv.style.display="none";this.minimizeDiv.className=this.displayClass+"MinimizeButton olButton";this.div.appendChild(this.minimizeDiv);this.minimizeControl()}this.map.getExtent()&&this.update();this.map.events.on({buttonclick:this.onButtonClick,moveend:this.update,scope:this});this.maximized&&this.maximizeControl();return this.div},baseLayerDraw:function(){this.draw();this.map.events.unregister("changebaselayer",
this,this.baseLayerDraw)},rectDrag:function(a){var b=this.handlers.drag.last.x-a.x,c=this.handlers.drag.last.y-a.y;if(0!=b||0!=c){var d=this.rectPxBounds.top,e=this.rectPxBounds.left,a=Math.abs(this.rectPxBounds.getHeight()),f=this.rectPxBounds.getWidth(),c=Math.max(0,d-c),c=Math.min(c,this.ovmap.size.h-this.hComp-a),b=Math.max(0,e-b),b=Math.min(b,this.ovmap.size.w-this.wComp-f);this.setRectPxBounds(new OpenLayers.Bounds(b,c+a,b+f,c))}},mapDivClick:function(a){var b=this.rectPxBounds.getCenterPixel(),
c=a.xy.x-b.x,d=a.xy.y-b.y,e=this.rectPxBounds.top,f=this.rectPxBounds.left,a=Math.abs(this.rectPxBounds.getHeight()),b=this.rectPxBounds.getWidth(),d=Math.max(0,e+d),d=Math.min(d,this.ovmap.size.h-a),c=Math.max(0,f+c),c=Math.min(c,this.ovmap.size.w-b);this.setRectPxBounds(new OpenLayers.Bounds(c,d+a,c+b,d));this.updateMapToRect()},onButtonClick:function(a){a.buttonElement===this.minimizeDiv?this.minimizeControl():a.buttonElement===this.maximizeDiv&&this.maximizeControl()},maximizeControl:function(a){this.element.style.display=
"";this.showToggle(!1);null!=a&&OpenLayers.Event.stop(a)},minimizeControl:function(a){this.element.style.display="none";this.showToggle(!0);null!=a&&OpenLayers.Event.stop(a)},showToggle:function(a){this.maximizeDiv.style.display=a?"":"none";this.minimizeDiv.style.display=a?"none":""},update:function(){null==this.ovmap&&this.createMap();(this.autoPan||!this.isSuitableOverview())&&this.updateOverview();this.updateRectToMap()},isSuitableOverview:function(){var a=this.map.getExtent(),b=this.map.maxExtent,
a=new OpenLayers.Bounds(Math.max(a.left,b.left),Math.max(a.bottom,b.bottom),Math.min(a.right,b.right),Math.min(a.top,b.top));this.ovmap.getProjection()!=this.map.getProjection()&&(a=a.transform(this.map.getProjectionObject(),this.ovmap.getProjectionObject()));b=this.ovmap.getResolution()/this.map.getResolution();return b>this.minRatio&&b<=this.maxRatio&&this.ovmap.getExtent().containsBounds(a)},updateOverview:function(){var a=this.map.getResolution(),b=this.ovmap.getResolution(),c=b/a;c>this.maxRatio?
b=this.minRatio*a:c<=this.minRatio&&(b=this.maxRatio*a);this.ovmap.getProjection()!=this.map.getProjection()?(a=this.map.center.clone(),a.transform(this.map.getProjectionObject(),this.ovmap.getProjectionObject())):a=this.map.center;this.ovmap.setCenter(a,this.ovmap.getZoomForResolution(b*this.resolutionFactor));this.updateRectToMap()},createMap:function(){var a=OpenLayers.Util.extend({controls:[],maxResolution:"auto",fallThrough:!1},this.mapOptions);this.ovmap=new OpenLayers.Map(this.mapDiv,a);this.ovmap.viewPortDiv.appendChild(this.extentRectangle);
OpenLayers.Event.stopObserving(window,"unload",this.ovmap.unloadDestroy);this.ovmap.addLayers(this.layers);this.ovmap.zoomToMaxExtent();this.wComp=(this.wComp=parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-left-width"))+parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-right-width")))?this.wComp:2;this.hComp=(this.hComp=parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-top-width"))+parseInt(OpenLayers.Element.getStyle(this.extentRectangle,"border-bottom-width")))?
this.hComp:2;this.handlers.drag=new OpenLayers.Handler.Drag(this,{move:this.rectDrag,done:this.updateMapToRect},{map:this.ovmap});this.handlers.click=new OpenLayers.Handler.Click(this,{click:this.mapDivClick},{single:!0,"double":!1,stopSingle:!0,stopDouble:!0,pixelTolerance:1,map:this.ovmap});this.handlers.click.activate();this.rectEvents=new OpenLayers.Events(this,this.extentRectangle,null,!0);this.rectEvents.register("mouseover",this,function(){!this.handlers.drag.active&&!this.map.dragging&&this.handlers.drag.activate()});
this.rectEvents.register("mouseout",this,function(){this.handlers.drag.dragging||this.handlers.drag.deactivate()});if(this.ovmap.getProjection()!=this.map.getProjection()){var a=this.map.getProjectionObject().getUnits()||this.map.units||this.map.baseLayer.units,b=this.ovmap.getProjectionObject().getUnits()||this.ovmap.units||this.ovmap.baseLayer.units;this.resolutionFactor=a&&b?OpenLayers.INCHES_PER_UNIT[a]/OpenLayers.INCHES_PER_UNIT[b]:1}},updateRectToMap:function(){var a=this.getRectBoundsFromMapBounds(this.ovmap.getProjection()!=
this.map.getProjection()?this.map.getExtent().transform(this.map.getProjectionObject(),this.ovmap.getProjectionObject()):this.map.getExtent());a&&this.setRectPxBounds(a)},updateMapToRect:function(){var a=this.getMapBoundsFromRectBounds(this.rectPxBounds);this.ovmap.getProjection()!=this.map.getProjection()&&(a=a.transform(this.ovmap.getProjectionObject(),this.map.getProjectionObject()));this.map.panTo(a.getCenterLonLat())},setRectPxBounds:function(a){var b=Math.max(a.top,0),c=Math.max(a.left,0),d=
Math.min(a.top+Math.abs(a.getHeight()),this.ovmap.size.h-this.hComp),a=Math.min(a.left+a.getWidth(),this.ovmap.size.w-this.wComp),e=Math.max(a-c,0),f=Math.max(d-b,0);e<this.minRectSize||f<this.minRectSize?(this.extentRectangle.className=this.displayClass+this.minRectDisplayClass,e=c+e/2-this.minRectSize/2,this.extentRectangle.style.top=Math.round(b+f/2-this.minRectSize/2)+"px",this.extentRectangle.style.left=Math.round(e)+"px",this.extentRectangle.style.height=this.minRectSize+"px",this.extentRectangle.style.width=
this.minRectSize+"px"):(this.extentRectangle.className=this.displayClass+"ExtentRectangle",this.extentRectangle.style.top=Math.round(b)+"px",this.extentRectangle.style.left=Math.round(c)+"px",this.extentRectangle.style.height=Math.round(f)+"px",this.extentRectangle.style.width=Math.round(e)+"px");this.rectPxBounds=new OpenLayers.Bounds(Math.round(c),Math.round(d),Math.round(a),Math.round(b))},getRectBoundsFromMapBounds:function(a){var b=this.getOverviewPxFromLonLat({lon:a.left,lat:a.bottom}),a=this.getOverviewPxFromLonLat({lon:a.right,
lat:a.top}),c=null;b&&a&&(c=new OpenLayers.Bounds(b.x,b.y,a.x,a.y));return c},getMapBoundsFromRectBounds:function(a){var b=this.getLonLatFromOverviewPx({x:a.left,y:a.bottom}),a=this.getLonLatFromOverviewPx({x:a.right,y:a.top});return new OpenLayers.Bounds(b.lon,b.lat,a.lon,a.lat)},getLonLatFromOverviewPx:function(a){var b=this.ovmap.size,c=this.ovmap.getResolution(),d=this.ovmap.getExtent().getCenterLonLat();return{lon:d.lon+(a.x-b.w/2)*c,lat:d.lat-(a.y-b.h/2)*c}},getOverviewPxFromLonLat:function(a){var b=
this.ovmap.getResolution(),c=this.ovmap.getExtent();if(c)return{x:Math.round(1/b*(a.lon-c.left)),y:Math.round(1/b*(c.top-a.lat))}},CLASS_NAME:"OpenLayers.Control.OverviewMap"});OpenLayers.Animation=function(a){var b=!(!a.requestAnimationFrame&&!a.webkitRequestAnimationFrame&&!a.mozRequestAnimationFrame&&!a.oRequestAnimationFrame&&!a.msRequestAnimationFrame),c=function(){var b=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||a.oRequestAnimationFrame||a.msRequestAnimationFrame||function(b){a.setTimeout(b,16)};return function(c,d){b.apply(a,[c,d])}}(),d=0,e={};return{isNative:b,requestFrame:c,start:function(a,b,h){var b=0<b?b:Number.POSITIVE_INFINITY,
i=++d,j=+new Date;e[i]=function(){e[i]&&+new Date-j<=b?(a(),e[i]&&c(e[i],h)):delete e[i]};c(e[i],h);return i},stop:function(a){delete e[a]}}}(window);OpenLayers.Tween=OpenLayers.Class({easing:null,begin:null,finish:null,duration:null,callbacks:null,time:null,animationId:null,playing:!1,initialize:function(a){this.easing=a?a:OpenLayers.Easing.Expo.easeOut},start:function(a,b,c,d){this.playing=!0;this.begin=a;this.finish=b;this.duration=c;this.callbacks=d.callbacks;this.time=0;OpenLayers.Animation.stop(this.animationId);this.animationId=null;this.callbacks&&this.callbacks.start&&this.callbacks.start.call(this,this.begin);this.animationId=OpenLayers.Animation.start(OpenLayers.Function.bind(this.play,
this))},stop:function(){this.playing&&(this.callbacks&&this.callbacks.done&&this.callbacks.done.call(this,this.finish),OpenLayers.Animation.stop(this.animationId),this.animationId=null,this.playing=!1)},play:function(){var a={},b;for(b in this.begin){var c=this.begin[b],d=this.finish[b];if(null==c||null==d||isNaN(c)||isNaN(d))throw new TypeError("invalid value for Tween");a[b]=this.easing.apply(this,[this.time,c,d-c,this.duration])}this.time++;this.callbacks&&this.callbacks.eachStep&&this.callbacks.eachStep.call(this,
a);this.time>this.duration&&this.stop()},CLASS_NAME:"OpenLayers.Tween"});OpenLayers.Easing={CLASS_NAME:"OpenLayers.Easing"};OpenLayers.Easing.Linear={easeIn:function(a,b,c,d){return c*a/d+b},easeOut:function(a,b,c,d){return c*a/d+b},easeInOut:function(a,b,c,d){return c*a/d+b},CLASS_NAME:"OpenLayers.Easing.Linear"};
OpenLayers.Easing.Expo={easeIn:function(a,b,c,d){return 0==a?b:c*Math.pow(2,10*(a/d-1))+b},easeOut:function(a,b,c,d){return a==d?b+c:c*(-Math.pow(2,-10*a/d)+1)+b},easeInOut:function(a,b,c,d){return 0==a?b:a==d?b+c:1>(a/=d/2)?c/2*Math.pow(2,10*(a-1))+b:c/2*(-Math.pow(2,-10*--a)+2)+b},CLASS_NAME:"OpenLayers.Easing.Expo"};
OpenLayers.Easing.Quad={easeIn:function(a,b,c,d){return c*(a/=d)*a+b},easeOut:function(a,b,c,d){return-c*(a/=d)*(a-2)+b},easeInOut:function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},CLASS_NAME:"OpenLayers.Easing.Quad"};OpenLayers.Projection=OpenLayers.Class({proj:null,projCode:null,titleRegEx:/\+title=[^\+]*/,initialize:function(a,b){OpenLayers.Util.extend(this,b);this.projCode=a;window.Proj4js&&(this.proj=new Proj4js.Proj(a))},getCode:function(){return this.proj?this.proj.srsCode:this.projCode},getUnits:function(){return this.proj?this.proj.units:null},toString:function(){return this.getCode()},equals:function(a){var b=!1;a&&(a instanceof OpenLayers.Projection||(a=new OpenLayers.Projection(a)),window.Proj4js&&
this.proj.defData&&a.proj.defData?b=this.proj.defData.replace(this.titleRegEx,"")==a.proj.defData.replace(this.titleRegEx,""):a.getCode&&(b=this.getCode(),a=a.getCode(),b=b==a||!!OpenLayers.Projection.transforms[b]&&OpenLayers.Projection.transforms[b][a]===OpenLayers.Projection.nullTransform));return b},destroy:function(){delete this.proj;delete this.projCode},CLASS_NAME:"OpenLayers.Projection"});OpenLayers.Projection.transforms={};
OpenLayers.Projection.defaults={"EPSG:4326":{units:"degrees",maxExtent:[-180,-90,180,90],yx:!0},"CRS:84":{units:"degrees",maxExtent:[-180,-90,180,90]},"EPSG:900913":{units:"m",maxExtent:[-2.003750834E7,-2.003750834E7,2.003750834E7,2.003750834E7]}};
OpenLayers.Projection.addTransform=function(a,b,c){if(c===OpenLayers.Projection.nullTransform){var d=OpenLayers.Projection.defaults[a];d&&!OpenLayers.Projection.defaults[b]&&(OpenLayers.Projection.defaults[b]=d)}OpenLayers.Projection.transforms[a]||(OpenLayers.Projection.transforms[a]={});OpenLayers.Projection.transforms[a][b]=c};
OpenLayers.Projection.transform=function(a,b,c){if(b&&c)if(b instanceof OpenLayers.Projection||(b=new OpenLayers.Projection(b)),c instanceof OpenLayers.Projection||(c=new OpenLayers.Projection(c)),b.proj&&c.proj)a=Proj4js.transform(b.proj,c.proj,a);else{var b=b.getCode(),c=c.getCode(),d=OpenLayers.Projection.transforms;if(d[b]&&d[b][c])d[b][c](a)}return a};OpenLayers.Projection.nullTransform=function(a){return a};
(function(){function a(a){a.x=180*a.x/d;a.y=180/Math.PI*(2*Math.atan(Math.exp(a.y/d*Math.PI))-Math.PI/2);return a}function b(a){a.x=a.x*d/180;a.y=Math.log(Math.tan((90+a.y)*Math.PI/360))/Math.PI*d;return a}function c(c,d){var e=OpenLayers.Projection.addTransform,f=OpenLayers.Projection.nullTransform,g,m,n,o,p;g=0;for(m=d.length;g<m;++g){n=d[g];e(c,n,b);e(n,c,a);for(p=g+1;p<m;++p)o=d[p],e(n,o,f),e(o,n,f)}}var d=2.003750834E7,e=["EPSG:900913","EPSG:3857","EPSG:102113","EPSG:102100"],f=["CRS:84","urn:ogc:def:crs:EPSG:6.6:4326",
"EPSG:4326"],g;for(g=e.length-1;0<=g;--g)c(e[g],f);for(g=f.length-1;0<=g;--g)c(f[g],e)})();OpenLayers.Map=OpenLayers.Class({Z_INDEX_BASE:{BaseLayer:100,Overlay:325,Feature:725,Popup:750,Control:1E3},id:null,fractionalZoom:!1,events:null,allOverlays:!1,div:null,dragging:!1,size:null,viewPortDiv:null,layerContainerOrigin:null,layerContainerDiv:null,layers:null,controls:null,popups:null,baseLayer:null,center:null,resolution:null,zoom:0,panRatio:1.5,options:null,tileSize:null,projection:"EPSG:4326",units:null,resolutions:null,maxResolution:null,minResolution:null,maxScale:null,minScale:null,
maxExtent:null,minExtent:null,restrictedExtent:null,numZoomLevels:16,theme:null,displayProjection:null,fallThrough:!0,panTween:null,eventListeners:null,panMethod:OpenLayers.Easing.Expo.easeOut,panDuration:50,paddingForPopups:null,minPx:null,maxPx:null,initialize:function(a,b){1===arguments.length&&"object"===typeof a&&(a=(b=a)&&b.div);this.tileSize=new OpenLayers.Size(OpenLayers.Map.TILE_WIDTH,OpenLayers.Map.TILE_HEIGHT);this.paddingForPopups=new OpenLayers.Bounds(15,15,15,15);this.theme=OpenLayers._getScriptLocation()+
"theme/default/style.css";this.options=OpenLayers.Util.extend({},b);OpenLayers.Util.extend(this,b);OpenLayers.Util.applyDefaults(this,OpenLayers.Projection.defaults[this.projection instanceof OpenLayers.Projection?this.projection.projCode:this.projection]);this.maxExtent&&!(this.maxExtent instanceof OpenLayers.Bounds)&&(this.maxExtent=new OpenLayers.Bounds(this.maxExtent));this.minExtent&&!(this.minExtent instanceof OpenLayers.Bounds)&&(this.minExtent=new OpenLayers.Bounds(this.minExtent));this.restrictedExtent&&
!(this.restrictedExtent instanceof OpenLayers.Bounds)&&(this.restrictedExtent=new OpenLayers.Bounds(this.restrictedExtent));this.center&&!(this.center instanceof OpenLayers.LonLat)&&(this.center=new OpenLayers.LonLat(this.center));this.layers=[];this.id=OpenLayers.Util.createUniqueID("OpenLayers.Map_");this.div=OpenLayers.Util.getElement(a);this.div||(this.div=document.createElement("div"),this.div.style.height="1px",this.div.style.width="1px");OpenLayers.Element.addClass(this.div,"olMap");var c=
this.id+"_OpenLayers_ViewPort";this.viewPortDiv=OpenLayers.Util.createDiv(c,null,null,null,"relative",null,"hidden");this.viewPortDiv.style.width="100%";this.viewPortDiv.style.height="100%";this.viewPortDiv.className="olMapViewport";this.div.appendChild(this.viewPortDiv);this.events=new OpenLayers.Events(this,this.viewPortDiv,null,this.fallThrough,{includeXY:!0});c=this.id+"_OpenLayers_Container";this.layerContainerDiv=OpenLayers.Util.createDiv(c);this.layerContainerDiv.style.width="100px";this.layerContainerDiv.style.height=
"100px";this.layerContainerDiv.style.zIndex=this.Z_INDEX_BASE.Popup-1;this.viewPortDiv.appendChild(this.layerContainerDiv);this.updateSize();if(this.eventListeners instanceof Object)this.events.on(this.eventListeners);9>parseFloat(navigator.appVersion.split("MSIE")[1])?this.events.register("resize",this,this.updateSize):(this.updateSizeDestroy=OpenLayers.Function.bind(this.updateSize,this),OpenLayers.Event.observe(window,"resize",this.updateSizeDestroy));if(this.theme){for(var c=!0,d=document.getElementsByTagName("link"),
e=0,f=d.length;e<f;++e)if(OpenLayers.Util.isEquivalentUrl(d.item(e).href,this.theme)){c=!1;break}c&&(c=document.createElement("link"),c.setAttribute("rel","stylesheet"),c.setAttribute("type","text/css"),c.setAttribute("href",this.theme),document.getElementsByTagName("head")[0].appendChild(c))}null==this.controls&&(this.controls=[],null!=OpenLayers.Control&&(OpenLayers.Control.Navigation?this.controls.push(new OpenLayers.Control.Navigation):OpenLayers.Control.TouchNavigation&&this.controls.push(new OpenLayers.Control.TouchNavigation),
OpenLayers.Control.Zoom?this.controls.push(new OpenLayers.Control.Zoom):OpenLayers.Control.PanZoom&&this.controls.push(new OpenLayers.Control.PanZoom),OpenLayers.Control.ArgParser&&this.controls.push(new OpenLayers.Control.ArgParser),OpenLayers.Control.Attribution&&this.controls.push(new OpenLayers.Control.Attribution)));e=0;for(f=this.controls.length;e<f;e++)this.addControlToMap(this.controls[e]);this.popups=[];this.unloadDestroy=OpenLayers.Function.bind(this.destroy,this);OpenLayers.Event.observe(window,
"unload",this.unloadDestroy);b&&b.layers&&(delete this.center,this.addLayers(b.layers),b.center&&!this.getCenter()&&this.setCenter(b.center,b.zoom))},getViewport:function(){return this.viewPortDiv},render:function(a){this.div=OpenLayers.Util.getElement(a);OpenLayers.Element.addClass(this.div,"olMap");this.viewPortDiv.parentNode.removeChild(this.viewPortDiv);this.div.appendChild(this.viewPortDiv);this.updateSize()},unloadDestroy:null,updateSizeDestroy:null,destroy:function(){if(!this.unloadDestroy)return!1;
this.panTween&&(this.panTween.stop(),this.panTween=null);OpenLayers.Event.stopObserving(window,"unload",this.unloadDestroy);this.unloadDestroy=null;this.updateSizeDestroy?OpenLayers.Event.stopObserving(window,"resize",this.updateSizeDestroy):this.events.unregister("resize",this,this.updateSize);this.paddingForPopups=null;if(null!=this.controls){for(var a=this.controls.length-1;0<=a;--a)this.controls[a].destroy();this.controls=null}if(null!=this.layers){for(a=this.layers.length-1;0<=a;--a)this.layers[a].destroy(!1);
this.layers=null}this.viewPortDiv&&this.div.removeChild(this.viewPortDiv);this.viewPortDiv=null;this.eventListeners&&(this.events.un(this.eventListeners),this.eventListeners=null);this.events.destroy();this.options=this.events=null},setOptions:function(a){var b=this.minPx&&a.restrictedExtent!=this.restrictedExtent;OpenLayers.Util.extend(this,a);b&&this.moveTo(this.getCachedCenter(),this.zoom,{forceZoomChange:!0})},getTileSize:function(){return this.tileSize},getBy:function(a,b,c){var d="function"==
typeof c.test;return OpenLayers.Array.filter(this[a],function(a){return a[b]==c||d&&c.test(a[b])})},getLayersBy:function(a,b){return this.getBy("layers",a,b)},getLayersByName:function(a){return this.getLayersBy("name",a)},getLayersByClass:function(a){return this.getLayersBy("CLASS_NAME",a)},getControlsBy:function(a,b){return this.getBy("controls",a,b)},getControlsByClass:function(a){return this.getControlsBy("CLASS_NAME",a)},getLayer:function(a){for(var b=null,c=0,d=this.layers.length;c<d;c++){var e=
this.layers[c];if(e.id==a){b=e;break}}return b},setLayerZIndex:function(a,b){a.setZIndex(this.Z_INDEX_BASE[a.isBaseLayer?"BaseLayer":"Overlay"]+5*b)},resetLayersZIndex:function(){for(var a=0,b=this.layers.length;a<b;a++)this.setLayerZIndex(this.layers[a],a)},addLayer:function(a){for(var b=0,c=this.layers.length;b<c;b++)if(this.layers[b]==a)return!1;if(!1===this.events.triggerEvent("preaddlayer",{layer:a}))return!1;this.allOverlays&&(a.isBaseLayer=!1);a.div.className="olLayerDiv";a.div.style.overflow=
"";this.setLayerZIndex(a,this.layers.length);a.isFixed?this.viewPortDiv.appendChild(a.div):this.layerContainerDiv.appendChild(a.div);this.layers.push(a);a.setMap(this);a.isBaseLayer||this.allOverlays&&!this.baseLayer?null==this.baseLayer?this.setBaseLayer(a):a.setVisibility(!1):a.redraw();this.events.triggerEvent("addlayer",{layer:a});a.events.triggerEvent("added",{map:this,layer:a});a.afterAdd();return!0},addLayers:function(a){for(var b=0,c=a.length;b<c;b++)this.addLayer(a[b])},removeLayer:function(a,
b){if(!1!==this.events.triggerEvent("preremovelayer",{layer:a})){null==b&&(b=!0);a.isFixed?this.viewPortDiv.removeChild(a.div):this.layerContainerDiv.removeChild(a.div);OpenLayers.Util.removeItem(this.layers,a);a.removeMap(this);a.map=null;if(this.baseLayer==a&&(this.baseLayer=null,b))for(var c=0,d=this.layers.length;c<d;c++){var e=this.layers[c];if(e.isBaseLayer||this.allOverlays){this.setBaseLayer(e);break}}this.resetLayersZIndex();this.events.triggerEvent("removelayer",{layer:a});a.events.triggerEvent("removed",
{map:this,layer:a})}},getNumLayers:function(){return this.layers.length},getLayerIndex:function(a){return OpenLayers.Util.indexOf(this.layers,a)},setLayerIndex:function(a,b){var c=this.getLayerIndex(a);0>b?b=0:b>this.layers.length&&(b=this.layers.length);if(c!=b){this.layers.splice(c,1);this.layers.splice(b,0,a);for(var c=0,d=this.layers.length;c<d;c++)this.setLayerZIndex(this.layers[c],c);this.events.triggerEvent("changelayer",{layer:a,property:"order"});this.allOverlays&&(0===b?this.setBaseLayer(a):
this.baseLayer!==this.layers[0]&&this.setBaseLayer(this.layers[0]))}},raiseLayer:function(a,b){var c=this.getLayerIndex(a)+b;this.setLayerIndex(a,c)},setBaseLayer:function(a){if(a!=this.baseLayer&&-1!=OpenLayers.Util.indexOf(this.layers,a)){var b=this.getCachedCenter(),c=OpenLayers.Util.getResolutionFromScale(this.getScale(),a.units);null!=this.baseLayer&&!this.allOverlays&&this.baseLayer.setVisibility(!1);this.baseLayer=a;if(!this.allOverlays||this.baseLayer.visibility)this.baseLayer.setVisibility(!0),
!1===this.baseLayer.inRange&&this.baseLayer.redraw();null!=b&&(a=this.getZoomForResolution(c||this.resolution,!0),this.setCenter(b,a,!1,!0));this.events.triggerEvent("changebaselayer",{layer:this.baseLayer})}},addControl:function(a,b){this.controls.push(a);this.addControlToMap(a,b)},addControls:function(a,b){for(var c=1===arguments.length?[]:b,d=0,e=a.length;d<e;d++)this.addControl(a[d],c[d]?c[d]:null)},addControlToMap:function(a,b){a.outsideViewport=null!=a.div;this.displayProjection&&!a.displayProjection&&
(a.displayProjection=this.displayProjection);a.setMap(this);var c=a.draw(b);c&&!a.outsideViewport&&(c.style.zIndex=this.Z_INDEX_BASE.Control+this.controls.length,this.viewPortDiv.appendChild(c));a.autoActivate&&a.activate()},getControl:function(a){for(var b=null,c=0,d=this.controls.length;c<d;c++){var e=this.controls[c];if(e.id==a){b=e;break}}return b},removeControl:function(a){a&&a==this.getControl(a.id)&&(a.div&&a.div.parentNode==this.viewPortDiv&&this.viewPortDiv.removeChild(a.div),OpenLayers.Util.removeItem(this.controls,
a))},addPopup:function(a,b){if(b)for(var c=this.popups.length-1;0<=c;--c)this.removePopup(this.popups[c]);a.map=this;this.popups.push(a);if(c=a.draw())c.style.zIndex=this.Z_INDEX_BASE.Popup+this.popups.length,this.layerContainerDiv.appendChild(c)},removePopup:function(a){OpenLayers.Util.removeItem(this.popups,a);if(a.div)try{this.layerContainerDiv.removeChild(a.div)}catch(b){}a.map=null},getSize:function(){var a=null;null!=this.size&&(a=this.size.clone());return a},updateSize:function(){var a=this.getCurrentSize();
if(a&&!isNaN(a.h)&&!isNaN(a.w)){this.events.clearMouseCache();var b=this.getSize();null==b&&(this.size=b=a);if(!a.equals(b)){this.size=a;a=0;for(b=this.layers.length;a<b;a++)this.layers[a].onMapResize();a=this.getCachedCenter();null!=this.baseLayer&&null!=a&&(b=this.getZoom(),this.zoom=null,this.setCenter(a,b))}}},getCurrentSize:function(){var a=new OpenLayers.Size(this.div.clientWidth,this.div.clientHeight);if(0==a.w&&0==a.h||isNaN(a.w)&&isNaN(a.h))a.w=this.div.offsetWidth,a.h=this.div.offsetHeight;
if(0==a.w&&0==a.h||isNaN(a.w)&&isNaN(a.h))a.w=parseInt(this.div.style.width),a.h=parseInt(this.div.style.height);return a},calculateBounds:function(a,b){var c=null;null==a&&(a=this.getCachedCenter());null==b&&(b=this.getResolution());if(null!=a&&null!=b)var c=this.size.w*b/2,d=this.size.h*b/2,c=new OpenLayers.Bounds(a.lon-c,a.lat-d,a.lon+c,a.lat+d);return c},getCenter:function(){var a=null,b=this.getCachedCenter();b&&(a=b.clone());return a},getCachedCenter:function(){!this.center&&this.size&&(this.center=
this.getLonLatFromViewPortPx({x:this.size.w/2,y:this.size.h/2}));return this.center},getZoom:function(){return this.zoom},pan:function(a,b,c){c=OpenLayers.Util.applyDefaults(c,{animate:!0,dragging:!1});if(c.dragging)(0!=a||0!=b)&&this.moveByPx(a,b);else{var d=this.getViewPortPxFromLonLat(this.getCachedCenter()),a=d.add(a,b);if(this.dragging||!a.equals(d))d=this.getLonLatFromViewPortPx(a),c.animate?this.panTo(d):(this.moveTo(d),this.dragging&&(this.dragging=!1,this.events.triggerEvent("moveend")))}},
panTo:function(a){if(this.panMethod&&this.getExtent().scale(this.panRatio).containsLonLat(a)){this.panTween||(this.panTween=new OpenLayers.Tween(this.panMethod));var b=this.getCachedCenter();if(!a.equals(b)){var b=this.getPixelFromLonLat(b),c=this.getPixelFromLonLat(a),d=0,e=0;this.panTween.start({x:0,y:0},{x:c.x-b.x,y:c.y-b.y},this.panDuration,{callbacks:{eachStep:OpenLayers.Function.bind(function(a){this.moveByPx(a.x-d,a.y-e);d=Math.round(a.x);e=Math.round(a.y)},this),done:OpenLayers.Function.bind(function(){this.moveTo(a);
this.dragging=false;this.events.triggerEvent("moveend")},this)}})}}else this.setCenter(a)},setCenter:function(a,b,c,d){this.panTween&&this.panTween.stop();this.moveTo(a,b,{dragging:c,forceZoomChange:d})},moveByPx:function(a,b){var c=this.size.w/2,d=this.size.h/2,e=c+a,f=d+b,g=this.baseLayer.wrapDateLine,h=0,i=0;this.restrictedExtent&&(h=c,i=d,g=!1);a=g||e<=this.maxPx.x-h&&e>=this.minPx.x+h?Math.round(a):0;b=f<=this.maxPx.y-i&&f>=this.minPx.y+i?Math.round(b):0;if(a||b){this.dragging||(this.dragging=
!0,this.events.triggerEvent("movestart"));this.center=null;a&&(this.layerContainerDiv.style.left=parseInt(this.layerContainerDiv.style.left)-a+"px",this.minPx.x-=a,this.maxPx.x-=a);b&&(this.layerContainerDiv.style.top=parseInt(this.layerContainerDiv.style.top)-b+"px",this.minPx.y-=b,this.maxPx.y-=b);d=0;for(e=this.layers.length;d<e;++d)if(c=this.layers[d],c.visibility&&(c===this.baseLayer||c.inRange))c.moveByPx(a,b),c.events.triggerEvent("move");this.events.triggerEvent("move")}},adjustZoom:function(a){var b=
this.baseLayer.resolutions,c=this.getMaxExtent().getWidth()/this.size.w;if(this.getResolutionForZoom(a)>c)for(var d=a|0,e=b.length;d<e;++d)if(b[d]<=c){a=d;break}return a},moveTo:function(a,b,c){null!=a&&!(a instanceof OpenLayers.LonLat)&&(a=new OpenLayers.LonLat(a));c||(c={});null!=b&&(b=parseFloat(b),this.fractionalZoom||(b=Math.round(b)));if(this.baseLayer.wrapDateLine){var d=b,b=this.adjustZoom(b);b!==d&&(a=this.getCenter())}var d=c.dragging||this.dragging,e=c.forceZoomChange;!this.getCachedCenter()&&
!this.isValidLonLat(a)&&(a=this.maxExtent.getCenterLonLat(),this.center=a.clone());if(null!=this.restrictedExtent){null==a&&(a=this.center);null==b&&(b=this.getZoom());var f=this.getResolutionForZoom(b),f=this.calculateBounds(a,f);if(!this.restrictedExtent.containsBounds(f)){var g=this.restrictedExtent.getCenterLonLat();f.getWidth()>this.restrictedExtent.getWidth()?a=new OpenLayers.LonLat(g.lon,a.lat):f.left<this.restrictedExtent.left?a=a.add(this.restrictedExtent.left-f.left,0):f.right>this.restrictedExtent.right&&
(a=a.add(this.restrictedExtent.right-f.right,0));f.getHeight()>this.restrictedExtent.getHeight()?a=new OpenLayers.LonLat(a.lon,g.lat):f.bottom<this.restrictedExtent.bottom?a=a.add(0,this.restrictedExtent.bottom-f.bottom):f.top>this.restrictedExtent.top&&(a=a.add(0,this.restrictedExtent.top-f.top))}}e=e||this.isValidZoomLevel(b)&&b!=this.getZoom();f=this.isValidLonLat(a)&&!a.equals(this.center);if(e||f||d){d||this.events.triggerEvent("movestart");f&&(!e&&this.center&&this.centerLayerContainer(a),this.center=
a.clone());a=e?this.getResolutionForZoom(b):this.getResolution();if(e||null==this.layerContainerOrigin){this.layerContainerOrigin=this.getCachedCenter();this.layerContainerDiv.style.left="0px";this.layerContainerDiv.style.top="0px";var f=this.getMaxExtent({restricted:!0}),h=f.getCenterLonLat(),g=this.center.lon-h.lon,h=h.lat-this.center.lat,i=Math.round(f.getWidth()/a),j=Math.round(f.getHeight()/a);this.minPx={x:(this.size.w-i)/2-g/a,y:(this.size.h-j)/2-h/a};this.maxPx={x:this.minPx.x+Math.round(f.getWidth()/
a),y:this.minPx.y+Math.round(f.getHeight()/a)}}e&&(this.zoom=b,this.resolution=a);a=this.getExtent();this.baseLayer.visibility&&(this.baseLayer.moveTo(a,e,c.dragging),c.dragging||this.baseLayer.events.triggerEvent("moveend",{zoomChanged:e}));a=this.baseLayer.getExtent();for(b=this.layers.length-1;0<=b;--b)if(f=this.layers[b],f!==this.baseLayer&&!f.isBaseLayer&&(g=f.calculateInRange(),f.inRange!=g&&((f.inRange=g)||f.display(!1),this.events.triggerEvent("changelayer",{layer:f,property:"visibility"})),
g&&f.visibility))f.moveTo(a,e,c.dragging),c.dragging||f.events.triggerEvent("moveend",{zoomChanged:e});this.events.triggerEvent("move");d||this.events.triggerEvent("moveend");if(e){b=0;for(c=this.popups.length;b<c;b++)this.popups[b].updatePosition();this.events.triggerEvent("zoomend")}}},centerLayerContainer:function(a){var b=this.getViewPortPxFromLonLat(this.layerContainerOrigin),c=this.getViewPortPxFromLonLat(a);if(null!=b&&null!=c){var d=parseInt(this.layerContainerDiv.style.left),a=parseInt(this.layerContainerDiv.style.top),
e=Math.round(b.x-c.x),b=Math.round(b.y-c.y);this.layerContainerDiv.style.left=e+"px";this.layerContainerDiv.style.top=b+"px";d-=e;a-=b;this.minPx.x-=d;this.maxPx.x-=d;this.minPx.y-=a;this.maxPx.y-=a}},isValidZoomLevel:function(a){return null!=a&&0<=a&&a<this.getNumZoomLevels()},isValidLonLat:function(a){var b=!1;null!=a&&(b=this.getMaxExtent(),b=b.containsLonLat(a,{worldBounds:this.baseLayer.wrapDateLine&&b}));return b},getProjection:function(){var a=this.getProjectionObject();return a?a.getCode():
null},getProjectionObject:function(){var a=null;null!=this.baseLayer&&(a=this.baseLayer.projection);return a},getMaxResolution:function(){var a=null;null!=this.baseLayer&&(a=this.baseLayer.maxResolution);return a},getMaxExtent:function(a){var b=null;a&&a.restricted&&this.restrictedExtent?b=this.restrictedExtent:null!=this.baseLayer&&(b=this.baseLayer.maxExtent);return b},getNumZoomLevels:function(){var a=null;null!=this.baseLayer&&(a=this.baseLayer.numZoomLevels);return a},getExtent:function(){var a=
null;null!=this.baseLayer&&(a=this.baseLayer.getExtent());return a},getResolution:function(){var a=null;null!=this.baseLayer?a=this.baseLayer.getResolution():!0===this.allOverlays&&0<this.layers.length&&(a=this.layers[0].getResolution());return a},getUnits:function(){var a=null;null!=this.baseLayer&&(a=this.baseLayer.units);return a},getScale:function(){var a=null;null!=this.baseLayer&&(a=this.getResolution(),a=OpenLayers.Util.getScaleFromResolution(a,this.baseLayer.units));return a},getZoomForExtent:function(a,
b){var c=null;null!=this.baseLayer&&(c=this.baseLayer.getZoomForExtent(a,b));return c},getResolutionForZoom:function(a){var b=null;this.baseLayer&&(b=this.baseLayer.getResolutionForZoom(a));return b},getZoomForResolution:function(a,b){var c=null;null!=this.baseLayer&&(c=this.baseLayer.getZoomForResolution(a,b));return c},zoomTo:function(a){this.isValidZoomLevel(a)&&this.setCenter(null,a)},zoomIn:function(){this.zoomTo(this.getZoom()+1)},zoomOut:function(){this.zoomTo(this.getZoom()-1)},zoomToExtent:function(a,
b){a instanceof OpenLayers.Bounds||(a=new OpenLayers.Bounds(a));var c=a.getCenterLonLat();if(this.baseLayer.wrapDateLine){c=this.getMaxExtent();for(a=a.clone();a.right<a.left;)a.right+=c.getWidth();c=a.getCenterLonLat().wrapDateLine(c)}this.setCenter(c,this.getZoomForExtent(a,b))},zoomToMaxExtent:function(a){this.zoomToExtent(this.getMaxExtent({restricted:a?a.restricted:!0}))},zoomToScale:function(a,b){var c=OpenLayers.Util.getResolutionFromScale(a,this.baseLayer.units),d=this.size.w*c/2,c=this.size.h*
c/2,e=this.getCachedCenter();this.zoomToExtent(new OpenLayers.Bounds(e.lon-d,e.lat-c,e.lon+d,e.lat+c),b)},getLonLatFromViewPortPx:function(a){var b=null;null!=this.baseLayer&&(b=this.baseLayer.getLonLatFromViewPortPx(a));return b},getViewPortPxFromLonLat:function(a){var b=null;null!=this.baseLayer&&(b=this.baseLayer.getViewPortPxFromLonLat(a));return b},getLonLatFromPixel:function(a){return this.getLonLatFromViewPortPx(a)},getPixelFromLonLat:function(a){a=this.getViewPortPxFromLonLat(a);a.x=Math.round(a.x);
a.y=Math.round(a.y);return a},getGeodesicPixelSize:function(a){var b=a?this.getLonLatFromPixel(a):this.getCachedCenter()||new OpenLayers.LonLat(0,0),c=this.getResolution(),a=b.add(-c/2,0),d=b.add(c/2,0),e=b.add(0,-c/2),b=b.add(0,c/2),c=new OpenLayers.Projection("EPSG:4326"),f=this.getProjectionObject()||c;f.equals(c)||(a.transform(f,c),d.transform(f,c),e.transform(f,c),b.transform(f,c));return new OpenLayers.Size(OpenLayers.Util.distVincenty(a,d),OpenLayers.Util.distVincenty(e,b))},getViewPortPxFromLayerPx:function(a){var b=
null;if(null!=a)var b=parseInt(this.layerContainerDiv.style.left),c=parseInt(this.layerContainerDiv.style.top),b=a.add(b,c);return b},getLayerPxFromViewPortPx:function(a){var b=null;if(null!=a){var b=-parseInt(this.layerContainerDiv.style.left),c=-parseInt(this.layerContainerDiv.style.top),b=a.add(b,c);if(isNaN(b.x)||isNaN(b.y))b=null}return b},getLonLatFromLayerPx:function(a){a=this.getViewPortPxFromLayerPx(a);return this.getLonLatFromViewPortPx(a)},getLayerPxFromLonLat:function(a){return this.getLayerPxFromViewPortPx(this.getPixelFromLonLat(a))},
CLASS_NAME:"OpenLayers.Map"});OpenLayers.Map.TILE_WIDTH=256;OpenLayers.Map.TILE_HEIGHT=256;OpenLayers.Layer=OpenLayers.Class({id:null,name:null,div:null,opacity:1,alwaysInRange:null,RESOLUTION_PROPERTIES:"scales resolutions maxScale minScale maxResolution minResolution numZoomLevels maxZoomLevel".split(" "),events:null,map:null,isBaseLayer:!1,alpha:!1,displayInLayerSwitcher:!0,visibility:!0,attribution:null,inRange:!1,imageSize:null,options:null,eventListeners:null,gutter:0,projection:null,units:null,scales:null,resolutions:null,maxExtent:null,minExtent:null,maxResolution:null,minResolution:null,
numZoomLevels:null,minScale:null,maxScale:null,displayOutsideMaxExtent:!1,wrapDateLine:!1,metadata:null,initialize:function(a,b){this.metadata={};this.addOptions(b);this.name=a;if(null==this.id&&(this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_"),this.div=OpenLayers.Util.createDiv(this.id),this.div.style.width="100%",this.div.style.height="100%",this.div.dir="ltr",this.events=new OpenLayers.Events(this,this.div),this.eventListeners instanceof Object))this.events.on(this.eventListeners)},
destroy:function(a){null==a&&(a=!0);null!=this.map&&this.map.removeLayer(this,a);this.options=this.div=this.name=this.map=this.projection=null;this.events&&(this.eventListeners&&this.events.un(this.eventListeners),this.events.destroy());this.events=this.eventListeners=null},clone:function(a){null==a&&(a=new OpenLayers.Layer(this.name,this.getOptions()));OpenLayers.Util.applyDefaults(a,this);a.map=null;return a},getOptions:function(){var a={},b;for(b in this.options)a[b]=this[b];return a},setName:function(a){a!=
this.name&&(this.name=a,null!=this.map&&this.map.events.triggerEvent("changelayer",{layer:this,property:"name"}))},addOptions:function(a,b){null==this.options&&(this.options={});if(a&&("string"==typeof a.projection&&(a.projection=new OpenLayers.Projection(a.projection)),a.projection&&OpenLayers.Util.applyDefaults(a,OpenLayers.Projection.defaults[a.projection.getCode()]),a.maxExtent&&!(a.maxExtent instanceof OpenLayers.Bounds)&&(a.maxExtent=new OpenLayers.Bounds(a.maxExtent)),a.minExtent&&!(a.minExtent instanceof
OpenLayers.Bounds)))a.minExtent=new OpenLayers.Bounds(a.minExtent);OpenLayers.Util.extend(this.options,a);OpenLayers.Util.extend(this,a);this.projection&&this.projection.getUnits()&&(this.units=this.projection.getUnits());if(this.map){var c=this.map.getResolution(),d=this.RESOLUTION_PROPERTIES.concat(["projection","units","minExtent","maxExtent"]),e;for(e in a)if(a.hasOwnProperty(e)&&0<=OpenLayers.Util.indexOf(d,e)){this.initResolutions();b&&this.map.baseLayer===this&&(this.map.setCenter(this.map.getCenter(),
this.map.getZoomForResolution(c),!1,!0),this.map.events.triggerEvent("changebaselayer",{layer:this}));break}}},onMapResize:function(){},redraw:function(){var a=!1;if(this.map){this.inRange=this.calculateInRange();var b=this.getExtent();b&&(this.inRange&&this.visibility)&&(this.moveTo(b,!0,!1),this.events.triggerEvent("moveend",{zoomChanged:!0}),a=!0)}return a},moveTo:function(){var a=this.visibility;this.isBaseLayer||(a=a&&this.inRange);this.display(a)},moveByPx:function(){},setMap:function(a){null==
this.map&&(this.map=a,this.maxExtent=this.maxExtent||this.map.maxExtent,this.minExtent=this.minExtent||this.map.minExtent,this.projection=this.projection||this.map.projection,"string"==typeof this.projection&&(this.projection=new OpenLayers.Projection(this.projection)),this.units=this.projection.getUnits()||this.units||this.map.units,this.initResolutions(),this.isBaseLayer||(this.inRange=this.calculateInRange(),this.div.style.display=this.visibility&&this.inRange?"":"none"),this.setTileSize())},afterAdd:function(){},
removeMap:function(){},getImageSize:function(){return this.imageSize||this.tileSize},setTileSize:function(a){this.tileSize=a=a?a:this.tileSize?this.tileSize:this.map.getTileSize();this.gutter&&(this.imageSize=new OpenLayers.Size(a.w+2*this.gutter,a.h+2*this.gutter))},getVisibility:function(){return this.visibility},setVisibility:function(a){a!=this.visibility&&(this.visibility=a,this.display(a),this.redraw(),null!=this.map&&this.map.events.triggerEvent("changelayer",{layer:this,property:"visibility"}),
this.events.triggerEvent("visibilitychanged"))},display:function(a){a!=("none"!=this.div.style.display)&&(this.div.style.display=a&&this.calculateInRange()?"block":"none")},calculateInRange:function(){var a=!1;this.alwaysInRange?a=!0:this.map&&(a=this.map.getResolution(),a=a>=this.minResolution&&a<=this.maxResolution);return a},setIsBaseLayer:function(a){a!=this.isBaseLayer&&(this.isBaseLayer=a,null!=this.map&&this.map.events.triggerEvent("changebaselayer",{layer:this}))},initResolutions:function(){var a,
b,c,d={},e=!0;a=0;for(b=this.RESOLUTION_PROPERTIES.length;a<b;a++)c=this.RESOLUTION_PROPERTIES[a],d[c]=this.options[c],e&&this.options[c]&&(e=!1);null==this.alwaysInRange&&(this.alwaysInRange=e);null==d.resolutions&&(d.resolutions=this.resolutionsFromScales(d.scales));null==d.resolutions&&(d.resolutions=this.calculateResolutions(d));if(null==d.resolutions){a=0;for(b=this.RESOLUTION_PROPERTIES.length;a<b;a++)c=this.RESOLUTION_PROPERTIES[a],d[c]=null!=this.options[c]?this.options[c]:this.map[c];null==
d.resolutions&&(d.resolutions=this.resolutionsFromScales(d.scales));null==d.resolutions&&(d.resolutions=this.calculateResolutions(d))}var f;this.options.maxResolution&&"auto"!==this.options.maxResolution&&(f=this.options.maxResolution);this.options.minScale&&(f=OpenLayers.Util.getResolutionFromScale(this.options.minScale,this.units));var g;this.options.minResolution&&"auto"!==this.options.minResolution&&(g=this.options.minResolution);this.options.maxScale&&(g=OpenLayers.Util.getResolutionFromScale(this.options.maxScale,
this.units));d.resolutions&&(d.resolutions.sort(function(a,b){return b-a}),f||(f=d.resolutions[0]),g||(g=d.resolutions[d.resolutions.length-1]));if(this.resolutions=d.resolutions){b=this.resolutions.length;this.scales=Array(b);for(a=0;a<b;a++)this.scales[a]=OpenLayers.Util.getScaleFromResolution(this.resolutions[a],this.units);this.numZoomLevels=b}if(this.minResolution=g)this.maxScale=OpenLayers.Util.getScaleFromResolution(g,this.units);if(this.maxResolution=f)this.minScale=OpenLayers.Util.getScaleFromResolution(f,
this.units)},resolutionsFromScales:function(a){if(null!=a){var b,c,d;d=a.length;b=Array(d);for(c=0;c<d;c++)b[c]=OpenLayers.Util.getResolutionFromScale(a[c],this.units);return b}},calculateResolutions:function(a){var b,c,d=a.maxResolution;null!=a.minScale?d=OpenLayers.Util.getResolutionFromScale(a.minScale,this.units):"auto"==d&&null!=this.maxExtent&&(b=this.map.getSize(),c=this.maxExtent.getWidth()/b.w,b=this.maxExtent.getHeight()/b.h,d=Math.max(c,b));c=a.minResolution;null!=a.maxScale?c=OpenLayers.Util.getResolutionFromScale(a.maxScale,
this.units):"auto"==a.minResolution&&null!=this.minExtent&&(b=this.map.getSize(),c=this.minExtent.getWidth()/b.w,b=this.minExtent.getHeight()/b.h,c=Math.max(c,b));"number"!==typeof d&&("number"!==typeof c&&null!=this.maxExtent)&&(d=this.map.getTileSize(),d=Math.max(this.maxExtent.getWidth()/d.w,this.maxExtent.getHeight()/d.h));b=a.maxZoomLevel;a=a.numZoomLevels;"number"===typeof c&&"number"===typeof d&&void 0===a?a=Math.floor(Math.log(d/c)/Math.log(2))+1:void 0===a&&null!=b&&(a=b+1);if(!("number"!==
typeof a||0>=a||"number"!==typeof d&&"number"!==typeof c)){b=Array(a);var e=2;"number"==typeof c&&"number"==typeof d&&(e=Math.pow(d/c,1/(a-1)));var f;if("number"===typeof d)for(f=0;f<a;f++)b[f]=d/Math.pow(e,f);else for(f=0;f<a;f++)b[a-1-f]=c*Math.pow(e,f);return b}},getResolution:function(){return this.getResolutionForZoom(this.map.getZoom())},getExtent:function(){return this.map.calculateBounds()},getZoomForExtent:function(a,b){var c=this.map.getSize();return this.getZoomForResolution(Math.max(a.getWidth()/
c.w,a.getHeight()/c.h),b)},getDataExtent:function(){},getResolutionForZoom:function(a){a=Math.max(0,Math.min(a,this.resolutions.length-1));if(this.map.fractionalZoom)var b=Math.floor(a),c=Math.ceil(a),a=this.resolutions[b]-(a-b)*(this.resolutions[b]-this.resolutions[c]);else a=this.resolutions[Math.round(a)];return a},getZoomForResolution:function(a,b){var c,d;if(this.map.fractionalZoom){var e=0,f=this.resolutions[e],g=this.resolutions[this.resolutions.length-1],h;c=0;for(d=this.resolutions.length;c<
d;++c)if(h=this.resolutions[c],h>=a&&(f=h,e=c),h<=a){g=h;break}c=f-g;c=0<c?e+(f-a)/c:e}else{f=Number.POSITIVE_INFINITY;c=0;for(d=this.resolutions.length;c<d;c++)if(b){e=Math.abs(this.resolutions[c]-a);if(e>f)break;f=e}else if(this.resolutions[c]<a)break;c=Math.max(0,c-1)}return c},getLonLatFromViewPortPx:function(a){var b=null,c=this.map;if(null!=a&&c.minPx){var b=c.getResolution(),d=c.getMaxExtent({restricted:!0}),b=new OpenLayers.LonLat((a.x-c.minPx.x)*b+d.left,(c.minPx.y-a.y)*b+d.top);this.wrapDateLine&&
(b=b.wrapDateLine(this.maxExtent))}return b},getViewPortPxFromLonLat:function(a,b){var c=null;null!=a&&(b=b||this.map.getResolution(),c=this.map.calculateBounds(null,b),c=new OpenLayers.Pixel(1/b*(a.lon-c.left),1/b*(c.top-a.lat)));return c},setOpacity:function(a){if(a!=this.opacity){this.opacity=a;for(var b=this.div.childNodes,c=0,d=b.length;c<d;++c){var e=b[c].firstChild||b[c],f=b[c].lastChild;f&&"iframe"===f.nodeName.toLowerCase()&&(e=f.parentNode);OpenLayers.Util.modifyDOMElement(e,null,null,null,
null,null,null,a)}null!=this.map&&this.map.events.triggerEvent("changelayer",{layer:this,property:"opacity"})}},getZIndex:function(){return this.div.style.zIndex},setZIndex:function(a){this.div.style.zIndex=a},adjustBounds:function(a){if(this.gutter)var b=this.gutter*this.map.getResolution(),a=new OpenLayers.Bounds(a.left-b,a.bottom-b,a.right+b,a.top+b);this.wrapDateLine&&(b={rightTolerance:this.getResolution(),leftTolerance:this.getResolution()},a=a.wrapDateLine(this.maxExtent,b));return a},CLASS_NAME:"OpenLayers.Layer"});OpenLayers.Layer.SphericalMercator={getExtent:function(){var a=null;return a=this.sphericalMercator?this.map.calculateBounds():OpenLayers.Layer.FixedZoomLevels.prototype.getExtent.apply(this)},getLonLatFromViewPortPx:function(a){return OpenLayers.Layer.prototype.getLonLatFromViewPortPx.apply(this,arguments)},getViewPortPxFromLonLat:function(a){return OpenLayers.Layer.prototype.getViewPortPxFromLonLat.apply(this,arguments)},initMercatorParameters:function(){this.RESOLUTIONS=[];for(var a=0;a<=this.MAX_ZOOM_LEVEL;++a)this.RESOLUTIONS[a]=
156543.03390625/Math.pow(2,a);this.units="m";this.projection=this.projection||"EPSG:900913"},forwardMercator:function(){var a=new OpenLayers.Projection("EPSG:4326"),b=new OpenLayers.Projection("EPSG:900913");return function(c,d){var e=OpenLayers.Projection.transform({x:c,y:d},a,b);return new OpenLayers.LonLat(e.x,e.y)}}(),inverseMercator:function(){var a=new OpenLayers.Projection("EPSG:4326"),b=new OpenLayers.Projection("EPSG:900913");return function(c,d){var e=OpenLayers.Projection.transform({x:c,
y:d},b,a);return new OpenLayers.LonLat(e.x,e.y)}}()};OpenLayers.Layer.EventPane=OpenLayers.Class(OpenLayers.Layer,{smoothDragPan:!0,isBaseLayer:!0,isFixed:!0,pane:null,mapObject:null,initialize:function(a,b){OpenLayers.Layer.prototype.initialize.apply(this,arguments);null==this.pane&&(this.pane=OpenLayers.Util.createDiv(this.div.id+"_EventPane"))},destroy:function(){this.pane=this.mapObject=null;OpenLayers.Layer.prototype.destroy.apply(this,arguments)},setMap:function(a){OpenLayers.Layer.prototype.setMap.apply(this,arguments);this.pane.style.zIndex=
parseInt(this.div.style.zIndex)+1;this.pane.style.display=this.div.style.display;this.pane.style.width="100%";this.pane.style.height="100%";"msie"==OpenLayers.BROWSER_NAME&&(this.pane.style.background="url("+OpenLayers.Util.getImageLocation("blank.gif")+")");this.isFixed?this.map.viewPortDiv.appendChild(this.pane):this.map.layerContainerDiv.appendChild(this.pane);this.loadMapObject();null==this.mapObject&&this.loadWarningMessage()},removeMap:function(a){this.pane&&this.pane.parentNode&&this.pane.parentNode.removeChild(this.pane);
OpenLayers.Layer.prototype.removeMap.apply(this,arguments)},loadWarningMessage:function(){this.div.style.backgroundColor="darkblue";var a=this.map.getSize(),b=Math.min(a.w,300),c=Math.min(a.h,200),b=new OpenLayers.Size(b,c),a=(new OpenLayers.Pixel(a.w/2,a.h/2)).add(-b.w/2,-b.h/2),a=OpenLayers.Util.createDiv(this.name+"_warning",a,b,null,null,null,"auto");a.style.padding="7px";a.style.backgroundColor="yellow";a.innerHTML=this.getWarningHTML();this.div.appendChild(a)},getWarningHTML:function(){return""},
display:function(a){OpenLayers.Layer.prototype.display.apply(this,arguments);this.pane.style.display=this.div.style.display},setZIndex:function(a){OpenLayers.Layer.prototype.setZIndex.apply(this,arguments);this.pane.style.zIndex=parseInt(this.div.style.zIndex)+1},moveByPx:function(a,b){OpenLayers.Layer.prototype.moveByPx.apply(this,arguments);this.dragPanMapObject?this.dragPanMapObject(a,-b):this.moveTo(this.map.getCachedCenter())},moveTo:function(a,b,c){OpenLayers.Layer.prototype.moveTo.apply(this,
arguments);if(null!=this.mapObject){var d=this.map.getCenter(),e=this.map.getZoom();if(null!=d){var f=this.getOLLonLatFromMapObjectLonLat(this.getMapObjectCenter()),g=this.getOLZoomFromMapObjectZoom(this.getMapObjectZoom());if(!d.equals(f)||e!=g)!b&&f&&this.dragPanMapObject&&this.smoothDragPan?(e=this.map.getViewPortPxFromLonLat(f),d=this.map.getViewPortPxFromLonLat(d),this.dragPanMapObject(d.x-e.x,e.y-d.y)):(d=this.getMapObjectLonLatFromOLLonLat(d),e=this.getMapObjectZoomFromOLZoom(e),this.setMapObjectCenter(d,
e,c))}}},getLonLatFromViewPortPx:function(a){var b=null;null!=this.mapObject&&null!=this.getMapObjectCenter()&&(b=this.getOLLonLatFromMapObjectLonLat(this.getMapObjectLonLatFromMapObjectPixel(this.getMapObjectPixelFromOLPixel(a))));return b},getViewPortPxFromLonLat:function(a){var b=null;null!=this.mapObject&&null!=this.getMapObjectCenter()&&(b=this.getOLPixelFromMapObjectPixel(this.getMapObjectPixelFromMapObjectLonLat(this.getMapObjectLonLatFromOLLonLat(a))));return b},getOLLonLatFromMapObjectLonLat:function(a){var b=
null;null!=a&&(b=this.getLongitudeFromMapObjectLonLat(a),a=this.getLatitudeFromMapObjectLonLat(a),b=new OpenLayers.LonLat(b,a));return b},getMapObjectLonLatFromOLLonLat:function(a){var b=null;null!=a&&(b=this.getMapObjectLonLatFromLonLat(a.lon,a.lat));return b},getOLPixelFromMapObjectPixel:function(a){var b=null;null!=a&&(b=this.getXFromMapObjectPixel(a),a=this.getYFromMapObjectPixel(a),b=new OpenLayers.Pixel(b,a));return b},getMapObjectPixelFromOLPixel:function(a){var b=null;null!=a&&(b=this.getMapObjectPixelFromXY(a.x,
a.y));return b},CLASS_NAME:"OpenLayers.Layer.EventPane"});OpenLayers.Layer.FixedZoomLevels=OpenLayers.Class({initialize:function(){},initResolutions:function(){for(var a=["minZoomLevel","maxZoomLevel","numZoomLevels"],b=0,c=a.length;b<c;b++){var d=a[b];this[d]=null!=this.options[d]?this.options[d]:this.map[d]}if(null==this.minZoomLevel||this.minZoomLevel<this.MIN_ZOOM_LEVEL)this.minZoomLevel=this.MIN_ZOOM_LEVEL;a=this.MAX_ZOOM_LEVEL-this.minZoomLevel+1;b=null==this.options.numZoomLevels&&null!=this.options.maxZoomLevel||null==this.numZoomLevels&&null!=this.maxZoomLevel?
this.maxZoomLevel-this.minZoomLevel+1:this.numZoomLevels;this.numZoomLevels=null!=b?Math.min(b,a):a;this.maxZoomLevel=this.minZoomLevel+this.numZoomLevels-1;if(null!=this.RESOLUTIONS){a=0;this.resolutions=[];for(b=this.minZoomLevel;b<=this.maxZoomLevel;b++)this.resolutions[a++]=this.RESOLUTIONS[b];this.maxResolution=this.resolutions[0];this.minResolution=this.resolutions[this.resolutions.length-1]}},getResolution:function(){if(null!=this.resolutions)return OpenLayers.Layer.prototype.getResolution.apply(this,
arguments);var a=null,b=this.map.getSize(),c=this.getExtent();null!=b&&null!=c&&(a=Math.max(c.getWidth()/b.w,c.getHeight()/b.h));return a},getExtent:function(){var a=this.map.getSize(),b=this.getLonLatFromViewPortPx({x:0,y:0}),a=this.getLonLatFromViewPortPx({x:a.w,y:a.h});return null!=b&&null!=a?new OpenLayers.Bounds(b.lon,a.lat,a.lon,b.lat):null},getZoomForResolution:function(a){return null!=this.resolutions?OpenLayers.Layer.prototype.getZoomForResolution.apply(this,arguments):this.getZoomForExtent(OpenLayers.Layer.prototype.getExtent.apply(this,
[]))},getOLZoomFromMapObjectZoom:function(a){var b=null;null!=a&&(b=a-this.minZoomLevel,this.map.baseLayer!==this&&(b=this.map.baseLayer.getZoomForResolution(this.getResolutionForZoom(b))));return b},getMapObjectZoomFromOLZoom:function(a){var b=null;null!=a&&(b=a+this.minZoomLevel,this.map.baseLayer!==this&&(b=this.getZoomForResolution(this.map.baseLayer.getResolutionForZoom(b))));return b},CLASS_NAME:"OpenLayers.Layer.FixedZoomLevels"});OpenLayers.Layer.Google=OpenLayers.Class(OpenLayers.Layer.EventPane,OpenLayers.Layer.FixedZoomLevels,{MIN_ZOOM_LEVEL:0,MAX_ZOOM_LEVEL:21,RESOLUTIONS:[1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,6.866455078125E-4,3.4332275390625E-4,1.71661376953125E-4,8.58306884765625E-5,4.291534423828125E-5,2.145767211914062E-5,1.072883605957031E-5,5.36441802978515E-6,2.68220901489257E-6,1.341104507446289E-6,6.705522537231445E-7],
type:null,wrapDateLine:!0,sphericalMercator:!1,version:null,initialize:function(a,b){b=b||{};b.version||(b.version="function"===typeof GMap2?"2":"3");var c=OpenLayers.Layer.Google["v"+b.version.replace(/\./g,"_")];if(c)OpenLayers.Util.applyDefaults(b,c);else throw"Unsupported Google Maps API version: "+b.version;OpenLayers.Util.applyDefaults(b,c.DEFAULTS);b.maxExtent&&(b.maxExtent=b.maxExtent.clone());OpenLayers.Layer.EventPane.prototype.initialize.apply(this,[a,b]);OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,
[a,b]);this.sphericalMercator&&(OpenLayers.Util.extend(this,OpenLayers.Layer.SphericalMercator),this.initMercatorParameters())},clone:function(){return new OpenLayers.Layer.Google(this.name,this.getOptions())},setVisibility:function(a){var b=null==this.opacity?1:this.opacity;OpenLayers.Layer.EventPane.prototype.setVisibility.apply(this,arguments);this.setOpacity(b)},display:function(a){this._dragging||this.setGMapVisibility(a);OpenLayers.Layer.EventPane.prototype.display.apply(this,arguments)},moveTo:function(a,
b,c){this._dragging=c;OpenLayers.Layer.EventPane.prototype.moveTo.apply(this,arguments);delete this._dragging},setOpacity:function(a){a!==this.opacity&&(null!=this.map&&this.map.events.triggerEvent("changelayer",{layer:this,property:"opacity"}),this.opacity=a);if(this.getVisibility()){var b=this.getMapContainer();OpenLayers.Util.modifyDOMElement(b,null,null,null,null,null,null,a)}},destroy:function(){if(this.map){this.setGMapVisibility(!1);var a=OpenLayers.Layer.Google.cache[this.map.id];a&&1>=a.count&&
this.removeGMapElements()}OpenLayers.Layer.EventPane.prototype.destroy.apply(this,arguments)},removeGMapElements:function(){var a=OpenLayers.Layer.Google.cache[this.map.id];if(a){var b=this.mapObject&&this.getMapContainer();b&&b.parentNode&&b.parentNode.removeChild(b);(b=a.termsOfUse)&&b.parentNode&&b.parentNode.removeChild(b);(a=a.poweredBy)&&a.parentNode&&a.parentNode.removeChild(a)}},removeMap:function(a){this.visibility&&this.mapObject&&this.setGMapVisibility(!1);var b=OpenLayers.Layer.Google.cache[a.id];
b&&(1>=b.count?(this.removeGMapElements(),delete OpenLayers.Layer.Google.cache[a.id]):--b.count);delete this.termsOfUse;delete this.poweredBy;delete this.mapObject;delete this.dragObject;OpenLayers.Layer.EventPane.prototype.removeMap.apply(this,arguments)},getOLBoundsFromMapObjectBounds:function(a){var b=null;null!=a&&(b=a.getSouthWest(),a=a.getNorthEast(),this.sphericalMercator?(b=this.forwardMercator(b.lng(),b.lat()),a=this.forwardMercator(a.lng(),a.lat())):(b=new OpenLayers.LonLat(b.lng(),b.lat()),
a=new OpenLayers.LonLat(a.lng(),a.lat())),b=new OpenLayers.Bounds(b.lon,b.lat,a.lon,a.lat));return b},getWarningHTML:function(){return OpenLayers.i18n("googleWarning")},getMapObjectCenter:function(){return this.mapObject.getCenter()},getMapObjectZoom:function(){return this.mapObject.getZoom()},getLongitudeFromMapObjectLonLat:function(a){return this.sphericalMercator?this.forwardMercator(a.lng(),a.lat()).lon:a.lng()},getLatitudeFromMapObjectLonLat:function(a){return this.sphericalMercator?this.forwardMercator(a.lng(),
a.lat()).lat:a.lat()},getXFromMapObjectPixel:function(a){return a.x},getYFromMapObjectPixel:function(a){return a.y},CLASS_NAME:"OpenLayers.Layer.Google"});OpenLayers.Layer.Google.cache={};
OpenLayers.Layer.Google.v2={termsOfUse:null,poweredBy:null,dragObject:null,loadMapObject:function(){this.type||(this.type=G_NORMAL_MAP);var a,b,c,d=OpenLayers.Layer.Google.cache[this.map.id];if(d)a=d.mapObject,b=d.termsOfUse,c=d.poweredBy,++d.count;else{var d=this.map.viewPortDiv,e=document.createElement("div");e.id=this.map.id+"_GMap2Container";e.style.position="absolute";e.style.width="100%";e.style.height="100%";d.appendChild(e);try{a=new GMap2(e),b=e.lastChild,d.appendChild(b),b.style.zIndex=
"1100",b.style.right="",b.style.bottom="",b.className="olLayerGoogleCopyright",c=e.lastChild,d.appendChild(c),c.style.zIndex="1100",c.style.right="",c.style.bottom="",c.className="olLayerGooglePoweredBy gmnoprint"}catch(f){throw f;}OpenLayers.Layer.Google.cache[this.map.id]={mapObject:a,termsOfUse:b,poweredBy:c,count:1}}this.mapObject=a;this.termsOfUse=b;this.poweredBy=c;-1===OpenLayers.Util.indexOf(this.mapObject.getMapTypes(),this.type)&&this.mapObject.addMapType(this.type);"function"==typeof a.getDragObject?
this.dragObject=a.getDragObject():this.dragPanMapObject=null;!1===this.isBaseLayer&&this.setGMapVisibility("none"!==this.div.style.display)},onMapResize:function(){if(this.visibility&&this.mapObject.isLoaded())this.mapObject.checkResize();else{if(!this._resized)var a=this,b=GEvent.addListener(this.mapObject,"load",function(){GEvent.removeListener(b);delete a._resized;a.mapObject.checkResize();a.moveTo(a.map.getCenter(),a.map.getZoom())});this._resized=!0}},setGMapVisibility:function(a){var b=OpenLayers.Layer.Google.cache[this.map.id];
if(b){var c=this.mapObject.getContainer();!0===a?(this.mapObject.setMapType(this.type),c.style.display="",this.termsOfUse.style.left="",this.termsOfUse.style.display="",this.poweredBy.style.display="",b.displayed=this.id):(b.displayed===this.id&&delete b.displayed,b.displayed||(c.style.display="none",this.termsOfUse.style.display="none",this.termsOfUse.style.left="-9999px",this.poweredBy.style.display="none"))}},getMapContainer:function(){return this.mapObject.getContainer()},getMapObjectBoundsFromOLBounds:function(a){var b=
null;null!=a&&(b=this.sphericalMercator?this.inverseMercator(a.bottom,a.left):new OpenLayers.LonLat(a.bottom,a.left),a=this.sphericalMercator?this.inverseMercator(a.top,a.right):new OpenLayers.LonLat(a.top,a.right),b=new GLatLngBounds(new GLatLng(b.lat,b.lon),new GLatLng(a.lat,a.lon)));return b},setMapObjectCenter:function(a,b){this.mapObject.setCenter(a,b)},dragPanMapObject:function(a,b){this.dragObject.moveBy(new GSize(-a,b))},getMapObjectLonLatFromMapObjectPixel:function(a){return this.mapObject.fromContainerPixelToLatLng(a)},
getMapObjectPixelFromMapObjectLonLat:function(a){return this.mapObject.fromLatLngToContainerPixel(a)},getMapObjectZoomFromMapObjectBounds:function(a){return this.mapObject.getBoundsZoomLevel(a)},getMapObjectLonLatFromLonLat:function(a,b){var c;this.sphericalMercator?(c=this.inverseMercator(a,b),c=new GLatLng(c.lat,c.lon)):c=new GLatLng(b,a);return c},getMapObjectPixelFromXY:function(a,b){return new GPoint(a,b)}};OpenLayers.Format.XML=OpenLayers.Class(OpenLayers.Format,{namespaces:null,namespaceAlias:null,defaultPrefix:null,readers:{},writers:{},xmldom:null,initialize:function(a){window.ActiveXObject&&(this.xmldom=new ActiveXObject("Microsoft.XMLDOM"));OpenLayers.Format.prototype.initialize.apply(this,[a]);this.namespaces=OpenLayers.Util.extend({},this.namespaces);this.namespaceAlias={};for(var b in this.namespaces)this.namespaceAlias[this.namespaces[b]]=b},destroy:function(){this.xmldom=null;OpenLayers.Format.prototype.destroy.apply(this,
arguments)},setNamespace:function(a,b){this.namespaces[a]=b;this.namespaceAlias[b]=a},read:function(a){var b=a.indexOf("<");0<b&&(a=a.substring(b));b=OpenLayers.Util.Try(OpenLayers.Function.bind(function(){var b;b=window.ActiveXObject&&!this.xmldom?new ActiveXObject("Microsoft.XMLDOM"):this.xmldom;b.loadXML(a);return b},this),function(){return(new DOMParser).parseFromString(a,"text/xml")},function(){var b=new XMLHttpRequest;b.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(a),!1);b.overrideMimeType&&
b.overrideMimeType("text/xml");b.send(null);return b.responseXML});this.keepData&&(this.data=b);return b},write:function(a){if(this.xmldom)a=a.xml;else{var b=new XMLSerializer;if(1==a.nodeType){var c=document.implementation.createDocument("","",null);c.importNode&&(a=c.importNode(a,!0));c.appendChild(a);a=b.serializeToString(c)}else a=b.serializeToString(a)}return a},createElementNS:function(a,b){return this.xmldom?"string"==typeof a?this.xmldom.createNode(1,b,a):this.xmldom.createNode(1,b,""):document.createElementNS(a,
b)},createTextNode:function(a){"string"!==typeof a&&(a=""+a);return this.xmldom?this.xmldom.createTextNode(a):document.createTextNode(a)},getElementsByTagNameNS:function(a,b,c){var d=[];if(a.getElementsByTagNameNS)d=a.getElementsByTagNameNS(b,c);else for(var a=a.getElementsByTagName("*"),e,f,g=0,h=a.length;g<h;++g)if(e=a[g],f=e.prefix?e.prefix+":"+c:c,"*"==c||f==e.nodeName)("*"==b||b==e.namespaceURI)&&d.push(e);return d},getAttributeNodeNS:function(a,b,c){var d=null;if(a.getAttributeNodeNS)d=a.getAttributeNodeNS(b,
c);else for(var a=a.attributes,e,f,g=0,h=a.length;g<h;++g)if(e=a[g],e.namespaceURI==b&&(f=e.prefix?e.prefix+":"+c:c,f==e.nodeName)){d=e;break}return d},getAttributeNS:function(a,b,c){var d="";if(a.getAttributeNS)d=a.getAttributeNS(b,c)||"";else if(a=this.getAttributeNodeNS(a,b,c))d=a.nodeValue;return d},getChildValue:function(a,b){var c=b||"";if(a)for(var d=a.firstChild;d;d=d.nextSibling)switch(d.nodeType){case 3:case 4:c+=d.nodeValue}return c},isSimpleContent:function(a){for(var b=!0,a=a.firstChild;a;a=
a.nextSibling)if(1===a.nodeType){b=!1;break}return b},contentType:function(a){for(var b=!1,c=!1,d=OpenLayers.Format.XML.CONTENT_TYPE.EMPTY,a=a.firstChild;a;a=a.nextSibling){switch(a.nodeType){case 1:c=!0;break;case 8:break;default:b=!0}if(c&&b)break}if(c&&b)d=OpenLayers.Format.XML.CONTENT_TYPE.MIXED;else{if(c)return OpenLayers.Format.XML.CONTENT_TYPE.COMPLEX;if(b)return OpenLayers.Format.XML.CONTENT_TYPE.SIMPLE}return d},hasAttributeNS:function(a,b,c){var d=!1;return d=a.hasAttributeNS?a.hasAttributeNS(b,
c):!!this.getAttributeNodeNS(a,b,c)},setAttributeNS:function(a,b,c,d){if(a.setAttributeNS)a.setAttributeNS(b,c,d);else if(this.xmldom)b?(b=a.ownerDocument.createNode(2,c,b),b.nodeValue=d,a.setAttributeNode(b)):a.setAttribute(c,d);else throw"setAttributeNS not implemented";},createElementNSPlus:function(a,b){var b=b||{},c=b.uri||this.namespaces[b.prefix];c||(c=a.indexOf(":"),c=this.namespaces[a.substring(0,c)]);c||(c=this.namespaces[this.defaultPrefix]);c=this.createElementNS(c,a);b.attributes&&this.setAttributes(c,
b.attributes);var d=b.value;null!=d&&c.appendChild(this.createTextNode(d));return c},setAttributes:function(a,b){var c,d,e;for(e in b)null!=b[e]&&b[e].toString&&(c=b[e].toString(),d=this.namespaces[e.substring(0,e.indexOf(":"))]||null,this.setAttributeNS(a,d,e,c))},readNode:function(a,b){b||(b={});var c=this.readers[a.namespaceURI?this.namespaceAlias[a.namespaceURI]:this.defaultPrefix];if(c){var d=a.localName||a.nodeName.split(":").pop();(c=c[d]||c["*"])&&c.apply(this,[a,b])}return b},readChildNodes:function(a,
b){b||(b={});for(var c=a.childNodes,d,e=0,f=c.length;e<f;++e)d=c[e],1==d.nodeType&&this.readNode(d,b);return b},writeNode:function(a,b,c){var d,e=a.indexOf(":");0<e?(d=a.substring(0,e),a=a.substring(e+1)):d=c?this.namespaceAlias[c.namespaceURI]:this.defaultPrefix;b=this.writers[d][a].apply(this,[b]);c&&c.appendChild(b);return b},getChildEl:function(a,b,c){return a&&this.getThisOrNextEl(a.firstChild,b,c)},getNextEl:function(a,b,c){return a&&this.getThisOrNextEl(a.nextSibling,b,c)},getThisOrNextEl:function(a,
b,c){a:for(;a;a=a.nextSibling)switch(a.nodeType){case 1:if((!b||b===(a.localName||a.nodeName.split(":").pop()))&&(!c||c===a.namespaceURI))break a;a=null;break a;case 3:if(/^\s*$/.test(a.nodeValue))break;case 4:case 6:case 12:case 10:case 11:a=null;break a}return a||null},lookupNamespaceURI:function(a,b){var c=null;if(a)if(a.lookupNamespaceURI)c=a.lookupNamespaceURI(b);else a:switch(a.nodeType){case 1:if(null!==a.namespaceURI&&a.prefix===b){c=a.namespaceURI;break a}if(c=a.attributes.length)for(var d,
e=0;e<c;++e)if(d=a.attributes[e],"xmlns"===d.prefix&&d.name==="xmlns:"+b){c=d.value||null;break a}else if("xmlns"===d.name&&null===b){c=d.value||null;break a}c=this.lookupNamespaceURI(a.parentNode,b);break a;case 2:c=this.lookupNamespaceURI(a.ownerElement,b);break a;case 9:c=this.lookupNamespaceURI(a.documentElement,b);break a;case 6:case 12:case 10:case 11:break a;default:c=this.lookupNamespaceURI(a.parentNode,b)}return c},getXMLDoc:function(){!OpenLayers.Format.XML.document&&!this.xmldom&&(document.implementation&&
document.implementation.createDocument?OpenLayers.Format.XML.document=document.implementation.createDocument("","",null):!this.xmldom&&window.ActiveXObject&&(this.xmldom=new ActiveXObject("Microsoft.XMLDOM")));return OpenLayers.Format.XML.document||this.xmldom},CLASS_NAME:"OpenLayers.Format.XML"});OpenLayers.Format.XML.CONTENT_TYPE={EMPTY:0,SIMPLE:1,COMPLEX:2,MIXED:3};OpenLayers.Format.XML.lookupNamespaceURI=OpenLayers.Function.bind(OpenLayers.Format.XML.prototype.lookupNamespaceURI,OpenLayers.Format.XML.prototype);
OpenLayers.Format.XML.document=null;OpenLayers.Format.WFST=function(a){var a=OpenLayers.Util.applyDefaults(a,OpenLayers.Format.WFST.DEFAULTS),b=OpenLayers.Format.WFST["v"+a.version.replace(/\./g,"_")];if(!b)throw"Unsupported WFST version: "+a.version;return new b(a)};OpenLayers.Format.WFST.DEFAULTS={version:"1.0.0"};OpenLayers.Format.WFST.v1=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance",wfs:"http://www.opengis.net/wfs",gml:"http://www.opengis.net/gml",ogc:"http://www.opengis.net/ogc",ows:"http://www.opengis.net/ows"},defaultPrefix:"wfs",version:null,schemaLocations:null,srsName:null,extractAttributes:!0,xy:!0,stateName:null,initialize:function(a){this.stateName={};this.stateName[OpenLayers.State.INSERT]="wfs:Insert";this.stateName[OpenLayers.State.UPDATE]=
"wfs:Update";this.stateName[OpenLayers.State.DELETE]="wfs:Delete";OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},getSrsName:function(a,b){var c=b&&b.srsName;c||(c=a&&a.layer?a.layer.projection.getCode():this.srsName);return c},read:function(a,b){b=b||{};OpenLayers.Util.applyDefaults(b,{output:"features"});"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var c={};a&&this.readNode(a,c,!0);c.features&&"features"===b.output&&
(c=c.features);return c},readers:{wfs:{FeatureCollection:function(a,b){b.features=[];this.readChildNodes(a,b)}}},write:function(a,b){var c=this.writeNode("wfs:Transaction",{features:a,options:b}),d=this.schemaLocationAttr();d&&this.setAttributeNS(c,this.namespaces.xsi,"xsi:schemaLocation",d);return OpenLayers.Format.XML.prototype.write.apply(this,[c])},writers:{wfs:{GetFeature:function(a){var b=this.createElementNSPlus("wfs:GetFeature",{attributes:{service:"WFS",version:this.version,handle:a&&a.handle,
outputFormat:a&&a.outputFormat,maxFeatures:a&&a.maxFeatures,"xsi:schemaLocation":this.schemaLocationAttr(a)}});if("string"==typeof this.featureType)this.writeNode("Query",a,b);else for(var c=0,d=this.featureType.length;c<d;c++)a.featureType=this.featureType[c],this.writeNode("Query",a,b);return b},Transaction:function(a){var a=a||{},b=a.options||{},c=this.createElementNSPlus("wfs:Transaction",{attributes:{service:"WFS",version:this.version,handle:b.handle}}),d,e=a.features;if(e){!0===b.multi&&OpenLayers.Util.extend(this.geometryTypes,
{"OpenLayers.Geometry.Point":"MultiPoint","OpenLayers.Geometry.LineString":!0===this.multiCurve?"MultiCurve":"MultiLineString","OpenLayers.Geometry.Polygon":!0===this.multiSurface?"MultiSurface":"MultiPolygon"});var f,g,a=0;for(d=e.length;a<d;++a)g=e[a],(f=this.stateName[g.state])&&this.writeNode(f,{feature:g,options:b},c);!0===b.multi&&this.setGeometryTypes()}if(b.nativeElements){a=0;for(d=b.nativeElements.length;a<d;++a)this.writeNode("wfs:Native",b.nativeElements[a],c)}return c},Native:function(a){return this.createElementNSPlus("wfs:Native",
{attributes:{vendorId:a.vendorId,safeToIgnore:a.safeToIgnore},value:a.value})},Insert:function(a){var b=a.feature,a=a.options,a=this.createElementNSPlus("wfs:Insert",{attributes:{handle:a&&a.handle}});this.srsName=this.getSrsName(b);this.writeNode("feature:_typeName",b,a);return a},Update:function(a){var b=a.feature,a=a.options,a=this.createElementNSPlus("wfs:Update",{attributes:{handle:a&&a.handle,typeName:(this.featureNS?this.featurePrefix+":":"")+this.featureType}});this.featureNS&&a.setAttribute("xmlns:"+
this.featurePrefix,this.featureNS);var c=b.modified;if(null!==this.geometryName&&(!c||void 0!==c.geometry))this.srsName=this.getSrsName(b),this.writeNode("Property",{name:this.geometryName,value:b.geometry},a);for(var d in b.attributes)void 0!==b.attributes[d]&&(!c||!c.attributes||c.attributes&&void 0!==c.attributes[d])&&this.writeNode("Property",{name:d,value:b.attributes[d]},a);this.writeNode("ogc:Filter",new OpenLayers.Filter.FeatureId({fids:[b.fid]}),a);return a},Property:function(a){var b=this.createElementNSPlus("wfs:Property");
this.writeNode("Name",a.name,b);null!==a.value&&this.writeNode("Value",a.value,b);return b},Name:function(a){return this.createElementNSPlus("wfs:Name",{value:a})},Value:function(a){var b;a instanceof OpenLayers.Geometry?(b=this.createElementNSPlus("wfs:Value"),a=this.writeNode("feature:_geometry",a).firstChild,b.appendChild(a)):b=this.createElementNSPlus("wfs:Value",{value:a});return b},Delete:function(a){var b=a.feature,a=a.options,a=this.createElementNSPlus("wfs:Delete",{attributes:{handle:a&&
a.handle,typeName:(this.featureNS?this.featurePrefix+":":"")+this.featureType}});this.featureNS&&a.setAttribute("xmlns:"+this.featurePrefix,this.featureNS);this.writeNode("ogc:Filter",new OpenLayers.Filter.FeatureId({fids:[b.fid]}),a);return a}}},schemaLocationAttr:function(a){var a=OpenLayers.Util.extend({featurePrefix:this.featurePrefix,schema:this.schema},a),b=OpenLayers.Util.extend({},this.schemaLocations);a.schema&&(b[a.featurePrefix]=a.schema);var a=[],c,d;for(d in b)(c=this.namespaces[d])&&
a.push(c+" "+b[d]);return a.join(" ")||void 0},setFilterProperty:function(a){if(a.filters)for(var b=0,c=a.filters.length;b<c;++b)OpenLayers.Format.WFST.v1.prototype.setFilterProperty.call(this,a.filters[b]);else a instanceof OpenLayers.Filter.Spatial&&!a.property&&(a.property=this.geometryName)},CLASS_NAME:"OpenLayers.Format.WFST.v1"});OpenLayers.Format.OGCExceptionReport=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ogc:"http://www.opengis.net/ogc"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},defaultPrefix:"ogc",read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var b={exceptionReport:null};a.documentElement&&(this.readChildNodes(a,b),null===b.exceptionReport&&(b=(new OpenLayers.Format.OWSCommon).read(a)));return b},readers:{ogc:{ServiceExceptionReport:function(a,
b){b.exceptionReport={exceptions:[]};this.readChildNodes(a,b.exceptionReport)},ServiceException:function(a,b){var c={code:a.getAttribute("code"),locator:a.getAttribute("locator"),text:this.getChildValue(a)};b.exceptions.push(c)}}},CLASS_NAME:"OpenLayers.Format.OGCExceptionReport"});OpenLayers.Format.XML.VersionedOGC=OpenLayers.Class(OpenLayers.Format.XML,{defaultVersion:null,version:null,profile:null,errorProperty:null,name:null,stringifyOutput:!1,parser:null,initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a]);a=this.CLASS_NAME;this.name=a.substring(a.lastIndexOf(".")+1)},getVersion:function(a,b){var c;a?(c=this.version,c||(c=a.getAttribute("version"),c||(c=this.defaultVersion))):c=b&&b.version||this.version||this.defaultVersion;return c},getParser:function(a){var a=
a||this.defaultVersion,b=this.profile?"_"+this.profile:"";if(!this.parser||this.parser.VERSION!=a){var c=OpenLayers.Format[this.name]["v"+a.replace(/\./g,"_")+b];if(!c)throw"Can't find a "+this.name+" parser for version "+a+b;this.parser=new c(this.options)}return this.parser},write:function(a,b){this.parser=this.getParser(this.getVersion(null,b));var c=this.parser.write(a,b);return!1===this.stringifyOutput?c:OpenLayers.Format.XML.prototype.write.apply(this,[c])},read:function(a,b){"string"==typeof a&&
(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var c=this.getVersion(a.documentElement);this.parser=this.getParser(c);var d=this.parser.read(a,b);if(null!==this.errorProperty&&void 0===d[this.errorProperty]){var e=new OpenLayers.Format.OGCExceptionReport;d.error=e.read(a)}d.version=c;return d},CLASS_NAME:"OpenLayers.Format.XML.VersionedOGC"});OpenLayers.Feature=OpenLayers.Class({layer:null,id:null,lonlat:null,data:null,marker:null,popupClass:null,popup:null,initialize:function(a,b,c){this.layer=a;this.lonlat=b;this.data=null!=c?c:{};this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_")},destroy:function(){null!=this.layer&&null!=this.layer.map&&null!=this.popup&&this.layer.map.removePopup(this.popup);null!=this.layer&&null!=this.marker&&this.layer.removeMarker(this.marker);this.data=this.lonlat=this.id=this.layer=null;null!=this.marker&&
(this.destroyMarker(this.marker),this.marker=null);null!=this.popup&&(this.destroyPopup(this.popup),this.popup=null)},onScreen:function(){var a=!1;null!=this.layer&&null!=this.layer.map&&(a=this.layer.map.getExtent().containsLonLat(this.lonlat));return a},createMarker:function(){null!=this.lonlat&&(this.marker=new OpenLayers.Marker(this.lonlat,this.data.icon));return this.marker},destroyMarker:function(){this.marker.destroy()},createPopup:function(a){null!=this.lonlat&&(this.popup||(this.popup=new (this.popupClass?
this.popupClass:OpenLayers.Popup.Anchored)(this.id+"_popup",this.lonlat,this.data.popupSize,this.data.popupContentHTML,this.marker?this.marker.icon:null,a)),null!=this.data.overflow&&(this.popup.contentDiv.style.overflow=this.data.overflow),this.popup.feature=this);return this.popup},destroyPopup:function(){this.popup&&(this.popup.feature=null,this.popup.destroy(),this.popup=null)},CLASS_NAME:"OpenLayers.Feature"});OpenLayers.State={UNKNOWN:"Unknown",INSERT:"Insert",UPDATE:"Update",DELETE:"Delete"};
OpenLayers.Feature.Vector=OpenLayers.Class(OpenLayers.Feature,{fid:null,geometry:null,attributes:null,bounds:null,state:null,style:null,url:null,renderIntent:"default",modified:null,initialize:function(a,b,c){OpenLayers.Feature.prototype.initialize.apply(this,[null,null,b]);this.lonlat=null;this.geometry=a?a:null;this.state=null;this.attributes={};b&&(this.attributes=OpenLayers.Util.extend(this.attributes,b));this.style=c?c:null},destroy:function(){this.layer&&(this.layer.removeFeatures(this),this.layer=
null);this.modified=this.geometry=null;OpenLayers.Feature.prototype.destroy.apply(this,arguments)},clone:function(){return new OpenLayers.Feature.Vector(this.geometry?this.geometry.clone():null,this.attributes,this.style)},onScreen:function(a){var b=!1;this.layer&&this.layer.map&&(b=this.layer.map.getExtent(),a?(a=this.geometry.getBounds(),b=b.intersectsBounds(a)):b=b.toGeometry().intersects(this.geometry));return b},getVisibility:function(){return!(this.style&&"none"==this.style.display||!this.layer||
this.layer&&this.layer.styleMap&&"none"==this.layer.styleMap.createSymbolizer(this,this.renderIntent).display||this.layer&&!this.layer.getVisibility())},createMarker:function(){return null},destroyMarker:function(){},createPopup:function(){return null},atPoint:function(a,b,c){var d=!1;this.geometry&&(d=this.geometry.atPoint(a,b,c));return d},destroyPopup:function(){},move:function(a){if(this.layer&&this.geometry.move){var a="OpenLayers.LonLat"==a.CLASS_NAME?this.layer.getViewPortPxFromLonLat(a):a,
b=this.layer.getViewPortPxFromLonLat(this.geometry.getBounds().getCenterLonLat()),c=this.layer.map.getResolution();this.geometry.move(c*(a.x-b.x),c*(b.y-a.y));this.layer.drawFeature(this);return b}},toState:function(a){if(a==OpenLayers.State.UPDATE)switch(this.state){case OpenLayers.State.UNKNOWN:case OpenLayers.State.DELETE:this.state=a}else if(a==OpenLayers.State.INSERT)switch(this.state){case OpenLayers.State.UNKNOWN:break;default:this.state=a}else if(a==OpenLayers.State.DELETE)switch(this.state){case OpenLayers.State.UNKNOWN:case OpenLayers.State.UPDATE:this.state=
a}else a==OpenLayers.State.UNKNOWN&&(this.state=a)},CLASS_NAME:"OpenLayers.Feature.Vector"});
OpenLayers.Feature.Vector.style={"default":{fillColor:"#ee9900",fillOpacity:0.4,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#ee9900",strokeOpacity:1,strokeWidth:1,strokeLinecap:"round",strokeDashstyle:"solid",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted",cursor:"inherit",fontColor:"#000000",labelAlign:"cm",labelOutlineColor:"white",labelOutlineWidth:3},select:{fillColor:"blue",fillOpacity:0.4,
hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"blue",strokeOpacity:1,strokeWidth:2,strokeLinecap:"round",strokeDashstyle:"solid",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted",cursor:"pointer",fontColor:"#000000",labelAlign:"cm",labelOutlineColor:"white",labelOutlineWidth:3},temporary:{fillColor:"#66cccc",fillOpacity:0.2,hoverFillColor:"white",hoverFillOpacity:0.8,strokeColor:"#66cccc",strokeOpacity:1,
strokeLinecap:"round",strokeWidth:2,strokeDashstyle:"solid",hoverStrokeColor:"red",hoverStrokeOpacity:1,hoverStrokeWidth:0.2,pointRadius:6,hoverPointRadius:1,hoverPointUnit:"%",pointerEvents:"visiblePainted",cursor:"inherit",fontColor:"#000000",labelAlign:"cm",labelOutlineColor:"white",labelOutlineWidth:3},"delete":{display:"none"}};OpenLayers.Style=OpenLayers.Class({id:null,name:null,title:null,description:null,layerName:null,isDefault:!1,rules:null,context:null,defaultStyle:null,defaultsPerSymbolizer:!1,propertyStyles:null,initialize:function(a,b){OpenLayers.Util.extend(this,b);this.rules=[];b&&b.rules&&this.addRules(b.rules);this.setDefaultStyle(a||OpenLayers.Feature.Vector.style["default"]);this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_")},destroy:function(){for(var a=0,b=this.rules.length;a<b;a++)this.rules[a].destroy(),
this.rules[a]=null;this.defaultStyle=this.rules=null},createSymbolizer:function(a){for(var b=this.defaultsPerSymbolizer?{}:this.createLiterals(OpenLayers.Util.extend({},this.defaultStyle),a),c=this.rules,d,e=[],f=!1,g=0,h=c.length;g<h;g++)d=c[g],d.evaluate(a)&&(d instanceof OpenLayers.Rule&&d.elseFilter?e.push(d):(f=!0,this.applySymbolizer(d,b,a)));if(!1==f&&0<e.length){f=!0;g=0;for(h=e.length;g<h;g++)this.applySymbolizer(e[g],b,a)}0<c.length&&!1==f&&(b.display="none");null!=b.label&&"string"!==typeof b.label&&
(b.label=""+b.label);return b},applySymbolizer:function(a,b,c){var d=c.geometry?this.getSymbolizerPrefix(c.geometry):OpenLayers.Style.SYMBOLIZER_PREFIXES[0],a=a.symbolizer[d]||a.symbolizer;!0===this.defaultsPerSymbolizer&&(d=this.defaultStyle,OpenLayers.Util.applyDefaults(a,{pointRadius:d.pointRadius}),(!0===a.stroke||!0===a.graphic)&&OpenLayers.Util.applyDefaults(a,{strokeWidth:d.strokeWidth,strokeColor:d.strokeColor,strokeOpacity:d.strokeOpacity,strokeDashstyle:d.strokeDashstyle,strokeLinecap:d.strokeLinecap}),
(!0===a.fill||!0===a.graphic)&&OpenLayers.Util.applyDefaults(a,{fillColor:d.fillColor,fillOpacity:d.fillOpacity}),!0===a.graphic&&OpenLayers.Util.applyDefaults(a,{pointRadius:this.defaultStyle.pointRadius,externalGraphic:this.defaultStyle.externalGraphic,graphicName:this.defaultStyle.graphicName,graphicOpacity:this.defaultStyle.graphicOpacity,graphicWidth:this.defaultStyle.graphicWidth,graphicHeight:this.defaultStyle.graphicHeight,graphicXOffset:this.defaultStyle.graphicXOffset,graphicYOffset:this.defaultStyle.graphicYOffset}));
return this.createLiterals(OpenLayers.Util.extend(b,a),c)},createLiterals:function(a,b){var c=OpenLayers.Util.extend({},b.attributes||b.data);OpenLayers.Util.extend(c,this.context);for(var d in this.propertyStyles)a[d]=OpenLayers.Style.createLiteral(a[d],c,b,d);return a},findPropertyStyles:function(){var a={};this.addPropertyStyles(a,this.defaultStyle);for(var b=this.rules,c,d,e=0,f=b.length;e<f;e++){c=b[e].symbolizer;for(var g in c)if(d=c[g],"object"==typeof d)this.addPropertyStyles(a,d);else{this.addPropertyStyles(a,
c);break}}return a},addPropertyStyles:function(a,b){var c,d;for(d in b)c=b[d],"string"==typeof c&&c.match(/\$\{\w+\}/)&&(a[d]=!0);return a},addRules:function(a){Array.prototype.push.apply(this.rules,a);this.propertyStyles=this.findPropertyStyles()},setDefaultStyle:function(a){this.defaultStyle=a;this.propertyStyles=this.findPropertyStyles()},getSymbolizerPrefix:function(a){for(var b=OpenLayers.Style.SYMBOLIZER_PREFIXES,c=0,d=b.length;c<d;c++)if(-1!=a.CLASS_NAME.indexOf(b[c]))return b[c]},clone:function(){var a=
OpenLayers.Util.extend({},this);if(this.rules){a.rules=[];for(var b=0,c=this.rules.length;b<c;++b)a.rules.push(this.rules[b].clone())}a.context=this.context&&OpenLayers.Util.extend({},this.context);b=OpenLayers.Util.extend({},this.defaultStyle);return new OpenLayers.Style(b,a)},CLASS_NAME:"OpenLayers.Style"});OpenLayers.Style.createLiteral=function(a,b,c,d){"string"==typeof a&&-1!=a.indexOf("${")&&(a=OpenLayers.String.format(a,b,[c,d]),a=isNaN(a)||!a?a:parseFloat(a));return a};
OpenLayers.Style.SYMBOLIZER_PREFIXES=["Point","Line","Polygon","Text","Raster"];OpenLayers.Filter=OpenLayers.Class({initialize:function(a){OpenLayers.Util.extend(this,a)},destroy:function(){},evaluate:function(){return!0},clone:function(){return null},toString:function(){return OpenLayers.Format&&OpenLayers.Format.CQL?OpenLayers.Format.CQL.prototype.write(this):Object.prototype.toString.call(this)},CLASS_NAME:"OpenLayers.Filter"});OpenLayers.Filter.FeatureId=OpenLayers.Class(OpenLayers.Filter,{fids:null,type:"FID",initialize:function(a){this.fids=[];OpenLayers.Filter.prototype.initialize.apply(this,[a])},evaluate:function(a){for(var b=0,c=this.fids.length;b<c;b++)if((a.fid||a.id)==this.fids[b])return!0;return!1},clone:function(){var a=new OpenLayers.Filter.FeatureId;OpenLayers.Util.extend(a,this);a.fids=this.fids.slice();return a},CLASS_NAME:"OpenLayers.Filter.FeatureId"});OpenLayers.Filter.Logical=OpenLayers.Class(OpenLayers.Filter,{filters:null,type:null,initialize:function(a){this.filters=[];OpenLayers.Filter.prototype.initialize.apply(this,[a])},destroy:function(){this.filters=null;OpenLayers.Filter.prototype.destroy.apply(this)},evaluate:function(a){var b,c;switch(this.type){case OpenLayers.Filter.Logical.AND:b=0;for(c=this.filters.length;b<c;b++)if(!1==this.filters[b].evaluate(a))return!1;return!0;case OpenLayers.Filter.Logical.OR:b=0;for(c=this.filters.length;b<
c;b++)if(!0==this.filters[b].evaluate(a))return!0;return!1;case OpenLayers.Filter.Logical.NOT:return!this.filters[0].evaluate(a)}},clone:function(){for(var a=[],b=0,c=this.filters.length;b<c;++b)a.push(this.filters[b].clone());return new OpenLayers.Filter.Logical({type:this.type,filters:a})},CLASS_NAME:"OpenLayers.Filter.Logical"});OpenLayers.Filter.Logical.AND="&&";OpenLayers.Filter.Logical.OR="||";OpenLayers.Filter.Logical.NOT="!";OpenLayers.Filter.Comparison=OpenLayers.Class(OpenLayers.Filter,{type:null,property:null,value:null,matchCase:!0,lowerBoundary:null,upperBoundary:null,initialize:function(a){OpenLayers.Filter.prototype.initialize.apply(this,[a]);this.type===OpenLayers.Filter.Comparison.LIKE&&void 0===a.matchCase&&(this.matchCase=null)},evaluate:function(a){a instanceof OpenLayers.Feature.Vector&&(a=a.attributes);var b=!1,a=a[this.property];switch(this.type){case OpenLayers.Filter.Comparison.EQUAL_TO:b=this.value;
b=!this.matchCase&&"string"==typeof a&&"string"==typeof b?a.toUpperCase()==b.toUpperCase():a==b;break;case OpenLayers.Filter.Comparison.NOT_EQUAL_TO:b=this.value;b=!this.matchCase&&"string"==typeof a&&"string"==typeof b?a.toUpperCase()!=b.toUpperCase():a!=b;break;case OpenLayers.Filter.Comparison.LESS_THAN:b=a<this.value;break;case OpenLayers.Filter.Comparison.GREATER_THAN:b=a>this.value;break;case OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO:b=a<=this.value;break;case OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO:b=
a>=this.value;break;case OpenLayers.Filter.Comparison.BETWEEN:b=a>=this.lowerBoundary&&a<=this.upperBoundary;break;case OpenLayers.Filter.Comparison.LIKE:b=RegExp(this.value,"gi").test(a)}return b},value2regex:function(a,b,c){if("."==a)throw Error("'.' is an unsupported wildCard character for OpenLayers.Filter.Comparison");a=a?a:"*";b=b?b:".";this.value=this.value.replace(RegExp("\\"+(c?c:"!")+"(.|$)","g"),"\\$1");this.value=this.value.replace(RegExp("\\"+b,"g"),".");this.value=this.value.replace(RegExp("\\"+
a,"g"),".*");this.value=this.value.replace(RegExp("\\\\.\\*","g"),"\\"+a);return this.value=this.value.replace(RegExp("\\\\\\.","g"),"\\"+b)},regex2value:function(){var a=this.value,a=a.replace(/!/g,"!!"),a=a.replace(/(\\)?\\\./g,function(a,c){return c?a:"!."}),a=a.replace(/(\\)?\\\*/g,function(a,c){return c?a:"!*"}),a=a.replace(/\\\\/g,"\\");return a=a.replace(/\.\*/g,"*")},clone:function(){return OpenLayers.Util.extend(new OpenLayers.Filter.Comparison,this)},CLASS_NAME:"OpenLayers.Filter.Comparison"});
OpenLayers.Filter.Comparison.EQUAL_TO="==";OpenLayers.Filter.Comparison.NOT_EQUAL_TO="!=";OpenLayers.Filter.Comparison.LESS_THAN="<";OpenLayers.Filter.Comparison.GREATER_THAN=">";OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO="<=";OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO=">=";OpenLayers.Filter.Comparison.BETWEEN="..";OpenLayers.Filter.Comparison.LIKE="~";OpenLayers.Format.Filter=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.0.0",CLASS_NAME:"OpenLayers.Format.Filter"});OpenLayers.Filter.Function=OpenLayers.Class(OpenLayers.Filter,{name:null,params:null,CLASS_NAME:"OpenLayers.Filter.Function"});OpenLayers.Format.Filter.v1=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ogc:"http://www.opengis.net/ogc",gml:"http://www.opengis.net/gml",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},defaultPrefix:"ogc",schemaLocation:null,initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){var b={};this.readers.ogc.Filter.apply(this,[a,b]);return b.filter},readers:{ogc:{_expression:function(a){for(var b="",c=a.firstChild;c;c=
c.nextSibling)switch(c.nodeType){case 1:a=this.readNode(c);a.property?b+="${"+a.property+"}":void 0!==a.value&&(b+=a.value);break;case 3:case 4:b+=c.nodeValue}return b},Filter:function(a,b){var c={fids:[],filters:[]};this.readChildNodes(a,c);0<c.fids.length?b.filter=new OpenLayers.Filter.FeatureId({fids:c.fids}):0<c.filters.length&&(b.filter=c.filters[0])},FeatureId:function(a,b){var c=a.getAttribute("fid");c&&b.fids.push(c)},And:function(a,b){var c=new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.AND});
this.readChildNodes(a,c);b.filters.push(c)},Or:function(a,b){var c=new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.OR});this.readChildNodes(a,c);b.filters.push(c)},Not:function(a,b){var c=new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.NOT});this.readChildNodes(a,c);b.filters.push(c)},PropertyIsLessThan:function(a,b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LESS_THAN});this.readChildNodes(a,c);b.filters.push(c)},PropertyIsGreaterThan:function(a,
b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.GREATER_THAN});this.readChildNodes(a,c);b.filters.push(c)},PropertyIsLessThanOrEqualTo:function(a,b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO});this.readChildNodes(a,c);b.filters.push(c)},PropertyIsGreaterThanOrEqualTo:function(a,b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO});this.readChildNodes(a,c);b.filters.push(c)},
PropertyIsBetween:function(a,b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.BETWEEN});this.readChildNodes(a,c);b.filters.push(c)},Literal:function(a,b){b.value=OpenLayers.String.numericIf(this.getChildValue(a))},PropertyName:function(a,b){b.property=this.getChildValue(a)},LowerBoundary:function(a,b){b.lowerBoundary=OpenLayers.String.numericIf(this.readers.ogc._expression.call(this,a))},UpperBoundary:function(a,b){b.upperBoundary=OpenLayers.String.numericIf(this.readers.ogc._expression.call(this,
a))},Intersects:function(a,b){this.readSpatial(a,b,OpenLayers.Filter.Spatial.INTERSECTS)},Within:function(a,b){this.readSpatial(a,b,OpenLayers.Filter.Spatial.WITHIN)},Contains:function(a,b){this.readSpatial(a,b,OpenLayers.Filter.Spatial.CONTAINS)},DWithin:function(a,b){this.readSpatial(a,b,OpenLayers.Filter.Spatial.DWITHIN)},Distance:function(a,b){b.distance=parseInt(this.getChildValue(a));b.distanceUnits=a.getAttribute("units")},Function:function(){}}},readSpatial:function(a,b,c){c=new OpenLayers.Filter.Spatial({type:c});
this.readChildNodes(a,c);c.value=c.components[0];delete c.components;b.filters.push(c)},writeOgcExpression:function(a,b){if(a instanceof OpenLayers.Filter.Function){var c=this.writeNode("Function",a,b);b.appendChild(c)}else this.writeNode("Literal",a,b);return b},write:function(a){return this.writers.ogc.Filter.apply(this,[a])},writeFeatureIdNodes:function(a,b){for(var c=0,d=a.fids.length;c<d;++c)this.writeNode("FeatureId",a.fids[c],b)},writers:{ogc:{Filter:function(a){var b=this.createElementNSPlus("ogc:Filter");
"FID"===a.type?OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this,a,b):this.writeNode(this.getFilterType(a),a,b);return b},FeatureId:function(a){return this.createElementNSPlus("ogc:FeatureId",{attributes:{fid:a}})},And:function(a){for(var b=this.createElementNSPlus("ogc:And"),c,d=0,e=a.filters.length;d<e;++d)c=a.filters[d],"FID"===c.type?OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this,c,b):this.writeNode(this.getFilterType(c),c,b);return b},Or:function(a){for(var b=
this.createElementNSPlus("ogc:Or"),c,d=0,e=a.filters.length;d<e;++d)c=a.filters[d],"FID"===c.type?OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this,c,b):this.writeNode(this.getFilterType(c),c,b);return b},Not:function(a){var b=this.createElementNSPlus("ogc:Not"),a=a.filters[0];"FID"===a.type?OpenLayers.Format.Filter.v1.prototype.writeFeatureIdNodes.call(this,a,b):this.writeNode(this.getFilterType(a),a,b);return b},PropertyIsLessThan:function(a){var b=this.createElementNSPlus("ogc:PropertyIsLessThan");
this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsGreaterThan:function(a){var b=this.createElementNSPlus("ogc:PropertyIsGreaterThan");this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsLessThanOrEqualTo:function(a){var b=this.createElementNSPlus("ogc:PropertyIsLessThanOrEqualTo");this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsGreaterThanOrEqualTo:function(a){var b=this.createElementNSPlus("ogc:PropertyIsGreaterThanOrEqualTo");
this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsBetween:function(a){var b=this.createElementNSPlus("ogc:PropertyIsBetween");this.writeNode("PropertyName",a,b);this.writeNode("LowerBoundary",a,b);this.writeNode("UpperBoundary",a,b);return b},PropertyName:function(a){return this.createElementNSPlus("ogc:PropertyName",{value:a.property})},Literal:function(a){return this.createElementNSPlus("ogc:Literal",{value:a})},LowerBoundary:function(a){var b=this.createElementNSPlus("ogc:LowerBoundary");
this.writeOgcExpression(a.lowerBoundary,b);return b},UpperBoundary:function(a){var b=this.createElementNSPlus("ogc:UpperBoundary");this.writeNode("Literal",a.upperBoundary,b);return b},INTERSECTS:function(a){return this.writeSpatial(a,"Intersects")},WITHIN:function(a){return this.writeSpatial(a,"Within")},CONTAINS:function(a){return this.writeSpatial(a,"Contains")},DWITHIN:function(a){var b=this.writeSpatial(a,"DWithin");this.writeNode("Distance",a,b);return b},Distance:function(a){return this.createElementNSPlus("ogc:Distance",
{attributes:{units:a.distanceUnits},value:a.distance})},Function:function(a){for(var b=this.createElementNSPlus("ogc:Function",{attributes:{name:a.name}}),a=a.params,c=0,d=a.length;c<d;c++)this.writeOgcExpression(a[c],b);return b}}},getFilterType:function(a){var b=this.filterMap[a.type];if(!b)throw"Filter writing not supported for rule type: "+a.type;return b},filterMap:{"&&":"And","||":"Or","!":"Not","==":"PropertyIsEqualTo","!=":"PropertyIsNotEqualTo","<":"PropertyIsLessThan",">":"PropertyIsGreaterThan",
"<=":"PropertyIsLessThanOrEqualTo",">=":"PropertyIsGreaterThanOrEqualTo","..":"PropertyIsBetween","~":"PropertyIsLike",BBOX:"BBOX",DWITHIN:"DWITHIN",WITHIN:"WITHIN",CONTAINS:"CONTAINS",INTERSECTS:"INTERSECTS",FID:"FeatureId"},CLASS_NAME:"OpenLayers.Format.Filter.v1"});OpenLayers.Geometry=OpenLayers.Class({id:null,parent:null,bounds:null,initialize:function(){this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_")},destroy:function(){this.bounds=this.id=null},clone:function(){return new OpenLayers.Geometry},setBounds:function(a){a&&(this.bounds=a.clone())},clearBounds:function(){this.bounds=null;this.parent&&this.parent.clearBounds()},extendBounds:function(a){this.getBounds()?this.bounds.extend(a):this.setBounds(a)},getBounds:function(){null==this.bounds&&this.calculateBounds();
return this.bounds},calculateBounds:function(){},distanceTo:function(){},getVertices:function(){},atPoint:function(a,b,c){var d=!1;null!=this.getBounds()&&null!=a&&(b=null!=b?b:0,c=null!=c?c:0,d=(new OpenLayers.Bounds(this.bounds.left-b,this.bounds.bottom-c,this.bounds.right+b,this.bounds.top+c)).containsLonLat(a));return d},getLength:function(){return 0},getArea:function(){return 0},getCentroid:function(){return null},toString:function(){return OpenLayers.Format&&OpenLayers.Format.WKT?OpenLayers.Format.WKT.prototype.write(new OpenLayers.Feature.Vector(this)):
Object.prototype.toString.call(this)},CLASS_NAME:"OpenLayers.Geometry"});OpenLayers.Geometry.fromWKT=function(a){var b;if(OpenLayers.Format&&OpenLayers.Format.WKT){var c=OpenLayers.Geometry.fromWKT.format;c||(c=new OpenLayers.Format.WKT,OpenLayers.Geometry.fromWKT.format=c);a=c.read(a);if(a instanceof OpenLayers.Feature.Vector)b=a.geometry;else if(OpenLayers.Util.isArray(a)){b=a.length;for(var c=Array(b),d=0;d<b;++d)c[d]=a[d].geometry;b=new OpenLayers.Geometry.Collection(c)}}return b};
OpenLayers.Geometry.segmentsIntersect=function(a,b,c){var d=c&&c.point,c=c&&c.tolerance,e=!1,f=a.x1-b.x1,g=a.y1-b.y1,h=a.x2-a.x1,i=a.y2-a.y1,j=b.y2-b.y1,k=b.x2-b.x1,l=j*h-k*i,j=k*g-j*f,g=h*g-i*f;0==l?0==j&&0==g&&(e=!0):(f=j/l,l=g/l,0<=f&&(1>=f&&0<=l&&1>=l)&&(d?(h=a.x1+f*h,l=a.y1+f*i,e=new OpenLayers.Geometry.Point(h,l)):e=!0));if(c)if(e){if(d){a=[a,b];b=0;a:for(;2>b;++b){f=a[b];for(i=1;3>i;++i)if(h=f["x"+i],l=f["y"+i],d=Math.sqrt(Math.pow(h-e.x,2)+Math.pow(l-e.y,2)),d<c){e.x=h;e.y=l;break a}}}}else{a=
[a,b];b=0;a:for(;2>b;++b){h=a[b];l=a[(b+1)%2];for(i=1;3>i;++i)if(f={x:h["x"+i],y:h["y"+i]},g=OpenLayers.Geometry.distanceToSegment(f,l),g.distance<c){e=d?new OpenLayers.Geometry.Point(f.x,f.y):!0;break a}}}return e};OpenLayers.Geometry.distanceToSegment=function(a,b){var c=a.x,d=a.y,e=b.x1,f=b.y1,g=b.x2,h=b.y2,i=g-e,j=h-f,k=(i*(c-e)+j*(d-f))/(Math.pow(i,2)+Math.pow(j,2));0>=k||(1<=k?(e=g,f=h):(e+=k*i,f+=k*j));return{distance:Math.sqrt(Math.pow(e-c,2)+Math.pow(f-d,2)),x:e,y:f}};OpenLayers.Geometry.Point=OpenLayers.Class(OpenLayers.Geometry,{x:null,y:null,initialize:function(a,b){OpenLayers.Geometry.prototype.initialize.apply(this,arguments);this.x=parseFloat(a);this.y=parseFloat(b)},clone:function(a){null==a&&(a=new OpenLayers.Geometry.Point(this.x,this.y));OpenLayers.Util.applyDefaults(a,this);return a},calculateBounds:function(){this.bounds=new OpenLayers.Bounds(this.x,this.y,this.x,this.y)},distanceTo:function(a,b){var c=!(b&&!1===b.edge)&&b&&b.details,d,e,f,g,h;a instanceof
OpenLayers.Geometry.Point?(e=this.x,f=this.y,g=a.x,h=a.y,d=Math.sqrt(Math.pow(e-g,2)+Math.pow(f-h,2)),d=!c?d:{x0:e,y0:f,x1:g,y1:h,distance:d}):(d=a.distanceTo(this,b),c&&(d={x0:d.x1,y0:d.y1,x1:d.x0,y1:d.y0,distance:d.distance}));return d},equals:function(a){var b=!1;null!=a&&(b=this.x==a.x&&this.y==a.y||isNaN(this.x)&&isNaN(this.y)&&isNaN(a.x)&&isNaN(a.y));return b},toShortString:function(){return this.x+", "+this.y},move:function(a,b){this.x+=a;this.y+=b;this.clearBounds()},rotate:function(a,b){var a=
a*(Math.PI/180),c=this.distanceTo(b),d=a+Math.atan2(this.y-b.y,this.x-b.x);this.x=b.x+c*Math.cos(d);this.y=b.y+c*Math.sin(d);this.clearBounds()},getCentroid:function(){return new OpenLayers.Geometry.Point(this.x,this.y)},resize:function(a,b,c){this.x=b.x+a*(void 0==c?1:c)*(this.x-b.x);this.y=b.y+a*(this.y-b.y);this.clearBounds();return this},intersects:function(a){var b=!1;return b="OpenLayers.Geometry.Point"==a.CLASS_NAME?this.equals(a):a.intersects(this)},transform:function(a,b){a&&b&&(OpenLayers.Projection.transform(this,
a,b),this.bounds=null);return this},getVertices:function(){return[this]},CLASS_NAME:"OpenLayers.Geometry.Point"});OpenLayers.Geometry.Collection=OpenLayers.Class(OpenLayers.Geometry,{components:null,componentTypes:null,initialize:function(a){OpenLayers.Geometry.prototype.initialize.apply(this,arguments);this.components=[];null!=a&&this.addComponents(a)},destroy:function(){this.components.length=0;this.components=null;OpenLayers.Geometry.prototype.destroy.apply(this,arguments)},clone:function(){for(var a=eval("new "+this.CLASS_NAME+"()"),b=0,c=this.components.length;b<c;b++)a.addComponent(this.components[b].clone());
OpenLayers.Util.applyDefaults(a,this);return a},getComponentsString:function(){for(var a=[],b=0,c=this.components.length;b<c;b++)a.push(this.components[b].toShortString());return a.join(",")},calculateBounds:function(){this.bounds=null;var a=new OpenLayers.Bounds,b=this.components;if(b)for(var c=0,d=b.length;c<d;c++)a.extend(b[c].getBounds());null!=a.left&&(null!=a.bottom&&null!=a.right&&null!=a.top)&&this.setBounds(a)},addComponents:function(a){OpenLayers.Util.isArray(a)||(a=[a]);for(var b=0,c=a.length;b<
c;b++)this.addComponent(a[b])},addComponent:function(a,b){var c=!1;if(a&&(null==this.componentTypes||-1<OpenLayers.Util.indexOf(this.componentTypes,a.CLASS_NAME))){if(null!=b&&b<this.components.length){var c=this.components.slice(0,b),d=this.components.slice(b,this.components.length);c.push(a);this.components=c.concat(d)}else this.components.push(a);a.parent=this;this.clearBounds();c=!0}return c},removeComponents:function(a){var b=!1;OpenLayers.Util.isArray(a)||(a=[a]);for(var c=a.length-1;0<=c;--c)b=
this.removeComponent(a[c])||b;return b},removeComponent:function(a){OpenLayers.Util.removeItem(this.components,a);this.clearBounds();return!0},getLength:function(){for(var a=0,b=0,c=this.components.length;b<c;b++)a+=this.components[b].getLength();return a},getArea:function(){for(var a=0,b=0,c=this.components.length;b<c;b++)a+=this.components[b].getArea();return a},getGeodesicArea:function(a){for(var b=0,c=0,d=this.components.length;c<d;c++)b+=this.components[c].getGeodesicArea(a);return b},getCentroid:function(a){if(!a)return this.components.length&&
this.components[0].getCentroid();a=this.components.length;if(!a)return!1;for(var b=[],c=[],d=0,e=Number.MAX_VALUE,f,g=0;g<a;++g){f=this.components[g];var h=f.getArea();f=f.getCentroid(!0);!isNaN(h)&&(!isNaN(f.x)&&!isNaN(f.y))&&(b.push(h),d+=h,e=h<e&&0<h?h:e,c.push(f))}a=b.length;if(0===d){for(g=0;g<a;++g)b[g]=1;d=b.length}else{for(g=0;g<a;++g)b[g]/=e;d/=e}for(var i=e=0,g=0;g<a;++g)f=c[g],h=b[g],e+=f.x*h,i+=f.y*h;return new OpenLayers.Geometry.Point(e/d,i/d)},getGeodesicLength:function(a){for(var b=
0,c=0,d=this.components.length;c<d;c++)b+=this.components[c].getGeodesicLength(a);return b},move:function(a,b){for(var c=0,d=this.components.length;c<d;c++)this.components[c].move(a,b)},rotate:function(a,b){for(var c=0,d=this.components.length;c<d;++c)this.components[c].rotate(a,b)},resize:function(a,b,c){for(var d=0;d<this.components.length;++d)this.components[d].resize(a,b,c);return this},distanceTo:function(a,b){for(var c=!(b&&!1===b.edge)&&b&&b.details,d,e,f,g=Number.POSITIVE_INFINITY,h=0,i=this.components.length;h<
i&&!(d=this.components[h].distanceTo(a,b),f=c?d.distance:d,f<g&&(g=f,e=d,0==g));++h);return e},equals:function(a){var b=!0;if(!a||!a.CLASS_NAME||this.CLASS_NAME!=a.CLASS_NAME)b=!1;else if(!OpenLayers.Util.isArray(a.components)||a.components.length!=this.components.length)b=!1;else for(var c=0,d=this.components.length;c<d;++c)if(!this.components[c].equals(a.components[c])){b=!1;break}return b},transform:function(a,b){if(a&&b){for(var c=0,d=this.components.length;c<d;c++)this.components[c].transform(a,
b);this.bounds=null}return this},intersects:function(a){for(var b=!1,c=0,d=this.components.length;c<d&&!(b=a.intersects(this.components[c]));++c);return b},getVertices:function(a){for(var b=[],c=0,d=this.components.length;c<d;++c)Array.prototype.push.apply(b,this.components[c].getVertices(a));return b},CLASS_NAME:"OpenLayers.Geometry.Collection"});OpenLayers.Geometry.MultiPoint=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Point"],addPoint:function(a,b){this.addComponent(a,b)},removePoint:function(a){this.removeComponent(a)},CLASS_NAME:"OpenLayers.Geometry.MultiPoint"});OpenLayers.Geometry.Curve=OpenLayers.Class(OpenLayers.Geometry.MultiPoint,{componentTypes:["OpenLayers.Geometry.Point"],getLength:function(){var a=0;if(this.components&&1<this.components.length)for(var b=1,c=this.components.length;b<c;b++)a+=this.components[b-1].distanceTo(this.components[b]);return a},getGeodesicLength:function(a){var b=this;if(a){var c=new OpenLayers.Projection("EPSG:4326");c.equals(a)||(b=this.clone().transform(a,c))}a=0;if(b.components&&1<b.components.length)for(var d,e=1,f=b.components.length;e<
f;e++)c=b.components[e-1],d=b.components[e],a+=OpenLayers.Util.distVincenty({lon:c.x,lat:c.y},{lon:d.x,lat:d.y});return 1E3*a},CLASS_NAME:"OpenLayers.Geometry.Curve"});OpenLayers.Geometry.LineString=OpenLayers.Class(OpenLayers.Geometry.Curve,{removeComponent:function(a){var b=this.components&&2<this.components.length;b&&OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,arguments);return b},intersects:function(a){var b=!1,c=a.CLASS_NAME;if("OpenLayers.Geometry.LineString"==c||"OpenLayers.Geometry.LinearRing"==c||"OpenLayers.Geometry.Point"==c){var d=this.getSortedSegments(),a="OpenLayers.Geometry.Point"==c?[{x1:a.x,y1:a.y,x2:a.x,y2:a.y}]:a.getSortedSegments(),
e,f,g,h,i,j,k,l=0,m=d.length;a:for(;l<m;++l){c=d[l];e=c.x1;f=c.x2;g=c.y1;h=c.y2;var n=0,o=a.length;for(;n<o;++n){i=a[n];if(i.x1>f)break;if(!(i.x2<e)&&(j=i.y1,k=i.y2,!(Math.min(j,k)>Math.max(g,h))&&!(Math.max(j,k)<Math.min(g,h))&&OpenLayers.Geometry.segmentsIntersect(c,i))){b=!0;break a}}}}else b=a.intersects(this);return b},getSortedSegments:function(){for(var a=this.components.length-1,b=Array(a),c,d,e=0;e<a;++e)c=this.components[e],d=this.components[e+1],b[e]=c.x<d.x?{x1:c.x,y1:c.y,x2:d.x,y2:d.y}:
{x1:d.x,y1:d.y,x2:c.x,y2:c.y};return b.sort(function(a,b){return a.x1-b.x1})},splitWithSegment:function(a,b){for(var c=!(b&&!1===b.edge),d=b&&b.tolerance,e=[],f=this.getVertices(),g=[],h=[],i=!1,j,k,l,m={point:!0,tolerance:d},n=null,o=0,p=f.length-2;o<=p;++o)if(d=f[o],g.push(d.clone()),j=f[o+1],k={x1:d.x,y1:d.y,x2:j.x,y2:j.y},k=OpenLayers.Geometry.segmentsIntersect(a,k,m),k instanceof OpenLayers.Geometry.Point&&((l=k.x===a.x1&&k.y===a.y1||k.x===a.x2&&k.y===a.y2||k.equals(d)||k.equals(j)?!0:!1)||c))k.equals(h[h.length-
1])||h.push(k.clone()),!(0===o&&k.equals(d))&&!k.equals(j)&&(i=!0,k.equals(d)||g.push(k),e.push(new OpenLayers.Geometry.LineString(g)),g=[k.clone()]);i&&(g.push(j.clone()),e.push(new OpenLayers.Geometry.LineString(g)));if(0<h.length)var q=a.x1<a.x2?1:-1,r=a.y1<a.y2?1:-1,n={lines:e,points:h.sort(function(a,b){return q*a.x-q*b.x||r*a.y-r*b.y})};return n},split:function(a,b){var c=null,d=b&&b.mutual,e,f,g,h;if(a instanceof OpenLayers.Geometry.LineString){var i=this.getVertices(),j,k,l,m,n,o=[];g=[];
for(var p=0,q=i.length-2;p<=q;++p){j=i[p];k=i[p+1];l={x1:j.x,y1:j.y,x2:k.x,y2:k.y};h=h||[a];d&&o.push(j.clone());for(var r=0;r<h.length;++r)if(m=h[r].splitWithSegment(l,b))if(n=m.lines,0<n.length&&(n.unshift(r,1),Array.prototype.splice.apply(h,n),r+=n.length-2),d)for(var s=0,t=m.points.length;s<t;++s)n=m.points[s],n.equals(j)||(o.push(n),g.push(new OpenLayers.Geometry.LineString(o)),o=n.equals(k)?[]:[n.clone()])}d&&(0<g.length&&0<o.length)&&(o.push(k.clone()),g.push(new OpenLayers.Geometry.LineString(o)))}else c=
a.splitWith(this,b);h&&1<h.length?f=!0:h=[];g&&1<g.length?e=!0:g=[];if(f||e)c=d?[g,h]:h;return c},splitWith:function(a,b){return a.split(this,b)},getVertices:function(a){return!0===a?[this.components[0],this.components[this.components.length-1]]:!1===a?this.components.slice(1,this.components.length-1):this.components.slice()},distanceTo:function(a,b){var c=!(b&&!1===b.edge)&&b&&b.details,d,e={},f=Number.POSITIVE_INFINITY;if(a instanceof OpenLayers.Geometry.Point){for(var g=this.getSortedSegments(),
h=a.x,i=a.y,j,k=0,l=g.length;k<l;++k)if(j=g[k],d=OpenLayers.Geometry.distanceToSegment(a,j),d.distance<f){if(f=d.distance,e=d,0===f)break}else if(j.x2>h&&(i>j.y1&&i<j.y2||i<j.y1&&i>j.y2))break;e=c?{distance:e.distance,x0:e.x,y0:e.y,x1:h,y1:i}:e.distance}else if(a instanceof OpenLayers.Geometry.LineString){var g=this.getSortedSegments(),h=a.getSortedSegments(),m,n,o=h.length,p={point:!0},k=0,l=g.length;a:for(;k<l;++k){i=g[k];j=i.x1;n=i.y1;for(var q=0;q<o;++q)if(d=h[q],m=OpenLayers.Geometry.segmentsIntersect(i,
d,p)){f=0;e={distance:0,x0:m.x,y0:m.y,x1:m.x,y1:m.y};break a}else d=OpenLayers.Geometry.distanceToSegment({x:j,y:n},d),d.distance<f&&(f=d.distance,e={distance:f,x0:j,y0:n,x1:d.x,y1:d.y})}c||(e=e.distance);0!==f&&i&&(d=a.distanceTo(new OpenLayers.Geometry.Point(i.x2,i.y2),b),k=c?d.distance:d,k<f&&(e=c?{distance:f,x0:d.x1,y0:d.y1,x1:d.x0,y1:d.y0}:k))}else e=a.distanceTo(this,b),c&&(e={distance:e.distance,x0:e.x1,y0:e.y1,x1:e.x0,y1:e.y0});return e},simplify:function(a){if(this&&null!==this){var b=this.getVertices();
if(3>b.length)return this;var c=function(a,b,d,i){for(var j=0,k=0,l=b,m;l<d;l++){m=a[b];var n=a[d],o=a[l],o=Math.abs(0.5*(m.x*n.y+n.x*o.y+o.x*m.y-n.x*m.y-o.x*n.y-m.x*o.y));m=Math.sqrt(Math.pow(m.x-n.x,2)+Math.pow(m.y-n.y,2));m=2*(o/m);m>j&&(j=m,k=l)}j>i&&k!=b&&(e.push(k),c(a,b,k,i),c(a,k,d,i))},d=b.length-1,e=[];e.push(0);for(e.push(d);b[0].equals(b[d]);)d--,e.push(d);c(b,0,d,a);a=[];e.sort(function(a,b){return a-b});for(d=0;d<e.length;d++)a.push(b[e[d]]);return new OpenLayers.Geometry.LineString(a)}return this},
CLASS_NAME:"OpenLayers.Geometry.LineString"});OpenLayers.Geometry.MultiLineString=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LineString"],split:function(a,b){for(var c=null,d=b&&b.mutual,e,f,g,h,i=[],j=[a],k=0,l=this.components.length;k<l;++k){f=this.components[k];g=!1;for(var m=0;m<j.length;++m)if(e=f.split(j[m],b)){if(d){g=e[0];for(var n=0,o=g.length;n<o;++n)0===n&&i.length?i[i.length-1].addComponent(g[n]):i.push(new OpenLayers.Geometry.MultiLineString([g[n]]));g=!0;e=e[1]}if(e.length){e.unshift(m,
1);Array.prototype.splice.apply(j,e);break}}g||(i.length?i[i.length-1].addComponent(f.clone()):i=[new OpenLayers.Geometry.MultiLineString(f.clone())])}i&&1<i.length?g=!0:i=[];j&&1<j.length?h=!0:j=[];if(g||h)c=d?[i,j]:j;return c},splitWith:function(a,b){var c=null,d=b&&b.mutual,e,f,g,h,i,j;if(a instanceof OpenLayers.Geometry.LineString){j=[];i=[a];for(var k=0,l=this.components.length;k<l;++k){g=!1;f=this.components[k];for(var m=0;m<i.length;++m)if(e=i[m].split(f,b)){d&&(g=e[0],g.length&&(g.unshift(m,
1),Array.prototype.splice.apply(i,g),m+=g.length-2),e=e[1],0===e.length&&(e=[f.clone()]));g=0;for(var n=e.length;g<n;++g)0===g&&j.length?j[j.length-1].addComponent(e[g]):j.push(new OpenLayers.Geometry.MultiLineString([e[g]]));g=!0}g||(j.length?j[j.length-1].addComponent(f.clone()):j=[new OpenLayers.Geometry.MultiLineString([f.clone()])])}}else c=a.split(this);i&&1<i.length?h=!0:i=[];j&&1<j.length?g=!0:j=[];if(h||g)c=d?[i,j]:j;return c},CLASS_NAME:"OpenLayers.Geometry.MultiLineString"});OpenLayers.Geometry.LinearRing=OpenLayers.Class(OpenLayers.Geometry.LineString,{componentTypes:["OpenLayers.Geometry.Point"],addComponent:function(a,b){var c=!1,d=this.components.pop();if(null!=b||!a.equals(d))c=OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,arguments);OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[this.components[0]]);return c},removeComponent:function(a){var b=this.components&&3<this.components.length;b&&(this.components.pop(),OpenLayers.Geometry.Collection.prototype.removeComponent.apply(this,
arguments),OpenLayers.Geometry.Collection.prototype.addComponent.apply(this,[this.components[0]]));return b},move:function(a,b){for(var c=0,d=this.components.length;c<d-1;c++)this.components[c].move(a,b)},rotate:function(a,b){for(var c=0,d=this.components.length;c<d-1;++c)this.components[c].rotate(a,b)},resize:function(a,b,c){for(var d=0,e=this.components.length;d<e-1;++d)this.components[d].resize(a,b,c);return this},transform:function(a,b){if(a&&b){for(var c=0,d=this.components.length;c<d-1;c++)this.components[c].transform(a,
b);this.bounds=null}return this},getCentroid:function(){if(this.components&&2<this.components.length){for(var a=0,b=0,c=0;c<this.components.length-1;c++)var d=this.components[c],e=this.components[c+1],a=a+(d.x+e.x)*(d.x*e.y-e.x*d.y),b=b+(d.y+e.y)*(d.x*e.y-e.x*d.y);c=-1*this.getArea();return new OpenLayers.Geometry.Point(a/(6*c),b/(6*c))}return null},getArea:function(){var a=0;if(this.components&&2<this.components.length){for(var b=a=0,c=this.components.length;b<c-1;b++)var d=this.components[b],e=
this.components[b+1],a=a+(d.x+e.x)*(e.y-d.y);a=-a/2}return a},getGeodesicArea:function(a){var b=this;if(a){var c=new OpenLayers.Projection("EPSG:4326");c.equals(a)||(b=this.clone().transform(a,c))}a=0;c=b.components&&b.components.length;if(2<c){for(var d,e,f=0;f<c-1;f++)d=b.components[f],e=b.components[f+1],a+=OpenLayers.Util.rad(e.x-d.x)*(2+Math.sin(OpenLayers.Util.rad(d.y))+Math.sin(OpenLayers.Util.rad(e.y)));a=40680631590769*a/2}return a},containsPoint:function(a){for(var b=OpenLayers.Number.limitSigDigs,
c=b(a.x,14),a=b(a.y,14),d=this.components.length-1,e,f,g,h,i,j=0,k=0;k<d;++k)if(e=this.components[k],g=b(e.x,14),e=b(e.y,14),f=this.components[k+1],h=b(f.x,14),f=b(f.y,14),e==f){if(a==e&&(g<=h&&c>=g&&c<=h||g>=h&&c<=g&&c>=h)){j=-1;break}}else{i=b((a-f)*((h-g)/(f-e))+h,14);if(i==c&&(e<f&&a>=e&&a<=f||e>f&&a<=e&&a>=f)){j=-1;break}i<=c||g!=h&&(i<Math.min(g,h)||i>Math.max(g,h))||(e<f&&a>=e&&a<f||e>f&&a<e&&a>=f)&&++j}return-1==j?1:!!(j&1)},intersects:function(a){var b=!1;if("OpenLayers.Geometry.Point"==
a.CLASS_NAME)b=this.containsPoint(a);else if("OpenLayers.Geometry.LineString"==a.CLASS_NAME)b=a.intersects(this);else if("OpenLayers.Geometry.LinearRing"==a.CLASS_NAME)b=OpenLayers.Geometry.LineString.prototype.intersects.apply(this,[a]);else for(var c=0,d=a.components.length;c<d&&!(b=a.components[c].intersects(this));++c);return b},getVertices:function(a){return!0===a?[]:this.components.slice(0,this.components.length-1)},CLASS_NAME:"OpenLayers.Geometry.LinearRing"});OpenLayers.Geometry.Polygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.LinearRing"],getArea:function(){var a=0;if(this.components&&0<this.components.length)for(var a=a+Math.abs(this.components[0].getArea()),b=1,c=this.components.length;b<c;b++)a-=Math.abs(this.components[b].getArea());return a},getGeodesicArea:function(a){var b=0;if(this.components&&0<this.components.length)for(var b=b+Math.abs(this.components[0].getGeodesicArea(a)),c=1,d=this.components.length;c<
d;c++)b-=Math.abs(this.components[c].getGeodesicArea(a));return b},containsPoint:function(a){var b=this.components.length,c=!1;if(0<b&&(c=this.components[0].containsPoint(a),1!==c&&c&&1<b))for(var d,e=1;e<b;++e)if(d=this.components[e].containsPoint(a)){c=1===d?1:!1;break}return c},intersects:function(a){var b=!1,c,d;if("OpenLayers.Geometry.Point"==a.CLASS_NAME)b=this.containsPoint(a);else if("OpenLayers.Geometry.LineString"==a.CLASS_NAME||"OpenLayers.Geometry.LinearRing"==a.CLASS_NAME){c=0;for(d=
this.components.length;c<d&&!(b=a.intersects(this.components[c]));++c);if(!b){c=0;for(d=a.components.length;c<d&&!(b=this.containsPoint(a.components[c]));++c);}}else{c=0;for(d=a.components.length;c<d&&!(b=this.intersects(a.components[c]));++c);}if(!b&&"OpenLayers.Geometry.Polygon"==a.CLASS_NAME){var e=this.components[0];c=0;for(d=e.components.length;c<d&&!(b=a.containsPoint(e.components[c]));++c);}return b},distanceTo:function(a,b){return b&&!1===b.edge&&this.intersects(a)?0:OpenLayers.Geometry.Collection.prototype.distanceTo.apply(this,
[a,b])},CLASS_NAME:"OpenLayers.Geometry.Polygon"});OpenLayers.Geometry.Polygon.createRegularPolygon=function(a,b,c,d){var e=Math.PI*(1/c-0.5);d&&(e+=d/180*Math.PI);for(var f,g=[],h=0;h<c;++h)f=e+2*h*Math.PI/c,d=a.x+b*Math.cos(f),f=a.y+b*Math.sin(f),g.push(new OpenLayers.Geometry.Point(d,f));a=new OpenLayers.Geometry.LinearRing(g);return new OpenLayers.Geometry.Polygon([a])};OpenLayers.Geometry.MultiPolygon=OpenLayers.Class(OpenLayers.Geometry.Collection,{componentTypes:["OpenLayers.Geometry.Polygon"],CLASS_NAME:"OpenLayers.Geometry.MultiPolygon"});OpenLayers.Format.GML=OpenLayers.Class(OpenLayers.Format.XML,{featureNS:"http://mapserver.gis.umn.edu/mapserver",featurePrefix:"feature",featureName:"featureMember",layerName:"features",geometryName:"geometry",collectionName:"FeatureCollection",gmlns:"http://www.opengis.net/gml",extractAttributes:!0,xy:!0,initialize:function(a){this.regExes={trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g};OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){"string"==
typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));for(var a=this.getElementsByTagNameNS(a.documentElement,this.gmlns,this.featureName),b=[],c=0;c<a.length;c++){var d=this.parseFeature(a[c]);d&&b.push(d)}return b},parseFeature:function(a){for(var b="MultiPolygon Polygon MultiLineString LineString MultiPoint Point Envelope".split(" "),c,d,e,f=0;f<b.length;++f)if(c=b[f],d=this.getElementsByTagNameNS(a,this.gmlns,c),0<d.length){if(e=this.parseGeometry[c.toLowerCase()])e=e.apply(this,
[d[0]]),this.internalProjection&&this.externalProjection&&e.transform(this.externalProjection,this.internalProjection);else throw new TypeError("Unsupported geometry type: "+c);break}var g;c=this.getElementsByTagNameNS(a,this.gmlns,"Box");for(f=0;f<c.length;++f)b=c[f],d=this.parseGeometry.box.apply(this,[b]),b=b.parentNode,"boundedBy"===(b.localName||b.nodeName.split(":").pop())?g=d:e=d.toGeometry();var h;this.extractAttributes&&(h=this.parseAttributes(a));h=new OpenLayers.Feature.Vector(e,h);h.bounds=
g;h.gml={featureType:a.firstChild.nodeName.split(":")[1],featureNS:a.firstChild.namespaceURI,featureNSPrefix:a.firstChild.prefix};for(var a=a.firstChild,i;a&&!(1==a.nodeType&&(i=a.getAttribute("fid")||a.getAttribute("id")));)a=a.nextSibling;h.fid=i;return h},parseGeometry:{point:function(a){var b,c;c=[];b=this.getElementsByTagNameNS(a,this.gmlns,"pos");0<b.length&&(c=b[0].firstChild.nodeValue,c=c.replace(this.regExes.trimSpace,""),c=c.split(this.regExes.splitSpace));0==c.length&&(b=this.getElementsByTagNameNS(a,
this.gmlns,"coordinates"),0<b.length&&(c=b[0].firstChild.nodeValue,c=c.replace(this.regExes.removeSpace,""),c=c.split(",")));0==c.length&&(b=this.getElementsByTagNameNS(a,this.gmlns,"coord"),0<b.length&&(a=this.getElementsByTagNameNS(b[0],this.gmlns,"X"),b=this.getElementsByTagNameNS(b[0],this.gmlns,"Y"),0<a.length&&0<b.length&&(c=[a[0].firstChild.nodeValue,b[0].firstChild.nodeValue])));2==c.length&&(c[2]=null);return this.xy?new OpenLayers.Geometry.Point(c[0],c[1],c[2]):new OpenLayers.Geometry.Point(c[1],
c[0],c[2])},multipoint:function(a){var a=this.getElementsByTagNameNS(a,this.gmlns,"Point"),b=[];if(0<a.length)for(var c,d=0;d<a.length;++d)(c=this.parseGeometry.point.apply(this,[a[d]]))&&b.push(c);return new OpenLayers.Geometry.MultiPoint(b)},linestring:function(a,b){var c,d;d=[];var e=[];c=this.getElementsByTagNameNS(a,this.gmlns,"posList");if(0<c.length){d=this.getChildValue(c[0]);d=d.replace(this.regExes.trimSpace,"");d=d.split(this.regExes.splitSpace);var f=parseInt(c[0].getAttribute("dimension")),
g,h,i;for(c=0;c<d.length/f;++c)g=c*f,h=d[g],i=d[g+1],g=2==f?null:d[g+2],this.xy?e.push(new OpenLayers.Geometry.Point(h,i,g)):e.push(new OpenLayers.Geometry.Point(i,h,g))}if(0==d.length&&(c=this.getElementsByTagNameNS(a,this.gmlns,"coordinates"),0<c.length)){d=this.getChildValue(c[0]);d=d.replace(this.regExes.trimSpace,"");d=d.replace(this.regExes.trimComma,",");f=d.split(this.regExes.splitSpace);for(c=0;c<f.length;++c)d=f[c].split(","),2==d.length&&(d[2]=null),this.xy?e.push(new OpenLayers.Geometry.Point(d[0],
d[1],d[2])):e.push(new OpenLayers.Geometry.Point(d[1],d[0],d[2]))}d=null;0!=e.length&&(d=b?new OpenLayers.Geometry.LinearRing(e):new OpenLayers.Geometry.LineString(e));return d},multilinestring:function(a){var a=this.getElementsByTagNameNS(a,this.gmlns,"LineString"),b=[];if(0<a.length)for(var c,d=0;d<a.length;++d)(c=this.parseGeometry.linestring.apply(this,[a[d]]))&&b.push(c);return new OpenLayers.Geometry.MultiLineString(b)},polygon:function(a){var a=this.getElementsByTagNameNS(a,this.gmlns,"LinearRing"),
b=[];if(0<a.length)for(var c,d=0;d<a.length;++d)(c=this.parseGeometry.linestring.apply(this,[a[d],!0]))&&b.push(c);return new OpenLayers.Geometry.Polygon(b)},multipolygon:function(a){var a=this.getElementsByTagNameNS(a,this.gmlns,"Polygon"),b=[];if(0<a.length)for(var c,d=0;d<a.length;++d)(c=this.parseGeometry.polygon.apply(this,[a[d]]))&&b.push(c);return new OpenLayers.Geometry.MultiPolygon(b)},envelope:function(a){var b=[],c,d,e=this.getElementsByTagNameNS(a,this.gmlns,"lowerCorner");if(0<e.length){c=
[];0<e.length&&(c=e[0].firstChild.nodeValue,c=c.replace(this.regExes.trimSpace,""),c=c.split(this.regExes.splitSpace));2==c.length&&(c[2]=null);var f=this.xy?new OpenLayers.Geometry.Point(c[0],c[1],c[2]):new OpenLayers.Geometry.Point(c[1],c[0],c[2])}a=this.getElementsByTagNameNS(a,this.gmlns,"upperCorner");if(0<a.length){c=[];0<a.length&&(c=a[0].firstChild.nodeValue,c=c.replace(this.regExes.trimSpace,""),c=c.split(this.regExes.splitSpace));2==c.length&&(c[2]=null);var g=this.xy?new OpenLayers.Geometry.Point(c[0],
c[1],c[2]):new OpenLayers.Geometry.Point(c[1],c[0],c[2])}f&&g&&(b.push(new OpenLayers.Geometry.Point(f.x,f.y)),b.push(new OpenLayers.Geometry.Point(g.x,f.y)),b.push(new OpenLayers.Geometry.Point(g.x,g.y)),b.push(new OpenLayers.Geometry.Point(f.x,g.y)),b.push(new OpenLayers.Geometry.Point(f.x,f.y)),b=new OpenLayers.Geometry.LinearRing(b),d=new OpenLayers.Geometry.Polygon([b]));return d},box:function(a){var b=this.getElementsByTagNameNS(a,this.gmlns,"coordinates"),c=a=null;0<b.length&&(b=b[0].firstChild.nodeValue,
b=b.split(" "),2==b.length&&(a=b[0].split(","),c=b[1].split(",")));if(null!==a&&null!==c)return new OpenLayers.Bounds(parseFloat(a[0]),parseFloat(a[1]),parseFloat(c[0]),parseFloat(c[1]))}},parseAttributes:function(a){for(var b={},a=a.firstChild,c,d,e;a;){if(1==a.nodeType){a=a.childNodes;for(c=0;c<a.length;++c)if(d=a[c],1==d.nodeType)if(e=d.childNodes,1==e.length){if(e=e[0],3==e.nodeType||4==e.nodeType)d=d.prefix?d.nodeName.split(":")[1]:d.nodeName,e=e.nodeValue.replace(this.regExes.trimSpace,""),
b[d]=e}else b[d.nodeName.split(":").pop()]=null;break}a=a.nextSibling}return b},write:function(a){OpenLayers.Util.isArray(a)||(a=[a]);for(var b=this.createElementNS("http://www.opengis.net/wfs","wfs:"+this.collectionName),c=0;c<a.length;c++)b.appendChild(this.createFeatureXML(a[c]));return OpenLayers.Format.XML.prototype.write.apply(this,[b])},createFeatureXML:function(a){var b=this.buildGeometryNode(a.geometry),c=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.geometryName);c.appendChild(b);
var b=this.createElementNS(this.gmlns,"gml:"+this.featureName),d=this.createElementNS(this.featureNS,this.featurePrefix+":"+this.layerName);d.setAttribute("fid",a.fid||a.id);d.appendChild(c);for(var e in a.attributes){var c=this.createTextNode(a.attributes[e]),f=this.createElementNS(this.featureNS,this.featurePrefix+":"+e.substring(e.lastIndexOf(":")+1));f.appendChild(c);d.appendChild(f)}b.appendChild(d);return b},buildGeometryNode:function(a){this.externalProjection&&this.internalProjection&&(a=
a.clone(),a.transform(this.internalProjection,this.externalProjection));var b=a.CLASS_NAME;return this.buildGeometry[b.substring(b.lastIndexOf(".")+1).toLowerCase()].apply(this,[a])},buildGeometry:{point:function(a){var b=this.createElementNS(this.gmlns,"gml:Point");b.appendChild(this.buildCoordinatesNode(a));return b},multipoint:function(a){for(var b=this.createElementNS(this.gmlns,"gml:MultiPoint"),a=a.components,c,d,e=0;e<a.length;e++)c=this.createElementNS(this.gmlns,"gml:pointMember"),d=this.buildGeometry.point.apply(this,
[a[e]]),c.appendChild(d),b.appendChild(c);return b},linestring:function(a){var b=this.createElementNS(this.gmlns,"gml:LineString");b.appendChild(this.buildCoordinatesNode(a));return b},multilinestring:function(a){for(var b=this.createElementNS(this.gmlns,"gml:MultiLineString"),a=a.components,c,d,e=0;e<a.length;++e)c=this.createElementNS(this.gmlns,"gml:lineStringMember"),d=this.buildGeometry.linestring.apply(this,[a[e]]),c.appendChild(d),b.appendChild(c);return b},linearring:function(a){var b=this.createElementNS(this.gmlns,
"gml:LinearRing");b.appendChild(this.buildCoordinatesNode(a));return b},polygon:function(a){for(var b=this.createElementNS(this.gmlns,"gml:Polygon"),a=a.components,c,d,e=0;e<a.length;++e)c=0==e?"outerBoundaryIs":"innerBoundaryIs",c=this.createElementNS(this.gmlns,"gml:"+c),d=this.buildGeometry.linearring.apply(this,[a[e]]),c.appendChild(d),b.appendChild(c);return b},multipolygon:function(a){for(var b=this.createElementNS(this.gmlns,"gml:MultiPolygon"),a=a.components,c,d,e=0;e<a.length;++e)c=this.createElementNS(this.gmlns,
"gml:polygonMember"),d=this.buildGeometry.polygon.apply(this,[a[e]]),c.appendChild(d),b.appendChild(c);return b},bounds:function(a){var b=this.createElementNS(this.gmlns,"gml:Box");b.appendChild(this.buildCoordinatesNode(a));return b}},buildCoordinatesNode:function(a){var b=this.createElementNS(this.gmlns,"gml:coordinates");b.setAttribute("decimal",".");b.setAttribute("cs",",");b.setAttribute("ts"," ");var c=[];if(a instanceof OpenLayers.Bounds)c.push(a.left+","+a.bottom),c.push(a.right+","+a.top);
else for(var a=a.components?a.components:[a],d=0;d<a.length;d++)c.push(a[d].x+","+a[d].y);c=this.createTextNode(c.join(" "));b.appendChild(c);return b},CLASS_NAME:"OpenLayers.Format.GML"});OpenLayers.Format.GML||(OpenLayers.Format.GML={});
OpenLayers.Format.GML.Base=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{gml:"http://www.opengis.net/gml",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance",wfs:"http://www.opengis.net/wfs"},defaultPrefix:"gml",schemaLocation:null,featureType:null,featureNS:null,geometryName:"geometry",extractAttributes:!0,srsName:null,xy:!0,geometryTypes:null,singleFeatureType:null,regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g,featureMember:/^(.*:)?featureMembers?$/},
initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a]);this.setGeometryTypes();a&&a.featureNS&&this.setNamespace("feature",a.featureNS);this.singleFeatureType=!a||typeof a.featureType==="string"},read:function(a){typeof a=="string"&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));if(a&&a.nodeType==9)a=a.documentElement;var b=[];this.readNode(a,{features:b},true);if(b.length==0){var c=this.getElementsByTagNameNS(a,this.namespaces.gml,"featureMember");if(c.length)for(var a=
0,d=c.length;a<d;++a)this.readNode(c[a],{features:b},true);else{c=this.getElementsByTagNameNS(a,this.namespaces.gml,"featureMembers");c.length&&this.readNode(c[0],{features:b},true)}}return b},readNode:function(a,b,c){if(c===true&&this.autoConfig===true){this.featureType=null;delete this.namespaceAlias[this.featureNS];delete this.namespaces.feature;this.featureNS=null}if(!this.featureNS&&!(a.prefix in this.namespaces)&&a.parentNode.namespaceURI==this.namespaces.gml&&this.regExes.featureMember.test(a.parentNode.nodeName)){this.featureType=
a.nodeName.split(":").pop();this.setNamespace("feature",a.namespaceURI);this.featureNS=a.namespaceURI;this.autoConfig=true}return OpenLayers.Format.XML.prototype.readNode.apply(this,[a,b])},readers:{gml:{featureMember:function(a,b){this.readChildNodes(a,b)},featureMembers:function(a,b){this.readChildNodes(a,b)},name:function(a,b){b.name=this.getChildValue(a)},boundedBy:function(a,b){var c={};this.readChildNodes(a,c);if(c.components&&c.components.length>0)b.bounds=c.components[0]},Point:function(a,
b){var c={points:[]};this.readChildNodes(a,c);if(!b.components)b.components=[];b.components.push(c.points[0])},coordinates:function(a,b){for(var c=this.getChildValue(a).replace(this.regExes.trimSpace,""),c=c.replace(this.regExes.trimComma,","),c=c.split(this.regExes.splitSpace),d,e=c.length,f=Array(e),g=0;g<e;++g){d=c[g].split(",");f[g]=this.xy?new OpenLayers.Geometry.Point(d[0],d[1],d[2]):new OpenLayers.Geometry.Point(d[1],d[0],d[2])}b.points=f},coord:function(a,b){var c={};this.readChildNodes(a,
c);if(!b.points)b.points=[];b.points.push(new OpenLayers.Geometry.Point(c.x,c.y,c.z))},X:function(a,b){b.x=this.getChildValue(a)},Y:function(a,b){b.y=this.getChildValue(a)},Z:function(a,b){b.z=this.getChildValue(a)},MultiPoint:function(a,b){var c={components:[]};this.readChildNodes(a,c);b.components=[new OpenLayers.Geometry.MultiPoint(c.components)]},pointMember:function(a,b){this.readChildNodes(a,b)},LineString:function(a,b){var c={};this.readChildNodes(a,c);if(!b.components)b.components=[];b.components.push(new OpenLayers.Geometry.LineString(c.points))},
MultiLineString:function(a,b){var c={components:[]};this.readChildNodes(a,c);b.components=[new OpenLayers.Geometry.MultiLineString(c.components)]},lineStringMember:function(a,b){this.readChildNodes(a,b)},Polygon:function(a,b){var c={outer:null,inner:[]};this.readChildNodes(a,c);c.inner.unshift(c.outer);if(!b.components)b.components=[];b.components.push(new OpenLayers.Geometry.Polygon(c.inner))},LinearRing:function(a,b){var c={};this.readChildNodes(a,c);b.components=[new OpenLayers.Geometry.LinearRing(c.points)]},
MultiPolygon:function(a,b){var c={components:[]};this.readChildNodes(a,c);b.components=[new OpenLayers.Geometry.MultiPolygon(c.components)]},polygonMember:function(a,b){this.readChildNodes(a,b)},GeometryCollection:function(a,b){var c={components:[]};this.readChildNodes(a,c);b.components=[new OpenLayers.Geometry.Collection(c.components)]},geometryMember:function(a,b){this.readChildNodes(a,b)}},feature:{"*":function(a,b){var c,d=a.localName||a.nodeName.split(":").pop();b.features?!this.singleFeatureType&&
OpenLayers.Util.indexOf(this.featureType,d)!==-1?c="_typeName":d===this.featureType&&(c="_typeName"):a.childNodes.length==0||a.childNodes.length==1&&a.firstChild.nodeType==3?this.extractAttributes&&(c="_attribute"):c="_geometry";c&&this.readers.feature[c].apply(this,[a,b])},_typeName:function(a,b){var c={components:[],attributes:{}};this.readChildNodes(a,c);if(c.name)c.attributes.name=c.name;var d=new OpenLayers.Feature.Vector(c.components[0],c.attributes);if(!this.singleFeatureType){d.type=a.nodeName.split(":").pop();
d.namespace=a.namespaceURI}var e=a.getAttribute("fid")||this.getAttributeNS(a,this.namespaces.gml,"id");if(e)d.fid=e;this.internalProjection&&(this.externalProjection&&d.geometry)&&d.geometry.transform(this.externalProjection,this.internalProjection);if(c.bounds)d.bounds=c.bounds;b.features.push(d)},_geometry:function(a,b){if(!this.geometryName)this.geometryName=a.nodeName.split(":").pop();this.readChildNodes(a,b)},_attribute:function(a,b){var c=a.localName||a.nodeName.split(":").pop(),d=this.getChildValue(a);
b.attributes[c]=d}},wfs:{FeatureCollection:function(a,b){this.readChildNodes(a,b)}}},write:function(a){a=this.writeNode("gml:"+(OpenLayers.Util.isArray(a)?"featureMembers":"featureMember"),a);this.setAttributeNS(a,this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation);return OpenLayers.Format.XML.prototype.write.apply(this,[a])},writers:{gml:{featureMember:function(a){var b=this.createElementNSPlus("gml:featureMember");this.writeNode("feature:_typeName",a,b);return b},MultiPoint:function(a){for(var b=
this.createElementNSPlus("gml:MultiPoint"),a=a.components||[a],c=0,d=a.length;c<d;++c)this.writeNode("pointMember",a[c],b);return b},pointMember:function(a){var b=this.createElementNSPlus("gml:pointMember");this.writeNode("Point",a,b);return b},MultiLineString:function(a){for(var b=this.createElementNSPlus("gml:MultiLineString"),a=a.components||[a],c=0,d=a.length;c<d;++c)this.writeNode("lineStringMember",a[c],b);return b},lineStringMember:function(a){var b=this.createElementNSPlus("gml:lineStringMember");
this.writeNode("LineString",a,b);return b},MultiPolygon:function(a){for(var b=this.createElementNSPlus("gml:MultiPolygon"),a=a.components||[a],c=0,d=a.length;c<d;++c)this.writeNode("polygonMember",a[c],b);return b},polygonMember:function(a){var b=this.createElementNSPlus("gml:polygonMember");this.writeNode("Polygon",a,b);return b},GeometryCollection:function(a){for(var b=this.createElementNSPlus("gml:GeometryCollection"),c=0,d=a.components.length;c<d;++c)this.writeNode("geometryMember",a.components[c],
b);return b},geometryMember:function(a){var b=this.createElementNSPlus("gml:geometryMember"),a=this.writeNode("feature:_geometry",a);b.appendChild(a.firstChild);return b}},feature:{_typeName:function(a){var b=this.createElementNSPlus("feature:"+this.featureType,{attributes:{fid:a.fid}});a.geometry&&this.writeNode("feature:_geometry",a.geometry,b);for(var c in a.attributes){var d=a.attributes[c];d!=null&&this.writeNode("feature:_attribute",{name:c,value:d},b)}return b},_geometry:function(a){this.externalProjection&&
this.internalProjection&&(a=a.clone().transform(this.internalProjection,this.externalProjection));var b=this.createElementNSPlus("feature:"+this.geometryName),a=this.writeNode("gml:"+this.geometryTypes[a.CLASS_NAME],a,b);this.srsName&&a.setAttribute("srsName",this.srsName);return b},_attribute:function(a){return this.createElementNSPlus("feature:"+a.name,{value:a.value})}},wfs:{FeatureCollection:function(a){for(var b=this.createElementNSPlus("wfs:FeatureCollection"),c=0,d=a.length;c<d;++c)this.writeNode("gml:featureMember",
a[c],b);return b}}},setGeometryTypes:function(){this.geometryTypes={"OpenLayers.Geometry.Point":"Point","OpenLayers.Geometry.MultiPoint":"MultiPoint","OpenLayers.Geometry.LineString":"LineString","OpenLayers.Geometry.MultiLineString":"MultiLineString","OpenLayers.Geometry.Polygon":"Polygon","OpenLayers.Geometry.MultiPolygon":"MultiPolygon","OpenLayers.Geometry.Collection":"GeometryCollection"}},CLASS_NAME:"OpenLayers.Format.GML.Base"});OpenLayers.Format.GML.v3=OpenLayers.Class(OpenLayers.Format.GML.Base,{schemaLocation:"http://www.opengis.net/gml http://schemas.opengis.net/gml/3.1.1/profiles/gmlsfProfile/1.0.0/gmlsf.xsd",curve:!1,multiCurve:!0,surface:!1,multiSurface:!0,initialize:function(a){OpenLayers.Format.GML.Base.prototype.initialize.apply(this,[a])},readers:{gml:OpenLayers.Util.applyDefaults({featureMembers:function(a,b){this.readChildNodes(a,b)},Curve:function(a,b){var c={points:[]};this.readChildNodes(a,c);b.components||
(b.components=[]);b.components.push(new OpenLayers.Geometry.LineString(c.points))},segments:function(a,b){this.readChildNodes(a,b)},LineStringSegment:function(a,b){var c={};this.readChildNodes(a,c);c.points&&Array.prototype.push.apply(b.points,c.points)},pos:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(this.regExes.splitSpace),c=this.xy?new OpenLayers.Geometry.Point(c[0],c[1],c[2]):new OpenLayers.Geometry.Point(c[1],c[0],c[2]);b.points=[c]},posList:function(a,
b){for(var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(this.regExes.splitSpace),d=parseInt(a.getAttribute("dimension"))||2,e,f,g,h=Array(c.length/d),i=0,j=c.length;i<j;i+=d)e=c[i],f=c[i+1],g=2==d?void 0:c[i+2],h[i/d]=this.xy?new OpenLayers.Geometry.Point(e,f,g):new OpenLayers.Geometry.Point(f,e,g);b.points=h},Surface:function(a,b){this.readChildNodes(a,b)},patches:function(a,b){this.readChildNodes(a,b)},PolygonPatch:function(a,b){this.readers.gml.Polygon.apply(this,[a,b])},exterior:function(a,
b){var c={};this.readChildNodes(a,c);b.outer=c.components[0]},interior:function(a,b){var c={};this.readChildNodes(a,c);b.inner.push(c.components[0])},MultiCurve:function(a,b){var c={components:[]};this.readChildNodes(a,c);0<c.components.length&&(b.components=[new OpenLayers.Geometry.MultiLineString(c.components)])},curveMember:function(a,b){this.readChildNodes(a,b)},MultiSurface:function(a,b){var c={components:[]};this.readChildNodes(a,c);0<c.components.length&&(b.components=[new OpenLayers.Geometry.MultiPolygon(c.components)])},
surfaceMember:function(a,b){this.readChildNodes(a,b)},surfaceMembers:function(a,b){this.readChildNodes(a,b)},pointMembers:function(a,b){this.readChildNodes(a,b)},lineStringMembers:function(a,b){this.readChildNodes(a,b)},polygonMembers:function(a,b){this.readChildNodes(a,b)},geometryMembers:function(a,b){this.readChildNodes(a,b)},Envelope:function(a,b){var c={points:Array(2)};this.readChildNodes(a,c);b.components||(b.components=[]);var d=c.points[0],c=c.points[1];b.components.push(new OpenLayers.Bounds(d.x,
d.y,c.x,c.y))},lowerCorner:function(a,b){var c={};this.readers.gml.pos.apply(this,[a,c]);b.points[0]=c.points[0]},upperCorner:function(a,b){var c={};this.readers.gml.pos.apply(this,[a,c]);b.points[1]=c.points[0]}},OpenLayers.Format.GML.Base.prototype.readers.gml),feature:OpenLayers.Format.GML.Base.prototype.readers.feature,wfs:OpenLayers.Format.GML.Base.prototype.readers.wfs},write:function(a){a=this.writeNode("gml:"+(OpenLayers.Util.isArray(a)?"featureMembers":"featureMember"),a);this.setAttributeNS(a,
this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation);return OpenLayers.Format.XML.prototype.write.apply(this,[a])},writers:{gml:OpenLayers.Util.applyDefaults({featureMembers:function(a){for(var b=this.createElementNSPlus("gml:featureMembers"),c=0,d=a.length;c<d;++c)this.writeNode("feature:_typeName",a[c],b);return b},Point:function(a){var b=this.createElementNSPlus("gml:Point");this.writeNode("pos",a,b);return b},pos:function(a){return this.createElementNSPlus("gml:pos",{value:this.xy?a.x+
" "+a.y:a.y+" "+a.x})},LineString:function(a){var b=this.createElementNSPlus("gml:LineString");this.writeNode("posList",a.components,b);return b},Curve:function(a){var b=this.createElementNSPlus("gml:Curve");this.writeNode("segments",a,b);return b},segments:function(a){var b=this.createElementNSPlus("gml:segments");this.writeNode("LineStringSegment",a,b);return b},LineStringSegment:function(a){var b=this.createElementNSPlus("gml:LineStringSegment");this.writeNode("posList",a.components,b);return b},
posList:function(a){for(var b=a.length,c=Array(b),d,e=0;e<b;++e)d=a[e],c[e]=this.xy?d.x+" "+d.y:d.y+" "+d.x;return this.createElementNSPlus("gml:posList",{value:c.join(" ")})},Surface:function(a){var b=this.createElementNSPlus("gml:Surface");this.writeNode("patches",a,b);return b},patches:function(a){var b=this.createElementNSPlus("gml:patches");this.writeNode("PolygonPatch",a,b);return b},PolygonPatch:function(a){var b=this.createElementNSPlus("gml:PolygonPatch",{attributes:{interpolation:"planar"}});
this.writeNode("exterior",a.components[0],b);for(var c=1,d=a.components.length;c<d;++c)this.writeNode("interior",a.components[c],b);return b},Polygon:function(a){var b=this.createElementNSPlus("gml:Polygon");this.writeNode("exterior",a.components[0],b);for(var c=1,d=a.components.length;c<d;++c)this.writeNode("interior",a.components[c],b);return b},exterior:function(a){var b=this.createElementNSPlus("gml:exterior");this.writeNode("LinearRing",a,b);return b},interior:function(a){var b=this.createElementNSPlus("gml:interior");
this.writeNode("LinearRing",a,b);return b},LinearRing:function(a){var b=this.createElementNSPlus("gml:LinearRing");this.writeNode("posList",a.components,b);return b},MultiCurve:function(a){for(var b=this.createElementNSPlus("gml:MultiCurve"),a=a.components||[a],c=0,d=a.length;c<d;++c)this.writeNode("curveMember",a[c],b);return b},curveMember:function(a){var b=this.createElementNSPlus("gml:curveMember");this.curve?this.writeNode("Curve",a,b):this.writeNode("LineString",a,b);return b},MultiSurface:function(a){for(var b=
this.createElementNSPlus("gml:MultiSurface"),a=a.components||[a],c=0,d=a.length;c<d;++c)this.writeNode("surfaceMember",a[c],b);return b},surfaceMember:function(a){var b=this.createElementNSPlus("gml:surfaceMember");this.surface?this.writeNode("Surface",a,b):this.writeNode("Polygon",a,b);return b},Envelope:function(a){var b=this.createElementNSPlus("gml:Envelope");this.writeNode("lowerCorner",a,b);this.writeNode("upperCorner",a,b);this.srsName&&b.setAttribute("srsName",this.srsName);return b},lowerCorner:function(a){return this.createElementNSPlus("gml:lowerCorner",
{value:this.xy?a.left+" "+a.bottom:a.bottom+" "+a.left})},upperCorner:function(a){return this.createElementNSPlus("gml:upperCorner",{value:this.xy?a.right+" "+a.top:a.top+" "+a.right})}},OpenLayers.Format.GML.Base.prototype.writers.gml),feature:OpenLayers.Format.GML.Base.prototype.writers.feature,wfs:OpenLayers.Format.GML.Base.prototype.writers.wfs},setGeometryTypes:function(){this.geometryTypes={"OpenLayers.Geometry.Point":"Point","OpenLayers.Geometry.MultiPoint":"MultiPoint","OpenLayers.Geometry.LineString":!0===
this.curve?"Curve":"LineString","OpenLayers.Geometry.MultiLineString":!1===this.multiCurve?"MultiLineString":"MultiCurve","OpenLayers.Geometry.Polygon":!0===this.surface?"Surface":"Polygon","OpenLayers.Geometry.MultiPolygon":!1===this.multiSurface?"MultiPolygon":"MultiSurface","OpenLayers.Geometry.Collection":"GeometryCollection"}},CLASS_NAME:"OpenLayers.Format.GML.v3"});OpenLayers.Format.Filter.v1_1_0=OpenLayers.Class(OpenLayers.Format.GML.v3,OpenLayers.Format.Filter.v1,{VERSION:"1.1.0",schemaLocation:"http://www.opengis.net/ogc/filter/1.1.0/filter.xsd",initialize:function(a){OpenLayers.Format.GML.v3.prototype.initialize.apply(this,[a])},readers:{ogc:OpenLayers.Util.applyDefaults({PropertyIsEqualTo:function(a,b){var c=a.getAttribute("matchCase"),c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,matchCase:!("false"===c||"0"===c)});this.readChildNodes(a,
c);b.filters.push(c)},PropertyIsNotEqualTo:function(a,b){var c=a.getAttribute("matchCase"),c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.NOT_EQUAL_TO,matchCase:!("false"===c||"0"===c)});this.readChildNodes(a,c);b.filters.push(c)},PropertyIsLike:function(a,b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LIKE});this.readChildNodes(a,c);var d=a.getAttribute("wildCard"),e=a.getAttribute("singleChar"),f=a.getAttribute("escapeChar");c.value2regex(d,e,
f);b.filters.push(c)}},OpenLayers.Format.Filter.v1.prototype.readers.ogc),gml:OpenLayers.Format.GML.v3.prototype.readers.gml,feature:OpenLayers.Format.GML.v3.prototype.readers.feature},writers:{ogc:OpenLayers.Util.applyDefaults({PropertyIsEqualTo:function(a){var b=this.createElementNSPlus("ogc:PropertyIsEqualTo",{attributes:{matchCase:a.matchCase}});this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsNotEqualTo:function(a){var b=this.createElementNSPlus("ogc:PropertyIsNotEqualTo",
{attributes:{matchCase:a.matchCase}});this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsLike:function(a){var b=this.createElementNSPlus("ogc:PropertyIsLike",{attributes:{matchCase:a.matchCase,wildCard:"*",singleChar:".",escapeChar:"!"}});this.writeNode("PropertyName",a,b);this.writeNode("Literal",a.regex2value(),b);return b},BBOX:function(a){var b=this.createElementNSPlus("ogc:BBOX");a.property&&this.writeNode("PropertyName",a,b);var c=this.writeNode("gml:Envelope",
a.value);a.projection&&c.setAttribute("srsName",a.projection);b.appendChild(c);return b},SortBy:function(a){for(var b=this.createElementNSPlus("ogc:SortBy"),c=0,d=a.length;c<d;c++)this.writeNode("ogc:SortProperty",a[c],b);return b},SortProperty:function(a){var b=this.createElementNSPlus("ogc:SortProperty");this.writeNode("ogc:PropertyName",a,b);this.writeNode("ogc:SortOrder","DESC"==a.order?"DESC":"ASC",b);return b},SortOrder:function(a){return this.createElementNSPlus("ogc:SortOrder",{value:a})}},
OpenLayers.Format.Filter.v1.prototype.writers.ogc),gml:OpenLayers.Format.GML.v3.prototype.writers.gml,feature:OpenLayers.Format.GML.v3.prototype.writers.feature},writeSpatial:function(a,b){var c=this.createElementNSPlus("ogc:"+b);this.writeNode("PropertyName",a,c);if(a.value instanceof OpenLayers.Filter.Function)this.writeNode("Function",a.value,c);else{var d;d=a.value instanceof OpenLayers.Geometry?this.writeNode("feature:_geometry",a.value).firstChild:this.writeNode("gml:Envelope",a.value);a.projection&&
d.setAttribute("srsName",a.projection);c.appendChild(d)}return c},CLASS_NAME:"OpenLayers.Format.Filter.v1_1_0"});OpenLayers.Format.OWSCommon=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.0.0",getVersion:function(a){var b=this.version;b||((a=a.getAttribute("xmlns:ows"))&&"1.1"===a.substring(a.lastIndexOf("/")+1)&&(b="1.1.0"),b||(b=this.defaultVersion));return b},CLASS_NAME:"OpenLayers.Format.OWSCommon"});OpenLayers.Format.OWSCommon.v1=OpenLayers.Class(OpenLayers.Format.XML,{regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},read:function(a,b){OpenLayers.Util.applyDefaults(b,this.options);var c={};this.readChildNodes(a,c);return c},readers:{ows:{Exception:function(a,b){var c={code:a.getAttribute("exceptionCode"),locator:a.getAttribute("locator"),texts:[]};b.exceptions.push(c);this.readChildNodes(a,c)},ExceptionText:function(a,b){var c=this.getChildValue(a);b.texts.push(c)},
ServiceIdentification:function(a,b){b.serviceIdentification={};this.readChildNodes(a,b.serviceIdentification)},Title:function(a,b){b.title=this.getChildValue(a)},Abstract:function(a,b){b["abstract"]=this.getChildValue(a)},Keywords:function(a,b){b.keywords={};this.readChildNodes(a,b.keywords)},Keyword:function(a,b){b[this.getChildValue(a)]=!0},ServiceType:function(a,b){b.serviceType={codeSpace:a.getAttribute("codeSpace"),value:this.getChildValue(a)}},ServiceTypeVersion:function(a,b){b.serviceTypeVersion=
this.getChildValue(a)},Fees:function(a,b){b.fees=this.getChildValue(a)},AccessConstraints:function(a,b){b.accessConstraints=this.getChildValue(a)},ServiceProvider:function(a,b){b.serviceProvider={};this.readChildNodes(a,b.serviceProvider)},ProviderName:function(a,b){b.providerName=this.getChildValue(a)},ProviderSite:function(a,b){b.providerSite=this.getAttributeNS(a,this.namespaces.xlink,"href")},ServiceContact:function(a,b){b.serviceContact={};this.readChildNodes(a,b.serviceContact)},IndividualName:function(a,
b){b.individualName=this.getChildValue(a)},PositionName:function(a,b){b.positionName=this.getChildValue(a)},ContactInfo:function(a,b){b.contactInfo={};this.readChildNodes(a,b.contactInfo)},Phone:function(a,b){b.phone={};this.readChildNodes(a,b.phone)},Voice:function(a,b){b.voice=this.getChildValue(a)},Address:function(a,b){b.address={};this.readChildNodes(a,b.address)},DeliveryPoint:function(a,b){b.deliveryPoint=this.getChildValue(a)},City:function(a,b){b.city=this.getChildValue(a)},AdministrativeArea:function(a,
b){b.administrativeArea=this.getChildValue(a)},PostalCode:function(a,b){b.postalCode=this.getChildValue(a)},Country:function(a,b){b.country=this.getChildValue(a)},ElectronicMailAddress:function(a,b){b.electronicMailAddress=this.getChildValue(a)},Role:function(a,b){b.role=this.getChildValue(a)},OperationsMetadata:function(a,b){b.operationsMetadata={};this.readChildNodes(a,b.operationsMetadata)},Operation:function(a,b){var c=a.getAttribute("name");b[c]={};this.readChildNodes(a,b[c])},DCP:function(a,
b){b.dcp={};this.readChildNodes(a,b.dcp)},HTTP:function(a,b){b.http={};this.readChildNodes(a,b.http)},Get:function(a,b){b.get||(b.get=[]);var c={url:this.getAttributeNS(a,this.namespaces.xlink,"href")};this.readChildNodes(a,c);b.get.push(c)},Post:function(a,b){b.post||(b.post=[]);var c={url:this.getAttributeNS(a,this.namespaces.xlink,"href")};this.readChildNodes(a,c);b.post.push(c)},Parameter:function(a,b){b.parameters||(b.parameters={});var c=a.getAttribute("name");b.parameters[c]={};this.readChildNodes(a,
b.parameters[c])},Constraint:function(a,b){b.constraints||(b.constraints={});var c=a.getAttribute("name");b.constraints[c]={};this.readChildNodes(a,b.constraints[c])},Value:function(a,b){b[this.getChildValue(a)]=!0},OutputFormat:function(a,b){b.formats.push({value:this.getChildValue(a)});this.readChildNodes(a,b)},WGS84BoundingBox:function(a,b){var c={};c.crs=a.getAttribute("crs");b.BoundingBox?b.BoundingBox.push(c):(b.projection=c.crs,c=b);this.readChildNodes(a,c)},BoundingBox:function(a,b){this.readers.ows.WGS84BoundingBox.apply(this,
[a,b])},LowerCorner:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,""),c=c.replace(this.regExes.trimComma,","),c=c.split(this.regExes.splitSpace);b.left=c[0];b.bottom=c[1]},UpperCorner:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,""),c=c.replace(this.regExes.trimComma,","),c=c.split(this.regExes.splitSpace);b.right=c[0];b.top=c[1];b.bounds=new OpenLayers.Bounds(b.left,b.bottom,b.right,b.top);delete b.left;delete b.bottom;delete b.right;delete b.top},
Language:function(a,b){b.language=this.getChildValue(a)}}},writers:{ows:{BoundingBox:function(a){var b=this.createElementNSPlus("ows:BoundingBox",{attributes:{crs:a.projection}});this.writeNode("ows:LowerCorner",a,b);this.writeNode("ows:UpperCorner",a,b);return b},LowerCorner:function(a){return this.createElementNSPlus("ows:LowerCorner",{value:a.bounds.left+" "+a.bounds.bottom})},UpperCorner:function(a){return this.createElementNSPlus("ows:UpperCorner",{value:a.bounds.right+" "+a.bounds.top})},Identifier:function(a){return this.createElementNSPlus("ows:Identifier",
{value:a})},Title:function(a){return this.createElementNSPlus("ows:Title",{value:a})},Abstract:function(a){return this.createElementNSPlus("ows:Abstract",{value:a})},OutputFormat:function(a){return this.createElementNSPlus("ows:OutputFormat",{value:a})}}},CLASS_NAME:"OpenLayers.Format.OWSCommon.v1"});OpenLayers.Format.OWSCommon.v1_0_0=OpenLayers.Class(OpenLayers.Format.OWSCommon.v1,{namespaces:{ows:"http://www.opengis.net/ows",xlink:"http://www.w3.org/1999/xlink"},readers:{ows:OpenLayers.Util.applyDefaults({ExceptionReport:function(a,b){b.success=!1;b.exceptionReport={version:a.getAttribute("version"),language:a.getAttribute("language"),exceptions:[]};this.readChildNodes(a,b.exceptionReport)}},OpenLayers.Format.OWSCommon.v1.prototype.readers.ows)},writers:{ows:OpenLayers.Format.OWSCommon.v1.prototype.writers.ows},
CLASS_NAME:"OpenLayers.Format.OWSCommon.v1_0_0"});OpenLayers.Format.WFST.v1_1_0=OpenLayers.Class(OpenLayers.Format.Filter.v1_1_0,OpenLayers.Format.WFST.v1,{version:"1.1.0",schemaLocations:{wfs:"http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"},initialize:function(a){OpenLayers.Format.Filter.v1_1_0.prototype.initialize.apply(this,[a]);OpenLayers.Format.WFST.v1.prototype.initialize.apply(this,[a])},readNode:function(a,b){return OpenLayers.Format.GML.v3.prototype.readNode.apply(this,[a,b])},readers:{wfs:OpenLayers.Util.applyDefaults({FeatureCollection:function(a,
b){b.numberOfFeatures=parseInt(a.getAttribute("numberOfFeatures"));OpenLayers.Format.WFST.v1.prototype.readers.wfs.FeatureCollection.apply(this,arguments)},TransactionResponse:function(a,b){b.insertIds=[];b.success=!1;this.readChildNodes(a,b)},TransactionSummary:function(a,b){b.success=!0},InsertResults:function(a,b){this.readChildNodes(a,b)},Feature:function(a,b){var c={fids:[]};this.readChildNodes(a,c);b.insertIds.push(c.fids[0])}},OpenLayers.Format.WFST.v1.prototype.readers.wfs),gml:OpenLayers.Format.GML.v3.prototype.readers.gml,
feature:OpenLayers.Format.GML.v3.prototype.readers.feature,ogc:OpenLayers.Format.Filter.v1_1_0.prototype.readers.ogc,ows:OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows},writers:{wfs:OpenLayers.Util.applyDefaults({GetFeature:function(a){var b=OpenLayers.Format.WFST.v1.prototype.writers.wfs.GetFeature.apply(this,arguments);a&&this.setAttributes(b,{resultType:a.resultType,startIndex:a.startIndex,count:a.count});return b},Query:function(a){var a=OpenLayers.Util.extend({featureNS:this.featureNS,
featurePrefix:this.featurePrefix,featureType:this.featureType,srsName:this.srsName},a),b=a.featurePrefix,c=this.createElementNSPlus("wfs:Query",{attributes:{typeName:(b?b+":":"")+a.featureType,srsName:a.srsName}});a.featureNS&&c.setAttribute("xmlns:"+b,a.featureNS);if(a.propertyNames)for(var b=0,d=a.propertyNames.length;b<d;b++)this.writeNode("wfs:PropertyName",{property:a.propertyNames[b]},c);a.filter&&(OpenLayers.Format.WFST.v1_1_0.prototype.setFilterProperty.call(this,a.filter),this.writeNode("ogc:Filter",
a.filter,c));return c},PropertyName:function(a){return this.createElementNSPlus("wfs:PropertyName",{value:a.property})}},OpenLayers.Format.WFST.v1.prototype.writers.wfs),gml:OpenLayers.Format.GML.v3.prototype.writers.gml,feature:OpenLayers.Format.GML.v3.prototype.writers.feature,ogc:OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc},CLASS_NAME:"OpenLayers.Format.WFST.v1_1_0"});OpenLayers.Protocol=OpenLayers.Class({format:null,options:null,autoDestroy:!0,defaultFilter:null,initialize:function(a){a=a||{};OpenLayers.Util.extend(this,a);this.options=a},mergeWithDefaultFilter:function(a){return a&&this.defaultFilter?new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.AND,filters:[this.defaultFilter,a]}):a||this.defaultFilter||void 0},destroy:function(){this.format=this.options=null},read:function(a){a=a||{};a.filter=this.mergeWithDefaultFilter(a.filter)},create:function(){},
update:function(){},"delete":function(){},commit:function(){},abort:function(){},createCallback:function(a,b,c){return OpenLayers.Function.bind(function(){a.apply(this,[b,c])},this)},CLASS_NAME:"OpenLayers.Protocol"});OpenLayers.Protocol.Response=OpenLayers.Class({code:null,requestType:null,last:!0,features:null,data:null,reqFeatures:null,priv:null,error:null,initialize:function(a){OpenLayers.Util.extend(this,a)},success:function(){return 0<this.code},CLASS_NAME:"OpenLayers.Protocol.Response"});
OpenLayers.Protocol.Response.SUCCESS=1;OpenLayers.Protocol.Response.FAILURE=0;OpenLayers.Format.JSON=OpenLayers.Class(OpenLayers.Format,{indent:"    ",space:" ",newline:"\n",level:0,pretty:!1,nativeJSON:function(){return!(!window.JSON||!("function"==typeof JSON.parse&&"function"==typeof JSON.stringify))}(),read:function(a,b){var c;if(this.nativeJSON)c=JSON.parse(a,b);else try{if(/^[\],:{}\s]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))&&(c=eval("("+a+")"),"function"===
typeof b)){var d=function(a,c){if(c&&"object"===typeof c)for(var e in c)c.hasOwnProperty(e)&&(c[e]=d(e,c[e]));return b(a,c)};c=d("",c)}}catch(e){}this.keepData&&(this.data=c);return c},write:function(a,b){this.pretty=!!b;var c=null,d=typeof a;if(this.serialize[d])try{c=!this.pretty&&this.nativeJSON?JSON.stringify(a):this.serialize[d].apply(this,[a])}catch(e){OpenLayers.Console.error("Trouble serializing: "+e)}return c},writeIndent:function(){var a=[];if(this.pretty)for(var b=0;b<this.level;++b)a.push(this.indent);
return a.join("")},writeNewline:function(){return this.pretty?this.newline:""},writeSpace:function(){return this.pretty?this.space:""},serialize:{object:function(a){if(null==a)return"null";if(a.constructor==Date)return this.serialize.date.apply(this,[a]);if(a.constructor==Array)return this.serialize.array.apply(this,[a]);var b=["{"];this.level+=1;var c,d,e,f=!1;for(c in a)a.hasOwnProperty(c)&&(d=OpenLayers.Format.JSON.prototype.write.apply(this,[c,this.pretty]),e=OpenLayers.Format.JSON.prototype.write.apply(this,
[a[c],this.pretty]),null!=d&&null!=e&&(f&&b.push(","),b.push(this.writeNewline(),this.writeIndent(),d,":",this.writeSpace(),e),f=!0));this.level-=1;b.push(this.writeNewline(),this.writeIndent(),"}");return b.join("")},array:function(a){var b,c=["["];this.level+=1;for(var d=0,e=a.length;d<e;++d)b=OpenLayers.Format.JSON.prototype.write.apply(this,[a[d],this.pretty]),null!=b&&(0<d&&c.push(","),c.push(this.writeNewline(),this.writeIndent(),b));this.level-=1;c.push(this.writeNewline(),this.writeIndent(),
"]");return c.join("")},string:function(a){var b={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};return/["\\\x00-\x1f]/.test(a)?'"'+a.replace(/([\x00-\x1f\\"])/g,function(a,d){var e=b[d];if(e)return e;e=d.charCodeAt();return"\\u00"+Math.floor(e/16).toString(16)+(e%16).toString(16)})+'"':'"'+a+'"'},number:function(a){return isFinite(a)?""+a:"null"},"boolean":function(a){return""+a},date:function(a){function b(a){return 10>a?"0"+a:a}return'"'+a.getFullYear()+"-"+
b(a.getMonth()+1)+"-"+b(a.getDate())+"T"+b(a.getHours())+":"+b(a.getMinutes())+":"+b(a.getSeconds())+'"'}},CLASS_NAME:"OpenLayers.Format.JSON"});OpenLayers.Format.GeoJSON=OpenLayers.Class(OpenLayers.Format.JSON,{ignoreExtraDims:!1,read:function(a,b,c){var b=b?b:"FeatureCollection",d=null,e=null;if(e="string"==typeof a?OpenLayers.Format.JSON.prototype.read.apply(this,[a,c]):a)if("string"!=typeof e.type)OpenLayers.Console.error("Bad GeoJSON - no type: "+a);else{if(this.isValidType(e,b))switch(b){case "Geometry":try{d=this.parseGeometry(e)}catch(f){OpenLayers.Console.error(f)}break;case "Feature":try{d=this.parseFeature(e),d.type="Feature"}catch(g){OpenLayers.Console.error(g)}break;
case "FeatureCollection":switch(d=[],e.type){case "Feature":try{d.push(this.parseFeature(e))}catch(h){d=null,OpenLayers.Console.error(h)}break;case "FeatureCollection":a=0;for(b=e.features.length;a<b;++a)try{d.push(this.parseFeature(e.features[a]))}catch(i){d=null,OpenLayers.Console.error(i)}break;default:try{var j=this.parseGeometry(e);d.push(new OpenLayers.Feature.Vector(j))}catch(k){d=null,OpenLayers.Console.error(k)}}}}else OpenLayers.Console.error("Bad JSON: "+a);return d},isValidType:function(a,
b){var c=!1;switch(b){case "Geometry":-1==OpenLayers.Util.indexOf("Point MultiPoint LineString MultiLineString Polygon MultiPolygon Box GeometryCollection".split(" "),a.type)?OpenLayers.Console.error("Unsupported geometry type: "+a.type):c=!0;break;case "FeatureCollection":c=!0;break;default:a.type==b?c=!0:OpenLayers.Console.error("Cannot convert types from "+a.type+" to "+b)}return c},parseFeature:function(a){var b,c,d;c=a.properties?a.properties:{};d=a.geometry&&a.geometry.bbox||a.bbox;try{b=this.parseGeometry(a.geometry)}catch(e){throw e;
}b=new OpenLayers.Feature.Vector(b,c);d&&(b.bounds=OpenLayers.Bounds.fromArray(d));a.id&&(b.fid=a.id);return b},parseGeometry:function(a){if(null==a)return null;var b,c=!1;if("GeometryCollection"==a.type){if(!OpenLayers.Util.isArray(a.geometries))throw"GeometryCollection must have geometries array: "+a;b=a.geometries.length;for(var c=Array(b),d=0;d<b;++d)c[d]=this.parseGeometry.apply(this,[a.geometries[d]]);b=new OpenLayers.Geometry.Collection(c);c=!0}else{if(!OpenLayers.Util.isArray(a.coordinates))throw"Geometry must have coordinates array: "+
a;if(!this.parseCoords[a.type.toLowerCase()])throw"Unsupported geometry type: "+a.type;try{b=this.parseCoords[a.type.toLowerCase()].apply(this,[a.coordinates])}catch(e){throw e;}}this.internalProjection&&(this.externalProjection&&!c)&&b.transform(this.externalProjection,this.internalProjection);return b},parseCoords:{point:function(a){if(!1==this.ignoreExtraDims&&2!=a.length)throw"Only 2D points are supported: "+a;return new OpenLayers.Geometry.Point(a[0],a[1])},multipoint:function(a){for(var b=[],
c=null,d=0,e=a.length;d<e;++d){try{c=this.parseCoords.point.apply(this,[a[d]])}catch(f){throw f;}b.push(c)}return new OpenLayers.Geometry.MultiPoint(b)},linestring:function(a){for(var b=[],c=null,d=0,e=a.length;d<e;++d){try{c=this.parseCoords.point.apply(this,[a[d]])}catch(f){throw f;}b.push(c)}return new OpenLayers.Geometry.LineString(b)},multilinestring:function(a){for(var b=[],c=null,d=0,e=a.length;d<e;++d){try{c=this.parseCoords.linestring.apply(this,[a[d]])}catch(f){throw f;}b.push(c)}return new OpenLayers.Geometry.MultiLineString(b)},
polygon:function(a){for(var b=[],c,d,e=0,f=a.length;e<f;++e){try{d=this.parseCoords.linestring.apply(this,[a[e]])}catch(g){throw g;}c=new OpenLayers.Geometry.LinearRing(d.components);b.push(c)}return new OpenLayers.Geometry.Polygon(b)},multipolygon:function(a){for(var b=[],c=null,d=0,e=a.length;d<e;++d){try{c=this.parseCoords.polygon.apply(this,[a[d]])}catch(f){throw f;}b.push(c)}return new OpenLayers.Geometry.MultiPolygon(b)},box:function(a){if(2!=a.length)throw"GeoJSON box coordinates must have 2 elements";
return new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(a[0][0],a[0][1]),new OpenLayers.Geometry.Point(a[1][0],a[0][1]),new OpenLayers.Geometry.Point(a[1][0],a[1][1]),new OpenLayers.Geometry.Point(a[0][0],a[1][1]),new OpenLayers.Geometry.Point(a[0][0],a[0][1])])])}},write:function(a,b){var c={type:null};if(OpenLayers.Util.isArray(a)){c.type="FeatureCollection";var d=a.length;c.features=Array(d);for(var e=0;e<d;++e){var f=a[e];if(!f instanceof OpenLayers.Feature.Vector)throw"FeatureCollection only supports collections of features: "+
f;c.features[e]=this.extract.feature.apply(this,[f])}}else 0==a.CLASS_NAME.indexOf("OpenLayers.Geometry")?c=this.extract.geometry.apply(this,[a]):a instanceof OpenLayers.Feature.Vector&&(c=this.extract.feature.apply(this,[a]),a.layer&&a.layer.projection&&(c.crs=this.createCRSObject(a)));return OpenLayers.Format.JSON.prototype.write.apply(this,[c,b])},createCRSObject:function(a){var a=a.layer.projection.toString(),b={};a.match(/epsg:/i)&&(a=parseInt(a.substring(a.indexOf(":")+1)),b=4326==a?{type:"name",
properties:{name:"urn:ogc:def:crs:OGC:1.3:CRS84"}}:{type:"name",properties:{name:"EPSG:"+a}});return b},extract:{feature:function(a){var b=this.extract.geometry.apply(this,[a.geometry]),b={type:"Feature",properties:a.attributes,geometry:b};null!=a.fid&&(b.id=a.fid);return b},geometry:function(a){if(null==a)return null;this.internalProjection&&this.externalProjection&&(a=a.clone(),a.transform(this.internalProjection,this.externalProjection));var b=a.CLASS_NAME.split(".")[2],a=this.extract[b.toLowerCase()].apply(this,
[a]);return"Collection"==b?{type:"GeometryCollection",geometries:a}:{type:b,coordinates:a}},point:function(a){return[a.x,a.y]},multipoint:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push(this.extract.point.apply(this,[a.components[c]]));return b},linestring:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push(this.extract.point.apply(this,[a.components[c]]));return b},multilinestring:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push(this.extract.linestring.apply(this,
[a.components[c]]));return b},polygon:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push(this.extract.linestring.apply(this,[a.components[c]]));return b},multipolygon:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push(this.extract.polygon.apply(this,[a.components[c]]));return b},collection:function(a){for(var b=a.components.length,c=Array(b),d=0;d<b;++d)c[d]=this.extract.geometry.apply(this,[a.components[d]]);return c}},CLASS_NAME:"OpenLayers.Format.GeoJSON"});OpenLayers.Protocol.Script=OpenLayers.Class(OpenLayers.Protocol,{url:null,params:null,callback:null,callbackTemplate:"OpenLayers.Protocol.Script.registry.${id}",callbackKey:"callback",callbackPrefix:"",scope:null,format:null,pendingRequests:null,srsInBBOX:!1,initialize:function(a){a=a||{};this.params={};this.pendingRequests={};OpenLayers.Protocol.prototype.initialize.apply(this,arguments);this.format||(this.format=new OpenLayers.Format.GeoJSON);if(!this.filterToParams&&OpenLayers.Format.QueryStringFilter){var b=
new OpenLayers.Format.QueryStringFilter({srsInBBOX:this.srsInBBOX});this.filterToParams=function(a,d){return b.write(a,d)}}},read:function(a){OpenLayers.Protocol.prototype.read.apply(this,arguments);a=OpenLayers.Util.applyDefaults(a,this.options);a.params=OpenLayers.Util.applyDefaults(a.params,this.options.params);a.filter&&this.filterToParams&&(a.params=this.filterToParams(a.filter,a.params));var b=new OpenLayers.Protocol.Response({requestType:"read"}),c=this.createRequest(a.url,a.params,OpenLayers.Function.bind(function(c){b.data=
c;this.handleRead(b,a)},this));b.priv=c;return b},createRequest:function(a,b,c){var c=OpenLayers.Protocol.Script.register(c),d=OpenLayers.String.format(this.callbackTemplate,{id:c}),b=OpenLayers.Util.extend({},b);b[this.callbackKey]=this.callbackPrefix+d;a=OpenLayers.Util.urlAppend(a,OpenLayers.Util.getParameterString(b));b=document.createElement("script");b.type="text/javascript";b.src=a;b.id="OpenLayers_Protocol_Script_"+c;this.pendingRequests[b.id]=b;document.getElementsByTagName("head")[0].appendChild(b);
return b},destroyRequest:function(a){OpenLayers.Protocol.Script.unregister(a.id.split("_").pop());delete this.pendingRequests[a.id];a.parentNode&&a.parentNode.removeChild(a)},handleRead:function(a,b){this.handleResponse(a,b)},handleResponse:function(a,b){b.callback&&(a.data?(a.features=this.parseFeatures(a.data),a.code=OpenLayers.Protocol.Response.SUCCESS):a.code=OpenLayers.Protocol.Response.FAILURE,this.destroyRequest(a.priv),b.callback.call(b.scope,a))},parseFeatures:function(a){return this.format.read(a)},
abort:function(a){if(a)this.destroyRequest(a.priv);else for(var b in this.pendingRequests)this.destroyRequest(this.pendingRequests[b])},destroy:function(){this.abort();delete this.params;delete this.format;OpenLayers.Protocol.prototype.destroy.apply(this)},CLASS_NAME:"OpenLayers.Protocol.Script"});(function(){var a=OpenLayers.Protocol.Script,b=0;a.registry={};a.register=function(c){var d="c"+ ++b;a.registry[d]=function(){c.apply(this,arguments)};return d};a.unregister=function(b){delete a.registry[b]}})();OpenLayers.Control.Panel=OpenLayers.Class(OpenLayers.Control,{controls:null,autoActivate:!0,defaultControl:null,saveState:!1,allowDepress:!1,activeState:null,initialize:function(a){OpenLayers.Control.prototype.initialize.apply(this,[a]);this.controls=[];this.activeState={}},destroy:function(){this.map&&this.map.events.unregister("buttonclick",this,this.onButtonClick);OpenLayers.Control.prototype.destroy.apply(this,arguments);for(var a,b=this.controls.length-1;0<=b;b--)a=this.controls[b],a.events&&
a.events.un({activate:this.iconOn,deactivate:this.iconOff}),a.panel_div=null;this.activeState=null},activate:function(){if(OpenLayers.Control.prototype.activate.apply(this,arguments)){for(var a,b=0,c=this.controls.length;b<c;b++)a=this.controls[b],(a===this.defaultControl||this.saveState&&this.activeState[a.id])&&a.activate();!0===this.saveState&&(this.defaultControl=null);this.redraw();return!0}return!1},deactivate:function(){if(OpenLayers.Control.prototype.deactivate.apply(this,arguments)){for(var a,
b=0,c=this.controls.length;b<c;b++)a=this.controls[b],this.activeState[a.id]=a.deactivate();this.redraw();return!0}return!1},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);this.outsideViewport?(this.events.attachToElement(this.div),this.events.register("buttonclick",this,this.onButtonClick)):this.map.events.register("buttonclick",this,this.onButtonClick);this.addControlsToMap(this.controls);return this.div},redraw:function(){for(var a=this.div.childNodes.length-1;0<=a;a--)this.div.removeChild(this.div.childNodes[a]);
this.div.innerHTML="";if(this.active)for(var a=0,b=this.controls.length;a<b;a++)this.div.appendChild(this.controls[a].panel_div)},activateControl:function(a){if(!this.active)return!1;if(a.type==OpenLayers.Control.TYPE_BUTTON)a.trigger();else if(a.type==OpenLayers.Control.TYPE_TOGGLE)a.active?a.deactivate():a.activate();else if(this.allowDepress&&a.active)a.deactivate();else{for(var b,c=0,d=this.controls.length;c<d;c++)b=this.controls[c],b!=a&&(b.type===OpenLayers.Control.TYPE_TOOL||null==b.type)&&
b.deactivate();a.activate()}},addControls:function(a){OpenLayers.Util.isArray(a)||(a=[a]);this.controls=this.controls.concat(a);for(var b=0,c=a.length;b<c;b++){var d=a[b],e=this.createControlMarkup(d);OpenLayers.Element.addClass(e,d.displayClass+"ItemInactive");OpenLayers.Element.addClass(e,"olButton");""!=d.title&&!e.title&&(e.title=d.title);d.panel_div=e}this.map&&(this.addControlsToMap(a),this.redraw())},createControlMarkup:function(){return document.createElement("div")},addControlsToMap:function(a){for(var b,
c=0,d=a.length;c<d;c++)b=a[c],!0===b.autoActivate?(b.autoActivate=!1,this.map.addControl(b),b.autoActivate=!0):(this.map.addControl(b),b.deactivate()),b.events.on({activate:this.iconOn,deactivate:this.iconOff})},iconOn:function(){var a=this.panel_div;a.className=a.className.replace(RegExp("\\b("+this.displayClass+"Item)Inactive\\b"),"$1Active")},iconOff:function(){var a=this.panel_div;a.className=a.className.replace(RegExp("\\b("+this.displayClass+"Item)Active\\b"),"$1Inactive")},onButtonClick:function(a){for(var b=
this.controls,a=a.buttonElement,c=b.length-1;0<=c;--c)if(b[c].panel_div===a){this.activateControl(b[c]);break}},getControlsBy:function(a,b){var c="function"==typeof b.test;return OpenLayers.Array.filter(this.controls,function(d){return d[a]==b||c&&b.test(d[a])})},getControlsByName:function(a){return this.getControlsBy("name",a)},getControlsByClass:function(a){return this.getControlsBy("CLASS_NAME",a)},CLASS_NAME:"OpenLayers.Control.Panel"});OpenLayers.Control.ZoomIn=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){this.map.zoomIn()},CLASS_NAME:"OpenLayers.Control.ZoomIn"});OpenLayers.Control.ZoomOut=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){this.map.zoomOut()},CLASS_NAME:"OpenLayers.Control.ZoomOut"});OpenLayers.Control.ZoomToMaxExtent=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){this.map&&this.map.zoomToMaxExtent()},CLASS_NAME:"OpenLayers.Control.ZoomToMaxExtent"});OpenLayers.Control.ZoomPanel=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(a){OpenLayers.Control.Panel.prototype.initialize.apply(this,[a]);this.addControls([new OpenLayers.Control.ZoomIn,new OpenLayers.Control.ZoomToMaxExtent,new OpenLayers.Control.ZoomOut])},CLASS_NAME:"OpenLayers.Control.ZoomPanel"});OpenLayers.Layer.HTTPRequest=OpenLayers.Class(OpenLayers.Layer,{URL_HASH_FACTOR:(Math.sqrt(5)-1)/2,url:null,params:null,reproject:!1,initialize:function(a,b,c,d){OpenLayers.Layer.prototype.initialize.apply(this,[a,d]);this.url=b;this.params||(this.params=OpenLayers.Util.extend({},c))},destroy:function(){this.params=this.url=null;OpenLayers.Layer.prototype.destroy.apply(this,arguments)},clone:function(a){null==a&&(a=new OpenLayers.Layer.HTTPRequest(this.name,this.url,this.params,this.getOptions()));
return a=OpenLayers.Layer.prototype.clone.apply(this,[a])},setUrl:function(a){this.url=a},mergeNewParams:function(a){this.params=OpenLayers.Util.extend(this.params,a);a=this.redraw();null!=this.map&&this.map.events.triggerEvent("changelayer",{layer:this,property:"params"});return a},redraw:function(a){return a?this.mergeNewParams({_olSalt:Math.random()}):OpenLayers.Layer.prototype.redraw.apply(this,[])},selectUrl:function(a,b){for(var c=1,d=0,e=a.length;d<e;d++)c*=a.charCodeAt(d)*this.URL_HASH_FACTOR,
c-=Math.floor(c);return b[Math.floor(c*b.length)]},getFullRequestString:function(a,b){var c=b||this.url,d=OpenLayers.Util.extend({},this.params),d=OpenLayers.Util.extend(d,a),e=OpenLayers.Util.getParameterString(d);OpenLayers.Util.isArray(c)&&(c=this.selectUrl(e,c));var e=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(c)),f;for(f in d)f.toUpperCase()in e&&delete d[f];e=OpenLayers.Util.getParameterString(d);return OpenLayers.Util.urlAppend(c,e)},CLASS_NAME:"OpenLayers.Layer.HTTPRequest"});OpenLayers.Tile=OpenLayers.Class({events:null,eventListeners:null,id:null,layer:null,url:null,bounds:null,size:null,position:null,isLoading:!1,initialize:function(a,b,c,d,e,f){this.layer=a;this.position=b.clone();this.setBounds(c);this.url=d;e&&(this.size=e.clone());this.id=OpenLayers.Util.createUniqueID("Tile_");OpenLayers.Util.extend(this,f);this.events=new OpenLayers.Events(this);if(this.eventListeners instanceof Object)this.events.on(this.eventListeners)},unload:function(){this.isLoading&&(this.isLoading=
!1,this.events.triggerEvent("unload"))},destroy:function(){this.position=this.size=this.bounds=this.layer=null;this.eventListeners&&this.events.un(this.eventListeners);this.events.destroy();this.events=this.eventListeners=null},draw:function(a){a||this.clear();var b=this.shouldDraw();b&&!a&&(b=!1!==this.events.triggerEvent("beforedraw"));return b},shouldDraw:function(){var a=!1,b=this.layer.maxExtent;if(b){var c=this.layer.map,c=c.baseLayer.wrapDateLine&&c.getMaxExtent();this.bounds.intersectsBounds(b,
{inclusive:!1,worldBounds:c})&&(a=!0)}return a||this.layer.displayOutsideMaxExtent},setBounds:function(a){a=a.clone();if(this.layer.map.baseLayer.wrapDateLine)var b=this.layer.map.getMaxExtent(),c=this.layer.map.getResolution(),a=a.wrapDateLine(b,{leftTolerance:c,rightTolerance:c});this.bounds=a},moveTo:function(a,b,c){null==c&&(c=!0);this.setBounds(a);this.position=b.clone();c&&this.draw()},clear:function(){},CLASS_NAME:"OpenLayers.Tile"});OpenLayers.Tile.Image=OpenLayers.Class(OpenLayers.Tile,{url:null,imgDiv:null,frame:null,imageReloadAttempts:null,layerAlphaHack:null,asyncRequestId:null,blankImageUrl:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7",maxGetUrlLength:null,canvasContext:null,crossOriginKeyword:null,initialize:function(a,b,c,d,e,f){OpenLayers.Tile.prototype.initialize.apply(this,arguments);this.url=d;this.layerAlphaHack=this.layer.alpha&&OpenLayers.Util.alphaHack();if(null!=this.maxGetUrlLength||
this.layer.gutter||this.layerAlphaHack)this.frame=document.createElement("div"),this.frame.style.position="absolute",this.frame.style.overflow="hidden";null!=this.maxGetUrlLength&&OpenLayers.Util.extend(this,OpenLayers.Tile.Image.IFrame)},destroy:function(){this.imgDiv&&(this.clear(),this.frame=this.imgDiv=null);this.asyncRequestId=null;OpenLayers.Tile.prototype.destroy.apply(this,arguments)},draw:function(){var a=OpenLayers.Tile.prototype.draw.apply(this,arguments);a?(this.layer!=this.layer.map.baseLayer&&
this.layer.reproject&&(this.bounds=this.getBoundsFromBaseLayer(this.position)),this.isLoading?this._loadEvent="reload":(this.isLoading=!0,this._loadEvent="loadstart"),this.positionTile(),this.renderTile()):this.unload();return a},renderTile:function(){this.layer.div.appendChild(this.getTile());if(this.layer.async){var a=this.asyncRequestId=(this.asyncRequestId||0)+1;this.layer.getURLasync(this.bounds,function(b){a==this.asyncRequestId&&(this.url=b,this.initImage())},this)}else this.url=this.layer.getURL(this.bounds),
this.initImage()},positionTile:function(){var a=this.getTile().style,b=this.frame?this.size:this.layer.getImageSize(this.bounds);a.left=this.position.x+"%";a.top=this.position.y+"%";a.width=b.w+"%";a.height=b.h+"%"},clear:function(){OpenLayers.Tile.prototype.clear.apply(this,arguments);var a=this.imgDiv;if(a){OpenLayers.Event.stopObservingElement(a);var b=this.getTile();b.parentNode===this.layer.div&&this.layer.div.removeChild(b);this.setImgSrc();!0===this.layerAlphaHack&&(a.style.filter="");OpenLayers.Element.removeClass(a,
"olImageLoadError")}this.canvasContext=null},getImage:function(){if(!this.imgDiv){this.imgDiv=document.createElement("img");this.imgDiv.className="olTileImage";this.imgDiv.galleryImg="no";var a=this.imgDiv.style;if(this.frame){var b=0,c=0;this.layer.gutter&&(b=100*(this.layer.gutter/this.layer.tileSize.w),c=100*(this.layer.gutter/this.layer.tileSize.h));a.left=-b+"%";a.top=-c+"%";a.width=2*b+100+"%";a.height=2*c+100+"%"}a.visibility="hidden";a.opacity=0;1>this.layer.opacity&&(a.filter="alpha(opacity="+
100*this.layer.opacity+")");a.position="absolute";this.layerAlphaHack&&(a.paddingTop=a.height,a.height="0",a.width="100%");this.frame&&this.frame.appendChild(this.imgDiv)}return this.imgDiv},initImage:function(){this.events.triggerEvent(this._loadEvent);var a=this.getImage();if(this.url&&a.getAttribute("src")==this.url)this.onImageLoad();else{var b=OpenLayers.Function.bind(function(){OpenLayers.Event.stopObservingElement(a);OpenLayers.Event.observe(a,"load",OpenLayers.Function.bind(this.onImageLoad,
this));OpenLayers.Event.observe(a,"error",OpenLayers.Function.bind(this.onImageError,this));this.imageReloadAttempts=0;this.setImgSrc(this.url)},this);a.getAttribute("src")==this.blankImageUrl?b():(OpenLayers.Event.observe(a,"load",b),OpenLayers.Event.observe(a,"error",b),this.crossOriginKeyword&&a.removeAttribute("crossorigin"),a.src=this.blankImageUrl)}},setImgSrc:function(a){var b=this.imgDiv;b.style.visibility="hidden";b.style.opacity=0;a&&(this.crossOriginKeyword&&("data:"!==a.substr(0,5)?b.setAttribute("crossorigin",
this.crossOriginKeyword):b.removeAttribute("crossorigin")),b.src=a)},getTile:function(){return this.frame?this.frame:this.getImage()},createBackBuffer:function(){if(this.imgDiv&&!this.isLoading){var a;this.frame?(a=this.frame.cloneNode(!1),a.appendChild(this.imgDiv)):a=this.imgDiv;this.imgDiv=null;return a}},onImageLoad:function(){var a=this.imgDiv;OpenLayers.Event.stopObservingElement(a);a.style.visibility="inherit";a.style.opacity=this.layer.opacity;this.isLoading=!1;this.canvasContext=null;this.events.triggerEvent("loadend");
if(7>parseFloat(navigator.appVersion.split("MSIE")[1])&&this.layer&&this.layer.div){var b=document.createElement("span");b.style.display="none";var c=this.layer.div;c.appendChild(b);window.setTimeout(function(){b.parentNode===c&&b.parentNode.removeChild(b)},0)}!0===this.layerAlphaHack&&(a.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+a.src+"', sizingMethod='scale')")},onImageError:function(){var a=this.imgDiv;null!=a.src&&(this.imageReloadAttempts++,this.imageReloadAttempts<=
OpenLayers.IMAGE_RELOAD_ATTEMPTS?this.setImgSrc(this.layer.getURL(this.bounds)):(OpenLayers.Element.addClass(a,"olImageLoadError"),this.events.triggerEvent("loaderror"),this.onImageLoad()))},getCanvasContext:function(){if(OpenLayers.CANVAS_SUPPORTED&&this.imgDiv&&!this.isLoading){if(!this.canvasContext){var a=document.createElement("canvas");a.width=this.size.w;a.height=this.size.h;this.canvasContext=a.getContext("2d");this.canvasContext.drawImage(this.imgDiv,0,0)}return this.canvasContext}},CLASS_NAME:"OpenLayers.Tile.Image"});OpenLayers.Layer.Grid=OpenLayers.Class(OpenLayers.Layer.HTTPRequest,{tileSize:null,tileOriginCorner:"bl",tileOrigin:null,tileOptions:null,tileClass:OpenLayers.Tile.Image,grid:null,singleTile:!1,ratio:1.5,buffer:0,transitionEffect:null,numLoadingTiles:0,tileLoadingDelay:85,serverResolutions:null,moveTimerId:null,deferMoveGriddedTiles:null,tileQueueId:null,tileQueue:null,loading:!1,backBuffer:null,gridResolution:null,backBufferResolution:null,backBufferLonLat:null,backBufferTimerId:null,removeBackBufferDelay:null,
className:null,initialize:function(a,b,c,d){OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this,arguments);this.grid=[];this.tileQueue=[];null===this.removeBackBufferDelay&&(this.removeBackBufferDelay=this.singleTile?0:2500);null===this.className&&(this.className=this.singleTile?"olLayerGridSingleTile":"olLayerGrid");OpenLayers.Animation.isNative||(this.deferMoveGriddedTiles=OpenLayers.Function.bind(function(){this.moveGriddedTiles(true);this.moveTimerId=null},this))},setMap:function(a){OpenLayers.Layer.HTTPRequest.prototype.setMap.call(this,
a);OpenLayers.Element.addClass(this.div,this.className)},removeMap:function(){null!==this.moveTimerId&&(window.clearTimeout(this.moveTimerId),this.moveTimerId=null);this.clearTileQueue();null!==this.backBufferTimerId&&(window.clearTimeout(this.backBufferTimerId),this.backBufferTimerId=null)},destroy:function(){this.removeBackBuffer();this.clearGrid();this.tileSize=this.grid=null;OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this,arguments)},clearGrid:function(){this.clearTileQueue();if(this.grid){for(var a=
0,b=this.grid.length;a<b;a++)for(var c=this.grid[a],d=0,e=c.length;d<e;d++)this.destroyTile(c[d]);this.grid=[];this.gridResolution=null}},clone:function(a){null==a&&(a=new OpenLayers.Layer.Grid(this.name,this.url,this.params,this.getOptions()));a=OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this,[a]);null!=this.tileSize&&(a.tileSize=this.tileSize.clone());a.grid=[];a.gridResolution=null;a.backBuffer=null;a.backBufferTimerId=null;a.tileQueue=[];a.tileQueueId=null;a.loading=!1;a.moveTimerId=null;
return a},moveTo:function(a,b,c){OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this,arguments);a=a||this.map.getExtent();if(null!=a){var d=!this.grid.length||b,e=this.getTilesBounds(),f=this.map.getResolution(),g=this.getServerResolution(f);if(this.singleTile){if(d||!c&&!e.containsBounds(a))b&&"resize"!==this.transitionEffect&&this.removeBackBuffer(),(!b||"resize"===this.transitionEffect)&&this.applyBackBuffer(g),this.initSingleTile(a)}else(d=d||!e.intersectsBounds(a,{worldBounds:this.map.baseLayer.wrapDateLine&&
this.map.getMaxExtent()}),f!==g?(a=this.map.calculateBounds(null,g),d&&this.transformDiv(g/f)):(this.div.style.width="100%",this.div.style.height="100%",this.div.style.left="0%",this.div.style.top="0%"),d)?(b&&"resize"===this.transitionEffect&&this.applyBackBuffer(g),this.initGriddedTiles(a)):this.moveGriddedTiles()}},getTileData:function(a){var b=null,c=a.lon,d=a.lat,e=this.grid.length;if(this.map&&e){var f=this.map.getResolution(),a=this.tileSize.w,g=this.tileSize.h,h=this.grid[0][0].bounds,i=h.left,
h=h.top;if(c<i&&this.map.baseLayer.wrapDateLine)var j=this.map.getMaxExtent().getWidth(),k=Math.ceil((i-c)/j),c=c+j*k;c=(c-i)/(f*a);d=(h-d)/(f*g);f=Math.floor(c);i=Math.floor(d);0<=i&&i<e&&(e=this.grid[i][f])&&(b={tile:e,i:Math.floor((c-f)*a),j:Math.floor((d-i)*g)})}return b},queueTileDraw:function(a){a=a.object;~OpenLayers.Util.indexOf(this.tileQueue,a)||this.tileQueue.push(a);this.tileQueueId||(this.tileQueueId=OpenLayers.Animation.start(OpenLayers.Function.bind(this.drawTileFromQueue,this),null,
this.div));return!1},drawTileFromQueue:function(){0===this.tileQueue.length?this.clearTileQueue():this.tileQueue.shift().draw(!0)},clearTileQueue:function(){OpenLayers.Animation.stop(this.tileQueueId);this.tileQueueId=null;this.tileQueue=[]},destroyTile:function(a){this.removeTileMonitoringHooks(a);a.destroy()},getServerResolution:function(a){a=a||this.map.getResolution();if(this.serverResolutions&&-1===OpenLayers.Util.indexOf(this.serverResolutions,a)){var b,c;for(b=this.serverResolutions.length-
1;0<=b;b--)if(c=this.serverResolutions[b],c>a){a=c;break}if(-1===b)throw"no appropriate resolution in serverResolutions";}return a},getServerZoom:function(){var a=this.getServerResolution();return this.serverResolutions?OpenLayers.Util.indexOf(this.serverResolutions,a):this.map.getZoomForResolution(a)+(this.zoomOffset||0)},transformDiv:function(a){this.div.style.width=100*a+"%";this.div.style.height=100*a+"%";var b=this.map.getSize(),c=parseInt(this.map.layerContainerDiv.style.left,10),d=(parseInt(this.map.layerContainerDiv.style.top,
10)-b.h/2)*(a-1);this.div.style.left=(c-b.w/2)*(a-1)+"%";this.div.style.top=d+"%"},getResolutionScale:function(){return parseInt(this.div.style.width,10)/100},applyBackBuffer:function(a){null!==this.backBufferTimerId&&this.removeBackBuffer();var b=this.backBuffer;if(!b){b=this.createBackBuffer();if(!b)return;this.div.insertBefore(b,this.div.firstChild);this.backBuffer=b;var c=this.grid[0][0].bounds;this.backBufferLonLat={lon:c.left,lat:c.top};this.backBufferResolution=this.gridResolution}var c=b.style,
d=this.backBufferResolution/a;c.width=100*d+"%";c.height=100*d+"%";a=this.getViewPortPxFromLonLat(this.backBufferLonLat,a);c=parseInt(this.map.layerContainerDiv.style.left,10);d=parseInt(this.map.layerContainerDiv.style.top,10);b.style.left=Math.round(a.x-c)+"%";b.style.top=Math.round(a.y-d)+"%"},createBackBuffer:function(){var a;if(0<this.grid.length){a=document.createElement("div");a.id=this.div.id+"_bb";a.className="olBackBuffer";a.style.position="absolute";a.style.width="100%";a.style.height=
"100%";for(var b=0,c=this.grid.length;b<c;b++)for(var d=0,e=this.grid[b].length;d<e;d++){var f=this.grid[b][d].createBackBuffer();f&&(f.style.top=b*this.tileSize.h+"%",f.style.left=d*this.tileSize.w+"%",a.appendChild(f))}}return a},removeBackBuffer:function(){this.backBuffer&&(this.div.removeChild(this.backBuffer),this.backBufferResolution=this.backBuffer=null,null!==this.backBufferTimerId&&(window.clearTimeout(this.backBufferTimerId),this.backBufferTimerId=null))},moveByPx:function(){this.singleTile||
this.moveGriddedTiles()},setTileSize:function(a){this.singleTile&&(a=this.map.getSize(),a.h=parseInt(a.h*this.ratio),a.w=parseInt(a.w*this.ratio));OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this,[a])},getTilesBounds:function(){var a=null,b=this.grid.length;if(b)var a=this.grid[b-1][0].bounds,b=this.grid[0].length*a.getWidth(),c=this.grid.length*a.getHeight(),a=new OpenLayers.Bounds(a.left,a.bottom,a.left+b,a.bottom+c);return a},initSingleTile:function(a){this.clearTileQueue();var b=
a.getCenterLonLat(),c=a.getWidth()*this.ratio,a=a.getHeight()*this.ratio,b=new OpenLayers.Bounds(b.lon-c/2,b.lat-a/2,b.lon+c/2,b.lat+a/2),c=this.map.getLayerPxFromLonLat({lon:b.left,lat:b.top});this.grid.length||(this.grid[0]=[]);(a=this.grid[0][0])?a.moveTo(b,c):(a=this.addTile(b,c),this.addTileMonitoringHooks(a),a.draw(),this.grid[0][0]=a);this.removeExcessTiles(1,1);this.gridResolution=this.getServerResolution()},calculateGridLayout:function(a,b,c){var d=c*this.tileSize.w,c=c*this.tileSize.h,e=
a.left-b.lon,f=Math.floor(e/d)-this.buffer,e=-(e/d-f)*this.tileSize.w,f=b.lon+f*d,a=a.top-(b.lat+c),g=Math.ceil(a/c)+this.buffer;return{tilelon:d,tilelat:c,tileoffsetlon:f,tileoffsetlat:b.lat+g*c,tileoffsetx:e,tileoffsety:-(g-a/c)*this.tileSize.h}},getTileOrigin:function(){var a=this.tileOrigin;if(!a)var a=this.getMaxExtent(),b={tl:["left","top"],tr:["right","top"],bl:["left","bottom"],br:["right","bottom"]}[this.tileOriginCorner],a=new OpenLayers.LonLat(a[b[0]],a[b[1]]);return a},initGriddedTiles:function(a){this.clearTileQueue();
var b=this.map.getSize(),c=Math.ceil(b.h/this.tileSize.h)+Math.max(1,2*this.buffer),b=Math.ceil(b.w/this.tileSize.w)+Math.max(1,2*this.buffer),d=this.getTileOrigin(),e=this.getServerResolution(),d=this.calculateGridLayout(a,d,e),e=Math.round(d.tileoffsetx),f=Math.round(d.tileoffsety),g=d.tileoffsetlon,h=d.tileoffsetlat,i=d.tilelon,j=d.tilelat,k=e,l=g,m=0,n=parseInt(this.map.layerContainerDiv.style.left),o=parseInt(this.map.layerContainerDiv.style.top),d=[],p=this.map.getCenter();do{var q=this.grid[m++];
q||(q=[],this.grid.push(q));var g=l,e=k,r=0;do{var s=new OpenLayers.Bounds(g,h,g+i,h+j),t=e,t=t-n,u=f,u=u-o,u=new OpenLayers.Pixel(t,u);(t=q[r++])?t.moveTo(s,u,!1):(t=this.addTile(s,u),this.addTileMonitoringHooks(t),q.push(t));s=s.getCenterLonLat();d.push({tile:t,distance:Math.pow(s.lon-p.lon,2)+Math.pow(s.lat-p.lat,2)});g+=i;e+=this.tileSize.w}while(g<=a.right+i*this.buffer||r<b);h-=j;f+=this.tileSize.h}while(h>=a.bottom-j*this.buffer||m<c);this.removeExcessTiles(m,r);this.gridResolution=this.getServerResolution();
d.sort(function(a,b){return a.distance-b.distance});a=0;for(c=d.length;a<c;++a)d[a].tile.draw()},getMaxExtent:function(){return this.maxExtent},addTile:function(a,b){var c=new this.tileClass(this,b,a,null,this.tileSize,this.tileOptions);c.events.register("beforedraw",this,this.queueTileDraw);return c},addTileMonitoringHooks:function(a){a.onLoadStart=function(){!1===this.loading&&(this.loading=!0,this.events.triggerEvent("loadstart"));this.events.triggerEvent("tileloadstart",{tile:a});this.numLoadingTiles++};
a.onLoadEnd=function(){this.numLoadingTiles--;this.events.triggerEvent("tileloaded",{tile:a});0===this.tileQueue.length&&0===this.numLoadingTiles&&(this.loading=!1,this.events.triggerEvent("loadend"),this.backBuffer&&(this.backBufferTimerId=window.setTimeout(OpenLayers.Function.bind(this.removeBackBuffer,this),this.removeBackBufferDelay)))};a.onLoadError=function(){this.events.triggerEvent("tileerror",{tile:a})};a.events.on({loadstart:a.onLoadStart,loadend:a.onLoadEnd,unload:a.onLoadEnd,loaderror:a.onLoadError,
scope:this})},removeTileMonitoringHooks:function(a){a.unload();a.events.un({loadstart:a.onLoadStart,loadend:a.onLoadEnd,unload:a.onLoadEnd,loaderror:a.onLoadError,scope:this})},moveGriddedTiles:function(a){if(!a&&!OpenLayers.Animation.isNative)null!=this.moveTimerId&&window.clearTimeout(this.moveTimerId),this.moveTimerId=window.setTimeout(this.deferMoveGriddedTiles,this.tileLoadingDelay);else for(var a=this.buffer||1,b=this.getResolutionScale();;){var c=this.grid[0][0].position.x*b+parseInt(this.div.style.left,
10)+parseInt(this.map.layerContainerDiv.style.left),d=this.grid[0][0].position.y*b+parseInt(this.div.style.top,10)+parseInt(this.map.layerContainerDiv.style.top),e=this.tileSize.w*b,f=this.tileSize.h*b;if(c>-e*(a-1))this.shiftColumn(!0);else if(c<-e*a)this.shiftColumn(!1);else if(d>-f*(a-1))this.shiftRow(!0);else if(d<-f*a)this.shiftRow(!1);else break}},shiftRow:function(a){for(var b=this.grid,c=b[a?0:this.grid.length-1],d=this.getServerResolution(),e=a?-this.tileSize.h:this.tileSize.h,d=d*-e,f=a?
b.pop():b.shift(),g=0,h=c.length;g<h;g++){var i=c[g],j=i.bounds.clone(),i=i.position.clone();j.bottom+=d;j.top+=d;i.y+=e;f[g].moveTo(j,i)}a?b.unshift(f):b.push(f)},shiftColumn:function(a){for(var b=a?-this.tileSize.w:this.tileSize.w,c=this.getServerResolution()*b,d=0,e=this.grid.length;d<e;d++){var f=this.grid[d],g=f[a?0:f.length-1],h=g.bounds.clone(),g=g.position.clone();h.left+=c;h.right+=c;g.x+=b;var i=a?this.grid[d].pop():this.grid[d].shift();i.moveTo(h,g);a?f.unshift(i):f.push(i)}},removeExcessTiles:function(a,
b){for(var c,d;this.grid.length>a;){var e=this.grid.pop();c=0;for(d=e.length;c<d;c++){var f=e[c];this.destroyTile(f)}}c=0;for(d=this.grid.length;c<d;c++)for(;this.grid[c].length>b;)e=this.grid[c],f=e.pop(),this.destroyTile(f)},onMapResize:function(){this.singleTile&&(this.clearGrid(),this.setTileSize())},getTileBounds:function(a){var b=this.maxExtent,c=this.getResolution(),d=c*this.tileSize.w,c=c*this.tileSize.h,e=this.getLonLatFromViewPortPx(a),a=b.left+d*Math.floor((e.lon-b.left)/d),b=b.bottom+
c*Math.floor((e.lat-b.bottom)/c);return new OpenLayers.Bounds(a,b,a+d,b+c)},CLASS_NAME:"OpenLayers.Layer.Grid"});OpenLayers.Format.ArcXML=OpenLayers.Class(OpenLayers.Format.XML,{fontStyleKeys:"antialiasing blockout font fontcolor fontsize fontstyle glowing interval outline printmode shadow transparency".split(" "),request:null,response:null,initialize:function(a){this.request=new OpenLayers.Format.ArcXML.Request;this.response=new OpenLayers.Format.ArcXML.Response;if(a)if("feature"==a.requesttype){this.request.get_image=null;var b=this.request.get_feature.query;this.addCoordSys(b.featurecoordsys,a.featureCoordSys);
this.addCoordSys(b.filtercoordsys,a.filterCoordSys);a.polygon?(b.isspatial=!0,b.spatialfilter.polygon=a.polygon):a.envelope&&(b.isspatial=!0,b.spatialfilter.envelope={minx:0,miny:0,maxx:0,maxy:0},this.parseEnvelope(b.spatialfilter.envelope,a.envelope))}else"image"==a.requesttype?(this.request.get_feature=null,b=this.request.get_image.properties,this.parseEnvelope(b.envelope,a.envelope),this.addLayers(b.layerlist,a.layers),this.addImageSize(b.imagesize,a.tileSize),this.addCoordSys(b.featurecoordsys,
a.featureCoordSys),this.addCoordSys(b.filtercoordsys,a.filterCoordSys)):this.request=null;OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},parseEnvelope:function(a,b){b&&4==b.length&&(a.minx=b[0],a.miny=b[1],a.maxx=b[2],a.maxy=b[3])},addLayers:function(a,b){for(var c=0,d=b.length;c<d;c++)a.push(b[c])},addImageSize:function(a,b){null!==b&&(a.width=b.w,a.height=b.h,a.printwidth=b.w,a.printheight=b.h)},addCoordSys:function(a,b){"string"==typeof b?(a.id=parseInt(b),a.string=b):"object"==typeof b&&
null!==b.proj&&(a.id=b.proj.srsProjNumber,a.string=b.proj.srsCode)},iserror:function(a){var b=null;a?(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]),a=a.documentElement.getElementsByTagName("ERROR"),b=null!==a&&0<a.length):b=""!==this.response.error;return b},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var b=null;a&&a.documentElement&&(b="ARCXML"==a.documentElement.nodeName?a.documentElement:a.documentElement.getElementsByTagName("ARCXML")[0]);
if(!b||"parsererror"===b.firstChild.nodeName){var c,d;try{c=a.firstChild.nodeValue,d=a.firstChild.childNodes[1].firstChild.nodeValue}catch(e){}throw{message:"Error parsing the ArcXML request",error:c,source:d};}return this.parseResponse(b)},write:function(a){a||(a=this.request);var b=this.createElementNS("","ARCXML");b.setAttribute("version","1.1");var c=this.createElementNS("","REQUEST");if(null!=a.get_image){var d=this.createElementNS("","GET_IMAGE");c.appendChild(d);var e=this.createElementNS("",
"PROPERTIES");d.appendChild(e);a=a.get_image.properties;null!=a.featurecoordsys&&(d=this.createElementNS("","FEATURECOORDSYS"),e.appendChild(d),0===a.featurecoordsys.id?d.setAttribute("string",a.featurecoordsys.string):d.setAttribute("id",a.featurecoordsys.id));null!=a.filtercoordsys&&(d=this.createElementNS("","FILTERCOORDSYS"),e.appendChild(d),0===a.filtercoordsys.id?d.setAttribute("string",a.filtercoordsys.string):d.setAttribute("id",a.filtercoordsys.id));null!=a.envelope&&(d=this.createElementNS("",
"ENVELOPE"),e.appendChild(d),d.setAttribute("minx",a.envelope.minx),d.setAttribute("miny",a.envelope.miny),d.setAttribute("maxx",a.envelope.maxx),d.setAttribute("maxy",a.envelope.maxy));d=this.createElementNS("","IMAGESIZE");e.appendChild(d);d.setAttribute("height",a.imagesize.height);d.setAttribute("width",a.imagesize.width);if(a.imagesize.height!=a.imagesize.printheight||a.imagesize.width!=a.imagesize.printwidth)d.setAttribute("printheight",a.imagesize.printheight),d.setArrtibute("printwidth",a.imagesize.printwidth);
null!=a.background&&(d=this.createElementNS("","BACKGROUND"),e.appendChild(d),d.setAttribute("color",a.background.color.r+","+a.background.color.g+","+a.background.color.b),null!==a.background.transcolor&&d.setAttribute("transcolor",a.background.transcolor.r+","+a.background.transcolor.g+","+a.background.transcolor.b));if(null!=a.layerlist&&0<a.layerlist.length){d=this.createElementNS("","LAYERLIST");e.appendChild(d);for(e=0;e<a.layerlist.length;e++){var f=this.createElementNS("","LAYERDEF");d.appendChild(f);
f.setAttribute("id",a.layerlist[e].id);f.setAttribute("visible",a.layerlist[e].visible);if("object"==typeof a.layerlist[e].query){var g=a.layerlist[e].query;if(0>g.where.length)continue;var h=null,h="boolean"==typeof g.spatialfilter&&g.spatialfilter?this.createElementNS("","SPATIALQUERY"):this.createElementNS("","QUERY");h.setAttribute("where",g.where);"number"==typeof g.accuracy&&0<g.accuracy&&h.setAttribute("accuracy",g.accuracy);"number"==typeof g.featurelimit&&2E3>g.featurelimit&&h.setAttribute("featurelimit",
g.featurelimit);"string"==typeof g.subfields&&"#ALL#"!=g.subfields&&h.setAttribute("subfields",g.subfields);"string"==typeof g.joinexpression&&0<g.joinexpression.length&&h.setAttribute("joinexpression",g.joinexpression);"string"==typeof g.jointables&&0<g.jointables.length&&h.setAttribute("jointables",g.jointables);f.appendChild(h)}"object"==typeof a.layerlist[e].renderer&&this.addRenderer(f,a.layerlist[e].renderer)}}}else if(null!=a.get_feature&&(d=this.createElementNS("","GET_FEATURES"),d.setAttribute("outputmode",
"newxml"),d.setAttribute("checkesc","true"),a.get_feature.geometry?d.setAttribute("geometry",a.get_feature.geometry):d.setAttribute("geometry","false"),a.get_feature.compact&&d.setAttribute("compact",a.get_feature.compact),"number"==a.get_feature.featurelimit&&d.setAttribute("featurelimit",a.get_feature.featurelimit),d.setAttribute("globalenvelope","true"),c.appendChild(d),null!=a.get_feature.layer&&0<a.get_feature.layer.length&&(e=this.createElementNS("","LAYER"),e.setAttribute("id",a.get_feature.layer),
d.appendChild(e)),a=a.get_feature.query,null!=a))e=null,e=a.isspatial?this.createElementNS("","SPATIALQUERY"):this.createElementNS("","QUERY"),d.appendChild(e),"number"==typeof a.accuracy&&e.setAttribute("accuracy",a.accuracy),null!=a.featurecoordsys&&(d=this.createElementNS("","FEATURECOORDSYS"),0==a.featurecoordsys.id?d.setAttribute("string",a.featurecoordsys.string):d.setAttribute("id",a.featurecoordsys.id),e.appendChild(d)),null!=a.filtercoordsys&&(d=this.createElementNS("","FILTERCOORDSYS"),
0===a.filtercoordsys.id?d.setAttribute("string",a.filtercoordsys.string):d.setAttribute("id",a.filtercoordsys.id),e.appendChild(d)),0<a.buffer&&(d=this.createElementNS("","BUFFER"),d.setAttribute("distance",a.buffer),e.appendChild(d)),a.isspatial&&(d=this.createElementNS("","SPATIALFILTER"),d.setAttribute("relation",a.spatialfilter.relation),e.appendChild(d),a.spatialfilter.envelope?(f=this.createElementNS("","ENVELOPE"),f.setAttribute("minx",a.spatialfilter.envelope.minx),f.setAttribute("miny",a.spatialfilter.envelope.miny),
f.setAttribute("maxx",a.spatialfilter.envelope.maxx),f.setAttribute("maxy",a.spatialfilter.envelope.maxy),d.appendChild(f)):"object"==typeof a.spatialfilter.polygon&&d.appendChild(this.writePolygonGeometry(a.spatialfilter.polygon))),null!=a.where&&0<a.where.length&&e.setAttribute("where",a.where);b.appendChild(c);return OpenLayers.Format.XML.prototype.write.apply(this,[b])},addGroupRenderer:function(a,b){var c=this.createElementNS("","GROUPRENDERER");a.appendChild(c);for(var d=0;d<b.length;d++)this.addRenderer(c,
b[d])},addRenderer:function(a,b){if(OpenLayers.Util.isArray(b))this.addGroupRenderer(a,b);else{var c=this.createElementNS("",b.type.toUpperCase()+"RENDERER");a.appendChild(c);"VALUEMAPRENDERER"==c.tagName?this.addValueMapRenderer(c,b):"VALUEMAPLABELRENDERER"==c.tagName?this.addValueMapLabelRenderer(c,b):"SIMPLELABELRENDERER"==c.tagName?this.addSimpleLabelRenderer(c,b):"SCALEDEPENDENTRENDERER"==c.tagName&&this.addScaleDependentRenderer(c,b)}},addScaleDependentRenderer:function(a,b){("string"==typeof b.lower||
"number"==typeof b.lower)&&a.setAttribute("lower",b.lower);("string"==typeof b.upper||"number"==typeof b.upper)&&a.setAttribute("upper",b.upper);this.addRenderer(a,b.renderer)},addValueMapLabelRenderer:function(a,b){a.setAttribute("lookupfield",b.lookupfield);a.setAttribute("labelfield",b.labelfield);if("object"==typeof b.exacts)for(var c=0,d=b.exacts.length;c<d;c++){var e=b.exacts[c],f=this.createElementNS("","EXACT");"string"==typeof e.value&&f.setAttribute("value",e.value);"string"==typeof e.label&&
f.setAttribute("label",e.label);"string"==typeof e.method&&f.setAttribute("method",e.method);a.appendChild(f);if("object"==typeof e.symbol){var g=null;"text"==e.symbol.type&&(g=this.createElementNS("","TEXTSYMBOL"));if(null!=g){for(var h=this.fontStyleKeys,i=0,j=h.length;i<j;i++){var k=h[i];e.symbol[k]&&g.setAttribute(k,e.symbol[k])}f.appendChild(g)}}}},addValueMapRenderer:function(a,b){a.setAttribute("lookupfield",b.lookupfield);if("object"==typeof b.ranges)for(var c=0,d=b.ranges.length;c<d;c++){var e=
b.ranges[c],f=this.createElementNS("","RANGE");f.setAttribute("lower",e.lower);f.setAttribute("upper",e.upper);a.appendChild(f);if("object"==typeof e.symbol){var g=null;"simplepolygon"==e.symbol.type&&(g=this.createElementNS("","SIMPLEPOLYGONSYMBOL"));null!=g&&("string"==typeof e.symbol.boundarycolor&&g.setAttribute("boundarycolor",e.symbol.boundarycolor),"string"==typeof e.symbol.fillcolor&&g.setAttribute("fillcolor",e.symbol.fillcolor),"number"==typeof e.symbol.filltransparency&&g.setAttribute("filltransparency",
e.symbol.filltransparency),f.appendChild(g))}}else if("object"==typeof b.exacts){c=0;for(d=b.exacts.length;c<d;c++)e=b.exacts[c],f=this.createElementNS("","EXACT"),"string"==typeof e.value&&f.setAttribute("value",e.value),"string"==typeof e.label&&f.setAttribute("label",e.label),"string"==typeof e.method&&f.setAttribute("method",e.method),a.appendChild(f),"object"==typeof e.symbol&&(g=null,"simplemarker"==e.symbol.type&&(g=this.createElementNS("","SIMPLEMARKERSYMBOL")),null!=g&&("string"==typeof e.symbol.antialiasing&&
g.setAttribute("antialiasing",e.symbol.antialiasing),"string"==typeof e.symbol.color&&g.setAttribute("color",e.symbol.color),"string"==typeof e.symbol.outline&&g.setAttribute("outline",e.symbol.outline),"string"==typeof e.symbol.overlap&&g.setAttribute("overlap",e.symbol.overlap),"string"==typeof e.symbol.shadow&&g.setAttribute("shadow",e.symbol.shadow),"number"==typeof e.symbol.transparency&&g.setAttribute("transparency",e.symbol.transparency),"string"==typeof e.symbol.usecentroid&&g.setAttribute("usecentroid",
e.symbol.usecentroid),"number"==typeof e.symbol.width&&g.setAttribute("width",e.symbol.width),f.appendChild(g)))}},addSimpleLabelRenderer:function(a,b){a.setAttribute("field",b.field);for(var c="featureweight howmanylabels labelbufferratio labelpriorities labelweight linelabelposition rotationalangles".split(" "),d=0,e=c.length;d<e;d++){var f=c[d];b[f]&&a.setAttribute(f,b[f])}if("text"==b.symbol.type){var g=b.symbol,h=this.createElementNS("","TEXTSYMBOL");a.appendChild(h);c=this.fontStyleKeys;d=0;
for(e=c.length;d<e;d++)f=c[d],g[f]&&h.setAttribute(f,b[f])}},writePolygonGeometry:function(a){if(!(a instanceof OpenLayers.Geometry.Polygon))throw{message:"Cannot write polygon geometry to ArcXML with an "+a.CLASS_NAME+" object.",geometry:a};for(var b=this.createElementNS("","POLYGON"),c=0,d=a.components.length;c<d;c++){for(var e=a.components[c],f=this.createElementNS("","RING"),g=0,h=e.components.length;g<h;g++){var i=e.components[g],j=this.createElementNS("","POINT");j.setAttribute("x",i.x);j.setAttribute("y",
i.y);f.appendChild(j)}b.appendChild(f)}return b},parseResponse:function(a){"string"==typeof a&&(a=(new OpenLayers.Format.XML).read(a));var b=new OpenLayers.Format.ArcXML.Response,c=a.getElementsByTagName("ERROR");if(null!=c&&0<c.length)b.error=this.getChildValue(c,"Unknown error.");else{c=a.getElementsByTagName("RESPONSE");if(null==c||0==c.length)return b.error="No RESPONSE tag found in ArcXML response.",b;var d=c[0].firstChild.nodeName;"#text"==d&&(d=c[0].firstChild.nextSibling.nodeName);if("IMAGE"==
d)c=a.getElementsByTagName("ENVELOPE"),a=a.getElementsByTagName("OUTPUT"),null==c||0==c.length?b.error="No ENVELOPE tag found in ArcXML response.":null==a||0==a.length?b.error="No OUTPUT tag found in ArcXML response.":(c=this.parseAttributes(c[0]),d=this.parseAttributes(a[0]),b.image="string"==typeof d.type?{envelope:c,output:{type:d.type,data:this.getChildValue(a[0])}}:{envelope:c,output:d});else if("FEATURES"==d){if(a=c[0].getElementsByTagName("FEATURES"),c=a[0].getElementsByTagName("FEATURECOUNT"),
b.features.featurecount=c[0].getAttribute("count"),0<b.features.featurecount){c=a[0].getElementsByTagName("ENVELOPE");b.features.envelope=this.parseAttributes(c[0],"number");a=a[0].getElementsByTagName("FEATURE");for(c=0;c<a.length;c++){for(var d=new OpenLayers.Feature.Vector,e=a[c].getElementsByTagName("FIELD"),f=0;f<e.length;f++){var g=e[f].getAttribute("name"),h=e[f].getAttribute("value");d.attributes[g]=h}e=a[c].getElementsByTagName("POLYGON");if(0<e.length){e=e[0].getElementsByTagName("RING");
f=[];for(g=0;g<e.length;g++){h=[];h.push(this.parsePointGeometry(e[g]));for(var i=e[g].getElementsByTagName("HOLE"),j=0;j<i.length;j++)h.push(this.parsePointGeometry(i[j]));f.push(new OpenLayers.Geometry.Polygon(h))}d.geometry=1==f.length?f[0]:new OpenLayers.Geometry.MultiPolygon(f)}b.features.feature.push(d)}}}else b.error="Unidentified response type."}return b},parseAttributes:function(a,b){for(var c={},d=0;d<a.attributes.length;d++)c[a.attributes[d].nodeName]="number"==b?parseFloat(a.attributes[d].nodeValue):
a.attributes[d].nodeValue;return c},parsePointGeometry:function(a){var b=[],c=a.getElementsByTagName("COORDS");if(0<c.length){a=this.getChildValue(c[0]);a=a.split(/;/);for(c=0;c<a.length;c++){var d=a[c].split(/ /);b.push(new OpenLayers.Geometry.Point(d[0],d[1]))}}else if(a=a.getElementsByTagName("POINT"),0<a.length)for(c=0;c<a.length;c++)b.push(new OpenLayers.Geometry.Point(parseFloat(a[c].getAttribute("x")),parseFloat(a[c].getAttribute("y"))));return new OpenLayers.Geometry.LinearRing(b)},CLASS_NAME:"OpenLayers.Format.ArcXML"});
OpenLayers.Format.ArcXML.Request=OpenLayers.Class({initialize:function(){return OpenLayers.Util.extend(this,{get_image:{properties:{background:null,draw:!0,envelope:{minx:0,miny:0,maxx:0,maxy:0},featurecoordsys:{id:0,string:"",datumtransformid:0,datumtransformstring:""},filtercoordsys:{id:0,string:"",datumtransformid:0,datumtransformstring:""},imagesize:{height:0,width:0,dpi:96,printheight:0,printwidth:0,scalesymbols:!1},layerlist:[],output:{baseurl:"",legendbaseurl:"",legendname:"",legendpath:"",
legendurl:"",name:"",path:"",type:"jpg",url:""}}},get_feature:{layer:"",query:{isspatial:!1,featurecoordsys:{id:0,string:"",datumtransformid:0,datumtransformstring:""},filtercoordsys:{id:0,string:"",datumtransformid:0,datumtransformstring:""},buffer:0,where:"",spatialfilter:{relation:"envelope_intersection",envelope:null}}},environment:{separators:{cs:" ",ts:";"}},layer:[],workspaces:[]})},CLASS_NAME:"OpenLayers.Format.ArcXML.Request"});
OpenLayers.Format.ArcXML.Response=OpenLayers.Class({initialize:function(){return OpenLayers.Util.extend(this,{image:{envelope:null,output:""},features:{featurecount:0,envelope:null,feature:[]},error:""})},CLASS_NAME:"OpenLayers.Format.ArcXML.Response"});OpenLayers.ProxyHost="";
OpenLayers.Request={DEFAULT_CONFIG:{method:"GET",url:window.location.href,async:!0,user:void 0,password:void 0,params:null,proxy:OpenLayers.ProxyHost,headers:{},data:null,callback:function(){},success:null,failure:null,scope:null},URL_SPLIT_REGEX:/([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/,events:new OpenLayers.Events(this),makeSameOrigin:function(a,b){var c=0!==a.indexOf("http"),d=!c&&a.match(this.URL_SPLIT_REGEX);if(d){var e=window.location,c=d[1]==e.protocol&&d[3]==e.hostname,d=d[4],
e=e.port;if(80!=d&&""!=d||"80"!=e&&""!=e)c=c&&d==e}c||(b?a="function"==typeof b?b(a):b+encodeURIComponent(a):OpenLayers.Console.warn(OpenLayers.i18n("proxyNeeded"),{url:a}));return a},issue:function(a){var b=OpenLayers.Util.extend(this.DEFAULT_CONFIG,{proxy:OpenLayers.ProxyHost}),a=OpenLayers.Util.applyDefaults(a,b),b=!1,c;for(c in a.headers)a.headers.hasOwnProperty(c)&&"x-requested-with"===c.toLowerCase()&&(b=!0);!1===b&&(a.headers["X-Requested-With"]="XMLHttpRequest");var d=new OpenLayers.Request.XMLHttpRequest,
e=OpenLayers.Util.urlAppend(a.url,OpenLayers.Util.getParameterString(a.params||{})),e=OpenLayers.Request.makeSameOrigin(e,a.proxy);d.open(a.method,e,a.async,a.user,a.password);for(var f in a.headers)d.setRequestHeader(f,a.headers[f]);var g=this.events,h=this;d.onreadystatechange=function(){d.readyState==OpenLayers.Request.XMLHttpRequest.DONE&&!1!==g.triggerEvent("complete",{request:d,config:a,requestUrl:e})&&h.runCallbacks({request:d,config:a,requestUrl:e})};!1===a.async?d.send(a.data):window.setTimeout(function(){0!==
d.readyState&&d.send(a.data)},0);return d},runCallbacks:function(a){var b=a.request,c=a.config,d=c.scope?OpenLayers.Function.bind(c.callback,c.scope):c.callback,e;c.success&&(e=c.scope?OpenLayers.Function.bind(c.success,c.scope):c.success);var f;c.failure&&(f=c.scope?OpenLayers.Function.bind(c.failure,c.scope):c.failure);"file:"==OpenLayers.Util.createUrlObject(c.url).protocol&&b.responseText&&(b.status=200);d(b);if(!b.status||200<=b.status&&300>b.status)this.events.triggerEvent("success",a),e&&e(b);
if(b.status&&(200>b.status||300<=b.status))this.events.triggerEvent("failure",a),f&&f(b)},GET:function(a){a=OpenLayers.Util.extend(a,{method:"GET"});return OpenLayers.Request.issue(a)},POST:function(a){a=OpenLayers.Util.extend(a,{method:"POST"});a.headers=a.headers?a.headers:{};"CONTENT-TYPE"in OpenLayers.Util.upperCaseObject(a.headers)||(a.headers["Content-Type"]="application/xml");return OpenLayers.Request.issue(a)},PUT:function(a){a=OpenLayers.Util.extend(a,{method:"PUT"});a.headers=a.headers?
a.headers:{};"CONTENT-TYPE"in OpenLayers.Util.upperCaseObject(a.headers)||(a.headers["Content-Type"]="application/xml");return OpenLayers.Request.issue(a)},DELETE:function(a){a=OpenLayers.Util.extend(a,{method:"DELETE"});return OpenLayers.Request.issue(a)},HEAD:function(a){a=OpenLayers.Util.extend(a,{method:"HEAD"});return OpenLayers.Request.issue(a)},OPTIONS:function(a){a=OpenLayers.Util.extend(a,{method:"OPTIONS"});return OpenLayers.Request.issue(a)}};OpenLayers.Layer.ArcIMS=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{ClientVersion:"9.2",ServiceName:""},featureCoordSys:"4326",filterCoordSys:"4326",layers:null,async:!0,name:"ArcIMS",isBaseLayer:!0,DEFAULT_OPTIONS:{tileSize:new OpenLayers.Size(512,512),featureCoordSys:"4326",filterCoordSys:"4326",layers:null,isBaseLayer:!0,async:!0,name:"ArcIMS"},initialize:function(a,b,c){this.tileSize=new OpenLayers.Size(512,512);this.params=OpenLayers.Util.applyDefaults({ServiceName:c.serviceName},
this.DEFAULT_PARAMS);this.options=OpenLayers.Util.applyDefaults(c,this.DEFAULT_OPTIONS);OpenLayers.Layer.Grid.prototype.initialize.apply(this,[a,b,this.params,c]);if(this.transparent&&(this.isBaseLayer||(this.isBaseLayer=!1),"image/jpeg"==this.format))this.format=OpenLayers.Util.alphaHack()?"image/gif":"image/png";null===this.options.layers&&(this.options.layers=[])},getURL:function(a){var b="",a=this.adjustBounds(a),a=new OpenLayers.Format.ArcXML(OpenLayers.Util.extend(this.options,{requesttype:"image",
envelope:a.toArray(),tileSize:this.tileSize})),a=new OpenLayers.Request.POST({url:this.getFullRequestString(),data:a.write(),async:!1});if(null!=a){b=a.responseXML;if(!b||!b.documentElement)b=a.responseText;b=this.getUrlOrImage((new OpenLayers.Format.ArcXML).read(b).image.output)}return b},getURLasync:function(a,b,c){a=this.adjustBounds(a);a=new OpenLayers.Format.ArcXML(OpenLayers.Util.extend(this.options,{requesttype:"image",envelope:a.toArray(),tileSize:this.tileSize}));OpenLayers.Request.POST({url:this.getFullRequestString(),
async:!0,data:a.write(),callback:function(a){var e=a.responseXML;if(!e||!e.documentElement)e=a.responseText;a=(new OpenLayers.Format.ArcXML).read(e);b.call(c,this.getUrlOrImage(a.image.output))},scope:this})},getUrlOrImage:function(a){var b="";a.url?b=a.url:a.data&&(b="data:image/"+a.type+";base64,"+a.data);return b},setLayerQuery:function(a,b){for(var c=0;c<this.options.layers.length;c++)if(a==this.options.layers[c].id){this.options.layers[c].query=b;return}this.options.layers.push({id:a,visible:!0,
query:b})},getFeatureInfo:function(a,b,c){var d=c.buffer||1,e=c.callback||function(){},f=c.scope||window,g={};OpenLayers.Util.extend(g,this.options);g.requesttype="feature";a instanceof OpenLayers.LonLat?(g.polygon=null,g.envelope=[a.lon-d,a.lat-d,a.lon+d,a.lat+d]):a instanceof OpenLayers.Geometry.Polygon&&(g.envelope=null,g.polygon=a);var h=new OpenLayers.Format.ArcXML(g);OpenLayers.Util.extend(h.request.get_feature,c);h.request.get_feature.layer=b.id;"number"==typeof b.query.accuracy?h.request.get_feature.query.accuracy=
b.query.accuracy:(a=this.map.getCenter(),c=this.map.getViewPortPxFromLonLat(a),c.x++,c=this.map.getLonLatFromPixel(c),h.request.get_feature.query.accuracy=c.lon-a.lon);h.request.get_feature.query.where=b.query.where;h.request.get_feature.query.spatialfilter.relation="area_intersection";OpenLayers.Request.POST({url:this.getFullRequestString({CustomService:"Query"}),data:h.write(),callback:function(a){a=h.parseResponse(a.responseText);h.iserror()?e.call(f,null):e.call(f,a.features)}})},clone:function(a){null==
a&&(a=new OpenLayers.Layer.ArcIMS(this.name,this.url,this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},CLASS_NAME:"OpenLayers.Layer.ArcIMS"});OpenLayers.Format.OWSCommon.v1_1_0=OpenLayers.Class(OpenLayers.Format.OWSCommon.v1,{namespaces:{ows:"http://www.opengis.net/ows/1.1",xlink:"http://www.w3.org/1999/xlink"},readers:{ows:OpenLayers.Util.applyDefaults({ExceptionReport:function(a,b){b.exceptionReport={version:a.getAttribute("version"),language:a.getAttribute("xml:lang"),exceptions:[]};this.readChildNodes(a,b.exceptionReport)},AllowedValues:function(a,b){b.allowedValues={};this.readChildNodes(a,b.allowedValues)},AnyValue:function(a,b){b.anyValue=
!0},DataType:function(a,b){b.dataType=this.getChildValue(a)},Range:function(a,b){b.range={};this.readChildNodes(a,b.range)},MinimumValue:function(a,b){b.minValue=this.getChildValue(a)},MaximumValue:function(a,b){b.maxValue=this.getChildValue(a)},Identifier:function(a,b){b.identifier=this.getChildValue(a)},SupportedCRS:function(a,b){b.supportedCRS=this.getChildValue(a)}},OpenLayers.Format.OWSCommon.v1.prototype.readers.ows)},writers:{ows:OpenLayers.Util.applyDefaults({Range:function(a){var b=this.createElementNSPlus("ows:Range",
{attributes:{"ows:rangeClosure":a.closure}});this.writeNode("ows:MinimumValue",a.minValue,b);this.writeNode("ows:MaximumValue",a.maxValue,b);return b},MinimumValue:function(a){return this.createElementNSPlus("ows:MinimumValue",{value:a})},MaximumValue:function(a){return this.createElementNSPlus("ows:MaximumValue",{value:a})},Value:function(a){return this.createElementNSPlus("ows:Value",{value:a})}},OpenLayers.Format.OWSCommon.v1.prototype.writers.ows)},CLASS_NAME:"OpenLayers.Format.OWSCommon.v1_1_0"});OpenLayers.Format.WCSGetCoverage=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ows:"http://www.opengis.net/ows/1.1",wcs:"http://www.opengis.net/wcs/1.1",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},VERSION:"1.1.2",schemaLocation:"http://www.opengis.net/wcs/1.1 http://schemas.opengis.net/wcs/1.1/wcsGetCoverage.xsd",write:function(a){a=this.writeNode("wcs:GetCoverage",
a);this.setAttributeNS(a,this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation);return OpenLayers.Format.XML.prototype.write.apply(this,[a])},writers:{wcs:{GetCoverage:function(a){var b=this.createElementNSPlus("wcs:GetCoverage",{attributes:{version:a.version||this.VERSION,service:"WCS"}});this.writeNode("ows:Identifier",a.identifier,b);this.writeNode("wcs:DomainSubset",a.domainSubset,b);this.writeNode("wcs:Output",a.output,b);return b},DomainSubset:function(a){var b=this.createElementNSPlus("wcs:DomainSubset",
{});this.writeNode("ows:BoundingBox",a.boundingBox,b);a.temporalSubset&&this.writeNode("wcs:TemporalSubset",a.temporalSubset,b);return b},TemporalSubset:function(a){for(var b=this.createElementNSPlus("wcs:TemporalSubset",{}),c=0,d=a.timePeriods.length;c<d;++c)this.writeNode("wcs:TimePeriod",a.timePeriods[c],b);return b},TimePeriod:function(a){var b=this.createElementNSPlus("wcs:TimePeriod",{});this.writeNode("wcs:BeginPosition",a.begin,b);this.writeNode("wcs:EndPosition",a.end,b);a.resolution&&this.writeNode("wcs:TimeResolution",
a.resolution,b);return b},BeginPosition:function(a){return this.createElementNSPlus("wcs:BeginPosition",{value:a})},EndPosition:function(a){return this.createElementNSPlus("wcs:EndPosition",{value:a})},TimeResolution:function(a){return this.createElementNSPlus("wcs:TimeResolution",{value:a})},Output:function(a){var b=this.createElementNSPlus("wcs:Output",{attributes:{format:a.format,store:a.store}});a.gridCRS&&this.writeNode("wcs:GridCRS",a.gridCRS,b);return b},GridCRS:function(a){var b=this.createElementNSPlus("wcs:GridCRS",
{});this.writeNode("wcs:GridBaseCRS",a.baseCRS,b);a.type&&this.writeNode("wcs:GridType",a.type,b);a.origin&&this.writeNode("wcs:GridOrigin",a.origin,b);this.writeNode("wcs:GridOffsets",a.offsets,b);a.CS&&this.writeNode("wcs:GridCS",a.CS,b);return b},GridBaseCRS:function(a){return this.createElementNSPlus("wcs:GridBaseCRS",{value:a})},GridOrigin:function(a){return this.createElementNSPlus("wcs:GridOrigin",{value:a})},GridType:function(a){return this.createElementNSPlus("wcs:GridType",{value:a})},GridOffsets:function(a){return this.createElementNSPlus("wcs:GridOffsets",
{value:a})},GridCS:function(a){return this.createElementNSPlus("wcs:GridCS",{value:a})}},ows:OpenLayers.Format.OWSCommon.v1_1_0.prototype.writers.ows},CLASS_NAME:"OpenLayers.Format.WCSGetCoverage"});OpenLayers.Format.WPSExecute=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ows:"http://www.opengis.net/ows/1.1",gml:"http://www.opengis.net/gml",wps:"http://www.opengis.net/wps/1.0.0",wfs:"http://www.opengis.net/wfs",ogc:"http://www.opengis.net/ogc",wcs:"http://www.opengis.net/wcs",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},VERSION:"1.0.0",schemaLocation:"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd",
schemaLocationAttr:function(){},write:function(a){var b;window.ActiveXObject?this.xmldom=b=new ActiveXObject("Microsoft.XMLDOM"):b=document.implementation.createDocument("","",null);a=this.writeNode("wps:Execute",a,b);this.setAttributeNS(a,this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation);return OpenLayers.Format.XML.prototype.write.apply(this,[a])},writers:{wps:{Execute:function(a){var b=this.createElementNSPlus("wps:Execute",{attributes:{version:this.VERSION,service:"WPS"}});this.writeNode("ows:Identifier",
a.identifier,b);this.writeNode("wps:DataInputs",a.dataInputs,b);this.writeNode("wps:ResponseForm",a.responseForm,b);return b},ResponseForm:function(a){var b=this.createElementNSPlus("wps:ResponseForm",{});a.rawDataOutput&&this.writeNode("wps:RawDataOutput",a.rawDataOutput,b);a.responseDocument&&this.writeNode("wps:ResponseDocument",a.responseDocument,b);return b},ResponseDocument:function(a){var b=this.createElementNSPlus("wps:ResponseDocument",{attributes:{storeExecuteResponse:a.storeExecuteResponse,
lineage:a.lineage,status:a.status}});a.output&&this.writeNode("wps:Output",a.output,b);return b},Output:function(a){var b=this.createElementNSPlus("wps:Output",{attributes:{asReference:a.asReference}});this.writeNode("ows:Identifier",a.identifier,b);this.writeNode("ows:Title",a.title,b);this.writeNode("ows:Abstract",a["abstract"],b);return b},RawDataOutput:function(a){var b=this.createElementNSPlus("wps:RawDataOutput",{attributes:{mimeType:a.mimeType}});this.writeNode("ows:Identifier",a.identifier,
b);return b},DataInputs:function(a){for(var b=this.createElementNSPlus("wps:DataInputs",{}),c=0,d=a.length;c<d;++c)this.writeNode("wps:Input",a[c],b);return b},Input:function(a){var b=this.createElementNSPlus("wps:Input",{});this.writeNode("ows:Identifier",a.identifier,b);a.title&&this.writeNode("ows:Title",a.title,b);a.data&&this.writeNode("wps:Data",a.data,b);a.reference&&this.writeNode("wps:Reference",a.reference,b);return b},Data:function(a){var b=this.createElementNSPlus("wps:Data",{});a.literalData?
this.writeNode("wps:LiteralData",a.literalData,b):a.complexData&&this.writeNode("wps:ComplexData",a.complexData,b);return b},LiteralData:function(a){return this.createElementNSPlus("wps:LiteralData",{attributes:{uom:a.uom},value:a.value})},ComplexData:function(a){var b=this.createElementNSPlus("wps:ComplexData",{attributes:{mimeType:a.mimeType,encoding:a.encoding,schema:a.schema}}),c=a.value;"string"===typeof c?b.appendChild(this.getXMLDoc().createCDATASection(a.value)):b.appendChild(c);return b},
Reference:function(a){var b=this.createElementNSPlus("wps:Reference",{attributes:{mimeType:a.mimeType,"xlink:href":a.href,method:a.method,encoding:a.encoding,schema:a.schema}});a.body&&this.writeNode("wps:Body",a.body,b);return b},Body:function(a){var b=this.createElementNSPlus("wps:Body",{});a.wcs?this.writeNode("wcs:GetCoverage",a.wcs,b):a.wfs?(this.featureType=a.wfs.featureType,this.version=a.wfs.version,this.writeNode("wfs:GetFeature",a.wfs,b)):this.writeNode("wps:Execute",a,b);return b}},wcs:OpenLayers.Format.WCSGetCoverage.prototype.writers.wcs,
wfs:OpenLayers.Format.WFST.v1_1_0.prototype.writers.wfs,ogc:OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc,ows:OpenLayers.Format.OWSCommon.v1_1_0.prototype.writers.ows},CLASS_NAME:"OpenLayers.Format.WPSExecute"});OpenLayers.Control.PanZoom=OpenLayers.Class(OpenLayers.Control,{slideFactor:50,slideRatio:null,buttons:null,position:null,initialize:function(a){this.position=new OpenLayers.Pixel(OpenLayers.Control.PanZoom.X,OpenLayers.Control.PanZoom.Y);OpenLayers.Control.prototype.initialize.apply(this,arguments)},destroy:function(){this.map&&this.map.events.unregister("buttonclick",this,this.onButtonClick);this.removeButtons();this.position=this.buttons=null;OpenLayers.Control.prototype.destroy.apply(this,arguments)},
setMap:function(a){OpenLayers.Control.prototype.setMap.apply(this,arguments);this.map.events.register("buttonclick",this,this.onButtonClick)},draw:function(a){OpenLayers.Control.prototype.draw.apply(this,arguments);a=this.position;this.buttons=[];var b={w:18,h:18},c=new OpenLayers.Pixel(a.x+b.w/2,a.y);this._addButton("panup","north-mini.png",c,b);a.y=c.y+b.h;this._addButton("panleft","west-mini.png",a,b);this._addButton("panright","east-mini.png",a.add(b.w,0),b);this._addButton("pandown","south-mini.png",
c.add(0,2*b.h),b);this._addButton("zoomin","zoom-plus-mini.png",c.add(0,3*b.h+5),b);this._addButton("zoomworld","zoom-world-mini.png",c.add(0,4*b.h+5),b);this._addButton("zoomout","zoom-minus-mini.png",c.add(0,5*b.h+5),b);return this.div},_addButton:function(a,b,c,d){b=OpenLayers.Util.getImageLocation(b);c=OpenLayers.Util.createAlphaImageDiv(this.id+"_"+a,c,d,b,"absolute");c.style.cursor="pointer";this.div.appendChild(c);c.action=a;c.className="olButton";this.buttons.push(c);return c},_removeButton:function(a){this.div.removeChild(a);
OpenLayers.Util.removeItem(this.buttons,a)},removeButtons:function(){for(var a=this.buttons.length-1;0<=a;--a)this._removeButton(this.buttons[a])},onButtonClick:function(a){switch(a.buttonElement.action){case "panup":this.map.pan(0,-this.getSlideFactor("h"));break;case "pandown":this.map.pan(0,this.getSlideFactor("h"));break;case "panleft":this.map.pan(-this.getSlideFactor("w"),0);break;case "panright":this.map.pan(this.getSlideFactor("w"),0);break;case "zoomin":this.map.zoomIn();break;case "zoomout":this.map.zoomOut();
break;case "zoomworld":this.map.zoomToMaxExtent()}},getSlideFactor:function(a){return this.slideRatio?this.map.getSize()[a]*this.slideRatio:this.slideFactor},CLASS_NAME:"OpenLayers.Control.PanZoom"});OpenLayers.Control.PanZoom.X=4;OpenLayers.Control.PanZoom.Y=4;OpenLayers.Control.PanZoomBar=OpenLayers.Class(OpenLayers.Control.PanZoom,{zoomStopWidth:18,zoomStopHeight:11,slider:null,sliderEvents:null,zoombarDiv:null,zoomWorldIcon:!1,panIcons:!0,forceFixedZoomLevel:!1,mouseDragStart:null,deltaY:null,zoomStart:null,destroy:function(){this._removeZoomBar();this.map.events.un({changebaselayer:this.redraw,scope:this});OpenLayers.Control.PanZoom.prototype.destroy.apply(this,arguments);delete this.mouseDragStart;delete this.zoomStart},setMap:function(a){OpenLayers.Control.PanZoom.prototype.setMap.apply(this,
arguments);this.map.events.register("changebaselayer",this,this.redraw)},redraw:function(){null!=this.div&&(this.removeButtons(),this._removeZoomBar());this.draw()},draw:function(a){OpenLayers.Control.prototype.draw.apply(this,arguments);a=this.position.clone();this.buttons=[];var b={w:18,h:18};if(this.panIcons){var c=new OpenLayers.Pixel(a.x+b.w/2,a.y),d=b.w;this.zoomWorldIcon&&(c=new OpenLayers.Pixel(a.x+b.w,a.y));this._addButton("panup","north-mini.png",c,b);a.y=c.y+b.h;this._addButton("panleft",
"west-mini.png",a,b);this.zoomWorldIcon&&(this._addButton("zoomworld","zoom-world-mini.png",a.add(b.w,0),b),d*=2);this._addButton("panright","east-mini.png",a.add(d,0),b);this._addButton("pandown","south-mini.png",c.add(0,2*b.h),b);this._addButton("zoomin","zoom-plus-mini.png",c.add(0,3*b.h+5),b);c=this._addZoomBar(c.add(0,4*b.h+5));this._addButton("zoomout","zoom-minus-mini.png",c,b)}else this._addButton("zoomin","zoom-plus-mini.png",a,b),c=this._addZoomBar(a.add(0,b.h)),this._addButton("zoomout",
"zoom-minus-mini.png",c,b),this.zoomWorldIcon&&(c=c.add(0,b.h+3),this._addButton("zoomworld","zoom-world-mini.png",c,b));return this.div},_addZoomBar:function(a){var b=OpenLayers.Util.getImageLocation("slider.png"),c=this.id+"_"+this.map.id,d=this.map.getNumZoomLevels()-1-this.map.getZoom(),d=OpenLayers.Util.createAlphaImageDiv(c,a.add(-1,d*this.zoomStopHeight),{w:20,h:9},b,"absolute");d.style.cursor="move";this.slider=d;this.sliderEvents=new OpenLayers.Events(this,d,null,!0,{includeXY:!0});this.sliderEvents.on({touchstart:this.zoomBarDown,
touchmove:this.zoomBarDrag,touchend:this.zoomBarUp,mousedown:this.zoomBarDown,mousemove:this.zoomBarDrag,mouseup:this.zoomBarUp});var e={w:this.zoomStopWidth,h:this.zoomStopHeight*this.map.getNumZoomLevels()},b=OpenLayers.Util.getImageLocation("zoombar.png"),c=null;OpenLayers.Util.alphaHack()?(c=this.id+"_"+this.map.id,c=OpenLayers.Util.createAlphaImageDiv(c,a,{w:e.w,h:this.zoomStopHeight},b,"absolute",null,"crop"),c.style.height=e.h+"px"):c=OpenLayers.Util.createDiv("OpenLayers_Control_PanZoomBar_Zoombar"+
this.map.id,a,e,b);c.style.cursor="pointer";c.className="olButton";this.zoombarDiv=c;this.div.appendChild(c);this.startTop=parseInt(c.style.top);this.div.appendChild(d);this.map.events.register("zoomend",this,this.moveZoomBar);return a=a.add(0,this.zoomStopHeight*this.map.getNumZoomLevels())},_removeZoomBar:function(){this.sliderEvents.un({touchstart:this.zoomBarDown,touchmove:this.zoomBarDrag,touchend:this.zoomBarUp,mousedown:this.zoomBarDown,mousemove:this.zoomBarDrag,mouseup:this.zoomBarUp});this.sliderEvents.destroy();
this.div.removeChild(this.zoombarDiv);this.zoombarDiv=null;this.div.removeChild(this.slider);this.slider=null;this.map.events.unregister("zoomend",this,this.moveZoomBar)},onButtonClick:function(a){OpenLayers.Control.PanZoom.prototype.onButtonClick.apply(this,arguments);if(a.buttonElement===this.zoombarDiv){var b=a.buttonXY.y/this.zoomStopHeight;if(this.forceFixedZoomLevel||!this.map.fractionalZoom)b=Math.floor(b);b=this.map.getNumZoomLevels()-1-b;b=Math.min(Math.max(b,0),this.map.getNumZoomLevels()-
1);this.map.zoomTo(b)}},passEventToSlider:function(a){this.sliderEvents.handleBrowserEvent(a)},zoomBarDown:function(a){if(OpenLayers.Event.isLeftClick(a)||OpenLayers.Event.isSingleTouch(a))this.map.events.on({touchmove:this.passEventToSlider,mousemove:this.passEventToSlider,mouseup:this.passEventToSlider,scope:this}),this.mouseDragStart=a.xy.clone(),this.zoomStart=a.xy.clone(),this.div.style.cursor="move",this.zoombarDiv.offsets=null,OpenLayers.Event.stop(a)},zoomBarDrag:function(a){if(null!=this.mouseDragStart){var b=
this.mouseDragStart.y-a.xy.y,c=OpenLayers.Util.pagePosition(this.zoombarDiv);0<a.clientY-c[1]&&a.clientY-c[1]<parseInt(this.zoombarDiv.style.height)-2&&(this.slider.style.top=parseInt(this.slider.style.top)-b+"px",this.mouseDragStart=a.xy.clone());this.deltaY=this.zoomStart.y-a.xy.y;OpenLayers.Event.stop(a)}},zoomBarUp:function(a){if((OpenLayers.Event.isLeftClick(a)||"touchend"===a.type)&&this.mouseDragStart){this.div.style.cursor="";this.map.events.un({touchmove:this.passEventToSlider,mouseup:this.passEventToSlider,
mousemove:this.passEventToSlider,scope:this});var b=this.map.zoom;!this.forceFixedZoomLevel&&this.map.fractionalZoom?(b+=this.deltaY/this.zoomStopHeight,b=Math.min(Math.max(b,0),this.map.getNumZoomLevels()-1)):(b+=this.deltaY/this.zoomStopHeight,b=Math.max(Math.round(b),0));this.map.zoomTo(b);this.zoomStart=this.mouseDragStart=null;this.deltaY=0;OpenLayers.Event.stop(a)}},moveZoomBar:function(){this.slider.style.top=(this.map.getNumZoomLevels()-1-this.map.getZoom())*this.zoomStopHeight+this.startTop+
1+"px"},CLASS_NAME:"OpenLayers.Control.PanZoomBar"});OpenLayers.Format.WFSCapabilities=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.1.0",errorProperty:"service",CLASS_NAME:"OpenLayers.Format.WFSCapabilities"});OpenLayers.Format.WFSCapabilities.v1=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{wfs:"http://www.opengis.net/wfs",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance",ows:"http://www.opengis.net/ows"},defaultPrefix:"wfs",read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,b);return b},readers:{wfs:{WFS_Capabilities:function(a,b){this.readChildNodes(a,b)},
FeatureTypeList:function(a,b){b.featureTypeList={featureTypes:[]};this.readChildNodes(a,b.featureTypeList)},FeatureType:function(a,b){var c={};this.readChildNodes(a,c);b.featureTypes.push(c)},Name:function(a,b){var c=this.getChildValue(a);c&&(c=c.split(":"),b.name=c.pop(),0<c.length&&(b.featureNS=this.lookupNamespaceURI(a,c[0])))},Title:function(a,b){var c=this.getChildValue(a);c&&(b.title=c)},Abstract:function(a,b){var c=this.getChildValue(a);c&&(b["abstract"]=c)}}},CLASS_NAME:"OpenLayers.Format.WFSCapabilities.v1"});OpenLayers.Format.WFSCapabilities.v1_1_0=OpenLayers.Class(OpenLayers.Format.WFSCapabilities.v1,{regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},readers:{wfs:OpenLayers.Util.applyDefaults({DefaultSRS:function(a,b){var c=this.getChildValue(a);c&&(b.srs=c)}},OpenLayers.Format.WFSCapabilities.v1.prototype.readers.wfs),ows:OpenLayers.Format.OWSCommon.v1.prototype.readers.ows},CLASS_NAME:"OpenLayers.Format.WFSCapabilities.v1_1_0"});OpenLayers.Layer.Image=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:!0,url:null,extent:null,size:null,tile:null,aspectRatio:null,initialize:function(a,b,c,d,e){this.url=b;this.maxExtent=this.extent=c;this.size=d;OpenLayers.Layer.prototype.initialize.apply(this,[a,e]);this.aspectRatio=this.extent.getHeight()/this.size.h/(this.extent.getWidth()/this.size.w)},destroy:function(){this.tile&&(this.removeTileMonitoringHooks(this.tile),this.tile.destroy(),this.tile=null);OpenLayers.Layer.prototype.destroy.apply(this,
arguments)},clone:function(a){null==a&&(a=new OpenLayers.Layer.Image(this.name,this.url,this.extent,this.size,this.getOptions()));return a=OpenLayers.Layer.prototype.clone.apply(this,[a])},setMap:function(a){null==this.options.maxResolution&&(this.options.maxResolution=this.aspectRatio*this.extent.getWidth()/this.size.w);OpenLayers.Layer.prototype.setMap.apply(this,arguments)},moveTo:function(a,b,c){OpenLayers.Layer.prototype.moveTo.apply(this,arguments);var d=null==this.tile;if(b||d){this.setTileSize();
var e=this.map.getLayerPxFromLonLat({lon:this.extent.left,lat:this.extent.top});d?(this.tile=new OpenLayers.Tile.Image(this,e,this.extent,null,this.tileSize),this.addTileMonitoringHooks(this.tile)):(this.tile.size=this.tileSize.clone(),this.tile.position=e.clone());this.tile.draw()}},setTileSize:function(){var a=this.extent.getWidth()/this.map.getResolution(),b=this.extent.getHeight()/this.map.getResolution();this.tileSize=new OpenLayers.Size(a,b)},addTileMonitoringHooks:function(a){a.onLoadStart=
function(){this.events.triggerEvent("loadstart")};a.events.register("loadstart",this,a.onLoadStart);a.onLoadEnd=function(){this.events.triggerEvent("loadend")};a.events.register("loadend",this,a.onLoadEnd);a.events.register("unload",this,a.onLoadEnd)},removeTileMonitoringHooks:function(a){a.unload();a.events.un({loadstart:a.onLoadStart,loadend:a.onLoadEnd,unload:a.onLoadEnd,scope:this})},setUrl:function(a){this.url=a;this.tile.draw()},getURL:function(){return this.url},CLASS_NAME:"OpenLayers.Layer.Image"});OpenLayers.Strategy=OpenLayers.Class({layer:null,options:null,active:null,autoActivate:!0,autoDestroy:!0,initialize:function(a){OpenLayers.Util.extend(this,a);this.options=a;this.active=!1},destroy:function(){this.deactivate();this.options=this.layer=null},setLayer:function(a){this.layer=a},activate:function(){return!this.active?this.active=!0:!1},deactivate:function(){return this.active?(this.active=!1,!0):!1},CLASS_NAME:"OpenLayers.Strategy"});OpenLayers.Strategy.Save=OpenLayers.Class(OpenLayers.Strategy,{events:null,auto:!1,timer:null,initialize:function(a){OpenLayers.Strategy.prototype.initialize.apply(this,[a]);this.events=new OpenLayers.Events(this)},activate:function(){var a=OpenLayers.Strategy.prototype.activate.call(this);if(a&&this.auto)if("number"===typeof this.auto)this.timer=window.setInterval(OpenLayers.Function.bind(this.save,this),1E3*this.auto);else this.layer.events.on({featureadded:this.triggerSave,afterfeaturemodified:this.triggerSave,
scope:this});return a},deactivate:function(){var a=OpenLayers.Strategy.prototype.deactivate.call(this);a&&this.auto&&("number"===typeof this.auto?window.clearInterval(this.timer):this.layer.events.un({featureadded:this.triggerSave,afterfeaturemodified:this.triggerSave,scope:this}));return a},triggerSave:function(a){var b=a.feature;(b.state===OpenLayers.State.INSERT||b.state===OpenLayers.State.UPDATE||b.state===OpenLayers.State.DELETE)&&this.save([a.feature])},save:function(a){a||(a=this.layer.features);
this.events.triggerEvent("start",{features:a});var b=this.layer.projection,c=this.layer.map.getProjectionObject();if(!c.equals(b)){for(var d=a.length,e=Array(d),f,g,h=0;h<d;++h)f=a[h],g=f.clone(),g.fid=f.fid,g.state=f.state,f.url&&(g.url=f.url),g._original=f,g.geometry.transform(c,b),e[h]=g;a=e}this.layer.protocol.commit(a,{callback:this.onCommit,scope:this})},onCommit:function(a){var b={response:a};if(a.success()){for(var c=a.reqFeatures,d,e=[],f=a.insertIds||[],g=0,h=0,i=c.length;h<i;++h)if(d=c[h],
d=d._original||d,a=d.state)a==OpenLayers.State.DELETE?e.push(d):a==OpenLayers.State.INSERT&&(d.fid=f[g],++g),d.state=null;0<e.length&&this.layer.destroyFeatures(e);this.events.triggerEvent("success",b)}else this.events.triggerEvent("fail",b)},CLASS_NAME:"OpenLayers.Strategy.Save"});OpenLayers.Format.GPX=OpenLayers.Class(OpenLayers.Format.XML,{defaultDesc:"No description available",extractWaypoints:!0,extractTracks:!0,extractRoutes:!0,extractAttributes:!0,namespaces:{gpx:"http://www.topografix.com/GPX/1/1",xsi:"http://www.w3.org/2001/XMLSchema-instance"},schemaLocation:"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",creator:"OpenLayers",initialize:function(a){this.externalProjection=new OpenLayers.Projection("EPSG:4326");OpenLayers.Format.XML.prototype.initialize.apply(this,
[a])},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var b=[];if(this.extractTracks)for(var c=a.getElementsByTagName("trk"),d=0,e=c.length;d<e;d++){var f={};this.extractAttributes&&(f=this.parseAttributes(c[d]));for(var g=this.getElementsByTagNameNS(c[d],c[d].namespaceURI,"trkseg"),h=0,i=g.length;h<i;h++){var j=this.extractSegment(g[h],"trkpt");b.push(new OpenLayers.Feature.Vector(j,f))}}if(this.extractRoutes){e=a.getElementsByTagName("rte");c=0;for(d=
e.length;c<d;c++)f={},this.extractAttributes&&(f=this.parseAttributes(e[c])),g=this.extractSegment(e[c],"rtept"),b.push(new OpenLayers.Feature.Vector(g,f))}if(this.extractWaypoints){a=a.getElementsByTagName("wpt");c=0;for(e=a.length;c<e;c++)f={},this.extractAttributes&&(f=this.parseAttributes(a[c])),d=new OpenLayers.Geometry.Point(a[c].getAttribute("lon"),a[c].getAttribute("lat")),b.push(new OpenLayers.Feature.Vector(d,f))}if(this.internalProjection&&this.externalProjection){f=0;for(a=b.length;f<
a;f++)b[f].geometry.transform(this.externalProjection,this.internalProjection)}return b},extractSegment:function(a,b){for(var c=this.getElementsByTagNameNS(a,a.namespaceURI,b),d=[],e=0,f=c.length;e<f;e++)d.push(new OpenLayers.Geometry.Point(c[e].getAttribute("lon"),c[e].getAttribute("lat")));return new OpenLayers.Geometry.LineString(d)},parseAttributes:function(a){for(var b={},a=a.firstChild,c,d;a;){if(1==a.nodeType&&a.firstChild&&(c=a.firstChild,3==c.nodeType||4==c.nodeType))d=a.prefix?a.nodeName.split(":")[1]:
a.nodeName,"trkseg"!=d&&"rtept"!=d&&(b[d]=c.nodeValue);a=a.nextSibling}return b},write:function(a,b){var a=OpenLayers.Util.isArray(a)?a:[a],c=this.createElementNS(this.namespaces.gpx,"gpx");c.setAttribute("version","1.1");c.setAttribute("creator",this.creator);this.setAttributes(c,{"xsi:schemaLocation":this.schemaLocation});b&&"object"==typeof b&&c.appendChild(this.buildMetadataNode(b));for(var d=0,e=a.length;d<e;d++)c.appendChild(this.buildFeatureNode(a[d]));return OpenLayers.Format.XML.prototype.write.apply(this,
[c])},buildMetadataNode:function(a){for(var b=["name","desc","author"],c=this.createElementNSPlus("gpx:metadata"),d=0;d<b.length;d++){var e=b[d];if(a[e]){var f=this.createElementNSPlus("gpx:"+e);f.appendChild(this.createTextNode(a[e]));c.appendChild(f)}}return c},buildFeatureNode:function(a){var b=a.geometry,b=b.clone();this.internalProjection&&this.externalProjection&&b.transform(this.internalProjection,this.externalProjection);if("OpenLayers.Geometry.Point"==b.CLASS_NAME){var c=this.buildWptNode(b);
this.appendAttributesNode(c,a);return c}c=this.createElementNSPlus("gpx:trk");this.appendAttributesNode(c,a);for(var a=this.buildTrkSegNode(b),a=OpenLayers.Util.isArray(a)?a:[a],b=0,d=a.length;b<d;b++)c.appendChild(a[b]);return c},buildTrkSegNode:function(a){var b,c,d,e;if("OpenLayers.Geometry.LineString"==a.CLASS_NAME||"OpenLayers.Geometry.LinearRing"==a.CLASS_NAME){b=this.createElementNSPlus("gpx:trkseg");c=0;for(d=a.components.length;c<d;c++)e=a.components[c],b.appendChild(this.buildTrkPtNode(e));
return b}b=[];c=0;for(d=a.components.length;c<d;c++)b.push(this.buildTrkSegNode(a.components[c]));return b},buildTrkPtNode:function(a){var b=this.createElementNSPlus("gpx:trkpt");b.setAttribute("lon",a.x);b.setAttribute("lat",a.y);return b},buildWptNode:function(a){var b=this.createElementNSPlus("gpx:wpt");b.setAttribute("lon",a.x);b.setAttribute("lat",a.y);return b},appendAttributesNode:function(a,b){var c=this.createElementNSPlus("gpx:name");c.appendChild(this.createTextNode(b.attributes.name||
b.id));a.appendChild(c);c=this.createElementNSPlus("gpx:desc");c.appendChild(this.createTextNode(b.attributes.description||this.defaultDesc));a.appendChild(c)},CLASS_NAME:"OpenLayers.Format.GPX"});OpenLayers.Format.WMSDescribeLayer=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.1.1",getVersion:function(a,b){var c=OpenLayers.Format.XML.VersionedOGC.prototype.getVersion.apply(this,arguments);if("1.1.1"==c||"1.1.0"==c)c="1.1";return c},CLASS_NAME:"OpenLayers.Format.WMSDescribeLayer"});OpenLayers.Format.WMSDescribeLayer.v1_1=OpenLayers.Class(OpenLayers.Format.WMSDescribeLayer,{initialize:function(a){OpenLayers.Format.WMSDescribeLayer.prototype.initialize.apply(this,[a])},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));for(var a=a.documentElement.childNodes,b=[],c,d,e=0;e<a.length;++e)if(c=a[e],d=c.nodeName,"LayerDescription"==d){d=c.getAttribute("name");var f="",g="",h="";c.getAttribute("owsType")?(f=c.getAttribute("owsType"),g=c.getAttribute("owsURL")):
""!=c.getAttribute("wfs")?(f="WFS",g=c.getAttribute("wfs")):""!=c.getAttribute("wcs")&&(f="WCS",g=c.getAttribute("wcs"));c=c.getElementsByTagName("Query");0<c.length&&((h=c[0].getAttribute("typeName"))||(h=c[0].getAttribute("typename")));b.push({layerName:d,owsType:f,owsURL:g,typeName:h})}return b},CLASS_NAME:"OpenLayers.Format.WMSDescribeLayer.v1_1"});OpenLayers.Layer.XYZ=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:!0,sphericalMercator:!1,zoomOffset:0,serverResolutions:null,initialize:function(a,b,c){if(c&&c.sphericalMercator||this.sphericalMercator)c=OpenLayers.Util.extend({projection:"EPSG:900913",numZoomLevels:19},c);OpenLayers.Layer.Grid.prototype.initialize.apply(this,[a||this.name,b||this.url,{},c])},clone:function(a){null==a&&(a=new OpenLayers.Layer.XYZ(this.name,this.url,this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,
[a])},getURL:function(a){var a=this.getXYZ(a),b=this.url;OpenLayers.Util.isArray(b)&&(b=this.selectUrl(""+a.x+a.y+a.z,b));return OpenLayers.String.format(b,a)},getXYZ:function(a){var b=this.getServerResolution(),c=Math.round((a.left-this.maxExtent.left)/(b*this.tileSize.w)),a=Math.round((this.maxExtent.top-a.top)/(b*this.tileSize.h)),b=this.getServerZoom();if(this.wrapDateLine)var d=Math.pow(2,b),c=(c%d+d)%d;return{x:c,y:a,z:b}},setMap:function(a){OpenLayers.Layer.Grid.prototype.setMap.apply(this,
arguments);this.tileOrigin||(this.tileOrigin=new OpenLayers.LonLat(this.maxExtent.left,this.maxExtent.bottom))},CLASS_NAME:"OpenLayers.Layer.XYZ"});OpenLayers.Layer.OSM=OpenLayers.Class(OpenLayers.Layer.XYZ,{name:"OpenStreetMap",url:["http://a.tile.openstreetmap.org/${z}/${x}/${y}.png","http://b.tile.openstreetmap.org/${z}/${x}/${y}.png","http://c.tile.openstreetmap.org/${z}/${x}/${y}.png"],attribution:"Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",sphericalMercator:!0,wrapDateLine:!0,tileOptions:null,initialize:function(a,b,c){OpenLayers.Layer.XYZ.prototype.initialize.apply(this,arguments);this.tileOptions=OpenLayers.Util.extend({crossOriginKeyword:"anonymous"},
this.options&&this.options.tileOptions)},clone:function(a){null==a&&(a=new OpenLayers.Layer.OSM(this.name,this.url,this.getOptions()));return a=OpenLayers.Layer.XYZ.prototype.clone.apply(this,[a])},CLASS_NAME:"OpenLayers.Layer.OSM"});OpenLayers.Renderer=OpenLayers.Class({container:null,root:null,extent:null,locked:!1,size:null,resolution:null,map:null,featureDx:0,initialize:function(a,b){this.container=OpenLayers.Util.getElement(a);OpenLayers.Util.extend(this,b)},destroy:function(){this.map=this.resolution=this.size=this.extent=this.container=null},supported:function(){return!1},setExtent:function(a,b){this.extent=a.clone();if(this.map.baseLayer&&this.map.baseLayer.wrapDateLine){var c=a.getWidth()/this.map.getExtent().getWidth(),
a=a.scale(1/c);this.extent=a.wrapDateLine(this.map.getMaxExtent()).scale(c)}b&&(this.resolution=null);return!0},setSize:function(a){this.size=a.clone();this.resolution=null},getResolution:function(){return this.resolution=this.resolution||this.map.getResolution()},drawFeature:function(a,b){null==b&&(b=a.style);if(a.geometry){var c=a.geometry.getBounds();if(c){var d;this.map.baseLayer&&this.map.baseLayer.wrapDateLine&&(d=this.map.getMaxExtent());c.intersectsBounds(this.extent,{worldBounds:d})?this.calculateFeatureDx(c,
d):b={display:"none"};c=this.drawGeometry(a.geometry,b,a.id);if("none"!=b.display&&b.label&&!1!==c){d=a.geometry.getCentroid();if(b.labelXOffset||b.labelYOffset){var e=isNaN(b.labelXOffset)?0:b.labelXOffset,f=isNaN(b.labelYOffset)?0:b.labelYOffset,g=this.getResolution();d.move(e*g,f*g)}this.drawText(a.id,b,d)}else this.removeText(a.id);return c}}},calculateFeatureDx:function(a,b){this.featureDx=0;if(b){var c=b.getWidth();this.featureDx=Math.round(((a.left+a.right)/2-(this.extent.left+this.extent.right)/
2)/c)*c}},drawGeometry:function(){},drawText:function(){},removeText:function(){},clear:function(){},getFeatureIdFromEvent:function(){},eraseFeatures:function(a){OpenLayers.Util.isArray(a)||(a=[a]);for(var b=0,c=a.length;b<c;++b){var d=a[b];this.eraseGeometry(d.geometry,d.id);this.removeText(d.id)}},eraseGeometry:function(){},moveRoot:function(){},getRenderLayerId:function(){return this.container.id},applyDefaultSymbolizer:function(a){var b=OpenLayers.Util.extend({},OpenLayers.Renderer.defaultSymbolizer);
!1===a.stroke&&(delete b.strokeWidth,delete b.strokeColor);!1===a.fill&&delete b.fillColor;OpenLayers.Util.extend(b,a);return b},CLASS_NAME:"OpenLayers.Renderer"});OpenLayers.Renderer.defaultSymbolizer={fillColor:"#000000",strokeColor:"#000000",strokeWidth:2,fillOpacity:1,strokeOpacity:1,pointRadius:0,labelAlign:"cm"};
OpenLayers.Renderer.symbol={star:[350,75,379,161,469,161,397,215,423,301,350,250,277,301,303,215,231,161,321,161,350,75],cross:[4,0,6,0,6,4,10,4,10,6,6,6,6,10,4,10,4,6,0,6,0,4,4,4,4,0],x:[0,0,25,0,50,35,75,0,100,0,65,50,100,100,75,100,50,65,25,100,0,100,35,50,0,0],square:[0,0,0,1,1,1,1,0,0,0],triangle:[0,10,10,10,5,0,0,10]};OpenLayers.Renderer.Canvas=OpenLayers.Class(OpenLayers.Renderer,{hitDetection:!0,hitOverflow:0,canvas:null,features:null,pendingRedraw:!1,cachedSymbolBounds:{},initialize:function(a,b){OpenLayers.Renderer.prototype.initialize.apply(this,arguments);this.root=document.createElement("canvas");this.container.appendChild(this.root);this.canvas=this.root.getContext("2d");this.features={};this.hitDetection&&(this.hitCanvas=document.createElement("canvas"),this.hitContext=this.hitCanvas.getContext("2d"))},
setExtent:function(){OpenLayers.Renderer.prototype.setExtent.apply(this,arguments);return!1},eraseGeometry:function(a,b){this.eraseFeatures(this.features[b][0])},supported:function(){return OpenLayers.CANVAS_SUPPORTED},setSize:function(a){this.size=a.clone();var b=this.root;b.style.width=a.w+"px";b.style.height=a.h+"px";b.width=a.w;b.height=a.h;this.resolution=null;this.hitDetection&&(b=this.hitCanvas,b.style.width=a.w+"px",b.style.height=a.h+"px",b.width=a.w,b.height=a.h)},drawFeature:function(a,
b){var c;if(a.geometry){b=this.applyDefaultSymbolizer(b||a.style);c=a.geometry.getBounds();var d;this.map.baseLayer&&this.map.baseLayer.wrapDateLine&&(d=this.map.getMaxExtent());d=c&&c.intersectsBounds(this.extent,{worldBounds:d});(c="none"!==b.display&&!!c&&d)?this.features[a.id]=[a,b]:delete this.features[a.id];this.pendingRedraw=!0}this.pendingRedraw&&!this.locked&&(this.redraw(),this.pendingRedraw=!1);return c},drawGeometry:function(a,b,c){var d=a.CLASS_NAME;if("OpenLayers.Geometry.Collection"==
d||"OpenLayers.Geometry.MultiPoint"==d||"OpenLayers.Geometry.MultiLineString"==d||"OpenLayers.Geometry.MultiPolygon"==d)for(d=0;d<a.components.length;d++)this.drawGeometry(a.components[d],b,c);else switch(a.CLASS_NAME){case "OpenLayers.Geometry.Point":this.drawPoint(a,b,c);break;case "OpenLayers.Geometry.LineString":this.drawLineString(a,b,c);break;case "OpenLayers.Geometry.LinearRing":this.drawLinearRing(a,b,c);break;case "OpenLayers.Geometry.Polygon":this.drawPolygon(a,b,c)}},drawExternalGraphic:function(a,
b,c){var d=new Image;b.graphicTitle&&(d.title=b.graphicTitle);var e=b.graphicWidth||b.graphicHeight,f=b.graphicHeight||b.graphicWidth,e=e?e:2*b.pointRadius,f=f?f:2*b.pointRadius,g=void 0!=b.graphicXOffset?b.graphicXOffset:-(0.5*e),h=void 0!=b.graphicYOffset?b.graphicYOffset:-(0.5*f),i=b.graphicOpacity||b.fillOpacity;d.onload=OpenLayers.Function.bind(function(){if(this.features[c]){var b=this.getLocalXY(a),k=b[0],b=b[1];if(!isNaN(k)&&!isNaN(b)){var k=k+g|0,b=b+h|0,l=this.canvas;l.globalAlpha=i;var m=
OpenLayers.Renderer.Canvas.drawImageScaleFactor||(OpenLayers.Renderer.Canvas.drawImageScaleFactor=/android 2.1/.test(navigator.userAgent.toLowerCase())?320/window.screen.width:1);l.drawImage(d,k*m,b*m,e*m,f*m);if(this.hitDetection){this.setHitContextStyle("fill",c);this.hitContext.fillRect(k,b,e,f)}}}},this);d.src=b.externalGraphic},drawNamedSymbol:function(a,b,c){var d,e,f,g;f=Math.PI/180;var h=OpenLayers.Renderer.symbol[b.graphicName];if(!h)throw Error(b.graphicName+" is not a valid symbol name");
if(h.length&&!(2>h.length)&&(a=this.getLocalXY(a),e=a[0],g=a[1],!isNaN(e)&&!isNaN(g))){this.canvas.lineCap="round";this.canvas.lineJoin="round";this.hitDetection&&(this.hitContext.lineCap="round",this.hitContext.lineJoin="round");if(b.graphicName in this.cachedSymbolBounds)d=this.cachedSymbolBounds[b.graphicName];else{d=new OpenLayers.Bounds;for(a=0;a<h.length;a+=2)d.extend(new OpenLayers.LonLat(h[a],h[a+1]));this.cachedSymbolBounds[b.graphicName]=d}this.canvas.save();this.hitDetection&&this.hitContext.save();
this.canvas.translate(e,g);this.hitDetection&&this.hitContext.translate(e,g);a=f*b.rotation;isNaN(a)||(this.canvas.rotate(a),this.hitDetection&&this.hitContext.rotate(a));f=2*b.pointRadius/Math.max(d.getWidth(),d.getHeight());this.canvas.scale(f,f);this.hitDetection&&this.hitContext.scale(f,f);a=d.getCenterLonLat().lon;d=d.getCenterLonLat().lat;this.canvas.translate(-a,-d);this.hitDetection&&this.hitContext.translate(-a,-d);g=b.strokeWidth;b.strokeWidth=g/f;if(!1!==b.fill){this.setCanvasStyle("fill",
b);this.canvas.beginPath();for(a=0;a<h.length;a+=2)d=h[a],e=h[a+1],0==a&&this.canvas.moveTo(d,e),this.canvas.lineTo(d,e);this.canvas.closePath();this.canvas.fill();if(this.hitDetection){this.setHitContextStyle("fill",c,b);this.hitContext.beginPath();for(a=0;a<h.length;a+=2)d=h[a],e=h[a+1],0==a&&this.canvas.moveTo(d,e),this.hitContext.lineTo(d,e);this.hitContext.closePath();this.hitContext.fill()}}if(!1!==b.stroke){this.setCanvasStyle("stroke",b);this.canvas.beginPath();for(a=0;a<h.length;a+=2)d=h[a],
e=h[a+1],0==a&&this.canvas.moveTo(d,e),this.canvas.lineTo(d,e);this.canvas.closePath();this.canvas.stroke();if(this.hitDetection){this.setHitContextStyle("stroke",c,b,f);this.hitContext.beginPath();for(a=0;a<h.length;a+=2)d=h[a],e=h[a+1],0==a&&this.hitContext.moveTo(d,e),this.hitContext.lineTo(d,e);this.hitContext.closePath();this.hitContext.stroke()}}b.strokeWidth=g;this.canvas.restore();this.hitDetection&&this.hitContext.restore();this.setCanvasStyle("reset")}},setCanvasStyle:function(a,b){"fill"===
a?(this.canvas.globalAlpha=b.fillOpacity,this.canvas.fillStyle=b.fillColor):"stroke"===a?(this.canvas.globalAlpha=b.strokeOpacity,this.canvas.strokeStyle=b.strokeColor,this.canvas.lineWidth=b.strokeWidth):(this.canvas.globalAlpha=0,this.canvas.lineWidth=1)},featureIdToHex:function(a){a=Number(a.split("_").pop())+1;16777216<=a&&(this.hitOverflow=a-16777215,a=a%16777216+1);var a="000000"+a.toString(16),b=a.length;return a="#"+a.substring(b-6,b)},setHitContextStyle:function(a,b,c,d){b=this.featureIdToHex(b);
"fill"==a?(this.hitContext.globalAlpha=1,this.hitContext.fillStyle=b):"stroke"==a?(this.hitContext.globalAlpha=1,this.hitContext.strokeStyle=b,"undefined"===typeof d?this.hitContext.lineWidth=c.strokeWidth+2:isNaN(d)||(this.hitContext.lineWidth=c.strokeWidth+2/d)):(this.hitContext.globalAlpha=0,this.hitContext.lineWidth=1)},drawPoint:function(a,b,c){if(!1!==b.graphic)if(b.externalGraphic)this.drawExternalGraphic(a,b,c);else if(b.graphicName&&"circle"!=b.graphicName)this.drawNamedSymbol(a,b,c);else{var d=
this.getLocalXY(a),a=d[0],d=d[1];if(!isNaN(a)&&!isNaN(d)){var e=2*Math.PI,f=b.pointRadius;!1!==b.fill&&(this.setCanvasStyle("fill",b),this.canvas.beginPath(),this.canvas.arc(a,d,f,0,e,!0),this.canvas.fill(),this.hitDetection&&(this.setHitContextStyle("fill",c,b),this.hitContext.beginPath(),this.hitContext.arc(a,d,f,0,e,!0),this.hitContext.fill()));!1!==b.stroke&&(this.setCanvasStyle("stroke",b),this.canvas.beginPath(),this.canvas.arc(a,d,f,0,e,!0),this.canvas.stroke(),this.hitDetection&&(this.setHitContextStyle("stroke",
c,b),this.hitContext.beginPath(),this.hitContext.arc(a,d,f,0,e,!0),this.hitContext.stroke()),this.setCanvasStyle("reset"))}}},drawLineString:function(a,b,c){b=OpenLayers.Util.applyDefaults({fill:!1},b);this.drawLinearRing(a,b,c)},drawLinearRing:function(a,b,c){!1!==b.fill&&(this.setCanvasStyle("fill",b),this.renderPath(this.canvas,a,b,c,"fill"),this.hitDetection&&(this.setHitContextStyle("fill",c,b),this.renderPath(this.hitContext,a,b,c,"fill")));!1!==b.stroke&&(this.setCanvasStyle("stroke",b),this.renderPath(this.canvas,
a,b,c,"stroke"),this.hitDetection&&(this.setHitContextStyle("stroke",c,b),this.renderPath(this.hitContext,a,b,c,"stroke")));this.setCanvasStyle("reset")},renderPath:function(a,b,c,d,e){b=b.components;c=b.length;a.beginPath();var d=this.getLocalXY(b[0]),f=d[1];if(!isNaN(d[0])&&!isNaN(f)){a.moveTo(d[0],d[1]);for(d=1;d<c;++d)f=this.getLocalXY(b[d]),a.lineTo(f[0],f[1]);"fill"===e?a.fill():a.stroke()}},drawPolygon:function(a,b,c){var a=a.components,d=a.length;this.drawLinearRing(a[0],b,c);for(var e=1;e<
d;++e)this.canvas.globalCompositeOperation="destination-out",this.hitDetection&&(this.hitContext.globalCompositeOperation="destination-out"),this.drawLinearRing(a[e],OpenLayers.Util.applyDefaults({stroke:!1,fillOpacity:1},b),c),this.canvas.globalCompositeOperation="source-over",this.hitDetection&&(this.hitContext.globalCompositeOperation="source-over"),this.drawLinearRing(a[e],OpenLayers.Util.applyDefaults({fill:!1},b),c)},drawText:function(a,b){var c=this.getLocalXY(a);this.setCanvasStyle("reset");
this.canvas.fillStyle=b.fontColor;this.canvas.globalAlpha=b.fontOpacity||1;var d=[b.fontStyle?b.fontStyle:"normal","normal",b.fontWeight?b.fontWeight:"normal",b.fontSize?b.fontSize:"1em",b.fontFamily?b.fontFamily:"sans-serif"].join(" "),e=b.label.split("\n"),f=e.length;if(this.canvas.fillText){this.canvas.font=d;this.canvas.textAlign=OpenLayers.Renderer.Canvas.LABEL_ALIGN[b.labelAlign[0]]||"center";this.canvas.textBaseline=OpenLayers.Renderer.Canvas.LABEL_ALIGN[b.labelAlign[1]]||"middle";var g=OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[1]];
null==g&&(g=-0.5);d=this.canvas.measureText("Mg").height||this.canvas.measureText("xx").width;c[1]+=d*g*(f-1);for(g=0;g<f;g++)b.labelOutlineWidth&&(this.canvas.save(),this.canvas.strokeStyle=b.labelOutlineColor,this.canvas.lineWidth=b.labelOutlineWidth,this.canvas.strokeText(e[g],c[0],c[1]+d*g+1),this.canvas.restore()),this.canvas.fillText(e[g],c[0],c[1]+d*g)}else if(this.canvas.mozDrawText){this.canvas.mozTextStyle=d;var h=OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[0]];null==h&&(h=-0.5);
g=OpenLayers.Renderer.Canvas.LABEL_FACTOR[b.labelAlign[1]];null==g&&(g=-0.5);d=this.canvas.mozMeasureText("xx");c[1]+=d*(1+g*f);for(g=0;g<f;g++){var i=c[0]+h*this.canvas.mozMeasureText(e[g]),j=c[1]+g*d;this.canvas.translate(i,j);this.canvas.mozDrawText(e[g]);this.canvas.translate(-i,-j)}}this.setCanvasStyle("reset")},getLocalXY:function(a){var b=this.getResolution(),c=this.extent;return[(a.x-this.featureDx)/b+-c.left/b,c.top/b-a.y/b]},clear:function(){var a=this.root.height,b=this.root.width;this.canvas.clearRect(0,
0,b,a);this.features={};this.hitDetection&&this.hitContext.clearRect(0,0,b,a)},getFeatureIdFromEvent:function(a){var b;if(this.hitDetection&&"none"!==this.root.style.display&&!this.map.dragging&&(a=a.xy,a=this.hitContext.getImageData(a.x|0,a.y|0,1,1).data,255===a[3]&&(a=a[2]+256*(a[1]+256*a[0])))){a="OpenLayers.Feature.Vector_"+(a-1+this.hitOverflow);try{b=this.features[a][0]}catch(c){}}return b},eraseFeatures:function(a){OpenLayers.Util.isArray(a)||(a=[a]);for(var b=0;b<a.length;++b)delete this.features[a[b].id];
this.redraw()},redraw:function(){if(!this.locked){var a=this.root.height,b=this.root.width;this.canvas.clearRect(0,0,b,a);this.hitDetection&&this.hitContext.clearRect(0,0,b,a);var a=[],c,d,e=this.map.baseLayer&&this.map.baseLayer.wrapDateLine&&this.map.getMaxExtent(),f;for(f in this.features)this.features.hasOwnProperty(f)&&(b=this.features[f][0],c=b.geometry,this.calculateFeatureDx(c.getBounds(),e),d=this.features[f][1],this.drawGeometry(c,d,b.id),d.label&&a.push([b,d]));b=0;for(c=a.length;b<c;++b)f=
a[b],this.drawText(f[0].geometry.getCentroid(),f[1])}},CLASS_NAME:"OpenLayers.Renderer.Canvas"});OpenLayers.Renderer.Canvas.LABEL_ALIGN={l:"left",r:"right",t:"top",b:"bottom"};OpenLayers.Renderer.Canvas.LABEL_FACTOR={l:0,r:-1,t:0,b:-1};OpenLayers.Renderer.Canvas.drawImageScaleFactor=null;OpenLayers.Format.OSM=OpenLayers.Class(OpenLayers.Format.XML,{checkTags:!1,interestingTagsExclude:null,areaTags:null,initialize:function(a){for(var b={interestingTagsExclude:"source source_ref source:ref history attribution created_by".split(" "),areaTags:"area building leisure tourism ruins historic landuse military natural sport".split(" ")},b=OpenLayers.Util.extend(b,a),c={},a=0;a<b.interestingTagsExclude.length;a++)c[b.interestingTagsExclude[a]]=!0;b.interestingTagsExclude=c;c={};for(a=0;a<b.areaTags.length;a++)c[b.areaTags[a]]=
!0;b.areaTags=c;this.externalProjection=new OpenLayers.Projection("EPSG:4326");OpenLayers.Format.XML.prototype.initialize.apply(this,[b])},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));for(var b=this.getNodes(a),c=this.getWays(a),a=Array(c.length),d=0;d<c.length;d++){for(var e=Array(c[d].nodes.length),f=this.isWayArea(c[d])?1:0,g=0;g<c[d].nodes.length;g++){var h=b[c[d].nodes[g]],i=new OpenLayers.Geometry.Point(h.lon,h.lat);i.osm_id=parseInt(c[d].nodes[g]);
e[g]=i;h.used=!0}h=null;h=f?new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(e)):new OpenLayers.Geometry.LineString(e);this.internalProjection&&this.externalProjection&&h.transform(this.externalProjection,this.internalProjection);e=new OpenLayers.Feature.Vector(h,c[d].tags);e.osm_id=parseInt(c[d].id);e.fid="way."+e.osm_id;a[d]=e}for(var j in b){h=b[j];if(!h.used||this.checkTags){c=null;if(this.checkTags){c=this.getTags(h.node,!0);if(h.used&&!c[1])continue;c=c[0]}else c=this.getTags(h.node);
e=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(h.lon,h.lat),c);this.internalProjection&&this.externalProjection&&e.geometry.transform(this.externalProjection,this.internalProjection);e.osm_id=parseInt(j);e.fid="node."+e.osm_id;a.push(e)}h.node=null}return a},getNodes:function(a){for(var a=a.getElementsByTagName("node"),b={},c=0;c<a.length;c++){var d=a[c],e=d.getAttribute("id");b[e]={lat:d.getAttribute("lat"),lon:d.getAttribute("lon"),node:d}}return b},getWays:function(a){for(var a=
a.getElementsByTagName("way"),b=[],c=0;c<a.length;c++){var d=a[c],e={id:d.getAttribute("id")};e.tags=this.getTags(d);d=d.getElementsByTagName("nd");e.nodes=Array(d.length);for(var f=0;f<d.length;f++)e.nodes[f]=d[f].getAttribute("ref");b.push(e)}return b},getTags:function(a,b){for(var c=a.getElementsByTagName("tag"),d={},e=!1,f=0;f<c.length;f++){var g=c[f].getAttribute("k");d[g]=c[f].getAttribute("v");b&&(this.interestingTagsExclude[g]||(e=!0))}return b?[d,e]:d},isWayArea:function(a){var b=!1,c=!1;
a.nodes[0]==a.nodes[a.nodes.length-1]&&(b=!0);if(this.checkTags)for(var d in a.tags)if(this.areaTags[d]){c=!0;break}return b&&(this.checkTags?c:!0)},write:function(a){OpenLayers.Util.isArray(a)||(a=[a]);this.osm_id=1;this.created_nodes={};var b=this.createElementNS(null,"osm");b.setAttribute("version","0.5");b.setAttribute("generator","OpenLayers "+OpenLayers.VERSION_NUMBER);for(var c=a.length-1;0<=c;c--)for(var d=this.createFeatureNodes(a[c]),e=0;e<d.length;e++)b.appendChild(d[e]);return OpenLayers.Format.XML.prototype.write.apply(this,
[b])},createFeatureNodes:function(a){var b=[],c=a.geometry.CLASS_NAME,c=c.substring(c.lastIndexOf(".")+1),c=c.toLowerCase();(c=this.createXML[c])&&(b=c.apply(this,[a]));return b},createXML:{point:function(a){var b=null,c=a.geometry?a.geometry:a;this.internalProjection&&this.externalProjection&&(c=c.clone(),c.transform(this.internalProjection,this.externalProjection));var d=!1;a.osm_id?(b=a.osm_id,this.created_nodes[b]&&(d=!0)):(b=-this.osm_id,this.osm_id++);var e=d?this.created_nodes[b]:this.createElementNS(null,
"node");this.created_nodes[b]=e;e.setAttribute("id",b);e.setAttribute("lon",c.x);e.setAttribute("lat",c.y);a.attributes&&this.serializeTags(a,e);this.setState(a,e);return d?[]:[e]},linestring:function(a){var b,c=[],d=a.geometry;a.osm_id?b=a.osm_id:(b=-this.osm_id,this.osm_id++);var e=this.createElementNS(null,"way");e.setAttribute("id",b);for(b=0;b<d.components.length;b++){var f=this.createXML.point.apply(this,[d.components[b]]);if(f.length){var f=f[0],g=f.getAttribute("id");c.push(f)}else g=d.components[b].osm_id,
f=this.created_nodes[g];this.setState(a,f);f=this.createElementNS(null,"nd");f.setAttribute("ref",g);e.appendChild(f)}this.serializeTags(a,e);c.push(e);return c},polygon:function(a){var b=OpenLayers.Util.extend({area:"yes"},a.attributes),b=new OpenLayers.Feature.Vector(a.geometry.components[0],b);b.osm_id=a.osm_id;return this.createXML.linestring.apply(this,[b])}},serializeTags:function(a,b){for(var c in a.attributes){var d=this.createElementNS(null,"tag");d.setAttribute("k",c);d.setAttribute("v",
a.attributes[c]);b.appendChild(d)}},setState:function(a,b){if(a.state){var c=null;switch(a.state){case OpenLayers.State.UPDATE:case OpenLayers.State.DELETE:c="delete"}c&&b.setAttribute("action",c)}},CLASS_NAME:"OpenLayers.Format.OSM"});OpenLayers.Handler=OpenLayers.Class({id:null,control:null,map:null,keyMask:null,active:!1,evt:null,initialize:function(a,b,c){OpenLayers.Util.extend(this,c);this.control=a;this.callbacks=b;(a=this.map||a.map)&&this.setMap(a);this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_")},setMap:function(a){this.map=a},checkModifiers:function(a){return null==this.keyMask?!0:((a.shiftKey?OpenLayers.Handler.MOD_SHIFT:0)|(a.ctrlKey?OpenLayers.Handler.MOD_CTRL:0)|(a.altKey?OpenLayers.Handler.MOD_ALT:0))==
this.keyMask},activate:function(){if(this.active)return!1;for(var a=OpenLayers.Events.prototype.BROWSER_EVENTS,b=0,c=a.length;b<c;b++)this[a[b]]&&this.register(a[b],this[a[b]]);return this.active=!0},deactivate:function(){if(!this.active)return!1;for(var a=OpenLayers.Events.prototype.BROWSER_EVENTS,b=0,c=a.length;b<c;b++)this[a[b]]&&this.unregister(a[b],this[a[b]]);this.active=!1;return!0},callback:function(a,b){a&&this.callbacks[a]&&this.callbacks[a].apply(this.control,b)},register:function(a,b){this.map.events.registerPriority(a,
this,b);this.map.events.registerPriority(a,this,this.setEvent)},unregister:function(a,b){this.map.events.unregister(a,this,b);this.map.events.unregister(a,this,this.setEvent)},setEvent:function(a){this.evt=a;return!0},destroy:function(){this.deactivate();this.control=this.map=null},CLASS_NAME:"OpenLayers.Handler"});OpenLayers.Handler.MOD_NONE=0;OpenLayers.Handler.MOD_SHIFT=1;OpenLayers.Handler.MOD_CTRL=2;OpenLayers.Handler.MOD_ALT=4;OpenLayers.Handler.Drag=OpenLayers.Class(OpenLayers.Handler,{started:!1,stopDown:!0,dragging:!1,touch:!1,last:null,start:null,lastMoveEvt:null,oldOnselectstart:null,interval:0,timeoutId:null,documentDrag:!1,documentEvents:null,initialize:function(a,b,c){OpenLayers.Handler.prototype.initialize.apply(this,arguments);if(!0===this.documentDrag){var d=this;this._docMove=function(a){d.mousemove({xy:{x:a.clientX,y:a.clientY},element:document})};this._docUp=function(a){d.mouseup({xy:{x:a.clientX,y:a.clientY}})}}},
dragstart:function(a){var b=!0;this.dragging=!1;this.checkModifiers(a)&&(OpenLayers.Event.isLeftClick(a)||OpenLayers.Event.isSingleTouch(a))?(this.started=!0,this.last=this.start=a.xy,OpenLayers.Element.addClass(this.map.viewPortDiv,"olDragDown"),this.down(a),this.callback("down",[a.xy]),OpenLayers.Event.stop(a),this.oldOnselectstart||(this.oldOnselectstart=document.onselectstart?document.onselectstart:OpenLayers.Function.True),document.onselectstart=OpenLayers.Function.False,b=!this.stopDown):(this.started=
!1,this.last=this.start=null);return b},dragmove:function(a){this.lastMoveEvt=a;if(this.started&&!this.timeoutId&&(a.xy.x!=this.last.x||a.xy.y!=this.last.y))!0===this.documentDrag&&this.documentEvents&&(a.element===document?(this.adjustXY(a),this.setEvent(a)):this.removeDocumentEvents()),0<this.interval&&(this.timeoutId=setTimeout(OpenLayers.Function.bind(this.removeTimeout,this),this.interval)),this.dragging=!0,this.move(a),this.callback("move",[a.xy]),this.oldOnselectstart||(this.oldOnselectstart=
document.onselectstart,document.onselectstart=OpenLayers.Function.False),this.last=a.xy;return!0},dragend:function(a){if(this.started){!0===this.documentDrag&&this.documentEvents&&(this.adjustXY(a),this.removeDocumentEvents());var b=this.start!=this.last;this.dragging=this.started=!1;OpenLayers.Element.removeClass(this.map.viewPortDiv,"olDragDown");this.up(a);this.callback("up",[a.xy]);b&&this.callback("done",[a.xy]);document.onselectstart=this.oldOnselectstart}return!0},down:function(){},move:function(){},
up:function(){},out:function(){},mousedown:function(a){return this.dragstart(a)},touchstart:function(a){this.touch||(this.touch=!0,this.map.events.un({mousedown:this.mousedown,mouseup:this.mouseup,mousemove:this.mousemove,click:this.click,scope:this}));return this.dragstart(a)},mousemove:function(a){return this.dragmove(a)},touchmove:function(a){return this.dragmove(a)},removeTimeout:function(){this.timeoutId=null;this.dragging&&this.mousemove(this.lastMoveEvt)},mouseup:function(a){return this.dragend(a)},
touchend:function(a){a.xy=this.last;return this.dragend(a)},mouseout:function(a){if(this.started&&OpenLayers.Util.mouseLeft(a,this.map.viewPortDiv))if(!0===this.documentDrag)this.addDocumentEvents();else{var b=this.start!=this.last;this.dragging=this.started=!1;OpenLayers.Element.removeClass(this.map.viewPortDiv,"olDragDown");this.out(a);this.callback("out",[]);b&&this.callback("done",[a.xy]);document.onselectstart&&(document.onselectstart=this.oldOnselectstart)}return!0},click:function(){return this.start==
this.last},activate:function(){var a=!1;OpenLayers.Handler.prototype.activate.apply(this,arguments)&&(this.dragging=!1,a=!0);return a},deactivate:function(){var a=!1;OpenLayers.Handler.prototype.deactivate.apply(this,arguments)&&(this.dragging=this.started=this.touch=!1,this.last=this.start=null,a=!0,OpenLayers.Element.removeClass(this.map.viewPortDiv,"olDragDown"));return a},adjustXY:function(a){var b=OpenLayers.Util.pagePosition(this.map.viewPortDiv);a.xy.x-=b[0];a.xy.y-=b[1]},addDocumentEvents:function(){OpenLayers.Element.addClass(document.body,
"olDragDown");this.documentEvents=!0;OpenLayers.Event.observe(document,"mousemove",this._docMove);OpenLayers.Event.observe(document,"mouseup",this._docUp)},removeDocumentEvents:function(){OpenLayers.Element.removeClass(document.body,"olDragDown");this.documentEvents=!1;OpenLayers.Event.stopObserving(document,"mousemove",this._docMove);OpenLayers.Event.stopObserving(document,"mouseup",this._docUp)},CLASS_NAME:"OpenLayers.Handler.Drag"});OpenLayers.Handler.Feature=OpenLayers.Class(OpenLayers.Handler,{EVENTMAP:{click:{"in":"click",out:"clickout"},mousemove:{"in":"over",out:"out"},dblclick:{"in":"dblclick",out:null},mousedown:{"in":null,out:null},mouseup:{"in":null,out:null},touchstart:{"in":"click",out:"clickout"}},feature:null,lastFeature:null,down:null,up:null,touch:!1,clickTolerance:4,geometryTypes:null,stopClick:!0,stopDown:!0,stopUp:!1,initialize:function(a,b,c,d){OpenLayers.Handler.prototype.initialize.apply(this,[a,c,d]);this.layer=
b},touchstart:function(a){this.touch||(this.touch=!0,this.map.events.un({mousedown:this.mousedown,mouseup:this.mouseup,mousemove:this.mousemove,click:this.click,dblclick:this.dblclick,scope:this}));return OpenLayers.Event.isMultiTouch(a)?!0:this.mousedown(a)},touchmove:function(a){OpenLayers.Event.stop(a)},mousedown:function(a){if(OpenLayers.Event.isLeftClick(a)||OpenLayers.Event.isSingleTouch(a))this.down=a.xy;return this.handle(a)?!this.stopDown:!0},mouseup:function(a){this.up=a.xy;return this.handle(a)?
!this.stopUp:!0},click:function(a){return this.handle(a)?!this.stopClick:!0},mousemove:function(a){if(!this.callbacks.over&&!this.callbacks.out)return!0;this.handle(a);return!0},dblclick:function(a){return!this.handle(a)},geometryTypeMatches:function(a){return null==this.geometryTypes||-1<OpenLayers.Util.indexOf(this.geometryTypes,a.geometry.CLASS_NAME)},handle:function(a){this.feature&&!this.feature.layer&&(this.feature=null);var b=a.type,c=!1,d=!!this.feature,e="click"==b||"dblclick"==b||"touchstart"==
b;if((this.feature=this.layer.getFeatureFromEvent(a))&&!this.feature.layer)this.feature=null;this.lastFeature&&!this.lastFeature.layer&&(this.lastFeature=null);this.feature?("touchstart"===b&&OpenLayers.Event.stop(a),a=this.feature!=this.lastFeature,this.geometryTypeMatches(this.feature)?(d&&a?(this.lastFeature&&this.triggerCallback(b,"out",[this.lastFeature]),this.triggerCallback(b,"in",[this.feature])):(!d||e)&&this.triggerCallback(b,"in",[this.feature]),this.lastFeature=this.feature,c=!0):(this.lastFeature&&
(d&&a||e)&&this.triggerCallback(b,"out",[this.lastFeature]),this.feature=null)):this.lastFeature&&(d||e)&&this.triggerCallback(b,"out",[this.lastFeature]);return c},triggerCallback:function(a,b,c){(b=this.EVENTMAP[a][b])&&("click"==a&&this.up&&this.down?Math.sqrt(Math.pow(this.up.x-this.down.x,2)+Math.pow(this.up.y-this.down.y,2))<=this.clickTolerance&&this.callback(b,c):this.callback(b,c))},activate:function(){var a=!1;OpenLayers.Handler.prototype.activate.apply(this,arguments)&&(this.moveLayerToTop(),
this.map.events.on({removelayer:this.handleMapEvents,changelayer:this.handleMapEvents,scope:this}),a=!0);return a},deactivate:function(){var a=!1;OpenLayers.Handler.prototype.deactivate.apply(this,arguments)&&(this.moveLayerBack(),this.up=this.down=this.lastFeature=this.feature=null,this.touch=!1,this.map.events.un({removelayer:this.handleMapEvents,changelayer:this.handleMapEvents,scope:this}),a=!0);return a},handleMapEvents:function(a){("removelayer"==a.type||"order"==a.property)&&this.moveLayerToTop()},
moveLayerToTop:function(){this.layer.setZIndex(Math.max(this.map.Z_INDEX_BASE.Feature-1,this.layer.getZIndex())+1)},moveLayerBack:function(){var a=this.layer.getZIndex()-1;a>=this.map.Z_INDEX_BASE.Feature?this.layer.setZIndex(a):this.map.setLayerZIndex(this.layer,this.map.getLayerIndex(this.layer))},CLASS_NAME:"OpenLayers.Handler.Feature"});OpenLayers.Control.DragFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,onStart:function(){},onDrag:function(){},onComplete:function(){},onEnter:function(){},onLeave:function(){},documentDrag:!1,layer:null,feature:null,dragCallbacks:{},featureCallbacks:{},lastPixel:null,initialize:function(a,b){OpenLayers.Control.prototype.initialize.apply(this,[b]);this.layer=a;this.handlers={drag:new OpenLayers.Handler.Drag(this,OpenLayers.Util.extend({down:this.downFeature,move:this.moveFeature,
up:this.upFeature,out:this.cancel,done:this.doneDragging},this.dragCallbacks),{documentDrag:this.documentDrag}),feature:new OpenLayers.Handler.Feature(this,this.layer,OpenLayers.Util.extend({click:this.clickFeature,clickout:this.clickoutFeature,over:this.overFeature,out:this.outFeature},this.featureCallbacks),{geometryTypes:this.geometryTypes})}},clickFeature:function(a){this.handlers.feature.touch&&(!this.over&&this.overFeature(a))&&(this.handlers.drag.dragstart(this.handlers.feature.evt),this.handlers.drag.stopDown=
!1)},clickoutFeature:function(a){this.handlers.feature.touch&&this.over&&(this.outFeature(a),this.handlers.drag.stopDown=!0)},destroy:function(){this.layer=null;OpenLayers.Control.prototype.destroy.apply(this,[])},activate:function(){return this.handlers.feature.activate()&&OpenLayers.Control.prototype.activate.apply(this,arguments)},deactivate:function(){this.handlers.drag.deactivate();this.handlers.feature.deactivate();this.feature=null;this.dragging=!1;this.lastPixel=null;OpenLayers.Element.removeClass(this.map.viewPortDiv,
this.displayClass+"Over");return OpenLayers.Control.prototype.deactivate.apply(this,arguments)},overFeature:function(a){var b=!1;this.handlers.drag.dragging?this.over=this.feature.id==a.id?!0:!1:(this.feature=a,this.handlers.drag.activate(),this.over=b=!0,OpenLayers.Element.addClass(this.map.viewPortDiv,this.displayClass+"Over"),this.onEnter(a));return b},downFeature:function(a){this.lastPixel=a;this.onStart(this.feature,a)},moveFeature:function(a){var b=this.map.getResolution();this.feature.geometry.move(b*
(a.x-this.lastPixel.x),b*(this.lastPixel.y-a.y));this.layer.drawFeature(this.feature);this.lastPixel=a;this.onDrag(this.feature,a)},upFeature:function(){this.over||this.handlers.drag.deactivate()},doneDragging:function(a){this.onComplete(this.feature,a)},outFeature:function(a){this.handlers.drag.dragging?this.feature.id==a.id&&(this.over=!1):(this.over=!1,this.handlers.drag.deactivate(),OpenLayers.Element.removeClass(this.map.viewPortDiv,this.displayClass+"Over"),this.onLeave(a),this.feature=null)},
cancel:function(){this.handlers.drag.deactivate();this.over=!1},setMap:function(a){this.handlers.drag.setMap(a);this.handlers.feature.setMap(a);OpenLayers.Control.prototype.setMap.apply(this,arguments)},CLASS_NAME:"OpenLayers.Control.DragFeature"});OpenLayers.StyleMap=OpenLayers.Class({styles:null,extendDefault:!0,initialize:function(a,b){this.styles={"default":new OpenLayers.Style(OpenLayers.Feature.Vector.style["default"]),select:new OpenLayers.Style(OpenLayers.Feature.Vector.style.select),temporary:new OpenLayers.Style(OpenLayers.Feature.Vector.style.temporary),"delete":new OpenLayers.Style(OpenLayers.Feature.Vector.style["delete"])};if(a instanceof OpenLayers.Style)this.styles["default"]=a,this.styles.select=a,this.styles.temporary=a,this.styles["delete"]=
a;else if("object"==typeof a)for(var c in a)if(a[c]instanceof OpenLayers.Style)this.styles[c]=a[c];else if("object"==typeof a[c])this.styles[c]=new OpenLayers.Style(a[c]);else{this.styles["default"]=new OpenLayers.Style(a);this.styles.select=new OpenLayers.Style(a);this.styles.temporary=new OpenLayers.Style(a);this.styles["delete"]=new OpenLayers.Style(a);break}OpenLayers.Util.extend(this,b)},destroy:function(){for(var a in this.styles)this.styles[a].destroy();this.styles=null},createSymbolizer:function(a,
b){a||(a=new OpenLayers.Feature.Vector);this.styles[b]||(b="default");a.renderIntent=b;var c={};this.extendDefault&&"default"!=b&&(c=this.styles["default"].createSymbolizer(a));return OpenLayers.Util.extend(c,this.styles[b].createSymbolizer(a))},addUniqueValueRules:function(a,b,c,d){var e=[],f;for(f in c)e.push(new OpenLayers.Rule({symbolizer:c[f],context:d,filter:new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO,property:b,value:f})}));this.styles[a].addRules(e)},CLASS_NAME:"OpenLayers.StyleMap"});OpenLayers.Layer.Vector=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:!1,isFixed:!1,features:null,filter:null,selectedFeatures:null,unrenderedFeatures:null,reportError:!0,style:null,styleMap:null,strategies:null,protocol:null,renderers:["SVG","VML","Canvas"],renderer:null,rendererOptions:null,geometryType:null,drawn:!1,ratio:1,initialize:function(a,b){OpenLayers.Layer.prototype.initialize.apply(this,arguments);(!this.renderer||!this.renderer.supported())&&this.assignRenderer();if(!this.renderer||
!this.renderer.supported())this.renderer=null,this.displayError();this.styleMap||(this.styleMap=new OpenLayers.StyleMap);this.features=[];this.selectedFeatures=[];this.unrenderedFeatures={};if(this.strategies)for(var c=0,d=this.strategies.length;c<d;c++)this.strategies[c].setLayer(this)},destroy:function(){if(this.strategies){var a,b,c;b=0;for(c=this.strategies.length;b<c;b++)a=this.strategies[b],a.autoDestroy&&a.destroy();this.strategies=null}this.protocol&&(this.protocol.autoDestroy&&this.protocol.destroy(),
this.protocol=null);this.destroyFeatures();this.unrenderedFeatures=this.selectedFeatures=this.features=null;this.renderer&&this.renderer.destroy();this.drawn=this.geometryType=this.renderer=null;OpenLayers.Layer.prototype.destroy.apply(this,arguments)},clone:function(a){null==a&&(a=new OpenLayers.Layer.Vector(this.name,this.getOptions()));for(var a=OpenLayers.Layer.prototype.clone.apply(this,[a]),b=this.features,c=b.length,d=Array(c),e=0;e<c;++e)d[e]=b[e].clone();a.features=d;return a},refresh:function(a){this.calculateInRange()&&
this.visibility&&this.events.triggerEvent("refresh",a)},assignRenderer:function(){for(var a=0,b=this.renderers.length;a<b;a++){var c=this.renderers[a];if((c="function"==typeof c?c:OpenLayers.Renderer[c])&&c.prototype.supported()){this.renderer=new c(this.div,this.rendererOptions);break}}},displayError:function(){this.reportError&&OpenLayers.Console.userError(OpenLayers.i18n("browserNotSupported",{renderers:this.renderers.join("\n")}))},setMap:function(a){OpenLayers.Layer.prototype.setMap.apply(this,
arguments);if(this.renderer){this.renderer.map=this.map;var b=this.map.getSize();b.w*=this.ratio;b.h*=this.ratio;this.renderer.setSize(b)}else this.map.removeLayer(this)},afterAdd:function(){if(this.strategies){var a,b,c;b=0;for(c=this.strategies.length;b<c;b++)a=this.strategies[b],a.autoActivate&&a.activate()}},removeMap:function(){this.drawn=!1;if(this.strategies){var a,b,c;b=0;for(c=this.strategies.length;b<c;b++)a=this.strategies[b],a.autoActivate&&a.deactivate()}},onMapResize:function(){OpenLayers.Layer.prototype.onMapResize.apply(this,
arguments);var a=this.map.getSize();a.w*=this.ratio;a.h*=this.ratio;this.renderer.setSize(a)},moveTo:function(a,b,c){OpenLayers.Layer.prototype.moveTo.apply(this,arguments);var d=!0;
    if(!c){
        var style_left = this.map.layerContainerDiv.style.left;
        if (style_left.length==0) {
            if (typeof console!="undefined") {
                console.warn("map.layerContainerDiv.style.left is empty and set to 0");
            }
            style_left=0;
        }
        var style_top = this.map.layerContainerDiv.style.top;
        if (style_top.length==0) {
            if (typeof console!="undefined") {
                console.warn("map.layerContainerDiv.style.top is empty and set to 0");
            }
            style_top=0;
        }
        this.renderer.root.style.visibility="hidden";var d=this.map.getSize(),e=d.w,d=d.h,e=e/2*this.ratio-e/2,d=d/2*this.ratio-d/2,
e=e+parseInt(style_left,10),
e=-Math.round(e),
d=d+parseInt(style_top,10),
d=-Math.round(d);
this.div.style.left=e+"px";
this.div.style.top=d+"px";
d=this.renderer.setExtent(this.map.getExtent().scale(this.ratio),b);this.renderer.root.style.visibility="visible";!0===OpenLayers.IS_GECKO&&(this.div.scrollLeft=this.div.scrollLeft);if(!b&&d)for(var f in this.unrenderedFeatures)e=this.unrenderedFeatures[f],this.drawFeature(e)
    }
if(!this.drawn||b||!d){this.drawn=!0;f=0;for(d=this.features.length;f<d;f++)this.renderer.locked=f!==d-1,e=this.features[f],this.drawFeature(e)}},display:function(a){OpenLayers.Layer.prototype.display.apply(this,arguments);
var b=this.div.style.display;b!=this.renderer.root.style.display&&(this.renderer.root.style.display=b)},addFeatures:function(a,b){OpenLayers.Util.isArray(a)||(a=[a]);var c=!b||!b.silent;if(c){var d={features:a};if(!1===this.events.triggerEvent("beforefeaturesadded",d))return;a=d.features}for(var d=[],e=0,f=a.length;e<f;e++){this.renderer.locked=e!=a.length-1?!0:!1;var g=a[e];if(this.geometryType&&!(g.geometry instanceof this.geometryType))throw new TypeError("addFeatures: component should be an "+
this.geometryType.prototype.CLASS_NAME);g.layer=this;!g.style&&this.style&&(g.style=OpenLayers.Util.extend({},this.style));if(c){if(!1===this.events.triggerEvent("beforefeatureadded",{feature:g}))continue;this.preFeatureInsert(g)}d.push(g);this.features.push(g);this.drawFeature(g);c&&(this.events.triggerEvent("featureadded",{feature:g}),this.onFeatureInsert(g))}c&&this.events.triggerEvent("featuresadded",{features:d})},removeFeatures:function(a,b){if(a&&0!==a.length){if(a===this.features)return this.removeAllFeatures(b);
OpenLayers.Util.isArray(a)||(a=[a]);a===this.selectedFeatures&&(a=a.slice());var c=!b||!b.silent;c&&this.events.triggerEvent("beforefeaturesremoved",{features:a});for(var d=a.length-1;0<=d;d--){this.renderer.locked=0!=d&&a[d-1].geometry?!0:!1;var e=a[d];delete this.unrenderedFeatures[e.id];c&&this.events.triggerEvent("beforefeatureremoved",{feature:e});this.features=OpenLayers.Util.removeItem(this.features,e);e.layer=null;e.geometry&&this.renderer.eraseFeatures(e);-1!=OpenLayers.Util.indexOf(this.selectedFeatures,
e)&&OpenLayers.Util.removeItem(this.selectedFeatures,e);c&&this.events.triggerEvent("featureremoved",{feature:e})}c&&this.events.triggerEvent("featuresremoved",{features:a})}},removeAllFeatures:function(a){var a=!a||!a.silent,b=this.features;a&&this.events.triggerEvent("beforefeaturesremoved",{features:b});for(var c,d=b.length-1;0<=d;d--)c=b[d],a&&this.events.triggerEvent("beforefeatureremoved",{feature:c}),c.layer=null,a&&this.events.triggerEvent("featureremoved",{feature:c});this.renderer.clear();
this.features=[];this.unrenderedFeatures={};this.selectedFeatures=[];a&&this.events.triggerEvent("featuresremoved",{features:b})},destroyFeatures:function(a,b){void 0==a&&(a=this.features);if(a){this.removeFeatures(a,b);for(var c=a.length-1;0<=c;c--)a[c].destroy()}},drawFeature:function(a,b){if(this.drawn){if("object"!=typeof b){!b&&a.state===OpenLayers.State.DELETE&&(b="delete");var c=b||a.renderIntent;(b=a.style||this.style)||(b=this.styleMap.createSymbolizer(a,c))}c=this.renderer.drawFeature(a,
b);!1===c||null===c?this.unrenderedFeatures[a.id]=a:delete this.unrenderedFeatures[a.id]}},eraseFeatures:function(a){this.renderer.eraseFeatures(a)},getFeatureFromEvent:function(a){if(!this.renderer)throw Error("getFeatureFromEvent called on layer with no renderer. This usually means you destroyed a layer, but not some handler which is associated with it.");var b=null;(a=this.renderer.getFeatureIdFromEvent(a))&&(b="string"===typeof a?this.getFeatureById(a):a);return b},getFeatureBy:function(a,b){for(var c=
null,d=0,e=this.features.length;d<e;++d)if(this.features[d][a]==b){c=this.features[d];break}return c},getFeatureById:function(a){return this.getFeatureBy("id",a)},getFeatureByFid:function(a){return this.getFeatureBy("fid",a)},getFeaturesByAttribute:function(a,b){var c,d,e=this.features.length,f=[];for(c=0;c<e;c++)(d=this.features[c])&&d.attributes&&d.attributes[a]===b&&f.push(d);return f},onFeatureInsert:function(){},preFeatureInsert:function(){},getDataExtent:function(){var a=null,b=this.features;
if(b&&0<b.length)for(var c=null,d=0,e=b.length;d<e;d++)if(c=b[d].geometry)null===a&&(a=new OpenLayers.Bounds),a.extend(c.getBounds());return a},CLASS_NAME:"OpenLayers.Layer.Vector"});OpenLayers.Layer.Vector.RootContainer=OpenLayers.Class(OpenLayers.Layer.Vector,{displayInLayerSwitcher:!1,layers:null,display:function(){},getFeatureFromEvent:function(a){for(var b=this.layers,c,d=0;d<b.length;d++)if(c=b[d].getFeatureFromEvent(a))return c},setMap:function(a){OpenLayers.Layer.Vector.prototype.setMap.apply(this,arguments);this.collectRoots();a.events.register("changelayer",this,this.handleChangeLayer)},removeMap:function(a){a.events.unregister("changelayer",this,this.handleChangeLayer);
this.resetRoots();OpenLayers.Layer.Vector.prototype.removeMap.apply(this,arguments)},collectRoots:function(){for(var a,b=0;b<this.map.layers.length;++b)a=this.map.layers[b],-1!=OpenLayers.Util.indexOf(this.layers,a)&&a.renderer.moveRoot(this.renderer)},resetRoots:function(){for(var a,b=0;b<this.layers.length;++b)a=this.layers[b],this.renderer&&a.renderer.getRenderLayerId()==this.id&&this.renderer.moveRoot(a.renderer)},handleChangeLayer:function(a){var b=a.layer;"order"==a.property&&-1!=OpenLayers.Util.indexOf(this.layers,
b)&&(this.resetRoots(),this.collectRoots())},CLASS_NAME:"OpenLayers.Layer.Vector.RootContainer"});OpenLayers.Control.SelectFeature=OpenLayers.Class(OpenLayers.Control,{multipleKey:null,toggleKey:null,multiple:!1,clickout:!0,toggle:!1,hover:!1,highlightOnly:!1,box:!1,onBeforeSelect:function(){},onSelect:function(){},onUnselect:function(){},scope:null,geometryTypes:null,layer:null,layers:null,callbacks:null,selectStyle:null,renderIntent:"select",handlers:null,initialize:function(a,b){OpenLayers.Control.prototype.initialize.apply(this,[b]);null===this.scope&&(this.scope=this);this.initLayer(a);var c=
{click:this.clickFeature,clickout:this.clickoutFeature};this.hover&&(c.over=this.overFeature,c.out=this.outFeature);this.callbacks=OpenLayers.Util.extend(c,this.callbacks);this.handlers={feature:new OpenLayers.Handler.Feature(this,this.layer,this.callbacks,{geometryTypes:this.geometryTypes})};this.box&&(this.handlers.box=new OpenLayers.Handler.Box(this,{done:this.selectBox},{boxDivClassName:"olHandlerBoxSelectFeature"}))},initLayer:function(a){OpenLayers.Util.isArray(a)?(this.layers=a,this.layer=
new OpenLayers.Layer.Vector.RootContainer(this.id+"_container",{layers:a})):this.layer=a},destroy:function(){this.active&&this.layers&&this.map.removeLayer(this.layer);OpenLayers.Control.prototype.destroy.apply(this,arguments);this.layers&&this.layer.destroy()},activate:function(){this.active||(this.layers&&this.map.addLayer(this.layer),this.handlers.feature.activate(),this.box&&this.handlers.box&&this.handlers.box.activate());return OpenLayers.Control.prototype.activate.apply(this,arguments)},deactivate:function(){this.active&&
(this.handlers.feature.deactivate(),this.handlers.box&&this.handlers.box.deactivate(),this.layers&&this.map.removeLayer(this.layer));return OpenLayers.Control.prototype.deactivate.apply(this,arguments)},unselectAll:function(a){for(var b=this.layers||[this.layer],c,d,e=0;e<b.length;++e){c=b[e];for(var f=c.selectedFeatures.length-1;0<=f;--f)d=c.selectedFeatures[f],(!a||a.except!=d)&&this.unselect(d)}},clickFeature:function(a){this.hover||(-1<OpenLayers.Util.indexOf(a.layer.selectedFeatures,a)?this.toggleSelect()?
this.unselect(a):this.multipleSelect()||this.unselectAll({except:a}):(this.multipleSelect()||this.unselectAll({except:a}),this.select(a)))},multipleSelect:function(){return this.multiple||this.handlers.feature.evt&&this.handlers.feature.evt[this.multipleKey]},toggleSelect:function(){return this.toggle||this.handlers.feature.evt&&this.handlers.feature.evt[this.toggleKey]},clickoutFeature:function(){!this.hover&&this.clickout&&this.unselectAll()},overFeature:function(a){var b=a.layer;this.hover&&(this.highlightOnly?
this.highlight(a):-1==OpenLayers.Util.indexOf(b.selectedFeatures,a)&&this.select(a))},outFeature:function(a){if(this.hover)if(this.highlightOnly){if(a._lastHighlighter==this.id)if(a._prevHighlighter&&a._prevHighlighter!=this.id){delete a._lastHighlighter;var b=this.map.getControl(a._prevHighlighter);b&&b.highlight(a)}else this.unhighlight(a)}else this.unselect(a)},highlight:function(a){var b=a.layer;!1!==this.events.triggerEvent("beforefeaturehighlighted",{feature:a})&&(a._prevHighlighter=a._lastHighlighter,
a._lastHighlighter=this.id,b.drawFeature(a,this.selectStyle||this.renderIntent),this.events.triggerEvent("featurehighlighted",{feature:a}))},unhighlight:function(a){var b=a.layer;void 0==a._prevHighlighter?delete a._lastHighlighter:(a._prevHighlighter!=this.id&&(a._lastHighlighter=a._prevHighlighter),delete a._prevHighlighter);b.drawFeature(a,a.style||a.layer.style||"default");this.events.triggerEvent("featureunhighlighted",{feature:a})},select:function(a){var b=this.onBeforeSelect.call(this.scope,
a),c=a.layer;!1!==b&&(b=c.events.triggerEvent("beforefeatureselected",{feature:a}),!1!==b&&(c.selectedFeatures.push(a),this.highlight(a),this.handlers.feature.lastFeature||(this.handlers.feature.lastFeature=c.selectedFeatures[0]),c.events.triggerEvent("featureselected",{feature:a}),this.onSelect.call(this.scope,a)))},unselect:function(a){var b=a.layer;this.unhighlight(a);OpenLayers.Util.removeItem(b.selectedFeatures,a);b.events.triggerEvent("featureunselected",{feature:a});this.onUnselect.call(this.scope,
a)},selectBox:function(a){if(a instanceof OpenLayers.Bounds){var b=this.map.getLonLatFromPixel({x:a.left,y:a.bottom}),a=this.map.getLonLatFromPixel({x:a.right,y:a.top}),b=new OpenLayers.Bounds(b.lon,b.lat,a.lon,a.lat);this.multipleSelect()||this.unselectAll();a=this.multiple;this.multiple=!0;var c=this.layers||[this.layer];this.events.triggerEvent("boxselectionstart",{layers:c});for(var d,e=0;e<c.length;++e){d=c[e];for(var f=0,g=d.features.length;f<g;++f){var h=d.features[f];h.getVisibility()&&(null==
this.geometryTypes||-1<OpenLayers.Util.indexOf(this.geometryTypes,h.geometry.CLASS_NAME))&&b.toGeometry().intersects(h.geometry)&&-1==OpenLayers.Util.indexOf(d.selectedFeatures,h)&&this.select(h)}}this.multiple=a;this.events.triggerEvent("boxselectionend",{layers:c})}},setMap:function(a){this.handlers.feature.setMap(a);this.box&&this.handlers.box.setMap(a);OpenLayers.Control.prototype.setMap.apply(this,arguments)},setLayer:function(a){var b=this.active;this.unselectAll();this.deactivate();this.layers&&
(this.layer.destroy(),this.layers=null);this.initLayer(a);this.handlers.feature.layer=this.layer;b&&this.activate()},CLASS_NAME:"OpenLayers.Control.SelectFeature"});OpenLayers.Handler.Keyboard=OpenLayers.Class(OpenLayers.Handler,{KEY_EVENTS:["keydown","keyup"],eventListener:null,observeElement:null,initialize:function(a,b,c){OpenLayers.Handler.prototype.initialize.apply(this,arguments);this.eventListener=OpenLayers.Function.bindAsEventListener(this.handleKeyEvent,this)},destroy:function(){this.deactivate();this.eventListener=null;OpenLayers.Handler.prototype.destroy.apply(this,arguments)},activate:function(){if(OpenLayers.Handler.prototype.activate.apply(this,
arguments)){this.observeElement=this.observeElement||document;for(var a=0,b=this.KEY_EVENTS.length;a<b;a++)OpenLayers.Event.observe(this.observeElement,this.KEY_EVENTS[a],this.eventListener);return!0}return!1},deactivate:function(){var a=!1;if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){for(var a=0,b=this.KEY_EVENTS.length;a<b;a++)OpenLayers.Event.stopObserving(this.observeElement,this.KEY_EVENTS[a],this.eventListener);a=!0}return a},handleKeyEvent:function(a){this.checkModifiers(a)&&
this.callback(a.type,[a])},CLASS_NAME:"OpenLayers.Handler.Keyboard"});OpenLayers.Control.ModifyFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,clickout:!0,toggle:!0,standalone:!1,layer:null,feature:null,vertices:null,virtualVertices:null,selectControl:null,dragControl:null,handlers:null,deleteCodes:null,virtualStyle:null,vertexRenderIntent:null,mode:null,createVertices:!0,modified:!1,radiusHandle:null,dragHandle:null,onModificationStart:function(){},onModification:function(){},onModificationEnd:function(){},initialize:function(a,b){b=b||{};this.layer=
a;this.vertices=[];this.virtualVertices=[];this.virtualStyle=OpenLayers.Util.extend({},this.layer.style||this.layer.styleMap.createSymbolizer(null,b.vertexRenderIntent));this.virtualStyle.fillOpacity=0.3;this.virtualStyle.strokeOpacity=0.3;this.deleteCodes=[46,68];this.mode=OpenLayers.Control.ModifyFeature.RESHAPE;OpenLayers.Control.prototype.initialize.apply(this,[b]);OpenLayers.Util.isArray(this.deleteCodes)||(this.deleteCodes=[this.deleteCodes]);var c=this,d={geometryTypes:this.geometryTypes,clickout:this.clickout,
toggle:this.toggle,onBeforeSelect:this.beforeSelectFeature,onSelect:this.selectFeature,onUnselect:this.unselectFeature,scope:this};!1===this.standalone&&(this.selectControl=new OpenLayers.Control.SelectFeature(a,d));this.dragControl=new OpenLayers.Control.DragFeature(a,{geometryTypes:["OpenLayers.Geometry.Point"],onStart:function(a,b){c.dragStart.apply(c,[a,b])},onDrag:function(a,b){c.dragVertex.apply(c,[a,b])},onComplete:function(a){c.dragComplete.apply(c,[a])},featureCallbacks:{over:function(a){(c.standalone!==
true||a._sketch||c.feature===a)&&c.dragControl.overFeature.apply(c.dragControl,[a])}}});this.handlers={keyboard:new OpenLayers.Handler.Keyboard(this,{keydown:this.handleKeypress})}},destroy:function(){this.layer=null;this.standalone||this.selectControl.destroy();this.dragControl.destroy();OpenLayers.Control.prototype.destroy.apply(this,[])},activate:function(){return(this.standalone||this.selectControl.activate())&&this.handlers.keyboard.activate()&&OpenLayers.Control.prototype.activate.apply(this,
arguments)},deactivate:function(){var a=!1;if(OpenLayers.Control.prototype.deactivate.apply(this,arguments)){this.layer.removeFeatures(this.vertices,{silent:!0});this.layer.removeFeatures(this.virtualVertices,{silent:!0});this.vertices=[];this.dragControl.deactivate();var b=(a=this.feature)&&a.geometry&&a.layer;!1===this.standalone?(b&&this.selectControl.unselect.apply(this.selectControl,[a]),this.selectControl.deactivate()):b&&this.unselectFeature(a);this.handlers.keyboard.deactivate();a=!0}return a},
beforeSelectFeature:function(a){return this.layer.events.triggerEvent("beforefeaturemodified",{feature:a})},selectFeature:function(a){if(!this.standalone||!1!==this.beforeSelectFeature(a))this.feature=a,this.modified=!1,this.resetVertices(),this.dragControl.activate(),this.onModificationStart(this.feature);var b=a.modified;if(a.geometry&&(!b||!b.geometry))this._originalGeometry=a.geometry.clone()},unselectFeature:function(a){this.layer.removeFeatures(this.vertices,{silent:!0});this.vertices=[];this.layer.destroyFeatures(this.virtualVertices,
{silent:!0});this.virtualVertices=[];this.dragHandle&&(this.layer.destroyFeatures([this.dragHandle],{silent:!0}),delete this.dragHandle);this.radiusHandle&&(this.layer.destroyFeatures([this.radiusHandle],{silent:!0}),delete this.radiusHandle);this.feature=null;this.dragControl.deactivate();this.onModificationEnd(a);this.layer.events.triggerEvent("afterfeaturemodified",{feature:a,modified:this.modified});this.modified=!1},dragStart:function(a,b){if(a!=this.feature&&(!a.geometry.parent&&a!=this.dragHandle&&
a!=this.radiusHandle)&&(!1===this.standalone&&this.feature&&this.selectControl.clickFeature.apply(this.selectControl,[this.feature]),null==this.geometryTypes||-1!=OpenLayers.Util.indexOf(this.geometryTypes,a.geometry.CLASS_NAME)))this.standalone||this.selectControl.clickFeature.apply(this.selectControl,[a]),this.dragControl.overFeature.apply(this.dragControl,[a]),this.dragControl.lastPixel=b,this.dragControl.handlers.drag.started=!0,this.dragControl.handlers.drag.start=b,this.dragControl.handlers.drag.last=
b},dragVertex:function(a,b){this.modified=!0;"OpenLayers.Geometry.Point"==this.feature.geometry.CLASS_NAME?(this.feature!=a&&(this.feature=a),this.layer.events.triggerEvent("vertexmodified",{vertex:a.geometry,feature:this.feature,pixel:b})):(a._index?(a.geometry.parent.addComponent(a.geometry,a._index),delete a._index,OpenLayers.Util.removeItem(this.virtualVertices,a),this.vertices.push(a)):a==this.dragHandle?(this.layer.removeFeatures(this.vertices,{silent:!0}),this.vertices=[],this.radiusHandle&&
(this.layer.destroyFeatures([this.radiusHandle],{silent:!0}),this.radiusHandle=null)):a!==this.radiusHandle&&this.layer.events.triggerEvent("vertexmodified",{vertex:a.geometry,feature:this.feature,pixel:b}),0<this.virtualVertices.length&&(this.layer.destroyFeatures(this.virtualVertices,{silent:!0}),this.virtualVertices=[]),this.layer.drawFeature(this.feature,this.standalone?void 0:this.selectControl.renderIntent));this.layer.drawFeature(a)},dragComplete:function(){this.resetVertices();this.setFeatureState();
this.onModification(this.feature);this.layer.events.triggerEvent("featuremodified",{feature:this.feature})},setFeatureState:function(){if(this.feature.state!=OpenLayers.State.INSERT&&this.feature.state!=OpenLayers.State.DELETE&&(this.feature.state=OpenLayers.State.UPDATE,this.modified&&this._originalGeometry)){var a=this.feature;a.modified=OpenLayers.Util.extend(a.modified,{geometry:this._originalGeometry});delete this._originalGeometry}},resetVertices:function(){this.dragControl.feature&&this.dragControl.outFeature(this.dragControl.feature);
0<this.vertices.length&&(this.layer.removeFeatures(this.vertices,{silent:!0}),this.vertices=[]);0<this.virtualVertices.length&&(this.layer.removeFeatures(this.virtualVertices,{silent:!0}),this.virtualVertices=[]);this.dragHandle&&(this.layer.destroyFeatures([this.dragHandle],{silent:!0}),this.dragHandle=null);this.radiusHandle&&(this.layer.destroyFeatures([this.radiusHandle],{silent:!0}),this.radiusHandle=null);this.feature&&"OpenLayers.Geometry.Point"!=this.feature.geometry.CLASS_NAME&&(this.mode&
OpenLayers.Control.ModifyFeature.DRAG&&this.collectDragHandle(),this.mode&(OpenLayers.Control.ModifyFeature.ROTATE|OpenLayers.Control.ModifyFeature.RESIZE)&&this.collectRadiusHandle(),this.mode&OpenLayers.Control.ModifyFeature.RESHAPE&&(this.mode&OpenLayers.Control.ModifyFeature.RESIZE||this.collectVertices()))},handleKeypress:function(a){var b=a.keyCode;if(this.feature&&-1!=OpenLayers.Util.indexOf(this.deleteCodes,b)&&(b=this.dragControl.feature)&&-1!=OpenLayers.Util.indexOf(this.vertices,b)&&!this.dragControl.handlers.drag.dragging&&
b.geometry.parent)b.geometry.parent.removeComponent(b.geometry),this.layer.events.triggerEvent("vertexremoved",{vertex:b.geometry,feature:this.feature,pixel:a.xy}),this.layer.drawFeature(this.feature,this.standalone?void 0:this.selectControl.renderIntent),this.modified=!0,this.resetVertices(),this.setFeatureState(),this.onModification(this.feature),this.layer.events.triggerEvent("featuremodified",{feature:this.feature})},collectVertices:function(){function a(c){var d,e,f;if("OpenLayers.Geometry.Point"==
c.CLASS_NAME)e=new OpenLayers.Feature.Vector(c),e._sketch=!0,e.renderIntent=b.vertexRenderIntent,b.vertices.push(e);else{f=c.components.length;"OpenLayers.Geometry.LinearRing"==c.CLASS_NAME&&(f-=1);for(d=0;d<f;++d)e=c.components[d],"OpenLayers.Geometry.Point"==e.CLASS_NAME?(e=new OpenLayers.Feature.Vector(e),e._sketch=!0,e.renderIntent=b.vertexRenderIntent,b.vertices.push(e)):a(e);if(b.createVertices&&"OpenLayers.Geometry.MultiPoint"!=c.CLASS_NAME){d=0;for(f=c.components.length;d<f-1;++d){e=c.components[d];
var g=c.components[d+1];"OpenLayers.Geometry.Point"==e.CLASS_NAME&&"OpenLayers.Geometry.Point"==g.CLASS_NAME&&(e=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point((e.x+g.x)/2,(e.y+g.y)/2),null,b.virtualStyle),e.geometry.parent=c,e._index=d+1,e._sketch=!0,b.virtualVertices.push(e))}}}}this.vertices=[];this.virtualVertices=[];var b=this;a.call(this,this.feature.geometry);this.layer.addFeatures(this.virtualVertices,{silent:!0});this.layer.addFeatures(this.vertices,{silent:!0})},collectDragHandle:function(){var a=
this.feature.geometry,b=a.getBounds().getCenterLonLat(),b=new OpenLayers.Geometry.Point(b.lon,b.lat),c=new OpenLayers.Feature.Vector(b);b.move=function(b,c){OpenLayers.Geometry.Point.prototype.move.call(this,b,c);a.move(b,c)};c._sketch=!0;this.dragHandle=c;this.dragHandle.renderIntent=this.vertexRenderIntent;this.layer.addFeatures([this.dragHandle],{silent:!0})},collectRadiusHandle:function(){var a=this.feature.geometry,b=a.getBounds(),c=b.getCenterLonLat(),d=new OpenLayers.Geometry.Point(c.lon,c.lat),
b=new OpenLayers.Geometry.Point(b.right,b.bottom),c=new OpenLayers.Feature.Vector(b),e=this.mode&OpenLayers.Control.ModifyFeature.RESIZE,f=this.mode&OpenLayers.Control.ModifyFeature.RESHAPE,g=this.mode&OpenLayers.Control.ModifyFeature.ROTATE;b.move=function(b,c){OpenLayers.Geometry.Point.prototype.move.call(this,b,c);var j=this.x-d.x,k=this.y-d.y,l=j-b,m=k-c;if(g){var n=Math.atan2(m,l),n=Math.atan2(k,j)-n,n=n*(180/Math.PI);a.rotate(n,d)}if(e){var o;f?(k/=m,o=j/l/k):(l=Math.sqrt(l*l+m*m),k=Math.sqrt(j*
j+k*k)/l);a.resize(k,d,o)}};c._sketch=!0;this.radiusHandle=c;this.radiusHandle.renderIntent=this.vertexRenderIntent;this.layer.addFeatures([this.radiusHandle],{silent:!0})},setMap:function(a){this.standalone||this.selectControl.setMap(a);this.dragControl.setMap(a);OpenLayers.Control.prototype.setMap.apply(this,arguments)},CLASS_NAME:"OpenLayers.Control.ModifyFeature"});OpenLayers.Control.ModifyFeature.RESHAPE=1;OpenLayers.Control.ModifyFeature.RESIZE=2;OpenLayers.Control.ModifyFeature.ROTATE=4;
OpenLayers.Control.ModifyFeature.DRAG=8;OpenLayers.Layer.Bing=OpenLayers.Class(OpenLayers.Layer.XYZ,{key:null,serverResolutions:[156543.03390625,78271.516953125,39135.7584765625,19567.87923828125,9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453,152.87405654907226,76.43702827453613,38.218514137268066,19.109257068634033,9.554628534317017,4.777314267158508,2.388657133579254,1.194328566789627,0.5971642833948135,0.29858214169740677,0.14929107084870338,0.07464553542435169],attributionTemplate:'<span class="olBingAttribution ${type}"><div><a target="_blank" href="http://www.bing.com/maps/"><img src="${logo}" /></a></div>${copyrights}<a style="white-space: nowrap" target="_blank" href="http://www.microsoft.com/maps/product/terms.html">Terms of Use</a></span>',
metadata:null,type:"Road",culture:"en-US",metadataParams:null,tileOptions:null,initialize:function(a){a=OpenLayers.Util.applyDefaults({sphericalMercator:!0},a);OpenLayers.Layer.XYZ.prototype.initialize.apply(this,[a.name||"Bing "+(a.type||this.type),null,a]);this.tileOptions=OpenLayers.Util.extend({crossOriginKeyword:"anonymous"},this.options.tileOptions);this.loadMetadata()},loadMetadata:function(){this._callbackId="_callback_"+this.id.replace(/\./g,"_");window[this._callbackId]=OpenLayers.Function.bind(OpenLayers.Layer.Bing.processMetadata,
this);var a=OpenLayers.Util.applyDefaults({key:this.key,jsonp:this._callbackId,include:"ImageryProviders"},this.metadataParams),a="http://dev.virtualearth.net/REST/v1/Imagery/Metadata/"+this.type+"?"+OpenLayers.Util.getParameterString(a),b=document.createElement("script");b.type="text/javascript";b.src=a;b.id=this._callbackId;document.getElementsByTagName("head")[0].appendChild(b)},initLayer:function(){var a=this.metadata.resourceSets[0].resources[0],b=a.imageUrl.replace("{quadkey}","${quadkey}"),
b=b.replace("{culture}",this.culture);this.url=[];for(var c=0;c<a.imageUrlSubdomains.length;++c)this.url.push(b.replace("{subdomain}",a.imageUrlSubdomains[c]));this.addOptions({maxResolution:Math.min(this.serverResolutions[a.zoomMin],this.maxResolution||Number.POSITIVE_INFINITY),numZoomLevels:Math.min(a.zoomMax+1-a.zoomMin,this.numZoomLevels)},!0)},getURL:function(a){if(this.url){for(var b=this.getXYZ(a),a=b.x,c=b.y,b=b.z,d=[],e=b;0<e;--e){var f="0",g=1<<e-1;0!=(a&g)&&f++;0!=(c&g)&&(f++,f++);d.push(f)}d=
d.join("");a=this.selectUrl(""+a+c+b,this.url);return OpenLayers.String.format(a,{quadkey:d})}},updateAttribution:function(){var a=this.metadata;if(a.resourceSets&&this.map&&this.map.center){var b=a.resourceSets[0].resources[0],c=this.map.getExtent().transform(this.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326")),b=b.imageryProviders,d=OpenLayers.Util.indexOf(this.serverResolutions,this.getServerResolution()),e="",f,g,h,i,j,k,l;g=0;for(h=b.length;g<h;++g){f=b[g];i=0;for(j=f.coverageAreas.length;i<
j;++i)l=f.coverageAreas[i],k=OpenLayers.Bounds.fromArray(l.bbox,!0),c.intersectsBounds(k)&&(d<=l.zoomMax&&d>=l.zoomMin)&&(e+=f.attribution+" ")}this.attribution=OpenLayers.String.format(this.attributionTemplate,{type:this.type.toLowerCase(),logo:a.brandLogoUri,copyrights:e});this.map&&this.map.events.triggerEvent("changelayer",{layer:this,property:"attribution"})}},setMap:function(){OpenLayers.Layer.XYZ.prototype.setMap.apply(this,arguments);this.updateAttribution();this.map.events.register("moveend",
this,this.updateAttribution)},clone:function(a){null==a&&(a=new OpenLayers.Layer.Bing(this.options));return a=OpenLayers.Layer.XYZ.prototype.clone.apply(this,[a])},destroy:function(){this.map&&this.map.events.unregister("moveend",this,this.updateAttribution);OpenLayers.Layer.XYZ.prototype.destroy.apply(this,arguments)},CLASS_NAME:"OpenLayers.Layer.Bing"});
OpenLayers.Layer.Bing.processMetadata=function(a){this.metadata=a;this.initLayer();a=document.getElementById(this._callbackId);a.parentNode.removeChild(a);window[this._callbackId]=void 0;delete this._callbackId};OpenLayers.Layer.PointGrid=OpenLayers.Class(OpenLayers.Layer.Vector,{dx:null,dy:null,ratio:1.5,maxFeatures:250,rotation:0,origin:null,gridBounds:null,initialize:function(a){a=a||{};OpenLayers.Layer.Vector.prototype.initialize.apply(this,[a.name,a])},setMap:function(a){OpenLayers.Layer.Vector.prototype.setMap.apply(this,arguments);a.events.register("moveend",this,this.onMoveEnd)},removeMap:function(a){a.events.unregister("moveend",this,this.onMoveEnd);OpenLayers.Layer.Vector.prototype.removeMap.apply(this,
arguments)},setRatio:function(a){this.ratio=a;this.updateGrid(!0)},setMaxFeatures:function(a){this.maxFeatures=a;this.updateGrid(!0)},setSpacing:function(a,b){this.dx=a;this.dy=b||a;this.updateGrid(!0)},setOrigin:function(a){this.origin=a;this.updateGrid(!0)},getOrigin:function(){this.origin||(this.origin=this.map.getExtent().getCenterLonLat());return this.origin},setRotation:function(a){this.rotation=a;this.updateGrid(!0)},onMoveEnd:function(){this.updateGrid()},getViewBounds:function(){var a=this.map.getExtent();
if(this.rotation){var b=this.getOrigin(),b=new OpenLayers.Geometry.Point(b.lon,b.lat),a=a.toGeometry();a.rotate(-this.rotation,b);a=a.getBounds()}return a},updateGrid:function(a){if(a||this.invalidBounds()){var b=this.getViewBounds(),c=this.getOrigin(),a=new OpenLayers.Geometry.Point(c.lon,c.lat),d=b.getWidth(),e=b.getHeight(),f=d/e,g=Math.sqrt(this.dx*this.dy*this.maxFeatures/f),d=Math.min(d*this.ratio,g*f),e=Math.min(e*this.ratio,g),b=b.getCenterLonLat();this.gridBounds=new OpenLayers.Bounds(b.lon-
d/2,b.lat-e/2,b.lon+d/2,b.lat+e/2);for(var b=Math.floor(e/this.dy),d=Math.floor(d/this.dx),e=c.lon+this.dx*Math.ceil((this.gridBounds.left-c.lon)/this.dx),c=c.lat+this.dy*Math.ceil((this.gridBounds.bottom-c.lat)/this.dy),g=Array(b*d),h,i=0;i<d;++i)for(var f=e+i*this.dx,j=0;j<b;++j)h=c+j*this.dy,h=new OpenLayers.Geometry.Point(f,h),this.rotation&&h.rotate(this.rotation,a),g[i*b+j]=new OpenLayers.Feature.Vector(h);this.destroyFeatures(this.features,{silent:!0});this.addFeatures(g,{silent:!0})}},invalidBounds:function(){return!this.gridBounds||
!this.gridBounds.containsBounds(this.getViewBounds())},CLASS_NAME:"OpenLayers.Layer.PointGrid"});OpenLayers.Handler.MouseWheel=OpenLayers.Class(OpenLayers.Handler,{wheelListener:null,mousePosition:null,interval:0,delta:0,cumulative:!0,initialize:function(a,b,c){OpenLayers.Handler.prototype.initialize.apply(this,arguments);this.wheelListener=OpenLayers.Function.bindAsEventListener(this.onWheelEvent,this)},destroy:function(){OpenLayers.Handler.prototype.destroy.apply(this,arguments);this.wheelListener=null},onWheelEvent:function(a){if(this.map&&this.checkModifiers(a)){for(var b=!1,c=!1,d=!1,e=
OpenLayers.Event.element(a);null!=e&&!d&&!b;){if(!b)try{var f=e.currentStyle?e.currentStyle.overflow:document.defaultView.getComputedStyle(e,null).getPropertyValue("overflow"),b=f&&"auto"==f||"scroll"==f}catch(g){}if(!c)for(var d=0,h=this.map.layers.length;d<h;d++)if(e==this.map.layers[d].div||e==this.map.layers[d].pane){c=!0;break}d=e==this.map.div;e=e.parentNode}!b&&d&&(c&&((b=0,a||(a=window.event),a.wheelDelta?(b=a.wheelDelta/120,window.opera&&9.2>window.opera.version()&&(b=-b)):a.detail&&(b=-a.detail/
3),this.delta+=b,this.interval)?(window.clearTimeout(this._timeoutId),this._timeoutId=window.setTimeout(OpenLayers.Function.bind(function(){this.wheelZoom(a)},this),this.interval)):this.wheelZoom(a)),OpenLayers.Event.stop(a))}},wheelZoom:function(a){var b=this.delta;this.delta=0;b&&(this.mousePosition&&(a.xy=this.mousePosition),a.xy||(a.xy=this.map.getPixelFromLonLat(this.map.getCenter())),0>b?this.callback("down",[a,this.cumulative?b:-1]):this.callback("up",[a,this.cumulative?b:1]))},mousemove:function(a){this.mousePosition=
a.xy},activate:function(a){if(OpenLayers.Handler.prototype.activate.apply(this,arguments)){var b=this.wheelListener;OpenLayers.Event.observe(window,"DOMMouseScroll",b);OpenLayers.Event.observe(window,"mousewheel",b);OpenLayers.Event.observe(document,"mousewheel",b);return!0}return!1},deactivate:function(a){if(OpenLayers.Handler.prototype.deactivate.apply(this,arguments)){var b=this.wheelListener;OpenLayers.Event.stopObserving(window,"DOMMouseScroll",b);OpenLayers.Event.stopObserving(window,"mousewheel",
b);OpenLayers.Event.stopObserving(document,"mousewheel",b);return!0}return!1},CLASS_NAME:"OpenLayers.Handler.MouseWheel"});OpenLayers.Symbolizer=OpenLayers.Class({zIndex:0,initialize:function(a){OpenLayers.Util.extend(this,a)},clone:function(){return new (eval(this.CLASS_NAME))(OpenLayers.Util.extend({},this))},CLASS_NAME:"OpenLayers.Symbolizer"});OpenLayers.Symbolizer.Raster=OpenLayers.Class(OpenLayers.Symbolizer,{initialize:function(a){OpenLayers.Symbolizer.prototype.initialize.apply(this,arguments)},CLASS_NAME:"OpenLayers.Symbolizer.Raster"});OpenLayers.Rule=OpenLayers.Class({id:null,name:null,title:null,description:null,context:null,filter:null,elseFilter:!1,symbolizer:null,symbolizers:null,minScaleDenominator:null,maxScaleDenominator:null,initialize:function(a){this.symbolizer={};OpenLayers.Util.extend(this,a);this.symbolizers&&delete this.symbolizer;this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_")},destroy:function(){for(var a in this.symbolizer)this.symbolizer[a]=null;this.symbolizer=null;delete this.symbolizers},evaluate:function(a){var b=
this.getContext(a),c=!0;if(this.minScaleDenominator||this.maxScaleDenominator)var d=a.layer.map.getScale();this.minScaleDenominator&&(c=d>=OpenLayers.Style.createLiteral(this.minScaleDenominator,b));c&&this.maxScaleDenominator&&(c=d<OpenLayers.Style.createLiteral(this.maxScaleDenominator,b));c&&this.filter&&(c="OpenLayers.Filter.FeatureId"==this.filter.CLASS_NAME?this.filter.evaluate(a):this.filter.evaluate(b));return c},getContext:function(a){var b=this.context;b||(b=a.attributes||a.data);"function"==
typeof this.context&&(b=this.context(a));return b},clone:function(){var a=OpenLayers.Util.extend({},this);if(this.symbolizers){var b=this.symbolizers.length;a.symbolizers=Array(b);for(var c=0;c<b;++c)a.symbolizers[c]=this.symbolizers[c].clone()}else{a.symbolizer={};for(var d in this.symbolizer)b=this.symbolizer[d],c=typeof b,"object"===c?a.symbolizer[d]=OpenLayers.Util.extend({},b):"string"===c&&(a.symbolizer[d]=b)}a.filter=this.filter&&this.filter.clone();a.context=this.context&&OpenLayers.Util.extend({},
this.context);return new OpenLayers.Rule(a)},CLASS_NAME:"OpenLayers.Rule"});OpenLayers.Filter.Spatial=OpenLayers.Class(OpenLayers.Filter,{type:null,property:null,value:null,distance:null,distanceUnits:null,evaluate:function(a){var b=!1;switch(this.type){case OpenLayers.Filter.Spatial.BBOX:case OpenLayers.Filter.Spatial.INTERSECTS:if(a.geometry){var c=this.value;"OpenLayers.Bounds"==this.value.CLASS_NAME&&(c=this.value.toGeometry());a.geometry.intersects(c)&&(b=!0)}break;default:throw Error("evaluate is not implemented for this filter type.");}return b},clone:function(){var a=
OpenLayers.Util.applyDefaults({value:this.value&&this.value.clone&&this.value.clone()},this);return new OpenLayers.Filter.Spatial(a)},CLASS_NAME:"OpenLayers.Filter.Spatial"});OpenLayers.Filter.Spatial.BBOX="BBOX";OpenLayers.Filter.Spatial.INTERSECTS="INTERSECTS";OpenLayers.Filter.Spatial.DWITHIN="DWITHIN";OpenLayers.Filter.Spatial.WITHIN="WITHIN";OpenLayers.Filter.Spatial.CONTAINS="CONTAINS";OpenLayers.Format.SLD=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{profile:null,defaultVersion:"1.0.0",stringifyOutput:!0,namedLayersAsArray:!1,CLASS_NAME:"OpenLayers.Format.SLD"});OpenLayers.Symbolizer.Polygon=OpenLayers.Class(OpenLayers.Symbolizer,{initialize:function(a){OpenLayers.Symbolizer.prototype.initialize.apply(this,arguments)},CLASS_NAME:"OpenLayers.Symbolizer.Polygon"});OpenLayers.Format.GML.v2=OpenLayers.Class(OpenLayers.Format.GML.Base,{schemaLocation:"http://www.opengis.net/gml http://schemas.opengis.net/gml/2.1.2/feature.xsd",initialize:function(a){OpenLayers.Format.GML.Base.prototype.initialize.apply(this,[a])},readers:{gml:OpenLayers.Util.applyDefaults({outerBoundaryIs:function(a,b){var c={};this.readChildNodes(a,c);b.outer=c.components[0]},innerBoundaryIs:function(a,b){var c={};this.readChildNodes(a,c);b.inner.push(c.components[0])},Box:function(a,b){var c=
{};this.readChildNodes(a,c);b.components||(b.components=[]);var d=c.points[0],c=c.points[1];b.components.push(new OpenLayers.Bounds(d.x,d.y,c.x,c.y))}},OpenLayers.Format.GML.Base.prototype.readers.gml),feature:OpenLayers.Format.GML.Base.prototype.readers.feature,wfs:OpenLayers.Format.GML.Base.prototype.readers.wfs},write:function(a){a=this.writeNode(OpenLayers.Util.isArray(a)?"wfs:FeatureCollection":"gml:featureMember",a);this.setAttributeNS(a,this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation);
return OpenLayers.Format.XML.prototype.write.apply(this,[a])},writers:{gml:OpenLayers.Util.applyDefaults({Point:function(a){var b=this.createElementNSPlus("gml:Point");this.writeNode("coordinates",[a],b);return b},coordinates:function(a){for(var b=a.length,c=Array(b),d,e=0;e<b;++e)d=a[e],c[e]=this.xy?d.x+","+d.y:d.y+","+d.x,void 0!=d.z&&(c[e]+=","+d.z);return this.createElementNSPlus("gml:coordinates",{attributes:{decimal:".",cs:",",ts:" "},value:1==b?c[0]:c.join(" ")})},LineString:function(a){var b=
this.createElementNSPlus("gml:LineString");this.writeNode("coordinates",a.components,b);return b},Polygon:function(a){var b=this.createElementNSPlus("gml:Polygon");this.writeNode("outerBoundaryIs",a.components[0],b);for(var c=1;c<a.components.length;++c)this.writeNode("innerBoundaryIs",a.components[c],b);return b},outerBoundaryIs:function(a){var b=this.createElementNSPlus("gml:outerBoundaryIs");this.writeNode("LinearRing",a,b);return b},innerBoundaryIs:function(a){var b=this.createElementNSPlus("gml:innerBoundaryIs");
this.writeNode("LinearRing",a,b);return b},LinearRing:function(a){var b=this.createElementNSPlus("gml:LinearRing");this.writeNode("coordinates",a.components,b);return b},Box:function(a){var b=this.createElementNSPlus("gml:Box");this.writeNode("coordinates",[{x:a.left,y:a.bottom},{x:a.right,y:a.top}],b);this.srsName&&b.setAttribute("srsName",this.srsName);return b}},OpenLayers.Format.GML.Base.prototype.writers.gml),feature:OpenLayers.Format.GML.Base.prototype.writers.feature,wfs:OpenLayers.Format.GML.Base.prototype.writers.wfs},
CLASS_NAME:"OpenLayers.Format.GML.v2"});OpenLayers.Format.Filter.v1_0_0=OpenLayers.Class(OpenLayers.Format.GML.v2,OpenLayers.Format.Filter.v1,{VERSION:"1.0.0",schemaLocation:"http://www.opengis.net/ogc/filter/1.0.0/filter.xsd",initialize:function(a){OpenLayers.Format.GML.v2.prototype.initialize.apply(this,[a])},readers:{ogc:OpenLayers.Util.applyDefaults({PropertyIsEqualTo:function(a,b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.EQUAL_TO});this.readChildNodes(a,c);b.filters.push(c)},PropertyIsNotEqualTo:function(a,
b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.NOT_EQUAL_TO});this.readChildNodes(a,c);b.filters.push(c)},PropertyIsLike:function(a,b){var c=new OpenLayers.Filter.Comparison({type:OpenLayers.Filter.Comparison.LIKE});this.readChildNodes(a,c);var d=a.getAttribute("wildCard"),e=a.getAttribute("singleChar"),f=a.getAttribute("escape");c.value2regex(d,e,f);b.filters.push(c)}},OpenLayers.Format.Filter.v1.prototype.readers.ogc),gml:OpenLayers.Format.GML.v2.prototype.readers.gml,
feature:OpenLayers.Format.GML.v2.prototype.readers.feature},writers:{ogc:OpenLayers.Util.applyDefaults({PropertyIsEqualTo:function(a){var b=this.createElementNSPlus("ogc:PropertyIsEqualTo");this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsNotEqualTo:function(a){var b=this.createElementNSPlus("ogc:PropertyIsNotEqualTo");this.writeNode("PropertyName",a,b);this.writeOgcExpression(a.value,b);return b},PropertyIsLike:function(a){var b=this.createElementNSPlus("ogc:PropertyIsLike",
{attributes:{wildCard:"*",singleChar:".",escape:"!"}});this.writeNode("PropertyName",a,b);this.writeNode("Literal",a.regex2value(),b);return b},BBOX:function(a){var b=this.createElementNSPlus("ogc:BBOX");a.property&&this.writeNode("PropertyName",a,b);var c=this.writeNode("gml:Box",a.value,b);a.projection&&c.setAttribute("srsName",a.projection);return b}},OpenLayers.Format.Filter.v1.prototype.writers.ogc),gml:OpenLayers.Format.GML.v2.prototype.writers.gml,feature:OpenLayers.Format.GML.v2.prototype.writers.feature},
writeSpatial:function(a,b){var c=this.createElementNSPlus("ogc:"+b);this.writeNode("PropertyName",a,c);if(a.value instanceof OpenLayers.Filter.Function)this.writeNode("Function",a.value,c);else{var d;d=a.value instanceof OpenLayers.Geometry?this.writeNode("feature:_geometry",a.value).firstChild:this.writeNode("gml:Box",a.value);a.projection&&d.setAttribute("srsName",a.projection);c.appendChild(d)}return c},CLASS_NAME:"OpenLayers.Format.Filter.v1_0_0"});OpenLayers.Format.WFST.v1_0_0=OpenLayers.Class(OpenLayers.Format.Filter.v1_0_0,OpenLayers.Format.WFST.v1,{version:"1.0.0",srsNameInQuery:!1,schemaLocations:{wfs:"http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd"},initialize:function(a){OpenLayers.Format.Filter.v1_0_0.prototype.initialize.apply(this,[a]);OpenLayers.Format.WFST.v1.prototype.initialize.apply(this,[a])},readNode:function(a,b){return OpenLayers.Format.GML.v2.prototype.readNode.apply(this,[a,b])},readers:{wfs:OpenLayers.Util.applyDefaults({WFS_TransactionResponse:function(a,
b){b.insertIds=[];b.success=!1;this.readChildNodes(a,b)},InsertResult:function(a,b){var c={fids:[]};this.readChildNodes(a,c);b.insertIds.push(c.fids[0])},TransactionResult:function(a,b){this.readChildNodes(a,b)},Status:function(a,b){this.readChildNodes(a,b)},SUCCESS:function(a,b){b.success=!0}},OpenLayers.Format.WFST.v1.prototype.readers.wfs),gml:OpenLayers.Format.GML.v2.prototype.readers.gml,feature:OpenLayers.Format.GML.v2.prototype.readers.feature,ogc:OpenLayers.Format.Filter.v1_0_0.prototype.readers.ogc},
writers:{wfs:OpenLayers.Util.applyDefaults({Query:function(a){var a=OpenLayers.Util.extend({featureNS:this.featureNS,featurePrefix:this.featurePrefix,featureType:this.featureType,srsName:this.srsName,srsNameInQuery:this.srsNameInQuery},a),b=a.featurePrefix,c=this.createElementNSPlus("wfs:Query",{attributes:{typeName:(b?b+":":"")+a.featureType}});a.srsNameInQuery&&a.srsName&&c.setAttribute("srsName",a.srsName);a.featureNS&&c.setAttribute("xmlns:"+b,a.featureNS);if(a.propertyNames)for(var b=0,d=a.propertyNames.length;b<
d;b++)this.writeNode("ogc:PropertyName",{property:a.propertyNames[b]},c);a.filter&&(this.setFilterProperty(a.filter),this.writeNode("ogc:Filter",a.filter,c));return c}},OpenLayers.Format.WFST.v1.prototype.writers.wfs),gml:OpenLayers.Format.GML.v2.prototype.writers.gml,feature:OpenLayers.Format.GML.v2.prototype.writers.feature,ogc:OpenLayers.Format.Filter.v1_0_0.prototype.writers.ogc},CLASS_NAME:"OpenLayers.Format.WFST.v1_0_0"});OpenLayers.ElementsIndexer=OpenLayers.Class({maxZIndex:null,order:null,indices:null,compare:null,initialize:function(a){this.compare=a?OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_Y_ORDER:OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_DRAWING_ORDER;this.clear()},insert:function(a){this.exists(a)&&this.remove(a);var b=a.id;this.determineZIndex(a);for(var c=-1,d=this.order.length,e;1<d-c;)e=parseInt((c+d)/2),0<this.compare(this,a,OpenLayers.Util.getElement(this.order[e]))?c=e:d=e;this.order.splice(d,
0,b);this.indices[b]=this.getZIndex(a);return this.getNextElement(d)},remove:function(a){var a=a.id,b=OpenLayers.Util.indexOf(this.order,a);0<=b&&(this.order.splice(b,1),delete this.indices[a],this.maxZIndex=0<this.order.length?this.indices[this.order[this.order.length-1]]:0)},clear:function(){this.order=[];this.indices={};this.maxZIndex=0},exists:function(a){return null!=this.indices[a.id]},getZIndex:function(a){return a._style.graphicZIndex},determineZIndex:function(a){var b=a._style.graphicZIndex;
null==b?(b=this.maxZIndex,a._style.graphicZIndex=b):b>this.maxZIndex&&(this.maxZIndex=b)},getNextElement:function(a){a+=1;if(a<this.order.length){var b=OpenLayers.Util.getElement(this.order[a]);void 0==b&&(b=this.getNextElement(a));return b}return null},CLASS_NAME:"OpenLayers.ElementsIndexer"});
OpenLayers.ElementsIndexer.IndexingMethods={Z_ORDER:function(a,b,c){var b=a.getZIndex(b),d=0;c&&(a=a.getZIndex(c),d=b-a);return d},Z_ORDER_DRAWING_ORDER:function(a,b,c){a=OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(a,b,c);c&&0==a&&(a=1);return a},Z_ORDER_Y_ORDER:function(a,b,c){a=OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(a,b,c);c&&0===a&&(b=c._boundsBottom-b._boundsBottom,a=0===b?1:b);return a}};
OpenLayers.Renderer.Elements=OpenLayers.Class(OpenLayers.Renderer,{rendererRoot:null,root:null,vectorRoot:null,textRoot:null,xmlns:null,xOffset:0,indexer:null,BACKGROUND_ID_SUFFIX:"_background",LABEL_ID_SUFFIX:"_label",LABEL_OUTLINE_SUFFIX:"_outline",initialize:function(a,b){OpenLayers.Renderer.prototype.initialize.apply(this,arguments);this.rendererRoot=this.createRenderRoot();this.root=this.createRoot("_root");this.vectorRoot=this.createRoot("_vroot");this.textRoot=this.createRoot("_troot");this.root.appendChild(this.vectorRoot);
this.root.appendChild(this.textRoot);this.rendererRoot.appendChild(this.root);this.container.appendChild(this.rendererRoot);if(b&&(b.zIndexing||b.yOrdering))this.indexer=new OpenLayers.ElementsIndexer(b.yOrdering)},destroy:function(){this.clear();this.xmlns=this.root=this.rendererRoot=null;OpenLayers.Renderer.prototype.destroy.apply(this,arguments)},clear:function(){var a,b=this.vectorRoot;if(b)for(;a=b.firstChild;)b.removeChild(a);if(b=this.textRoot)for(;a=b.firstChild;)b.removeChild(a);this.indexer&&
this.indexer.clear()},setExtent:function(a,b){var c=OpenLayers.Renderer.prototype.setExtent.apply(this,arguments),d=this.getResolution();if(this.map.baseLayer&&this.map.baseLayer.wrapDateLine){var e,f=a.getWidth()/this.map.getExtent().getWidth(),a=a.scale(1/f),f=this.map.getMaxExtent();f.right>a.left&&f.right<a.right?e=!0:f.left>a.left&&f.left<a.right&&(e=!1);if(e!==this.rightOfDateLine||b)c=!1,this.xOffset=!0===e?f.getWidth()/d:0;this.rightOfDateLine=e}return c},getNodeType:function(){},drawGeometry:function(a,
b,c){var d=a.CLASS_NAME,e=!0;if("OpenLayers.Geometry.Collection"==d||"OpenLayers.Geometry.MultiPoint"==d||"OpenLayers.Geometry.MultiLineString"==d||"OpenLayers.Geometry.MultiPolygon"==d){for(var d=0,f=a.components.length;d<f;d++)e=this.drawGeometry(a.components[d],b,c)&&e;return e}d=e=!1;"none"!=b.display&&(b.backgroundGraphic?this.redrawBackgroundNode(a.id,a,b,c):d=!0,e=this.redrawNode(a.id,a,b,c));if(!1==e&&(b=document.getElementById(a.id)))b._style.backgroundGraphic&&(d=!0),b.parentNode.removeChild(b);
d&&(b=document.getElementById(a.id+this.BACKGROUND_ID_SUFFIX))&&b.parentNode.removeChild(b);return e},redrawNode:function(a,b,c,d){c=this.applyDefaultSymbolizer(c);a=this.nodeFactory(a,this.getNodeType(b,c));a._featureId=d;a._boundsBottom=b.getBounds().bottom;a._geometryClass=b.CLASS_NAME;a._style=c;b=this.drawGeometryNode(a,b,c);if(!1===b)return!1;a=b.node;this.indexer?(c=this.indexer.insert(a))?this.vectorRoot.insertBefore(a,c):this.vectorRoot.appendChild(a):a.parentNode!==this.vectorRoot&&this.vectorRoot.appendChild(a);
this.postDraw(a);return b.complete},redrawBackgroundNode:function(a,b,c){c=OpenLayers.Util.extend({},c);c.externalGraphic=c.backgroundGraphic;c.graphicXOffset=c.backgroundXOffset;c.graphicYOffset=c.backgroundYOffset;c.graphicZIndex=c.backgroundGraphicZIndex;c.graphicWidth=c.backgroundWidth||c.graphicWidth;c.graphicHeight=c.backgroundHeight||c.graphicHeight;c.backgroundGraphic=null;c.backgroundXOffset=null;c.backgroundYOffset=null;c.backgroundGraphicZIndex=null;return this.redrawNode(a+this.BACKGROUND_ID_SUFFIX,
b,c,null)},drawGeometryNode:function(a,b,c){var c=c||a._style,d={isFilled:void 0===c.fill?!0:c.fill,isStroked:void 0===c.stroke?!!c.strokeWidth:c.stroke},e;switch(b.CLASS_NAME){case "OpenLayers.Geometry.Point":!1===c.graphic&&(d.isFilled=!1,d.isStroked=!1);e=this.drawPoint(a,b);break;case "OpenLayers.Geometry.LineString":d.isFilled=!1;e=this.drawLineString(a,b);break;case "OpenLayers.Geometry.LinearRing":e=this.drawLinearRing(a,b);break;case "OpenLayers.Geometry.Polygon":e=this.drawPolygon(a,b);break;
case "OpenLayers.Geometry.Rectangle":e=this.drawRectangle(a,b)}a._options=d;return!1!=e?{node:this.setStyle(a,c,d,b),complete:e}:!1},postDraw:function(){},drawPoint:function(){},drawLineString:function(){},drawLinearRing:function(){},drawPolygon:function(){},drawRectangle:function(){},drawCircle:function(){},removeText:function(a){var b=document.getElementById(a+this.LABEL_ID_SUFFIX);b&&this.textRoot.removeChild(b);(a=document.getElementById(a+this.LABEL_OUTLINE_SUFFIX))&&this.textRoot.removeChild(a)},
getFeatureIdFromEvent:function(a){var b=a.target,c=b&&b.correspondingUseElement;return(c?c:b||a.srcElement)._featureId},eraseGeometry:function(a,b){if("OpenLayers.Geometry.MultiPoint"==a.CLASS_NAME||"OpenLayers.Geometry.MultiLineString"==a.CLASS_NAME||"OpenLayers.Geometry.MultiPolygon"==a.CLASS_NAME||"OpenLayers.Geometry.Collection"==a.CLASS_NAME)for(var c=0,d=a.components.length;c<d;c++)this.eraseGeometry(a.components[c],b);else if((c=OpenLayers.Util.getElement(a.id))&&c.parentNode)if(c.geometry&&
(c.geometry.destroy(),c.geometry=null),c.parentNode.removeChild(c),this.indexer&&this.indexer.remove(c),c._style.backgroundGraphic)(c=OpenLayers.Util.getElement(a.id+this.BACKGROUND_ID_SUFFIX))&&c.parentNode&&c.parentNode.removeChild(c)},nodeFactory:function(a,b){var c=OpenLayers.Util.getElement(a);c?this.nodeTypeCompare(c,b)||(c.parentNode.removeChild(c),c=this.nodeFactory(a,b)):c=this.createNode(b,a);return c},nodeTypeCompare:function(){},createNode:function(){},moveRoot:function(a){var b=this.root;
a.root.parentNode==this.rendererRoot&&(b=a.root);b.parentNode.removeChild(b);a.rendererRoot.appendChild(b)},getRenderLayerId:function(){return this.root.parentNode.parentNode.id},isComplexSymbol:function(a){return"circle"!=a&&!!a},CLASS_NAME:"OpenLayers.Renderer.Elements"});OpenLayers.Control.ArgParser=OpenLayers.Class(OpenLayers.Control,{center:null,zoom:null,layers:null,displayProjection:null,getParameters:function(a){var a=a||window.location.href,b=OpenLayers.Util.getParameters(a),c=a.indexOf("#");0<c&&(a="?"+a.substring(c+1,a.length),OpenLayers.Util.extend(b,OpenLayers.Util.getParameters(a)));return b},setMap:function(a){OpenLayers.Control.prototype.setMap.apply(this,arguments);for(var b=0,c=this.map.controls.length;b<c;b++){var d=this.map.controls[b];if(d!=this&&
"OpenLayers.Control.ArgParser"==d.CLASS_NAME){d.displayProjection!=this.displayProjection&&(this.displayProjection=d.displayProjection);break}}if(b==this.map.controls.length&&(b=this.getParameters(),b.layers&&(this.layers=b.layers,this.map.events.register("addlayer",this,this.configureLayers),this.configureLayers()),b.lat&&b.lon))this.center=new OpenLayers.LonLat(parseFloat(b.lon),parseFloat(b.lat)),b.zoom&&(this.zoom=parseFloat(b.zoom)),this.map.events.register("changebaselayer",this,this.setCenter),
this.setCenter()},setCenter:function(){this.map.baseLayer&&(this.map.events.unregister("changebaselayer",this,this.setCenter),this.displayProjection&&this.center.transform(this.displayProjection,this.map.getProjectionObject()),this.map.setCenter(this.center,this.zoom))},configureLayers:function(){if(this.layers.length==this.map.layers.length){this.map.events.unregister("addlayer",this,this.configureLayers);for(var a=0,b=this.layers.length;a<b;a++){var c=this.map.layers[a],d=this.layers.charAt(a);
"B"==d?this.map.setBaseLayer(c):("T"==d||"F"==d)&&c.setVisibility("T"==d)}}},CLASS_NAME:"OpenLayers.Control.ArgParser"});OpenLayers.Control.Permalink=OpenLayers.Class(OpenLayers.Control,{argParserClass:OpenLayers.Control.ArgParser,element:null,anchor:!1,base:"",displayProjection:null,initialize:function(a,b,c){null!==a&&"object"==typeof a&&!OpenLayers.Util.isElement(a)?(this.base=document.location.href,OpenLayers.Control.prototype.initialize.apply(this,[a]),null!=this.element&&(this.element=OpenLayers.Util.getElement(this.element))):(OpenLayers.Control.prototype.initialize.apply(this,[c]),this.element=OpenLayers.Util.getElement(a),
this.base=b||document.location.href)},destroy:function(){this.element&&this.element.parentNode==this.div&&(this.div.removeChild(this.element),this.element=null);this.map&&this.map.events.unregister("moveend",this,this.updateLink);OpenLayers.Control.prototype.destroy.apply(this,arguments)},setMap:function(a){OpenLayers.Control.prototype.setMap.apply(this,arguments);for(var b=0,c=this.map.controls.length;b<c;b++){var d=this.map.controls[b];if(d.CLASS_NAME==this.argParserClass.CLASS_NAME){d.displayProjection!=
this.displayProjection&&(this.displayProjection=d.displayProjection);break}}b==this.map.controls.length&&this.map.addControl(new this.argParserClass({displayProjection:this.displayProjection}))},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);!this.element&&!this.anchor&&(this.element=document.createElement("a"),this.element.innerHTML=OpenLayers.i18n("Permalink"),this.element.href="",this.div.appendChild(this.element));this.map.events.on({moveend:this.updateLink,changelayer:this.updateLink,
changebaselayer:this.updateLink,scope:this});this.updateLink();return this.div},updateLink:function(){var a=this.anchor?"#":"?",b=this.base;-1!=b.indexOf(a)&&(b=b.substring(0,b.indexOf(a)));b+=a+OpenLayers.Util.getParameterString(this.createParams());this.anchor&&!this.element?window.location.href=b:this.element.href=b},createParams:function(a,b,c){var a=a||this.map.getCenter(),d=OpenLayers.Util.getParameters(this.base);if(a){d.zoom=b||this.map.getZoom();b=a.lat;a=a.lon;this.displayProjection&&(b=
OpenLayers.Projection.transform({x:a,y:b},this.map.getProjectionObject(),this.displayProjection),a=b.x,b=b.y);d.lat=Math.round(1E5*b)/1E5;d.lon=Math.round(1E5*a)/1E5;c=c||this.map.layers;d.layers="";a=0;for(b=c.length;a<b;a++){var e=c[a];d.layers=e.isBaseLayer?d.layers+(e==this.map.baseLayer?"B":"0"):d.layers+(e.getVisibility()?"T":"F")}}return d},CLASS_NAME:"OpenLayers.Control.Permalink"});OpenLayers.Layer.TMS=OpenLayers.Class(OpenLayers.Layer.Grid,{serviceVersion:"1.0.0",layername:null,type:null,isBaseLayer:!0,tileOrigin:null,serverResolutions:null,zoomOffset:0,initialize:function(a,b,c){var d=[];d.push(a,b,{},c);OpenLayers.Layer.Grid.prototype.initialize.apply(this,d)},clone:function(a){null==a&&(a=new OpenLayers.Layer.TMS(this.name,this.url,this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},getURL:function(a){var a=this.adjustBounds(a),b=this.getServerResolution(),
c=Math.round((a.left-this.tileOrigin.lon)/(b*this.tileSize.w)),a=Math.round((a.bottom-this.tileOrigin.lat)/(b*this.tileSize.h)),c=this.serviceVersion+"/"+this.layername+"/"+this.getServerZoom()+"/"+c+"/"+a+"."+this.type,a=this.url;OpenLayers.Util.isArray(a)&&(a=this.selectUrl(c,a));return a+c},setMap:function(a){OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);this.tileOrigin||(this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.bottom))},CLASS_NAME:"OpenLayers.Layer.TMS"});OpenLayers.Strategy.Fixed=OpenLayers.Class(OpenLayers.Strategy,{preload:!1,activate:function(){if(OpenLayers.Strategy.prototype.activate.apply(this,arguments)){this.layer.events.on({refresh:this.load,scope:this});if(!0==this.layer.visibility||this.preload)this.load();else this.layer.events.on({visibilitychanged:this.load,scope:this});return!0}return!1},deactivate:function(){var a=OpenLayers.Strategy.prototype.deactivate.call(this);a&&this.layer.events.un({refresh:this.load,visibilitychanged:this.load,
scope:this});return a},load:function(a){var b=this.layer;b.events.triggerEvent("loadstart");b.protocol.read(OpenLayers.Util.applyDefaults({callback:OpenLayers.Function.bind(this.merge,this,b.map.getProjectionObject()),filter:b.filter},a));b.events.un({visibilitychanged:this.load,scope:this})},merge:function(a,b){var c=this.layer;c.destroyFeatures();var d=b.features;if(d&&0<d.length){if(!a.equals(c.projection))for(var e,f=0,g=d.length;f<g;++f)(e=d[f].geometry)&&e.transform(c.projection,a);c.addFeatures(d)}c.events.triggerEvent("loadend")},
CLASS_NAME:"OpenLayers.Strategy.Fixed"});OpenLayers.Control.Zoom=OpenLayers.Class(OpenLayers.Control,{zoomInText:"+",zoomInId:"olZoomInLink",zoomOutText:"-",zoomOutId:"olZoomOutLink",draw:function(){var a=OpenLayers.Control.prototype.draw.apply(this),b=this.getOrCreateLinks(a),c=b.zoomIn,b=b.zoomOut,d=this.map.events;b.parentNode!==a&&(d=this.events,d.attachToElement(b.parentNode));d.register("buttonclick",this,this.onZoomClick);this.zoomInLink=c;this.zoomOutLink=b;return a},getOrCreateLinks:function(a){var b=document.getElementById(this.zoomInId),
c=document.getElementById(this.zoomOutId);b||(b=document.createElement("a"),b.href="#zoomIn",b.appendChild(document.createTextNode(this.zoomInText)),b.className="olControlZoomIn",a.appendChild(b));OpenLayers.Element.addClass(b,"olButton");c||(c=document.createElement("a"),c.href="#zoomOut",c.appendChild(document.createTextNode(this.zoomOutText)),c.className="olControlZoomOut",a.appendChild(c));OpenLayers.Element.addClass(c,"olButton");return{zoomIn:b,zoomOut:c}},onZoomClick:function(a){a=a.buttonElement;
a===this.zoomInLink?this.map.zoomIn():a===this.zoomOutLink&&this.map.zoomOut()},destroy:function(){this.map&&this.map.events.unregister("buttonclick",this,this.onZoomClick);delete this.zoomInLink;delete this.zoomOutLink;OpenLayers.Control.prototype.destroy.apply(this)},CLASS_NAME:"OpenLayers.Control.Zoom"});OpenLayers.Layer.PointTrack=OpenLayers.Class(OpenLayers.Layer.Vector,{dataFrom:null,styleFrom:null,addNodes:function(a,b){if(2>a.length)throw Error("At least two point features have to be added to create a line from");for(var c=Array(a.length-1),d,e,f,g=0,h=a.length;g<h;g++){d=a[g];if(f=d.geometry){if("OpenLayers.Geometry.Point"!=f.CLASS_NAME)throw new TypeError("Only features with point geometries are supported.");}else f=d.lonlat,f=new OpenLayers.Geometry.Point(f.lon,f.lat);if(0<g){d=null!=this.dataFrom?
a[g+this.dataFrom].data||a[g+this.dataFrom].attributes:null;var i=null!=this.styleFrom?a[g+this.styleFrom].style:null;e=new OpenLayers.Geometry.LineString([e,f]);c[g-1]=new OpenLayers.Feature.Vector(e,d,i)}e=f}this.addFeatures(c,b)},CLASS_NAME:"OpenLayers.Layer.PointTrack"});OpenLayers.Layer.PointTrack.SOURCE_NODE=-1;OpenLayers.Layer.PointTrack.TARGET_NODE=0;OpenLayers.Layer.PointTrack.dataFrom={SOURCE_NODE:-1,TARGET_NODE:0};OpenLayers.Protocol.WFS=function(a){var a=OpenLayers.Util.applyDefaults(a,OpenLayers.Protocol.WFS.DEFAULTS),b=OpenLayers.Protocol.WFS["v"+a.version.replace(/\./g,"_")];if(!b)throw"Unsupported WFS version: "+a.version;return new b(a)};
OpenLayers.Protocol.WFS.fromWMSLayer=function(a,b){var c,d;c=a.params.LAYERS;c=(OpenLayers.Util.isArray(c)?c[0]:c).split(":");1<c.length&&(d=c[0]);c=c.pop();d={url:a.url,featureType:c,featurePrefix:d,srsName:a.projection&&a.projection.getCode()||a.map&&a.map.getProjectionObject().getCode(),version:"1.1.0"};return new OpenLayers.Protocol.WFS(OpenLayers.Util.applyDefaults(b,d))};OpenLayers.Protocol.WFS.DEFAULTS={version:"1.0.0"};OpenLayers.Layer.Markers=OpenLayers.Class(OpenLayers.Layer,{isBaseLayer:!1,markers:null,drawn:!1,initialize:function(a,b){OpenLayers.Layer.prototype.initialize.apply(this,arguments);this.markers=[]},destroy:function(){this.clearMarkers();this.markers=null;OpenLayers.Layer.prototype.destroy.apply(this,arguments)},setOpacity:function(a){if(a!=this.opacity){this.opacity=a;for(var a=0,b=this.markers.length;a<b;a++)this.markers[a].setOpacity(this.opacity)}},moveTo:function(a,b,c){OpenLayers.Layer.prototype.moveTo.apply(this,
arguments);if(b||!this.drawn){for(var d=0,e=this.markers.length;d<e;d++)this.drawMarker(this.markers[d]);this.drawn=!0}},addMarker:function(a){this.markers.push(a);1>this.opacity&&a.setOpacity(this.opacity);this.map&&this.map.getExtent()&&(a.map=this.map,this.drawMarker(a))},removeMarker:function(a){this.markers&&this.markers.length&&(OpenLayers.Util.removeItem(this.markers,a),a.erase())},clearMarkers:function(){if(null!=this.markers)for(;0<this.markers.length;)this.removeMarker(this.markers[0])},
drawMarker:function(a){var b=this.map.getLayerPxFromLonLat(a.lonlat);null==b?a.display(!1):a.isDrawn()?a.icon&&a.icon.moveTo(b):this.div.appendChild(a.draw(b))},getDataExtent:function(){var a=null;if(this.markers&&0<this.markers.length)for(var a=new OpenLayers.Bounds,b=0,c=this.markers.length;b<c;b++)a.extend(this.markers[b].lonlat);return a},CLASS_NAME:"OpenLayers.Layer.Markers"});OpenLayers.Control.Pan=OpenLayers.Class(OpenLayers.Control,{slideFactor:50,slideRatio:null,direction:null,type:OpenLayers.Control.TYPE_BUTTON,initialize:function(a,b){this.direction=a;this.CLASS_NAME+=this.direction;OpenLayers.Control.prototype.initialize.apply(this,[b])},trigger:function(){var a=OpenLayers.Function.bind(function(a){return this.slideRatio?this.map.getSize()[a]*this.slideRatio:this.slideFactor},this);switch(this.direction){case OpenLayers.Control.Pan.NORTH:this.map.pan(0,-a("h"));
break;case OpenLayers.Control.Pan.SOUTH:this.map.pan(0,a("h"));break;case OpenLayers.Control.Pan.WEST:this.map.pan(-a("w"),0);break;case OpenLayers.Control.Pan.EAST:this.map.pan(a("w"),0)}},CLASS_NAME:"OpenLayers.Control.Pan"});OpenLayers.Control.Pan.NORTH="North";OpenLayers.Control.Pan.SOUTH="South";OpenLayers.Control.Pan.EAST="East";OpenLayers.Control.Pan.WEST="West";OpenLayers.Format.CSWGetDomain=function(a){var a=OpenLayers.Util.applyDefaults(a,OpenLayers.Format.CSWGetDomain.DEFAULTS),b=OpenLayers.Format.CSWGetDomain["v"+a.version.replace(/\./g,"_")];if(!b)throw"Unsupported CSWGetDomain version: "+a.version;return new b(a)};OpenLayers.Format.CSWGetDomain.DEFAULTS={version:"2.0.2"};OpenLayers.Format.CSWGetDomain.v2_0_2=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance",csw:"http://www.opengis.net/cat/csw/2.0.2"},defaultPrefix:"csw",version:"2.0.2",schemaLocation:"http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd",PropertyName:null,ParameterName:null,read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==
a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,b);return b},readers:{csw:{GetDomainResponse:function(a,b){this.readChildNodes(a,b)},DomainValues:function(a,b){OpenLayers.Util.isArray(b.DomainValues)||(b.DomainValues=[]);for(var c=a.attributes,d={},e=0,f=c.length;e<f;++e)d[c[e].name]=c[e].nodeValue;this.readChildNodes(a,d);b.DomainValues.push(d)},PropertyName:function(a,b){b.PropertyName=this.getChildValue(a)},ParameterName:function(a,b){b.ParameterName=this.getChildValue(a)},ListOfValues:function(a,
b){OpenLayers.Util.isArray(b.ListOfValues)||(b.ListOfValues=[]);this.readChildNodes(a,b.ListOfValues)},Value:function(a,b){for(var c=a.attributes,d={},e=0,f=c.length;e<f;++e)d[c[e].name]=c[e].nodeValue;d.value=this.getChildValue(a);b.push({Value:d})},ConceptualScheme:function(a,b){b.ConceptualScheme={};this.readChildNodes(a,b.ConceptualScheme)},Name:function(a,b){b.Name=this.getChildValue(a)},Document:function(a,b){b.Document=this.getChildValue(a)},Authority:function(a,b){b.Authority=this.getChildValue(a)},
RangeOfValues:function(a,b){b.RangeOfValues={};this.readChildNodes(a,b.RangeOfValues)},MinValue:function(a,b){for(var c=a.attributes,d={},e=0,f=c.length;e<f;++e)d[c[e].name]=c[e].nodeValue;d.value=this.getChildValue(a);b.MinValue=d},MaxValue:function(a,b){for(var c=a.attributes,d={},e=0,f=c.length;e<f;++e)d[c[e].name]=c[e].nodeValue;d.value=this.getChildValue(a);b.MaxValue=d}}},write:function(a){a=this.writeNode("csw:GetDomain",a);return OpenLayers.Format.XML.prototype.write.apply(this,[a])},writers:{csw:{GetDomain:function(a){var b=
this.createElementNSPlus("csw:GetDomain",{attributes:{service:"CSW",version:this.version}});if(a.PropertyName||this.PropertyName)this.writeNode("csw:PropertyName",a.PropertyName||this.PropertyName,b);else if(a.ParameterName||this.ParameterName)this.writeNode("csw:ParameterName",a.ParameterName||this.ParameterName,b);this.readChildNodes(b,a);return b},PropertyName:function(a){return this.createElementNSPlus("csw:PropertyName",{value:a})},ParameterName:function(a){return this.createElementNSPlus("csw:ParameterName",
{value:a})}}},CLASS_NAME:"OpenLayers.Format.CSWGetDomain.v2_0_2"});OpenLayers.Format.ArcXML.Features=OpenLayers.Class(OpenLayers.Format.XML,{read:function(a){return(new OpenLayers.Format.ArcXML).read(a).features.feature}});OpenLayers.Control.Snapping=OpenLayers.Class(OpenLayers.Control,{DEFAULTS:{tolerance:10,node:!0,edge:!0,vertex:!0},greedy:!0,precedence:["node","vertex","edge"],resolution:null,geoToleranceCache:null,layer:null,feature:null,point:null,initialize:function(a){OpenLayers.Control.prototype.initialize.apply(this,[a]);this.options=a||{};this.options.layer&&this.setLayer(this.options.layer);a=OpenLayers.Util.extend({},this.options.defaults);this.defaults=OpenLayers.Util.applyDefaults(a,this.DEFAULTS);this.setTargets(this.options.targets);
0===this.targets.length&&this.layer&&this.addTargetLayer(this.layer);this.geoToleranceCache={}},setLayer:function(a){this.active?(this.deactivate(),this.layer=a,this.activate()):this.layer=a},setTargets:function(a){this.targets=[];if(a&&a.length)for(var b,c=0,d=a.length;c<d;++c)b=a[c],b instanceof OpenLayers.Layer.Vector?this.addTargetLayer(b):this.addTarget(b)},addTargetLayer:function(a){this.addTarget({layer:a})},addTarget:function(a){a=OpenLayers.Util.applyDefaults(a,this.defaults);a.nodeTolerance=
a.nodeTolerance||a.tolerance;a.vertexTolerance=a.vertexTolerance||a.tolerance;a.edgeTolerance=a.edgeTolerance||a.tolerance;this.targets.push(a)},removeTargetLayer:function(a){for(var b,c=this.targets.length-1;0<=c;--c)b=this.targets[c],b.layer===a&&this.removeTarget(b)},removeTarget:function(a){return OpenLayers.Util.removeItem(this.targets,a)},activate:function(){var a=OpenLayers.Control.prototype.activate.call(this);if(a&&this.layer&&this.layer.events)this.layer.events.on({sketchstarted:this.onSketchModified,
sketchmodified:this.onSketchModified,vertexmodified:this.onVertexModified,scope:this});return a},deactivate:function(){var a=OpenLayers.Control.prototype.deactivate.call(this);a&&this.layer&&this.layer.events&&this.layer.events.un({sketchstarted:this.onSketchModified,sketchmodified:this.onSketchModified,vertexmodified:this.onVertexModified,scope:this});this.point=this.feature=null;return a},onSketchModified:function(a){this.feature=a.feature;this.considerSnapping(a.vertex,a.vertex)},onVertexModified:function(a){this.feature=
a.feature;var b=this.layer.map.getLonLatFromViewPortPx(a.pixel);this.considerSnapping(a.vertex,new OpenLayers.Geometry.Point(b.lon,b.lat))},considerSnapping:function(a,b){for(var c={rank:Number.POSITIVE_INFINITY,dist:Number.POSITIVE_INFINITY,x:null,y:null},d=!1,e,f,g=0,h=this.targets.length;g<h;++g)if(f=this.targets[g],e=this.testTarget(f,b))if(this.greedy){c=e;c.target=f;d=!0;break}else if(e.rank<c.rank||e.rank===c.rank&&e.dist<c.dist)c=e,c.target=f,d=!0;d&&(!1!==this.events.triggerEvent("beforesnap",
{point:a,x:c.x,y:c.y,distance:c.dist,layer:c.target.layer,snapType:this.precedence[c.rank]})?(a.x=c.x,a.y=c.y,this.point=a,this.events.triggerEvent("snap",{point:a,snapType:this.precedence[c.rank],layer:c.target.layer,distance:c.dist})):d=!1);this.point&&!d&&(a.x=b.x,a.y=b.y,this.point=null,this.events.triggerEvent("unsnap",{point:a}))},testTarget:function(a,b){var c=this.layer.map.getResolution();if("minResolution"in a&&c<a.minResolution||"maxResolution"in a&&c>=a.maxResolution)return null;for(var c=
{node:this.getGeoTolerance(a.nodeTolerance,c),vertex:this.getGeoTolerance(a.vertexTolerance,c),edge:this.getGeoTolerance(a.edgeTolerance,c)},d=Math.max(c.node,c.vertex,c.edge),e={rank:Number.POSITIVE_INFINITY,dist:Number.POSITIVE_INFINITY},f=!1,g=a.layer.features,h,i,j,k,l,m,n=this.precedence.length,o=new OpenLayers.LonLat(b.x,b.y),p=0,q=g.length;p<q;++p)if(h=g[p],h!==this.feature&&(!h._sketch&&h.state!==OpenLayers.State.DELETE&&(!a.filter||a.filter.evaluate(h)))&&h.atPoint(o,d,d))for(var r=0,s=Math.min(e.rank+
1,n);r<s;++r)if(i=this.precedence[r],a[i])if("edge"===i){if(j=h.geometry.distanceTo(b,{details:!0}),l=j.distance,l<=c[i]&&l<e.dist){e={rank:r,dist:l,x:j.x0,y:j.y0};f=!0;break}}else{j=h.geometry.getVertices("node"===i);m=!1;for(var t=0,u=j.length;t<u;++t)if(k=j[t],l=k.distanceTo(b),l<=c[i]&&(r<e.rank||r===e.rank&&l<e.dist))e={rank:r,dist:l,x:k.x,y:k.y},m=f=!0;if(m)break}return f?e:null},getGeoTolerance:function(a,b){b!==this.resolution&&(this.resolution=b,this.geoToleranceCache={});var c=this.geoToleranceCache[a];
void 0===c&&(c=a*b,this.geoToleranceCache[a]=c);return c},destroy:function(){this.active&&this.deactivate();delete this.layer;delete this.targets;OpenLayers.Control.prototype.destroy.call(this)},CLASS_NAME:"OpenLayers.Control.Snapping"});OpenLayers.Date={toISOString:function(){if("toISOString"in Date.prototype)return function(a){return a.toISOString()};var a=function(a,c){for(var d=a+"";d.length<c;)d="0"+d;return d};return function(b){return isNaN(b.getTime())?"Invalid Date":b.getUTCFullYear()+"-"+a(b.getUTCMonth()+1,2)+"-"+a(b.getUTCDate(),2)+"T"+a(b.getUTCHours(),2)+":"+a(b.getUTCMinutes(),2)+":"+a(b.getUTCSeconds(),2)+"."+a(b.getUTCMilliseconds(),3)+"Z"}}(),parse:function(a){var b;if((a=a.match(/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))|Z)?$/))&&
(a[1]||a[7])){b=parseInt(a[1],10)||0;var c=parseInt(a[2],10)-1||0,d=parseInt(a[3],10)||1;b=new Date(Date.UTC(b,c,d));if(c=a[7]){var d=parseInt(a[4],10),e=parseInt(a[5],10),f=parseFloat(a[6]),g=f|0,f=Math.round(1E3*(f-g));b.setUTCHours(d,e,g,f);"Z"!==c&&(c=parseInt(c,10),a=parseInt(a[8],10)||0,b=new Date(b.getTime()+-1E3*(60*60*c+60*a)))}}else b=new Date("invalid");return b}};(function(){function a(){this._object=f&&!i?new f:new window.ActiveXObject("Microsoft.XMLHTTP");this._listeners=[]}function b(){return new a}function c(a){b.onreadystatechange&&b.onreadystatechange.apply(a);a.dispatchEvent({type:"readystatechange",bubbles:!1,cancelable:!1,timeStamp:new Date+0})}function d(a){try{a.responseText=a._object.responseText}catch(b){}try{var c;var d=a._object,e=d.responseXML,f=d.responseText;h&&(f&&e&&!e.documentElement&&d.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/))&&
(e=new window.ActiveXObject("Microsoft.XMLDOM"),e.async=!1,e.validateOnParse=!1,e.loadXML(f));c=e&&(h&&0!=e.parseError||!e.documentElement||e.documentElement&&"parsererror"==e.documentElement.tagName)?null:e;a.responseXML=c}catch(g){}try{a.status=a._object.status}catch(i){}try{a.statusText=a._object.statusText}catch(r){}}function e(a){a._object.onreadystatechange=new window.Function}var f=window.XMLHttpRequest,g=!!window.controllers,h=window.document.all&&!window.opera,i=h&&window.navigator.userAgent.match(/MSIE 7.0/);
b.prototype=a.prototype;g&&f.wrapped&&(b.wrapped=f.wrapped);b.UNSENT=0;b.OPENED=1;b.HEADERS_RECEIVED=2;b.LOADING=3;b.DONE=4;b.prototype.readyState=b.UNSENT;b.prototype.responseText="";b.prototype.responseXML=null;b.prototype.status=0;b.prototype.statusText="";b.prototype.priority="NORMAL";b.prototype.onreadystatechange=null;b.onreadystatechange=null;b.onopen=null;b.onsend=null;b.onabort=null;b.prototype.open=function(a,f,i,m,n){delete this._headers;arguments.length<3&&(i=true);this._async=i;var o=
this,p=this.readyState,q;if(h&&i){q=function(){if(p!=b.DONE){e(o);o.abort()}};window.attachEvent("onunload",q)}b.onopen&&b.onopen.apply(this,arguments);arguments.length>4?this._object.open(a,f,i,m,n):arguments.length>3?this._object.open(a,f,i,m):this._object.open(a,f,i);this.readyState=b.OPENED;c(this);this._object.onreadystatechange=function(){if(!g||i){o.readyState=o._object.readyState;d(o);if(o._aborted)o.readyState=b.UNSENT;else{if(o.readyState==b.DONE){delete o._data;e(o);h&&i&&window.detachEvent("onunload",
q)}p!=o.readyState&&c(o);p=o.readyState}}}};b.prototype.send=function(a){b.onsend&&b.onsend.apply(this,arguments);arguments.length||(a=null);if(a&&a.nodeType){a=window.XMLSerializer?(new window.XMLSerializer).serializeToString(a):a.xml;this._headers["Content-Type"]||this._object.setRequestHeader("Content-Type","application/xml")}this._data=a;a:{this._object.send(this._data);if(g&&!this._async){this.readyState=b.OPENED;for(d(this);this.readyState<b.DONE;){this.readyState++;c(this);if(this._aborted)break a}}}};
b.prototype.abort=function(){b.onabort&&b.onabort.apply(this,arguments);if(this.readyState>b.UNSENT)this._aborted=true;this._object.abort();e(this);this.readyState=b.UNSENT;delete this._data};b.prototype.getAllResponseHeaders=function(){return this._object.getAllResponseHeaders()};b.prototype.getResponseHeader=function(a){return this._object.getResponseHeader(a)};b.prototype.setRequestHeader=function(a,b){if(!this._headers)this._headers={};this._headers[a]=b;return this._object.setRequestHeader(a,
b)};b.prototype.addEventListener=function(a,b,c){for(var d=0,e;e=this._listeners[d];d++)if(e[0]==a&&e[1]==b&&e[2]==c)return;this._listeners.push([a,b,c])};b.prototype.removeEventListener=function(a,b,c){for(var d=0,e;e=this._listeners[d];d++)if(e[0]==a&&e[1]==b&&e[2]==c)break;e&&this._listeners.splice(d,1)};b.prototype.dispatchEvent=function(a){a={type:a.type,target:this,currentTarget:this,eventPhase:2,bubbles:a.bubbles,cancelable:a.cancelable,timeStamp:a.timeStamp,stopPropagation:function(){},preventDefault:function(){},
initEvent:function(){}};a.type=="readystatechange"&&this.onreadystatechange&&(this.onreadystatechange.handleEvent||this.onreadystatechange).apply(this,[a]);for(var b=0,c;c=this._listeners[b];b++)c[0]==a.type&&!c[2]&&(c[1].handleEvent||c[1]).apply(this,[a])};b.prototype.toString=function(){return"[object XMLHttpRequest]"};b.toString=function(){return"[XMLHttpRequest]"};window.Function.prototype.apply||(window.Function.prototype.apply=function(a,b){b||(b=[]);a.__func=this;a.__func(b[0],b[1],b[2],b[3],
b[4]);delete a.__func});OpenLayers.Request.XMLHttpRequest=b})();OpenLayers.Format.KML=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{kml:"http://www.opengis.net/kml/2.2",gx:"http://www.google.com/kml/ext/2.2"},kmlns:"http://earth.google.com/kml/2.0",placemarksDesc:"No description available",foldersName:"OpenLayers export",foldersDesc:"Exported on "+new Date,extractAttributes:!0,kvpAttributes:!1,extractStyles:!1,extractTracks:!1,trackAttributes:null,internalns:null,features:null,styles:null,styleBaseUrl:"",fetched:null,maxDepth:0,initialize:function(a){this.regExes=
{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g,kmlColor:/(\w{2})(\w{2})(\w{2})(\w{2})/,kmlIconPalette:/root:\/\/icons\/palette-(\d+)(\.\w+)/,straightBracket:/\$\[(.*?)\]/g};this.externalProjection=new OpenLayers.Projection("EPSG:4326");OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){this.features=[];this.styles={};this.fetched={};return this.parseData(a,{depth:0,styleBaseUrl:this.styleBaseUrl})},parseData:function(a,b){"string"==typeof a&&
(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));for(var c=["Link","NetworkLink","Style","StyleMap","Placemark"],d=0,e=c.length;d<e;++d){var f=c[d],g=this.getElementsByTagNameNS(a,"*",f);if(0!=g.length)switch(f.toLowerCase()){case "link":case "networklink":this.parseLinks(g,b);break;case "style":this.extractStyles&&this.parseStyles(g,b);break;case "stylemap":this.extractStyles&&this.parseStyleMaps(g,b);break;case "placemark":this.parseFeatures(g,b)}}return this.features},parseLinks:function(a,
b){if(b.depth>=this.maxDepth)return!1;var c=OpenLayers.Util.extend({},b);c.depth++;for(var d=0,e=a.length;d<e;d++){var f=this.parseProperty(a[d],"*","href");f&&!this.fetched[f]&&(this.fetched[f]=!0,(f=this.fetchLink(f))&&this.parseData(f,c))}},fetchLink:function(a){if(a=OpenLayers.Request.GET({url:a,async:!1}))return a.responseText},parseStyles:function(a,b){for(var c=0,d=a.length;c<d;c++){var e=this.parseStyle(a[c]);e&&(this.styles[(b.styleBaseUrl||"")+"#"+e.id]=e)}},parseKmlColor:function(a){var b=
null;a&&(a=a.match(this.regExes.kmlColor))&&(b={color:"#"+a[4]+a[3]+a[2],opacity:parseInt(a[1],16)/255});return b},parseStyle:function(a){for(var b={},c=["LineStyle","PolyStyle","IconStyle","BalloonStyle","LabelStyle"],d,e,f=0,g=c.length;f<g;++f)if(d=c[f],e=this.getElementsByTagNameNS(a,"*",d)[0])switch(d.toLowerCase()){case "linestyle":d=this.parseProperty(e,"*","color");if(d=this.parseKmlColor(d))b.strokeColor=d.color,b.strokeOpacity=d.opacity;(d=this.parseProperty(e,"*","width"))&&(b.strokeWidth=
d);break;case "polystyle":d=this.parseProperty(e,"*","color");if(d=this.parseKmlColor(d))b.fillOpacity=d.opacity,b.fillColor=d.color;"0"==this.parseProperty(e,"*","fill")&&(b.fillColor="none");"0"==this.parseProperty(e,"*","outline")&&(b.strokeWidth="0");break;case "iconstyle":var h=parseFloat(this.parseProperty(e,"*","scale")||1);d=32*h;var i=32*h,j=this.getElementsByTagNameNS(e,"*","Icon")[0];if(j){var k=this.parseProperty(j,"*","href");if(k){var l=this.parseProperty(j,"*","w"),m=this.parseProperty(j,
"*","h");OpenLayers.String.startsWith(k,"http://maps.google.com/mapfiles/kml")&&(!l&&!m)&&(m=l=64,h/=2);l=l||m;m=m||l;l&&(d=parseInt(l)*h);m&&(i=parseInt(m)*h);if(m=k.match(this.regExes.kmlIconPalette))l=m[1],m=m[2],k=this.parseProperty(j,"*","x"),j=this.parseProperty(j,"*","y"),k="http://maps.google.com/mapfiles/kml/pal"+l+"/icon"+(8*(j?7-j/32:7)+(k?k/32:0))+m;b.graphicOpacity=1;b.externalGraphic=k}}if(e=this.getElementsByTagNameNS(e,"*","hotSpot")[0])k=parseFloat(e.getAttribute("x")),j=parseFloat(e.getAttribute("y")),
l=e.getAttribute("xunits"),"pixels"==l?b.graphicXOffset=-k*h:"insetPixels"==l?b.graphicXOffset=-d+k*h:"fraction"==l&&(b.graphicXOffset=-d*k),e=e.getAttribute("yunits"),"pixels"==e?b.graphicYOffset=-i+j*h+1:"insetPixels"==e?b.graphicYOffset=-(j*h)+1:"fraction"==e&&(b.graphicYOffset=-i*(1-j)+1);b.graphicWidth=d;b.graphicHeight=i;break;case "balloonstyle":(e=OpenLayers.Util.getXmlNodeValue(e))&&(b.balloonStyle=e.replace(this.regExes.straightBracket,"${$1}"));break;case "labelstyle":if(d=this.parseProperty(e,
"*","color"),d=this.parseKmlColor(d))b.fontColor=d.color,b.fontOpacity=d.opacity}!b.strokeColor&&b.fillColor&&(b.strokeColor=b.fillColor);if((a=a.getAttribute("id"))&&b)b.id=a;return b},parseStyleMaps:function(a,b){for(var c=0,d=a.length;c<d;c++)for(var e=a[c],f=this.getElementsByTagNameNS(e,"*","Pair"),e=e.getAttribute("id"),g=0,h=f.length;g<h;g++){var i=f[g],j=this.parseProperty(i,"*","key");(i=this.parseProperty(i,"*","styleUrl"))&&"normal"==j&&(this.styles[(b.styleBaseUrl||"")+"#"+e]=this.styles[(b.styleBaseUrl||
"")+i])}},parseFeatures:function(a,b){for(var c=[],d=0,e=a.length;d<e;d++){var f=a[d],g=this.parseFeature.apply(this,[f]);if(g){this.extractStyles&&(g.attributes&&g.attributes.styleUrl)&&(g.style=this.getStyle(g.attributes.styleUrl,b));if(this.extractStyles){var h=this.getElementsByTagNameNS(f,"*","Style")[0];if(h&&(h=this.parseStyle(h)))g.style=OpenLayers.Util.extend(g.style,h)}if(this.extractTracks){if((f=this.getElementsByTagNameNS(f,this.namespaces.gx,"Track"))&&0<f.length)g={features:[],feature:g},
this.readNode(f[0],g),0<g.features.length&&c.push.apply(c,g.features)}else c.push(g)}else throw"Bad Placemark: "+d;}this.features=this.features.concat(c)},readers:{kml:{when:function(a,b){b.whens.push(OpenLayers.Date.parse(this.getChildValue(a)))},_trackPointAttribute:function(a,b){var c=a.nodeName.split(":").pop();b.attributes[c].push(this.getChildValue(a))}},gx:{Track:function(a,b){var c={whens:[],points:[],angles:[]};if(this.trackAttributes){var d;c.attributes={};for(var e=0,f=this.trackAttributes.length;e<
f;++e)d=this.trackAttributes[e],c.attributes[d]=[],d in this.readers.kml||(this.readers.kml[d]=this.readers.kml._trackPointAttribute)}this.readChildNodes(a,c);if(c.whens.length!==c.points.length)throw Error("gx:Track with unequal number of when ("+c.whens.length+") and gx:coord ("+c.points.length+") elements.");var g=0<c.angles.length;if(g&&c.whens.length!==c.angles.length)throw Error("gx:Track with unequal number of when ("+c.whens.length+") and gx:angles ("+c.angles.length+") elements.");for(var h,
i,e=0,f=c.whens.length;e<f;++e){h=b.feature.clone();h.fid=b.feature.fid||b.feature.id;i=c.points[e];h.geometry=i;"z"in i&&(h.attributes.altitude=i.z);this.internalProjection&&this.externalProjection&&h.geometry.transform(this.externalProjection,this.internalProjection);if(this.trackAttributes){i=0;for(var j=this.trackAttributes.length;i<j;++i)h.attributes[d]=c.attributes[this.trackAttributes[i]][e]}h.attributes.when=c.whens[e];h.attributes.trackId=b.feature.id;g&&(i=c.angles[e],h.attributes.heading=
parseFloat(i[0]),h.attributes.tilt=parseFloat(i[1]),h.attributes.roll=parseFloat(i[2]));b.features.push(h)}},coord:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(/\s+/),d=new OpenLayers.Geometry.Point(c[0],c[1]);2<c.length&&(d.z=parseFloat(c[2]));b.points.push(d)},angles:function(a,b){var c=this.getChildValue(a).replace(this.regExes.trimSpace,"").split(/\s+/);b.angles.push(c)}}},parseFeature:function(a){for(var b=["MultiGeometry","Polygon","LineString","Point"],
c,d,e,f=0,g=b.length;f<g;++f)if(c=b[f],this.internalns=a.namespaceURI?a.namespaceURI:this.kmlns,d=this.getElementsByTagNameNS(a,this.internalns,c),0<d.length){if(b=this.parseGeometry[c.toLowerCase()])e=b.apply(this,[d[0]]),this.internalProjection&&this.externalProjection&&e.transform(this.externalProjection,this.internalProjection);else throw new TypeError("Unsupported geometry type: "+c);break}var h;this.extractAttributes&&(h=this.parseAttributes(a));c=new OpenLayers.Feature.Vector(e,h);a=a.getAttribute("id")||
a.getAttribute("name");null!=a&&(c.fid=a);return c},getStyle:function(a,b){var c=OpenLayers.Util.removeTail(a),d=OpenLayers.Util.extend({},b);d.depth++;d.styleBaseUrl=c;!this.styles[a]&&!OpenLayers.String.startsWith(a,"#")&&d.depth<=this.maxDepth&&!this.fetched[c]&&(c=this.fetchLink(c))&&this.parseData(c,d);return OpenLayers.Util.extend({},this.styles[a])},parseGeometry:{point:function(a){var b=this.getElementsByTagNameNS(a,this.internalns,"coordinates"),a=[];if(0<b.length)var c=b[0].firstChild.nodeValue,
c=c.replace(this.regExes.removeSpace,""),a=c.split(",");b=null;if(1<a.length)2==a.length&&(a[2]=null),b=new OpenLayers.Geometry.Point(a[0],a[1],a[2]);else throw"Bad coordinate string: "+c;return b},linestring:function(a,b){var c=this.getElementsByTagNameNS(a,this.internalns,"coordinates"),d=null;if(0<c.length){for(var c=this.getChildValue(c[0]),c=c.replace(this.regExes.trimSpace,""),c=c.replace(this.regExes.trimComma,","),d=c.split(this.regExes.splitSpace),e=d.length,f=Array(e),g,h,i=0;i<e;++i)if(g=
d[i].split(","),h=g.length,1<h)2==g.length&&(g[2]=null),f[i]=new OpenLayers.Geometry.Point(g[0],g[1],g[2]);else throw"Bad LineString point coordinates: "+d[i];if(e)d=b?new OpenLayers.Geometry.LinearRing(f):new OpenLayers.Geometry.LineString(f);else throw"Bad LineString coordinates: "+c;}return d},polygon:function(a){var a=this.getElementsByTagNameNS(a,this.internalns,"LinearRing"),b=a.length,c=Array(b);if(0<b)for(var d=0,e=a.length;d<e;++d)if(b=this.parseGeometry.linestring.apply(this,[a[d],!0]))c[d]=
b;else throw"Bad LinearRing geometry: "+d;return new OpenLayers.Geometry.Polygon(c)},multigeometry:function(a){for(var b,c=[],d=a.childNodes,e=0,f=d.length;e<f;++e)a=d[e],1==a.nodeType&&(b=this.parseGeometry[(a.prefix?a.nodeName.split(":")[1]:a.nodeName).toLowerCase()])&&c.push(b.apply(this,[a]));return new OpenLayers.Geometry.Collection(c)}},parseAttributes:function(a){var b={},c=a.getElementsByTagName("ExtendedData");c.length&&(b=this.parseExtendedData(c[0]));for(var d,e,f,a=a.childNodes,c=0,g=
a.length;c<g;++c)if(d=a[c],1==d.nodeType&&(e=d.childNodes,1<=e.length&&3>=e.length)){switch(e.length){case 1:f=e[0];break;case 2:f=e[0];e=e[1];f=3==f.nodeType||4==f.nodeType?f:e;break;default:f=e[1]}if(3==f.nodeType||4==f.nodeType)if(d=d.prefix?d.nodeName.split(":")[1]:d.nodeName,f=OpenLayers.Util.getXmlNodeValue(f))f=f.replace(this.regExes.trimSpace,""),b[d]=f}return b},parseExtendedData:function(a){var b={},c,d,e,f,g=a.getElementsByTagName("Data");c=0;for(d=g.length;c<d;c++){e=g[c];f=e.getAttribute("name");
var h={},i=e.getElementsByTagName("value");i.length&&(h.value=this.getChildValue(i[0]));this.kvpAttributes?b[f]=h.value:(e=e.getElementsByTagName("displayName"),e.length&&(h.displayName=this.getChildValue(e[0])),b[f]=h)}a=a.getElementsByTagName("SimpleData");c=0;for(d=a.length;c<d;c++)h={},e=a[c],f=e.getAttribute("name"),h.value=this.getChildValue(e),this.kvpAttributes?b[f]=h.value:(h.displayName=f,b[f]=h);return b},parseProperty:function(a,b,c){var d,a=this.getElementsByTagNameNS(a,b,c);try{d=OpenLayers.Util.getXmlNodeValue(a[0])}catch(e){d=
null}return d},write:function(a){OpenLayers.Util.isArray(a)||(a=[a]);for(var b=this.createElementNS(this.kmlns,"kml"),c=this.createFolderXML(),d=0,e=a.length;d<e;++d)c.appendChild(this.createPlacemarkXML(a[d]));b.appendChild(c);return OpenLayers.Format.XML.prototype.write.apply(this,[b])},createFolderXML:function(){var a=this.createElementNS(this.kmlns,"Folder");if(this.foldersName){var b=this.createElementNS(this.kmlns,"name"),c=this.createTextNode(this.foldersName);b.appendChild(c);a.appendChild(b)}this.foldersDesc&&
(b=this.createElementNS(this.kmlns,"description"),c=this.createTextNode(this.foldersDesc),b.appendChild(c),a.appendChild(b));return a},createPlacemarkXML:function(a){var b=this.createElementNS(this.kmlns,"name");b.appendChild(this.createTextNode(a.style&&a.style.label?a.style.label:a.attributes.name||a.id));var c=this.createElementNS(this.kmlns,"description");c.appendChild(this.createTextNode(a.attributes.description||this.placemarksDesc));var d=this.createElementNS(this.kmlns,"Placemark");null!=
a.fid&&d.setAttribute("id",a.fid);d.appendChild(b);d.appendChild(c);b=this.buildGeometryNode(a.geometry);d.appendChild(b);a.attributes&&(a=this.buildExtendedData(a.attributes))&&d.appendChild(a);return d},buildGeometryNode:function(a){var b=a.CLASS_NAME,b=this.buildGeometry[b.substring(b.lastIndexOf(".")+1).toLowerCase()],c=null;b&&(c=b.apply(this,[a]));return c},buildGeometry:{point:function(a){var b=this.createElementNS(this.kmlns,"Point");b.appendChild(this.buildCoordinatesNode(a));return b},multipoint:function(a){return this.buildGeometry.collection.apply(this,
[a])},linestring:function(a){var b=this.createElementNS(this.kmlns,"LineString");b.appendChild(this.buildCoordinatesNode(a));return b},multilinestring:function(a){return this.buildGeometry.collection.apply(this,[a])},linearring:function(a){var b=this.createElementNS(this.kmlns,"LinearRing");b.appendChild(this.buildCoordinatesNode(a));return b},polygon:function(a){for(var b=this.createElementNS(this.kmlns,"Polygon"),a=a.components,c,d,e=0,f=a.length;e<f;++e)c=0==e?"outerBoundaryIs":"innerBoundaryIs",
c=this.createElementNS(this.kmlns,c),d=this.buildGeometry.linearring.apply(this,[a[e]]),c.appendChild(d),b.appendChild(c);return b},multipolygon:function(a){return this.buildGeometry.collection.apply(this,[a])},collection:function(a){for(var b=this.createElementNS(this.kmlns,"MultiGeometry"),c,d=0,e=a.components.length;d<e;++d)(c=this.buildGeometryNode.apply(this,[a.components[d]]))&&b.appendChild(c);return b}},buildCoordinatesNode:function(a){var b=this.createElementNS(this.kmlns,"coordinates"),
c;if(c=a.components){for(var d=c.length,e=Array(d),f=0;f<d;++f)a=c[f],e[f]=this.buildCoordinates(a);c=e.join(" ")}else c=this.buildCoordinates(a);c=this.createTextNode(c);b.appendChild(c);return b},buildCoordinates:function(a){this.internalProjection&&this.externalProjection&&(a=a.clone(),a.transform(this.internalProjection,this.externalProjection));return a.x+","+a.y},buildExtendedData:function(a){var b=this.createElementNS(this.kmlns,"ExtendedData"),c;for(c in a)if(a[c]&&"name"!=c&&"description"!=
c&&"styleUrl"!=c){var d=this.createElementNS(this.kmlns,"Data");d.setAttribute("name",c);var e=this.createElementNS(this.kmlns,"value");if("object"==typeof a[c]){if(a[c].value&&e.appendChild(this.createTextNode(a[c].value)),a[c].displayName){var f=this.createElementNS(this.kmlns,"displayName");f.appendChild(this.getXMLDoc().createCDATASection(a[c].displayName));d.appendChild(f)}}else e.appendChild(this.createTextNode(a[c]));d.appendChild(e);b.appendChild(d)}return this.isSimpleContent(b)?null:b},
CLASS_NAME:"OpenLayers.Format.KML"});OpenLayers.Popup=OpenLayers.Class({events:null,id:"",lonlat:null,div:null,contentSize:null,size:null,contentHTML:null,backgroundColor:"",opacity:"",border:"",contentDiv:null,groupDiv:null,closeDiv:null,autoSize:!1,minSize:null,maxSize:null,displayClass:"olPopup",contentDisplayClass:"olPopupContent",padding:0,disableFirefoxOverflowHack:!1,fixPadding:function(){"number"==typeof this.padding&&(this.padding=new OpenLayers.Bounds(this.padding,this.padding,this.padding,this.padding))},panMapIfOutOfView:!1,
keepInMap:!1,closeOnMove:!1,map:null,initialize:function(a,b,c,d,e,f){null==a&&(a=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_"));this.id=a;this.lonlat=b;this.contentSize=null!=c?c:new OpenLayers.Size(OpenLayers.Popup.WIDTH,OpenLayers.Popup.HEIGHT);null!=d&&(this.contentHTML=d);this.backgroundColor=OpenLayers.Popup.COLOR;this.opacity=OpenLayers.Popup.OPACITY;this.border=OpenLayers.Popup.BORDER;this.div=OpenLayers.Util.createDiv(this.id,null,null,null,null,null,"hidden");this.div.className=this.displayClass;
this.groupDiv=OpenLayers.Util.createDiv(this.id+"_GroupDiv",null,null,null,"relative",null,"hidden");a=this.div.id+"_contentDiv";this.contentDiv=OpenLayers.Util.createDiv(a,null,this.contentSize.clone(),null,"relative");this.contentDiv.className=this.contentDisplayClass;this.groupDiv.appendChild(this.contentDiv);this.div.appendChild(this.groupDiv);e&&this.addCloseBox(f);this.registerEvents()},destroy:function(){this.border=this.opacity=this.backgroundColor=this.contentHTML=this.size=this.lonlat=this.id=
null;this.closeOnMove&&this.map&&this.map.events.unregister("movestart",this,this.hide);this.events.destroy();this.events=null;this.closeDiv&&(OpenLayers.Event.stopObservingElement(this.closeDiv),this.groupDiv.removeChild(this.closeDiv));this.closeDiv=null;this.div.removeChild(this.groupDiv);this.groupDiv=null;null!=this.map&&this.map.removePopup(this);this.panMapIfOutOfView=this.padding=this.maxSize=this.minSize=this.autoSize=this.div=this.map=null},draw:function(a){null==a&&null!=this.lonlat&&null!=
this.map&&(a=this.map.getLayerPxFromLonLat(this.lonlat));this.closeOnMove&&this.map.events.register("movestart",this,this.hide);!this.disableFirefoxOverflowHack&&"firefox"==OpenLayers.BROWSER_NAME&&(this.map.events.register("movestart",this,function(){var a=document.defaultView.getComputedStyle(this.contentDiv,null).getPropertyValue("overflow");"hidden"!=a&&(this.contentDiv._oldOverflow=a,this.contentDiv.style.overflow="hidden")}),this.map.events.register("moveend",this,function(){var a=this.contentDiv._oldOverflow;
a&&(this.contentDiv.style.overflow=a,this.contentDiv._oldOverflow=null)}));this.moveTo(a);!this.autoSize&&!this.size&&this.setSize(this.contentSize);this.setBackgroundColor();this.setOpacity();this.setBorder();this.setContentHTML();this.panMapIfOutOfView&&this.panIntoView();return this.div},updatePosition:function(){if(this.lonlat&&this.map){var a=this.map.getLayerPxFromLonLat(this.lonlat);a&&this.moveTo(a)}},moveTo:function(a){null!=a&&null!=this.div&&(this.div.style.left=a.x+"px",this.div.style.top=
a.y+"px")},visible:function(){return OpenLayers.Element.visible(this.div)},toggle:function(){this.visible()?this.hide():this.show()},show:function(){this.div.style.display="";this.panMapIfOutOfView&&this.panIntoView()},hide:function(){this.div.style.display="none"},setSize:function(a){this.size=a.clone();var b=this.getContentDivPadding(),c=b.left+b.right,d=b.top+b.bottom;this.fixPadding();c+=this.padding.left+this.padding.right;d+=this.padding.top+this.padding.bottom;if(this.closeDiv)var e=parseInt(this.closeDiv.style.width),
c=c+(e+b.right);this.size.w+=c;this.size.h+=d;"msie"==OpenLayers.BROWSER_NAME&&(this.contentSize.w+=b.left+b.right,this.contentSize.h+=b.bottom+b.top);null!=this.div&&(this.div.style.width=this.size.w+"px",this.div.style.height=this.size.h+"px");null!=this.contentDiv&&(this.contentDiv.style.width=a.w+"px",this.contentDiv.style.height=a.h+"px")},updateSize:function(){var a="<div class='"+this.contentDisplayClass+"'>"+this.contentDiv.innerHTML+"</div>",b=this.map?this.map.div:document.body,c=OpenLayers.Util.getRenderedDimensions(a,
null,{displayClass:this.displayClass,containerElement:b}),d=this.getSafeContentSize(c),e=null;d.equals(c)?e=c:(c={w:d.w<c.w?d.w:null,h:d.h<c.h?d.h:null},c.w&&c.h?e=d:(a=OpenLayers.Util.getRenderedDimensions(a,c,{displayClass:this.contentDisplayClass,containerElement:b}),"hidden"!=OpenLayers.Element.getStyle(this.contentDiv,"overflow")&&a.equals(d)&&(d=OpenLayers.Util.getScrollbarWidth(),c.w?a.h+=d:a.w+=d),e=this.getSafeContentSize(a)));this.setSize(e)},setBackgroundColor:function(a){void 0!=a&&(this.backgroundColor=
a);null!=this.div&&(this.div.style.backgroundColor=this.backgroundColor)},setOpacity:function(a){void 0!=a&&(this.opacity=a);null!=this.div&&(this.div.style.opacity=this.opacity,this.div.style.filter="alpha(opacity="+100*this.opacity+")")},setBorder:function(a){void 0!=a&&(this.border=a);null!=this.div&&(this.div.style.border=this.border)},setContentHTML:function(a){null!=a&&(this.contentHTML=a);null!=this.contentDiv&&(null!=this.contentHTML&&this.contentHTML!=this.contentDiv.innerHTML)&&(this.contentDiv.innerHTML=
this.contentHTML,this.autoSize&&(this.registerImageListeners(),this.updateSize()))},registerImageListeners:function(){for(var a=function(){null!==this.popup.id&&(this.popup.updateSize(),this.popup.visible()&&this.popup.panMapIfOutOfView&&this.popup.panIntoView(),OpenLayers.Event.stopObserving(this.img,"load",this.img._onImageLoad))},b=this.contentDiv.getElementsByTagName("img"),c=0,d=b.length;c<d;c++){var e=b[c];if(0==e.width||0==e.height)e._onImgLoad=OpenLayers.Function.bind(a,{popup:this,img:e}),
OpenLayers.Event.observe(e,"load",e._onImgLoad)}},getSafeContentSize:function(a){var a=a.clone(),b=this.getContentDivPadding(),c=b.left+b.right,d=b.top+b.bottom;this.fixPadding();c+=this.padding.left+this.padding.right;d+=this.padding.top+this.padding.bottom;if(this.closeDiv)var e=parseInt(this.closeDiv.style.width),c=c+(e+b.right);this.minSize&&(a.w=Math.max(a.w,this.minSize.w-c),a.h=Math.max(a.h,this.minSize.h-d));this.maxSize&&(a.w=Math.min(a.w,this.maxSize.w-c),a.h=Math.min(a.h,this.maxSize.h-
d));if(this.map&&this.map.size){e=b=0;if(this.keepInMap&&!this.panMapIfOutOfView)switch(e=this.map.getPixelFromLonLat(this.lonlat),this.relativePosition){case "tr":b=e.x;e=this.map.size.h-e.y;break;case "tl":b=this.map.size.w-e.x;e=this.map.size.h-e.y;break;case "bl":b=this.map.size.w-e.x;e=e.y;break;case "br":b=e.x;e=e.y;break;default:b=e.x,e=this.map.size.h-e.y}d=this.map.size.h-this.map.paddingForPopups.top-this.map.paddingForPopups.bottom-d-e;a.w=Math.min(a.w,this.map.size.w-this.map.paddingForPopups.left-
this.map.paddingForPopups.right-c-b);a.h=Math.min(a.h,d)}return a},getContentDivPadding:function(){var a=this._contentDivPadding;if(!a&&(null==this.div.parentNode&&(this.div.style.display="none",document.body.appendChild(this.div)),this._contentDivPadding=a=new OpenLayers.Bounds(OpenLayers.Element.getStyle(this.contentDiv,"padding-left"),OpenLayers.Element.getStyle(this.contentDiv,"padding-bottom"),OpenLayers.Element.getStyle(this.contentDiv,"padding-right"),OpenLayers.Element.getStyle(this.contentDiv,
"padding-top")),this.div.parentNode==document.body))document.body.removeChild(this.div),this.div.style.display="";return a},addCloseBox:function(a){this.closeDiv=OpenLayers.Util.createDiv(this.id+"_close",null,{w:17,h:17});this.closeDiv.className="olPopupCloseBox";var b=this.getContentDivPadding();this.closeDiv.style.right=b.right+"px";this.closeDiv.style.top=b.top+"px";this.groupDiv.appendChild(this.closeDiv);a=a||function(a){this.hide();OpenLayers.Event.stop(a)};OpenLayers.Event.observe(this.closeDiv,
"touchend",OpenLayers.Function.bindAsEventListener(a,this));OpenLayers.Event.observe(this.closeDiv,"click",OpenLayers.Function.bindAsEventListener(a,this))},panIntoView:function(){var a=this.map.getSize(),b=this.map.getViewPortPxFromLayerPx(new OpenLayers.Pixel(parseInt(this.div.style.left),parseInt(this.div.style.top))),c=b.clone();b.x<this.map.paddingForPopups.left?c.x=this.map.paddingForPopups.left:b.x+this.size.w>a.w-this.map.paddingForPopups.right&&(c.x=a.w-this.map.paddingForPopups.right-this.size.w);
b.y<this.map.paddingForPopups.top?c.y=this.map.paddingForPopups.top:b.y+this.size.h>a.h-this.map.paddingForPopups.bottom&&(c.y=a.h-this.map.paddingForPopups.bottom-this.size.h);this.map.pan(b.x-c.x,b.y-c.y)},registerEvents:function(){this.events=new OpenLayers.Events(this,this.div,null,!0);this.events.on({mousedown:this.onmousedown,mousemove:this.onmousemove,mouseup:this.onmouseup,click:this.onclick,mouseout:this.onmouseout,dblclick:this.ondblclick,touchstart:function(a){OpenLayers.Event.stop(a,!0)},
scope:this})},onmousedown:function(a){this.mousedown=!0;OpenLayers.Event.stop(a,!0)},onmousemove:function(a){this.mousedown&&OpenLayers.Event.stop(a,!0)},onmouseup:function(a){this.mousedown&&(this.mousedown=!1,OpenLayers.Event.stop(a,!0))},onclick:function(a){OpenLayers.Event.stop(a,!0)},onmouseout:function(){this.mousedown=!1},ondblclick:function(a){OpenLayers.Event.stop(a,!0)},CLASS_NAME:"OpenLayers.Popup"});OpenLayers.Popup.WIDTH=200;OpenLayers.Popup.HEIGHT=200;OpenLayers.Popup.COLOR="white";
OpenLayers.Popup.OPACITY=1;OpenLayers.Popup.BORDER="0px";OpenLayers.Popup.Anchored=OpenLayers.Class(OpenLayers.Popup,{relativePosition:null,keepInMap:!0,anchor:null,initialize:function(a,b,c,d,e,f,g){OpenLayers.Popup.prototype.initialize.apply(this,[a,b,c,d,f,g]);this.anchor=null!=e?e:{size:new OpenLayers.Size(0,0),offset:new OpenLayers.Pixel(0,0)}},destroy:function(){this.relativePosition=this.anchor=null;OpenLayers.Popup.prototype.destroy.apply(this,arguments)},show:function(){this.updatePosition();OpenLayers.Popup.prototype.show.apply(this,arguments)},
moveTo:function(a){var b=this.relativePosition;this.relativePosition=this.calculateRelativePosition(a);a=this.calculateNewPx(a);OpenLayers.Popup.prototype.moveTo.apply(this,Array(a));this.relativePosition!=b&&this.updateRelativePosition()},setSize:function(a){OpenLayers.Popup.prototype.setSize.apply(this,arguments);this.lonlat&&this.map&&this.moveTo(this.map.getLayerPxFromLonLat(this.lonlat))},calculateRelativePosition:function(a){a=this.map.getLonLatFromLayerPx(a);a=this.map.getExtent().determineQuadrant(a);
return OpenLayers.Bounds.oppositeQuadrant(a)},updateRelativePosition:function(){},calculateNewPx:function(a){var a=a.offset(this.anchor.offset),b=this.size||this.contentSize,c="t"==this.relativePosition.charAt(0);a.y+=c?-b.h:this.anchor.size.h;c="l"==this.relativePosition.charAt(1);a.x+=c?-b.w:this.anchor.size.w;return a},CLASS_NAME:"OpenLayers.Popup.Anchored"});/*
 Apache 2 

 Contains portions of Rico <http://openrico.org/>

 Copyright 2005 Sabre Airline Solutions  

 Licensed under the Apache License, Version 2.0 (the "License"); you
 may not use this file except in compliance with the License. You
 may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0  

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 implied. See the License for the specific language governing
 permissions and limitations under the License. 
*/
OpenLayers.Console.warn("OpenLayers.Rico is deprecated");OpenLayers.Rico=OpenLayers.Rico||{};
OpenLayers.Rico.Color=OpenLayers.Class({initialize:function(a,b,c){this.rgb={r:a,g:b,b:c}},setRed:function(a){this.rgb.r=a},setGreen:function(a){this.rgb.g=a},setBlue:function(a){this.rgb.b=a},setHue:function(a){var b=this.asHSB();b.h=a;this.rgb=OpenLayers.Rico.Color.HSBtoRGB(b.h,b.s,b.b)},setSaturation:function(a){var b=this.asHSB();b.s=a;this.rgb=OpenLayers.Rico.Color.HSBtoRGB(b.h,b.s,b.b)},setBrightness:function(a){var b=this.asHSB();b.b=a;this.rgb=OpenLayers.Rico.Color.HSBtoRGB(b.h,b.s,b.b)},
darken:function(a){var b=this.asHSB();this.rgb=OpenLayers.Rico.Color.HSBtoRGB(b.h,b.s,Math.max(b.b-a,0))},brighten:function(a){var b=this.asHSB();this.rgb=OpenLayers.Rico.Color.HSBtoRGB(b.h,b.s,Math.min(b.b+a,1))},blend:function(a){this.rgb.r=Math.floor((this.rgb.r+a.rgb.r)/2);this.rgb.g=Math.floor((this.rgb.g+a.rgb.g)/2);this.rgb.b=Math.floor((this.rgb.b+a.rgb.b)/2)},isBright:function(){this.asHSB();return 0.5<this.asHSB().b},isDark:function(){return!this.isBright()},asRGB:function(){return"rgb("+
this.rgb.r+","+this.rgb.g+","+this.rgb.b+")"},asHex:function(){return"#"+this.rgb.r.toColorPart()+this.rgb.g.toColorPart()+this.rgb.b.toColorPart()},asHSB:function(){return OpenLayers.Rico.Color.RGBtoHSB(this.rgb.r,this.rgb.g,this.rgb.b)},toString:function(){return this.asHex()}});
OpenLayers.Rico.Color.createFromHex=function(a){if(4==a.length)for(var b=a,a="#",c=1;4>c;c++)a+=b.charAt(c)+b.charAt(c);0==a.indexOf("#")&&(a=a.substring(1));b=a.substring(0,2);c=a.substring(2,4);a=a.substring(4,6);return new OpenLayers.Rico.Color(parseInt(b,16),parseInt(c,16),parseInt(a,16))};
OpenLayers.Rico.Color.createColorFromBackground=function(a){var b=OpenLayers.Element.getStyle(OpenLayers.Util.getElement(a),"backgroundColor");return"transparent"==b&&a.parentNode?OpenLayers.Rico.Color.createColorFromBackground(a.parentNode):null==b?new OpenLayers.Rico.Color(255,255,255):0==b.indexOf("rgb(")?(a=b.substring(4,b.length-1).split(","),new OpenLayers.Rico.Color(parseInt(a[0]),parseInt(a[1]),parseInt(a[2]))):0==b.indexOf("#")?OpenLayers.Rico.Color.createFromHex(b):new OpenLayers.Rico.Color(255,
255,255)};
OpenLayers.Rico.Color.HSBtoRGB=function(a,b,c){var d=0,e=0,f=0;if(0==b)f=e=d=parseInt(255*c+0.5);else{var a=6*(a-Math.floor(a)),g=a-Math.floor(a),h=c*(1-b),i=c*(1-b*g),b=c*(1-b*(1-g));switch(parseInt(a)){case 0:d=255*c+0.5;e=255*b+0.5;f=255*h+0.5;break;case 1:d=255*i+0.5;e=255*c+0.5;f=255*h+0.5;break;case 2:d=255*h+0.5;e=255*c+0.5;f=255*b+0.5;break;case 3:d=255*h+0.5;e=255*i+0.5;f=255*c+0.5;break;case 4:d=255*b+0.5;e=255*h+0.5;f=255*c+0.5;break;case 5:d=255*c+0.5,e=255*h+0.5,f=255*i+0.5}}return{r:parseInt(d),g:parseInt(e),
b:parseInt(f)}};OpenLayers.Rico.Color.RGBtoHSB=function(a,b,c){var d,e=a>b?a:b;c>e&&(e=c);var f=a<b?a:b;c<f&&(f=c);d=0!=e?(e-f)/e:0;if(0==d)a=0;else{var g=(e-a)/(e-f),h=(e-b)/(e-f),c=(e-c)/(e-f),a=(a==e?c-h:b==e?2+g-c:4+h-g)/6;0>a&&(a+=1)}return{h:a,s:d,b:e/255}};OpenLayers.Console.warn("OpenLayers.Rico is deprecated");OpenLayers.Rico=OpenLayers.Rico||{};
OpenLayers.Rico.Corner={round:function(a,b){a=OpenLayers.Util.getElement(a);this._setOptions(b);var c=this.options.color;"fromElement"==this.options.color&&(c=this._background(a));var d=this.options.bgColor;"fromParent"==this.options.bgColor&&(d=this._background(a.offsetParent));this._roundCornersImpl(a,c,d)},changeColor:function(a,b){a.style.backgroundColor=b;for(var c=a.parentNode.getElementsByTagName("span"),d=0;d<c.length;d++)c[d].style.backgroundColor=b},changeOpacity:function(a,b){var c="alpha(opacity="+
100*b+")";a.style.opacity=b;a.style.filter=c;for(var d=a.parentNode.getElementsByTagName("span"),e=0;e<d.length;e++)d[e].style.opacity=b,d[e].style.filter=c},reRound:function(a,b){var c=a.parentNode.childNodes[2];a.parentNode.removeChild(a.parentNode.childNodes[0]);a.parentNode.removeChild(c);this.round(a.parentNode,b)},_roundCornersImpl:function(a,b,c){this.options.border&&this._renderBorder(a,c);this._isTopRounded()&&this._roundTopCorners(a,b,c);this._isBottomRounded()&&this._roundBottomCorners(a,
b,c)},_renderBorder:function(a,b){var c="1px solid "+this._borderColor(b);a.innerHTML="<div "+("style='border-left: "+c+";"+("border-right: "+c)+"'")+">"+a.innerHTML+"</div>"},_roundTopCorners:function(a,b,c){for(var d=this._createCorner(c),e=0;e<this.options.numSlices;e++)d.appendChild(this._createCornerSlice(b,c,e,"top"));a.style.paddingTop=0;a.insertBefore(d,a.firstChild)},_roundBottomCorners:function(a,b,c){for(var d=this._createCorner(c),e=this.options.numSlices-1;0<=e;e--)d.appendChild(this._createCornerSlice(b,
c,e,"bottom"));a.style.paddingBottom=0;a.appendChild(d)},_createCorner:function(a){var b=document.createElement("div");b.style.backgroundColor=this._isTransparent()?"transparent":a;return b},_createCornerSlice:function(a,b,c,d){var e=document.createElement("span"),f=e.style;f.backgroundColor=a;f.display="block";f.height="1px";f.overflow="hidden";f.fontSize="1px";a=this._borderColor(a,b);this.options.border&&0==c?(f.borderTopStyle="solid",f.borderTopWidth="1px",f.borderLeftWidth="0px",f.borderRightWidth=
"0px",f.borderBottomWidth="0px",f.height="0px",f.borderColor=a):a&&(f.borderColor=a,f.borderStyle="solid",f.borderWidth="0px 1px");!this.options.compact&&c==this.options.numSlices-1&&(f.height="2px");this._setMargin(e,c,d);this._setBorder(e,c,d);return e},_setOptions:function(a){this.options={corners:"all",color:"fromElement",bgColor:"fromParent",blend:!0,border:!1,compact:!1};OpenLayers.Util.extend(this.options,a||{});this.options.numSlices=this.options.compact?2:4;this._isTransparent()&&(this.options.blend=
!1)},_whichSideTop:function(){return this._hasString(this.options.corners,"all","top")||0<=this.options.corners.indexOf("tl")&&0<=this.options.corners.indexOf("tr")?"":0<=this.options.corners.indexOf("tl")?"left":0<=this.options.corners.indexOf("tr")?"right":""},_whichSideBottom:function(){return this._hasString(this.options.corners,"all","bottom")||0<=this.options.corners.indexOf("bl")&&0<=this.options.corners.indexOf("br")?"":0<=this.options.corners.indexOf("bl")?"left":0<=this.options.corners.indexOf("br")?
"right":""},_borderColor:function(a,b){return"transparent"==a?b:this.options.border?this.options.border:this.options.blend?this._blend(b,a):""},_setMargin:function(a,b,c){b=this._marginSize(b);c="top"==c?this._whichSideTop():this._whichSideBottom();"left"==c?(a.style.marginLeft=b+"px",a.style.marginRight="0px"):"right"==c?(a.style.marginRight=b+"px",a.style.marginLeft="0px"):(a.style.marginLeft=b+"px",a.style.marginRight=b+"px")},_setBorder:function(a,b,c){b=this._borderSize(b);c="top"==c?this._whichSideTop():
this._whichSideBottom();"left"==c?(a.style.borderLeftWidth=b+"px",a.style.borderRightWidth="0px"):"right"==c?(a.style.borderRightWidth=b+"px",a.style.borderLeftWidth="0px"):(a.style.borderLeftWidth=b+"px",a.style.borderRightWidth=b+"px");!1!=this.options.border&&(a.style.borderLeftWidth=b+"px",a.style.borderRightWidth=b+"px")},_marginSize:function(a){if(this._isTransparent())return 0;var b=[5,3,2,1],c=[3,2,1,0],d=[2,1],e=[1,0];return this.options.compact&&this.options.blend?e[a]:this.options.compact?
d[a]:this.options.blend?c[a]:b[a]},_borderSize:function(a){var b=[5,3,2,1],c=[2,1,1,1],d=[1,0],e=[0,2,0,0];return this.options.compact&&(this.options.blend||this._isTransparent())?1:this.options.compact?d[a]:this.options.blend?c[a]:this.options.border?e[a]:this._isTransparent()?b[a]:0},_hasString:function(a){for(var b=1;b<arguments.length;b++)if(0<=a.indexOf(arguments[b]))return!0;return!1},_blend:function(a,b){var c=OpenLayers.Rico.Color.createFromHex(a);c.blend(OpenLayers.Rico.Color.createFromHex(b));
return c},_background:function(a){try{return OpenLayers.Rico.Color.createColorFromBackground(a).asHex()}catch(b){return"#ffffff"}},_isTransparent:function(){return"transparent"==this.options.color},_isTopRounded:function(){return this._hasString(this.options.corners,"all","top","tl","tr")},_isBottomRounded:function(){return this._hasString(this.options.corners,"all","bottom","bl","br")},_hasSingleTextChild:function(a){return 1==a.childNodes.length&&3==a.childNodes[0].nodeType}};OpenLayers.Popup.AnchoredBubble=OpenLayers.Class(OpenLayers.Popup.Anchored,{rounded:!1,initialize:function(a,b,c,d,e,f,g){OpenLayers.Console.warn("AnchoredBubble is deprecated");this.padding=new OpenLayers.Bounds(0,OpenLayers.Popup.AnchoredBubble.CORNER_SIZE,0,OpenLayers.Popup.AnchoredBubble.CORNER_SIZE);OpenLayers.Popup.Anchored.prototype.initialize.apply(this,arguments)},draw:function(a){OpenLayers.Popup.Anchored.prototype.draw.apply(this,arguments);this.setContentHTML();this.setBackgroundColor();
this.setOpacity();return this.div},updateRelativePosition:function(){this.setRicoCorners()},setSize:function(a){OpenLayers.Popup.Anchored.prototype.setSize.apply(this,arguments);this.setRicoCorners()},setBackgroundColor:function(a){void 0!=a&&(this.backgroundColor=a);null!=this.div&&null!=this.contentDiv&&(this.div.style.background="transparent",OpenLayers.Rico.Corner.changeColor(this.groupDiv,this.backgroundColor))},setOpacity:function(a){OpenLayers.Popup.Anchored.prototype.setOpacity.call(this,
a);null!=this.div&&null!=this.groupDiv&&OpenLayers.Rico.Corner.changeOpacity(this.groupDiv,this.opacity)},setBorder:function(){this.border=0},setRicoCorners:function(){var a={corners:this.getCornersToRound(this.relativePosition),color:this.backgroundColor,bgColor:"transparent",blend:!1};this.rounded?(OpenLayers.Rico.Corner.reRound(this.groupDiv,a),this.setBackgroundColor(),this.setOpacity()):(OpenLayers.Rico.Corner.round(this.div,a),this.rounded=!0)},getCornersToRound:function(){var a=["tl","tr",
"bl","br"],b=OpenLayers.Bounds.oppositeQuadrant(this.relativePosition);OpenLayers.Util.removeItem(a,b);return a.join(" ")},CLASS_NAME:"OpenLayers.Popup.AnchoredBubble"});OpenLayers.Popup.AnchoredBubble.CORNER_SIZE=5;OpenLayers.Protocol.WFS.v1=OpenLayers.Class(OpenLayers.Protocol,{version:null,srsName:"EPSG:4326",featureType:null,featureNS:null,geometryName:"the_geom",schema:null,featurePrefix:"feature",formatOptions:null,readFormat:null,readOptions:null,initialize:function(a){OpenLayers.Protocol.prototype.initialize.apply(this,[a]);a.format||(this.format=OpenLayers.Format.WFST(OpenLayers.Util.extend({version:this.version,featureType:this.featureType,featureNS:this.featureNS,featurePrefix:this.featurePrefix,geometryName:this.geometryName,
srsName:this.srsName,schema:this.schema},this.formatOptions)));!a.geometryName&&1<parseFloat(this.format.version)&&this.setGeometryName(null)},destroy:function(){this.options&&!this.options.format&&this.format.destroy();this.format=null;OpenLayers.Protocol.prototype.destroy.apply(this)},read:function(a){OpenLayers.Protocol.prototype.read.apply(this,arguments);a=OpenLayers.Util.extend({},a);OpenLayers.Util.applyDefaults(a,this.options||{});var b=new OpenLayers.Protocol.Response({requestType:"read"}),
c=OpenLayers.Format.XML.prototype.write.apply(this.format,[this.format.writeNode("wfs:GetFeature",a)]);b.priv=OpenLayers.Request.POST({url:a.url,callback:this.createCallback(this.handleRead,b,a),params:a.params,headers:a.headers,data:c});return b},setFeatureType:function(a){this.featureType=a;this.format.featureType=a},setGeometryName:function(a){this.geometryName=a;this.format.geometryName=a},handleRead:function(a,b){b=OpenLayers.Util.extend({},b);OpenLayers.Util.applyDefaults(b,this.options);if(b.callback){var c=
a.priv;200<=c.status&&300>c.status?(c=this.parseResponse(c,b.readOptions))&&!1!==c.success?(b.readOptions&&"object"==b.readOptions.output?OpenLayers.Util.extend(a,c):a.features=c,a.code=OpenLayers.Protocol.Response.SUCCESS):(a.code=OpenLayers.Protocol.Response.FAILURE,a.error=c):a.code=OpenLayers.Protocol.Response.FAILURE;b.callback.call(b.scope,a)}},parseResponse:function(a,b){var c=a.responseXML;if(!c||!c.documentElement)c=a.responseText;if(!c||0>=c.length)return null;c=null!==this.readFormat?this.readFormat.read(c):
this.format.read(c,b);if(!this.featureNS){var d=this.readFormat||this.format;this.featureNS=d.featureNS;d.autoConfig=!1;this.geometryName||this.setGeometryName(d.geometryName)}return c},commit:function(a,b){b=OpenLayers.Util.extend({},b);OpenLayers.Util.applyDefaults(b,this.options);var c=new OpenLayers.Protocol.Response({requestType:"commit",reqFeatures:a});c.priv=OpenLayers.Request.POST({url:b.url,headers:b.headers,data:this.format.write(a,b),callback:this.createCallback(this.handleCommit,c,b)});
return c},handleCommit:function(a,b){if(b.callback){var c=a.priv,d=c.responseXML;if(!d||!d.documentElement)d=c.responseText;c=this.format.read(d)||{};a.insertIds=c.insertIds||[];c.success?a.code=OpenLayers.Protocol.Response.SUCCESS:(a.code=OpenLayers.Protocol.Response.FAILURE,a.error=c);b.callback.call(b.scope,a)}},filterDelete:function(a,b){b=OpenLayers.Util.extend({},b);OpenLayers.Util.applyDefaults(b,this.options);new OpenLayers.Protocol.Response({requestType:"commit"});var c=this.format.createElementNSPlus("wfs:Transaction",
{attributes:{service:"WFS",version:this.version}}),d=this.format.createElementNSPlus("wfs:Delete",{attributes:{typeName:(b.featureNS?this.featurePrefix+":":"")+b.featureType}});b.featureNS&&d.setAttribute("xmlns:"+this.featurePrefix,b.featureNS);var e=this.format.writeNode("ogc:Filter",a);d.appendChild(e);c.appendChild(d);c=OpenLayers.Format.XML.prototype.write.apply(this.format,[c]);return OpenLayers.Request.POST({url:this.url,callback:b.callback||function(){},data:c})},abort:function(a){a&&a.priv.abort()},
CLASS_NAME:"OpenLayers.Protocol.WFS.v1"});OpenLayers.Handler.Point=OpenLayers.Class(OpenLayers.Handler,{point:null,layer:null,multi:!1,citeCompliant:!1,mouseDown:!1,stoppedDown:null,lastDown:null,lastUp:null,persist:!1,stopDown:!1,stopUp:!1,layerOptions:null,pixelTolerance:5,touch:!1,lastTouchPx:null,initialize:function(a,b,c){if(!c||!c.layerOptions||!c.layerOptions.styleMap)this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});OpenLayers.Handler.prototype.initialize.apply(this,arguments)},activate:function(){if(!OpenLayers.Handler.prototype.activate.apply(this,
arguments))return!1;var a=OpenLayers.Util.extend({displayInLayerSwitcher:!1,calculateInRange:OpenLayers.Function.True,wrapDateLine:this.citeCompliant},this.layerOptions);this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,a);this.map.addLayer(this.layer);return!0},createFeature:function(a){a=this.layer.getLonLatFromViewPortPx(a);a=new OpenLayers.Geometry.Point(a.lon,a.lat);this.point=new OpenLayers.Feature.Vector(a);this.callback("create",[this.point.geometry,this.point]);this.point.geometry.clearBounds();
this.layer.addFeatures([this.point],{silent:!0})},deactivate:function(){if(!OpenLayers.Handler.prototype.deactivate.apply(this,arguments))return!1;this.cancel();null!=this.layer.map&&(this.destroyFeature(!0),this.layer.destroy(!1));this.layer=null;this.touch=!1;return!0},destroyFeature:function(a){this.layer&&(a||!this.persist)&&this.layer.destroyFeatures();this.point=null},destroyPersistedFeature:function(){var a=this.layer;a&&1<a.features.length&&this.layer.features[0].destroy()},finalize:function(a){this.mouseDown=
!1;this.lastTouchPx=this.lastUp=this.lastDown=null;this.callback(a?"cancel":"done",[this.geometryClone()]);this.destroyFeature(a)},cancel:function(){this.finalize(!0)},click:function(a){OpenLayers.Event.stop(a);return!1},dblclick:function(a){OpenLayers.Event.stop(a);return!1},modifyFeature:function(a){this.point||this.createFeature(a);a=this.layer.getLonLatFromViewPortPx(a);this.point.geometry.x=a.lon;this.point.geometry.y=a.lat;this.callback("modify",[this.point.geometry,this.point,!1]);this.point.geometry.clearBounds();
this.drawFeature()},drawFeature:function(){this.layer.drawFeature(this.point,this.style)},getGeometry:function(){var a=this.point&&this.point.geometry;a&&this.multi&&(a=new OpenLayers.Geometry.MultiPoint([a]));return a},geometryClone:function(){var a=this.getGeometry();return a&&a.clone()},mousedown:function(a){return this.down(a)},touchstart:function(a){this.touch||(this.touch=!0,this.map.events.un({mousedown:this.mousedown,mouseup:this.mouseup,mousemove:this.mousemove,click:this.click,dblclick:this.dblclick,
scope:this}));this.lastTouchPx=a.xy;return this.down(a)},mousemove:function(a){return this.move(a)},touchmove:function(a){this.lastTouchPx=a.xy;return this.move(a)},mouseup:function(a){return this.up(a)},touchend:function(a){a.xy=this.lastTouchPx;return this.up(a)},down:function(a){this.mouseDown=!0;this.lastDown=a.xy;this.touch||this.modifyFeature(a.xy);this.stoppedDown=this.stopDown;return!this.stopDown},move:function(a){!this.touch&&(!this.mouseDown||this.stoppedDown)&&this.modifyFeature(a.xy);
return!0},up:function(a){this.mouseDown=!1;this.stoppedDown=this.stopDown;return this.checkModifiers(a)&&(!this.lastUp||!this.lastUp.equals(a.xy))&&this.lastDown&&this.passesTolerance(this.lastDown,a.xy,this.pixelTolerance)?(this.touch&&this.modifyFeature(a.xy),this.persist&&this.destroyPersistedFeature(),this.lastUp=a.xy,this.finalize(),!this.stopUp):!0},mouseout:function(a){OpenLayers.Util.mouseLeft(a,this.map.viewPortDiv)&&(this.stoppedDown=this.stopDown,this.mouseDown=!1)},passesTolerance:function(a,
b,c){var d=!0;null!=c&&a&&b&&a.distanceTo(b)>c&&(d=!1);return d},CLASS_NAME:"OpenLayers.Handler.Point"});OpenLayers.Handler.Path=OpenLayers.Class(OpenLayers.Handler.Point,{line:null,maxVertices:null,doubleTouchTolerance:20,freehand:!1,freehandToggle:"shiftKey",timerId:null,redoStack:null,createFeature:function(a){a=this.layer.getLonLatFromViewPortPx(a);a=new OpenLayers.Geometry.Point(a.lon,a.lat);this.point=new OpenLayers.Feature.Vector(a);this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([this.point.geometry]));this.callback("create",[this.point.geometry,this.getSketch()]);
this.point.geometry.clearBounds();this.layer.addFeatures([this.line,this.point],{silent:!0})},destroyFeature:function(a){OpenLayers.Handler.Point.prototype.destroyFeature.call(this,a);this.line=null},destroyPersistedFeature:function(){var a=this.layer;a&&2<a.features.length&&this.layer.features[0].destroy()},removePoint:function(){this.point&&this.layer.removeFeatures([this.point])},addPoint:function(a){this.layer.removeFeatures([this.point]);a=this.layer.getLonLatFromViewPortPx(a);this.point=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(a.lon,
a.lat));this.line.geometry.addComponent(this.point.geometry,this.line.geometry.components.length);this.layer.addFeatures([this.point]);this.callback("point",[this.point.geometry,this.getGeometry()]);this.callback("modify",[this.point.geometry,this.getSketch()]);this.drawFeature();delete this.redoStack},insertXY:function(a,b){this.line.geometry.addComponent(new OpenLayers.Geometry.Point(a,b),this.getCurrentPointIndex());this.drawFeature();delete this.redoStack},insertDeltaXY:function(a,b){var c=this.line.geometry.components[this.getCurrentPointIndex()-
1];c&&(!isNaN(c.x)&&!isNaN(c.y))&&this.insertXY(c.x+a,c.y+b)},insertDirectionLength:function(a,b){var a=a*(Math.PI/180),c=b*Math.cos(a),d=b*Math.sin(a);this.insertDeltaXY(c,d)},insertDeflectionLength:function(a,b){var c=this.getCurrentPointIndex()-1;if(0<c){var d=this.line.geometry.components[c],c=this.line.geometry.components[c-1];this.insertDirectionLength(180*Math.atan2(d.y-c.y,d.x-c.x)/Math.PI+a,b)}},getCurrentPointIndex:function(){return this.line.geometry.components.length-1},undo:function(){var a=
this.line.geometry,b=a.components,c=this.getCurrentPointIndex()-1,b=b[c];if(a=a.removeComponent(b))this.redoStack||(this.redoStack=[]),this.redoStack.push(b),this.drawFeature();return a},redo:function(){var a=this.redoStack&&this.redoStack.pop();a&&(this.line.geometry.addComponent(a,this.getCurrentPointIndex()),this.drawFeature());return!!a},freehandMode:function(a){return this.freehandToggle&&a[this.freehandToggle]?!this.freehand:this.freehand},modifyFeature:function(a,b){this.line||this.createFeature(a);
var c=this.layer.getLonLatFromViewPortPx(a);this.point.geometry.x=c.lon;this.point.geometry.y=c.lat;this.callback("modify",[this.point.geometry,this.getSketch(),b]);this.point.geometry.clearBounds();this.drawFeature()},drawFeature:function(){this.layer.drawFeature(this.line,this.style);this.layer.drawFeature(this.point,this.style)},getSketch:function(){return this.line},getGeometry:function(){var a=this.line&&this.line.geometry;a&&this.multi&&(a=new OpenLayers.Geometry.MultiLineString([a]));return a},
touchstart:function(a){if(this.timerId&&this.passesTolerance(this.lastTouchPx,a.xy,this.doubleTouchTolerance))return this.finishGeometry(),window.clearTimeout(this.timerId),this.timerId=null,!1;this.timerId&&(window.clearTimeout(this.timerId),this.timerId=null);this.timerId=window.setTimeout(OpenLayers.Function.bind(function(){this.timerId=null},this),300);return OpenLayers.Handler.Point.prototype.touchstart.call(this,a)},down:function(a){var b=this.stopDown;this.freehandMode(a)&&(b=!0,this.touch&&
(this.modifyFeature(a.xy,!!this.lastUp),OpenLayers.Event.stop(a)));!this.touch&&(!this.lastDown||!this.passesTolerance(this.lastDown,a.xy,this.pixelTolerance))&&this.modifyFeature(a.xy,!!this.lastUp);this.mouseDown=!0;this.lastDown=a.xy;this.stoppedDown=b;return!b},move:function(a){if(this.stoppedDown&&this.freehandMode(a))return this.persist&&this.destroyPersistedFeature(),this.maxVertices&&this.line&&this.line.geometry.components.length===this.maxVertices?(this.removePoint(),this.finalize()):this.addPoint(a.xy),
!1;!this.touch&&(!this.mouseDown||this.stoppedDown)&&this.modifyFeature(a.xy,!!this.lastUp);return!0},up:function(a){if(this.mouseDown&&(!this.lastUp||!this.lastUp.equals(a.xy)))this.stoppedDown&&this.freehandMode(a)?(this.persist&&this.destroyPersistedFeature(),this.removePoint(),this.finalize()):this.passesTolerance(this.lastDown,a.xy,this.pixelTolerance)&&(this.touch&&this.modifyFeature(a.xy),null==this.lastUp&&this.persist&&this.destroyPersistedFeature(),this.addPoint(a.xy),this.lastUp=a.xy,this.line.geometry.components.length===
this.maxVertices+1&&this.finishGeometry());this.stoppedDown=this.stopDown;this.mouseDown=!1;return!this.stopUp},finishGeometry:function(){this.line.geometry.removeComponent(this.line.geometry.components[this.line.geometry.components.length-1]);this.removePoint();this.finalize()},dblclick:function(a){this.freehandMode(a)||this.finishGeometry();return!1},CLASS_NAME:"OpenLayers.Handler.Path"});OpenLayers.Spherical=OpenLayers.Spherical||{};OpenLayers.Spherical.DEFAULT_RADIUS=6378137;OpenLayers.Spherical.computeDistanceBetween=function(a,b,c){var c=c||OpenLayers.Spherical.DEFAULT_RADIUS,d=Math.sin(Math.PI*(b.lon-a.lon)/360),e=Math.sin(Math.PI*(b.lat-a.lat)/360),a=e*e+d*d*Math.cos(Math.PI*a.lat/180)*Math.cos(Math.PI*b.lat/180);return 2*c*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))};
OpenLayers.Spherical.computeHeading=function(a,b){var c=Math.sin(Math.PI*(a.lon-b.lon)/180)*Math.cos(Math.PI*b.lat/180),d=Math.cos(Math.PI*a.lat/180)*Math.sin(Math.PI*b.lat/180)-Math.sin(Math.PI*a.lat/180)*Math.cos(Math.PI*b.lat/180)*Math.cos(Math.PI*(a.lon-b.lon)/180);return 180*Math.atan2(c,d)/Math.PI};OpenLayers.Control.CacheWrite=OpenLayers.Class(OpenLayers.Control,{layers:null,imageFormat:"image/png",quotaRegEx:/quota/i,setMap:function(a){OpenLayers.Control.prototype.setMap.apply(this,arguments);var b,c=this.layers||a.layers;for(b=c.length-1;0<=b;--b)this.addLayer({layer:c[b]});if(!this.layers)a.events.on({addlayer:this.addLayer,removeLayer:this.removeLayer,scope:this})},addLayer:function(a){a.layer.events.on({tileloadstart:this.makeSameOrigin,tileloaded:this.cache,scope:this})},removeLayer:function(a){a.layer.events.un({tileloadstart:this.makeSameOrigin,
tileloaded:this.cache,scope:this})},makeSameOrigin:function(a){if(this.active&&(a=a.tile,a instanceof OpenLayers.Tile.Image&&!a.crossOriginKeyword&&"data:"!==a.url.substr(0,5))){var b=OpenLayers.Request.makeSameOrigin(a.url,OpenLayers.ProxyHost);OpenLayers.Control.CacheWrite.urlMap[b]=a.url;a.url=b}},cache:function(a){if(this.active&&window.localStorage&&(a=a.tile,a instanceof OpenLayers.Tile.Image&&"data:"!==a.url.substr(0,5)))try{var b=a.getCanvasContext();if(b){var c=OpenLayers.Control.CacheWrite.urlMap;
window.localStorage.setItem("olCache_"+(c[a.url]||a.url),b.canvas.toDataURL(this.imageFormat));delete c[a.url]}}catch(d){(b=d.name||d.message)&&this.quotaRegEx.test(b)?this.events.triggerEvent("cachefull",{tile:a}):OpenLayers.Console.error(d.toString())}},destroy:function(){if(this.layers||this.map){var a,b=this.layers||this.map.layers;for(a=b.length-1;0<=a;--a)this.removeLayer({layer:b[a]})}this.map&&this.map.events.un({addlayer:this.addLayer,removeLayer:this.removeLayer,scope:this});OpenLayers.Control.prototype.destroy.apply(this,
arguments)},CLASS_NAME:"OpenLayers.Control.CacheWrite"});OpenLayers.Control.CacheWrite.clearCache=function(){if(window.localStorage){var a,b;for(a=window.localStorage.length-1;0<=a;--a)b=window.localStorage.key(a),"olCache_"===b.substr(0,8)&&window.localStorage.removeItem(b)}};OpenLayers.Control.CacheWrite.urlMap={};OpenLayers.Format.Context=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{layerOptions:null,layerParams:null,read:function(a,b){var c=OpenLayers.Format.XML.VersionedOGC.prototype.read.apply(this,arguments);if(b&&b.map)if(this.context=c,b.map instanceof OpenLayers.Map)c=this.mergeContextToMap(c,b.map);else{var d=b.map;if(OpenLayers.Util.isElement(d)||"string"==typeof d)d={div:d};c=this.contextToMap(c,d)}return c},getLayerFromContext:function(a){var b,c,d={queryable:a.queryable,visibility:a.visibility,
maxExtent:a.maxExtent,metadata:OpenLayers.Util.applyDefaults(a.metadata,{styles:a.styles,formats:a.formats,"abstract":a["abstract"],dataURL:a.dataURL}),numZoomLevels:a.numZoomLevels,units:a.units,isBaseLayer:a.isBaseLayer,opacity:a.opacity,displayInLayerSwitcher:a.displayInLayerSwitcher,singleTile:a.singleTile,tileSize:a.tileSize?new OpenLayers.Size(a.tileSize.width,a.tileSize.height):void 0,minScale:a.minScale||a.maxScaleDenominator,maxScale:a.maxScale||a.minScaleDenominator,srs:a.srs,dimensions:a.dimensions,
metadataURL:a.metadataURL};this.layerOptions&&OpenLayers.Util.applyDefaults(d,this.layerOptions);var e={layers:a.name,transparent:a.transparent,version:a.version};if(a.formats&&0<a.formats.length){e.format=a.formats[0].value;b=0;for(c=a.formats.length;b<c;b++){var f=a.formats[b];if(!0==f.current){e.format=f.value;break}}}if(a.styles&&0<a.styles.length){b=0;for(c=a.styles.length;b<c;b++)if(f=a.styles[b],!0==f.current){f.href?e.sld=f.href:f.body?e.sld_body=f.body:e.styles=f.name;break}}this.layerParams&&
OpenLayers.Util.applyDefaults(e,this.layerParams);b=null;c=a.service;c==OpenLayers.Format.Context.serviceTypes.WFS?(d.strategies=[new OpenLayers.Strategy.BBOX],d.protocol=new OpenLayers.Protocol.WFS({url:a.url,featurePrefix:a.name.split(":")[0],featureType:a.name.split(":").pop()}),b=new OpenLayers.Layer.Vector(a.title||a.name,d)):c==OpenLayers.Format.Context.serviceTypes.KML?(d.strategies=[new OpenLayers.Strategy.Fixed],d.protocol=new OpenLayers.Protocol.HTTP({url:a.url,format:new OpenLayers.Format.KML}),
b=new OpenLayers.Layer.Vector(a.title||a.name,d)):c==OpenLayers.Format.Context.serviceTypes.GML?(d.strategies=[new OpenLayers.Strategy.Fixed],d.protocol=new OpenLayers.Protocol.HTTP({url:a.url,format:new OpenLayers.Format.GML}),b=new OpenLayers.Layer.Vector(a.title||a.name,d)):a.features?(b=new OpenLayers.Layer.Vector(a.title||a.name,d),b.addFeatures(a.features)):!0!==a.categoryLayer&&(b=new OpenLayers.Layer.WMS(a.title||a.name,a.url,e,d));return b},getLayersFromContext:function(a){for(var b=[],c=
0,d=a.length;c<d;c++){var e=this.getLayerFromContext(a[c]);null!==e&&b.push(e)}return b},contextToMap:function(a,b){b=OpenLayers.Util.applyDefaults({maxExtent:a.maxExtent,projection:a.projection,units:a.units},b);b.maxExtent&&(b.maxResolution=b.maxExtent.getWidth()/OpenLayers.Map.TILE_WIDTH);b.metadata={contactInformation:a.contactInformation,"abstract":a["abstract"],keywords:a.keywords,logo:a.logo,descriptionURL:a.descriptionURL};var c=new OpenLayers.Map(b);c.addLayers(this.getLayersFromContext(a.layersContext));
c.setCenter(a.bounds.getCenterLonLat(),c.getZoomForExtent(a.bounds,!0));return c},mergeContextToMap:function(a,b){b.addLayers(this.getLayersFromContext(a.layersContext));return b},write:function(a,b){a=this.toContext(a);return OpenLayers.Format.XML.VersionedOGC.prototype.write.apply(this,arguments)},CLASS_NAME:"OpenLayers.Format.Context"});
OpenLayers.Format.Context.serviceTypes={WMS:"urn:ogc:serviceType:WMS",WFS:"urn:ogc:serviceType:WFS",WCS:"urn:ogc:serviceType:WCS",GML:"urn:ogc:serviceType:GML",SLD:"urn:ogc:serviceType:SLD",FES:"urn:ogc:serviceType:FES",KML:"urn:ogc:serviceType:KML"};OpenLayers.Format.WMC=OpenLayers.Class(OpenLayers.Format.Context,{defaultVersion:"1.1.0",layerToContext:function(a){var b=this.getParser(),c={queryable:a.queryable,visibility:a.visibility,name:a.params.LAYERS,title:a.name,"abstract":a.metadata["abstract"],dataURL:a.metadata.dataURL,metadataURL:a.metadataURL,server:{version:a.params.VERSION,url:a.url},maxExtent:a.maxExtent,transparent:a.params.TRANSPARENT,numZoomLevels:a.numZoomLevels,units:a.units,isBaseLayer:a.isBaseLayer,opacity:1==a.opacity?void 0:
a.opacity,displayInLayerSwitcher:a.displayInLayerSwitcher,singleTile:a.singleTile,tileSize:a.singleTile||!a.tileSize?void 0:{width:a.tileSize.w,height:a.tileSize.h},minScale:a.options.resolutions||a.options.scales||a.options.maxResolution||a.options.minScale?a.minScale:void 0,maxScale:a.options.resolutions||a.options.scales||a.options.minResolution||a.options.maxScale?a.maxScale:void 0,formats:[],styles:[],srs:a.srs,dimensions:a.dimensions};a.metadata.servertitle&&(c.server.title=a.metadata.servertitle);
if(a.metadata.formats&&0<a.metadata.formats.length)for(var d=0,e=a.metadata.formats.length;d<e;d++){var f=a.metadata.formats[d];c.formats.push({value:f.value,current:f.value==a.params.FORMAT})}else c.formats.push({value:a.params.FORMAT,current:!0});if(a.metadata.styles&&0<a.metadata.styles.length){d=0;for(e=a.metadata.styles.length;d<e;d++)b=a.metadata.styles[d],b.current=b.href==a.params.SLD||b.body==a.params.SLD_BODY||b.name==a.params.STYLES?!0:!1,c.styles.push(b)}else c.styles.push({href:a.params.SLD,
body:a.params.SLD_BODY,name:a.params.STYLES||b.defaultStyleName,title:b.defaultStyleTitle,current:!0});return c},toContext:function(a){var b={},c=a.layers;if("OpenLayers.Map"==a.CLASS_NAME){var d=a.metadata||{};b.size=a.getSize();b.bounds=a.getExtent();b.projection=a.projection;b.title=a.title;b.keywords=d.keywords;b["abstract"]=d["abstract"];b.logo=d.logo;b.descriptionURL=d.descriptionURL;b.contactInformation=d.contactInformation;b.maxExtent=a.maxExtent}else OpenLayers.Util.applyDefaults(b,a),void 0!=
b.layers&&delete b.layers;void 0==b.layersContext&&(b.layersContext=[]);if(void 0!=c&&OpenLayers.Util.isArray(c)){a=0;for(d=c.length;a<d;a++){var e=c[a];e instanceof OpenLayers.Layer.WMS&&b.layersContext.push(this.layerToContext(e))}}return b},CLASS_NAME:"OpenLayers.Format.WMC"});OpenLayers.Format.WMC.v1=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ol:"http://openlayers.org/context",wmc:"http://www.opengis.net/context",sld:"http://www.opengis.net/sld",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},schemaLocation:"",getNamespacePrefix:function(a){var b=null;if(null==a)b=this.namespaces[this.defaultPrefix];else for(b in this.namespaces)if(this.namespaces[b]==a)break;return b},defaultPrefix:"wmc",rootPrefix:null,defaultStyleName:"",
defaultStyleTitle:"Default",initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a=a.documentElement;this.rootPrefix=a.prefix;var b={version:a.getAttribute("version")};this.runChildNodes(b,a);return b},runChildNodes:function(a,b){for(var c=b.childNodes,d,e,f,g=0,h=c.length;g<h;++g)d=c[g],1==d.nodeType&&(e=this.getNamespacePrefix(d.namespaceURI),f=d.nodeName.split(":").pop(),
(e=this["read_"+e+"_"+f])&&e.apply(this,[a,d]))},read_wmc_General:function(a,b){this.runChildNodes(a,b)},read_wmc_BoundingBox:function(a,b){a.projection=b.getAttribute("SRS");a.bounds=new OpenLayers.Bounds(b.getAttribute("minx"),b.getAttribute("miny"),b.getAttribute("maxx"),b.getAttribute("maxy"))},read_wmc_LayerList:function(a,b){a.layersContext=[];this.runChildNodes(a,b)},read_wmc_Layer:function(a,b){var c={visibility:"1"!=b.getAttribute("hidden"),queryable:"1"==b.getAttribute("queryable"),formats:[],
styles:[],metadata:{}};this.runChildNodes(c,b);a.layersContext.push(c)},read_wmc_Extension:function(a,b){this.runChildNodes(a,b)},read_ol_units:function(a,b){a.units=this.getChildValue(b)},read_ol_maxExtent:function(a,b){var c=new OpenLayers.Bounds(b.getAttribute("minx"),b.getAttribute("miny"),b.getAttribute("maxx"),b.getAttribute("maxy"));a.maxExtent=c},read_ol_transparent:function(a,b){a.transparent=this.getChildValue(b)},read_ol_numZoomLevels:function(a,b){a.numZoomLevels=parseInt(this.getChildValue(b))},
read_ol_opacity:function(a,b){a.opacity=parseFloat(this.getChildValue(b))},read_ol_singleTile:function(a,b){a.singleTile="true"==this.getChildValue(b)},read_ol_tileSize:function(a,b){var c={width:b.getAttribute("width"),height:b.getAttribute("height")};a.tileSize=c},read_ol_isBaseLayer:function(a,b){a.isBaseLayer="true"==this.getChildValue(b)},read_ol_displayInLayerSwitcher:function(a,b){a.displayInLayerSwitcher="true"==this.getChildValue(b)},read_wmc_Server:function(a,b){a.version=b.getAttribute("version");
a.url=this.getOnlineResource_href(b);a.metadata.servertitle=b.getAttribute("title")},read_wmc_FormatList:function(a,b){this.runChildNodes(a,b)},read_wmc_Format:function(a,b){var c={value:this.getChildValue(b)};"1"==b.getAttribute("current")&&(c.current=!0);a.formats.push(c)},read_wmc_StyleList:function(a,b){this.runChildNodes(a,b)},read_wmc_Style:function(a,b){var c={};this.runChildNodes(c,b);"1"==b.getAttribute("current")&&(c.current=!0);a.styles.push(c)},read_wmc_SLD:function(a,b){this.runChildNodes(a,
b)},read_sld_StyledLayerDescriptor:function(a,b){var c=OpenLayers.Format.XML.prototype.write.apply(this,[b]);a.body=c},read_sld_FeatureTypeStyle:function(a,b){var c=OpenLayers.Format.XML.prototype.write.apply(this,[b]);a.body=c},read_wmc_OnlineResource:function(a,b){a.href=this.getAttributeNS(b,this.namespaces.xlink,"href")},read_wmc_Name:function(a,b){var c=this.getChildValue(b);c&&(a.name=c)},read_wmc_Title:function(a,b){var c=this.getChildValue(b);c&&(a.title=c)},read_wmc_MetadataURL:function(a,
b){a.metadataURL=this.getOnlineResource_href(b)},read_wmc_KeywordList:function(a,b){a.keywords=[];this.runChildNodes(a.keywords,b)},read_wmc_Keyword:function(a,b){a.push(this.getChildValue(b))},read_wmc_Abstract:function(a,b){var c=this.getChildValue(b);c&&(a["abstract"]=c)},read_wmc_LogoURL:function(a,b){a.logo={width:b.getAttribute("width"),height:b.getAttribute("height"),format:b.getAttribute("format"),href:this.getOnlineResource_href(b)}},read_wmc_DescriptionURL:function(a,b){a.descriptionURL=
this.getOnlineResource_href(b)},read_wmc_ContactInformation:function(a,b){var c={};this.runChildNodes(c,b);a.contactInformation=c},read_wmc_ContactPersonPrimary:function(a,b){var c={};this.runChildNodes(c,b);a.personPrimary=c},read_wmc_ContactPerson:function(a,b){var c=this.getChildValue(b);c&&(a.person=c)},read_wmc_ContactOrganization:function(a,b){var c=this.getChildValue(b);c&&(a.organization=c)},read_wmc_ContactPosition:function(a,b){var c=this.getChildValue(b);c&&(a.position=c)},read_wmc_ContactAddress:function(a,
b){var c={};this.runChildNodes(c,b);a.contactAddress=c},read_wmc_AddressType:function(a,b){var c=this.getChildValue(b);c&&(a.type=c)},read_wmc_Address:function(a,b){var c=this.getChildValue(b);c&&(a.address=c)},read_wmc_City:function(a,b){var c=this.getChildValue(b);c&&(a.city=c)},read_wmc_StateOrProvince:function(a,b){var c=this.getChildValue(b);c&&(a.stateOrProvince=c)},read_wmc_PostCode:function(a,b){var c=this.getChildValue(b);c&&(a.postcode=c)},read_wmc_Country:function(a,b){var c=this.getChildValue(b);
c&&(a.country=c)},read_wmc_ContactVoiceTelephone:function(a,b){var c=this.getChildValue(b);c&&(a.phone=c)},read_wmc_ContactFacsimileTelephone:function(a,b){var c=this.getChildValue(b);c&&(a.fax=c)},read_wmc_ContactElectronicMailAddress:function(a,b){var c=this.getChildValue(b);c&&(a.email=c)},read_wmc_DataURL:function(a,b){a.dataURL=this.getOnlineResource_href(b)},read_wmc_LegendURL:function(a,b){var c={width:b.getAttribute("width"),height:b.getAttribute("height"),format:b.getAttribute("format"),
href:this.getOnlineResource_href(b)};a.legend=c},read_wmc_DimensionList:function(a,b){a.dimensions={};this.runChildNodes(a.dimensions,b)},read_wmc_Dimension:function(a,b){var c={name:b.getAttribute("name").toLowerCase(),units:b.getAttribute("units")||"",unitSymbol:b.getAttribute("unitSymbol")||"",userValue:b.getAttribute("userValue")||"",nearestValue:"1"===b.getAttribute("nearestValue"),multipleValues:"1"===b.getAttribute("multipleValues"),current:"1"===b.getAttribute("current"),"default":b.getAttribute("default")||
""},d=this.getChildValue(b);c.values=d.split(",");a[c.name]=c},write:function(a,b){var c=this.createElementDefaultNS("ViewContext");this.setAttributes(c,{version:this.VERSION,id:b&&"string"==typeof b.id?b.id:OpenLayers.Util.createUniqueID("OpenLayers_Context_")});this.setAttributeNS(c,this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation);c.appendChild(this.write_wmc_General(a));c.appendChild(this.write_wmc_LayerList(a));return OpenLayers.Format.XML.prototype.write.apply(this,[c])},createElementDefaultNS:function(a,
b,c){a=this.createElementNS(this.namespaces[this.defaultPrefix],a);b&&a.appendChild(this.createTextNode(b));c&&this.setAttributes(a,c);return a},setAttributes:function(a,b){var c,d;for(d in b)c=b[d].toString(),c.match(/[A-Z]/)?this.setAttributeNS(a,null,d,c):a.setAttribute(d,c)},write_wmc_General:function(a){var b=this.createElementDefaultNS("General");a.size&&b.appendChild(this.createElementDefaultNS("Window",null,{width:a.size.w,height:a.size.h}));var c=a.bounds;b.appendChild(this.createElementDefaultNS("BoundingBox",
null,{minx:c.left.toPrecision(18),miny:c.bottom.toPrecision(18),maxx:c.right.toPrecision(18),maxy:c.top.toPrecision(18),SRS:a.projection}));b.appendChild(this.createElementDefaultNS("Title",a.title));a.keywords&&b.appendChild(this.write_wmc_KeywordList(a.keywords));a["abstract"]&&b.appendChild(this.createElementDefaultNS("Abstract",a["abstract"]));a.logo&&b.appendChild(this.write_wmc_URLType("LogoURL",a.logo.href,a.logo));a.descriptionURL&&b.appendChild(this.write_wmc_URLType("DescriptionURL",a.descriptionURL));
a.contactInformation&&b.appendChild(this.write_wmc_ContactInformation(a.contactInformation));b.appendChild(this.write_ol_MapExtension(a));return b},write_wmc_KeywordList:function(a){for(var b=this.createElementDefaultNS("KeywordList"),c=0,d=a.length;c<d;c++)b.appendChild(this.createElementDefaultNS("Keyword",a[c]));return b},write_wmc_ContactInformation:function(a){var b=this.createElementDefaultNS("ContactInformation");a.personPrimary&&b.appendChild(this.write_wmc_ContactPersonPrimary(a.personPrimary));
a.position&&b.appendChild(this.createElementDefaultNS("ContactPosition",a.position));a.contactAddress&&b.appendChild(this.write_wmc_ContactAddress(a.contactAddress));a.phone&&b.appendChild(this.createElementDefaultNS("ContactVoiceTelephone",a.phone));a.fax&&b.appendChild(this.createElementDefaultNS("ContactFacsimileTelephone",a.fax));a.email&&b.appendChild(this.createElementDefaultNS("ContactElectronicMailAddress",a.email));return b},write_wmc_ContactPersonPrimary:function(a){var b=this.createElementDefaultNS("ContactPersonPrimary");
a.person&&b.appendChild(this.createElementDefaultNS("ContactPerson",a.person));a.organization&&b.appendChild(this.createElementDefaultNS("ContactOrganization",a.organization));return b},write_wmc_ContactAddress:function(a){var b=this.createElementDefaultNS("ContactAddress");a.type&&b.appendChild(this.createElementDefaultNS("AddressType",a.type));a.address&&b.appendChild(this.createElementDefaultNS("Address",a.address));a.city&&b.appendChild(this.createElementDefaultNS("City",a.city));a.stateOrProvince&&
b.appendChild(this.createElementDefaultNS("StateOrProvince",a.stateOrProvince));a.postcode&&b.appendChild(this.createElementDefaultNS("PostCode",a.postcode));a.country&&b.appendChild(this.createElementDefaultNS("Country",a.country));return b},write_ol_MapExtension:function(a){var b=this.createElementDefaultNS("Extension");if(a=a.maxExtent){var c=this.createElementNS(this.namespaces.ol,"ol:maxExtent");this.setAttributes(c,{minx:a.left.toPrecision(18),miny:a.bottom.toPrecision(18),maxx:a.right.toPrecision(18),
maxy:a.top.toPrecision(18)});b.appendChild(c)}return b},write_wmc_LayerList:function(a){for(var b=this.createElementDefaultNS("LayerList"),c=0,d=a.layersContext.length;c<d;++c)b.appendChild(this.write_wmc_Layer(a.layersContext[c]));return b},write_wmc_Layer:function(a){var b=this.createElementDefaultNS("Layer",null,{queryable:a.queryable?"1":"0",hidden:a.visibility?"0":"1"});b.appendChild(this.write_wmc_Server(a));b.appendChild(this.createElementDefaultNS("Name",a.name));b.appendChild(this.createElementDefaultNS("Title",
a.title));a["abstract"]&&b.appendChild(this.createElementDefaultNS("Abstract",a["abstract"]));a.dataURL&&b.appendChild(this.write_wmc_URLType("DataURL",a.dataURL));a.metadataURL&&b.appendChild(this.write_wmc_URLType("MetadataURL",a.metadataURL));return b},write_wmc_LayerExtension:function(a){var b=this.createElementDefaultNS("Extension"),c=a.maxExtent,d=this.createElementNS(this.namespaces.ol,"ol:maxExtent");this.setAttributes(d,{minx:c.left.toPrecision(18),miny:c.bottom.toPrecision(18),maxx:c.right.toPrecision(18),
maxy:c.top.toPrecision(18)});b.appendChild(d);a.tileSize&&!a.singleTile&&(c=this.createElementNS(this.namespaces.ol,"ol:tileSize"),this.setAttributes(c,a.tileSize),b.appendChild(c));for(var c="transparent numZoomLevels units isBaseLayer opacity displayInLayerSwitcher singleTile".split(" "),e=0,f=c.length;e<f;++e)(d=this.createOLPropertyNode(a,c[e]))&&b.appendChild(d);return b},createOLPropertyNode:function(a,b){var c=null;null!=a[b]&&(c=this.createElementNS(this.namespaces.ol,"ol:"+b),c.appendChild(this.createTextNode(a[b].toString())));
return c},write_wmc_Server:function(a){var a=a.server,b=this.createElementDefaultNS("Server"),c={service:"OGC:WMS",version:a.version};a.title&&(c.title=a.title);this.setAttributes(b,c);b.appendChild(this.write_wmc_OnlineResource(a.url));return b},write_wmc_URLType:function(a,b,c){a=this.createElementDefaultNS(a);a.appendChild(this.write_wmc_OnlineResource(b));if(c)for(var b=["width","height","format"],d=0;d<b.length;d++)b[d]in c&&a.setAttribute(b[d],c[b[d]]);return a},write_wmc_DimensionList:function(a){var b=
this.createElementDefaultNS("DimensionList"),c;for(c in a.dimensions){var d={},e=a.dimensions[c],f;for(f in e)d[f]="boolean"==typeof e[f]?Number(e[f]):e[f];e="";d.values&&(e=d.values.join(","),delete d.values);b.appendChild(this.createElementDefaultNS("Dimension",e,d))}return b},write_wmc_FormatList:function(a){for(var b=this.createElementDefaultNS("FormatList"),c=0,d=a.formats.length;c<d;c++){var e=a.formats[c];b.appendChild(this.createElementDefaultNS("Format",e.value,e.current&&!0==e.current?{current:"1"}:
null))}return b},write_wmc_StyleList:function(a){var b=this.createElementDefaultNS("StyleList");if((a=a.styles)&&OpenLayers.Util.isArray(a))for(var c,d=0,e=a.length;d<e;d++){var f=a[d],g=this.createElementDefaultNS("Style",null,f.current&&!0==f.current?{current:"1"}:null);f.href?(c=this.createElementDefaultNS("SLD"),f.name&&c.appendChild(this.createElementDefaultNS("Name",f.name)),f.title&&c.appendChild(this.createElementDefaultNS("Title",f.title)),f.legend&&c.appendChild(this.write_wmc_URLType("LegendURL",
f.legend.href,f.legend)),f=this.write_wmc_OnlineResource(f.href),c.appendChild(f),g.appendChild(c)):f.body?(c=this.createElementDefaultNS("SLD"),f.name&&c.appendChild(this.createElementDefaultNS("Name",f.name)),f.title&&c.appendChild(this.createElementDefaultNS("Title",f.title)),f.legend&&c.appendChild(this.write_wmc_URLType("LegendURL",f.legend.href,f.legend)),f=OpenLayers.Format.XML.prototype.read.apply(this,[f.body]).documentElement,c.ownerDocument&&c.ownerDocument.importNode&&(f=c.ownerDocument.importNode(f,
!0)),c.appendChild(f),g.appendChild(c)):(g.appendChild(this.createElementDefaultNS("Name",f.name)),g.appendChild(this.createElementDefaultNS("Title",f.title)),f["abstract"]&&g.appendChild(this.createElementDefaultNS("Abstract",f["abstract"])),f.legend&&g.appendChild(this.write_wmc_URLType("LegendURL",f.legend.href,f.legend)));b.appendChild(g)}return b},write_wmc_OnlineResource:function(a){var b=this.createElementDefaultNS("OnlineResource");this.setAttributeNS(b,this.namespaces.xlink,"xlink:type",
"simple");this.setAttributeNS(b,this.namespaces.xlink,"xlink:href",a);return b},getOnlineResource_href:function(a){var b={},a=a.getElementsByTagName("OnlineResource");0<a.length&&this.read_wmc_OnlineResource(b,a[0]);return b.href},CLASS_NAME:"OpenLayers.Format.WMC.v1"});OpenLayers.Control.PanPanel=OpenLayers.Class(OpenLayers.Control.Panel,{slideFactor:50,slideRatio:null,initialize:function(a){OpenLayers.Control.Panel.prototype.initialize.apply(this,[a]);a={slideFactor:this.slideFactor,slideRatio:this.slideRatio};this.addControls([new OpenLayers.Control.Pan(OpenLayers.Control.Pan.NORTH,a),new OpenLayers.Control.Pan(OpenLayers.Control.Pan.SOUTH,a),new OpenLayers.Control.Pan(OpenLayers.Control.Pan.EAST,a),new OpenLayers.Control.Pan(OpenLayers.Control.Pan.WEST,a)])},
CLASS_NAME:"OpenLayers.Control.PanPanel"});OpenLayers.Control.Attribution=OpenLayers.Class(OpenLayers.Control,{separator:", ",template:"${layers}",destroy:function(){this.map.events.un({removelayer:this.updateAttribution,addlayer:this.updateAttribution,changelayer:this.updateAttribution,changebaselayer:this.updateAttribution,scope:this});OpenLayers.Control.prototype.destroy.apply(this,arguments)},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);this.map.events.on({changebaselayer:this.updateAttribution,changelayer:this.updateAttribution,
addlayer:this.updateAttribution,removelayer:this.updateAttribution,scope:this});this.updateAttribution();return this.div},updateAttribution:function(){var a=[];if(this.map&&this.map.layers){for(var b=0,c=this.map.layers.length;b<c;b++){var d=this.map.layers[b];d.attribution&&d.getVisibility()&&-1===OpenLayers.Util.indexOf(a,d.attribution)&&a.push(d.attribution)}this.div.innerHTML=OpenLayers.String.format(this.template,{layers:a.join(this.separator)})}},CLASS_NAME:"OpenLayers.Control.Attribution"});OpenLayers.Kinetic=OpenLayers.Class({threshold:0,deceleration:0.0035,nbPoints:100,delay:200,points:void 0,timerId:void 0,initialize:function(a){OpenLayers.Util.extend(this,a)},begin:function(){OpenLayers.Animation.stop(this.timerId);this.timerId=void 0;this.points=[]},update:function(a){this.points.unshift({xy:a,tick:(new Date).getTime()});this.points.length>this.nbPoints&&this.points.pop()},end:function(a){for(var b,c=(new Date).getTime(),d=0,e=this.points.length,f;d<e;d++){f=this.points[d];if(c-
f.tick>this.delay)break;b=f}if(b&&(d=(new Date).getTime()-b.tick,c=Math.sqrt(Math.pow(a.x-b.xy.x,2)+Math.pow(a.y-b.xy.y,2)),d=c/d,!(0==d||d<this.threshold)))return c=Math.asin((a.y-b.xy.y)/c),b.xy.x<=a.x&&(c=Math.PI-c),{speed:d,theta:c}},move:function(a,b){var c=a.speed,d=Math.cos(a.theta),e=-Math.sin(a.theta),f=(new Date).getTime(),g=0,h=0;this.timerId=OpenLayers.Animation.start(OpenLayers.Function.bind(function(){if(null!=this.timerId){var a=(new Date).getTime()-f,j=-this.deceleration*Math.pow(a,
2)/2+c*a,k=j*d,j=j*e,l,m;l=!1;0>=-this.deceleration*a+c&&(OpenLayers.Animation.stop(this.timerId),this.timerId=null,l=!0);a=k-g;m=j-h;g=k;h=j;b(a,m,l)}},this))},CLASS_NAME:"OpenLayers.Kinetic"});OpenLayers.Layer.GeoRSS=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,formatOptions:null,selectedFeature:null,icon:null,popupSize:null,useFeedTitle:!0,initialize:function(a,b,c){OpenLayers.Layer.Markers.prototype.initialize.apply(this,[a,c]);this.location=b;this.features=[]},destroy:function(){OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);this.clearFeatures();this.features=null},loadRSS:function(){this.loaded||(this.events.triggerEvent("loadstart"),OpenLayers.Request.GET({url:this.location,
success:this.parseData,scope:this}),this.loaded=!0)},moveTo:function(a,b,c){OpenLayers.Layer.Markers.prototype.moveTo.apply(this,arguments);this.visibility&&!this.loaded&&this.loadRSS()},parseData:function(a){var b=a.responseXML;if(!b||!b.documentElement)b=OpenLayers.Format.XML.prototype.read(a.responseText);if(this.useFeedTitle){a=null;try{a=b.getElementsByTagNameNS("*","title")[0].firstChild.nodeValue}catch(c){a=b.getElementsByTagName("title")[0].firstChild.nodeValue}a&&this.setName(a)}a={};OpenLayers.Util.extend(a,
this.formatOptions);this.map&&!this.projection.equals(this.map.getProjectionObject())&&(a.externalProjection=this.projection,a.internalProjection=this.map.getProjectionObject());for(var b=(new OpenLayers.Format.GeoRSS(a)).read(b),a=0,d=b.length;a<d;a++){var e={},f=b[a];if(f.geometry){var g=f.attributes.title?f.attributes.title:"Untitled",h=f.attributes.description?f.attributes.description:"No description.",i=f.attributes.link?f.attributes.link:"",f=f.geometry.getBounds().getCenterLonLat();e.icon=
null==this.icon?OpenLayers.Marker.defaultIcon():this.icon.clone();e.popupSize=this.popupSize?this.popupSize.clone():new OpenLayers.Size(250,120);if(g||h){e.title=g;e.description=h;var j='<div class="olLayerGeoRSSClose">[x]</div>',j=j+'<div class="olLayerGeoRSSTitle">';i&&(j+='<a class="link" href="'+i+'" target="_blank">');j+=g;i&&(j+="</a>");j+="</div>";j+='<div style="" class="olLayerGeoRSSDescription">';j+=h;j+="</div>";e.popupContentHTML=j}f=new OpenLayers.Feature(this,f,e);this.features.push(f);
e=f.createMarker();e.events.register("click",f,this.markerClick);this.addMarker(e)}}this.events.triggerEvent("loadend")},markerClick:function(a){var b=this==this.layer.selectedFeature;this.layer.selectedFeature=!b?this:null;for(var c=0,d=this.layer.map.popups.length;c<d;c++)this.layer.map.removePopup(this.layer.map.popups[c]);b||(b=this.createPopup(),OpenLayers.Event.observe(b.div,"click",OpenLayers.Function.bind(function(){for(var a=0,b=this.layer.map.popups.length;a<b;a++)this.layer.map.removePopup(this.layer.map.popups[a])},
this)),this.layer.map.addPopup(b));OpenLayers.Event.stop(a)},clearFeatures:function(){if(null!=this.features)for(;0<this.features.length;){var a=this.features[0];OpenLayers.Util.removeItem(this.features,a);a.destroy()}},CLASS_NAME:"OpenLayers.Layer.GeoRSS"});OpenLayers.Symbolizer.Point=OpenLayers.Class(OpenLayers.Symbolizer,{initialize:function(a){OpenLayers.Symbolizer.prototype.initialize.apply(this,arguments)},CLASS_NAME:"OpenLayers.Symbolizer.Point"});OpenLayers.Symbolizer.Line=OpenLayers.Class(OpenLayers.Symbolizer,{initialize:function(a){OpenLayers.Symbolizer.prototype.initialize.apply(this,arguments)},CLASS_NAME:"OpenLayers.Symbolizer.Line"});OpenLayers.Symbolizer.Text=OpenLayers.Class(OpenLayers.Symbolizer,{initialize:function(a){OpenLayers.Symbolizer.prototype.initialize.apply(this,arguments)},CLASS_NAME:"OpenLayers.Symbolizer.Text"});OpenLayers.Format.SLD.v1=OpenLayers.Class(OpenLayers.Format.Filter.v1_0_0,{namespaces:{sld:"http://www.opengis.net/sld",ogc:"http://www.opengis.net/ogc",gml:"http://www.opengis.net/gml",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},defaultPrefix:"sld",schemaLocation:null,multipleSymbolizers:!1,featureTypeCounter:null,defaultSymbolizer:{fillColor:"#808080",fillOpacity:1,strokeColor:"#000000",strokeOpacity:1,strokeWidth:1,strokeDashstyle:"solid",pointRadius:3,
graphicName:"square"},read:function(a,b){var b=OpenLayers.Util.applyDefaults(b,this.options),c={namedLayers:!0===b.namedLayersAsArray?[]:{}};this.readChildNodes(a,c);return c},readers:OpenLayers.Util.applyDefaults({sld:{StyledLayerDescriptor:function(a,b){b.version=a.getAttribute("version");this.readChildNodes(a,b)},Name:function(a,b){b.name=this.getChildValue(a)},Title:function(a,b){b.title=this.getChildValue(a)},Abstract:function(a,b){b.description=this.getChildValue(a)},NamedLayer:function(a,b){var c=
{userStyles:[],namedStyles:[]};this.readChildNodes(a,c);for(var d=0,e=c.userStyles.length;d<e;++d)c.userStyles[d].layerName=c.name;OpenLayers.Util.isArray(b.namedLayers)?b.namedLayers.push(c):b.namedLayers[c.name]=c},NamedStyle:function(a,b){b.namedStyles.push(this.getChildName(a.firstChild))},UserStyle:function(a,b){var c={defaultsPerSymbolizer:!0,rules:[]};this.featureTypeCounter=-1;this.readChildNodes(a,c);this.multipleSymbolizers?(delete c.defaultsPerSymbolizer,c=new OpenLayers.Style2(c)):c=new OpenLayers.Style(this.defaultSymbolizer,
c);b.userStyles.push(c)},IsDefault:function(a,b){"1"==this.getChildValue(a)&&(b.isDefault=!0)},FeatureTypeStyle:function(a,b){++this.featureTypeCounter;var c={rules:this.multipleSymbolizers?b.rules:[]};this.readChildNodes(a,c);this.multipleSymbolizers||(b.rules=c.rules)},Rule:function(a,b){var c;this.multipleSymbolizers&&(c={symbolizers:[]});c=new OpenLayers.Rule(c);this.readChildNodes(a,c);b.rules.push(c)},ElseFilter:function(a,b){b.elseFilter=!0},MinScaleDenominator:function(a,b){b.minScaleDenominator=
parseFloat(this.getChildValue(a))},MaxScaleDenominator:function(a,b){b.maxScaleDenominator=parseFloat(this.getChildValue(a))},TextSymbolizer:function(a,b){var c={};this.readChildNodes(a,c);this.multipleSymbolizers?(c.zIndex=this.featureTypeCounter,b.symbolizers.push(new OpenLayers.Symbolizer.Text(c))):b.symbolizer.Text=OpenLayers.Util.applyDefaults(c,b.symbolizer.Text)},LabelPlacement:function(a,b){this.readChildNodes(a,b)},PointPlacement:function(a,b){var c={};this.readChildNodes(a,c);c.labelRotation=
c.rotation;delete c.rotation;var d,e=b.labelAnchorPointX,f=b.labelAnchorPointY;e<=1/3?d="l":e>1/3&&e<2/3?d="c":e>=2/3&&(d="r");f<=1/3?d+="b":f>1/3&&f<2/3?d+="m":f>=2/3&&(d+="t");c.labelAlign=d;OpenLayers.Util.applyDefaults(b,c)},AnchorPoint:function(a,b){this.readChildNodes(a,b)},AnchorPointX:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.labelAnchorPointX=c)},AnchorPointY:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.labelAnchorPointY=c)},Displacement:function(a,
b){this.readChildNodes(a,b)},DisplacementX:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.labelXOffset=c)},DisplacementY:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.labelYOffset=c)},LinePlacement:function(a,b){this.readChildNodes(a,b)},PerpendicularOffset:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.labelPerpendicularOffset=c)},Label:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.label=c)},Font:function(a,b){this.readChildNodes(a,
b)},Halo:function(a,b){var c={};this.readChildNodes(a,c);b.haloRadius=c.haloRadius;b.haloColor=c.fillColor;b.haloOpacity=c.fillOpacity},Radius:function(a,b){var c=this.readers.ogc._expression.call(this,a);null!=c&&(b.haloRadius=c)},RasterSymbolizer:function(a,b){var c={};this.readChildNodes(a,c);this.multipleSymbolizers?(c.zIndex=this.featureTypeCounter,b.symbolizers.push(new OpenLayers.Symbolizer.Raster(c))):b.symbolizer.Raster=OpenLayers.Util.applyDefaults(c,b.symbolizer.Raster)},Geometry:function(a,
b){b.geometry={};this.readChildNodes(a,b.geometry)},ColorMap:function(a,b){b.colorMap=[];this.readChildNodes(a,b.colorMap)},ColorMapEntry:function(a,b){var c=a.getAttribute("quantity"),d=a.getAttribute("opacity");b.push({color:a.getAttribute("color"),quantity:null!==c?parseFloat(c):void 0,label:a.getAttribute("label")||void 0,opacity:null!==d?parseFloat(d):void 0})},LineSymbolizer:function(a,b){var c={};this.readChildNodes(a,c);this.multipleSymbolizers?(c.zIndex=this.featureTypeCounter,b.symbolizers.push(new OpenLayers.Symbolizer.Line(c))):
b.symbolizer.Line=OpenLayers.Util.applyDefaults(c,b.symbolizer.Line)},PolygonSymbolizer:function(a,b){var c={fill:!1,stroke:!1};this.multipleSymbolizers||(c=b.symbolizer.Polygon||c);this.readChildNodes(a,c);this.multipleSymbolizers?(c.zIndex=this.featureTypeCounter,b.symbolizers.push(new OpenLayers.Symbolizer.Polygon(c))):b.symbolizer.Polygon=c},PointSymbolizer:function(a,b){var c={fill:!1,stroke:!1,graphic:!1};this.multipleSymbolizers||(c=b.symbolizer.Point||c);this.readChildNodes(a,c);this.multipleSymbolizers?
(c.zIndex=this.featureTypeCounter,b.symbolizers.push(new OpenLayers.Symbolizer.Point(c))):b.symbolizer.Point=c},Stroke:function(a,b){b.stroke=!0;this.readChildNodes(a,b)},Fill:function(a,b){b.fill=!0;this.readChildNodes(a,b)},CssParameter:function(a,b){var c=a.getAttribute("name"),d=this.cssMap[c];b.label&&("fill"===c?d="fontColor":"fill-opacity"===c&&(d="fontOpacity"));d&&(c=this.readers.ogc._expression.call(this,a))&&(b[d]=c)},Graphic:function(a,b){b.graphic=!0;var c={};this.readChildNodes(a,c);
for(var d="stroke strokeColor strokeWidth strokeOpacity strokeLinecap fill fillColor fillOpacity graphicName rotation graphicFormat".split(" "),e,f,g=0,h=d.length;g<h;++g)e=d[g],f=c[e],void 0!=f&&(b[e]=f);void 0!=c.opacity&&(b.graphicOpacity=c.opacity);void 0!=c.size&&(isNaN(c.size/2)?b.graphicWidth=c.size:b.pointRadius=c.size/2);void 0!=c.href&&(b.externalGraphic=c.href);void 0!=c.rotation&&(b.rotation=c.rotation)},ExternalGraphic:function(a,b){this.readChildNodes(a,b)},Mark:function(a,b){this.readChildNodes(a,
b)},WellKnownName:function(a,b){b.graphicName=this.getChildValue(a)},Opacity:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.opacity=c)},Size:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.size=c)},Rotation:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.rotation=c)},OnlineResource:function(a,b){b.href=this.getAttributeNS(a,this.namespaces.xlink,"href")},Format:function(a,b){b.graphicFormat=this.getChildValue(a)}}},OpenLayers.Format.Filter.v1_0_0.prototype.readers),
cssMap:{stroke:"strokeColor","stroke-opacity":"strokeOpacity","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-dasharray":"strokeDashstyle",fill:"fillColor","fill-opacity":"fillOpacity","font-family":"fontFamily","font-size":"fontSize","font-weight":"fontWeight","font-style":"fontStyle"},getCssProperty:function(a){var b=null,c;for(c in this.cssMap)if(this.cssMap[c]==a){b=c;break}return b},getGraphicFormat:function(a){var b,c;for(c in this.graphicFormats)if(this.graphicFormats[c].test(a)){b=
c;break}return b||this.defaultGraphicFormat},defaultGraphicFormat:"image/png",graphicFormats:{"image/jpeg":/\.jpe?g$/i,"image/gif":/\.gif$/i,"image/png":/\.png$/i},write:function(a){return this.writers.sld.StyledLayerDescriptor.apply(this,[a])},writers:OpenLayers.Util.applyDefaults({sld:{_OGCExpression:function(a,b){var c=this.createElementNSPlus(a),d="string"==typeof b?b.split("${"):[b];c.appendChild(this.createTextNode(d[0]));for(var e,f,g=1,h=d.length;g<h;g++)e=d[g],f=e.indexOf("}"),0<f?(this.writeNode("ogc:PropertyName",
{property:e.substring(0,f)},c),c.appendChild(this.createTextNode(e.substring(++f)))):c.appendChild(this.createTextNode("${"+e));return c},StyledLayerDescriptor:function(a){var b=this.createElementNSPlus("sld:StyledLayerDescriptor",{attributes:{version:this.VERSION,"xsi:schemaLocation":this.schemaLocation}});b.setAttribute("xmlns:ogc",this.namespaces.ogc);b.setAttribute("xmlns:gml",this.namespaces.gml);a.name&&this.writeNode("Name",a.name,b);a.title&&this.writeNode("Title",a.title,b);a.description&&
this.writeNode("Abstract",a.description,b);if(OpenLayers.Util.isArray(a.namedLayers))for(var c=0,d=a.namedLayers.length;c<d;++c)this.writeNode("NamedLayer",a.namedLayers[c],b);else for(c in a.namedLayers)this.writeNode("NamedLayer",a.namedLayers[c],b);return b},Name:function(a){return this.createElementNSPlus("sld:Name",{value:a})},Title:function(a){return this.createElementNSPlus("sld:Title",{value:a})},Abstract:function(a){return this.createElementNSPlus("sld:Abstract",{value:a})},NamedLayer:function(a){var b=
this.createElementNSPlus("sld:NamedLayer");this.writeNode("Name",a.name,b);if(a.namedStyles)for(var c=0,d=a.namedStyles.length;c<d;++c)this.writeNode("NamedStyle",a.namedStyles[c],b);if(a.userStyles){c=0;for(d=a.userStyles.length;c<d;++c)this.writeNode("UserStyle",a.userStyles[c],b)}return b},NamedStyle:function(a){var b=this.createElementNSPlus("sld:NamedStyle");this.writeNode("Name",a,b);return b},UserStyle:function(a){var b=this.createElementNSPlus("sld:UserStyle");a.name&&this.writeNode("Name",
a.name,b);a.title&&this.writeNode("Title",a.title,b);a.description&&this.writeNode("Abstract",a.description,b);a.isDefault&&this.writeNode("IsDefault",a.isDefault,b);if(this.multipleSymbolizers&&a.rules){for(var c={"0":[]},d=[0],e,f,g,h,i,j=0,k=a.rules.length;j<k;++j)if(e=a.rules[j],e.symbolizers){f={};for(var l=0,m=e.symbolizers.length;l<m;++l)g=e.symbolizers[l],h=g.zIndex,h in f||(i=e.clone(),i.symbolizers=[],f[h]=i),f[h].symbolizers.push(g.clone());for(h in f)h in c||(d.push(h),c[h]=[]),c[h].push(f[h])}else c[0].push(e.clone());
d.sort();j=0;for(k=d.length;j<k;++j)e=c[d[j]],0<e.length&&(i=a.clone(),i.rules=c[d[j]],this.writeNode("FeatureTypeStyle",i,b))}else this.writeNode("FeatureTypeStyle",a,b);return b},IsDefault:function(a){return this.createElementNSPlus("sld:IsDefault",{value:a?"1":"0"})},FeatureTypeStyle:function(a){for(var b=this.createElementNSPlus("sld:FeatureTypeStyle"),c=0,d=a.rules.length;c<d;++c)this.writeNode("Rule",a.rules[c],b);return b},Rule:function(a){var b=this.createElementNSPlus("sld:Rule");a.name&&
this.writeNode("Name",a.name,b);a.title&&this.writeNode("Title",a.title,b);a.description&&this.writeNode("Abstract",a.description,b);a.elseFilter?this.writeNode("ElseFilter",null,b):a.filter&&this.writeNode("ogc:Filter",a.filter,b);void 0!=a.minScaleDenominator&&this.writeNode("MinScaleDenominator",a.minScaleDenominator,b);void 0!=a.maxScaleDenominator&&this.writeNode("MaxScaleDenominator",a.maxScaleDenominator,b);var c,d;if(this.multipleSymbolizers&&a.symbolizers)for(var e=0,f=a.symbolizers.length;e<
f;++e)d=a.symbolizers[e],c=d.CLASS_NAME.split(".").pop(),this.writeNode(c+"Symbolizer",d,b);else for(var f=OpenLayers.Style.SYMBOLIZER_PREFIXES,e=0,g=f.length;e<g;++e)c=f[e],(d=a.symbolizer[c])&&this.writeNode(c+"Symbolizer",d,b);return b},ElseFilter:function(){return this.createElementNSPlus("sld:ElseFilter")},MinScaleDenominator:function(a){return this.createElementNSPlus("sld:MinScaleDenominator",{value:a})},MaxScaleDenominator:function(a){return this.createElementNSPlus("sld:MaxScaleDenominator",
{value:a})},LineSymbolizer:function(a){var b=this.createElementNSPlus("sld:LineSymbolizer");this.writeNode("Stroke",a,b);return b},Stroke:function(a){var b=this.createElementNSPlus("sld:Stroke");void 0!=a.strokeColor&&this.writeNode("CssParameter",{symbolizer:a,key:"strokeColor"},b);void 0!=a.strokeOpacity&&this.writeNode("CssParameter",{symbolizer:a,key:"strokeOpacity"},b);void 0!=a.strokeWidth&&this.writeNode("CssParameter",{symbolizer:a,key:"strokeWidth"},b);void 0!=a.strokeDashstyle&&"solid"!==
a.strokeDashstyle&&this.writeNode("CssParameter",{symbolizer:a,key:"strokeDashstyle"},b);void 0!=a.strokeLinecap&&this.writeNode("CssParameter",{symbolizer:a,key:"strokeLinecap"},b);return b},CssParameter:function(a){return this.createElementNSPlus("sld:CssParameter",{attributes:{name:this.getCssProperty(a.key)},value:a.symbolizer[a.key]})},TextSymbolizer:function(a){var b=this.createElementNSPlus("sld:TextSymbolizer");null!=a.label&&this.writeNode("Label",a.label,b);(null!=a.fontFamily||null!=a.fontSize||
null!=a.fontWeight||null!=a.fontStyle)&&this.writeNode("Font",a,b);(null!=a.labelAnchorPointX||null!=a.labelAnchorPointY||null!=a.labelAlign||null!=a.labelXOffset||null!=a.labelYOffset||null!=a.labelRotation||null!=a.labelPerpendicularOffset)&&this.writeNode("LabelPlacement",a,b);(null!=a.haloRadius||null!=a.haloColor||null!=a.haloOpacity)&&this.writeNode("Halo",a,b);(null!=a.fontColor||null!=a.fontOpacity)&&this.writeNode("Fill",{fillColor:a.fontColor,fillOpacity:a.fontOpacity},b);return b},LabelPlacement:function(a){var b=
this.createElementNSPlus("sld:LabelPlacement");(null!=a.labelAnchorPointX||null!=a.labelAnchorPointY||null!=a.labelAlign||null!=a.labelXOffset||null!=a.labelYOffset||null!=a.labelRotation)&&null==a.labelPerpendicularOffset&&this.writeNode("PointPlacement",a,b);null!=a.labelPerpendicularOffset&&this.writeNode("LinePlacement",a,b);return b},LinePlacement:function(a){var b=this.createElementNSPlus("sld:LinePlacement");this.writeNode("PerpendicularOffset",a.labelPerpendicularOffset,b);return b},PerpendicularOffset:function(a){return this.createElementNSPlus("sld:PerpendicularOffset",
{value:a})},PointPlacement:function(a){var b=this.createElementNSPlus("sld:PointPlacement");(null!=a.labelAnchorPointX||null!=a.labelAnchorPointY||null!=a.labelAlign)&&this.writeNode("AnchorPoint",a,b);(null!=a.labelXOffset||null!=a.labelYOffset)&&this.writeNode("Displacement",a,b);null!=a.labelRotation&&this.writeNode("Rotation",a.labelRotation,b);return b},AnchorPoint:function(a){var b=this.createElementNSPlus("sld:AnchorPoint"),c=a.labelAnchorPointX,d=a.labelAnchorPointY;null!=c&&this.writeNode("AnchorPointX",
c,b);null!=d&&this.writeNode("AnchorPointY",d,b);if(null==c&&null==d){var e=a.labelAlign.substr(0,1),a=a.labelAlign.substr(1,1);"l"===e?c=0:"c"===e?c=0.5:"r"===e&&(c=1);"b"===a?d=0:"m"===a?d=0.5:"t"===a&&(d=1);this.writeNode("AnchorPointX",c,b);this.writeNode("AnchorPointY",d,b)}return b},AnchorPointX:function(a){return this.createElementNSPlus("sld:AnchorPointX",{value:a})},AnchorPointY:function(a){return this.createElementNSPlus("sld:AnchorPointY",{value:a})},Displacement:function(a){var b=this.createElementNSPlus("sld:Displacement");
null!=a.labelXOffset&&this.writeNode("DisplacementX",a.labelXOffset,b);null!=a.labelYOffset&&this.writeNode("DisplacementY",a.labelYOffset,b);return b},DisplacementX:function(a){return this.createElementNSPlus("sld:DisplacementX",{value:a})},DisplacementY:function(a){return this.createElementNSPlus("sld:DisplacementY",{value:a})},Font:function(a){var b=this.createElementNSPlus("sld:Font");a.fontFamily&&this.writeNode("CssParameter",{symbolizer:a,key:"fontFamily"},b);a.fontSize&&this.writeNode("CssParameter",
{symbolizer:a,key:"fontSize"},b);a.fontWeight&&this.writeNode("CssParameter",{symbolizer:a,key:"fontWeight"},b);a.fontStyle&&this.writeNode("CssParameter",{symbolizer:a,key:"fontStyle"},b);return b},Label:function(a){return this.writers.sld._OGCExpression.call(this,"sld:Label",a)},Halo:function(a){var b=this.createElementNSPlus("sld:Halo");a.haloRadius&&this.writeNode("Radius",a.haloRadius,b);(a.haloColor||a.haloOpacity)&&this.writeNode("Fill",{fillColor:a.haloColor,fillOpacity:a.haloOpacity},b);
return b},Radius:function(a){return this.createElementNSPlus("sld:Radius",{value:a})},RasterSymbolizer:function(a){var b=this.createElementNSPlus("sld:RasterSymbolizer");a.geometry&&this.writeNode("Geometry",a.geometry,b);a.opacity&&this.writeNode("Opacity",a.opacity,b);a.colorMap&&this.writeNode("ColorMap",a.colorMap,b);return b},Geometry:function(a){var b=this.createElementNSPlus("sld:Geometry");a.property&&this.writeNode("ogc:PropertyName",a,b);return b},ColorMap:function(a){for(var b=this.createElementNSPlus("sld:ColorMap"),
c=0,d=a.length;c<d;++c)this.writeNode("ColorMapEntry",a[c],b);return b},ColorMapEntry:function(a){var b=this.createElementNSPlus("sld:ColorMapEntry");b.setAttribute("color",a.color);void 0!==a.opacity&&b.setAttribute("opacity",parseFloat(a.opacity));void 0!==a.quantity&&b.setAttribute("quantity",parseFloat(a.quantity));void 0!==a.label&&b.setAttribute("label",a.label);return b},PolygonSymbolizer:function(a){var b=this.createElementNSPlus("sld:PolygonSymbolizer");!1!==a.fill&&this.writeNode("Fill",
a,b);!1!==a.stroke&&this.writeNode("Stroke",a,b);return b},Fill:function(a){var b=this.createElementNSPlus("sld:Fill");a.fillColor&&this.writeNode("CssParameter",{symbolizer:a,key:"fillColor"},b);null!=a.fillOpacity&&this.writeNode("CssParameter",{symbolizer:a,key:"fillOpacity"},b);return b},PointSymbolizer:function(a){var b=this.createElementNSPlus("sld:PointSymbolizer");this.writeNode("Graphic",a,b);return b},Graphic:function(a){var b=this.createElementNSPlus("sld:Graphic");void 0!=a.externalGraphic?
this.writeNode("ExternalGraphic",a,b):this.writeNode("Mark",a,b);void 0!=a.graphicOpacity&&this.writeNode("Opacity",a.graphicOpacity,b);void 0!=a.pointRadius?this.writeNode("Size",2*a.pointRadius,b):void 0!=a.graphicWidth&&this.writeNode("Size",a.graphicWidth,b);void 0!=a.rotation&&this.writeNode("Rotation",a.rotation,b);return b},ExternalGraphic:function(a){var b=this.createElementNSPlus("sld:ExternalGraphic");this.writeNode("OnlineResource",a.externalGraphic,b);this.writeNode("Format",a.graphicFormat||
this.getGraphicFormat(a.externalGraphic),b);return b},Mark:function(a){var b=this.createElementNSPlus("sld:Mark");a.graphicName&&this.writeNode("WellKnownName",a.graphicName,b);!1!==a.fill&&this.writeNode("Fill",a,b);!1!==a.stroke&&this.writeNode("Stroke",a,b);return b},WellKnownName:function(a){return this.createElementNSPlus("sld:WellKnownName",{value:a})},Opacity:function(a){return this.createElementNSPlus("sld:Opacity",{value:a})},Size:function(a){return this.writers.sld._OGCExpression.call(this,
"sld:Size",a)},Rotation:function(a){return this.createElementNSPlus("sld:Rotation",{value:a})},OnlineResource:function(a){return this.createElementNSPlus("sld:OnlineResource",{attributes:{"xlink:type":"simple","xlink:href":a}})},Format:function(a){return this.createElementNSPlus("sld:Format",{value:a})}}},OpenLayers.Format.Filter.v1_0_0.prototype.writers),CLASS_NAME:"OpenLayers.Format.SLD.v1"});OpenLayers.Layer.WMS=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{service:"WMS",version:"1.1.1",request:"GetMap",styles:"",format:"image/jpeg"},isBaseLayer:!0,encodeBBOX:!1,noMagic:!1,yx:{},initialize:function(a,b,c,d){var e=[],c=OpenLayers.Util.upperCaseObject(c);1.3<=parseFloat(c.VERSION)&&!c.EXCEPTIONS&&(c.EXCEPTIONS="INIMAGE");e.push(a,b,c,d);OpenLayers.Layer.Grid.prototype.initialize.apply(this,e);OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));
if(!this.noMagic&&this.params.TRANSPARENT&&"true"==this.params.TRANSPARENT.toString().toLowerCase()){if(null==d||!d.isBaseLayer)this.isBaseLayer=!1;"image/jpeg"==this.params.FORMAT&&(this.params.FORMAT=OpenLayers.Util.alphaHack()?"image/gif":"image/png")}},clone:function(a){null==a&&(a=new OpenLayers.Layer.WMS(this.name,this.url,this.params,this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},reverseAxisOrder:function(){var a=this.projection.getCode();return 1.3<=parseFloat(this.params.VERSION)&&
!(!this.yx[a]&&!OpenLayers.Projection.defaults[a].yx)},getURL:function(a){var a=this.adjustBounds(a),b=this.getImageSize(),c={},d=this.reverseAxisOrder();c.BBOX=this.encodeBBOX?a.toBBOX(null,d):a.toArray(d);c.WIDTH=b.w;c.HEIGHT=b.h;return this.getFullRequestString(c)},mergeNewParams:function(a){a=[OpenLayers.Util.upperCaseObject(a)];return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,a)},getFullRequestString:function(a,b){var c=this.map.getProjectionObject(),c=this.projection&&this.projection.equals(c)?
this.projection.getCode():c.getCode(),c="none"==c?null:c;1.3<=parseFloat(this.params.VERSION)?this.params.CRS=c:this.params.SRS=c;"boolean"==typeof this.params.TRANSPARENT&&(a.TRANSPARENT=this.params.TRANSPARENT?"TRUE":"FALSE");return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,arguments)},CLASS_NAME:"OpenLayers.Layer.WMS"});OpenLayers.Format.WMC.v1_1_0=OpenLayers.Class(OpenLayers.Format.WMC.v1,{VERSION:"1.1.0",schemaLocation:"http://www.opengis.net/context http://schemas.opengis.net/context/1.1.0/context.xsd",initialize:function(a){OpenLayers.Format.WMC.v1.prototype.initialize.apply(this,[a])},read_sld_MinScaleDenominator:function(a,b){var c=parseFloat(this.getChildValue(b));0<c&&(a.maxScale=c)},read_sld_MaxScaleDenominator:function(a,b){a.minScale=parseFloat(this.getChildValue(b))},read_wmc_SRS:function(a,b){"srs"in
a||(a.srs={});a.srs[this.getChildValue(b)]=!0},write_wmc_Layer:function(a){var b=OpenLayers.Format.WMC.v1.prototype.write_wmc_Layer.apply(this,[a]);if(a.maxScale){var c=this.createElementNS(this.namespaces.sld,"sld:MinScaleDenominator");c.appendChild(this.createTextNode(a.maxScale.toPrecision(16)));b.appendChild(c)}a.minScale&&(c=this.createElementNS(this.namespaces.sld,"sld:MaxScaleDenominator"),c.appendChild(this.createTextNode(a.minScale.toPrecision(16))),b.appendChild(c));if(a.srs)for(var d in a.srs)b.appendChild(this.createElementDefaultNS("SRS",
d));b.appendChild(this.write_wmc_FormatList(a));b.appendChild(this.write_wmc_StyleList(a));a.dimensions&&b.appendChild(this.write_wmc_DimensionList(a));b.appendChild(this.write_wmc_LayerExtension(a));return b},CLASS_NAME:"OpenLayers.Format.WMC.v1_1_0"});OpenLayers.Format.XLS=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.1.0",stringifyOutput:!0,CLASS_NAME:"OpenLayers.Format.XLS"});OpenLayers.Format.XLS.v1=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{xls:"http://www.opengis.net/xls",gml:"http://www.opengis.net/gml",xsi:"http://www.w3.org/2001/XMLSchema-instance"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},xy:!0,defaultPrefix:"xls",schemaLocation:null,read:function(a,b){OpenLayers.Util.applyDefaults(b,this.options);var c={};this.readChildNodes(a,c);return c},readers:{xls:{XLS:function(a,b){b.version=a.getAttribute("version");
this.readChildNodes(a,b)},Response:function(a,b){this.readChildNodes(a,b)},GeocodeResponse:function(a,b){b.responseLists=[];this.readChildNodes(a,b)},GeocodeResponseList:function(a,b){var c={features:[],numberOfGeocodedAddresses:parseInt(a.getAttribute("numberOfGeocodedAddresses"))};b.responseLists.push(c);this.readChildNodes(a,c)},GeocodedAddress:function(a,b){var c=new OpenLayers.Feature.Vector;b.features.push(c);this.readChildNodes(a,c);c.geometry=c.components[0]},GeocodeMatchCode:function(a,b){b.attributes.matchCode=
{accuracy:parseFloat(a.getAttribute("accuracy")),matchType:a.getAttribute("matchType")}},Address:function(a,b){var c={countryCode:a.getAttribute("countryCode"),addressee:a.getAttribute("addressee"),street:[],place:[]};b.attributes.address=c;this.readChildNodes(a,c)},freeFormAddress:function(a,b){b.freeFormAddress=this.getChildValue(a)},StreetAddress:function(a,b){this.readChildNodes(a,b)},Building:function(a,b){b.building={number:a.getAttribute("number"),subdivision:a.getAttribute("subdivision"),
buildingName:a.getAttribute("buildingName")}},Street:function(a,b){b.street.push(this.getChildValue(a))},Place:function(a,b){b.place[a.getAttribute("type")]=this.getChildValue(a)},PostalCode:function(a,b){b.postalCode=this.getChildValue(a)}},gml:OpenLayers.Format.GML.v3.prototype.readers.gml},write:function(a){return this.writers.xls.XLS.apply(this,[a])},writers:{xls:{XLS:function(a){var b=this.createElementNSPlus("xls:XLS",{attributes:{version:this.VERSION,"xsi:schemaLocation":this.schemaLocation}});
this.writeNode("RequestHeader",a.header,b);this.writeNode("Request",a,b);return b},RequestHeader:function(){return this.createElementNSPlus("xls:RequestHeader")},Request:function(a){var b=this.createElementNSPlus("xls:Request",{attributes:{methodName:"GeocodeRequest",requestID:a.requestID||"",version:this.VERSION}});this.writeNode("GeocodeRequest",a.addresses,b);return b},GeocodeRequest:function(a){for(var b=this.createElementNSPlus("xls:GeocodeRequest"),c=0,d=a.length;c<d;c++)this.writeNode("Address",
a[c],b);return b},Address:function(a){var b=this.createElementNSPlus("xls:Address",{attributes:{countryCode:a.countryCode}});a.freeFormAddress?this.writeNode("freeFormAddress",a.freeFormAddress,b):(a.street&&this.writeNode("StreetAddress",a,b),a.municipality&&this.writeNode("Municipality",a.municipality,b),a.countrySubdivision&&this.writeNode("CountrySubdivision",a.countrySubdivision,b),a.postalCode&&this.writeNode("PostalCode",a.postalCode,b));return b},freeFormAddress:function(a){return this.createElementNSPlus("freeFormAddress",
{value:a})},StreetAddress:function(a){var b=this.createElementNSPlus("xls:StreetAddress");a.building&&this.writeNode(b,"Building",a.building);a=a.street;OpenLayers.Util.isArray(a)||(a=[a]);for(var c=0,d=a.length;c<d;c++)this.writeNode("Street",a[c],b);return b},Building:function(a){return this.createElementNSPlus("xls:Building",{attributes:{number:a.number,subdivision:a.subdivision,buildingName:a.buildingName}})},Street:function(a){return this.createElementNSPlus("xls:Street",{value:a})},Municipality:function(a){return this.createElementNSPlus("xls:Place",
{attributes:{type:"Municipality"},value:a})},CountrySubdivision:function(a){return this.createElementNSPlus("xls:Place",{attributes:{type:"CountrySubdivision"},value:a})},PostalCode:function(a){return this.createElementNSPlus("xls:PostalCode",{value:a})}}},CLASS_NAME:"OpenLayers.Format.XLS.v1"});OpenLayers.Format.XLS.v1_1_0=OpenLayers.Class(OpenLayers.Format.XLS.v1,{VERSION:"1.1",schemaLocation:"http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/LocationUtilityService.xsd",CLASS_NAME:"OpenLayers.Format.XLS.v1_1_0"});OpenLayers.Format.XLS.v1_1=OpenLayers.Format.XLS.v1_1_0;OpenLayers.Renderer.SVG=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"http://www.w3.org/2000/svg",xlinkns:"http://www.w3.org/1999/xlink",MAX_PIXEL:15E3,translationParameters:null,symbolMetrics:null,initialize:function(a){this.supported()&&(OpenLayers.Renderer.Elements.prototype.initialize.apply(this,arguments),this.translationParameters={x:0,y:0},this.symbolMetrics={})},supported:function(){return document.implementation&&(document.implementation.hasFeature("org.w3c.svg","1.0")||document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#SVG",
"1.1")||document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1"))},inValidRange:function(a,b,c){a+=c?0:this.translationParameters.x;b+=c?0:this.translationParameters.y;return a>=-this.MAX_PIXEL&&a<=this.MAX_PIXEL&&b>=-this.MAX_PIXEL&&b<=this.MAX_PIXEL},setExtent:function(a,b){var c=OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments),d=this.getResolution(),e=-a.left/d,d=a.top/d;if(b)return this.left=e,this.top=d,this.rendererRoot.setAttributeNS(null,
"viewBox","0 0 "+this.size.w+" "+this.size.h),this.translate(this.xOffset,0),!0;(e=this.translate(e-this.left+this.xOffset,d-this.top))||this.setExtent(a,!0);return c&&e},translate:function(a,b){if(this.inValidRange(a,b,!0)){var c="";if(a||b)c="translate("+a+","+b+")";this.root.setAttributeNS(null,"transform",c);this.translationParameters={x:a,y:b};return!0}return!1},setSize:function(a){OpenLayers.Renderer.prototype.setSize.apply(this,arguments);this.rendererRoot.setAttributeNS(null,"width",this.size.w);
this.rendererRoot.setAttributeNS(null,"height",this.size.h)},getNodeType:function(a,b){var c=null;switch(a.CLASS_NAME){case "OpenLayers.Geometry.Point":c=b.externalGraphic?"image":this.isComplexSymbol(b.graphicName)?"svg":"circle";break;case "OpenLayers.Geometry.Rectangle":c="rect";break;case "OpenLayers.Geometry.LineString":c="polyline";break;case "OpenLayers.Geometry.LinearRing":c="polygon";break;case "OpenLayers.Geometry.Polygon":case "OpenLayers.Geometry.Curve":c="path"}return c},setStyle:function(a,
b,c){var b=b||a._style,c=c||a._options,d=parseFloat(a.getAttributeNS(null,"r")),e=1,f;if("OpenLayers.Geometry.Point"==a._geometryClass&&d){a.style.visibility="";if(!1===b.graphic)a.style.visibility="hidden";else if(b.externalGraphic){f=this.getPosition(a);b.graphicTitle&&(a.setAttributeNS(null,"title",b.graphicTitle),d=a.getElementsByTagName("title"),0<d.length?d[0].firstChild.textContent=b.graphicTitle:(d=this.nodeFactory(null,"title"),d.textContent=b.graphicTitle,a.appendChild(d)));b.graphicWidth&&
b.graphicHeight&&a.setAttributeNS(null,"preserveAspectRatio","none");var d=b.graphicWidth||b.graphicHeight,g=b.graphicHeight||b.graphicWidth,d=d?d:2*b.pointRadius,g=g?g:2*b.pointRadius,h=void 0!=b.graphicYOffset?b.graphicYOffset:-(0.5*g),i=b.graphicOpacity||b.fillOpacity;a.setAttributeNS(null,"x",(f.x+(void 0!=b.graphicXOffset?b.graphicXOffset:-(0.5*d))).toFixed());a.setAttributeNS(null,"y",(f.y+h).toFixed());a.setAttributeNS(null,"width",d);a.setAttributeNS(null,"height",g);a.setAttributeNS(this.xlinkns,
"href",b.externalGraphic);a.setAttributeNS(null,"style","opacity: "+i);a.onclick=OpenLayers.Renderer.SVG.preventDefault}else if(this.isComplexSymbol(b.graphicName)){var d=3*b.pointRadius,g=2*d,j=this.importSymbol(b.graphicName);f=this.getPosition(a);e=3*this.symbolMetrics[j.id][0]/g;h=a.parentNode;i=a.nextSibling;h&&h.removeChild(a);a.firstChild&&a.removeChild(a.firstChild);a.appendChild(j.firstChild.cloneNode(!0));a.setAttributeNS(null,"viewBox",j.getAttributeNS(null,"viewBox"));a.setAttributeNS(null,
"width",g);a.setAttributeNS(null,"height",g);a.setAttributeNS(null,"x",f.x-d);a.setAttributeNS(null,"y",f.y-d);i?h.insertBefore(a,i):h&&h.appendChild(a)}else a.setAttributeNS(null,"r",b.pointRadius);d=b.rotation;if((void 0!==d||void 0!==a._rotation)&&f)a._rotation=d,d|=0,"svg"!==a.nodeName?a.setAttributeNS(null,"transform","rotate("+d+" "+f.x+" "+f.y+")"):(f=this.symbolMetrics[j.id],a.firstChild.setAttributeNS(null,"transform","rotate("+d+" "+f[1]+" "+f[2]+")"))}c.isFilled?(a.setAttributeNS(null,
"fill",b.fillColor),a.setAttributeNS(null,"fill-opacity",b.fillOpacity)):a.setAttributeNS(null,"fill","none");c.isStroked?(a.setAttributeNS(null,"stroke",b.strokeColor),a.setAttributeNS(null,"stroke-opacity",b.strokeOpacity),a.setAttributeNS(null,"stroke-width",b.strokeWidth*e),a.setAttributeNS(null,"stroke-linecap",b.strokeLinecap||"round"),a.setAttributeNS(null,"stroke-linejoin","round"),b.strokeDashstyle&&a.setAttributeNS(null,"stroke-dasharray",this.dashStyle(b,e))):a.setAttributeNS(null,"stroke",
"none");b.pointerEvents&&a.setAttributeNS(null,"pointer-events",b.pointerEvents);null!=b.cursor&&a.setAttributeNS(null,"cursor",b.cursor);return a},dashStyle:function(a,b){var c=a.strokeWidth*b,d=a.strokeDashstyle;switch(d){case "solid":return"none";case "dot":return[1,4*c].join();case "dash":return[4*c,4*c].join();case "dashdot":return[4*c,4*c,1,4*c].join();case "longdash":return[8*c,4*c].join();case "longdashdot":return[8*c,4*c,1,4*c].join();default:return OpenLayers.String.trim(d).replace(/\s+/g,
",")}},createNode:function(a,b){var c=document.createElementNS(this.xmlns,a);b&&c.setAttributeNS(null,"id",b);return c},nodeTypeCompare:function(a,b){return b==a.nodeName},createRenderRoot:function(){var a=this.nodeFactory(this.container.id+"_svgRoot","svg");a.style.display="block";return a},createRoot:function(a){return this.nodeFactory(this.container.id+a,"g")},createDefs:function(){var a=this.nodeFactory(this.container.id+"_defs","defs");this.rendererRoot.appendChild(a);return a},drawPoint:function(a,
b){return this.drawCircle(a,b,1)},drawCircle:function(a,b,c){var d=this.getResolution(),e=(b.x-this.featureDx)/d+this.left,b=this.top-b.y/d;return this.inValidRange(e,b)?(a.setAttributeNS(null,"cx",e),a.setAttributeNS(null,"cy",b),a.setAttributeNS(null,"r",c),a):!1},drawLineString:function(a,b){var c=this.getComponentsString(b.components);return c.path?(a.setAttributeNS(null,"points",c.path),c.complete?a:null):!1},drawLinearRing:function(a,b){var c=this.getComponentsString(b.components);return c.path?
(a.setAttributeNS(null,"points",c.path),c.complete?a:null):!1},drawPolygon:function(a,b){for(var c="",d=!0,e=!0,f,g,h=0,i=b.components.length;h<i;h++)c+=" M",f=this.getComponentsString(b.components[h].components," "),(g=f.path)?(c+=" "+g,e=f.complete&&e):d=!1;return d?(a.setAttributeNS(null,"d",c+" z"),a.setAttributeNS(null,"fill-rule","evenodd"),e?a:null):!1},drawRectangle:function(a,b){var c=this.getResolution(),d=(b.x-this.featureDx)/c+this.left,e=this.top-b.y/c;return this.inValidRange(d,e)?(a.setAttributeNS(null,
"x",d),a.setAttributeNS(null,"y",e),a.setAttributeNS(null,"width",b.width/c),a.setAttributeNS(null,"height",b.height/c),a):!1},drawText:function(a,b,c){var d=!!b.labelOutlineWidth;if(d){var e=OpenLayers.Util.extend({},b);e.fontColor=e.labelOutlineColor;e.fontStrokeColor=e.labelOutlineColor;e.fontStrokeWidth=b.labelOutlineWidth;delete e.labelOutlineWidth;this.drawText(a,e,c)}var f=this.getResolution(),e=(c.x-this.featureDx)/f+this.left,g=c.y/f-this.top,d=d?this.LABEL_OUTLINE_SUFFIX:this.LABEL_ID_SUFFIX,
f=this.nodeFactory(a+d,"text");f.setAttributeNS(null,"x",e);f.setAttributeNS(null,"y",-g);b.fontColor&&f.setAttributeNS(null,"fill",b.fontColor);b.fontStrokeColor&&f.setAttributeNS(null,"stroke",b.fontStrokeColor);b.fontStrokeWidth&&f.setAttributeNS(null,"stroke-width",b.fontStrokeWidth);b.fontOpacity&&f.setAttributeNS(null,"opacity",b.fontOpacity);b.fontFamily&&f.setAttributeNS(null,"font-family",b.fontFamily);b.fontSize&&f.setAttributeNS(null,"font-size",b.fontSize);b.fontWeight&&f.setAttributeNS(null,
"font-weight",b.fontWeight);b.fontStyle&&f.setAttributeNS(null,"font-style",b.fontStyle);!0===b.labelSelect?(f.setAttributeNS(null,"pointer-events","visible"),f._featureId=a):f.setAttributeNS(null,"pointer-events","none");g=b.labelAlign||OpenLayers.Renderer.defaultSymbolizer.labelAlign;f.setAttributeNS(null,"text-anchor",OpenLayers.Renderer.SVG.LABEL_ALIGN[g[0]]||"middle");!0===OpenLayers.IS_GECKO&&f.setAttributeNS(null,"dominant-baseline",OpenLayers.Renderer.SVG.LABEL_ALIGN[g[1]]||"central");for(var h=
b.label.split("\n"),i=h.length;f.childNodes.length>i;)f.removeChild(f.lastChild);for(var j=0;j<i;j++){var k=this.nodeFactory(a+d+"_tspan_"+j,"tspan");!0===b.labelSelect&&(k._featureId=a,k._geometry=c,k._geometryClass=c.CLASS_NAME);!1===OpenLayers.IS_GECKO&&k.setAttributeNS(null,"baseline-shift",OpenLayers.Renderer.SVG.LABEL_VSHIFT[g[1]]||"-35%");k.setAttribute("x",e);if(0==j){var l=OpenLayers.Renderer.SVG.LABEL_VFACTOR[g[1]];null==l&&(l=-0.5);k.setAttribute("dy",l*(i-1)+"em")}else k.setAttribute("dy",
"1em");k.textContent=""===h[j]?" ":h[j];k.parentNode||f.appendChild(k)}f.parentNode||this.textRoot.appendChild(f)},getComponentsString:function(a,b){for(var c=[],d=!0,e=a.length,f=[],g,h=0;h<e;h++)g=a[h],c.push(g),(g=this.getShortString(g))?f.push(g):(0<h&&this.getShortString(a[h-1])&&f.push(this.clipLine(a[h],a[h-1])),h<e-1&&this.getShortString(a[h+1])&&f.push(this.clipLine(a[h],a[h+1])),d=!1);return{path:f.join(b||","),complete:d}},clipLine:function(a,b){if(b.equals(a))return"";var c=this.getResolution(),
d=this.MAX_PIXEL-this.translationParameters.x,e=this.MAX_PIXEL-this.translationParameters.y,f=(b.x-this.featureDx)/c+this.left,g=this.top-b.y/c,h=(a.x-this.featureDx)/c+this.left,c=this.top-a.y/c,i;if(h<-d||h>d)i=(c-g)/(h-f),h=0>h?-d:d,c=g+(h-f)*i;if(c<-e||c>e)i=(h-f)/(c-g),c=0>c?-e:e,h=f+(c-g)*i;return h+","+c},getShortString:function(a){var b=this.getResolution(),c=(a.x-this.featureDx)/b+this.left,a=this.top-a.y/b;return this.inValidRange(c,a)?c+","+a:!1},getPosition:function(a){return{x:parseFloat(a.getAttributeNS(null,
"cx")),y:parseFloat(a.getAttributeNS(null,"cy"))}},importSymbol:function(a){this.defs||(this.defs=this.createDefs());var b=this.container.id+"-"+a,c=document.getElementById(b);if(null!=c)return c;var d=OpenLayers.Renderer.symbol[a];if(!d)throw Error(a+" is not a valid symbol name");var a=this.nodeFactory(b,"symbol"),e=this.nodeFactory(null,"polygon");a.appendChild(e);for(var c=new OpenLayers.Bounds(Number.MAX_VALUE,Number.MAX_VALUE,0,0),f=[],g,h,i=0;i<d.length;i+=2)g=d[i],h=d[i+1],c.left=Math.min(c.left,
g),c.bottom=Math.min(c.bottom,h),c.right=Math.max(c.right,g),c.top=Math.max(c.top,h),f.push(g,",",h);e.setAttributeNS(null,"points",f.join(" "));d=c.getWidth();e=c.getHeight();a.setAttributeNS(null,"viewBox",[c.left-d,c.bottom-e,3*d,3*e].join(" "));this.symbolMetrics[b]=[Math.max(d,e),c.getCenterLonLat().lon,c.getCenterLonLat().lat];this.defs.appendChild(a);return a},getFeatureIdFromEvent:function(a){var b=OpenLayers.Renderer.Elements.prototype.getFeatureIdFromEvent.apply(this,arguments);b||(b=a.target,
b=b.parentNode&&b!=this.rendererRoot?b.parentNode._featureId:void 0);return b},CLASS_NAME:"OpenLayers.Renderer.SVG"});OpenLayers.Renderer.SVG.LABEL_ALIGN={l:"start",r:"end",b:"bottom",t:"hanging"};OpenLayers.Renderer.SVG.LABEL_VSHIFT={t:"-70%",b:"0"};OpenLayers.Renderer.SVG.LABEL_VFACTOR={t:0,b:-1};OpenLayers.Renderer.SVG.preventDefault=function(a){a.preventDefault&&a.preventDefault()};OpenLayers.Format.SLD.v1_0_0=OpenLayers.Class(OpenLayers.Format.SLD.v1,{VERSION:"1.0.0",schemaLocation:"http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd",CLASS_NAME:"OpenLayers.Format.SLD.v1_0_0"});OpenLayers.Format.OWSContext=OpenLayers.Class(OpenLayers.Format.Context,{defaultVersion:"0.3.1",getVersion:function(a,b){var c=OpenLayers.Format.XML.VersionedOGC.prototype.getVersion.apply(this,arguments);"0.3.0"===c&&(c=this.defaultVersion);return c},toContext:function(a){var b={};"OpenLayers.Map"==a.CLASS_NAME&&(b.bounds=a.getExtent(),b.maxExtent=a.maxExtent,b.projection=a.projection,b.size=a.getSize(),b.layers=a.layers);return b},CLASS_NAME:"OpenLayers.Format.OWSContext"});OpenLayers.Format.OWSContext.v0_3_1=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{owc:"http://www.opengis.net/ows-context",gml:"http://www.opengis.net/gml",kml:"http://www.opengis.net/kml/2.2",ogc:"http://www.opengis.net/ogc",ows:"http://www.opengis.net/ows",sld:"http://www.opengis.net/sld",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},VERSION:"0.3.1",schemaLocation:"http://www.opengis.net/ows-context http://www.ogcnetwork.net/schemas/owc/0.3.1/owsContext.xsd",
defaultPrefix:"owc",extractAttributes:!0,xy:!0,regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},featureNS:"http://mapserver.gis.umn.edu/mapserver",featureType:"vector",geometryName:"geometry",nestingLayerLookup:null,initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a]);OpenLayers.Format.GML.v2.prototype.setGeometryTypes.call(this)},setNestingPath:function(a){if(a.layersContext)for(var b=0,c=a.layersContext.length;b<c;b++){var d=
a.layersContext[b],e=[],f=a.title||"";a.metadata&&a.metadata.nestingPath&&(e=a.metadata.nestingPath.slice());""!=f&&e.push(f);d.metadata.nestingPath=e;d.layersContext&&this.setNestingPath(d)}},decomposeNestingPath:function(a){var b=[];if(OpenLayers.Util.isArray(a)){for(a=a.slice();0<a.length;)b.push(a.slice()),a.pop();b.reverse()}return b},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,
b);this.setNestingPath({layersContext:b.layersContext});a=[];this.processLayer(a,b);delete b.layersContext;b.layersContext=a;return b},processLayer:function(a,b){if(b.layersContext)for(var c=0,d=b.layersContext.length;c<d;c++){var e=b.layersContext[c];a.push(e);e.layersContext&&this.processLayer(a,e)}},write:function(a,b){this.nestingLayerLookup={};b=b||{};OpenLayers.Util.applyDefaults(b,a);var c=this.writeNode("OWSContext",b);this.nestingLayerLookup=null;this.setAttributeNS(c,this.namespaces.xsi,
"xsi:schemaLocation",this.schemaLocation);return OpenLayers.Format.XML.prototype.write.apply(this,[c])},readers:{kml:{Document:function(a,b){b.features=(new OpenLayers.Format.KML({kmlns:this.namespaces.kml,extractStyles:!0})).read(a)}},owc:{OWSContext:function(a,b){this.readChildNodes(a,b)},General:function(a,b){this.readChildNodes(a,b)},ResourceList:function(a,b){this.readChildNodes(a,b)},Layer:function(a,b){var c={metadata:{},visibility:"1"!=a.getAttribute("hidden"),queryable:"1"==a.getAttribute("queryable"),
opacity:null!=a.getAttribute("opacity")?parseFloat(a.getAttribute("opacity")):null,name:a.getAttribute("name"),categoryLayer:null==a.getAttribute("name"),formats:[],styles:[]};b.layersContext||(b.layersContext=[]);b.layersContext.push(c);this.readChildNodes(a,c)},InlineGeometry:function(a,b){b.features=[];var c=this.getElementsByTagNameNS(a,this.namespaces.gml,"featureMember"),d;1<=c.length&&(d=c[0]);d&&d.firstChild&&(c=d.firstChild.nextSibling?d.firstChild.nextSibling:d.firstChild,this.setNamespace("feature",
c.namespaceURI),this.featureType=c.localName||c.nodeName.split(":").pop(),this.readChildNodes(a,b))},Server:function(a,b){if(!b.service&&!b.version||b.service!=OpenLayers.Format.Context.serviceTypes.WMS)b.service=a.getAttribute("service"),b.version=a.getAttribute("version"),this.readChildNodes(a,b)},Name:function(a,b){b.name=this.getChildValue(a);this.readChildNodes(a,b)},Title:function(a,b){b.title=this.getChildValue(a);this.readChildNodes(a,b)},StyleList:function(a,b){this.readChildNodes(a,b.styles)},
Style:function(a,b){var c={};b.push(c);this.readChildNodes(a,c)},LegendURL:function(a,b){var c={};b.legend=c;this.readChildNodes(a,c)},OnlineResource:function(a,b){b.url=this.getAttributeNS(a,this.namespaces.xlink,"href");this.readChildNodes(a,b)}},ows:OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows,gml:OpenLayers.Format.GML.v2.prototype.readers.gml,sld:OpenLayers.Format.SLD.v1_0_0.prototype.readers.sld,feature:OpenLayers.Format.GML.v2.prototype.readers.feature},writers:{owc:{OWSContext:function(a){var b=
this.createElementNSPlus("OWSContext",{attributes:{version:this.VERSION,id:a.id||OpenLayers.Util.createUniqueID("OpenLayers_OWSContext_")}});this.writeNode("General",a,b);this.writeNode("ResourceList",a,b);return b},General:function(a){var b=this.createElementNSPlus("General");this.writeNode("ows:BoundingBox",a,b);this.writeNode("ows:Title",a.title||"OpenLayers OWSContext",b);return b},ResourceList:function(a){for(var b=this.createElementNSPlus("ResourceList"),c=0,d=a.layers.length;c<d;c++){var e=
a.layers[c],f=this.decomposeNestingPath(e.metadata.nestingPath);this.writeNode("_Layer",{layer:e,subPaths:f},b)}return b},Server:function(a){var b=this.createElementNSPlus("Server",{attributes:{version:a.version,service:a.service}});this.writeNode("OnlineResource",a,b);return b},OnlineResource:function(a){return this.createElementNSPlus("OnlineResource",{attributes:{"xlink:href":a.url}})},InlineGeometry:function(a){var b=this.createElementNSPlus("InlineGeometry");this.writeNode("gml:boundedBy",a.getDataExtent(),
b);for(var c=0,d=a.features.length;c<d;c++)this.writeNode("gml:featureMember",a.features[c],b);return b},StyleList:function(a){for(var b=this.createElementNSPlus("StyleList"),c=0,d=a.length;c<d;c++)this.writeNode("Style",a[c],b);return b},Style:function(a){var b=this.createElementNSPlus("Style");this.writeNode("Name",a,b);this.writeNode("Title",a,b);a.legend&&this.writeNode("LegendURL",a,b);return b},Name:function(a){return this.createElementNSPlus("Name",{value:a.name})},Title:function(a){return this.createElementNSPlus("Title",
{value:a.title})},LegendURL:function(a){var b=this.createElementNSPlus("LegendURL");this.writeNode("OnlineResource",a.legend,b);return b},_WMS:function(a){var b=this.createElementNSPlus("Layer",{attributes:{name:a.params.LAYERS,queryable:a.queryable?"1":"0",hidden:a.visibility?"0":"1",opacity:a.hasOwnProperty("opacity")?a.opacity:null}});this.writeNode("ows:Title",a.name,b);this.writeNode("ows:OutputFormat",a.params.FORMAT,b);this.writeNode("Server",{service:OpenLayers.Format.Context.serviceTypes.WMS,
version:a.params.VERSION,url:a.url},b);a.metadata.styles&&0<a.metadata.styles.length&&this.writeNode("StyleList",a.metadata.styles,b);return b},_Layer:function(a){var b,c,d;b=a.layer;c=a.subPaths;d=null;0<c.length?(b=c[0].join("/"),c=b.lastIndexOf("/"),d=this.nestingLayerLookup[b],c=0<c?b.substring(c+1,b.length):b,d||(d=this.createElementNSPlus("Layer"),this.writeNode("ows:Title",c,d),this.nestingLayerLookup[b]=d),a.subPaths.shift(),this.writeNode("_Layer",a,d)):(b instanceof OpenLayers.Layer.WMS?
d=this.writeNode("_WMS",b):b instanceof OpenLayers.Layer.Vector&&(b.protocol instanceof OpenLayers.Protocol.WFS.v1?d=this.writeNode("_WFS",b):b.protocol instanceof OpenLayers.Protocol.HTTP?b.protocol.format instanceof OpenLayers.Format.GML?(b.protocol.format.version="2.1.2",d=this.writeNode("_GML",b)):b.protocol.format instanceof OpenLayers.Format.KML&&(b.protocol.format.version="2.2",d=this.writeNode("_KML",b)):(this.setNamespace("feature",this.featureNS),d=this.writeNode("_InlineGeometry",b))),
b.options.maxScale&&this.writeNode("sld:MinScaleDenominator",b.options.maxScale,d),b.options.minScale&&this.writeNode("sld:MaxScaleDenominator",b.options.minScale,d),this.nestingLayerLookup[b.name]=d);return d},_WFS:function(a){var b=this.createElementNSPlus("Layer",{attributes:{name:a.protocol.featurePrefix+":"+a.protocol.featureType,hidden:a.visibility?"0":"1"}});this.writeNode("ows:Title",a.name,b);this.writeNode("Server",{service:OpenLayers.Format.Context.serviceTypes.WFS,version:a.protocol.version,
url:a.protocol.url},b);return b},_InlineGeometry:function(a){var b=this.createElementNSPlus("Layer",{attributes:{name:this.featureType,hidden:a.visibility?"0":"1"}});this.writeNode("ows:Title",a.name,b);this.writeNode("InlineGeometry",a,b);return b},_GML:function(a){var b=this.createElementNSPlus("Layer");this.writeNode("ows:Title",a.name,b);this.writeNode("Server",{service:OpenLayers.Format.Context.serviceTypes.GML,url:a.protocol.url,version:a.protocol.format.version},b);return b},_KML:function(a){var b=
this.createElementNSPlus("Layer");this.writeNode("ows:Title",a.name,b);this.writeNode("Server",{service:OpenLayers.Format.Context.serviceTypes.KML,version:a.protocol.format.version,url:a.protocol.url},b);return b}},gml:OpenLayers.Util.applyDefaults({boundedBy:function(a){var b=this.createElementNSPlus("gml:boundedBy");this.writeNode("gml:Box",a,b);return b}},OpenLayers.Format.GML.v2.prototype.writers.gml),ows:OpenLayers.Format.OWSCommon.v1_0_0.prototype.writers.ows,sld:OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld,
feature:OpenLayers.Format.GML.v2.prototype.writers.feature},CLASS_NAME:"OpenLayers.Format.OWSContext.v0_3_1"});OpenLayers.Control.ScaleLine=OpenLayers.Class(OpenLayers.Control,{maxWidth:100,topOutUnits:"km",topInUnits:"m",bottomOutUnits:"mi",bottomInUnits:"ft",eTop:null,eBottom:null,geodesic:!1,draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);this.eTop||(this.eTop=document.createElement("div"),this.eTop.className=this.displayClass+"Top",this.div.appendChild(this.eTop),this.eTop.style.visibility=""==this.topOutUnits||""==this.topInUnits?"hidden":"visible",this.eBottom=document.createElement("div"),
this.eBottom.className=this.displayClass+"Bottom",this.div.appendChild(this.eBottom),this.eBottom.style.visibility=""==this.bottomOutUnits||""==this.bottomInUnits?"hidden":"visible");this.map.events.register("moveend",this,this.update);this.update();return this.div},getBarLen:function(a){var b=parseInt(Math.log(a)/Math.log(10)),b=Math.pow(10,b),a=parseInt(a/b);return(5<a?5:2<a?2:1)*b},update:function(){var a=this.map.getResolution();if(a){var b=this.map.getUnits(),c=OpenLayers.INCHES_PER_UNIT,d=this.maxWidth*
a*c[b],e=1;!0===this.geodesic&&(e=(this.map.getGeodesicPixelSize().w||1.0E-6)*this.maxWidth/(d/c.km),d*=e);var f,g;1E5<d?(f=this.topOutUnits,g=this.bottomOutUnits):(f=this.topInUnits,g=this.bottomInUnits);var h=d/c[f],i=d/c[g],d=this.getBarLen(h),j=this.getBarLen(i),h=d/c[b]*c[f],i=j/c[b]*c[g],b=h/a/e,a=i/a/e;"visible"==this.eBottom.style.visibility&&(this.eBottom.style.width=Math.round(a)+"px",this.eBottom.innerHTML=j+" "+g);"visible"==this.eTop.style.visibility&&(this.eTop.style.width=Math.round(b)+
"px",this.eTop.innerHTML=d+" "+f)}},CLASS_NAME:"OpenLayers.Control.ScaleLine"});OpenLayers.Icon=OpenLayers.Class({url:null,size:null,offset:null,calculateOffset:null,imageDiv:null,px:null,initialize:function(a,b,c,d){this.url=a;this.size=b||{w:20,h:20};this.offset=c||{x:-(this.size.w/2),y:-(this.size.h/2)};this.calculateOffset=d;a=OpenLayers.Util.createUniqueID("OL_Icon_");this.imageDiv=OpenLayers.Util.createAlphaImageDiv(a)},destroy:function(){this.erase();OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);this.imageDiv.innerHTML="";this.imageDiv=null},clone:function(){return new OpenLayers.Icon(this.url,
this.size,this.offset,this.calculateOffset)},setSize:function(a){null!=a&&(this.size=a);this.draw()},setUrl:function(a){null!=a&&(this.url=a);this.draw()},draw:function(a){OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,this.size,this.url,"absolute");this.moveTo(a);return this.imageDiv},erase:function(){null!=this.imageDiv&&null!=this.imageDiv.parentNode&&OpenLayers.Element.remove(this.imageDiv)},setOpacity:function(a){OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,
null,null,null,a)},moveTo:function(a){null!=a&&(this.px=a);null!=this.imageDiv&&(null==this.px?this.display(!1):(this.calculateOffset&&(this.offset=this.calculateOffset(this.size)),OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,{x:this.px.x+this.offset.x,y:this.px.y+this.offset.y})))},display:function(a){this.imageDiv.style.display=a?"":"none"},isDrawn:function(){return this.imageDiv&&this.imageDiv.parentNode&&11!=this.imageDiv.parentNode.nodeType},CLASS_NAME:"OpenLayers.Icon"});OpenLayers.Marker=OpenLayers.Class({icon:null,lonlat:null,events:null,map:null,initialize:function(a,b){this.lonlat=a;var c=b?b:OpenLayers.Marker.defaultIcon();null==this.icon?this.icon=c:(this.icon.url=c.url,this.icon.size=c.size,this.icon.offset=c.offset,this.icon.calculateOffset=c.calculateOffset);this.events=new OpenLayers.Events(this,this.icon.imageDiv)},destroy:function(){this.erase();this.map=null;this.events.destroy();this.events=null;null!=this.icon&&(this.icon.destroy(),this.icon=null)},
draw:function(a){return this.icon.draw(a)},erase:function(){null!=this.icon&&this.icon.erase()},moveTo:function(a){null!=a&&null!=this.icon&&this.icon.moveTo(a);this.lonlat=this.map.getLonLatFromLayerPx(a)},isDrawn:function(){return this.icon&&this.icon.isDrawn()},onScreen:function(){var a=!1;this.map&&(a=this.map.getExtent().containsLonLat(this.lonlat));return a},inflate:function(a){this.icon&&this.icon.setSize({w:this.icon.size.w*a,h:this.icon.size.h*a})},setOpacity:function(a){this.icon.setOpacity(a)},
setUrl:function(a){this.icon.setUrl(a)},display:function(a){this.icon.display(a)},CLASS_NAME:"OpenLayers.Marker"});OpenLayers.Marker.defaultIcon=function(){return new OpenLayers.Icon(OpenLayers.Util.getImageLocation("marker.png"),{w:21,h:25},{x:-10.5,y:-25})};OpenLayers.Layer.TileCache=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:!0,format:"image/png",serverResolutions:null,initialize:function(a,b,c,d){this.layername=c;OpenLayers.Layer.Grid.prototype.initialize.apply(this,[a,b,{},d]);this.extension=this.format.split("/")[1].toLowerCase();this.extension="jpg"==this.extension?"jpeg":this.extension},clone:function(a){null==a&&(a=new OpenLayers.Layer.TileCache(this.name,this.url,this.layername,this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,
[a])},getURL:function(a){function b(a,b){for(var a=""+a,c=[],d=0;d<b;++d)c.push("0");return c.join("").substring(0,b-a.length)+a}var c=this.getServerResolution(),d=this.maxExtent,e=this.tileSize,f=Math.round((a.left-d.left)/(c*e.w)),a=Math.round((a.bottom-d.bottom)/(c*e.h)),c=null!=this.serverResolutions?OpenLayers.Util.indexOf(this.serverResolutions,c):this.map.getZoom(),f=[this.layername,b(c,2),b(parseInt(f/1E6),3),b(parseInt(f/1E3)%1E3,3),b(parseInt(f)%1E3,3),b(parseInt(a/1E6),3),b(parseInt(a/
1E3)%1E3,3),b(parseInt(a)%1E3,3)+"."+this.extension].join("/"),c=this.url;OpenLayers.Util.isArray(c)&&(c=this.selectUrl(f,c));c="/"==c.charAt(c.length-1)?c:c+"/";return c+f},CLASS_NAME:"OpenLayers.Layer.TileCache"});OpenLayers.Layer.KaMap=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:!0,DEFAULT_PARAMS:{i:"jpeg",map:""},initialize:function(a,b,c,d){OpenLayers.Layer.Grid.prototype.initialize.apply(this,arguments);this.params=OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS)},getURL:function(a){var a=this.adjustBounds(a),b=this.map.getResolution(),c=Math.round(1E4*this.map.getScale())/1E4,d=Math.round(a.left/b);return this.getFullRequestString({t:-Math.round(a.top/b),l:d,s:c})},calculateGridLayout:function(a,
b,c){var b=c*this.tileSize.w,c=c*this.tileSize.h,d=a.left,e=Math.floor(d/b)-this.buffer,d=-(d/b-e)*this.tileSize.w,e=e*b,a=a.top,f=Math.ceil(a/c)+this.buffer;return{tilelon:b,tilelat:c,tileoffsetlon:e,tileoffsetlat:f*c,tileoffsetx:d,tileoffsety:-(f-a/c+1)*this.tileSize.h}},clone:function(a){null==a&&(a=new OpenLayers.Layer.KaMap(this.name,this.url,this.params,this.getOptions()));a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a]);null!=this.tileSize&&(a.tileSize=this.tileSize.clone());a.grid=
[];return a},getTileBounds:function(a){var b=this.getResolution(),c=b*this.tileSize.w,b=b*this.tileSize.h,d=this.getLonLatFromViewPortPx(a),a=c*Math.floor(d.lon/c),d=b*Math.floor(d.lat/b);return new OpenLayers.Bounds(a,d,a+c,d+b)},CLASS_NAME:"OpenLayers.Layer.KaMap"});OpenLayers.Control.TransformFeature=OpenLayers.Class(OpenLayers.Control,{geometryTypes:null,layer:null,preserveAspectRatio:!1,rotate:!0,feature:null,renderIntent:"temporary",rotationHandleSymbolizer:null,box:null,center:null,scale:1,ratio:1,rotation:0,handles:null,rotationHandles:null,dragControl:null,irregular:!1,initialize:function(a,b){OpenLayers.Control.prototype.initialize.apply(this,[b]);this.layer=a;this.rotationHandleSymbolizer||(this.rotationHandleSymbolizer={stroke:!1,pointRadius:10,fillOpacity:0,
cursor:"pointer"});this.createBox();this.createControl()},activate:function(){var a=!1;OpenLayers.Control.prototype.activate.apply(this,arguments)&&(this.dragControl.activate(),this.layer.addFeatures([this.box]),this.rotate&&this.layer.addFeatures(this.rotationHandles),this.layer.addFeatures(this.handles),a=!0);return a},deactivate:function(){var a=!1;OpenLayers.Control.prototype.deactivate.apply(this,arguments)&&(this.layer.removeFeatures(this.handles),this.rotate&&this.layer.removeFeatures(this.rotationHandles),
this.layer.removeFeatures([this.box]),this.dragControl.deactivate(),a=!0);return a},setMap:function(a){this.dragControl.setMap(a);OpenLayers.Control.prototype.setMap.apply(this,arguments)},setFeature:function(a,b){var b=OpenLayers.Util.applyDefaults(b,{rotation:0,scale:1,ratio:1}),c=this.rotation,d=this.center;OpenLayers.Util.extend(this,b);if(!1!==this.events.triggerEvent("beforesetfeature",{feature:a})){this.feature=a;this.activate();this._setfeature=!0;var e=this.feature.geometry.getBounds();this.box.move(e.getCenterLonLat());
this.box.geometry.rotate(-c,d);this._angle=0;this.rotation?(c=a.geometry.clone(),c.rotate(-this.rotation,this.center),c=new OpenLayers.Feature.Vector(c.getBounds().toGeometry()),c.geometry.rotate(this.rotation,this.center),this.box.geometry.rotate(this.rotation,this.center),this.box.move(c.geometry.getBounds().getCenterLonLat()),c=c.geometry.components[0].components[0].getBounds().getCenterLonLat()):c=new OpenLayers.LonLat(e.left,e.bottom);this.handles[0].move(c);delete this._setfeature;this.events.triggerEvent("setfeature",
{feature:a})}},unsetFeature:function(){this.active?this.deactivate():(this.feature=null,this.rotation=0,this.ratio=this.scale=1)},createBox:function(){var a=this;this.center=new OpenLayers.Geometry.Point(0,0);this.box=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(-1,-1),new OpenLayers.Geometry.Point(0,-1),new OpenLayers.Geometry.Point(1,-1),new OpenLayers.Geometry.Point(1,0),new OpenLayers.Geometry.Point(1,1),new OpenLayers.Geometry.Point(0,1),new OpenLayers.Geometry.Point(-1,
1),new OpenLayers.Geometry.Point(-1,0),new OpenLayers.Geometry.Point(-1,-1)]),null,"string"==typeof this.renderIntent?null:this.renderIntent);this.box.geometry.move=function(b,c){a._moving=!0;OpenLayers.Geometry.LineString.prototype.move.apply(this,arguments);a.center.move(b,c);delete a._moving};for(var b=function(a,b){OpenLayers.Geometry.Point.prototype.move.apply(this,arguments);this._rotationHandle&&this._rotationHandle.geometry.move(a,b);this._handle.geometry.move(a,b)},c=function(a,b,c){OpenLayers.Geometry.Point.prototype.resize.apply(this,
arguments);this._rotationHandle&&this._rotationHandle.geometry.resize(a,b,c);this._handle.geometry.resize(a,b,c)},d=function(a,b){OpenLayers.Geometry.Point.prototype.rotate.apply(this,arguments);this._rotationHandle&&this._rotationHandle.geometry.rotate(a,b);this._handle.geometry.rotate(a,b)},e=function(b,c){var d=this.x,e=this.y;OpenLayers.Geometry.Point.prototype.move.call(this,b,c);if(!a._moving){var f=a.dragControl.handlers.drag.evt,g=!(!a._setfeature&&a.preserveAspectRatio)&&!(f&&f.shiftKey),
h=new OpenLayers.Geometry.Point(d,e),f=a.center;this.rotate(-a.rotation,f);h.rotate(-a.rotation,f);var i=this.x-f.x,j=this.y-f.y,k=i-(this.x-h.x),l=j-(this.y-h.y);a.irregular&&!a._setfeature&&(i-=(this.x-h.x)/2,j-=(this.y-h.y)/2);this.x=d;this.y=e;h=1;g?(j=1.0E-5>Math.abs(l)?1:j/l,h=(1.0E-5>Math.abs(k)?1:i/k)/j):(k=Math.sqrt(k*k+l*l),j=Math.sqrt(i*i+j*j)/k);a._moving=!0;a.box.geometry.rotate(-a.rotation,f);delete a._moving;a.box.geometry.resize(j,f,h);a.box.geometry.rotate(a.rotation,f);a.transformFeature({scale:j,
ratio:h});a.irregular&&!a._setfeature&&(i=f.clone(),i.x+=1.0E-5>Math.abs(d-f.x)?0:this.x-d,i.y+=1.0E-5>Math.abs(e-f.y)?0:this.y-e,a.box.geometry.move(this.x-d,this.y-e),a.transformFeature({center:i}))}},f=function(b,c){var d=this.x,e=this.y;OpenLayers.Geometry.Point.prototype.move.call(this,b,c);if(!a._moving){var f=a.dragControl.handlers.drag.evt,f=f&&f.shiftKey?45:1,g=a.center,h=this.x-g.x,i=this.y-g.y;this.x=d;this.y=e;d=Math.atan2(i-c,h-b);d=Math.atan2(i,h)-d;d*=180/Math.PI;a._angle=(a._angle+
d)%360;d=a.rotation%f;if(Math.abs(a._angle)>=f||0!==d)d=Math.round(a._angle/f)*f-d,a._angle=0,a.box.geometry.rotate(d,g),a.transformFeature({rotation:d})}},g=Array(8),h=Array(4),i,j,k,l="sw s se e ne n nw w".split(" "),m=0;8>m;++m)i=this.box.geometry.components[m],j=new OpenLayers.Feature.Vector(i.clone(),{role:l[m]+"-resize"},"string"==typeof this.renderIntent?null:this.renderIntent),0==m%2&&(k=new OpenLayers.Feature.Vector(i.clone(),{role:l[m]+"-rotate"},"string"==typeof this.rotationHandleSymbolizer?
null:this.rotationHandleSymbolizer),k.geometry.move=f,i._rotationHandle=k,h[m/2]=k),i.move=b,i.resize=c,i.rotate=d,j.geometry.move=e,i._handle=j,g[m]=j;this.rotationHandles=h;this.handles=g},createControl:function(){var a=this;this.dragControl=new OpenLayers.Control.DragFeature(this.layer,{documentDrag:!0,moveFeature:function(b){this.feature===a.feature&&(this.feature=a.box);OpenLayers.Control.DragFeature.prototype.moveFeature.apply(this,arguments)},onDrag:function(b){b===a.box&&a.transformFeature({center:a.center})},
onStart:function(b){var c=!a.geometryTypes||-1!==OpenLayers.Util.indexOf(a.geometryTypes,b.geometry.CLASS_NAME),d=OpenLayers.Util.indexOf(a.handles,b),d=d+OpenLayers.Util.indexOf(a.rotationHandles,b);b!==a.feature&&(b!==a.box&&-2==d&&c)&&a.setFeature(b)},onComplete:function(){a.events.triggerEvent("transformcomplete",{feature:a.feature})}})},drawHandles:function(){for(var a=this.layer,b=0;8>b;++b)this.rotate&&0===b%2&&a.drawFeature(this.rotationHandles[b/2],this.rotationHandleSymbolizer),a.drawFeature(this.handles[b],
this.renderIntent)},transformFeature:function(a){if(!this._setfeature){this.scale*=a.scale||1;this.ratio*=a.ratio||1;var b=this.rotation;this.rotation=(this.rotation+(a.rotation||0))%360;if(!1!==this.events.triggerEvent("beforetransform",a)){var c=this.feature,d=c.geometry,e=this.center;d.rotate(-b,e);a.scale||a.ratio?d.resize(a.scale,e,a.ratio):a.center&&c.move(a.center.getBounds().getCenterLonLat());d.rotate(this.rotation,e);this.layer.drawFeature(c);c.toState(OpenLayers.State.UPDATE);this.events.triggerEvent("transform",
a)}}this.layer.drawFeature(this.box,this.renderIntent);this.drawHandles()},destroy:function(){for(var a,b=0;8>b;++b)a=this.box.geometry.components[b],a._handle.destroy(),a._handle=null,a._rotationHandle&&a._rotationHandle.destroy(),a._rotationHandle=null;this.rotationHandles=this.rotationHandleSymbolizer=this.handles=this.feature=this.center=null;this.box.destroy();this.layer=this.box=null;this.dragControl.destroy();this.dragControl=null;OpenLayers.Control.prototype.destroy.apply(this,arguments)},
CLASS_NAME:"OpenLayers.Control.TransformFeature"});OpenLayers.Handler.Box=OpenLayers.Class(OpenLayers.Handler,{dragHandler:null,boxDivClassName:"olHandlerBoxZoomBox",boxOffsets:null,initialize:function(a,b,c){OpenLayers.Handler.prototype.initialize.apply(this,arguments);this.dragHandler=new OpenLayers.Handler.Drag(this,{down:this.startBox,move:this.moveBox,out:this.removeBox,up:this.endBox},{keyMask:this.keyMask})},destroy:function(){OpenLayers.Handler.prototype.destroy.apply(this,arguments);this.dragHandler&&(this.dragHandler.destroy(),this.dragHandler=
null)},setMap:function(a){OpenLayers.Handler.prototype.setMap.apply(this,arguments);this.dragHandler&&this.dragHandler.setMap(a)},startBox:function(){this.callback("start",[]);this.zoomBox=OpenLayers.Util.createDiv("zoomBox",{x:-9999,y:-9999});this.zoomBox.className=this.boxDivClassName;this.zoomBox.style.zIndex=this.map.Z_INDEX_BASE.Popup-1;this.map.viewPortDiv.appendChild(this.zoomBox);OpenLayers.Element.addClass(this.map.viewPortDiv,"olDrawBox")},moveBox:function(a){var b=this.dragHandler.start.x,
c=this.dragHandler.start.y,d=Math.abs(b-a.x),e=Math.abs(c-a.y),f=this.getBoxOffsets();this.zoomBox.style.width=d+f.width+1+"px";this.zoomBox.style.height=e+f.height+1+"px";this.zoomBox.style.left=(a.x<b?b-d-f.left:b-f.left)+"px";this.zoomBox.style.top=(a.y<c?c-e-f.top:c-f.top)+"px"},endBox:function(a){var b;if(5<Math.abs(this.dragHandler.start.x-a.x)||5<Math.abs(this.dragHandler.start.y-a.y)){var c=this.dragHandler.start;b=Math.min(c.y,a.y);var d=Math.max(c.y,a.y),e=Math.min(c.x,a.x),a=Math.max(c.x,
a.x);b=new OpenLayers.Bounds(e,d,a,b)}else b=this.dragHandler.start.clone();this.removeBox();this.callback("done",[b])},removeBox:function(){this.map.viewPortDiv.removeChild(this.zoomBox);this.boxOffsets=this.zoomBox=null;OpenLayers.Element.removeClass(this.map.viewPortDiv,"olDrawBox")},activate:function(){return OpenLayers.Handler.prototype.activate.apply(this,arguments)?(this.dragHandler.activate(),!0):!1},deactivate:function(){return OpenLayers.Handler.prototype.deactivate.apply(this,arguments)?
(this.dragHandler.deactivate()&&this.zoomBox&&this.removeBox(),!0):!1},getBoxOffsets:function(){if(!this.boxOffsets){var a=document.createElement("div");a.style.position="absolute";a.style.border="1px solid black";a.style.width="3px";document.body.appendChild(a);var b=3==a.clientWidth;document.body.removeChild(a);var a=parseInt(OpenLayers.Element.getStyle(this.zoomBox,"border-left-width")),c=parseInt(OpenLayers.Element.getStyle(this.zoomBox,"border-right-width")),d=parseInt(OpenLayers.Element.getStyle(this.zoomBox,
"border-top-width")),e=parseInt(OpenLayers.Element.getStyle(this.zoomBox,"border-bottom-width"));this.boxOffsets={left:a,right:c,top:d,bottom:e,width:!1===b?a+c:0,height:!1===b?d+e:0}}return this.boxOffsets},CLASS_NAME:"OpenLayers.Handler.Box"});OpenLayers.Control.ZoomBox=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,out:!1,keyMask:null,alwaysZoom:!1,draw:function(){this.handler=new OpenLayers.Handler.Box(this,{done:this.zoomBox},{keyMask:this.keyMask})},zoomBox:function(a){if(a instanceof OpenLayers.Bounds){var b;if(this.out){b=Math.abs(a.right-a.left);var c=Math.abs(a.top-a.bottom);b=Math.min(this.map.size.h/c,this.map.size.w/b);var c=this.map.getExtent(),d=this.map.getLonLatFromPixel(a.getCenterPixel()),a=d.lon-
c.getWidth()/2*b,e=d.lon+c.getWidth()/2*b,f=d.lat-c.getHeight()/2*b;b=d.lat+c.getHeight()/2*b;b=new OpenLayers.Bounds(a,f,e,b)}else b=this.map.getLonLatFromPixel({x:a.left,y:a.bottom}),c=this.map.getLonLatFromPixel({x:a.right,y:a.top}),b=new OpenLayers.Bounds(b.lon,b.lat,c.lon,c.lat);c=this.map.getZoom();this.map.zoomToExtent(b);c==this.map.getZoom()&&!0==this.alwaysZoom&&this.map.zoomTo(c+(this.out?-1:1))}else this.out?this.map.setCenter(this.map.getLonLatFromPixel(a),this.map.getZoom()-1):this.map.setCenter(this.map.getLonLatFromPixel(a),
this.map.getZoom()+1)},CLASS_NAME:"OpenLayers.Control.ZoomBox"});OpenLayers.Control.DragPan=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,panned:!1,interval:1,documentDrag:!1,kinetic:null,enableKinetic:!1,kineticInterval:10,draw:function(){if(this.enableKinetic){var a={interval:this.kineticInterval};"object"===typeof this.enableKinetic&&(a=OpenLayers.Util.extend(a,this.enableKinetic));this.kinetic=new OpenLayers.Kinetic(a)}this.handler=new OpenLayers.Handler.Drag(this,{move:this.panMap,done:this.panMapDone,down:this.panMapStart},{interval:this.interval,
documentDrag:this.documentDrag})},panMapStart:function(){this.kinetic&&this.kinetic.begin()},panMap:function(a){this.kinetic&&this.kinetic.update(a);this.panned=!0;this.map.pan(this.handler.last.x-a.x,this.handler.last.y-a.y,{dragging:!0,animate:!1})},panMapDone:function(a){if(this.panned){var b=null;this.kinetic&&(b=this.kinetic.end(a));this.map.pan(this.handler.last.x-a.x,this.handler.last.y-a.y,{dragging:!!b,animate:!1});if(b){var c=this;this.kinetic.move(b,function(a,b,f){c.map.pan(a,b,{dragging:!f,
animate:!1})})}this.panned=!1}},CLASS_NAME:"OpenLayers.Control.DragPan"});OpenLayers.Handler.Click=OpenLayers.Class(OpenLayers.Handler,{delay:300,single:!0,"double":!1,pixelTolerance:0,dblclickTolerance:13,stopSingle:!1,stopDouble:!1,timerId:null,touch:!1,down:null,last:null,first:null,rightclickTimerId:null,touchstart:function(a){this.touch||(this.unregisterMouseListeners(),this.touch=!0);this.down=this.getEventInfo(a);this.last=this.getEventInfo(a);return!0},touchmove:function(a){this.last=this.getEventInfo(a);return!0},touchend:function(a){this.down&&(a.xy=this.last.xy,
a.lastTouches=this.last.touches,this.handleSingle(a),this.down=null);return!0},unregisterMouseListeners:function(){this.map.events.un({mousedown:this.mousedown,mouseup:this.mouseup,click:this.click,dblclick:this.dblclick,scope:this})},mousedown:function(a){this.down=this.getEventInfo(a);this.last=this.getEventInfo(a);return!0},mouseup:function(a){var b=!0;this.checkModifiers(a)&&(this.control.handleRightClicks&&OpenLayers.Event.isRightClick(a))&&(b=this.rightclick(a));return b},rightclick:function(a){if(this.passesTolerance(a)){if(null!=
this.rightclickTimerId)return this.clearTimer(),this.callback("dblrightclick",[a]),!this.stopDouble;a=this["double"]?OpenLayers.Util.extend({},a):this.callback("rightclick",[a]);a=OpenLayers.Function.bind(this.delayedRightCall,this,a);this.rightclickTimerId=window.setTimeout(a,this.delay)}return!this.stopSingle},delayedRightCall:function(a){this.rightclickTimerId=null;a&&this.callback("rightclick",[a])},click:function(a){this.last||(this.last=this.getEventInfo(a));this.handleSingle(a);return!this.stopSingle},
dblclick:function(a){this.handleDouble(a);return!this.stopDouble},handleDouble:function(a){this.passesDblclickTolerance(a)&&(this["double"]&&this.callback("dblclick",[a]),this.clearTimer())},handleSingle:function(a){this.passesTolerance(a)&&(null!=this.timerId?(this.last.touches&&1===this.last.touches.length&&(this["double"]&&OpenLayers.Event.stop(a),this.handleDouble(a)),(!this.last.touches||2!==this.last.touches.length)&&this.clearTimer()):(this.first=this.getEventInfo(a),this.queuePotentialClick(this.single?
OpenLayers.Util.extend({},a):null)))},queuePotentialClick:function(a){this.timerId=window.setTimeout(OpenLayers.Function.bind(this.delayedCall,this,a),this.delay)},passesTolerance:function(a){var b=!0;if(null!=this.pixelTolerance&&this.down&&this.down.xy&&(b=this.pixelTolerance>=this.down.xy.distanceTo(a.xy))&&this.touch&&this.down.touches.length===this.last.touches.length)for(var a=0,c=this.down.touches.length;a<c;++a)if(this.getTouchDistance(this.down.touches[a],this.last.touches[a])>this.pixelTolerance){b=
!1;break}return b},getTouchDistance:function(a,b){return Math.sqrt(Math.pow(a.clientX-b.clientX,2)+Math.pow(a.clientY-b.clientY,2))},passesDblclickTolerance:function(){var a=!0;this.down&&this.first&&(a=this.down.xy.distanceTo(this.first.xy)<=this.dblclickTolerance);return a},clearTimer:function(){null!=this.timerId&&(window.clearTimeout(this.timerId),this.timerId=null);null!=this.rightclickTimerId&&(window.clearTimeout(this.rightclickTimerId),this.rightclickTimerId=null)},delayedCall:function(a){this.timerId=
null;a&&this.callback("click",[a])},getEventInfo:function(a){var b;if(a.touches){var c=a.touches.length;b=Array(c);for(var d,e=0;e<c;e++)d=a.touches[e],b[e]={clientX:d.clientX,clientY:d.clientY}}return{xy:a.xy,touches:b}},deactivate:function(){var a=!1;OpenLayers.Handler.prototype.deactivate.apply(this,arguments)&&(this.clearTimer(),this.last=this.first=this.down=null,this.touch=!1,a=!0);return a},CLASS_NAME:"OpenLayers.Handler.Click"});OpenLayers.Control.Navigation=OpenLayers.Class(OpenLayers.Control,{dragPan:null,dragPanOptions:null,pinchZoom:null,pinchZoomOptions:null,documentDrag:!1,zoomBox:null,zoomBoxEnabled:!0,zoomWheelEnabled:!0,mouseWheelOptions:null,handleRightClicks:!1,zoomBoxKeyMask:OpenLayers.Handler.MOD_SHIFT,autoActivate:!0,initialize:function(a){this.handlers={};OpenLayers.Control.prototype.initialize.apply(this,arguments)},destroy:function(){this.deactivate();this.dragPan&&this.dragPan.destroy();this.dragPan=null;
this.zoomBox&&this.zoomBox.destroy();this.zoomBox=null;this.pinchZoom&&this.pinchZoom.destroy();this.pinchZoom=null;OpenLayers.Control.prototype.destroy.apply(this,arguments)},activate:function(){this.dragPan.activate();this.zoomWheelEnabled&&this.handlers.wheel.activate();this.handlers.click.activate();this.zoomBoxEnabled&&this.zoomBox.activate();this.pinchZoom&&this.pinchZoom.activate();return OpenLayers.Control.prototype.activate.apply(this,arguments)},deactivate:function(){this.pinchZoom&&this.pinchZoom.deactivate();
this.zoomBox.deactivate();this.dragPan.deactivate();this.handlers.click.deactivate();this.handlers.wheel.deactivate();return OpenLayers.Control.prototype.deactivate.apply(this,arguments)},draw:function(){this.handleRightClicks&&(this.map.viewPortDiv.oncontextmenu=OpenLayers.Function.False);this.handlers.click=new OpenLayers.Handler.Click(this,{click:this.defaultClick,dblclick:this.defaultDblClick,dblrightclick:this.defaultDblRightClick},{"double":!0,stopDouble:!0});this.dragPan=new OpenLayers.Control.DragPan(OpenLayers.Util.extend({map:this.map,
documentDrag:this.documentDrag},this.dragPanOptions));this.zoomBox=new OpenLayers.Control.ZoomBox({map:this.map,keyMask:this.zoomBoxKeyMask});this.dragPan.draw();this.zoomBox.draw();this.handlers.wheel=new OpenLayers.Handler.MouseWheel(this,{up:this.wheelUp,down:this.wheelDown},this.mouseWheelOptions);OpenLayers.Control.PinchZoom&&(this.pinchZoom=new OpenLayers.Control.PinchZoom(OpenLayers.Util.extend({map:this.map},this.pinchZoomOptions)))},defaultClick:function(a){a.lastTouches&&2==a.lastTouches.length&&
this.map.zoomOut()},defaultDblClick:function(a){this.map.setCenter(this.map.getLonLatFromViewPortPx(a.xy),this.map.zoom+1)},defaultDblRightClick:function(a){this.map.setCenter(this.map.getLonLatFromViewPortPx(a.xy),this.map.zoom-1)},wheelChange:function(a,b){var c=this.map.getZoom(),d=this.map.getZoom()+Math.round(b),d=Math.max(d,0),d=Math.min(d,this.map.getNumZoomLevels());if(d!==c){var e=this.map.getSize(),c=e.w/2-a.xy.x,e=a.xy.y-e.h/2,f=this.map.baseLayer.getResolutionForZoom(d),g=this.map.getLonLatFromPixel(a.xy);
this.map.setCenter(new OpenLayers.LonLat(g.lon+c*f,g.lat+e*f),d)}},wheelUp:function(a,b){this.wheelChange(a,b||1)},wheelDown:function(a,b){this.wheelChange(a,b||-1)},disableZoomBox:function(){this.zoomBoxEnabled=!1;this.zoomBox.deactivate()},enableZoomBox:function(){this.zoomBoxEnabled=!0;this.active&&this.zoomBox.activate()},disableZoomWheel:function(){this.zoomWheelEnabled=!1;this.handlers.wheel.deactivate()},enableZoomWheel:function(){this.zoomWheelEnabled=!0;this.active&&this.handlers.wheel.activate()},
CLASS_NAME:"OpenLayers.Control.Navigation"});OpenLayers.Control.DrawFeature=OpenLayers.Class(OpenLayers.Control,{layer:null,callbacks:null,multi:!1,featureAdded:function(){},handlerOptions:null,initialize:function(a,b,c){OpenLayers.Control.prototype.initialize.apply(this,[c]);this.callbacks=OpenLayers.Util.extend({done:this.drawFeature,modify:function(a,b){this.layer.events.triggerEvent("sketchmodified",{vertex:a,feature:b})},create:function(a,b){this.layer.events.triggerEvent("sketchstarted",{vertex:a,feature:b})}},this.callbacks);this.layer=
a;this.handlerOptions=this.handlerOptions||{};this.handlerOptions.layerOptions=OpenLayers.Util.applyDefaults(this.handlerOptions.layerOptions,{renderers:a.renderers,rendererOptions:a.rendererOptions});"multi"in this.handlerOptions||(this.handlerOptions.multi=this.multi);if(a=this.layer.styleMap&&this.layer.styleMap.styles.temporary)this.handlerOptions.layerOptions=OpenLayers.Util.applyDefaults(this.handlerOptions.layerOptions,{styleMap:new OpenLayers.StyleMap({"default":a})});this.handler=new b(this,
this.callbacks,this.handlerOptions)},drawFeature:function(a){a=new OpenLayers.Feature.Vector(a);!1!==this.layer.events.triggerEvent("sketchcomplete",{feature:a})&&(a.state=OpenLayers.State.INSERT,this.layer.addFeatures([a]),this.featureAdded(a),this.events.triggerEvent("featureadded",{feature:a}))},insertXY:function(a,b){this.handler&&this.handler.line&&this.handler.insertXY(a,b)},insertDeltaXY:function(a,b){this.handler&&this.handler.line&&this.handler.insertDeltaXY(a,b)},insertDirectionLength:function(a,
b){this.handler&&this.handler.line&&this.handler.insertDirectionLength(a,b)},insertDeflectionLength:function(a,b){this.handler&&this.handler.line&&this.handler.insertDeflectionLength(a,b)},undo:function(){return this.handler.undo&&this.handler.undo()},redo:function(){return this.handler.redo&&this.handler.redo()},finishSketch:function(){this.handler.finishGeometry()},cancel:function(){this.handler.cancel()},CLASS_NAME:"OpenLayers.Control.DrawFeature"});OpenLayers.Handler.Polygon=OpenLayers.Class(OpenLayers.Handler.Path,{holeModifier:null,drawingHole:!1,polygon:null,createFeature:function(a){a=this.layer.getLonLatFromViewPortPx(a);a=new OpenLayers.Geometry.Point(a.lon,a.lat);this.point=new OpenLayers.Feature.Vector(a);this.line=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LinearRing([this.point.geometry]));this.polygon=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([this.line.geometry]));this.callback("create",[this.point.geometry,
this.getSketch()]);this.point.geometry.clearBounds();this.layer.addFeatures([this.polygon,this.point],{silent:!0})},addPoint:function(a){if(!this.drawingHole&&this.holeModifier&&this.evt&&this.evt[this.holeModifier])for(var b=this.point.geometry,c=this.control.layer.features,d,e=c.length-1;0<=e;--e)if(d=c[e].geometry,(d instanceof OpenLayers.Geometry.Polygon||d instanceof OpenLayers.Geometry.MultiPolygon)&&d.intersects(b)){b=c[e];this.control.layer.removeFeatures([b],{silent:!0});this.control.layer.events.registerPriority("sketchcomplete",
this,this.finalizeInteriorRing);this.control.layer.events.registerPriority("sketchmodified",this,this.enforceTopology);b.geometry.addComponent(this.line.geometry);this.polygon=b;this.drawingHole=!0;break}OpenLayers.Handler.Path.prototype.addPoint.apply(this,arguments)},getCurrentPointIndex:function(){return this.line.geometry.components.length-2},enforceTopology:function(a){var a=a.vertex,b=this.line.geometry.components;this.polygon.geometry.intersects(a)||(b=b[b.length-3],a.x=b.x,a.y=b.y)},finishGeometry:function(){this.line.geometry.removeComponent(this.line.geometry.components[this.line.geometry.components.length-
2]);this.removePoint();this.finalize()},finalizeInteriorRing:function(){var a=this.line.geometry,b=0!==a.getArea();if(b){for(var c=this.polygon.geometry.components,d=c.length-2;0<=d;--d)if(a.intersects(c[d])){b=!1;break}if(b){d=c.length-2;a:for(;0<d;--d)for(var e=c[d].components,f=0,g=e.length;f<g;++f)if(a.containsPoint(e[f])){b=!1;break a}}}b?this.polygon.state!==OpenLayers.State.INSERT&&(this.polygon.state=OpenLayers.State.UPDATE):this.polygon.geometry.removeComponent(a);this.restoreFeature();return!1},
cancel:function(){this.drawingHole&&(this.polygon.geometry.removeComponent(this.line.geometry),this.restoreFeature(!0));return OpenLayers.Handler.Path.prototype.cancel.apply(this,arguments)},restoreFeature:function(a){this.control.layer.events.unregister("sketchcomplete",this,this.finalizeInteriorRing);this.control.layer.events.unregister("sketchmodified",this,this.enforceTopology);this.layer.removeFeatures([this.polygon],{silent:!0});this.control.layer.addFeatures([this.polygon],{silent:!0});this.drawingHole=
!1;a||this.control.layer.events.triggerEvent("sketchcomplete",{feature:this.polygon})},destroyFeature:function(a){OpenLayers.Handler.Path.prototype.destroyFeature.call(this,a);this.polygon=null},drawFeature:function(){this.layer.drawFeature(this.polygon,this.style);this.layer.drawFeature(this.point,this.style)},getSketch:function(){return this.polygon},getGeometry:function(){var a=this.polygon&&this.polygon.geometry;a&&this.multi&&(a=new OpenLayers.Geometry.MultiPolygon([a]));return a},CLASS_NAME:"OpenLayers.Handler.Polygon"});OpenLayers.Control.EditingToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{citeCompliant:!1,initialize:function(a,b){OpenLayers.Control.Panel.prototype.initialize.apply(this,[b]);this.addControls([new OpenLayers.Control.Navigation]);this.addControls([new OpenLayers.Control.DrawFeature(a,OpenLayers.Handler.Point,{displayClass:"olControlDrawFeaturePoint",handlerOptions:{citeCompliant:this.citeCompliant}}),new OpenLayers.Control.DrawFeature(a,OpenLayers.Handler.Path,{displayClass:"olControlDrawFeaturePath",
handlerOptions:{citeCompliant:this.citeCompliant}}),new OpenLayers.Control.DrawFeature(a,OpenLayers.Handler.Polygon,{displayClass:"olControlDrawFeaturePolygon",handlerOptions:{citeCompliant:this.citeCompliant}})])},draw:function(){var a=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);null===this.defaultControl&&(this.defaultControl=this.controls[0]);return a},CLASS_NAME:"OpenLayers.Control.EditingToolbar"});OpenLayers.Strategy.BBOX=OpenLayers.Class(OpenLayers.Strategy,{bounds:null,resolution:null,ratio:2,resFactor:null,response:null,activate:function(){var a=OpenLayers.Strategy.prototype.activate.call(this);a&&(this.layer.events.on({moveend:this.update,refresh:this.update,visibilitychanged:this.update,scope:this}),this.update());return a},deactivate:function(){var a=OpenLayers.Strategy.prototype.deactivate.call(this);a&&this.layer.events.un({moveend:this.update,refresh:this.update,visibilitychanged:this.update,
scope:this});return a},update:function(a){var b=this.getMapBounds();if(null!==b&&(a&&a.force||this.layer.visibility&&this.layer.calculateInRange()&&this.invalidBounds(b)))this.calculateBounds(b),this.resolution=this.layer.map.getResolution(),this.triggerRead(a)},getMapBounds:function(){if(null===this.layer.map)return null;var a=this.layer.map.getExtent();a&&!this.layer.projection.equals(this.layer.map.getProjectionObject())&&(a=a.clone().transform(this.layer.map.getProjectionObject(),this.layer.projection));
return a},invalidBounds:function(a){a||(a=this.getMapBounds());a=!this.bounds||!this.bounds.containsBounds(a);!a&&this.resFactor&&(a=this.resolution/this.layer.map.getResolution(),a=a>=this.resFactor||a<=1/this.resFactor);return a},calculateBounds:function(a){a||(a=this.getMapBounds());var b=a.getCenterLonLat(),c=a.getWidth()*this.ratio,a=a.getHeight()*this.ratio;this.bounds=new OpenLayers.Bounds(b.lon-c/2,b.lat-a/2,b.lon+c/2,b.lat+a/2)},triggerRead:function(a){this.response&&!(a&&!0===a.noAbort)&&
(this.layer.protocol.abort(this.response),this.layer.events.triggerEvent("loadend"));this.layer.events.triggerEvent("loadstart");this.response=this.layer.protocol.read(OpenLayers.Util.applyDefaults({filter:this.createFilter(),callback:this.merge,scope:this},a))},createFilter:function(){var a=new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.BBOX,value:this.bounds,projection:this.layer.projection});this.layer.filter&&(a=new OpenLayers.Filter.Logical({type:OpenLayers.Filter.Logical.AND,
filters:[this.layer.filter,a]}));return a},merge:function(a){this.layer.destroyFeatures();if((a=a.features)&&0<a.length){var b=this.layer.projection,c=this.layer.map.getProjectionObject();if(!c.equals(b))for(var d,e=0,f=a.length;e<f;++e)(d=a[e].geometry)&&d.transform(b,c);this.layer.addFeatures(a)}this.response=null;this.layer.events.triggerEvent("loadend")},CLASS_NAME:"OpenLayers.Strategy.BBOX"});OpenLayers.Layer.WorldWind=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{},isBaseLayer:!0,lzd:null,zoomLevels:null,initialize:function(a,b,c,d,e,f){this.lzd=c;this.zoomLevels=d;c=[];c.push(a,b,e,f);OpenLayers.Layer.Grid.prototype.initialize.apply(this,c);this.params=OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS)},getZoom:function(){var a=this.map.getZoom();this.map.getMaxExtent();return a-=Math.log(this.maxResolution/(this.lzd/512))/Math.log(2)},getURL:function(a){var a=
this.adjustBounds(a),b=this.getZoom(),c=this.map.getMaxExtent(),d=this.lzd/Math.pow(2,this.getZoom()),e=Math.floor((a.left-c.left)/d),a=Math.floor((a.bottom-c.bottom)/d);return this.map.getResolution()<=this.lzd/512&&this.getZoom()<=this.zoomLevels?this.getFullRequestString({L:b,X:e,Y:a}):OpenLayers.Util.getImageLocation("blank.gif")},CLASS_NAME:"OpenLayers.Layer.WorldWind"});OpenLayers.Protocol.CSW=function(a){var a=OpenLayers.Util.applyDefaults(a,OpenLayers.Protocol.CSW.DEFAULTS),b=OpenLayers.Protocol.CSW["v"+a.version.replace(/\./g,"_")];if(!b)throw"Unsupported CSW version: "+a.version;return new b(a)};OpenLayers.Protocol.CSW.DEFAULTS={version:"2.0.2"};OpenLayers.Format.WMTSCapabilities=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.0.0",yx:{"urn:ogc:def:crs:EPSG::4326":!0},createLayer:function(a,b){var c,d={layer:!0,matrixSet:!0},e;for(e in d)if(!(e in b))throw Error("Missing property '"+e+"' in layer configuration.");d=a.contents;e=d.tileMatrixSets[b.matrixSet];for(var f,g=0,h=d.layers.length;g<h;++g)if(d.layers[g].identifier===b.layer){f=d.layers[g];break}if(f&&e){for(var i,g=0,h=f.styles.length;g<h&&!(i=f.styles[g],i.isDefault);++g);
c=new OpenLayers.Layer.WMTS(OpenLayers.Util.applyDefaults(b,{url:"REST"===b.requestEncoding&&f.resourceUrl?f.resourceUrl.tile.template:a.operationsMetadata.GetTile.dcp.http.get[0].url,name:f.title,style:i.identifier,matrixIds:e.matrixIds,tileFullExtent:e.bounds}))}return c},CLASS_NAME:"OpenLayers.Format.WMTSCapabilities"});OpenLayers.Layer.Google.v3={DEFAULTS:{sphericalMercator:!0,projection:"EPSG:900913"},animationEnabled:!0,loadMapObject:function(){this.type||(this.type=google.maps.MapTypeId.ROADMAP);var a,b=OpenLayers.Layer.Google.cache[this.map.id];b?(a=b.mapObject,++b.count):(b=this.map.viewPortDiv,a=document.createElement("div"),a.id=this.map.id+"_GMapContainer",a.style.position="absolute",a.style.width="100%",a.style.height="100%",b.appendChild(a),b=this.map.getCenter(),a=new google.maps.Map(a,{center:b?new google.maps.LatLng(b.lat,
b.lon):new google.maps.LatLng(0,0),zoom:this.map.getZoom()||0,mapTypeId:this.type,disableDefaultUI:!0,keyboardShortcuts:!1,draggable:!1,disableDoubleClickZoom:!0,scrollwheel:!1,streetViewControl:!1}),b={mapObject:a,count:1},OpenLayers.Layer.Google.cache[this.map.id]=b,this.repositionListener=google.maps.event.addListenerOnce(a,"center_changed",OpenLayers.Function.bind(this.repositionMapElements,this)));this.mapObject=a;this.setGMapVisibility(this.visibility)},repositionMapElements:function(){google.maps.event.trigger(this.mapObject,
"resize");var a=this.mapObject.getDiv().firstChild;if(!a||3>a.childNodes.length)return this.repositionTimer=window.setTimeout(OpenLayers.Function.bind(this.repositionMapElements,this),250),!1;for(var b=OpenLayers.Layer.Google.cache[this.map.id],c=this.map.viewPortDiv,d=a.children.length-1;0<=d;--d){if(1000001==a.children[d].style.zIndex){var e=a.children[d];c.appendChild(e);e.style.zIndex="1100";e.style.bottom="";e.className="olLayerGoogleCopyright olLayerGoogleV3";e.style.display="";b.termsOfUse=
e}1E6==a.children[d].style.zIndex&&(e=a.children[d],c.appendChild(e),e.style.zIndex="1100",e.style.bottom="",e.className="olLayerGooglePoweredBy olLayerGoogleV3 gmnoprint",e.style.display="",b.poweredBy=e);10000002==a.children[d].style.zIndex&&c.appendChild(a.children[d])}this.setGMapVisibility(this.visibility)},onMapResize:function(){if(this.visibility)google.maps.event.trigger(this.mapObject,"resize");else{var a=OpenLayers.Layer.Google.cache[this.map.id];if(!a.resized){var b=this;google.maps.event.addListenerOnce(this.mapObject,
"tilesloaded",function(){google.maps.event.trigger(b.mapObject,"resize");b.moveTo(b.map.getCenter(),b.map.getZoom());delete a.resized})}a.resized=!0}},setGMapVisibility:function(a){var b=OpenLayers.Layer.Google.cache[this.map.id];if(b){for(var c=this.type,d=this.map.layers,e,f=d.length-1;0<=f;--f)if(e=d[f],e instanceof OpenLayers.Layer.Google&&!0===e.visibility&&!0===e.inRange){c=e.type;a=!0;break}d=this.mapObject.getDiv();!0===a?(this.mapObject.setMapTypeId(c),d.style.left="",b.termsOfUse&&b.termsOfUse.style&&
(b.termsOfUse.style.left="",b.termsOfUse.style.display="",b.poweredBy.style.display=""),b.displayed=this.id):(delete b.displayed,d.style.left="-9999px",b.termsOfUse&&b.termsOfUse.style&&(b.termsOfUse.style.display="none",b.termsOfUse.style.left="-9999px",b.poweredBy.style.display="none"))}},getMapContainer:function(){return this.mapObject.getDiv()},getMapObjectBoundsFromOLBounds:function(a){var b=null;null!=a&&(b=this.sphericalMercator?this.inverseMercator(a.bottom,a.left):new OpenLayers.LonLat(a.bottom,
a.left),a=this.sphericalMercator?this.inverseMercator(a.top,a.right):new OpenLayers.LonLat(a.top,a.right),b=new google.maps.LatLngBounds(new google.maps.LatLng(b.lat,b.lon),new google.maps.LatLng(a.lat,a.lon)));return b},getMapObjectLonLatFromMapObjectPixel:function(a){var b=this.map.getSize(),c=this.getLongitudeFromMapObjectLonLat(this.mapObject.center),d=this.getLatitudeFromMapObjectLonLat(this.mapObject.center),e=this.map.getResolution(),a=new OpenLayers.LonLat(c+(a.x-b.w/2)*e,d-(a.y-b.h/2)*e);
this.wrapDateLine&&(a=a.wrapDateLine(this.maxExtent));return this.getMapObjectLonLatFromLonLat(a.lon,a.lat)},getMapObjectPixelFromMapObjectLonLat:function(a){var b=this.getLongitudeFromMapObjectLonLat(a),a=this.getLatitudeFromMapObjectLonLat(a),c=this.map.getResolution(),d=this.map.getExtent();return this.getMapObjectPixelFromXY(1/c*(b-d.left),1/c*(d.top-a))},setMapObjectCenter:function(a,b){if(!1===this.animationEnabled&&b!=this.mapObject.zoom){var c=this.getMapContainer();google.maps.event.addListenerOnce(this.mapObject,
"idle",function(){c.style.visibility=""});c.style.visibility="hidden"}this.mapObject.setOptions({center:a,zoom:b})},getMapObjectZoomFromMapObjectBounds:function(a){return this.mapObject.getBoundsZoomLevel(a)},getMapObjectLonLatFromLonLat:function(a,b){var c;this.sphericalMercator?(c=this.inverseMercator(a,b),c=new google.maps.LatLng(c.lat,c.lon)):c=new google.maps.LatLng(b,a);return c},getMapObjectPixelFromXY:function(a,b){return new google.maps.Point(a,b)},destroy:function(){this.repositionListener&&
google.maps.event.removeListener(this.repositionListener);this.repositionTimer&&window.clearTimeout(this.repositionTimer);OpenLayers.Layer.Google.prototype.destroy.apply(this,arguments)}};OpenLayers.Format.WPSDescribeProcess=OpenLayers.Class(OpenLayers.Format.XML,{VERSION:"1.0.0",namespaces:{wps:"http://www.opengis.net/wps/1.0.0",ows:"http://www.opengis.net/ows/1.1",xsi:"http://www.w3.org/2001/XMLSchema-instance"},schemaLocation:"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd",defaultPrefix:"wps",regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,
[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,b);return b},readers:{wps:{ProcessDescriptions:function(a,b){b.processDescriptions={};this.readChildNodes(a,b.processDescriptions)},ProcessDescription:function(a,b){var c={processVersion:this.getAttributeNS(a,this.namespaces.wps,"processVersion"),statusSupported:"true"===a.getAttribute("statusSupported"),storeSupported:"true"===a.getAttribute("storeSupported")};this.readChildNodes(a,c);b[c.identifier]=c},DataInputs:function(a,
b){b.dataInputs=[];this.readChildNodes(a,b.dataInputs)},ProcessOutputs:function(a,b){b.processOutputs=[];this.readChildNodes(a,b.processOutputs)},Output:function(a,b){var c={};this.readChildNodes(a,c);b.push(c)},ComplexOutput:function(a,b){b.complexOutput={};this.readChildNodes(a,b.complexOutput)},Input:function(a,b){var c={maxOccurs:parseInt(a.getAttribute("maxOccurs")),minOccurs:parseInt(a.getAttribute("minOccurs"))};this.readChildNodes(a,c);b.push(c)},BoundingBoxData:function(a,b){b.boundingBoxData=
{};this.readChildNodes(a,b.boundingBoxData)},CRS:function(a,b){b.CRSs||(b.CRSs={});b.CRSs[this.getChildValue(a)]=!0},LiteralData:function(a,b){b.literalData={};this.readChildNodes(a,b.literalData)},ComplexData:function(a,b){b.complexData={};this.readChildNodes(a,b.complexData)},Default:function(a,b){b["default"]={};this.readChildNodes(a,b["default"])},Supported:function(a,b){b.supported={};this.readChildNodes(a,b.supported)},Format:function(a,b){var c={};this.readChildNodes(a,c);b.formats||(b.formats=
{});b.formats[c.mimeType]=!0},MimeType:function(a,b){b.mimeType=this.getChildValue(a)}},ows:OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows},CLASS_NAME:"OpenLayers.Format.WPSDescribeProcess"});OpenLayers.Format.CSWGetRecords.v2_0_2=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{csw:"http://www.opengis.net/cat/csw/2.0.2",dc:"http://purl.org/dc/elements/1.1/",dct:"http://purl.org/dc/terms/",gmd:"http://www.isotc211.org/2005/gmd",geonet:"http://www.fao.org/geonetwork",ogc:"http://www.opengis.net/ogc",ows:"http://www.opengis.net/ows",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},defaultPrefix:"csw",version:"2.0.2",schemaLocation:"http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd",
requestId:null,resultType:null,outputFormat:null,outputSchema:null,startPosition:null,maxRecords:null,DistributedSearch:null,ResponseHandler:null,Query:null,regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,b);return b},
readers:{csw:{GetRecordsResponse:function(a,b){b.records=[];this.readChildNodes(a,b);var c=this.getAttributeNS(a,"","version");""!=c&&(b.version=c)},RequestId:function(a,b){b.RequestId=this.getChildValue(a)},SearchStatus:function(a,b){b.SearchStatus={};var c=this.getAttributeNS(a,"","timestamp");""!=c&&(b.SearchStatus.timestamp=c)},SearchResults:function(a,b){this.readChildNodes(a,b);for(var c=a.attributes,d={},e=0,f=c.length;e<f;++e)d[c[e].name]="numberOfRecordsMatched"==c[e].name||"numberOfRecordsReturned"==
c[e].name||"nextRecord"==c[e].name?parseInt(c[e].nodeValue):c[e].nodeValue;b.SearchResults=d},SummaryRecord:function(a,b){var c={type:"SummaryRecord"};this.readChildNodes(a,c);b.records.push(c)},BriefRecord:function(a,b){var c={type:"BriefRecord"};this.readChildNodes(a,c);b.records.push(c)},DCMIRecord:function(a,b){var c={type:"DCMIRecord"};this.readChildNodes(a,c);b.records.push(c)},Record:function(a,b){var c={type:"Record"};this.readChildNodes(a,c);b.records.push(c)},"*":function(a,b){var c=a.localName||
a.nodeName.split(":").pop();b[c]=this.getChildValue(a)}},geonet:{info:function(a,b){var c={};this.readChildNodes(a,c);b.gninfo=c}},dc:{"*":function(a,b){var c=a.localName||a.nodeName.split(":").pop();OpenLayers.Util.isArray(b[c])||(b[c]=[]);for(var d={},e=a.attributes,f=0,g=e.length;f<g;++f)d[e[f].name]=e[f].nodeValue;d.value=this.getChildValue(a);""!=d.value&&b[c].push(d)}},dct:{"*":function(a,b){var c=a.localName||a.nodeName.split(":").pop();OpenLayers.Util.isArray(b[c])||(b[c]=[]);b[c].push(this.getChildValue(a))}},
ows:OpenLayers.Util.applyDefaults({BoundingBox:function(a,b){b.bounds&&(b.BoundingBox=[{crs:b.projection,value:[b.bounds.left,b.bounds.bottom,b.bounds.right,b.bounds.top]}],delete b.projection,delete b.bounds);OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows.BoundingBox.apply(this,arguments)}},OpenLayers.Format.OWSCommon.v1_0_0.prototype.readers.ows)},write:function(a){a=this.writeNode("csw:GetRecords",a);a.setAttribute("xmlns:gmd",this.namespaces.gmd);return OpenLayers.Format.XML.prototype.write.apply(this,
[a])},writers:{csw:{GetRecords:function(a){a||(a={});var b=this.createElementNSPlus("csw:GetRecords",{attributes:{service:"CSW",version:this.version,requestId:a.requestId||this.requestId,resultType:a.resultType||this.resultType,outputFormat:a.outputFormat||this.outputFormat,outputSchema:a.outputSchema||this.outputSchema,startPosition:a.startPosition||this.startPosition,maxRecords:a.maxRecords||this.maxRecords}});if(a.DistributedSearch||this.DistributedSearch)this.writeNode("csw:DistributedSearch",
a.DistributedSearch||this.DistributedSearch,b);var c=a.ResponseHandler||this.ResponseHandler;if(OpenLayers.Util.isArray(c)&&0<c.length)for(var d=0,e=c.length;d<e;d++)this.writeNode("csw:ResponseHandler",c[d],b);this.writeNode("Query",a.Query||this.Query,b);return b},DistributedSearch:function(a){return this.createElementNSPlus("csw:DistributedSearch",{attributes:{hopCount:a.hopCount}})},ResponseHandler:function(a){return this.createElementNSPlus("csw:ResponseHandler",{value:a.value})},Query:function(a){a||
(a={});var b=this.createElementNSPlus("csw:Query",{attributes:{typeNames:a.typeNames||"csw:Record"}}),c=a.ElementName;if(OpenLayers.Util.isArray(c)&&0<c.length)for(var d=0,e=c.length;d<e;d++)this.writeNode("csw:ElementName",c[d],b);else this.writeNode("csw:ElementSetName",a.ElementSetName||{value:"summary"},b);a.Constraint&&this.writeNode("csw:Constraint",a.Constraint,b);a.SortBy&&this.writeNode("ogc:SortBy",a.SortBy,b);return b},ElementName:function(a){return this.createElementNSPlus("csw:ElementName",
{value:a.value})},ElementSetName:function(a){return this.createElementNSPlus("csw:ElementSetName",{attributes:{typeNames:a.typeNames},value:a.value})},Constraint:function(a){var b=this.createElementNSPlus("csw:Constraint",{attributes:{version:a.version}});if(a.Filter){var c=new OpenLayers.Format.Filter({version:a.version});b.appendChild(c.write(a.Filter))}else a.CqlText&&(a=this.createElementNSPlus("CqlText",{value:a.CqlText.value}),b.appendChild(a));return b}},ogc:OpenLayers.Format.Filter.v1_1_0.prototype.writers.ogc},
CLASS_NAME:"OpenLayers.Format.CSWGetRecords.v2_0_2"});OpenLayers.Marker.Box=OpenLayers.Class(OpenLayers.Marker,{bounds:null,div:null,initialize:function(a,b,c){this.bounds=a;this.div=OpenLayers.Util.createDiv();this.div.style.overflow="hidden";this.events=new OpenLayers.Events(this,this.div);this.setBorder(b,c)},destroy:function(){this.div=this.bounds=null;OpenLayers.Marker.prototype.destroy.apply(this,arguments)},setBorder:function(a,b){a||(a="red");b||(b=2);this.div.style.border=b+"px solid "+a},draw:function(a,b){OpenLayers.Util.modifyDOMElement(this.div,
null,a,b);return this.div},onScreen:function(){var a=!1;this.map&&(a=this.map.getExtent().containsBounds(this.bounds,!0,!0));return a},display:function(a){this.div.style.display=a?"":"none"},CLASS_NAME:"OpenLayers.Marker.Box"});OpenLayers.Format.Text=OpenLayers.Class(OpenLayers.Format,{defaultStyle:null,extractStyles:!0,initialize:function(a){a=a||{};!1!==a.extractStyles&&(a.defaultStyle={externalGraphic:OpenLayers.Util.getImageLocation("marker.png"),graphicWidth:21,graphicHeight:25,graphicXOffset:-10.5,graphicYOffset:-12.5});OpenLayers.Format.prototype.initialize.apply(this,[a])},read:function(a){for(var a=a.split("\n"),b,c=[],d=0;d<a.length-1;d++){var e=a[d].replace(/^\s*/,"").replace(/\s*$/,"");if("#"!=e.charAt(0))if(b){for(var e=
e.split("\t"),f=new OpenLayers.Geometry.Point(0,0),g={},h=this.defaultStyle?OpenLayers.Util.applyDefaults({},this.defaultStyle):null,i=!1,j=0;j<e.length;j++)if(e[j])if("point"==b[j])i=e[j].split(","),f.y=parseFloat(i[0]),f.x=parseFloat(i[1]),i=!0;else if("lat"==b[j])f.y=parseFloat(e[j]),i=!0;else if("lon"==b[j])f.x=parseFloat(e[j]),i=!0;else if("title"==b[j])g.title=e[j];else if("image"==b[j]||"icon"==b[j]&&h)h.externalGraphic=e[j];else if("iconSize"==b[j]&&h){var k=e[j].split(",");h.graphicWidth=
parseFloat(k[0]);h.graphicHeight=parseFloat(k[1])}else"iconOffset"==b[j]&&h?(k=e[j].split(","),h.graphicXOffset=parseFloat(k[0]),h.graphicYOffset=parseFloat(k[1])):"description"==b[j]?g.description=e[j]:"overflow"==b[j]?g.overflow=e[j]:g[b[j]]=e[j];i&&(this.internalProjection&&this.externalProjection&&f.transform(this.externalProjection,this.internalProjection),e=new OpenLayers.Feature.Vector(f,g,h),c.push(e))}else b=e.split("\t")}return c},CLASS_NAME:"OpenLayers.Format.Text"});OpenLayers.Layer.Text=OpenLayers.Class(OpenLayers.Layer.Markers,{location:null,features:null,formatOptions:null,selectedFeature:null,initialize:function(a,b){OpenLayers.Layer.Markers.prototype.initialize.apply(this,arguments);this.features=[]},destroy:function(){OpenLayers.Layer.Markers.prototype.destroy.apply(this,arguments);this.clearFeatures();this.features=null},loadText:function(){!this.loaded&&null!=this.location&&(this.events.triggerEvent("loadstart"),OpenLayers.Request.GET({url:this.location,
success:this.parseData,failure:function(){this.events.triggerEvent("loadend")},scope:this}),this.loaded=!0)},moveTo:function(a,b,c){OpenLayers.Layer.Markers.prototype.moveTo.apply(this,arguments);this.visibility&&!this.loaded&&this.loadText()},parseData:function(a){var a=a.responseText,b={};OpenLayers.Util.extend(b,this.formatOptions);this.map&&!this.projection.equals(this.map.getProjectionObject())&&(b.externalProjection=this.projection,b.internalProjection=this.map.getProjectionObject());for(var a=
(new OpenLayers.Format.Text(b)).read(a),b=0,c=a.length;b<c;b++){var d={},e=a[b],f,g,h;f=new OpenLayers.LonLat(e.geometry.x,e.geometry.y);e.style.graphicWidth&&e.style.graphicHeight&&(g=new OpenLayers.Size(e.style.graphicWidth,e.style.graphicHeight));void 0!==e.style.graphicXOffset&&void 0!==e.style.graphicYOffset&&(h=new OpenLayers.Pixel(e.style.graphicXOffset,e.style.graphicYOffset));null!=e.style.externalGraphic?d.icon=new OpenLayers.Icon(e.style.externalGraphic,g,h):(d.icon=OpenLayers.Marker.defaultIcon(),
null!=g&&d.icon.setSize(g));null!=e.attributes.title&&null!=e.attributes.description&&(d.popupContentHTML="<h2>"+e.attributes.title+"</h2><p>"+e.attributes.description+"</p>");d.overflow=e.attributes.overflow||"auto";d=new OpenLayers.Feature(this,f,d);this.features.push(d);f=d.createMarker();null!=e.attributes.title&&null!=e.attributes.description&&f.events.register("click",d,this.markerClick);this.addMarker(f)}this.events.triggerEvent("loadend")},markerClick:function(a){var b=this==this.layer.selectedFeature;
this.layer.selectedFeature=!b?this:null;for(var c=0,d=this.layer.map.popups.length;c<d;c++)this.layer.map.removePopup(this.layer.map.popups[c]);b||this.layer.map.addPopup(this.createPopup());OpenLayers.Event.stop(a)},clearFeatures:function(){if(null!=this.features)for(;0<this.features.length;){var a=this.features[0];OpenLayers.Util.removeItem(this.features,a);a.destroy()}},CLASS_NAME:"OpenLayers.Layer.Text"});OpenLayers.Handler.RegularPolygon=OpenLayers.Class(OpenLayers.Handler.Drag,{sides:4,radius:null,snapAngle:null,snapToggle:"shiftKey",layerOptions:null,persist:!1,irregular:!1,citeCompliant:!1,angle:null,fixedRadius:!1,feature:null,layer:null,origin:null,initialize:function(a,b,c){if(!c||!c.layerOptions||!c.layerOptions.styleMap)this.style=OpenLayers.Util.extend(OpenLayers.Feature.Vector.style["default"],{});OpenLayers.Handler.Drag.prototype.initialize.apply(this,[a,b,c]);this.options=c?c:{}},setOptions:function(a){OpenLayers.Util.extend(this.options,
a);OpenLayers.Util.extend(this,a)},activate:function(){var a=!1;OpenLayers.Handler.Drag.prototype.activate.apply(this,arguments)&&(a=OpenLayers.Util.extend({displayInLayerSwitcher:!1,calculateInRange:OpenLayers.Function.True,wrapDateLine:this.citeCompliant},this.layerOptions),this.layer=new OpenLayers.Layer.Vector(this.CLASS_NAME,a),this.map.addLayer(this.layer),a=!0);return a},deactivate:function(){var a=!1;OpenLayers.Handler.Drag.prototype.deactivate.apply(this,arguments)&&(this.dragging&&this.cancel(),
null!=this.layer.map&&(this.layer.destroy(!1),this.feature&&this.feature.destroy()),this.feature=this.layer=null,a=!0);return a},down:function(a){this.fixedRadius=!!this.radius;a=this.layer.getLonLatFromViewPortPx(a.xy);this.origin=new OpenLayers.Geometry.Point(a.lon,a.lat);if(!this.fixedRadius||this.irregular)this.radius=this.map.getResolution();this.persist&&this.clear();this.feature=new OpenLayers.Feature.Vector;this.createGeometry();this.callback("create",[this.origin,this.feature]);this.layer.addFeatures([this.feature],
{silent:!0});this.layer.drawFeature(this.feature,this.style)},move:function(a){var b=this.layer.getLonLatFromViewPortPx(a.xy),b=new OpenLayers.Geometry.Point(b.lon,b.lat);this.irregular?(a=Math.sqrt(2)*Math.abs(b.y-this.origin.y)/2,this.radius=Math.max(this.map.getResolution()/2,a)):this.fixedRadius?this.origin=b:(this.calculateAngle(b,a),this.radius=Math.max(this.map.getResolution()/2,b.distanceTo(this.origin)));this.modifyGeometry();this.irregular&&(a=b.x-this.origin.x,b=b.y-this.origin.y,this.feature.geometry.resize(1,
this.origin,0==b?a/(this.radius*Math.sqrt(2)):a/b),this.feature.geometry.move(a/2,b/2));this.layer.drawFeature(this.feature,this.style)},up:function(a){this.finalize();this.start==this.last&&this.callback("done",[a.xy])},out:function(){this.finalize()},createGeometry:function(){this.angle=Math.PI*(1/this.sides-0.5);this.snapAngle&&(this.angle+=this.snapAngle*(Math.PI/180));this.feature.geometry=OpenLayers.Geometry.Polygon.createRegularPolygon(this.origin,this.radius,this.sides,this.snapAngle)},modifyGeometry:function(){var a,
b,c=this.feature.geometry.components[0];c.components.length!=this.sides+1&&(this.createGeometry(),c=this.feature.geometry.components[0]);for(var d=0;d<this.sides;++d)b=c.components[d],a=this.angle+2*d*Math.PI/this.sides,b.x=this.origin.x+this.radius*Math.cos(a),b.y=this.origin.y+this.radius*Math.sin(a),b.clearBounds()},calculateAngle:function(a,b){var c=Math.atan2(a.y-this.origin.y,a.x-this.origin.x);if(this.snapAngle&&this.snapToggle&&!b[this.snapToggle]){var d=Math.PI/180*this.snapAngle;this.angle=
Math.round(c/d)*d}else this.angle=c},cancel:function(){this.callback("cancel",null);this.finalize()},finalize:function(){this.origin=null;this.radius=this.options.radius},clear:function(){this.layer&&(this.layer.renderer.clear(),this.layer.destroyFeatures())},callback:function(a){this.callbacks[a]&&this.callbacks[a].apply(this.control,[this.feature.geometry.clone()]);!this.persist&&("done"==a||"cancel"==a)&&this.clear()},CLASS_NAME:"OpenLayers.Handler.RegularPolygon"});OpenLayers.Control.SLDSelect=OpenLayers.Class(OpenLayers.Control,{clearOnDeactivate:!1,layers:null,callbacks:null,selectionSymbolizer:{Polygon:{fillColor:"#FF0000",stroke:!1},Line:{strokeColor:"#FF0000",strokeWidth:2},Point:{graphicName:"square",fillColor:"#FF0000",pointRadius:5}},layerOptions:null,handlerOptions:null,sketchStyle:null,wfsCache:{},layerCache:{},initialize:function(a,b){OpenLayers.Control.prototype.initialize.apply(this,[b]);this.callbacks=OpenLayers.Util.extend({done:this.select,click:this.select},
this.callbacks);this.handlerOptions=this.handlerOptions||{};this.layerOptions=OpenLayers.Util.applyDefaults(this.layerOptions,{displayInLayerSwitcher:!1,tileOptions:{maxGetUrlLength:2048}});this.sketchStyle&&(this.handlerOptions.layerOptions=OpenLayers.Util.applyDefaults(this.handlerOptions.layerOptions,{styleMap:new OpenLayers.StyleMap({"default":this.sketchStyle})}));this.handler=new a(this,this.callbacks,this.handlerOptions)},destroy:function(){for(var a in this.layerCache)delete this.layerCache[a];
for(a in this.wfsCache)delete this.wfsCache[a];OpenLayers.Control.prototype.destroy.apply(this,arguments)},coupleLayerVisiblity:function(a){this.setVisibility(a.object.getVisibility())},createSelectionLayer:function(a){var b;if(this.layerCache[a.id])b=this.layerCache[a.id];else{b=new OpenLayers.Layer.WMS(a.name,a.url,a.params,OpenLayers.Util.applyDefaults(this.layerOptions,a.getOptions()));this.layerCache[a.id]=b;if(!1===this.layerOptions.displayInLayerSwitcher)a.events.on({visibilitychanged:this.coupleLayerVisiblity,
scope:b});this.map.addLayer(b)}return b},createSLD:function(a,b,c){for(var d={version:"1.0.0",namedLayers:{}},e=(""+a.params.LAYERS).split(","),f=0,g=e.length;f<g;f++){var h=e[f];d.namedLayers[h]={name:h,userStyles:[]};var i=this.selectionSymbolizer,j=c[f];0<=j.type.indexOf("Polygon")?i={Polygon:this.selectionSymbolizer.Polygon}:0<=j.type.indexOf("LineString")?i={Line:this.selectionSymbolizer.Line}:0<=j.type.indexOf("Point")&&(i={Point:this.selectionSymbolizer.Point});d.namedLayers[h].userStyles.push({name:"default",
rules:[new OpenLayers.Rule({symbolizer:i,filter:b[f],maxScaleDenominator:a.options.minScale})]})}return(new OpenLayers.Format.SLD({srsName:this.map.getProjection()})).write(d)},parseDescribeLayer:function(a){var b=new OpenLayers.Format.WMSDescribeLayer,c=a.responseXML;if(!c||!c.documentElement)c=a.responseText;for(var a=b.read(c),b=[],c=null,d=0,e=a.length;d<e;d++)"WFS"==a[d].owsType&&(b.push(a[d].typeName),c=a[d].owsURL);OpenLayers.Request.GET({url:c,params:{SERVICE:"WFS",TYPENAME:b.toString(),REQUEST:"DescribeFeatureType",
VERSION:"1.0.0"},callback:function(a){var b=new OpenLayers.Format.WFSDescribeFeatureType,c=a.responseXML;if(!c||!c.documentElement)c=a.responseText;this.control.wfsCache[this.layer.id]=b.read(c);this.control._queue&&this.control.applySelection()},scope:this})},getGeometryAttributes:function(a){for(var b=[],a=this.wfsCache[a.id],c=0,d=a.featureTypes.length;c<d;c++)for(var e=a.featureTypes[c].properties,f=0,g=e.length;f<g;f++){var h=e[f],i=h.type;(0<=i.indexOf("LineString")||0<=i.indexOf("GeometryAssociationType")||
0<=i.indexOf("GeometryPropertyType")||0<=i.indexOf("Point")||0<=i.indexOf("Polygon"))&&b.push(h)}return b},activate:function(){var a=OpenLayers.Control.prototype.activate.call(this);if(a)for(var b=0,c=this.layers.length;b<c;b++){var d=this.layers[b];d&&!this.wfsCache[d.id]&&OpenLayers.Request.GET({url:d.url,params:{SERVICE:"WMS",VERSION:d.params.VERSION,LAYERS:d.params.LAYERS,REQUEST:"DescribeLayer"},callback:this.parseDescribeLayer,scope:{layer:d,control:this}})}return a},deactivate:function(){var a=
OpenLayers.Control.prototype.deactivate.call(this);if(a)for(var b=0,c=this.layers.length;b<c;b++){var d=this.layers[b];if(d&&!0===this.clearOnDeactivate){var e=this.layerCache,f=e[d.id];f&&(d.events.un({visibilitychanged:this.coupleLayerVisiblity,scope:f}),f.destroy(),delete e[d.id])}}return a},setLayers:function(a){this.active?(this.deactivate(),this.layers=a,this.activate()):this.layers=a},createFilter:function(a,b){var c=null;this.handler instanceof OpenLayers.Handler.RegularPolygon?c=!0===this.handler.irregular?
new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.BBOX,property:a.name,value:b.getBounds()}):new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.INTERSECTS,property:a.name,value:b}):this.handler instanceof OpenLayers.Handler.Polygon?c=new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.INTERSECTS,property:a.name,value:b}):this.handler instanceof OpenLayers.Handler.Path?c=0<=a.type.indexOf("Point")?new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.DWITHIN,
property:a.name,distance:0.01*this.map.getExtent().getWidth(),distanceUnits:this.map.getUnits(),value:b}):new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.INTERSECTS,property:a.name,value:b}):this.handler instanceof OpenLayers.Handler.Click&&(c=0<=a.type.indexOf("Polygon")?new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.INTERSECTS,property:a.name,value:b}):new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.DWITHIN,property:a.name,distance:0.01*this.map.getExtent().getWidth(),
distanceUnits:this.map.getUnits(),value:b}));return c},select:function(a){this._queue=function(){for(var b=0,c=this.layers.length;b<c;b++){for(var d=this.layers[b],e=this.getGeometryAttributes(d),f=[],g=0,h=e.length;g<h;g++){var i=e[g];if(null!==i){if(!(a instanceof OpenLayers.Geometry)){var j=this.map.getLonLatFromPixel(a.xy);a=new OpenLayers.Geometry.Point(j.lon,j.lat)}i=this.createFilter(i,a);null!==i&&f.push(i)}}g=this.createSelectionLayer(d);e=this.createSLD(d,f,e);this.events.triggerEvent("selected",
{layer:d,filters:f});g.mergeNewParams({SLD_BODY:e});delete this._queue}};this.applySelection()},applySelection:function(){for(var a=!0,b=0,c=this.layers.length;b<c;b++)if(!this.wfsCache[this.layers[b].id]){a=!1;break}a&&this._queue.call(this)},CLASS_NAME:"OpenLayers.Control.SLDSelect"});OpenLayers.Control.Scale=OpenLayers.Class(OpenLayers.Control,{element:null,geodesic:!1,initialize:function(a,b){OpenLayers.Control.prototype.initialize.apply(this,[b]);this.element=OpenLayers.Util.getElement(a)},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);this.element||(this.element=document.createElement("div"),this.div.appendChild(this.element));this.map.events.register("moveend",this,this.updateScale);this.updateScale();return this.div},updateScale:function(){var a;
if(!0===this.geodesic){if(!this.map.getUnits())return;a=OpenLayers.INCHES_PER_UNIT;a=(this.map.getGeodesicPixelSize().w||1.0E-6)*a.km*OpenLayers.DOTS_PER_INCH}else a=this.map.getScale();a&&(a=9500<=a&&95E4>=a?Math.round(a/1E3)+"K":95E4<=a?Math.round(a/1E6)+"M":Math.round(a),this.element.innerHTML=OpenLayers.i18n("Scale = 1 : ${scaleDenom}",{scaleDenom:a}))},CLASS_NAME:"OpenLayers.Control.Scale"});OpenLayers.Control.Button=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_BUTTON,trigger:function(){},CLASS_NAME:"OpenLayers.Control.Button"});OpenLayers.Layer.MapGuide=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:!0,useHttpTile:!1,singleTile:!1,useOverlay:!1,useAsyncOverlay:!0,TILE_PARAMS:{operation:"GETTILEIMAGE",version:"1.2.0"},SINGLE_TILE_PARAMS:{operation:"GETMAPIMAGE",format:"PNG",locale:"en",clip:"1",version:"1.0.0"},OVERLAY_PARAMS:{operation:"GETDYNAMICMAPOVERLAYIMAGE",format:"PNG",locale:"en",clip:"1",version:"2.0.0"},FOLDER_PARAMS:{tileColumnsPerFolder:30,tileRowsPerFolder:30,format:"png",querystring:null},defaultSize:new OpenLayers.Size(300,
300),tileOriginCorner:"tl",initialize:function(a,b,c,d){OpenLayers.Layer.Grid.prototype.initialize.apply(this,arguments);if(null==d||null==d.isBaseLayer)this.isBaseLayer="true"!=this.transparent&&!0!=this.transparent;d&&null!=d.useOverlay&&(this.useOverlay=d.useOverlay);this.singleTile?this.useOverlay?(OpenLayers.Util.applyDefaults(this.params,this.OVERLAY_PARAMS),this.useAsyncOverlay||(this.params.version="1.0.0")):OpenLayers.Util.applyDefaults(this.params,this.SINGLE_TILE_PARAMS):(this.useHttpTile?
OpenLayers.Util.applyDefaults(this.params,this.FOLDER_PARAMS):OpenLayers.Util.applyDefaults(this.params,this.TILE_PARAMS),this.setTileSize(this.defaultSize))},clone:function(a){null==a&&(a=new OpenLayers.Layer.MapGuide(this.name,this.url,this.params,this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},getURL:function(a){var b;b=a.getCenterLonLat();var c=this.map.getSize();this.singleTile?(a={setdisplaydpi:OpenLayers.DOTS_PER_INCH,setdisplayheight:c.h*this.ratio,setdisplaywidth:c.w*
this.ratio,setviewcenterx:b.lon,setviewcentery:b.lat,setviewscale:this.map.getScale()},this.useOverlay&&!this.useAsyncOverlay&&(b={},b=OpenLayers.Util.extend(b,a),b.operation="GETVISIBLEMAPEXTENT",b.version="1.0.0",b.session=this.params.session,b.mapName=this.params.mapName,b.format="text/xml",b=this.getFullRequestString(b),OpenLayers.Request.GET({url:b,async:!1})),b=this.getFullRequestString(a)):(c=this.map.getResolution(),b=Math.floor((a.left-this.maxExtent.left)/c),b=Math.round(b/this.tileSize.w),
a=Math.floor((this.maxExtent.top-a.top)/c),a=Math.round(a/this.tileSize.h),b=this.useHttpTile?this.getImageFilePath({tilecol:b,tilerow:a,scaleindex:this.resolutions.length-this.map.zoom-1}):this.getFullRequestString({tilecol:b,tilerow:a,scaleindex:this.resolutions.length-this.map.zoom-1}));return b},getFullRequestString:function(a,b){var c=null==b?this.url:b;"object"==typeof c&&(c=c[Math.floor(Math.random()*c.length)]);var d=c,e=OpenLayers.Util.extend({},this.params),e=OpenLayers.Util.extend(e,a),
f=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(c)),g;for(g in e)g.toUpperCase()in f&&delete e[g];e=OpenLayers.Util.getParameterString(e);e=e.replace(/,/g,"+");""!=e&&(f=c.charAt(c.length-1),d="&"==f||"?"==f?d+e:-1==c.indexOf("?")?d+("?"+e):d+("&"+e));return d},getImageFilePath:function(a,b){var c=null==b?this.url:b;"object"==typeof c&&(c=c[Math.floor(Math.random()*c.length)]);var d="",e="";0>a.tilerow&&(d="-");d=0==a.tilerow?d+"0":d+Math.floor(Math.abs(a.tilerow/this.params.tileRowsPerFolder))*
this.params.tileRowsPerFolder;0>a.tilecol&&(e="-");e=0==a.tilecol?e+"0":e+Math.floor(Math.abs(a.tilecol/this.params.tileColumnsPerFolder))*this.params.tileColumnsPerFolder;d="/S"+Math.floor(a.scaleindex)+"/"+this.params.basemaplayergroupname+"/R"+d+"/C"+e+"/"+a.tilerow%this.params.tileRowsPerFolder+"_"+a.tilecol%this.params.tileColumnsPerFolder+"."+this.params.format;this.params.querystring&&(d+="?"+this.params.querystring);return c+d},calculateGridLayout:function(a,b,c){var d=c*this.tileSize.w,c=
c*this.tileSize.h,e=a.left-b.lon,f=Math.floor(e/d)-this.buffer,a=b.lat-a.top+c,g=Math.floor(a/c)-this.buffer;return{tilelon:d,tilelat:c,tileoffsetlon:b.lon+f*d,tileoffsetlat:b.lat-c*g,tileoffsetx:-(e/d-f)*this.tileSize.w,tileoffsety:(g-a/c)*this.tileSize.h}},CLASS_NAME:"OpenLayers.Layer.MapGuide"});OpenLayers.Control.Measure=OpenLayers.Class(OpenLayers.Control,{handlerOptions:null,callbacks:null,displaySystem:"metric",geodesic:!1,displaySystemUnits:{geographic:["dd"],english:["mi","ft","in"],metric:["km","m"]},partialDelay:300,delayedTrigger:null,persist:!1,immediate:!1,initialize:function(a,b){OpenLayers.Control.prototype.initialize.apply(this,[b]);var c={done:this.measureComplete,point:this.measurePartial};this.immediate&&(c.modify=this.measureImmediate);this.callbacks=OpenLayers.Util.extend(c,
this.callbacks);this.handlerOptions=OpenLayers.Util.extend({persist:this.persist},this.handlerOptions);this.handler=new a(this,this.callbacks,this.handlerOptions)},deactivate:function(){this.cancelDelay();return OpenLayers.Control.prototype.deactivate.apply(this,arguments)},cancel:function(){this.cancelDelay();this.handler.cancel()},setImmediate:function(a){(this.immediate=a)?this.callbacks.modify=this.measureImmediate:delete this.callbacks.modify},updateHandler:function(a,b){var c=this.active;c&&
this.deactivate();this.handler=new a(this,this.callbacks,b);c&&this.activate()},measureComplete:function(a){this.cancelDelay();this.measure(a,"measure")},measurePartial:function(a,b){this.cancelDelay();b=b.clone();this.handler.freehandMode(this.handler.evt)?this.measure(b,"measurepartial"):this.delayedTrigger=window.setTimeout(OpenLayers.Function.bind(function(){this.delayedTrigger=null;this.measure(b,"measurepartial")},this),this.partialDelay)},measureImmediate:function(a,b,c){c&&!this.handler.freehandMode(this.handler.evt)&&
(this.cancelDelay(),this.measure(b.geometry,"measurepartial"))},cancelDelay:function(){null!==this.delayedTrigger&&(window.clearTimeout(this.delayedTrigger),this.delayedTrigger=null)},measure:function(a,b){var c,d;-1<a.CLASS_NAME.indexOf("LineString")?(c=this.getBestLength(a),d=1):(c=this.getBestArea(a),d=2);this.events.triggerEvent(b,{measure:c[0],units:c[1],order:d,geometry:a})},getBestArea:function(a){for(var b=this.displaySystemUnits[this.displaySystem],c,d,e=0,f=b.length;e<f&&!(c=b[e],d=this.getArea(a,
c),1<d);++e);return[d,c]},getArea:function(a,b){var c,d;this.geodesic?(c=a.getGeodesicArea(this.map.getProjectionObject()),d="m"):(c=a.getArea(),d=this.map.getUnits());var e=OpenLayers.INCHES_PER_UNIT[b];e&&(c*=Math.pow(OpenLayers.INCHES_PER_UNIT[d]/e,2));return c},getBestLength:function(a){for(var b=this.displaySystemUnits[this.displaySystem],c,d,e=0,f=b.length;e<f&&!(c=b[e],d=this.getLength(a,c),1<d);++e);return[d,c]},getLength:function(a,b){var c,d;this.geodesic?(c=a.getGeodesicLength(this.map.getProjectionObject()),
d="m"):(c=a.getLength(),d=this.map.getUnits());var e=OpenLayers.INCHES_PER_UNIT[b];e&&(c*=OpenLayers.INCHES_PER_UNIT[d]/e);return c},CLASS_NAME:"OpenLayers.Control.Measure"});OpenLayers.Format.WMC.v1_0_0=OpenLayers.Class(OpenLayers.Format.WMC.v1,{VERSION:"1.0.0",schemaLocation:"http://www.opengis.net/context http://schemas.opengis.net/context/1.0.0/context.xsd",initialize:function(a){OpenLayers.Format.WMC.v1.prototype.initialize.apply(this,[a])},read_wmc_SRS:function(a,b){var c=this.getChildValue(b);"object"!=typeof a.projections&&(a.projections={});for(var c=c.split(/ +/),d=0,e=c.length;d<e;d++)a.projections[c[d]]=!0},write_wmc_Layer:function(a){var b=OpenLayers.Format.WMC.v1.prototype.write_wmc_Layer.apply(this,
[a]);if(a.srs){var c=[],d;for(d in a.srs)c.push(d);b.appendChild(this.createElementDefaultNS("SRS",c.join(" ")))}b.appendChild(this.write_wmc_FormatList(a));b.appendChild(this.write_wmc_StyleList(a));a.dimensions&&b.appendChild(this.write_wmc_DimensionList(a));b.appendChild(this.write_wmc_LayerExtension(a))},CLASS_NAME:"OpenLayers.Format.WMC.v1_0_0"});OpenLayers.Popup.Framed=OpenLayers.Class(OpenLayers.Popup.Anchored,{imageSrc:null,imageSize:null,isAlphaImage:!1,positionBlocks:null,blocks:null,fixedRelativePosition:!1,initialize:function(a,b,c,d,e,f,g){OpenLayers.Popup.Anchored.prototype.initialize.apply(this,arguments);this.fixedRelativePosition&&(this.updateRelativePosition(),this.calculateRelativePosition=function(){return this.relativePosition});this.contentDiv.style.position="absolute";this.contentDiv.style.zIndex=1;f&&(this.closeDiv.style.zIndex=
1);this.groupDiv.style.position="absolute";this.groupDiv.style.top="0px";this.groupDiv.style.left="0px";this.groupDiv.style.height="100%";this.groupDiv.style.width="100%"},destroy:function(){this.isAlphaImage=this.imageSize=this.imageSrc=null;this.fixedRelativePosition=!1;this.positionBlocks=null;for(var a=0;a<this.blocks.length;a++){var b=this.blocks[a];b.image&&b.div.removeChild(b.image);b.image=null;b.div&&this.groupDiv.removeChild(b.div);b.div=null}this.blocks=null;OpenLayers.Popup.Anchored.prototype.destroy.apply(this,
arguments)},setBackgroundColor:function(){},setBorder:function(){},setOpacity:function(){},setSize:function(a){OpenLayers.Popup.Anchored.prototype.setSize.apply(this,arguments);this.updateBlocks()},updateRelativePosition:function(){this.padding=this.positionBlocks[this.relativePosition].padding;if(this.closeDiv){var a=this.getContentDivPadding();this.closeDiv.style.right=a.right+this.padding.right+"px";this.closeDiv.style.top=a.top+this.padding.top+"px"}this.updateBlocks()},calculateNewPx:function(a){var b=
OpenLayers.Popup.Anchored.prototype.calculateNewPx.apply(this,arguments);return b=b.offset(this.positionBlocks[this.relativePosition].offset)},createBlocks:function(){this.blocks=[];var a=null,b;for(b in this.positionBlocks){a=b;break}a=this.positionBlocks[a];for(b=0;b<a.blocks.length;b++){var c={};this.blocks.push(c);c.div=OpenLayers.Util.createDiv(this.id+"_FrameDecorationDiv_"+b,null,null,null,"absolute",null,"hidden",null);c.image=(this.isAlphaImage?OpenLayers.Util.createAlphaImageDiv:OpenLayers.Util.createImage)(this.id+
"_FrameDecorationImg_"+b,null,this.imageSize,this.imageSrc,"absolute",null,null,null);c.div.appendChild(c.image);this.groupDiv.appendChild(c.div)}},updateBlocks:function(){this.blocks||this.createBlocks();if(this.size&&this.relativePosition){for(var a=this.positionBlocks[this.relativePosition],b=0;b<a.blocks.length;b++){var c=a.blocks[b],d=this.blocks[b],e=c.anchor.left,f=c.anchor.bottom,g=c.anchor.right,h=c.anchor.top,i=isNaN(c.size.w)?this.size.w-(g+e):c.size.w,j=isNaN(c.size.h)?this.size.h-(f+
h):c.size.h;d.div.style.width=(0>i?0:i)+"px";d.div.style.height=(0>j?0:j)+"px";d.div.style.left=null!=e?e+"px":"";d.div.style.bottom=null!=f?f+"px":"";d.div.style.right=null!=g?g+"px":"";d.div.style.top=null!=h?h+"px":"";d.image.style.left=c.position.x+"px";d.image.style.top=c.position.y+"px"}this.contentDiv.style.left=this.padding.left+"px";this.contentDiv.style.top=this.padding.top+"px"}},CLASS_NAME:"OpenLayers.Popup.Framed"});OpenLayers.Popup.FramedCloud=OpenLayers.Class(OpenLayers.Popup.Framed,{contentDisplayClass:"olFramedCloudPopupContent",autoSize:!0,panMapIfOutOfView:!0,imageSize:new OpenLayers.Size(1276,736),isAlphaImage:!1,fixedRelativePosition:!1,positionBlocks:{tl:{offset:new OpenLayers.Pixel(44,0),padding:new OpenLayers.Bounds(8,40,8,9),blocks:[{size:new OpenLayers.Size("auto","auto"),anchor:new OpenLayers.Bounds(0,51,22,0),position:new OpenLayers.Pixel(0,0)},{size:new OpenLayers.Size(22,"auto"),anchor:new OpenLayers.Bounds(null,
50,0,0),position:new OpenLayers.Pixel(-1238,0)},{size:new OpenLayers.Size("auto",19),anchor:new OpenLayers.Bounds(0,32,22,null),position:new OpenLayers.Pixel(0,-631)},{size:new OpenLayers.Size(22,18),anchor:new OpenLayers.Bounds(null,32,0,null),position:new OpenLayers.Pixel(-1238,-632)},{size:new OpenLayers.Size(81,35),anchor:new OpenLayers.Bounds(null,0,0,null),position:new OpenLayers.Pixel(0,-688)}]},tr:{offset:new OpenLayers.Pixel(-45,0),padding:new OpenLayers.Bounds(8,40,8,9),blocks:[{size:new OpenLayers.Size("auto",
"auto"),anchor:new OpenLayers.Bounds(0,51,22,0),position:new OpenLayers.Pixel(0,0)},{size:new OpenLayers.Size(22,"auto"),anchor:new OpenLayers.Bounds(null,50,0,0),position:new OpenLayers.Pixel(-1238,0)},{size:new OpenLayers.Size("auto",19),anchor:new OpenLayers.Bounds(0,32,22,null),position:new OpenLayers.Pixel(0,-631)},{size:new OpenLayers.Size(22,19),anchor:new OpenLayers.Bounds(null,32,0,null),position:new OpenLayers.Pixel(-1238,-631)},{size:new OpenLayers.Size(81,35),anchor:new OpenLayers.Bounds(0,
0,null,null),position:new OpenLayers.Pixel(-215,-687)}]},bl:{offset:new OpenLayers.Pixel(45,0),padding:new OpenLayers.Bounds(8,9,8,40),blocks:[{size:new OpenLayers.Size("auto","auto"),anchor:new OpenLayers.Bounds(0,21,22,32),position:new OpenLayers.Pixel(0,0)},{size:new OpenLayers.Size(22,"auto"),anchor:new OpenLayers.Bounds(null,21,0,32),position:new OpenLayers.Pixel(-1238,0)},{size:new OpenLayers.Size("auto",21),anchor:new OpenLayers.Bounds(0,0,22,null),position:new OpenLayers.Pixel(0,-629)},{size:new OpenLayers.Size(22,
21),anchor:new OpenLayers.Bounds(null,0,0,null),position:new OpenLayers.Pixel(-1238,-629)},{size:new OpenLayers.Size(81,33),anchor:new OpenLayers.Bounds(null,null,0,0),position:new OpenLayers.Pixel(-101,-674)}]},br:{offset:new OpenLayers.Pixel(-44,0),padding:new OpenLayers.Bounds(8,9,8,40),blocks:[{size:new OpenLayers.Size("auto","auto"),anchor:new OpenLayers.Bounds(0,21,22,32),position:new OpenLayers.Pixel(0,0)},{size:new OpenLayers.Size(22,"auto"),anchor:new OpenLayers.Bounds(null,21,0,32),position:new OpenLayers.Pixel(-1238,
0)},{size:new OpenLayers.Size("auto",21),anchor:new OpenLayers.Bounds(0,0,22,null),position:new OpenLayers.Pixel(0,-629)},{size:new OpenLayers.Size(22,21),anchor:new OpenLayers.Bounds(null,0,0,null),position:new OpenLayers.Pixel(-1238,-629)},{size:new OpenLayers.Size(81,33),anchor:new OpenLayers.Bounds(0,null,null,0),position:new OpenLayers.Pixel(-311,-674)}]}},minSize:new OpenLayers.Size(105,10),maxSize:new OpenLayers.Size(1200,660),initialize:function(a,b,c,d,e,f,g){this.imageSrc=OpenLayers.Util.getImageLocation("cloud-popup-relative.png");
OpenLayers.Popup.Framed.prototype.initialize.apply(this,arguments);this.contentDiv.className=this.contentDisplayClass},CLASS_NAME:"OpenLayers.Popup.FramedCloud"});OpenLayers.Tile.Image.IFrame={useIFrame:null,draw:function(){if(OpenLayers.Tile.Image.prototype.shouldDraw.call(this)){var a=this.layer.getURL(this.bounds),b=this.useIFrame;this.useIFrame=null!==this.maxGetUrlLength&&!this.layer.async&&a.length>this.maxGetUrlLength;a=b&&!this.useIFrame;b=!b&&this.useIFrame;if(a||b)this.imgDiv&&this.imgDiv.parentNode===this.frame&&this.frame.removeChild(this.imgDiv),this.imgDiv=null,a?(this.blankImageUrl=this._blankImageUrl,this.frame.removeChild(this.frame.firstChild)):
(this._blankImageUrl=this.blankImageUrl,this.blankImageUrl="about:blank")}return OpenLayers.Tile.Image.prototype.draw.apply(this,arguments)},getImage:function(){if(!0===this.useIFrame){if(!this.frame.childNodes.length){var a=document.createElement("div"),b=a.style;b.position="absolute";b.width="100%";b.height="100%";b.zIndex=1;b.backgroundImage="url("+this._blankImageUrl+")";this.frame.appendChild(a)}a=this.id+"_iFrame";9>parseFloat(navigator.appVersion.split("MSIE")[1])?(b=document.createElement('<iframe name="'+
a+'">'),b.style.backgroundColor="#FFFFFF",b.style.filter="chroma(color=#FFFFFF)"):(b=document.createElement("iframe"),b.style.backgroundColor="transparent",b.name=a);b.scrolling="no";b.marginWidth="0px";b.marginHeight="0px";b.frameBorder="0";b.style.position="absolute";b.style.width="100%";b.style.height="100%";1>this.layer.opacity&&OpenLayers.Util.modifyDOMElement(b,null,null,null,null,null,null,this.layer.opacity);this.frame.appendChild(b);return this.imgDiv=b}return OpenLayers.Tile.Image.prototype.getImage.apply(this,
arguments)},createRequestForm:function(){var a=document.createElement("form");a.method="POST";var b=this.layer.params._OLSALT,b=(b?b+"_":"")+this.bounds.toBBOX();a.action=OpenLayers.Util.urlAppend(this.layer.url,b);a.target=this.id+"_iFrame";this.layer.getImageSize();var b=OpenLayers.Util.getParameters(this.url),c,d;for(d in b)c=document.createElement("input"),c.type="hidden",c.name=d,c.value=b[d],a.appendChild(c);return a},setImgSrc:function(a){if(!0===this.useIFrame)if(a){var b=this.createRequestForm();
this.frame.appendChild(b);b.submit();this.frame.removeChild(b)}else this.imgDiv.parentNode===this.frame&&(this.frame.removeChild(this.imgDiv),this.imgDiv=null);else OpenLayers.Tile.Image.prototype.setImgSrc.apply(this,arguments)},onImageLoad:function(){OpenLayers.Tile.Image.prototype.onImageLoad.apply(this,arguments);!0===this.useIFrame&&(this.imgDiv.style.opacity=1,this.frame.style.opacity=this.layer.opacity)},createBackBuffer:function(){var a;!1===this.useIFrame&&(a=OpenLayers.Tile.Image.prototype.createBackBuffer.call(this));
return a}};OpenLayers.Format.SOSCapabilities=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.0.0",CLASS_NAME:"OpenLayers.Format.SOSCapabilities"});OpenLayers.Format.SOSCapabilities.v1_0_0=OpenLayers.Class(OpenLayers.Format.SOSCapabilities,{namespaces:{ows:"http://www.opengis.net/ows/1.1",sos:"http://www.opengis.net/sos/1.0",gml:"http://www.opengis.net/gml",xlink:"http://www.w3.org/1999/xlink"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a]);this.options=a},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,
[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,b);return b},readers:{gml:OpenLayers.Util.applyDefaults({name:function(a,b){b.name=this.getChildValue(a)},TimePeriod:function(a,b){b.timePeriod={};this.readChildNodes(a,b.timePeriod)},beginPosition:function(a,b){b.beginPosition=this.getChildValue(a)},endPosition:function(a,b){b.endPosition=this.getChildValue(a)}},OpenLayers.Format.GML.v3.prototype.readers.gml),sos:{Capabilities:function(a,b){this.readChildNodes(a,b)},Contents:function(a,
b){b.contents={};this.readChildNodes(a,b.contents)},ObservationOfferingList:function(a,b){b.offeringList={};this.readChildNodes(a,b.offeringList)},ObservationOffering:function(a,b){var c=this.getAttributeNS(a,this.namespaces.gml,"id");b[c]={procedures:[],observedProperties:[],featureOfInterestIds:[],responseFormats:[],resultModels:[],responseModes:[]};this.readChildNodes(a,b[c])},time:function(a,b){b.time={};this.readChildNodes(a,b.time)},procedure:function(a,b){b.procedures.push(this.getAttributeNS(a,
this.namespaces.xlink,"href"))},observedProperty:function(a,b){b.observedProperties.push(this.getAttributeNS(a,this.namespaces.xlink,"href"))},featureOfInterest:function(a,b){b.featureOfInterestIds.push(this.getAttributeNS(a,this.namespaces.xlink,"href"))},responseFormat:function(a,b){b.responseFormats.push(this.getChildValue(a))},resultModel:function(a,b){b.resultModels.push(this.getChildValue(a))},responseMode:function(a,b){b.responseModes.push(this.getChildValue(a))}},ows:OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows},
CLASS_NAME:"OpenLayers.Format.SOSCapabilities.v1_0_0"});OpenLayers.Handler.Pinch=OpenLayers.Class(OpenLayers.Handler,{started:!1,stopDown:!1,pinching:!1,last:null,start:null,touchstart:function(a){var b=!0;this.pinching=!1;OpenLayers.Event.isMultiTouch(a)?(this.started=!0,this.last=this.start={distance:this.getDistance(a.touches),delta:0,scale:1},this.callback("start",[a,this.start]),b=!this.stopDown):(this.started=!1,this.last=this.start=null);OpenLayers.Event.stop(a);return b},touchmove:function(a){if(this.started&&OpenLayers.Event.isMultiTouch(a)){this.pinching=
!0;var b=this.getPinchData(a);this.callback("move",[a,b]);this.last=b;OpenLayers.Event.stop(a)}return!0},touchend:function(a){this.started&&(this.pinching=this.started=!1,this.callback("done",[a,this.start,this.last]),this.last=this.start=null);return!0},activate:function(){var a=!1;OpenLayers.Handler.prototype.activate.apply(this,arguments)&&(this.pinching=!1,a=!0);return a},deactivate:function(){var a=!1;OpenLayers.Handler.prototype.deactivate.apply(this,arguments)&&(this.pinching=this.started=
!1,this.last=this.start=null,a=!0);return a},getDistance:function(a){var b=a[0],a=a[1];return Math.sqrt(Math.pow(b.clientX-a.clientX,2)+Math.pow(b.clientY-a.clientY,2))},getPinchData:function(a){a=this.getDistance(a.touches);return{distance:a,delta:this.last.distance-a,scale:a/this.start.distance}},CLASS_NAME:"OpenLayers.Handler.Pinch"});OpenLayers.Control.NavToolbar=OpenLayers.Class(OpenLayers.Control.Panel,{initialize:function(a){OpenLayers.Control.Panel.prototype.initialize.apply(this,[a]);this.addControls([new OpenLayers.Control.Navigation,new OpenLayers.Control.ZoomBox])},draw:function(){var a=OpenLayers.Control.Panel.prototype.draw.apply(this,arguments);null===this.defaultControl&&(this.defaultControl=this.controls[0]);return a},CLASS_NAME:"OpenLayers.Control.NavToolbar"});OpenLayers.Strategy.Refresh=OpenLayers.Class(OpenLayers.Strategy,{force:!1,interval:0,timer:null,activate:function(){var a=OpenLayers.Strategy.prototype.activate.call(this);a&&(!0===this.layer.visibility&&this.start(),this.layer.events.on({visibilitychanged:this.reset,scope:this}));return a},deactivate:function(){var a=OpenLayers.Strategy.prototype.deactivate.call(this);a&&this.stop();return a},reset:function(){!0===this.layer.visibility?this.start():this.stop()},start:function(){this.interval&&("number"===
typeof this.interval&&0<this.interval)&&(this.timer=window.setInterval(OpenLayers.Function.bind(this.refresh,this),this.interval))},refresh:function(){this.layer&&(this.layer.refresh&&"function"==typeof this.layer.refresh)&&this.layer.refresh({force:this.force})},stop:function(){null!==this.timer&&(window.clearInterval(this.timer),this.timer=null)},CLASS_NAME:"OpenLayers.Strategy.Refresh"});OpenLayers.Layer.ArcGIS93Rest=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{format:"png"},isBaseLayer:!0,initialize:function(a,b,c,d){var e=[],c=OpenLayers.Util.upperCaseObject(c);e.push(a,b,c,d);OpenLayers.Layer.Grid.prototype.initialize.apply(this,e);OpenLayers.Util.applyDefaults(this.params,OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS));if(this.params.TRANSPARENT&&"true"==this.params.TRANSPARENT.toString().toLowerCase()){if(null==d||!d.isBaseLayer)this.isBaseLayer=!1;"jpg"==this.params.FORMAT&&
(this.params.FORMAT=OpenLayers.Util.alphaHack()?"gif":"png")}},clone:function(a){null==a&&(a=new OpenLayers.Layer.ArcGIS93Rest(this.name,this.url,this.params,this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},getURL:function(a){var a=this.adjustBounds(a),b=this.projection.getCode().split(":"),b=b[b.length-1],c=this.getImageSize(),a={BBOX:a.toBBOX(),SIZE:c.w+","+c.h,F:"image",BBOXSR:b,IMAGESR:b};if(this.layerDefs){var b=[],d;for(d in this.layerDefs)this.layerDefs.hasOwnProperty(d)&&
this.layerDefs[d]&&(b.push(d),b.push(":"),b.push(this.layerDefs[d]),b.push(";"));0<b.length&&(a.LAYERDEFS=b.join(""))}return this.getFullRequestString(a)},setLayerFilter:function(a,b){this.layerDefs||(this.layerDefs={});b?this.layerDefs[a]=b:delete this.layerDefs[a]},clearLayerFilter:function(a){a?delete this.layerDefs[a]:delete this.layerDefs},mergeNewParams:function(a){a=[OpenLayers.Util.upperCaseObject(a)];return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,a)},CLASS_NAME:"OpenLayers.Layer.ArcGIS93Rest"});OpenLayers.Format.WKT=OpenLayers.Class(OpenLayers.Format,{initialize:function(a){this.regExes={typeStr:/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,spaces:/\s+/,parenComma:/\)\s*,\s*\(/,doubleParenComma:/\)\s*\)\s*,\s*\(\s*\(/,trimParens:/^\s*\(?(.*?)\)?\s*$/};OpenLayers.Format.prototype.initialize.apply(this,[a])},read:function(a){var b,c,a=a.replace(/[\n\r]/g," ");if(c=this.regExes.typeStr.exec(a))if(a=c[1].toLowerCase(),c=c[2],this.parse[a]&&(b=this.parse[a].apply(this,[c])),this.internalProjection&&this.externalProjection)if(b&&
"OpenLayers.Feature.Vector"==b.CLASS_NAME)b.geometry.transform(this.externalProjection,this.internalProjection);else if(b&&"geometrycollection"!=a&&"object"==typeof b){a=0;for(c=b.length;a<c;a++)b[a].geometry.transform(this.externalProjection,this.internalProjection)}return b},write:function(a){var b,c;a.constructor==Array?c=!0:(a=[a],c=!1);var d=[];c&&d.push("GEOMETRYCOLLECTION(");for(var e=0,f=a.length;e<f;++e)c&&0<e&&d.push(","),b=a[e].geometry,d.push(this.extractGeometry(b));c&&d.push(")");return d.join("")},
extractGeometry:function(a){var b=a.CLASS_NAME.split(".")[2].toLowerCase();if(!this.extract[b])return null;this.internalProjection&&this.externalProjection&&(a=a.clone(),a.transform(this.internalProjection,this.externalProjection));return("collection"==b?"GEOMETRYCOLLECTION":b.toUpperCase())+"("+this.extract[b].apply(this,[a])+")"},extract:{point:function(a){return a.x+" "+a.y},multipoint:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push("("+this.extract.point.apply(this,[a.components[c]])+
")");return b.join(",")},linestring:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push(this.extract.point.apply(this,[a.components[c]]));return b.join(",")},multilinestring:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push("("+this.extract.linestring.apply(this,[a.components[c]])+")");return b.join(",")},polygon:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push("("+this.extract.linestring.apply(this,[a.components[c]])+")");return b.join(",")},multipolygon:function(a){for(var b=
[],c=0,d=a.components.length;c<d;++c)b.push("("+this.extract.polygon.apply(this,[a.components[c]])+")");return b.join(",")},collection:function(a){for(var b=[],c=0,d=a.components.length;c<d;++c)b.push(this.extractGeometry.apply(this,[a.components[c]]));return b.join(",")}},parse:{point:function(a){a=OpenLayers.String.trim(a).split(this.regExes.spaces);return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(a[0],a[1]))},multipoint:function(a){for(var b=OpenLayers.String.trim(a).split(","),
c=[],d=0,e=b.length;d<e;++d)a=b[d].replace(this.regExes.trimParens,"$1"),c.push(this.parse.point.apply(this,[a]).geometry);return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPoint(c))},linestring:function(a){for(var a=OpenLayers.String.trim(a).split(","),b=[],c=0,d=a.length;c<d;++c)b.push(this.parse.point.apply(this,[a[c]]).geometry);return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(b))},multilinestring:function(a){for(var b=OpenLayers.String.trim(a).split(this.regExes.parenComma),
c=[],d=0,e=b.length;d<e;++d)a=b[d].replace(this.regExes.trimParens,"$1"),c.push(this.parse.linestring.apply(this,[a]).geometry);return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(c))},polygon:function(a){for(var b,a=OpenLayers.String.trim(a).split(this.regExes.parenComma),c=[],d=0,e=a.length;d<e;++d)b=a[d].replace(this.regExes.trimParens,"$1"),b=this.parse.linestring.apply(this,[b]).geometry,b=new OpenLayers.Geometry.LinearRing(b.components),c.push(b);return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon(c))},
multipolygon:function(a){for(var b=OpenLayers.String.trim(a).split(this.regExes.doubleParenComma),c=[],d=0,e=b.length;d<e;++d)a=b[d].replace(this.regExes.trimParens,"$1"),c.push(this.parse.polygon.apply(this,[a]).geometry);return new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(c))},geometrycollection:function(a){for(var a=a.replace(/,\s*([A-Za-z])/g,"|$1"),a=OpenLayers.String.trim(a).split("|"),b=[],c=0,d=a.length;c<d;++c)b.push(OpenLayers.Format.WKT.prototype.read.apply(this,[a[c]]));
return b}},CLASS_NAME:"OpenLayers.Format.WKT"});OpenLayers.Handler.Hover=OpenLayers.Class(OpenLayers.Handler,{delay:500,pixelTolerance:null,stopMove:!1,px:null,timerId:null,mousemove:function(a){this.passesTolerance(a.xy)&&(this.clearTimer(),this.callback("move",[a]),this.px=a.xy,a=OpenLayers.Util.extend({},a),this.timerId=window.setTimeout(OpenLayers.Function.bind(this.delayedCall,this,a),this.delay));return!this.stopMove},mouseout:function(a){OpenLayers.Util.mouseLeft(a,this.map.viewPortDiv)&&(this.clearTimer(),this.callback("move",[a]));return!0},
passesTolerance:function(a){var b=!0;this.pixelTolerance&&this.px&&Math.sqrt(Math.pow(this.px.x-a.x,2)+Math.pow(this.px.y-a.y,2))<this.pixelTolerance&&(b=!1);return b},clearTimer:function(){null!=this.timerId&&(window.clearTimeout(this.timerId),this.timerId=null)},delayedCall:function(a){this.callback("pause",[a])},deactivate:function(){var a=!1;OpenLayers.Handler.prototype.deactivate.apply(this,arguments)&&(this.clearTimer(),a=!0);return a},CLASS_NAME:"OpenLayers.Handler.Hover"});OpenLayers.Control.GetFeature=OpenLayers.Class(OpenLayers.Control,{protocol:null,multipleKey:null,toggleKey:null,modifiers:null,multiple:!1,click:!0,single:!0,clickout:!0,toggle:!1,clickTolerance:5,hover:!1,box:!1,maxFeatures:10,features:null,hoverFeature:null,handlerOptions:null,handlers:null,hoverResponse:null,filterType:OpenLayers.Filter.Spatial.BBOX,initialize:function(a){a.handlerOptions=a.handlerOptions||{};OpenLayers.Control.prototype.initialize.apply(this,[a]);this.features={};this.handlers=
{};this.click&&(this.handlers.click=new OpenLayers.Handler.Click(this,{click:this.selectClick},this.handlerOptions.click||{}));this.box&&(this.handlers.box=new OpenLayers.Handler.Box(this,{done:this.selectBox},OpenLayers.Util.extend(this.handlerOptions.box,{boxDivClassName:"olHandlerBoxSelectFeature"})));this.hover&&(this.handlers.hover=new OpenLayers.Handler.Hover(this,{move:this.cancelHover,pause:this.selectHover},OpenLayers.Util.extend(this.handlerOptions.hover,{delay:250,pixelTolerance:2})))},
activate:function(){if(!this.active)for(var a in this.handlers)this.handlers[a].activate();return OpenLayers.Control.prototype.activate.apply(this,arguments)},deactivate:function(){if(this.active)for(var a in this.handlers)this.handlers[a].deactivate();return OpenLayers.Control.prototype.deactivate.apply(this,arguments)},selectClick:function(a){var b=this.pixelToBounds(a.xy);this.setModifiers(a);this.request(b,{single:this.single})},selectBox:function(a){var b;if(a instanceof OpenLayers.Bounds)b=
this.map.getLonLatFromPixel({x:a.left,y:a.bottom}),a=this.map.getLonLatFromPixel({x:a.right,y:a.top}),b=new OpenLayers.Bounds(b.lon,b.lat,a.lon,a.lat);else{if(this.click)return;b=this.pixelToBounds(a)}this.setModifiers(this.handlers.box.dragHandler.evt);this.request(b)},selectHover:function(a){this.request(this.pixelToBounds(a.xy),{single:!0,hover:!0})},cancelHover:function(){this.hoverResponse&&(this.protocol.abort(this.hoverResponse),this.hoverResponse=null,OpenLayers.Element.removeClass(this.map.viewPortDiv,
"olCursorWait"))},request:function(a,b){var b=b||{},c=new OpenLayers.Filter.Spatial({type:this.filterType,value:a});OpenLayers.Element.addClass(this.map.viewPortDiv,"olCursorWait");c=this.protocol.read({maxFeatures:!0==b.single?this.maxFeatures:void 0,filter:c,callback:function(c){c.success()&&(c.features.length?!0==b.single?this.selectBestFeature(c.features,a.getCenterLonLat(),b):this.select(c.features):b.hover?this.hoverSelect():(this.events.triggerEvent("clickout"),this.clickout&&this.unselectAll()));
OpenLayers.Element.removeClass(this.map.viewPortDiv,"olCursorWait")},scope:this});!0==b.hover&&(this.hoverResponse=c)},selectBestFeature:function(a,b,c){c=c||{};if(a.length){for(var b=new OpenLayers.Geometry.Point(b.lon,b.lat),d,e,f,g=Number.MAX_VALUE,h=0;h<a.length&&!(d=a[h],d.geometry&&(f=b.distanceTo(d.geometry,{edge:!1}),f<g&&(g=f,e=d,0==g)));++h);!0==c.hover?this.hoverSelect(e):this.select(e||a)}},setModifiers:function(a){this.modifiers={multiple:this.multiple||this.multipleKey&&a[this.multipleKey],
toggle:this.toggle||this.toggleKey&&a[this.toggleKey]}},select:function(a){!this.modifiers.multiple&&!this.modifiers.toggle&&this.unselectAll();OpenLayers.Util.isArray(a)||(a=[a]);var b=this.events.triggerEvent("beforefeaturesselected",{features:a});if(!1!==b){for(var c=[],d,e=0,f=a.length;e<f;++e)d=a[e],this.features[d.fid||d.id]?this.modifiers.toggle&&this.unselect(this.features[d.fid||d.id]):(b=this.events.triggerEvent("beforefeatureselected",{feature:d}),!1!==b&&(this.features[d.fid||d.id]=d,
c.push(d),this.events.triggerEvent("featureselected",{feature:d})));this.events.triggerEvent("featuresselected",{features:c})}},hoverSelect:function(a){var b=a?a.fid||a.id:null,c=this.hoverFeature?this.hoverFeature.fid||this.hoverFeature.id:null;c&&c!=b&&(this.events.triggerEvent("outfeature",{feature:this.hoverFeature}),this.hoverFeature=null);b&&b!=c&&(this.events.triggerEvent("hoverfeature",{feature:a}),this.hoverFeature=a)},unselect:function(a){delete this.features[a.fid||a.id];this.events.triggerEvent("featureunselected",
{feature:a})},unselectAll:function(){for(var a in this.features)this.unselect(this.features[a])},setMap:function(a){for(var b in this.handlers)this.handlers[b].setMap(a);OpenLayers.Control.prototype.setMap.apply(this,arguments)},pixelToBounds:function(a){var b=a.add(-this.clickTolerance/2,this.clickTolerance/2),a=a.add(this.clickTolerance/2,-this.clickTolerance/2),b=this.map.getLonLatFromPixel(b),a=this.map.getLonLatFromPixel(a);return new OpenLayers.Bounds(b.lon,b.lat,a.lon,a.lat)},CLASS_NAME:"OpenLayers.Control.GetFeature"});OpenLayers.Format.QueryStringFilter=function(){function a(a){a=a.replace(/%/g,"\\%");a=a.replace(/\\\\\.(\*)?/g,function(a,b){return b?a:"\\\\_"});a=a.replace(/\\\\\.\*/g,"\\\\%");a=a.replace(/(\\)?\.(\*)?/g,function(a,b,c){return b||c?a:"_"});a=a.replace(/(\\)?\.\*/g,function(a,b){return b?a:"%"});a=a.replace(/\\\./g,".");return a=a.replace(/(\\)?\\\*/g,function(a,b){return b?a:"*"})}var b={};b[OpenLayers.Filter.Comparison.EQUAL_TO]="eq";b[OpenLayers.Filter.Comparison.NOT_EQUAL_TO]="ne";b[OpenLayers.Filter.Comparison.LESS_THAN]=
"lt";b[OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO]="lte";b[OpenLayers.Filter.Comparison.GREATER_THAN]="gt";b[OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO]="gte";b[OpenLayers.Filter.Comparison.LIKE]="ilike";return OpenLayers.Class(OpenLayers.Format,{wildcarded:!1,srsInBBOX:!1,write:function(c,d){var d=d||{},e=c.CLASS_NAME,e=e.substring(e.lastIndexOf(".")+1);switch(e){case "Spatial":switch(c.type){case OpenLayers.Filter.Spatial.BBOX:d.bbox=c.value.toArray();this.srsInBBOX&&c.projection&&
d.bbox.push(c.projection.getCode());break;case OpenLayers.Filter.Spatial.DWITHIN:d.tolerance=c.distance;case OpenLayers.Filter.Spatial.WITHIN:d.lon=c.value.x;d.lat=c.value.y;break;default:OpenLayers.Console.warn("Unknown spatial filter type "+c.type)}break;case "Comparison":e=b[c.type];if(void 0!==e){var f=c.value;c.type==OpenLayers.Filter.Comparison.LIKE&&(f=a(f),this.wildcarded&&(f="%"+f+"%"));d[c.property+"__"+e]=f;d.queryable=d.queryable||[];d.queryable.push(c.property)}else OpenLayers.Console.warn("Unknown comparison filter type "+
c.type);break;case "Logical":if(c.type===OpenLayers.Filter.Logical.AND){e=0;for(f=c.filters.length;e<f;e++)d=this.write(c.filters[e],d)}else OpenLayers.Console.warn("Unsupported logical filter type "+c.type);break;default:OpenLayers.Console.warn("Unknown filter type "+e)}return d},CLASS_NAME:"OpenLayers.Format.QueryStringFilter"})}();OpenLayers.Control.MousePosition=OpenLayers.Class(OpenLayers.Control,{autoActivate:!0,element:null,prefix:"",separator:", ",suffix:"",numDigits:5,granularity:10,emptyString:null,lastXy:null,displayProjection:null,destroy:function(){this.deactivate();OpenLayers.Control.prototype.destroy.apply(this,arguments)},activate:function(){return OpenLayers.Control.prototype.activate.apply(this,arguments)?(this.map.events.register("mousemove",this,this.redraw),this.map.events.register("mouseout",this,this.reset),
this.redraw(),!0):!1},deactivate:function(){return OpenLayers.Control.prototype.deactivate.apply(this,arguments)?(this.map.events.unregister("mousemove",this,this.redraw),this.map.events.unregister("mouseout",this,this.reset),this.element.innerHTML="",!0):!1},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);this.element||(this.div.left="",this.div.top="",this.element=this.div);return this.div},redraw:function(a){var b;if(null==a)this.reset();else if(null==this.lastXy||Math.abs(a.xy.x-
this.lastXy.x)>this.granularity||Math.abs(a.xy.y-this.lastXy.y)>this.granularity)this.lastXy=a.xy;else if(b=this.map.getLonLatFromPixel(a.xy))this.displayProjection&&b.transform(this.map.getProjectionObject(),this.displayProjection),this.lastXy=a.xy,a=this.formatOutput(b),a!=this.element.innerHTML&&(this.element.innerHTML=a)},reset:function(){null!=this.emptyString&&(this.element.innerHTML=this.emptyString)},formatOutput:function(a){var b=parseInt(this.numDigits);return this.prefix+a.lon.toFixed(b)+
this.separator+a.lat.toFixed(b)+this.suffix},CLASS_NAME:"OpenLayers.Control.MousePosition"});OpenLayers.Control.Geolocate=OpenLayers.Class(OpenLayers.Control,{geolocation:navigator.geolocation,bind:!0,watch:!1,geolocationOptions:null,destroy:function(){this.deactivate();OpenLayers.Control.prototype.destroy.apply(this,arguments)},activate:function(){return!this.geolocation?(this.events.triggerEvent("locationuncapable"),!1):OpenLayers.Control.prototype.activate.apply(this,arguments)?(this.watch?this.watchId=this.geolocation.watchPosition(OpenLayers.Function.bind(this.geolocate,this),OpenLayers.Function.bind(this.failure,
this),this.geolocationOptions):this.getCurrentLocation(),!0):!1},deactivate:function(){this.active&&null!==this.watchId&&this.geolocation.clearWatch(this.watchId);return OpenLayers.Control.prototype.deactivate.apply(this,arguments)},geolocate:function(a){var b=(new OpenLayers.LonLat(a.coords.longitude,a.coords.latitude)).transform(new OpenLayers.Projection("EPSG:4326"),this.map.getProjectionObject());this.bind&&this.map.setCenter(b);this.events.triggerEvent("locationupdated",{position:a,point:new OpenLayers.Geometry.Point(b.lon,
b.lat)})},getCurrentLocation:function(){if(!this.active||this.watch)return!1;this.geolocation.getCurrentPosition(OpenLayers.Function.bind(this.geolocate,this),OpenLayers.Function.bind(this.failure,this),this.geolocationOptions);return!0},failure:function(a){this.events.triggerEvent("locationfailed",{error:a})},CLASS_NAME:"OpenLayers.Control.Geolocate"});OpenLayers.Tile.UTFGrid=OpenLayers.Class(OpenLayers.Tile,{url:null,utfgridResolution:2,json:null,format:null,destroy:function(){this.clear();OpenLayers.Tile.prototype.destroy.apply(this,arguments)},draw:function(){var a=OpenLayers.Tile.prototype.draw.apply(this,arguments);if(a)if(this.isLoading?(this.abortLoading(),this.events.triggerEvent("reload")):(this.isLoading=!0,this.events.triggerEvent("loadstart")),this.url=this.layer.getURL(this.bounds),this.layer.useJSONP){var b=new OpenLayers.Protocol.Script({url:this.url,
callback:function(a){this.isLoading=false;this.events.triggerEvent("loadend");this.json=a.data},scope:this});b.read();this.request=b}else this.request=OpenLayers.Request.GET({url:this.url,callback:function(a){this.isLoading=false;this.events.triggerEvent("loadend");a.status===200&&this.parseData(a.responseText)},scope:this});else this.unload();return a},abortLoading:function(){this.request&&(this.request.abort(),delete this.request);this.isLoading=!1},getFeatureInfo:function(a,b){var c=null;if(this.json){var d=
this.getFeatureId(a,b);null!==d&&(c={id:d,data:this.json.data[d]})}return c},getFeatureId:function(a,b){var c=null;if(this.json){var d=this.utfgridResolution,d=this.indexFromCharCode(this.json.grid[Math.floor(b/d)].charCodeAt(Math.floor(a/d))),e=this.json.keys;!isNaN(d)&&d in e&&(c=e[d])}return c},indexFromCharCode:function(a){93<=a&&a--;35<=a&&a--;return a-32},parseData:function(a){this.format||(this.format=new OpenLayers.Format.JSON);this.json=this.format.read(a)},clear:function(){this.json=null},
CLASS_NAME:"OpenLayers.Tile.UTFGrid"});OpenLayers.Control.NavigationHistory=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOGGLE,previous:null,previousOptions:null,next:null,nextOptions:null,limit:50,autoActivate:!0,clearOnDeactivate:!1,registry:null,nextStack:null,previousStack:null,listeners:null,restoring:!1,initialize:function(a){OpenLayers.Control.prototype.initialize.apply(this,[a]);this.registry=OpenLayers.Util.extend({moveend:this.getState},this.registry);a={trigger:OpenLayers.Function.bind(this.previousTrigger,
this),displayClass:this.displayClass+" "+this.displayClass+"Previous"};OpenLayers.Util.extend(a,this.previousOptions);this.previous=new OpenLayers.Control.Button(a);a={trigger:OpenLayers.Function.bind(this.nextTrigger,this),displayClass:this.displayClass+" "+this.displayClass+"Next"};OpenLayers.Util.extend(a,this.nextOptions);this.next=new OpenLayers.Control.Button(a);this.clear()},onPreviousChange:function(a){a&&!this.previous.active?this.previous.activate():!a&&this.previous.active&&this.previous.deactivate()},
onNextChange:function(a){a&&!this.next.active?this.next.activate():!a&&this.next.active&&this.next.deactivate()},destroy:function(){OpenLayers.Control.prototype.destroy.apply(this);this.previous.destroy();this.next.destroy();this.deactivate();for(var a in this)this[a]=null},setMap:function(a){this.map=a;this.next.setMap(a);this.previous.setMap(a)},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);this.next.draw();this.previous.draw()},previousTrigger:function(){var a=this.previousStack.shift(),
b=this.previousStack.shift();void 0!=b?(this.nextStack.unshift(a),this.previousStack.unshift(b),this.restoring=!0,this.restore(b),this.restoring=!1,this.onNextChange(this.nextStack[0],this.nextStack.length),this.onPreviousChange(this.previousStack[1],this.previousStack.length-1)):this.previousStack.unshift(a);return b},nextTrigger:function(){var a=this.nextStack.shift();void 0!=a&&(this.previousStack.unshift(a),this.restoring=!0,this.restore(a),this.restoring=!1,this.onNextChange(this.nextStack[0],
this.nextStack.length),this.onPreviousChange(this.previousStack[1],this.previousStack.length-1));return a},clear:function(){this.previousStack=[];this.previous.deactivate();this.nextStack=[];this.next.deactivate()},getState:function(){return{center:this.map.getCenter(),resolution:this.map.getResolution(),projection:this.map.getProjectionObject(),units:this.map.getProjectionObject().getUnits()||this.map.units||this.map.baseLayer.units}},restore:function(a){var b,c;if(this.map.getProjectionObject()==
a.projection)c=this.map.getZoomForResolution(a.resolution),b=a.center;else{b=a.center.clone();b.transform(a.projection,this.map.getProjectionObject());c=a.units;var d=this.map.getProjectionObject().getUnits()||this.map.units||this.map.baseLayer.units;c=this.map.getZoomForResolution((c&&d?OpenLayers.INCHES_PER_UNIT[c]/OpenLayers.INCHES_PER_UNIT[d]:1)*a.resolution)}this.map.setCenter(b,c)},setListeners:function(){this.listeners={};for(var a in this.registry)this.listeners[a]=OpenLayers.Function.bind(function(){if(!this.restoring){this.previousStack.unshift(this.registry[a].apply(this,
arguments));if(1<this.previousStack.length)this.onPreviousChange(this.previousStack[1],this.previousStack.length-1);this.previousStack.length>this.limit+1&&this.previousStack.pop();0<this.nextStack.length&&(this.nextStack=[],this.onNextChange(null,0))}return!0},this)},activate:function(){var a=!1;if(this.map&&OpenLayers.Control.prototype.activate.apply(this)){null==this.listeners&&this.setListeners();for(var b in this.listeners)this.map.events.register(b,this,this.listeners[b]);a=!0;0==this.previousStack.length&&
this.initStack()}return a},initStack:function(){this.map.getCenter()&&this.listeners.moveend()},deactivate:function(){var a=!1;if(this.map&&OpenLayers.Control.prototype.deactivate.apply(this)){for(var b in this.listeners)this.map.events.unregister(b,this,this.listeners[b]);this.clearOnDeactivate&&this.clear();a=!0}return a},CLASS_NAME:"OpenLayers.Control.NavigationHistory"});OpenLayers.Protocol.HTTP=OpenLayers.Class(OpenLayers.Protocol,{url:null,headers:null,params:null,callback:null,scope:null,readWithPOST:!1,updateWithPOST:!1,deleteWithPOST:!1,wildcarded:!1,srsInBBOX:!1,initialize:function(a){a=a||{};this.params={};this.headers={};OpenLayers.Protocol.prototype.initialize.apply(this,arguments);if(!this.filterToParams&&OpenLayers.Format.QueryStringFilter){var b=new OpenLayers.Format.QueryStringFilter({wildcarded:this.wildcarded,srsInBBOX:this.srsInBBOX});this.filterToParams=
function(a,d){return b.write(a,d)}}},destroy:function(){this.headers=this.params=null;OpenLayers.Protocol.prototype.destroy.apply(this)},read:function(a){OpenLayers.Protocol.prototype.read.apply(this,arguments);a=a||{};a.params=OpenLayers.Util.applyDefaults(a.params,this.options.params);a=OpenLayers.Util.applyDefaults(a,this.options);a.filter&&this.filterToParams&&(a.params=this.filterToParams(a.filter,a.params));var b=void 0!==a.readWithPOST?a.readWithPOST:this.readWithPOST,c=new OpenLayers.Protocol.Response({requestType:"read"});
b?(b=a.headers||{},b["Content-Type"]="application/x-www-form-urlencoded",c.priv=OpenLayers.Request.POST({url:a.url,callback:this.createCallback(this.handleRead,c,a),data:OpenLayers.Util.getParameterString(a.params),headers:b})):c.priv=OpenLayers.Request.GET({url:a.url,callback:this.createCallback(this.handleRead,c,a),params:a.params,headers:a.headers});return c},handleRead:function(a,b){this.handleResponse(a,b)},create:function(a,b){var b=OpenLayers.Util.applyDefaults(b,this.options),c=new OpenLayers.Protocol.Response({reqFeatures:a,
requestType:"create"});c.priv=OpenLayers.Request.POST({url:b.url,callback:this.createCallback(this.handleCreate,c,b),headers:b.headers,data:this.format.write(a)});return c},handleCreate:function(a,b){this.handleResponse(a,b)},update:function(a,b){var b=b||{},c=b.url||a.url||this.options.url+"/"+a.fid,b=OpenLayers.Util.applyDefaults(b,this.options),d=new OpenLayers.Protocol.Response({reqFeatures:a,requestType:"update"});d.priv=OpenLayers.Request[this.updateWithPOST?"POST":"PUT"]({url:c,callback:this.createCallback(this.handleUpdate,
d,b),headers:b.headers,data:this.format.write(a)});return d},handleUpdate:function(a,b){this.handleResponse(a,b)},"delete":function(a,b){var b=b||{},c=b.url||a.url||this.options.url+"/"+a.fid,b=OpenLayers.Util.applyDefaults(b,this.options),d=new OpenLayers.Protocol.Response({reqFeatures:a,requestType:"delete"}),e=this.deleteWithPOST?"POST":"DELETE",c={url:c,callback:this.createCallback(this.handleDelete,d,b),headers:b.headers};this.deleteWithPOST&&(c.data=this.format.write(a));d.priv=OpenLayers.Request[e](c);
return d},handleDelete:function(a,b){this.handleResponse(a,b)},handleResponse:function(a,b){var c=a.priv;b.callback&&(200<=c.status&&300>c.status?("delete"!=a.requestType&&(a.features=this.parseFeatures(c)),a.code=OpenLayers.Protocol.Response.SUCCESS):a.code=OpenLayers.Protocol.Response.FAILURE,b.callback.call(b.scope,a))},parseFeatures:function(a){var b=a.responseXML;if(!b||!b.documentElement)b=a.responseText;return!b||0>=b.length?null:this.format.read(b)},commit:function(a,b){function c(a){for(var b=
a.features?a.features.length:0,c=Array(b),e=0;e<b;++e)c[e]=a.features[e].fid;o.insertIds=c;d.apply(this,[a])}function d(a){this.callUserCallback(a,b);n=n&&a.success();f++;f>=m&&b.callback&&(o.code=n?OpenLayers.Protocol.Response.SUCCESS:OpenLayers.Protocol.Response.FAILURE,b.callback.apply(b.scope,[o]))}var b=OpenLayers.Util.applyDefaults(b,this.options),e=[],f=0,g={};g[OpenLayers.State.INSERT]=[];g[OpenLayers.State.UPDATE]=[];g[OpenLayers.State.DELETE]=[];for(var h,i,j=[],k=0,l=a.length;k<l;++k)if(h=
a[k],i=g[h.state])i.push(h),j.push(h);var m=(0<g[OpenLayers.State.INSERT].length?1:0)+g[OpenLayers.State.UPDATE].length+g[OpenLayers.State.DELETE].length,n=!0,o=new OpenLayers.Protocol.Response({reqFeatures:j});h=g[OpenLayers.State.INSERT];0<h.length&&e.push(this.create(h,OpenLayers.Util.applyDefaults({callback:c,scope:this},b.create)));h=g[OpenLayers.State.UPDATE];for(k=h.length-1;0<=k;--k)e.push(this.update(h[k],OpenLayers.Util.applyDefaults({callback:d,scope:this},b.update)));h=g[OpenLayers.State.DELETE];
for(k=h.length-1;0<=k;--k)e.push(this["delete"](h[k],OpenLayers.Util.applyDefaults({callback:d,scope:this},b["delete"])));return e},abort:function(a){a&&a.priv.abort()},callUserCallback:function(a,b){var c=b[a.requestType];c&&c.callback&&c.callback.call(c.scope,a)},CLASS_NAME:"OpenLayers.Protocol.HTTP"});OpenLayers.Strategy.Cluster=OpenLayers.Class(OpenLayers.Strategy,{distance:20,threshold:null,features:null,clusters:null,clustering:!1,resolution:null,activate:function(){var a=OpenLayers.Strategy.prototype.activate.call(this);if(a)this.layer.events.on({beforefeaturesadded:this.cacheFeatures,moveend:this.cluster,scope:this});return a},deactivate:function(){var a=OpenLayers.Strategy.prototype.deactivate.call(this);a&&(this.clearCache(),this.layer.events.un({beforefeaturesadded:this.cacheFeatures,moveend:this.cluster,
scope:this}));return a},cacheFeatures:function(a){var b=!0;this.clustering||(this.clearCache(),this.features=a.features,this.cluster(),b=!1);return b},clearCache:function(){this.features=null},cluster:function(a){if((!a||a.zoomChanged)&&this.features)if(a=this.layer.map.getResolution(),a!=this.resolution||!this.clustersExist()){this.resolution=a;for(var a=[],b,c,d,e=0;e<this.features.length;++e)if(b=this.features[e],b.geometry){c=!1;for(var f=a.length-1;0<=f;--f)if(d=a[f],this.shouldCluster(d,b)){this.addToCluster(d,
b);c=!0;break}c||a.push(this.createCluster(this.features[e]))}this.layer.removeAllFeatures();if(0<a.length){if(1<this.threshold){b=a.slice();a=[];e=0;for(d=b.length;e<d;++e)c=b[e],c.attributes.count<this.threshold?Array.prototype.push.apply(a,c.cluster):a.push(c)}this.clustering=!0;this.layer.addFeatures(a);this.clustering=!1}this.clusters=a}},clustersExist:function(){var a=!1;if(this.clusters&&0<this.clusters.length&&this.clusters.length==this.layer.features.length)for(var a=!0,b=0;b<this.clusters.length;++b)if(this.clusters[b]!=
this.layer.features[b]){a=!1;break}return a},shouldCluster:function(a,b){var c=a.geometry.getBounds().getCenterLonLat(),d=b.geometry.getBounds().getCenterLonLat();return Math.sqrt(Math.pow(c.lon-d.lon,2)+Math.pow(c.lat-d.lat,2))/this.resolution<=this.distance},addToCluster:function(a,b){a.cluster.push(b);a.attributes.count+=1},createCluster:function(a){var b=a.geometry.getBounds().getCenterLonLat(),b=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(b.lon,b.lat),{count:1});b.cluster=[a];
return b},CLASS_NAME:"OpenLayers.Strategy.Cluster"});OpenLayers.Strategy.Filter=OpenLayers.Class(OpenLayers.Strategy,{filter:null,cache:null,caching:!1,activate:function(){var a=OpenLayers.Strategy.prototype.activate.apply(this,arguments);a&&(this.cache=[],this.layer.events.on({beforefeaturesadded:this.handleAdd,beforefeaturesremoved:this.handleRemove,scope:this}));return a},deactivate:function(){this.cache=null;this.layer&&this.layer.events&&this.layer.events.un({beforefeaturesadded:this.handleAdd,beforefeaturesremoved:this.handleRemove,scope:this});
return OpenLayers.Strategy.prototype.deactivate.apply(this,arguments)},handleAdd:function(a){if(!this.caching&&this.filter){var b=a.features;a.features=[];for(var c,d=0,e=b.length;d<e;++d)c=b[d],this.filter.evaluate(c)?a.features.push(c):this.cache.push(c)}},handleRemove:function(){this.caching||(this.cache=[])},setFilter:function(a){this.filter=a;a=this.cache;this.cache=[];this.handleAdd({features:this.layer.features});0<this.cache.length&&(this.caching=!0,this.layer.removeFeatures(this.cache.slice()),
this.caching=!1);0<a.length&&(a={features:a},this.handleAdd(a),0<a.features.length&&(this.caching=!0,this.layer.addFeatures(a.features),this.caching=!1))},CLASS_NAME:"OpenLayers.Strategy.Filter"});OpenLayers.Protocol.SOS=function(a){var a=OpenLayers.Util.applyDefaults(a,OpenLayers.Protocol.SOS.DEFAULTS),b=OpenLayers.Protocol.SOS["v"+a.version.replace(/\./g,"_")];if(!b)throw"Unsupported SOS version: "+a.version;return new b(a)};OpenLayers.Protocol.SOS.DEFAULTS={version:"1.0.0"};OpenLayers.Format.WFSDescribeFeatureType=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{xsd:"http://www.w3.org/2001/XMLSchema"},readers:{xsd:{schema:function(a,b){var c=[],d={};this.readChildNodes(a,{complexTypes:c,customTypes:d});for(var e=a.attributes,f,g,h=0,i=e.length;h<i;++h)f=e[h],g=f.name,0==g.indexOf("xmlns")?this.setNamespace(g.split(":")[1]||"",f.value):b[g]=f.value;b.featureTypes=c;b.targetPrefix=this.namespaceAlias[b.targetNamespace];h=0;for(i=c.length;h<i;++h)e=c[h],f=d[e.typeName],
d[e.typeName]&&(e.typeName=f.name)},complexType:function(a,b){var c={typeName:a.getAttribute("name")};this.readChildNodes(a,c);b.complexTypes.push(c)},complexContent:function(a,b){this.readChildNodes(a,b)},extension:function(a,b){this.readChildNodes(a,b)},sequence:function(a,b){var c={elements:[]};this.readChildNodes(a,c);b.properties=c.elements},element:function(a,b){if(b.elements){for(var c={},d=a.attributes,e,f=0,g=d.length;f<g;++f)e=d[f],c[e.name]=e.value;d=c.type;d||(d={},this.readChildNodes(a,
d),c.restriction=d,c.type=d.base);c.localType=(d.base||d).split(":").pop();b.elements.push(c)}b.complexTypes&&(d=a.getAttribute("type"),c=d.split(":").pop(),b.customTypes[c]={name:a.getAttribute("name"),type:d})},simpleType:function(a,b){this.readChildNodes(a,b)},restriction:function(a,b){b.base=a.getAttribute("base");this.readRestriction(a,b)}}},readRestriction:function(a,b){for(var c=a.childNodes,d,e,f=0,g=c.length;f<g;++f)d=c[f],1==d.nodeType&&(e=d.nodeName.split(":").pop(),d=d.getAttribute("value"),
b[e]?("string"==typeof b[e]&&(b[e]=[b[e]]),b[e].push(d)):b[e]=d)},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,b);return b},CLASS_NAME:"OpenLayers.Format.WFSDescribeFeatureType"});OpenLayers.Format.GeoRSS=OpenLayers.Class(OpenLayers.Format.XML,{rssns:"http://backend.userland.com/rss2",featureNS:"http://mapserver.gis.umn.edu/mapserver",georssns:"http://www.georss.org/georss",geons:"http://www.w3.org/2003/01/geo/wgs84_pos#",featureTitle:"Untitled",featureDescription:"No Description",gmlParser:null,xy:!1,createGeometryFromItem:function(a){var b=this.getElementsByTagNameNS(a,this.georssns,"point"),c=this.getElementsByTagNameNS(a,this.geons,"lat"),d=this.getElementsByTagNameNS(a,
this.geons,"long"),e=this.getElementsByTagNameNS(a,this.georssns,"line"),f=this.getElementsByTagNameNS(a,this.georssns,"polygon"),g=this.getElementsByTagNameNS(a,this.georssns,"where"),a=this.getElementsByTagNameNS(a,this.georssns,"box");if(0<b.length||0<c.length&&0<d.length){0<b.length?(c=OpenLayers.String.trim(b[0].firstChild.nodeValue).split(/\s+/),2!=c.length&&(c=OpenLayers.String.trim(b[0].firstChild.nodeValue).split(/\s*,\s*/))):c=[parseFloat(c[0].firstChild.nodeValue),parseFloat(d[0].firstChild.nodeValue)];
var h=new OpenLayers.Geometry.Point(c[1],c[0])}else if(0<e.length){c=OpenLayers.String.trim(this.getChildValue(e[0])).split(/\s+/);d=[];e=0;for(f=c.length;e<f;e+=2)b=new OpenLayers.Geometry.Point(c[e+1],c[e]),d.push(b);h=new OpenLayers.Geometry.LineString(d)}else if(0<f.length){c=OpenLayers.String.trim(this.getChildValue(f[0])).split(/\s+/);d=[];e=0;for(f=c.length;e<f;e+=2)b=new OpenLayers.Geometry.Point(c[e+1],c[e]),d.push(b);h=new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(d)])}else 0<
g.length?(this.gmlParser||(this.gmlParser=new OpenLayers.Format.GML({xy:this.xy})),h=this.gmlParser.parseFeature(g[0]).geometry):0<a.length&&(c=OpenLayers.String.trim(a[0].firstChild.nodeValue).split(/\s+/),d=[],3<c.length&&(b=new OpenLayers.Geometry.Point(c[1],c[0]),d.push(b),b=new OpenLayers.Geometry.Point(c[1],c[2]),d.push(b),b=new OpenLayers.Geometry.Point(c[3],c[2]),d.push(b),b=new OpenLayers.Geometry.Point(c[3],c[0]),d.push(b),b=new OpenLayers.Geometry.Point(c[1],c[0]),d.push(b)),h=new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(d)]));
h&&(this.internalProjection&&this.externalProjection)&&h.transform(this.externalProjection,this.internalProjection);return h},createFeatureFromItem:function(a){var b=this.createGeometryFromItem(a),c=this._getChildValue(a,"*","title",this.featureTitle),d=this._getChildValue(a,"*","description",this._getChildValue(a,"*","content",this._getChildValue(a,"*","summary",this.featureDescription))),e=this._getChildValue(a,"*","link");if(!e)try{e=this.getElementsByTagNameNS(a,"*","link")[0].getAttribute("href")}catch(f){e=
null}a=this._getChildValue(a,"*","id",null);b=new OpenLayers.Feature.Vector(b,{title:c,description:d,link:e});b.fid=a;return b},_getChildValue:function(a,b,c,d){return(a=this.getElementsByTagNameNS(a,b,c))&&a[0]&&a[0].firstChild&&a[0].firstChild.nodeValue?this.getChildValue(a[0]):void 0==d?"":d},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var b=null,b=this.getElementsByTagNameNS(a,"*","item");0==b.length&&(b=this.getElementsByTagNameNS(a,"*","entry"));
for(var a=b.length,c=Array(a),d=0;d<a;d++)c[d]=this.createFeatureFromItem(b[d]);return c},write:function(a){var b;if(OpenLayers.Util.isArray(a)){b=this.createElementNS(this.rssns,"rss");for(var c=0,d=a.length;c<d;c++)b.appendChild(this.createFeatureXML(a[c]))}else b=this.createFeatureXML(a);return OpenLayers.Format.XML.prototype.write.apply(this,[b])},createFeatureXML:function(a){var b=this.buildGeometryNode(a.geometry),c=this.createElementNS(this.rssns,"item"),d=this.createElementNS(this.rssns,"title");
d.appendChild(this.createTextNode(a.attributes.title?a.attributes.title:""));var e=this.createElementNS(this.rssns,"description");e.appendChild(this.createTextNode(a.attributes.description?a.attributes.description:""));c.appendChild(d);c.appendChild(e);a.attributes.link&&(d=this.createElementNS(this.rssns,"link"),d.appendChild(this.createTextNode(a.attributes.link)),c.appendChild(d));for(var f in a.attributes)"link"==f||("title"==f||"description"==f)||(d=this.createTextNode(a.attributes[f]),e=f,-1!=
f.search(":")&&(e=f.split(":")[1]),e=this.createElementNS(this.featureNS,"feature:"+e),e.appendChild(d),c.appendChild(e));c.appendChild(b);return c},buildGeometryNode:function(a){this.internalProjection&&this.externalProjection&&(a=a.clone(),a.transform(this.internalProjection,this.externalProjection));var b;if("OpenLayers.Geometry.Polygon"==a.CLASS_NAME)b=this.createElementNS(this.georssns,"georss:polygon"),b.appendChild(this.buildCoordinatesNode(a.components[0]));else if("OpenLayers.Geometry.LineString"==
a.CLASS_NAME)b=this.createElementNS(this.georssns,"georss:line"),b.appendChild(this.buildCoordinatesNode(a));else if("OpenLayers.Geometry.Point"==a.CLASS_NAME)b=this.createElementNS(this.georssns,"georss:point"),b.appendChild(this.buildCoordinatesNode(a));else throw"Couldn't parse "+a.CLASS_NAME;return b},buildCoordinatesNode:function(a){var b=null;a.components&&(b=a.components);if(b){for(var a=b.length,c=Array(a),d=0;d<a;d++)c[d]=b[d].y+" "+b[d].x;b=c.join(" ")}else b=a.y+" "+a.x;return this.createTextNode(b)},
CLASS_NAME:"OpenLayers.Format.GeoRSS"});OpenLayers.Format.WPSCapabilities=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.0.0",CLASS_NAME:"OpenLayers.Format.WPSCapabilities"});OpenLayers.Format.WPSCapabilities.v1_0_0=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ows:"http://www.opengis.net/ows/1.1",wps:"http://www.opengis.net/wps/1.0.0",xlink:"http://www.w3.org/1999/xlink"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a])},read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);
var b={};this.readNode(a,b);return b},readers:{wps:{Capabilities:function(a,b){this.readChildNodes(a,b)},ProcessOfferings:function(a,b){b.processOfferings={};this.readChildNodes(a,b.processOfferings)},Process:function(a,b){var c={processVersion:this.getAttributeNS(a,this.namespaces.wps,"processVersion")};this.readChildNodes(a,c);b[c.identifier]=c},Languages:function(a,b){b.languages=[];this.readChildNodes(a,b.languages)},Default:function(a,b){var c={isDefault:!0};this.readChildNodes(a,c);b.push(c)},
Supported:function(a,b){var c={};this.readChildNodes(a,c);b.push(c)}},ows:OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows},CLASS_NAME:"OpenLayers.Format.WPSCapabilities.v1_0_0"});OpenLayers.Control.PinchZoom=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,containerCenter:null,pinchOrigin:null,currentCenter:null,autoActivate:!0,initialize:function(a){OpenLayers.Control.prototype.initialize.apply(this,arguments);this.handler=new OpenLayers.Handler.Pinch(this,{start:this.pinchStart,move:this.pinchMove,done:this.pinchDone},this.handlerOptions)},activate:function(){var a=OpenLayers.Control.prototype.activate.apply(this,arguments);a&&(this.map.events.on({moveend:this.updateContainerCenter,
scope:this}),this.updateContainerCenter());return a},deactivate:function(){var a=OpenLayers.Control.prototype.deactivate.apply(this,arguments);this.map&&this.map.events&&this.map.events.un({moveend:this.updateContainerCenter,scope:this});return a},updateContainerCenter:function(){var a=this.map.layerContainerDiv;this.containerCenter={x:parseInt(a.style.left,10)+50,y:parseInt(a.style.top,10)+50}},pinchStart:function(a){this.currentCenter=this.pinchOrigin=a.xy},pinchMove:function(a,b){var c=b.scale,
d=this.containerCenter,e=this.pinchOrigin,f=a.xy,g=Math.round(f.x-e.x+(c-1)*(d.x-e.x)),d=Math.round(f.y-e.y+(c-1)*(d.y-e.y));this.applyTransform("translate("+g+"px, "+d+"px) scale("+c+")");this.currentCenter=f},applyTransform:function(a){var b=this.map.layerContainerDiv.style;b["-webkit-transform"]=a;b["-moz-transform"]=a},pinchDone:function(a,b,c){this.applyTransform("");a=this.map.getZoomForResolution(this.map.getResolution()/c.scale,!0);if(a!==this.map.getZoom()||!this.currentCenter.equals(this.pinchOrigin)){var b=
this.map.getResolutionForZoom(a),c=this.map.getLonLatFromPixel(this.pinchOrigin),d=this.currentCenter,e=this.map.getSize();c.lon+=b*(e.w/2-d.x);c.lat-=b*(e.h/2-d.y);this.map.div.clientWidth=this.map.div.clientWidth;this.map.setCenter(c,a)}},CLASS_NAME:"OpenLayers.Control.PinchZoom"});OpenLayers.Control.TouchNavigation=OpenLayers.Class(OpenLayers.Control,{dragPan:null,dragPanOptions:null,pinchZoom:null,pinchZoomOptions:null,clickHandlerOptions:null,documentDrag:!1,autoActivate:!0,initialize:function(a){this.handlers={};OpenLayers.Control.prototype.initialize.apply(this,arguments)},destroy:function(){this.deactivate();this.dragPan&&this.dragPan.destroy();this.dragPan=null;this.pinchZoom&&(this.pinchZoom.destroy(),delete this.pinchZoom);OpenLayers.Control.prototype.destroy.apply(this,
arguments)},activate:function(){return OpenLayers.Control.prototype.activate.apply(this,arguments)?(this.dragPan.activate(),this.handlers.click.activate(),this.pinchZoom.activate(),!0):!1},deactivate:function(){return OpenLayers.Control.prototype.deactivate.apply(this,arguments)?(this.dragPan.deactivate(),this.handlers.click.deactivate(),this.pinchZoom.deactivate(),!0):!1},draw:function(){var a={click:this.defaultClick,dblclick:this.defaultDblClick},b=OpenLayers.Util.extend({"double":!0,stopDouble:!0,
pixelTolerance:2},this.clickHandlerOptions);this.handlers.click=new OpenLayers.Handler.Click(this,a,b);this.dragPan=new OpenLayers.Control.DragPan(OpenLayers.Util.extend({map:this.map,documentDrag:this.documentDrag},this.dragPanOptions));this.dragPan.draw();this.pinchZoom=new OpenLayers.Control.PinchZoom(OpenLayers.Util.extend({map:this.map},this.pinchZoomOptions))},defaultClick:function(a){a.lastTouches&&2==a.lastTouches.length&&this.map.zoomOut()},defaultDblClick:function(a){this.map.setCenter(this.map.getLonLatFromViewPortPx(a.xy),
this.map.zoom+1)},CLASS_NAME:"OpenLayers.Control.TouchNavigation"});OpenLayers.Style2=OpenLayers.Class({id:null,name:null,title:null,description:null,layerName:null,isDefault:!1,rules:null,initialize:function(a){OpenLayers.Util.extend(this,a);this.id=OpenLayers.Util.createUniqueID(this.CLASS_NAME+"_")},destroy:function(){for(var a=0,b=this.rules.length;a<b;a++)this.rules[a].destroy();delete this.rules},clone:function(){var a=OpenLayers.Util.extend({},this);if(this.rules){a.rules=[];for(var b=0,c=this.rules.length;b<c;++b)a.rules.push(this.rules[b].clone())}return new OpenLayers.Style2(a)},
CLASS_NAME:"OpenLayers.Style2"});OpenLayers.Format.WFS=OpenLayers.Class(OpenLayers.Format.GML,{layer:null,wfsns:"http://www.opengis.net/wfs",ogcns:"http://www.opengis.net/ogc",initialize:function(a,b){OpenLayers.Format.GML.prototype.initialize.apply(this,[a]);this.layer=b;this.layer.featureNS&&(this.featureNS=this.layer.featureNS);this.layer.options.geometry_column&&(this.geometryName=this.layer.options.geometry_column);this.layer.options.typename&&(this.featureName=this.layer.options.typename)},write:function(a){var b=this.createElementNS(this.wfsns,
"wfs:Transaction");b.setAttribute("version","1.0.0");b.setAttribute("service","WFS");for(var c=0;c<a.length;c++)switch(a[c].state){case OpenLayers.State.INSERT:b.appendChild(this.insert(a[c]));break;case OpenLayers.State.UPDATE:b.appendChild(this.update(a[c]));break;case OpenLayers.State.DELETE:b.appendChild(this.remove(a[c]))}return OpenLayers.Format.XML.prototype.write.apply(this,[b])},createFeatureXML:function(a){var b=this.buildGeometryNode(a.geometry),c=this.createElementNS(this.featureNS,"feature:"+
this.geometryName);c.appendChild(b);b=this.createElementNS(this.featureNS,"feature:"+this.featureName);b.appendChild(c);for(var d in a.attributes){var c=this.createTextNode(a.attributes[d]),e=d;-1!=d.search(":")&&(e=d.split(":")[1]);e=this.createElementNS(this.featureNS,"feature:"+e);e.appendChild(c);b.appendChild(e)}return b},insert:function(a){var b=this.createElementNS(this.wfsns,"wfs:Insert");b.appendChild(this.createFeatureXML(a));return b},update:function(a){a.fid||OpenLayers.Console.userError(OpenLayers.i18n("noFID"));
var b=this.createElementNS(this.wfsns,"wfs:Update");b.setAttribute("typeName",this.featurePrefix+":"+this.featureName);b.setAttribute("xmlns:"+this.featurePrefix,this.featureNS);var c=this.createElementNS(this.wfsns,"wfs:Property"),d=this.createElementNS(this.wfsns,"wfs:Name"),e=this.createTextNode(this.geometryName);d.appendChild(e);c.appendChild(d);d=this.createElementNS(this.wfsns,"wfs:Value");e=this.buildGeometryNode(a.geometry);a.layer&&e.setAttribute("srsName",a.layer.projection.getCode());
d.appendChild(e);c.appendChild(d);b.appendChild(c);for(var f in a.attributes)c=this.createElementNS(this.wfsns,"wfs:Property"),d=this.createElementNS(this.wfsns,"wfs:Name"),d.appendChild(this.createTextNode(f)),c.appendChild(d),d=this.createElementNS(this.wfsns,"wfs:Value"),d.appendChild(this.createTextNode(a.attributes[f])),c.appendChild(d),b.appendChild(c);c=this.createElementNS(this.ogcns,"ogc:Filter");f=this.createElementNS(this.ogcns,"ogc:FeatureId");f.setAttribute("fid",a.fid);c.appendChild(f);
b.appendChild(c);return b},remove:function(a){if(!a.fid)return OpenLayers.Console.userError(OpenLayers.i18n("noFID")),!1;var b=this.createElementNS(this.wfsns,"wfs:Delete");b.setAttribute("typeName",this.featurePrefix+":"+this.featureName);b.setAttribute("xmlns:"+this.featurePrefix,this.featureNS);var c=this.createElementNS(this.ogcns,"ogc:Filter"),d=this.createElementNS(this.ogcns,"ogc:FeatureId");d.setAttribute("fid",a.fid);c.appendChild(d);b.appendChild(c);return b},destroy:function(){this.layer=
null},CLASS_NAME:"OpenLayers.Format.WFS"});OpenLayers.Format.SLD.v1_0_0_GeoServer=OpenLayers.Class(OpenLayers.Format.SLD.v1_0_0,{version:"1.0.0",profile:"GeoServer",readers:OpenLayers.Util.applyDefaults({sld:OpenLayers.Util.applyDefaults({Priority:function(a,b){var c=this.readers.ogc._expression.call(this,a);c&&(b.priority=c)},VendorOption:function(a,b){b.vendorOptions||(b.vendorOptions={});b.vendorOptions[a.getAttribute("name")]=this.getChildValue(a)}},OpenLayers.Format.SLD.v1_0_0.prototype.readers.sld)},OpenLayers.Format.SLD.v1_0_0.prototype.readers),
writers:OpenLayers.Util.applyDefaults({sld:OpenLayers.Util.applyDefaults({Priority:function(a){return this.writers.sld._OGCExpression.call(this,"sld:Priority",a)},VendorOption:function(a){return this.createElementNSPlus("sld:VendorOption",{attributes:{name:a.name},value:a.value})},TextSymbolizer:function(a){var b=OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.TextSymbolizer.apply(this,arguments);!1!==a.graphic&&(a.externalGraphic||a.graphicName)&&this.writeNode("Graphic",a,b);"priority"in a&&
this.writeNode("Priority",a.priority,b);return this.addVendorOptions(b,a)},PointSymbolizer:function(a){return this.addVendorOptions(OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.PointSymbolizer.apply(this,arguments),a)},LineSymbolizer:function(a){return this.addVendorOptions(OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.LineSymbolizer.apply(this,arguments),a)},PolygonSymbolizer:function(a){return this.addVendorOptions(OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld.PolygonSymbolizer.apply(this,
arguments),a)}},OpenLayers.Format.SLD.v1_0_0.prototype.writers.sld)},OpenLayers.Format.SLD.v1_0_0.prototype.writers),addVendorOptions:function(a,b){if(b.vendorOptions)for(var c in b.vendorOptions)this.writeNode("VendorOption",{name:c,value:b.vendorOptions[c]},a);return a},CLASS_NAME:"OpenLayers.Format.SLD.v1_0_0_GeoServer"});OpenLayers.Layer.Boxes=OpenLayers.Class(OpenLayers.Layer.Markers,{drawMarker:function(a){var b=this.map.getLayerPxFromLonLat({lon:a.bounds.left,lat:a.bounds.top}),c=this.map.getLayerPxFromLonLat({lon:a.bounds.right,lat:a.bounds.bottom});null==c||null==b?a.display(!1):(b=a.draw(b,{w:Math.max(1,c.x-b.x),h:Math.max(1,c.y-b.y)}),a.drawn||(this.div.appendChild(b),a.drawn=!0))},removeMarker:function(a){OpenLayers.Util.removeItem(this.markers,a);null!=a.div&&a.div.parentNode==this.div&&this.div.removeChild(a.div)},
CLASS_NAME:"OpenLayers.Layer.Boxes"});OpenLayers.Format.WFSCapabilities.v1_0_0=OpenLayers.Class(OpenLayers.Format.WFSCapabilities.v1,{readers:{wfs:OpenLayers.Util.applyDefaults({Service:function(a,b){b.service={};this.readChildNodes(a,b.service)},Fees:function(a,b){var c=this.getChildValue(a);c&&"none"!=c.toLowerCase()&&(b.fees=c)},AccessConstraints:function(a,b){var c=this.getChildValue(a);c&&"none"!=c.toLowerCase()&&(b.accessConstraints=c)},OnlineResource:function(a,b){var c=this.getChildValue(a);c&&"none"!=c.toLowerCase()&&(b.onlineResource=
c)},Keywords:function(a,b){var c=this.getChildValue(a);c&&"none"!=c.toLowerCase()&&(b.keywords=c.split(", "))},Capability:function(a,b){b.capability={};this.readChildNodes(a,b.capability)},Request:function(a,b){b.request={};this.readChildNodes(a,b.request)},GetFeature:function(a,b){b.getfeature={href:{},formats:[]};this.readChildNodes(a,b.getfeature)},ResultFormat:function(a,b){for(var c=a.childNodes,d,e=0;e<c.length;e++)d=c[e],1==d.nodeType&&b.formats.push(d.nodeName)},DCPType:function(a,b){this.readChildNodes(a,
b)},HTTP:function(a,b){this.readChildNodes(a,b.href)},Get:function(a,b){b.get=a.getAttribute("onlineResource")},Post:function(a,b){b.post=a.getAttribute("onlineResource")},SRS:function(a,b){var c=this.getChildValue(a);c&&(b.srs=c)}},OpenLayers.Format.WFSCapabilities.v1.prototype.readers.wfs)},CLASS_NAME:"OpenLayers.Format.WFSCapabilities.v1_0_0"});OpenLayers.Format.WMSCapabilities=OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC,{defaultVersion:"1.1.1",profile:null,CLASS_NAME:"OpenLayers.Format.WMSCapabilities"});OpenLayers.Format.WMSCapabilities.v1=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{wms:"http://www.opengis.net/wms",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},defaultPrefix:"wms",read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var b=a;a&&9==a.nodeType&&(a=a.documentElement);var c={};this.readNode(a,c);void 0===c.service&&(a=new OpenLayers.Format.OGCExceptionReport,c.error=a.read(b));return c},readers:{wms:{Service:function(a,
b){b.service={};this.readChildNodes(a,b.service)},Name:function(a,b){b.name=this.getChildValue(a)},Title:function(a,b){b.title=this.getChildValue(a)},Abstract:function(a,b){b["abstract"]=this.getChildValue(a)},BoundingBox:function(a){var b={};b.bbox=[parseFloat(a.getAttribute("minx")),parseFloat(a.getAttribute("miny")),parseFloat(a.getAttribute("maxx")),parseFloat(a.getAttribute("maxy"))];a={x:parseFloat(a.getAttribute("resx")),y:parseFloat(a.getAttribute("resy"))};if(!isNaN(a.x)||!isNaN(a.y))b.res=
a;return b},OnlineResource:function(a,b){b.href=this.getAttributeNS(a,this.namespaces.xlink,"href")},ContactInformation:function(a,b){b.contactInformation={};this.readChildNodes(a,b.contactInformation)},ContactPersonPrimary:function(a,b){b.personPrimary={};this.readChildNodes(a,b.personPrimary)},ContactPerson:function(a,b){b.person=this.getChildValue(a)},ContactOrganization:function(a,b){b.organization=this.getChildValue(a)},ContactPosition:function(a,b){b.position=this.getChildValue(a)},ContactAddress:function(a,
b){b.contactAddress={};this.readChildNodes(a,b.contactAddress)},AddressType:function(a,b){b.type=this.getChildValue(a)},Address:function(a,b){b.address=this.getChildValue(a)},City:function(a,b){b.city=this.getChildValue(a)},StateOrProvince:function(a,b){b.stateOrProvince=this.getChildValue(a)},PostCode:function(a,b){b.postcode=this.getChildValue(a)},Country:function(a,b){b.country=this.getChildValue(a)},ContactVoiceTelephone:function(a,b){b.phone=this.getChildValue(a)},ContactFacsimileTelephone:function(a,
b){b.fax=this.getChildValue(a)},ContactElectronicMailAddress:function(a,b){b.email=this.getChildValue(a)},Fees:function(a,b){var c=this.getChildValue(a);c&&"none"!=c.toLowerCase()&&(b.fees=c)},AccessConstraints:function(a,b){var c=this.getChildValue(a);c&&"none"!=c.toLowerCase()&&(b.accessConstraints=c)},Capability:function(a,b){b.capability={nestedLayers:[],layers:[]};this.readChildNodes(a,b.capability)},Request:function(a,b){b.request={};this.readChildNodes(a,b.request)},GetCapabilities:function(a,
b){b.getcapabilities={formats:[]};this.readChildNodes(a,b.getcapabilities)},Format:function(a,b){OpenLayers.Util.isArray(b.formats)?b.formats.push(this.getChildValue(a)):b.format=this.getChildValue(a)},DCPType:function(a,b){this.readChildNodes(a,b)},HTTP:function(a,b){this.readChildNodes(a,b)},Get:function(a,b){b.get={};this.readChildNodes(a,b.get);b.href||(b.href=b.get.href)},Post:function(a,b){b.post={};this.readChildNodes(a,b.post);b.href||(b.href=b.get.href)},GetMap:function(a,b){b.getmap={formats:[]};
this.readChildNodes(a,b.getmap)},GetFeatureInfo:function(a,b){b.getfeatureinfo={formats:[]};this.readChildNodes(a,b.getfeatureinfo)},Exception:function(a,b){b.exception={formats:[]};this.readChildNodes(a,b.exception)},Layer:function(a,b){var c,d;b.capability?(d=b.capability,c=b):d=b;var e=a.getAttributeNode("queryable"),f=e&&e.specified?a.getAttribute("queryable"):null,g=(e=a.getAttributeNode("cascaded"))&&e.specified?a.getAttribute("cascaded"):null,e=(e=a.getAttributeNode("opaque"))&&e.specified?
a.getAttribute("opaque"):null,h=a.getAttribute("noSubsets"),i=a.getAttribute("fixedWidth"),j=a.getAttribute("fixedHeight"),k=c||{},l=OpenLayers.Util.extend;c={nestedLayers:[],styles:c?[].concat(c.styles):[],srs:c?l({},k.srs):{},metadataURLs:[],bbox:c?l({},k.bbox):{},llbbox:k.llbbox,dimensions:c?l({},k.dimensions):{},authorityURLs:c?l({},k.authorityURLs):{},identifiers:{},keywords:[],queryable:f&&""!==f?"1"===f||"true"===f:k.queryable||!1,cascaded:null!==g?parseInt(g):k.cascaded||0,opaque:e?"1"===
e||"true"===e:k.opaque||!1,noSubsets:null!==h?"1"===h||"true"===h:k.noSubsets||!1,fixedWidth:null!=i?parseInt(i):k.fixedWidth||0,fixedHeight:null!=j?parseInt(j):k.fixedHeight||0,minScale:k.minScale,maxScale:k.maxScale,attribution:k.attribution};b.nestedLayers.push(c);c.capability=d;this.readChildNodes(a,c);delete c.capability;if(c.name&&(f=c.name.split(":"),g=d.request,e=g.getfeatureinfo,0<f.length&&(c.prefix=f[0]),d.layers.push(c),void 0===c.formats&&(c.formats=g.getmap.formats),void 0===c.infoFormats&&
e))c.infoFormats=e.formats},Attribution:function(a,b){b.attribution={};this.readChildNodes(a,b.attribution)},LogoURL:function(a,b){b.logo={width:a.getAttribute("width"),height:a.getAttribute("height")};this.readChildNodes(a,b.logo)},Style:function(a,b){var c={};b.styles.push(c);this.readChildNodes(a,c)},LegendURL:function(a,b){var c={width:a.getAttribute("width"),height:a.getAttribute("height")};b.legend=c;this.readChildNodes(a,c)},MetadataURL:function(a,b){var c={type:a.getAttribute("type")};b.metadataURLs.push(c);
this.readChildNodes(a,c)},DataURL:function(a,b){b.dataURL={};this.readChildNodes(a,b.dataURL)},FeatureListURL:function(a,b){b.featureListURL={};this.readChildNodes(a,b.featureListURL)},AuthorityURL:function(a,b){var c=a.getAttribute("name"),d={};this.readChildNodes(a,d);b.authorityURLs[c]=d.href},Identifier:function(a,b){var c=a.getAttribute("authority");b.identifiers[c]=this.getChildValue(a)},KeywordList:function(a,b){this.readChildNodes(a,b)},SRS:function(a,b){b.srs[this.getChildValue(a)]=!0}}},
CLASS_NAME:"OpenLayers.Format.WMSCapabilities.v1"});OpenLayers.Format.WMSCapabilities.v1_3=OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1,{readers:{wms:OpenLayers.Util.applyDefaults({WMS_Capabilities:function(a,b){this.readChildNodes(a,b)},LayerLimit:function(a,b){b.layerLimit=parseInt(this.getChildValue(a))},MaxWidth:function(a,b){b.maxWidth=parseInt(this.getChildValue(a))},MaxHeight:function(a,b){b.maxHeight=parseInt(this.getChildValue(a))},BoundingBox:function(a,b){var c=OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms.BoundingBox.apply(this,
[a,b]);c.srs=a.getAttribute("CRS");b.bbox[c.srs]=c},CRS:function(a,b){this.readers.wms.SRS.apply(this,[a,b])},EX_GeographicBoundingBox:function(a,b){b.llbbox=[];this.readChildNodes(a,b.llbbox)},westBoundLongitude:function(a,b){b[0]=this.getChildValue(a)},eastBoundLongitude:function(a,b){b[2]=this.getChildValue(a)},southBoundLatitude:function(a,b){b[1]=this.getChildValue(a)},northBoundLatitude:function(a,b){b[3]=this.getChildValue(a)},MinScaleDenominator:function(a,b){b.maxScale=parseFloat(this.getChildValue(a)).toPrecision(16)},
MaxScaleDenominator:function(a,b){b.minScale=parseFloat(this.getChildValue(a)).toPrecision(16)},Dimension:function(a,b){var c={name:a.getAttribute("name").toLowerCase(),units:a.getAttribute("units"),unitsymbol:a.getAttribute("unitSymbol"),nearestVal:"1"===a.getAttribute("nearestValue"),multipleVal:"1"===a.getAttribute("multipleValues"),"default":a.getAttribute("default")||"",current:"1"===a.getAttribute("current"),values:this.getChildValue(a).split(",")};b.dimensions[c.name]=c},Keyword:function(a,
b){var c={value:this.getChildValue(a),vocabulary:a.getAttribute("vocabulary")};b.keywords&&b.keywords.push(c)}},OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms),sld:{UserDefinedSymbolization:function(a,b){this.readers.wms.UserDefinedSymbolization.apply(this,[a,b]);b.userSymbols.inlineFeature=1==parseInt(a.getAttribute("InlineFeature"));b.userSymbols.remoteWCS=1==parseInt(a.getAttribute("RemoteWCS"))},DescribeLayer:function(a,b){this.readers.wms.DescribeLayer.apply(this,[a,b])},GetLegendGraphic:function(a,
b){this.readers.wms.GetLegendGraphic.apply(this,[a,b])}}},CLASS_NAME:"OpenLayers.Format.WMSCapabilities.v1_3"});OpenLayers.Layer.Zoomify=OpenLayers.Class(OpenLayers.Layer.Grid,{size:null,isBaseLayer:!0,standardTileSize:256,tileOriginCorner:"tl",numberOfTiers:0,tileCountUpToTier:null,tierSizeInTiles:null,tierImageSize:null,initialize:function(a,b,c,d){this.initializeZoomify(c);OpenLayers.Layer.Grid.prototype.initialize.apply(this,[a,b,c,{},d])},initializeZoomify:function(a){var a=a.clone(),b=new OpenLayers.Size(Math.ceil(a.w/this.standardTileSize),Math.ceil(a.h/this.standardTileSize));this.tierSizeInTiles=[b];
for(this.tierImageSize=[a];a.w>this.standardTileSize||a.h>this.standardTileSize;)a=new OpenLayers.Size(Math.floor(a.w/2),Math.floor(a.h/2)),b=new OpenLayers.Size(Math.ceil(a.w/this.standardTileSize),Math.ceil(a.h/this.standardTileSize)),this.tierSizeInTiles.push(b),this.tierImageSize.push(a);this.tierSizeInTiles.reverse();this.tierImageSize.reverse();this.numberOfTiers=this.tierSizeInTiles.length;this.tileCountUpToTier=[0];for(a=1;a<this.numberOfTiers;a++)this.tileCountUpToTier.push(this.tierSizeInTiles[a-
1].w*this.tierSizeInTiles[a-1].h+this.tileCountUpToTier[a-1])},destroy:function(){OpenLayers.Layer.Grid.prototype.destroy.apply(this,arguments);this.tileCountUpToTier.length=0;this.tierSizeInTiles.length=0;this.tierImageSize.length=0},clone:function(a){null==a&&(a=new OpenLayers.Layer.Zoomify(this.name,this.url,this.size,this.options));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},getURL:function(a){var a=this.adjustBounds(a),b=this.map.getResolution(),c=Math.round((a.left-this.tileOrigin.lon)/
(b*this.tileSize.w)),a=Math.round((this.tileOrigin.lat-a.top)/(b*this.tileSize.h)),b=this.map.getZoom(),c="TileGroup"+Math.floor((c+a*this.tierSizeInTiles[b].w+this.tileCountUpToTier[b])/256)+"/"+b+"-"+c+"-"+a+".jpg",a=this.url;OpenLayers.Util.isArray(a)&&(a=this.selectUrl(c,a));return a+c},getImageSize:function(){if(0<arguments.length){var a=this.adjustBounds(arguments[0]),b=this.map.getResolution(),c=Math.round((a.left-this.tileOrigin.lon)/(b*this.tileSize.w)),a=Math.round((this.tileOrigin.lat-
a.top)/(b*this.tileSize.h)),b=this.map.getZoom(),d=this.standardTileSize,e=this.standardTileSize;c==this.tierSizeInTiles[b].w-1&&(d=this.tierImageSize[b].w%this.standardTileSize);a==this.tierSizeInTiles[b].h-1&&(e=this.tierImageSize[b].h%this.standardTileSize);return new OpenLayers.Size(d,e)}return this.tileSize},setMap:function(a){OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);this.tileOrigin=new OpenLayers.LonLat(this.map.maxExtent.left,this.map.maxExtent.top)},calculateGridLayout:function(a,
b,c){var d=c*this.tileSize.w,c=c*this.tileSize.h,e=a.left-b.lon,f=Math.floor(e/d)-this.buffer,a=b.lat-a.top+c,g=Math.floor(a/c)-this.buffer;return{tilelon:d,tilelat:c,tileoffsetlon:b.lon+f*d,tileoffsetlat:b.lat-c*g,tileoffsetx:-(e/d-f)*this.tileSize.w,tileoffsety:(g-a/c)*this.tileSize.h}},CLASS_NAME:"OpenLayers.Layer.Zoomify"});OpenLayers.Layer.MapServer=OpenLayers.Class(OpenLayers.Layer.Grid,{DEFAULT_PARAMS:{mode:"map",map_imagetype:"png"},initialize:function(a,b,c,d){OpenLayers.Layer.Grid.prototype.initialize.apply(this,arguments);this.params=OpenLayers.Util.applyDefaults(this.params,this.DEFAULT_PARAMS);if(null==d||null==d.isBaseLayer)this.isBaseLayer="true"!=this.params.transparent&&!0!=this.params.transparent},clone:function(a){null==a&&(a=new OpenLayers.Layer.MapServer(this.name,this.url,this.params,this.getOptions()));
return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},getURL:function(a){var a=this.adjustBounds(a),a=[a.left,a.bottom,a.right,a.top],b=this.getImageSize();return this.getFullRequestString({mapext:a,imgext:a,map_size:[b.w,b.h],imgx:b.w/2,imgy:b.h/2,imgxy:[b.w,b.h]})},getFullRequestString:function(a,b){var c=null==b?this.url:b,d=OpenLayers.Util.extend({},this.params),d=OpenLayers.Util.extend(d,a),e=OpenLayers.Util.getParameterString(d);OpenLayers.Util.isArray(c)&&(c=this.selectUrl(e,c));
var e=OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(c)),f;for(f in d)f.toUpperCase()in e&&delete d[f];e=OpenLayers.Util.getParameterString(d);d=c;e=e.replace(/,/g,"+");""!=e&&(f=c.charAt(c.length-1),d="&"==f||"?"==f?d+e:-1==c.indexOf("?")?d+("?"+e):d+("&"+e));return d},CLASS_NAME:"OpenLayers.Layer.MapServer"});OpenLayers.Renderer.VML=OpenLayers.Class(OpenLayers.Renderer.Elements,{xmlns:"urn:schemas-microsoft-com:vml",symbolCache:{},offset:null,initialize:function(a){if(this.supported()){if(!document.namespaces.olv){document.namespaces.add("olv",this.xmlns);for(var b=document.createStyleSheet(),c="shape rect oval fill stroke imagedata group textbox".split(" "),d=0,e=c.length;d<e;d++)b.addRule("olv\\:"+c[d],"behavior: url(#default#VML); position: absolute; display: inline-block;")}OpenLayers.Renderer.Elements.prototype.initialize.apply(this,
arguments)}},supported:function(){return!!document.namespaces},setExtent:function(a,b){var c=OpenLayers.Renderer.Elements.prototype.setExtent.apply(this,arguments),d=this.getResolution(),e=a.left/d|0,d=a.top/d-this.size.h|0;b||!this.offset?(this.offset={x:e,y:d},d=e=0):(e-=this.offset.x,d-=this.offset.y);this.root.coordorigin=e-this.xOffset+" "+d;for(var e=[this.root,this.vectorRoot,this.textRoot],f=0,g=e.length;f<g;++f)d=e[f],d.coordsize=this.size.w+" "+this.size.h;this.root.style.flip="y";return c},
setSize:function(a){OpenLayers.Renderer.prototype.setSize.apply(this,arguments);for(var b=[this.rendererRoot,this.root,this.vectorRoot,this.textRoot],c=this.size.w+"px",d=this.size.h+"px",e,f=0,g=b.length;f<g;++f)e=b[f],e.style.width=c,e.style.height=d},getNodeType:function(a,b){var c=null;switch(a.CLASS_NAME){case "OpenLayers.Geometry.Point":c=b.externalGraphic?"olv:rect":this.isComplexSymbol(b.graphicName)?"olv:shape":"olv:oval";break;case "OpenLayers.Geometry.Rectangle":c="olv:rect";break;case "OpenLayers.Geometry.LineString":case "OpenLayers.Geometry.LinearRing":case "OpenLayers.Geometry.Polygon":case "OpenLayers.Geometry.Curve":c=
"olv:shape"}return c},setStyle:function(a,b,c,d){var b=b||a._style,c=c||a._options,e=b.fillColor;if("OpenLayers.Geometry.Point"===a._geometryClass)if(b.externalGraphic){c.isFilled=!0;b.graphicTitle&&(a.title=b.graphicTitle);var e=b.graphicWidth||b.graphicHeight,f=b.graphicHeight||b.graphicWidth,e=e?e:2*b.pointRadius,f=f?f:2*b.pointRadius,g=this.getResolution(),h=void 0!=b.graphicXOffset?b.graphicXOffset:-(0.5*e),i=void 0!=b.graphicYOffset?b.graphicYOffset:-(0.5*f);a.style.left=((d.x-this.featureDx)/
g-this.offset.x+h|0)+"px";a.style.top=(d.y/g-this.offset.y-(i+f)|0)+"px";a.style.width=e+"px";a.style.height=f+"px";a.style.flip="y";e="none";c.isStroked=!1}else this.isComplexSymbol(b.graphicName)?(f=this.importSymbol(b.graphicName),a.path=f.path,a.coordorigin=f.left+","+f.bottom,f=f.size,a.coordsize=f+","+f,this.drawCircle(a,d,b.pointRadius),a.style.flip="y"):this.drawCircle(a,d,b.pointRadius);c.isFilled?a.fillcolor=e:a.filled="false";d=a.getElementsByTagName("fill");d=0==d.length?null:d[0];if(c.isFilled){d||
(d=this.createNode("olv:fill",a.id+"_fill"));d.opacity=b.fillOpacity;if("OpenLayers.Geometry.Point"===a._geometryClass&&b.externalGraphic&&(b.graphicOpacity&&(d.opacity=b.graphicOpacity),d.src=b.externalGraphic,d.type="frame",!b.graphicWidth||!b.graphicHeight))d.aspect="atmost";d.parentNode!=a&&a.appendChild(d)}else d&&a.removeChild(d);e=b.rotation;if(void 0!==e||void 0!==a._rotation)a._rotation=e,b.externalGraphic?(this.graphicRotate(a,h,i,b),d.opacity=0):"OpenLayers.Geometry.Point"===a._geometryClass&&
(a.style.rotation=e||0);h=a.getElementsByTagName("stroke");h=0==h.length?null:h[0];if(c.isStroked){if(h||(h=this.createNode("olv:stroke",a.id+"_stroke"),a.appendChild(h)),h.on=!0,h.color=b.strokeColor,h.weight=b.strokeWidth+"px",h.opacity=b.strokeOpacity,h.endcap="butt"==b.strokeLinecap?"flat":b.strokeLinecap||"round",b.strokeDashstyle)h.dashstyle=this.dashStyle(b)}else a.stroked=!1,h&&(h.on=!1);"inherit"!=b.cursor&&null!=b.cursor&&(a.style.cursor=b.cursor);return a},graphicRotate:function(a,b,c,
d){var d=d||a._style,e=d.rotation||0,f,g;if(!d.graphicWidth||!d.graphicHeight){var h=new Image;h.onreadystatechange=OpenLayers.Function.bind(function(){if("complete"==h.readyState||"interactive"==h.readyState)f=h.width/h.height,g=Math.max(2*d.pointRadius,d.graphicWidth||0,d.graphicHeight||0),b*=f,d.graphicWidth=g*f,d.graphicHeight=g,this.graphicRotate(a,b,c,d)},this);h.src=d.externalGraphic}else{g=Math.max(d.graphicWidth,d.graphicHeight);f=d.graphicWidth/d.graphicHeight;var i=Math.round(d.graphicWidth||
g*f),j=Math.round(d.graphicHeight||g);a.style.width=i+"px";a.style.height=j+"px";var k=document.getElementById(a.id+"_image");k||(k=this.createNode("olv:imagedata",a.id+"_image"),a.appendChild(k));k.style.width=i+"px";k.style.height=j+"px";k.src=d.externalGraphic;k.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='', sizingMethod='scale')";k=e*Math.PI/180;e=Math.sin(k);k=Math.cos(k);e="progid:DXImageTransform.Microsoft.Matrix(M11="+k+",M12="+-e+",M21="+e+",M22="+k+",SizingMethod='auto expand')\n";
(k=d.graphicOpacity||d.fillOpacity)&&1!=k&&(e+="progid:DXImageTransform.Microsoft.BasicImage(opacity="+k+")\n");a.style.filter=e;e=new OpenLayers.Geometry.Point(-b,-c);i=(new OpenLayers.Bounds(0,0,i,j)).toGeometry();i.rotate(d.rotation,e);i=i.getBounds();a.style.left=Math.round(parseInt(a.style.left)+i.left)+"px";a.style.top=Math.round(parseInt(a.style.top)-i.bottom)+"px"}},postDraw:function(a){a.style.visibility="visible";var b=a._style.fillColor,c=a._style.strokeColor;"none"==b&&a.fillcolor!=b&&
(a.fillcolor=b);"none"==c&&a.strokecolor!=c&&(a.strokecolor=c)},setNodeDimension:function(a,b){var c=b.getBounds();if(c){var d=this.getResolution(),c=new OpenLayers.Bounds((c.left-this.featureDx)/d-this.offset.x|0,c.bottom/d-this.offset.y|0,(c.right-this.featureDx)/d-this.offset.x|0,c.top/d-this.offset.y|0);a.style.left=c.left+"px";a.style.top=c.top+"px";a.style.width=c.getWidth()+"px";a.style.height=c.getHeight()+"px";a.coordorigin=c.left+" "+c.top;a.coordsize=c.getWidth()+" "+c.getHeight()}},dashStyle:function(a){a=
a.strokeDashstyle;switch(a){case "solid":case "dot":case "dash":case "dashdot":case "longdash":case "longdashdot":return a;default:return a=a.split(/[ ,]/),2==a.length?1*a[0]>=2*a[1]?"longdash":1==a[0]||1==a[1]?"dot":"dash":4==a.length?1*a[0]>=2*a[1]?"longdashdot":"dashdot":"solid"}},createNode:function(a,b){var c=document.createElement(a);b&&(c.id=b);c.unselectable="on";c.onselectstart=OpenLayers.Function.False;return c},nodeTypeCompare:function(a,b){var c=b,d=c.indexOf(":");-1!=d&&(c=c.substr(d+
1));var e=a.nodeName,d=e.indexOf(":");-1!=d&&(e=e.substr(d+1));return c==e},createRenderRoot:function(){return this.nodeFactory(this.container.id+"_vmlRoot","div")},createRoot:function(a){return this.nodeFactory(this.container.id+a,"olv:group")},drawPoint:function(a,b){return this.drawCircle(a,b,1)},drawCircle:function(a,b,c){if(!isNaN(b.x)&&!isNaN(b.y)){var d=this.getResolution();a.style.left=((b.x-this.featureDx)/d-this.offset.x|0)-c+"px";a.style.top=(b.y/d-this.offset.y|0)-c+"px";b=2*c;a.style.width=
b+"px";a.style.height=b+"px";return a}return!1},drawLineString:function(a,b){return this.drawLine(a,b,!1)},drawLinearRing:function(a,b){return this.drawLine(a,b,!0)},drawLine:function(a,b,c){this.setNodeDimension(a,b);for(var d=this.getResolution(),e=b.components.length,f=Array(e),g,h,i=0;i<e;i++)g=b.components[i],h=(g.x-this.featureDx)/d-this.offset.x|0,g=g.y/d-this.offset.y|0,f[i]=" "+h+","+g+" l ";a.path="m"+f.join("")+(c?" x e":" e");return a},drawPolygon:function(a,b){this.setNodeDimension(a,
b);var c=this.getResolution(),d=[],e,f,g,h,i,j,k,l,m,n;e=0;for(f=b.components.length;e<f;e++){d.push("m");g=b.components[e].components;h=0===e;j=i=null;k=0;for(l=g.length;k<l;k++)m=g[k],n=(m.x-this.featureDx)/c-this.offset.x|0,m=m.y/c-this.offset.y|0,n=" "+n+","+m,d.push(n),0==k&&d.push(" l"),h||(i?i!=n&&(j?j!=n&&(h=!0):j=n):i=n);d.push(h?" x ":" ")}d.push("e");a.path=d.join("");return a},drawRectangle:function(a,b){var c=this.getResolution();a.style.left=((b.x-this.featureDx)/c-this.offset.x|0)+
"px";a.style.top=(b.y/c-this.offset.y|0)+"px";a.style.width=(b.width/c|0)+"px";a.style.height=(b.height/c|0)+"px";return a},drawText:function(a,b,c){var d=this.nodeFactory(a+this.LABEL_ID_SUFFIX,"olv:rect"),e=this.nodeFactory(a+this.LABEL_ID_SUFFIX+"_textbox","olv:textbox"),f=this.getResolution();d.style.left=((c.x-this.featureDx)/f-this.offset.x|0)+"px";d.style.top=(c.y/f-this.offset.y|0)+"px";d.style.flip="y";e.innerText=b.label;"inherit"!=b.cursor&&null!=b.cursor&&(e.style.cursor=b.cursor);b.fontColor&&
(e.style.color=b.fontColor);b.fontOpacity&&(e.style.filter="alpha(opacity="+100*b.fontOpacity+")");b.fontFamily&&(e.style.fontFamily=b.fontFamily);b.fontSize&&(e.style.fontSize=b.fontSize);b.fontWeight&&(e.style.fontWeight=b.fontWeight);b.fontStyle&&(e.style.fontStyle=b.fontStyle);!0===b.labelSelect&&(d._featureId=a,e._featureId=a,e._geometry=c,e._geometryClass=c.CLASS_NAME);e.style.whiteSpace="nowrap";e.inset="1px,0px,0px,0px";d.parentNode||(d.appendChild(e),this.textRoot.appendChild(d));b=b.labelAlign||
"cm";1==b.length&&(b+="m");a=e.clientWidth*OpenLayers.Renderer.VML.LABEL_SHIFT[b.substr(0,1)];e=e.clientHeight*OpenLayers.Renderer.VML.LABEL_SHIFT[b.substr(1,1)];d.style.left=parseInt(d.style.left)-a-1+"px";d.style.top=parseInt(d.style.top)+e+"px"},moveRoot:function(a){var b=this.map.getLayer(a.container.id);b instanceof OpenLayers.Layer.Vector.RootContainer&&(b=this.map.getLayer(this.container.id));b&&b.renderer.clear();OpenLayers.Renderer.Elements.prototype.moveRoot.apply(this,arguments);b&&b.redraw()},
importSymbol:function(a){var b=this.container.id+"-"+a,c=this.symbolCache[b];if(c)return c;c=OpenLayers.Renderer.symbol[a];if(!c)throw Error(a+" is not a valid symbol name");for(var a=new OpenLayers.Bounds(Number.MAX_VALUE,Number.MAX_VALUE,0,0),d=["m"],e=0;e<c.length;e+=2){var f=c[e],g=c[e+1];a.left=Math.min(a.left,f);a.bottom=Math.min(a.bottom,g);a.right=Math.max(a.right,f);a.top=Math.max(a.top,g);d.push(f);d.push(g);0==e&&d.push("l")}d.push("x e");c=d.join(" ");d=(a.getWidth()-a.getHeight())/2;
0<d?(a.bottom-=d,a.top+=d):(a.left+=d,a.right-=d);c={path:c,size:a.getWidth(),left:a.left,bottom:a.bottom};return this.symbolCache[b]=c},CLASS_NAME:"OpenLayers.Renderer.VML"});OpenLayers.Renderer.VML.LABEL_SHIFT={l:0,c:0.5,r:1,t:0,m:0.5,b:1};OpenLayers.Control.CacheRead=OpenLayers.Class(OpenLayers.Control,{fetchEvent:"tileloadstart",layers:null,autoActivate:!0,setMap:function(a){OpenLayers.Control.prototype.setMap.apply(this,arguments);var b,c=this.layers||a.layers;for(b=c.length-1;0<=b;--b)this.addLayer({layer:c[b]});if(!this.layers)a.events.on({addlayer:this.addLayer,removeLayer:this.removeLayer,scope:this})},addLayer:function(a){a.layer.events.register(this.fetchEvent,this,this.fetch)},removeLayer:function(a){a.layer.events.unregister(this.fetchEvent,
this,this.fetch)},fetch:function(a){if(this.active&&window.localStorage&&a.tile instanceof OpenLayers.Tile.Image){var b=a.tile,c=b.url;!b.layer.crossOriginKeyword&&(OpenLayers.ProxyHost&&0===c.indexOf(OpenLayers.ProxyHost))&&(c=OpenLayers.Control.CacheWrite.urlMap[c]);if(c=window.localStorage.getItem("olCache_"+c))b.url=c,"tileerror"===a.type&&b.setImgSrc(c)}},destroy:function(){if(this.layers||this.map){var a,b=this.layers||this.map.layers;for(a=b.length-1;0<=a;--a)this.removeLayer({layer:b[a]})}this.map&&
this.map.events.un({addlayer:this.addLayer,removeLayer:this.removeLayer,scope:this});OpenLayers.Control.prototype.destroy.apply(this,arguments)},CLASS_NAME:"OpenLayers.Control.CacheRead"});OpenLayers.Protocol.WFS.v1_0_0=OpenLayers.Class(OpenLayers.Protocol.WFS.v1,{version:"1.0.0",CLASS_NAME:"OpenLayers.Protocol.WFS.v1_0_0"});OpenLayers.Format.WMSGetFeatureInfo=OpenLayers.Class(OpenLayers.Format.XML,{layerIdentifier:"_layer",featureIdentifier:"_feature",regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},gmlFormat:null,read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));var b=a.documentElement;if(b)var c=this["read_"+b.nodeName],a=c?c.call(this,b):(new OpenLayers.Format.GML(this.options?this.options:{})).read(a);return a},read_msGMLOutput:function(a){var b=
[];if(a=this.getSiblingNodesByTagCriteria(a,this.layerIdentifier))for(var c=0,d=a.length;c<d;++c){var e=a[c],f=e.nodeName;e.prefix&&(f=f.split(":")[1]);f=f.replace(this.layerIdentifier,"");if(e=this.getSiblingNodesByTagCriteria(e,this.featureIdentifier))for(var g=0;g<e.length;g++){var h=e[g],i=this.parseGeometry(h),h=this.parseAttributes(h),h=new OpenLayers.Feature.Vector(i.geometry,h,null);h.bounds=i.bounds;h.type=f;b.push(h)}}return b},read_FeatureInfoResponse:function(a){for(var b=[],a=this.getElementsByTagNameNS(a,
"*","FIELDS"),c=0,d=a.length;c<d;c++){var e=a[c],f={},g,h=e.attributes.length;if(0<h)for(g=0;g<h;g++){var i=e.attributes[g];f[i.nodeName]=i.nodeValue}else{e=e.childNodes;g=0;for(h=e.length;g<h;++g)i=e[g],3!=i.nodeType&&(f[i.getAttribute("name")]=i.getAttribute("value"))}b.push(new OpenLayers.Feature.Vector(null,f,null))}return b},getSiblingNodesByTagCriteria:function(a,b){var c=[],d,e,f,g;if(a&&a.hasChildNodes()){d=a.childNodes;f=d.length;for(var h=0;h<f;h++){for(g=d[h];g&&1!=g.nodeType;)g=g.nextSibling,
h++;e=g?g.nodeName:"";0<e.length&&-1<e.indexOf(b)?c.push(g):(e=this.getSiblingNodesByTagCriteria(g,b),0<e.length&&(0==c.length?c=e:c.push(e)))}}return c},parseAttributes:function(a){var b={};if(1==a.nodeType)for(var a=a.childNodes,c=a.length,d=0;d<c;++d){var e=a[d];if(1==e.nodeType){var f=e.childNodes,e=e.prefix?e.nodeName.split(":")[1]:e.nodeName;if(0==f.length)b[e]=null;else if(1==f.length&&(f=f[0],3==f.nodeType||4==f.nodeType))f=f.nodeValue.replace(this.regExes.trimSpace,""),b[e]=f}}return b},
parseGeometry:function(a){this.gmlFormat||(this.gmlFormat=new OpenLayers.Format.GML);var a=this.gmlFormat.parseFeature(a),b,c=null;a&&(b=a.geometry&&a.geometry.clone(),c=a.bounds&&a.bounds.clone(),a.destroy());return{geometry:b,bounds:c}},CLASS_NAME:"OpenLayers.Format.WMSGetFeatureInfo"});OpenLayers.Control.WMTSGetFeatureInfo=OpenLayers.Class(OpenLayers.Control,{hover:!1,requestEncoding:"KVP",drillDown:!1,maxFeatures:10,clickCallback:"click",layers:null,queryVisible:!0,infoFormat:"text/html",vendorParams:{},format:null,formatOptions:null,handlerOptions:null,handler:null,hoverRequest:null,pending:0,initialize:function(a){a=a||{};a.handlerOptions=a.handlerOptions||{};OpenLayers.Control.prototype.initialize.apply(this,[a]);this.format||(this.format=new OpenLayers.Format.WMSGetFeatureInfo(a.formatOptions));
!0===this.drillDown&&(this.hover=!1);this.hover?this.handler=new OpenLayers.Handler.Hover(this,{move:this.cancelHover,pause:this.getInfoForHover},OpenLayers.Util.extend(this.handlerOptions.hover||{},{delay:250})):(a={},a[this.clickCallback]=this.getInfoForClick,this.handler=new OpenLayers.Handler.Click(this,a,this.handlerOptions.click||{}))},getInfoForClick:function(a){this.request(a.xy,{})},getInfoForHover:function(a){this.request(a.xy,{hover:!0})},cancelHover:function(){this.hoverRequest&&(--this.pending,
0>=this.pending&&(OpenLayers.Element.removeClass(this.map.viewPortDiv,"olCursorWait"),this.pending=0),this.hoverRequest.abort(),this.hoverRequest=null)},findLayers:function(){for(var a=this.layers||this.map.layers,b=[],c,d=a.length-1;0<=d;--d)if(c=a[d],c instanceof OpenLayers.Layer.WMTS&&c.requestEncoding===this.requestEncoding&&(!this.queryVisible||c.getVisibility()))if(b.push(c),!this.drillDown||this.hover)break;return b},buildRequestOptions:function(a,b){var c=this.map.getLonLatFromPixel(b),d=
a.getURL(new OpenLayers.Bounds(c.lon,c.lat,c.lon,c.lat)),d=OpenLayers.Util.getParameters(d),c=a.getTileInfo(c);OpenLayers.Util.extend(d,{service:"WMTS",version:a.version,request:"GetFeatureInfo",infoFormat:this.infoFormat,i:c.i,j:c.j});OpenLayers.Util.applyDefaults(d,this.vendorParams);return{url:OpenLayers.Util.isArray(a.url)?a.url[0]:a.url,params:OpenLayers.Util.upperCaseObject(d),callback:function(c){this.handleResponse(b,c,a)},scope:this}},request:function(a,b){var b=b||{},c=this.findLayers();
if(0<c.length){for(var d,e,f=0,g=c.length;f<g;f++)e=c[f],d=this.events.triggerEvent("beforegetfeatureinfo",{xy:a,layer:e}),!1!==d&&(++this.pending,d=this.buildRequestOptions(e,a),d=OpenLayers.Request.GET(d),!0===b.hover&&(this.hoverRequest=d));0<this.pending&&OpenLayers.Element.addClass(this.map.viewPortDiv,"olCursorWait")}},handleResponse:function(a,b,c){--this.pending;0>=this.pending&&(OpenLayers.Element.removeClass(this.map.viewPortDiv,"olCursorWait"),this.pending=0);if(b.status&&(200>b.status||
300<=b.status))this.events.triggerEvent("exception",{xy:a,request:b,layer:c});else{var d=b.responseXML;if(!d||!d.documentElement)d=b.responseText;var e,f;try{e=this.format.read(d)}catch(g){f=!0,this.events.triggerEvent("exception",{xy:a,request:b,error:g,layer:c})}f||this.events.triggerEvent("getfeatureinfo",{text:b.responseText,features:e,request:b,xy:a,layer:c})}},CLASS_NAME:"OpenLayers.Control.WMTSGetFeatureInfo"});OpenLayers.Strategy.Paging=OpenLayers.Class(OpenLayers.Strategy,{features:null,length:10,num:null,paging:!1,activate:function(){var a=OpenLayers.Strategy.prototype.activate.call(this);if(a)this.layer.events.on({beforefeaturesadded:this.cacheFeatures,scope:this});return a},deactivate:function(){var a=OpenLayers.Strategy.prototype.deactivate.call(this);a&&(this.clearCache(),this.layer.events.un({beforefeaturesadded:this.cacheFeatures,scope:this}));return a},cacheFeatures:function(a){this.paging||(this.clearCache(),
this.features=a.features,this.pageNext(a))},clearCache:function(){if(this.features)for(var a=0;a<this.features.length;++a)this.features[a].destroy();this.num=this.features=null},pageCount:function(){return Math.ceil((this.features?this.features.length:0)/this.length)},pageNum:function(){return this.num},pageLength:function(a){a&&0<a&&(this.length=a);return this.length},pageNext:function(a){var b=!1;this.features&&(null===this.num&&(this.num=-1),b=this.page((this.num+1)*this.length,a));return b},pagePrevious:function(){var a=
!1;this.features&&(null===this.num&&(this.num=this.pageCount()),a=this.page((this.num-1)*this.length));return a},page:function(a,b){var c=!1;if(this.features&&0<=a&&a<this.features.length){var d=Math.floor(a/this.length);d!=this.num&&(this.paging=!0,c=this.features.slice(a,a+this.length),this.layer.removeFeatures(this.layer.features),this.num=d,b&&b.features?b.features=c:this.layer.addFeatures(c),this.paging=!1,c=!0)}return c},CLASS_NAME:"OpenLayers.Strategy.Paging"});OpenLayers.Protocol.CSW.v2_0_2=OpenLayers.Class(OpenLayers.Protocol,{formatOptions:null,initialize:function(a){OpenLayers.Protocol.prototype.initialize.apply(this,[a]);a.format||(this.format=new OpenLayers.Format.CSWGetRecords.v2_0_2(OpenLayers.Util.extend({},this.formatOptions)))},destroy:function(){this.options&&!this.options.format&&this.format.destroy();this.format=null;OpenLayers.Protocol.prototype.destroy.apply(this)},read:function(a){a=OpenLayers.Util.extend({},a);OpenLayers.Util.applyDefaults(a,
this.options||{});var b=new OpenLayers.Protocol.Response({requestType:"read"}),c=this.format.write(a.params);b.priv=OpenLayers.Request.POST({url:a.url,callback:this.createCallback(this.handleRead,b,a),params:a.params,headers:a.headers,data:c});return b},handleRead:function(a,b){if(b.callback){var c=a.priv;200<=c.status&&300>c.status?(a.data=this.parseData(c),a.code=OpenLayers.Protocol.Response.SUCCESS):a.code=OpenLayers.Protocol.Response.FAILURE;b.callback.call(b.scope,a)}},parseData:function(a){var b=
a.responseXML;if(!b||!b.documentElement)b=a.responseText;return!b||0>=b.length?null:this.format.read(b)},CLASS_NAME:"OpenLayers.Protocol.CSW.v2_0_2"});OpenLayers.Format.WMSCapabilities.v1_1=OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1,{readers:{wms:OpenLayers.Util.applyDefaults({WMT_MS_Capabilities:function(a,b){this.readChildNodes(a,b)},Keyword:function(a,b){b.keywords&&b.keywords.push(this.getChildValue(a))},DescribeLayer:function(a,b){b.describelayer={formats:[]};this.readChildNodes(a,b.describelayer)},GetLegendGraphic:function(a,b){b.getlegendgraphic={formats:[]};this.readChildNodes(a,b.getlegendgraphic)},GetStyles:function(a,b){b.getstyles=
{formats:[]};this.readChildNodes(a,b.getstyles)},PutStyles:function(a,b){b.putstyles={formats:[]};this.readChildNodes(a,b.putstyles)},UserDefinedSymbolization:function(a,b){var c={supportSLD:1==parseInt(a.getAttribute("SupportSLD")),userLayer:1==parseInt(a.getAttribute("UserLayer")),userStyle:1==parseInt(a.getAttribute("UserStyle")),remoteWFS:1==parseInt(a.getAttribute("RemoteWFS"))};b.userSymbols=c},LatLonBoundingBox:function(a,b){b.llbbox=[parseFloat(a.getAttribute("minx")),parseFloat(a.getAttribute("miny")),
parseFloat(a.getAttribute("maxx")),parseFloat(a.getAttribute("maxy"))]},BoundingBox:function(a,b){var c=OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms.BoundingBox.apply(this,[a,b]);c.srs=a.getAttribute("SRS");b.bbox[c.srs]=c},ScaleHint:function(a,b){var c=a.getAttribute("min"),d=a.getAttribute("max"),e=Math.pow(2,0.5),f=OpenLayers.INCHES_PER_UNIT.m;b.maxScale=parseFloat((c/e*f*OpenLayers.DOTS_PER_INCH).toPrecision(13));b.minScale=parseFloat((d/e*f*OpenLayers.DOTS_PER_INCH).toPrecision(13))},
Dimension:function(a,b){var c={name:a.getAttribute("name").toLowerCase(),units:a.getAttribute("units"),unitsymbol:a.getAttribute("unitSymbol")};b.dimensions[c.name]=c},Extent:function(a,b){var c=a.getAttribute("name").toLowerCase();if(c in b.dimensions){c=b.dimensions[c];c.nearestVal="1"===a.getAttribute("nearestValue");c.multipleVal="1"===a.getAttribute("multipleValues");c.current="1"===a.getAttribute("current");c["default"]=a.getAttribute("default")||"";var d=this.getChildValue(a);c.values=d.split(",")}}},
OpenLayers.Format.WMSCapabilities.v1.prototype.readers.wms)},CLASS_NAME:"OpenLayers.Format.WMSCapabilities.v1_1"});OpenLayers.Control.Graticule=OpenLayers.Class(OpenLayers.Control,{autoActivate:!0,intervals:[45,30,20,10,5,2,1,0.5,0.2,0.1,0.05,0.01,0.005,0.002,0.001],displayInLayerSwitcher:!0,visible:!0,numPoints:50,targetSize:200,layerName:null,labelled:!0,labelFormat:"dm",lineSymbolizer:{strokeColor:"#333",strokeWidth:1,strokeOpacity:0.5},labelSymbolizer:{},gratLayer:null,initialize:function(a){a=a||{};a.layerName=a.layerName||OpenLayers.i18n("Graticule");OpenLayers.Control.prototype.initialize.apply(this,[a]);
this.labelSymbolizer.stroke=!1;this.labelSymbolizer.fill=!1;this.labelSymbolizer.label="${label}";this.labelSymbolizer.labelAlign="${labelAlign}";this.labelSymbolizer.labelXOffset="${xOffset}";this.labelSymbolizer.labelYOffset="${yOffset}"},destroy:function(){this.deactivate();OpenLayers.Control.prototype.destroy.apply(this,arguments);this.gratLayer&&(this.gratLayer.destroy(),this.gratLayer=null)},draw:function(){OpenLayers.Control.prototype.draw.apply(this,arguments);if(!this.gratLayer){var a=new OpenLayers.Style({},
{rules:[new OpenLayers.Rule({symbolizer:{Point:this.labelSymbolizer,Line:this.lineSymbolizer}})]});this.gratLayer=new OpenLayers.Layer.Vector(this.layerName,{styleMap:new OpenLayers.StyleMap({"default":a}),visibility:this.visible,displayInLayerSwitcher:this.displayInLayerSwitcher})}return this.div},activate:function(){return OpenLayers.Control.prototype.activate.apply(this,arguments)?(this.map.addLayer(this.gratLayer),this.map.events.register("moveend",this,this.update),this.update(),!0):!1},deactivate:function(){return OpenLayers.Control.prototype.deactivate.apply(this,
arguments)?(this.map.events.unregister("moveend",this,this.update),this.map.removeLayer(this.gratLayer),!0):!1},update:function(){var a=this.map.getExtent();if(a){this.gratLayer.destroyFeatures();var b=new OpenLayers.Projection("EPSG:4326"),c=this.map.getProjectionObject(),d=this.map.getResolution();c.proj&&"longlat"==c.proj.projName&&(this.numPoints=1);var e=this.map.getCenter(),f=new OpenLayers.Pixel(e.lon,e.lat);OpenLayers.Projection.transform(f,c,b);for(var e=this.targetSize*d,e=e*e,g,d=0;d<this.intervals.length;++d){g=
this.intervals[d];var h=g/2,i=f.offset({x:-h,y:-h}),h=f.offset({x:h,y:h});OpenLayers.Projection.transform(i,b,c);OpenLayers.Projection.transform(h,b,c);if((i.x-h.x)*(i.x-h.x)+(i.y-h.y)*(i.y-h.y)<=e)break}f.x=Math.floor(f.x/g)*g;f.y=Math.floor(f.y/g)*g;var d=0,e=[f.clone()],h=f.clone(),j;do h=h.offset({x:0,y:g}),j=OpenLayers.Projection.transform(h.clone(),b,c),e.unshift(h);while(a.containsPixel(j)&&1E3>++d);h=f.clone();do h=h.offset({x:0,y:-g}),j=OpenLayers.Projection.transform(h.clone(),b,c),e.push(h);
while(a.containsPixel(j)&&1E3>++d);d=0;i=[f.clone()];h=f.clone();do h=h.offset({x:-g,y:0}),j=OpenLayers.Projection.transform(h.clone(),b,c),i.unshift(h);while(a.containsPixel(j)&&1E3>++d);h=f.clone();do h=h.offset({x:g,y:0}),j=OpenLayers.Projection.transform(h.clone(),b,c),i.push(h);while(a.containsPixel(j)&&1E3>++d);g=[];for(d=0;d<i.length;++d){j=i[d].x;for(var f=[],k=null,l=Math.min(e[0].y,90),h=Math.max(e[e.length-1].y,-90),m=(l-h)/this.numPoints,l=h,h=0;h<=this.numPoints;++h){var n=new OpenLayers.Geometry.Point(j,
l);n.transform(b,c);f.push(n);l+=m;n.y>=a.bottom&&!k&&(k=n)}this.labelled&&(k=new OpenLayers.Geometry.Point(k.x,a.bottom),j={value:j,label:this.labelled?OpenLayers.Util.getFormattedLonLat(j,"lon",this.labelFormat):"",labelAlign:"cb",xOffset:0,yOffset:2},this.gratLayer.addFeatures(new OpenLayers.Feature.Vector(k,j)));f=new OpenLayers.Geometry.LineString(f);g.push(new OpenLayers.Feature.Vector(f))}for(h=0;h<e.length;++h)if(l=e[h].y,!(-90>l||90<l)){f=[];d=i[0].x;m=(i[i.length-1].x-d)/this.numPoints;
j=d;k=null;for(d=0;d<=this.numPoints;++d)n=new OpenLayers.Geometry.Point(j,l),n.transform(b,c),f.push(n),j+=m,n.x<a.right&&(k=n);this.labelled&&(k=new OpenLayers.Geometry.Point(a.right,k.y),j={value:l,label:this.labelled?OpenLayers.Util.getFormattedLonLat(l,"lat",this.labelFormat):"",labelAlign:"rb",xOffset:-2,yOffset:2},this.gratLayer.addFeatures(new OpenLayers.Feature.Vector(k,j)));f=new OpenLayers.Geometry.LineString(f);g.push(new OpenLayers.Feature.Vector(f))}this.gratLayer.addFeatures(g)}},CLASS_NAME:"OpenLayers.Control.Graticule"});OpenLayers.Layer.UTFGrid=OpenLayers.Class(OpenLayers.Layer.XYZ,{isBaseLayer:!1,projection:new OpenLayers.Projection("EPSG:900913"),useJSONP:!1,tileClass:OpenLayers.Tile.UTFGrid,initialize:function(a){OpenLayers.Layer.Grid.prototype.initialize.apply(this,[a.name,a.url,{},a]);this.tileOptions=OpenLayers.Util.extend({utfgridResolution:this.utfgridResolution},this.tileOptions)},clone:function(a){null==a&&(a=new OpenLayers.Layer.UTFGrid(this.getOptions()));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,
[a])},getFeatureInfo:function(a){var b=null,a=this.getTileData(a);a.tile&&(b=a.tile.getFeatureInfo(a.i,a.j));return b},getFeatureId:function(a){var b=null,a=this.getTileData(a);a.tile&&(b=a.tile.getFeatureId(a.i,a.j));return b},CLASS_NAME:"OpenLayers.Layer.UTFGrid"});OpenLayers.Layer.ArcGISCache=OpenLayers.Class(OpenLayers.Layer.XYZ,{url:null,tileOrigin:null,tileSize:new OpenLayers.Size(256,256),useArcGISServer:!0,type:"png",useScales:!1,overrideDPI:!1,initialize:function(a,b,c){OpenLayers.Layer.XYZ.prototype.initialize.apply(this,arguments);this.resolutions&&(this.serverResolutions=this.resolutions,this.maxExtent=this.getMaxExtentForResolution(this.resolutions[0]));if(this.layerInfo){var d=this.layerInfo,e=new OpenLayers.Bounds(d.fullExtent.xmin,d.fullExtent.ymin,
d.fullExtent.xmax,d.fullExtent.ymax);this.projection="EPSG:"+d.spatialReference.wkid;this.sphericalMercator=102100==d.spatialReference.wkid;this.units="esriFeet"==d.units?"ft":"m";if(d.tileInfo){this.tileSize=new OpenLayers.Size(d.tileInfo.width||d.tileInfo.cols,d.tileInfo.height||d.tileInfo.rows);this.tileOrigin=new OpenLayers.LonLat(d.tileInfo.origin.x,d.tileInfo.origin.y);var f=new OpenLayers.Geometry.Point(e.left,e.top),e=new OpenLayers.Geometry.Point(e.right,e.bottom);this.useScales?this.scales=
[]:this.resolutions=[];this.lods=[];for(var g in d.tileInfo.lods)if(d.tileInfo.lods.hasOwnProperty(g)){var h=d.tileInfo.lods[g];this.useScales?this.scales.push(h.scale):this.resolutions.push(h.resolution);var i=this.getContainingTileCoords(f,h.resolution);h.startTileCol=i.x;h.startTileRow=i.y;i=this.getContainingTileCoords(e,h.resolution);h.endTileCol=i.x;h.endTileRow=i.y;this.lods.push(h)}this.maxExtent=this.calculateMaxExtentWithLOD(this.lods[0]);this.serverResolutions=this.resolutions;this.overrideDPI&&
d.tileInfo.dpi&&(OpenLayers.DOTS_PER_INCH=d.tileInfo.dpi)}}},getContainingTileCoords:function(a,b){return new OpenLayers.Pixel(Math.max(Math.floor((a.x-this.tileOrigin.lon)/(this.tileSize.w*b)),0),Math.max(Math.floor((this.tileOrigin.lat-a.y)/(this.tileSize.h*b)),0))},calculateMaxExtentWithLOD:function(a){var b=this.tileOrigin.lon+a.startTileCol*this.tileSize.w*a.resolution,c=this.tileOrigin.lat-a.startTileRow*this.tileSize.h*a.resolution;return new OpenLayers.Bounds(b,c-(a.endTileRow-a.startTileRow+
1)*this.tileSize.h*a.resolution,b+(a.endTileCol-a.startTileCol+1)*this.tileSize.w*a.resolution,c)},calculateMaxExtentWithExtent:function(a,b){var c=new OpenLayers.Geometry.Point(a.left,a.top),d=new OpenLayers.Geometry.Point(a.right,a.bottom),c=this.getContainingTileCoords(c,b),d=this.getContainingTileCoords(d,b);return this.calculateMaxExtentWithLOD({resolution:b,startTileCol:c.x,startTileRow:c.y,endTileCol:d.x,endTileRow:d.y})},getUpperLeftTileCoord:function(a){return this.getContainingTileCoords(new OpenLayers.Geometry.Point(this.maxExtent.left,
this.maxExtent.top),a)},getLowerRightTileCoord:function(a){return this.getContainingTileCoords(new OpenLayers.Geometry.Point(this.maxExtent.right,this.maxExtent.bottom),a)},getMaxExtentForResolution:function(a){var b=this.getUpperLeftTileCoord(a),c=this.getLowerRightTileCoord(a),d=this.tileOrigin.lon+b.x*this.tileSize.w*a,e=this.tileOrigin.lat-b.y*this.tileSize.h*a;return new OpenLayers.Bounds(d,e-(c.y-b.y+1)*this.tileSize.h*a,d+(c.x-b.x+1)*this.tileSize.w*a,e)},clone:function(a){null==a&&(a=new OpenLayers.Layer.ArcGISCache(this.name,
this.url,this.options));return OpenLayers.Layer.XYZ.prototype.clone.apply(this,[a])},getMaxExtent:function(){return this.maxExtent=this.getMaxExtentForResolution(this.map.getResolution())},getTileOrigin:function(){var a=this.getMaxExtent();return new OpenLayers.LonLat(a.left,a.bottom)},getURL:function(a){var b=this.getResolution(),c=this.tileOrigin.lon+b*this.tileSize.w/2,d=this.tileOrigin.lat-b*this.tileSize.h/2,a=a.getCenterLonLat(),c=Math.round(Math.abs((a.lon-c)/(b*this.tileSize.w))),d=Math.round(Math.abs((d-
a.lat)/(b*this.tileSize.h))),a=this.map.getZoom();if(this.lods){if(b=this.lods[this.map.getZoom()],c<b.startTileCol||c>b.endTileCol||d<b.startTileRow||d>b.endTileRow)return null}else{var e=this.getUpperLeftTileCoord(b),b=this.getLowerRightTileCoord(b);if(c<e.x||c>=b.x||d<e.y||d>=b.y)return null}b=this.url;e=""+c+d+a;OpenLayers.Util.isArray(b)&&(b=this.selectUrl(e,b));this.useArcGISServer?b+="/tile/${z}/${y}/${x}":(c="C"+this.zeroPad(c,8,16),d="R"+this.zeroPad(d,8,16),a="L"+this.zeroPad(a,2,16),b=
b+"/${z}/${y}/${x}."+this.type);b=OpenLayers.String.format(b,{x:c,y:d,z:a});return OpenLayers.Util.urlAppend(b,OpenLayers.Util.getParameterString(this.params))},zeroPad:function(a,b,c){for(a=a.toString(c||10);a.length<b;)a="0"+a;return a},CLASS_NAME:"OpenLayers.Layer.ArcGISCache"});OpenLayers.Control.WMSGetFeatureInfo=OpenLayers.Class(OpenLayers.Control,{hover:!1,drillDown:!1,maxFeatures:10,clickCallback:"click",output:"features",layers:null,queryVisible:!1,url:null,layerUrls:null,infoFormat:"text/html",vendorParams:{},format:null,formatOptions:null,handlerOptions:null,handler:null,hoverRequest:null,initialize:function(a){a=a||{};a.handlerOptions=a.handlerOptions||{};OpenLayers.Control.prototype.initialize.apply(this,[a]);this.format||(this.format=new OpenLayers.Format.WMSGetFeatureInfo(a.formatOptions));
!0===this.drillDown&&(this.hover=!1);this.hover?this.handler=new OpenLayers.Handler.Hover(this,{move:this.cancelHover,pause:this.getInfoForHover},OpenLayers.Util.extend(this.handlerOptions.hover||{},{delay:250})):(a={},a[this.clickCallback]=this.getInfoForClick,this.handler=new OpenLayers.Handler.Click(this,a,this.handlerOptions.click||{}))},getInfoForClick:function(a){this.events.triggerEvent("beforegetfeatureinfo",{xy:a.xy});OpenLayers.Element.addClass(this.map.viewPortDiv,"olCursorWait");this.request(a.xy,
{})},getInfoForHover:function(a){this.events.triggerEvent("beforegetfeatureinfo",{xy:a.xy});this.request(a.xy,{hover:!0})},cancelHover:function(){this.hoverRequest&&(this.hoverRequest.abort(),this.hoverRequest=null)},findLayers:function(){for(var a=this.layers||this.map.layers,b=[],c,d,e=a.length-1;0<=e;--e)if(c=a[e],c instanceof OpenLayers.Layer.WMS&&(!this.queryVisible||c.getVisibility()))d=OpenLayers.Util.isArray(c.url)?c.url[0]:c.url,!1===this.drillDown&&!this.url&&(this.url=d),(!0===this.drillDown||
this.urlMatches(d))&&b.push(c);return b},urlMatches:function(a){var b=OpenLayers.Util.isEquivalentUrl(this.url,a);if(!b&&this.layerUrls)for(var c=0,d=this.layerUrls.length;c<d;++c)if(OpenLayers.Util.isEquivalentUrl(this.layerUrls[c],a)){b=!0;break}return b},buildWMSOptions:function(a,b,c,d){for(var e=[],f=[],g=0,h=b.length;g<h;g++)null!=b[g].params.LAYERS&&(e=e.concat(b[g].params.LAYERS),f=f.concat(this.getStyleNames(b[g])));b=b[0];g=this.map.getProjection();(h=b.projection)&&h.equals(this.map.getProjectionObject())&&
(g=h.getCode());d=OpenLayers.Util.extend({service:"WMS",version:b.params.VERSION,request:"GetFeatureInfo",exceptions:b.params.EXCEPTIONS,bbox:this.map.getExtent().toBBOX(null,b.reverseAxisOrder()),feature_count:this.maxFeatures,height:this.map.getSize().h,width:this.map.getSize().w,format:d,info_format:b.params.INFO_FORMAT||this.infoFormat},1.3<=parseFloat(b.params.VERSION)?{crs:g,i:parseInt(c.x),j:parseInt(c.y)}:{srs:g,x:parseInt(c.x),y:parseInt(c.y)});0!=e.length&&(d=OpenLayers.Util.extend({layers:e,
query_layers:e,styles:f},d));OpenLayers.Util.applyDefaults(d,this.vendorParams);return{url:a,params:OpenLayers.Util.upperCaseObject(d),callback:function(b){this.handleResponse(c,b,a)},scope:this}},getStyleNames:function(a){return a.params.STYLES?a.params.STYLES:OpenLayers.Util.isArray(a.params.LAYERS)?Array(a.params.LAYERS.length):a.params.LAYERS.replace(/[^,]/g,"")},request:function(a,b){var c=this.findLayers();if(0==c.length)this.events.triggerEvent("nogetfeatureinfo"),OpenLayers.Element.removeClass(this.map.viewPortDiv,
"olCursorWait");else if(b=b||{},!1===this.drillDown){var c=this.buildWMSOptions(this.url,c,a,c[0].params.FORMAT),d=OpenLayers.Request.GET(c);!0===b.hover&&(this.hoverRequest=d)}else{this._numRequests=this._requestCount=0;this.features=[];for(var d={},e,f=0,g=c.length;f<g;f++){var h=c[f];e=OpenLayers.Util.isArray(h.url)?h.url[0]:h.url;e in d?d[e].push(h):(this._numRequests++,d[e]=[h])}for(e in d)c=d[e],c=this.buildWMSOptions(e,c,a,c[0].params.FORMAT),OpenLayers.Request.GET(c)}},triggerGetFeatureInfo:function(a,
b,c){this.events.triggerEvent("getfeatureinfo",{text:a.responseText,features:c,request:a,xy:b});OpenLayers.Element.removeClass(this.map.viewPortDiv,"olCursorWait")},handleResponse:function(a,b,c){var d=b.responseXML;if(!d||!d.documentElement)d=b.responseText;d=this.format.read(d);!1===this.drillDown?this.triggerGetFeatureInfo(b,a,d):(this._requestCount++,this._features="object"===this.output?(this._features||[]).concat({url:c,features:d}):(this._features||[]).concat(d),this._requestCount===this._numRequests&&
(this.triggerGetFeatureInfo(b,a,this._features.concat()),delete this._features,delete this._requestCount,delete this._numRequests))},CLASS_NAME:"OpenLayers.Control.WMSGetFeatureInfo"});OpenLayers.Format.WMSCapabilities.v1_3_0=OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_3,{version:"1.3.0",CLASS_NAME:"OpenLayers.Format.WMSCapabilities.v1_3_0"});OpenLayers.Format.SOSGetFeatureOfInterest=OpenLayers.Class(OpenLayers.Format.XML,{VERSION:"1.0.0",namespaces:{sos:"http://www.opengis.net/sos/1.0",gml:"http://www.opengis.net/gml",sa:"http://www.opengis.net/sampling/1.0",xsi:"http://www.w3.org/2001/XMLSchema-instance"},schemaLocation:"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd",defaultPrefix:"sos",regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},read:function(a){"string"==
typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={features:[]};this.readNode(a,b);for(var a=[],c=0,d=b.features.length;c<d;c++){var e=b.features[c];this.internalProjection&&(this.externalProjection&&e.components[0])&&e.components[0].transform(this.externalProjection,this.internalProjection);e=new OpenLayers.Feature.Vector(e.components[0],e.attributes);a.push(e)}return a},readers:{sa:{SamplingPoint:function(a,b){if(!b.attributes){var c=
{attributes:{}};b.features.push(c);b=c}b.attributes.id=this.getAttributeNS(a,this.namespaces.gml,"id");this.readChildNodes(a,b)},position:function(a,b){this.readChildNodes(a,b)}},gml:OpenLayers.Util.applyDefaults({FeatureCollection:function(a,b){this.readChildNodes(a,b)},featureMember:function(a,b){var c={attributes:{}};b.features.push(c);this.readChildNodes(a,c)},name:function(a,b){b.attributes.name=this.getChildValue(a)},pos:function(a,b){this.externalProjection||(this.externalProjection=new OpenLayers.Projection(a.getAttribute("srsName")));
OpenLayers.Format.GML.v3.prototype.readers.gml.pos.apply(this,[a,b])}},OpenLayers.Format.GML.v3.prototype.readers.gml)},writers:{sos:{GetFeatureOfInterest:function(a){for(var b=this.createElementNSPlus("GetFeatureOfInterest",{attributes:{version:this.VERSION,service:"SOS","xsi:schemaLocation":this.schemaLocation}}),c=0,d=a.fois.length;c<d;c++)this.writeNode("FeatureOfInterestId",{foi:a.fois[c]},b);return b},FeatureOfInterestId:function(a){return this.createElementNSPlus("FeatureOfInterestId",{value:a.foi})}}},
CLASS_NAME:"OpenLayers.Format.SOSGetFeatureOfInterest"});OpenLayers.Format.SOSGetObservation=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{ows:"http://www.opengis.net/ows",gml:"http://www.opengis.net/gml",sos:"http://www.opengis.net/sos/1.0",ogc:"http://www.opengis.net/ogc",om:"http://www.opengis.net/om/1.0",sa:"http://www.opengis.net/sampling/1.0",xlink:"http://www.w3.org/1999/xlink",xsi:"http://www.w3.org/2001/XMLSchema-instance"},regExes:{trimSpace:/^\s*|\s*$/g,removeSpace:/\s*/g,splitSpace:/\s+/,trimComma:/\s*,\s*/g},VERSION:"1.0.0",schemaLocation:"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosGetObservation.xsd",
defaultPrefix:"sos",read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={measurements:[],observations:[]};this.readNode(a,b);return b},write:function(a){a=this.writeNode("sos:GetObservation",a);a.setAttribute("xmlns:om",this.namespaces.om);a.setAttribute("xmlns:ogc",this.namespaces.ogc);this.setAttributeNS(a,this.namespaces.xsi,"xsi:schemaLocation",this.schemaLocation);return OpenLayers.Format.XML.prototype.write.apply(this,
[a])},readers:{om:{ObservationCollection:function(a,b){b.id=this.getAttributeNS(a,this.namespaces.gml,"id");this.readChildNodes(a,b)},member:function(a,b){this.readChildNodes(a,b)},Measurement:function(a,b){var c={};b.measurements.push(c);this.readChildNodes(a,c)},Observation:function(a,b){var c={};b.observations.push(c);this.readChildNodes(a,c)},samplingTime:function(a,b){var c={};b.samplingTime=c;this.readChildNodes(a,c)},observedProperty:function(a,b){b.observedProperty=this.getAttributeNS(a,this.namespaces.xlink,
"href");this.readChildNodes(a,b)},procedure:function(a,b){b.procedure=this.getAttributeNS(a,this.namespaces.xlink,"href");this.readChildNodes(a,b)},featureOfInterest:function(a,b){var c={features:[]};b.fois=[];b.fois.push(c);this.readChildNodes(a,c);for(var d=[],e=0,f=c.features.length;e<f;e++){var g=c.features[e];d.push(new OpenLayers.Feature.Vector(g.components[0],g.attributes))}c.features=d},result:function(a,b){var c={};b.result=c;""!==this.getChildValue(a)?(c.value=this.getChildValue(a),c.uom=
a.getAttribute("uom")):this.readChildNodes(a,c)}},sa:OpenLayers.Format.SOSGetFeatureOfInterest.prototype.readers.sa,gml:OpenLayers.Util.applyDefaults({TimeInstant:function(a,b){var c={};b.timeInstant=c;this.readChildNodes(a,c)},timePosition:function(a,b){b.timePosition=this.getChildValue(a)}},OpenLayers.Format.SOSGetFeatureOfInterest.prototype.readers.gml)},writers:{sos:{GetObservation:function(a){var b=this.createElementNSPlus("GetObservation",{attributes:{version:this.VERSION,service:"SOS"}});this.writeNode("offering",
a,b);a.eventTime&&this.writeNode("eventTime",a,b);for(var c in a.procedures)this.writeNode("procedure",a.procedures[c],b);for(var d in a.observedProperties)this.writeNode("observedProperty",a.observedProperties[d],b);a.foi&&this.writeNode("featureOfInterest",a.foi,b);this.writeNode("responseFormat",a,b);a.resultModel&&this.writeNode("resultModel",a,b);a.responseMode&&this.writeNode("responseMode",a,b);return b},featureOfInterest:function(a){var b=this.createElementNSPlus("featureOfInterest");this.writeNode("ObjectID",
a.objectId,b);return b},ObjectID:function(a){return this.createElementNSPlus("ObjectID",{value:a})},responseFormat:function(a){return this.createElementNSPlus("responseFormat",{value:a.responseFormat})},procedure:function(a){return this.createElementNSPlus("procedure",{value:a})},offering:function(a){return this.createElementNSPlus("offering",{value:a.offering})},observedProperty:function(a){return this.createElementNSPlus("observedProperty",{value:a})},eventTime:function(a){var b=this.createElementNSPlus("eventTime");
"latest"===a.eventTime&&this.writeNode("ogc:TM_Equals",a,b);return b},resultModel:function(a){return this.createElementNSPlus("resultModel",{value:a.resultModel})},responseMode:function(a){return this.createElementNSPlus("responseMode",{value:a.responseMode})}},ogc:{TM_Equals:function(a){var b=this.createElementNSPlus("ogc:TM_Equals");this.writeNode("ogc:PropertyName",{property:"urn:ogc:data:time:iso8601"},b);"latest"===a.eventTime&&this.writeNode("gml:TimeInstant",{value:"latest"},b);return b},PropertyName:function(a){return this.createElementNSPlus("ogc:PropertyName",
{value:a.property})}},gml:{TimeInstant:function(a){var b=this.createElementNSPlus("gml:TimeInstant");this.writeNode("gml:timePosition",a,b);return b},timePosition:function(a){return this.createElementNSPlus("gml:timePosition",{value:a.value})}}},CLASS_NAME:"OpenLayers.Format.SOSGetObservation"});OpenLayers.Control.UTFGrid=OpenLayers.Class(OpenLayers.Control,{autoActivate:!0,layers:null,defaultHandlerOptions:{delay:300,pixelTolerance:4,stopMove:!1,single:!0,"double":!1,stopSingle:!1,stopDouble:!1},handlerMode:"click",setHandler:function(a){this.handlerMode=a;this.resetHandler()},resetHandler:function(){this.handler&&(this.handler.deactivate(),this.handler.destroy(),this.handler=null);"hover"==this.handlerMode?this.handler=new OpenLayers.Handler.Hover(this,{pause:this.handleEvent,move:this.reset},
this.handlerOptions):"click"==this.handlerMode?this.handler=new OpenLayers.Handler.Click(this,{click:this.handleEvent},this.handlerOptions):"move"==this.handlerMode&&(this.handler=new OpenLayers.Handler.Hover(this,{pause:this.handleEvent,move:this.handleEvent},this.handlerOptions));return this.handler?!0:!1},initialize:function(a){a=a||{};a.handlerOptions=a.handlerOptions||this.defaultHandlerOptions;OpenLayers.Control.prototype.initialize.apply(this,[a]);this.resetHandler()},handleEvent:function(a){if(null==
a)this.reset();else{var b=this.map.getLonLatFromPixel(a.xy);if(b){var c=this.findLayers();if(0<c.length){for(var d={},e,f,g=0,h=c.length;g<h;g++)e=c[g],f=OpenLayers.Util.indexOf(this.map.layers,e),d[f]=e.getFeatureInfo(b);this.callback(d,b,a.xy)}}}},callback:function(){},reset:function(){this.callback(null)},findLayers:function(){for(var a=this.layers||this.map.layers,b=[],c,d=a.length-1;0<=d;--d)c=a[d],c instanceof OpenLayers.Layer.UTFGrid&&b.push(c);return b},CLASS_NAME:"OpenLayers.Control.UTFGrid"});OpenLayers.Format.CQL=function(){function a(a){function b(){var a=e.pop();switch(a.type){case "LOGICAL":var c=b(),g=b();return new OpenLayers.Filter.Logical({filters:[g,c],type:f[a.text.toUpperCase()]});case "NOT":return c=b(),new OpenLayers.Filter.Logical({filters:[c],type:OpenLayers.Filter.Logical.NOT});case "BETWEEN":return e.pop(),g=b(),a=b(),c=b(),new OpenLayers.Filter.Comparison({property:c,lowerBoundary:a,upperBoundary:g,type:OpenLayers.Filter.Comparison.BETWEEN});case "COMPARISON":return g=
b(),c=b(),new OpenLayers.Filter.Comparison({property:c,value:g,type:d[a.text.toUpperCase()]});case "VALUE":return/^'.*'$/.test(a.text)?a.text.substr(1,a.text.length-2):Number(a.text);case "SPATIAL":switch(a.text.toUpperCase()){case "BBOX":var c=b(),a=b(),g=b(),h=b(),i=b();return new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.BBOX,property:i,value:OpenLayers.Bounds.fromArray([h,g,a,c])});case "INTERSECTS":return g=b(),c=b(),new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.INTERSECTS,
property:c,value:g});case "WITHIN":return g=b(),c=b(),new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.WITHIN,property:c,value:g});case "CONTAINS":return g=b(),c=b(),new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.CONTAINS,property:c,value:g});case "DWITHIN":return a=b(),g=b(),c=b(),new OpenLayers.Filter.Spatial({type:OpenLayers.Filter.Spatial.DWITHIN,value:g,property:c,distance:Number(a)})}case "GEOMETRY":return OpenLayers.Geometry.fromWKT(a.text);default:return a.text}}
for(var c=[],e=[];a.length;){var g=a.shift();switch(g.type){case "PROPERTY":case "GEOMETRY":case "VALUE":e.push(g);break;case "COMPARISON":case "BETWEEN":case "LOGICAL":for(var i=h[g.type];0<c.length&&h[c[c.length-1].type]<=i;)e.push(c.pop());c.push(g);break;case "SPATIAL":case "NOT":case "LPAREN":c.push(g);break;case "RPAREN":for(;0<c.length&&"LPAREN"!=c[c.length-1].type;)e.push(c.pop());c.pop();0<c.length&&"SPATIAL"==c[c.length-1].type&&e.push(c.pop());case "COMMA":case "END":break;default:throw Error("Unknown token type "+
g.type);}}for(;0<c.length;)e.push(c.pop());a=b();if(0<e.length){a="Remaining tokens after building AST: \n";for(c=e.length-1;0<=c;c--)a+=e[c].type+": "+e[c].text+"\n";throw Error(a);}return a}var b={PROPERTY:/^[_a-zA-Z]\w*/,COMPARISON:/^(=|<>|<=|<|>=|>|LIKE)/i,COMMA:/^,/,LOGICAL:/^(AND|OR)/i,VALUE:/^('\w+'|\d+(\.\d*)?|\.\d+)/,LPAREN:/^\(/,RPAREN:/^\)/,SPATIAL:/^(BBOX|INTERSECTS|DWITHIN|WITHIN|CONTAINS)/i,NOT:/^NOT/i,BETWEEN:/^BETWEEN/i,GEOMETRY:function(a){var b=/^(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION)/.exec(a);
if(b){var c=a.length,b=a.indexOf("(",b[0].length);if(-1<b)for(var d=1;b<c&&0<d;)switch(b++,a.charAt(b)){case "(":d++;break;case ")":d--}return[a.substr(0,b+1)]}},END:/^$/},c={LPAREN:["GEOMETRY","SPATIAL","PROPERTY","VALUE","LPAREN"],RPAREN:["NOT","LOGICAL","END","RPAREN"],PROPERTY:["COMPARISON","BETWEEN","COMMA"],BETWEEN:["VALUE"],COMPARISON:["VALUE"],COMMA:["GEOMETRY","VALUE","PROPERTY"],VALUE:["LOGICAL","COMMA","RPAREN","END"],SPATIAL:["LPAREN"],LOGICAL:["NOT","VALUE","SPATIAL","PROPERTY","LPAREN"],
NOT:["PROPERTY","LPAREN"],GEOMETRY:["COMMA","RPAREN"]},d={"=":OpenLayers.Filter.Comparison.EQUAL_TO,"<>":OpenLayers.Filter.Comparison.NOT_EQUAL_TO,"<":OpenLayers.Filter.Comparison.LESS_THAN,"<=":OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,">":OpenLayers.Filter.Comparison.GREATER_THAN,">=":OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,LIKE:OpenLayers.Filter.Comparison.LIKE,BETWEEN:OpenLayers.Filter.Comparison.BETWEEN},e={},f={AND:OpenLayers.Filter.Logical.AND,OR:OpenLayers.Filter.Logical.OR},
g={},h={RPAREN:3,LOGICAL:2,COMPARISON:1},i;for(i in d)d.hasOwnProperty(i)&&(e[d[i]]=i);for(i in f)f.hasOwnProperty(i)&&(g[f[i]]=i);return OpenLayers.Class(OpenLayers.Format,{read:function(d){var e=d,d=[],f,g=["NOT","GEOMETRY","SPATIAL","PROPERTY","LPAREN"];do{a:{f=g;for(var h=void 0,g=void 0,i=f.length,h=0;h<i;h++){var g=f[h],p=b[g]instanceof RegExp?b[g].exec(e):(0,b[g])(e);if(p){f=p[0];e=e.substr(f.length).replace(/^\s*/,"");f={type:g,text:f,remainder:e};break a}}d="ERROR: In parsing: ["+e+"], expected one of: ";
for(h=0;h<i;h++)g=f[h],d+="\n    "+g+": "+b[g];throw Error(d);}e=f.remainder;g=c[f.type];if("END"!=f.type&&!g)throw Error("No follows list for "+f.type);d.push(f)}while("END"!=f.type);d=a(d);this.keepData&&(this.data=d);return d},write:function(a){if(a instanceof OpenLayers.Geometry)return a.toString();switch(a.CLASS_NAME){case "OpenLayers.Filter.Spatial":switch(a.type){case OpenLayers.Filter.Spatial.BBOX:return"BBOX("+a.property+","+a.value.toBBOX()+")";case OpenLayers.Filter.Spatial.DWITHIN:return"DWITHIN("+
a.property+", "+this.write(a.value)+", "+a.distance+")";case OpenLayers.Filter.Spatial.WITHIN:return"WITHIN("+a.property+", "+this.write(a.value)+")";case OpenLayers.Filter.Spatial.INTERSECTS:return"INTERSECTS("+a.property+", "+this.write(a.value)+")";case OpenLayers.Filter.Spatial.CONTAINS:return"CONTAINS("+a.property+", "+this.write(a.value)+")";default:throw Error("Unknown spatial filter type: "+a.type);}case "OpenLayers.Filter.Logical":if(a.type==OpenLayers.Filter.Logical.NOT)return"NOT ("+this.write(a.filters[0])+
")";for(var b="(",c=!0,d=0;d<a.filters.length;d++)c?c=!1:b+=") "+g[a.type]+" (",b+=this.write(a.filters[d]);return b+")";case "OpenLayers.Filter.Comparison":return a.type==OpenLayers.Filter.Comparison.BETWEEN?a.property+" BETWEEN "+this.write(a.lowerBoundary)+" AND "+this.write(a.upperBoundary):a.property+" "+e[a.type]+" "+this.write(a.value);case void 0:if("string"===typeof a)return"'"+a+"'";if("number"===typeof a)return""+a;default:throw Error("Can't encode: "+a.CLASS_NAME+" "+a);}},CLASS_NAME:"OpenLayers.Format.CQL"})}();OpenLayers.Control.Split=OpenLayers.Class(OpenLayers.Control,{layer:null,source:null,sourceOptions:null,tolerance:null,edge:!0,deferDelete:!1,mutual:!0,targetFilter:null,sourceFilter:null,handler:null,initialize:function(a){OpenLayers.Control.prototype.initialize.apply(this,[a]);this.options=a||{};this.options.source&&this.setSource(this.options.source)},setSource:function(a){this.active?(this.deactivate(),this.handler&&(this.handler.destroy(),delete this.handler),this.source=a,this.activate()):this.source=
a},activate:function(){var a=OpenLayers.Control.prototype.activate.call(this);if(a)if(this.source){if(this.source.events)this.source.events.on({sketchcomplete:this.onSketchComplete,afterfeaturemodified:this.afterFeatureModified,scope:this})}else this.handler||(this.handler=new OpenLayers.Handler.Path(this,{done:function(a){this.onSketchComplete({feature:new OpenLayers.Feature.Vector(a)})}},{layerOptions:this.sourceOptions})),this.handler.activate();return a},deactivate:function(){var a=OpenLayers.Control.prototype.deactivate.call(this);
a&&this.source&&this.source.events&&this.layer.events.un({sketchcomplete:this.onSketchComplete,afterfeaturemodified:this.afterFeatureModified,scope:this});return a},onSketchComplete:function(a){this.feature=null;return!this.considerSplit(a.feature)},afterFeatureModified:function(a){a.modified&&"function"===typeof a.feature.geometry.split&&(this.feature=a.feature,this.considerSplit(a.feature))},removeByGeometry:function(a,b){for(var c=0,d=a.length;c<d;++c)if(a[c].geometry===b){a.splice(c,1);break}},
isEligible:function(a){return a.geometry?a.state!==OpenLayers.State.DELETE&&"function"===typeof a.geometry.split&&this.feature!==a&&(!this.targetFilter||this.targetFilter.evaluate(a.attributes)):!1},considerSplit:function(a){var b=!1,c=!1;if(!this.sourceFilter||this.sourceFilter.evaluate(a.attributes)){for(var d=this.layer&&this.layer.features||[],e,f,g=[],h=[],i=this.layer===this.source&&this.mutual,j={edge:this.edge,tolerance:this.tolerance,mutual:i},k=[a.geometry],l,m,n,o=0,p=d.length;o<p;++o)if(l=
d[o],this.isEligible(l)){m=[l.geometry];for(var q=0;q<k.length;++q){n=k[q];for(var r=0;r<m.length;++r)if(e=m[r],n.getBounds().intersectsBounds(e.getBounds())&&(e=n.split(e,j)))if(f=this.events.triggerEvent("beforesplit",{source:a,target:l}),!1!==f&&(i&&(f=e[0],1<f.length&&(f.unshift(q,1),Array.prototype.splice.apply(k,f),q+=f.length-3),e=e[1]),1<e.length))e.unshift(r,1),Array.prototype.splice.apply(m,e),r+=e.length-3}m&&1<m.length&&(this.geomsToFeatures(l,m),this.events.triggerEvent("split",{original:l,
features:m}),Array.prototype.push.apply(g,m),h.push(l),c=!0)}k&&1<k.length&&(this.geomsToFeatures(a,k),this.events.triggerEvent("split",{original:a,features:k}),Array.prototype.push.apply(g,k),h.push(a),b=!0);if(b||c){if(this.deferDelete){d=[];o=0;for(p=h.length;o<p;++o)c=h[o],c.state===OpenLayers.State.INSERT?d.push(c):(c.state=OpenLayers.State.DELETE,this.layer.drawFeature(c));this.layer.destroyFeatures(d,{silent:!0});o=0;for(p=g.length;o<p;++o)g[o].state=OpenLayers.State.INSERT}else this.layer.destroyFeatures(h,
{silent:!0});this.layer.addFeatures(g,{silent:!0});this.events.triggerEvent("aftersplit",{source:a,features:g})}}return b},geomsToFeatures:function(a,b){var c=a.clone();delete c.geometry;for(var d,e=0,f=b.length;e<f;++e)d=c.clone(),d.geometry=b[e],d.state=OpenLayers.State.INSERT,b[e]=d},destroy:function(){this.active&&this.deactivate();OpenLayers.Control.prototype.destroy.call(this)},CLASS_NAME:"OpenLayers.Control.Split"});OpenLayers.Layer.WMTS=OpenLayers.Class(OpenLayers.Layer.Grid,{isBaseLayer:!0,version:"1.0.0",requestEncoding:"KVP",url:null,layer:null,matrixSet:null,style:null,format:"image/jpeg",tileOrigin:null,tileFullExtent:null,formatSuffix:null,matrixIds:null,dimensions:null,params:null,zoomOffset:0,serverResolutions:null,formatSuffixMap:{"image/png":"png","image/png8":"png","image/png24":"png","image/png32":"png",png:"png","image/jpeg":"jpg","image/jpg":"jpg",jpeg:"jpg",jpg:"jpg"},matrix:null,initialize:function(a){var b=
{url:!0,layer:!0,style:!0,matrixSet:!0},c;for(c in b)if(!(c in a))throw Error("Missing property '"+c+"' in layer configuration.");a.params=OpenLayers.Util.upperCaseObject(a.params);OpenLayers.Layer.Grid.prototype.initialize.apply(this,[a.name,a.url,a.params,a]);this.formatSuffix||(this.formatSuffix=this.formatSuffixMap[this.format]||this.format.split("/").pop());if(this.matrixIds&&(a=this.matrixIds.length)&&"string"===typeof this.matrixIds[0]){b=this.matrixIds;this.matrixIds=Array(a);for(c=0;c<a;++c)this.matrixIds[c]=
{identifier:b[c]}}},setMap:function(){OpenLayers.Layer.Grid.prototype.setMap.apply(this,arguments);this.updateMatrixProperties()},updateMatrixProperties:function(){if(this.matrix=this.getMatrix())if(this.matrix.topLeftCorner&&(this.tileOrigin=this.matrix.topLeftCorner),this.matrix.tileWidth&&this.matrix.tileHeight&&(this.tileSize=new OpenLayers.Size(this.matrix.tileWidth,this.matrix.tileHeight)),this.tileOrigin||(this.tileOrigin=new OpenLayers.LonLat(this.maxExtent.left,this.maxExtent.top)),!this.tileFullExtent)this.tileFullExtent=
this.maxExtent},moveTo:function(a,b,c){(b||!this.matrix)&&this.updateMatrixProperties();return OpenLayers.Layer.Grid.prototype.moveTo.apply(this,arguments)},clone:function(a){null==a&&(a=new OpenLayers.Layer.WMTS(this.options));return a=OpenLayers.Layer.Grid.prototype.clone.apply(this,[a])},getIdentifier:function(){return this.getServerZoom()},getMatrix:function(){var a;if(!this.matrixIds||0===this.matrixIds.length)a={identifier:this.getIdentifier()};else if("scaleDenominator"in this.matrixIds[0])for(var b=
OpenLayers.METERS_PER_INCH*OpenLayers.INCHES_PER_UNIT[this.units]*this.getServerResolution()/2.8E-4,c=Number.POSITIVE_INFINITY,d,e=0,f=this.matrixIds.length;e<f;++e)d=Math.abs(1-this.matrixIds[e].scaleDenominator/b),d<c&&(c=d,a=this.matrixIds[e]);else a=this.matrixIds[this.getIdentifier()];return a},getTileInfo:function(a){var b=this.getServerResolution(),c=(a.lon-this.tileOrigin.lon)/(b*this.tileSize.w),a=(this.tileOrigin.lat-a.lat)/(b*this.tileSize.h),b=Math.floor(c),d=Math.floor(a);return{col:b,
row:d,i:Math.floor((c-b)*this.tileSize.w),j:Math.floor((a-d)*this.tileSize.h)}},getURL:function(a){var a=this.adjustBounds(a),b="";if(!this.tileFullExtent||this.tileFullExtent.intersectsBounds(a)){var c=this.getTileInfo(a.getCenterLonLat()),a=this.dimensions;if("REST"===this.requestEncoding.toUpperCase())if(b=this.params,"string"===typeof this.url&&-1!==this.url.indexOf("{")){var d=this.url.replace(/\{/g,"${"),c={style:this.style,Style:this.style,TileMatrixSet:this.matrixSet,TileMatrix:this.matrix.identifier,
TileRow:c.row,TileCol:c.col};if(a){var e,f;for(f=a.length-1;0<=f;--f)e=a[f],c[e]=b[e.toUpperCase()]}b=OpenLayers.String.format(d,c)}else{d=this.version+"/"+this.layer+"/"+this.style+"/";if(a)for(f=0;f<a.length;f++)b[a[f]]&&(d=d+b[a[f]]+"/");d=d+this.matrixSet+"/"+this.matrix.identifier+"/"+c.row+"/"+c.col+"."+this.formatSuffix;b=OpenLayers.Util.isArray(this.url)?this.selectUrl(d,this.url):this.url;b.match(/\/$/)||(b+="/");b+=d}else"KVP"===this.requestEncoding.toUpperCase()&&(b={SERVICE:"WMTS",REQUEST:"GetTile",
VERSION:this.version,LAYER:this.layer,STYLE:this.style,TILEMATRIXSET:this.matrixSet,TILEMATRIX:this.matrix.identifier,TILEROW:c.row,TILECOL:c.col,FORMAT:this.format},b=OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this,[b]))}return b},mergeNewParams:function(a){if("KVP"===this.requestEncoding.toUpperCase())return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this,[OpenLayers.Util.upperCaseObject(a)])},CLASS_NAME:"OpenLayers.Layer.WMTS"});OpenLayers.Protocol.SOS.v1_0_0=OpenLayers.Class(OpenLayers.Protocol,{fois:null,formatOptions:null,initialize:function(a){OpenLayers.Protocol.prototype.initialize.apply(this,[a]);a.format||(this.format=new OpenLayers.Format.SOSGetFeatureOfInterest(this.formatOptions))},destroy:function(){this.options&&!this.options.format&&this.format.destroy();this.format=null;OpenLayers.Protocol.prototype.destroy.apply(this)},read:function(a){a=OpenLayers.Util.extend({},a);OpenLayers.Util.applyDefaults(a,this.options||
{});var b=new OpenLayers.Protocol.Response({requestType:"read"}),c=this.format,c=OpenLayers.Format.XML.prototype.write.apply(c,[c.writeNode("sos:GetFeatureOfInterest",{fois:this.fois})]);b.priv=OpenLayers.Request.POST({url:a.url,callback:this.createCallback(this.handleRead,b,a),data:c});return b},handleRead:function(a,b){if(b.callback){var c=a.priv;200<=c.status&&300>c.status?(a.features=this.parseFeatures(c),a.code=OpenLayers.Protocol.Response.SUCCESS):a.code=OpenLayers.Protocol.Response.FAILURE;
b.callback.call(b.scope,a)}},parseFeatures:function(a){var b=a.responseXML;if(!b||!b.documentElement)b=a.responseText;return!b||0>=b.length?null:this.format.read(b)},CLASS_NAME:"OpenLayers.Protocol.SOS.v1_0_0"});OpenLayers.Layer.KaMapCache=OpenLayers.Class(OpenLayers.Layer.KaMap,{IMAGE_EXTENSIONS:{jpeg:"jpg",gif:"gif",png:"png",png8:"png",png24:"png",dithered:"png"},DEFAULT_FORMAT:"jpeg",initialize:function(a,b,c,d){OpenLayers.Layer.KaMap.prototype.initialize.apply(this,arguments);this.extension=this.IMAGE_EXTENSIONS[this.params.i.toLowerCase()||this.DEFAULT_FORMAT]},getURL:function(a){var a=this.adjustBounds(a),b=this.map.getResolution(),c=Math.round(1E4*this.map.getScale())/1E4,d=Math.round(a.left/b),a=
-Math.round(a.top/b),b=Math.floor(d/this.tileSize.w/this.params.metaTileSize.w)*this.tileSize.w*this.params.metaTileSize.w,e=Math.floor(a/this.tileSize.h/this.params.metaTileSize.h)*this.tileSize.h*this.params.metaTileSize.h,c=["/",this.params.map,"/",c,"/",this.params.g.replace(/\s/g,"_"),"/def/t",e,"/l",b,"/t",a,"l",d,".",this.extension],d=this.url;OpenLayers.Util.isArray(d)&&(d=this.selectUrl(c.join(""),d));return d+c.join("")},CLASS_NAME:"OpenLayers.Layer.KaMapCache"});OpenLayers.Protocol.WFS.v1_1_0=OpenLayers.Class(OpenLayers.Protocol.WFS.v1,{version:"1.1.0",initialize:function(a){OpenLayers.Protocol.WFS.v1.prototype.initialize.apply(this,arguments);this.outputFormat&&!this.readFormat&&("gml2"==this.outputFormat.toLowerCase()?this.readFormat=new OpenLayers.Format.GML.v2({featureType:this.featureType,featureNS:this.featureNS,geometryName:this.geometryName}):"json"==this.outputFormat.toLowerCase()&&(this.readFormat=new OpenLayers.Format.GeoJSON))},CLASS_NAME:"OpenLayers.Protocol.WFS.v1_1_0"});OpenLayers.Format.WMSCapabilities.v1_1_1=OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_1,{version:"1.1.1",readers:{wms:OpenLayers.Util.applyDefaults({SRS:function(a,b){b.srs[this.getChildValue(a)]=!0}},OpenLayers.Format.WMSCapabilities.v1_1.prototype.readers.wms)},CLASS_NAME:"OpenLayers.Format.WMSCapabilities.v1_1_1"});OpenLayers.Format.WMSCapabilities.v1_1_1_WMSC=OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_1_1,{version:"1.1.1",profile:"WMSC",readers:{wms:OpenLayers.Util.applyDefaults({VendorSpecificCapabilities:function(a,b){b.vendorSpecific={tileSets:[]};this.readChildNodes(a,b.vendorSpecific)},TileSet:function(a,b){var c={srs:{},bbox:{},resolutions:[]};this.readChildNodes(a,c);b.tileSets.push(c)},Resolutions:function(a,b){for(var c=this.getChildValue(a).split(" "),d=0,e=c.length;d<e;d++)""!=c[d]&&b.resolutions.push(parseFloat(c[d]))},
Width:function(a,b){b.width=parseInt(this.getChildValue(a))},Height:function(a,b){b.height=parseInt(this.getChildValue(a))},Layers:function(a,b){b.layers=this.getChildValue(a)},Styles:function(a,b){b.styles=this.getChildValue(a)}},OpenLayers.Format.WMSCapabilities.v1_1_1.prototype.readers.wms)},CLASS_NAME:"OpenLayers.Format.WMSCapabilities.v1_1_1_WMSC"});OpenLayers.Format.WMSCapabilities.v1_1_0=OpenLayers.Class(OpenLayers.Format.WMSCapabilities.v1_1,{version:"1.1.0",readers:{wms:OpenLayers.Util.applyDefaults({SRS:function(a,b){for(var c=this.getChildValue(a).split(/ +/),d=0,e=c.length;d<e;d++)b.srs[c[d]]=!0}},OpenLayers.Format.WMSCapabilities.v1_1.prototype.readers.wms)},CLASS_NAME:"OpenLayers.Format.WMSCapabilities.v1_1_0"});OpenLayers.Control.LayerSwitcher=OpenLayers.Class(OpenLayers.Control,{roundedCorner:!1,roundedCornerColor:"darkblue",layerStates:null,layersDiv:null,baseLayersDiv:null,baseLayers:null,dataLbl:null,dataLayersDiv:null,dataLayers:null,minimizeDiv:null,maximizeDiv:null,ascending:!0,initialize:function(a){OpenLayers.Control.prototype.initialize.apply(this,arguments);this.layerStates=[];this.roundedCorner&&OpenLayers.Console.warn("roundedCorner option is deprecated")},destroy:function(){this.clearLayersArray("base");
this.clearLayersArray("data");this.map.events.un({buttonclick:this.onButtonClick,addlayer:this.redraw,changelayer:this.redraw,removelayer:this.redraw,changebaselayer:this.redraw,scope:this});this.events.unregister("buttonclick",this,this.onButtonClick);OpenLayers.Control.prototype.destroy.apply(this,arguments)},setMap:function(a){OpenLayers.Control.prototype.setMap.apply(this,arguments);this.map.events.on({addlayer:this.redraw,changelayer:this.redraw,removelayer:this.redraw,changebaselayer:this.redraw,
scope:this});this.outsideViewport?(this.events.attachToElement(this.div),this.events.register("buttonclick",this,this.onButtonClick)):this.map.events.register("buttonclick",this,this.onButtonClick)},draw:function(){OpenLayers.Control.prototype.draw.apply(this);this.loadContents();this.outsideViewport||this.minimizeControl();this.redraw();return this.div},onButtonClick:function(a){a=a.buttonElement;a===this.minimizeDiv?this.minimizeControl():a===this.maximizeDiv?this.maximizeControl():a._layerSwitcher===
this.id&&(a["for"]&&(a=document.getElementById(a["for"])),a.disabled||("radio"==a.type?(a.checked=!0,this.map.setBaseLayer(this.map.getLayer(a._layer))):(a.checked=!a.checked,this.updateMap())))},clearLayersArray:function(a){this[a+"LayersDiv"].innerHTML="";this[a+"Layers"]=[]},checkRedraw:function(){var a=!1;if(!this.layerStates.length||this.map.layers.length!=this.layerStates.length)a=!0;else for(var b=0,c=this.layerStates.length;b<c;b++){var d=this.layerStates[b],e=this.map.layers[b];if(d.name!=
e.name||d.inRange!=e.inRange||d.id!=e.id||d.visibility!=e.visibility){a=!0;break}}return a},redraw:function(){if(!this.checkRedraw())return this.div;this.clearLayersArray("base");this.clearLayersArray("data");var a=!1,b=!1,c=this.map.layers.length;this.layerStates=Array(c);for(var d=0;d<c;d++){var e=this.map.layers[d];this.layerStates[d]={name:e.name,visibility:e.visibility,inRange:e.inRange,id:e.id}}var f=this.map.layers.slice();this.ascending||f.reverse();d=0;for(c=f.length;d<c;d++){var e=f[d],
g=e.isBaseLayer;if(e.displayInLayerSwitcher){g?b=!0:a=!0;var h=g?e==this.map.baseLayer:e.getVisibility(),i=document.createElement("input");i.id=this.id+"_input_"+e.name;i.name=g?this.id+"_baseLayers":e.name;i.type=g?"radio":"checkbox";i.value=e.name;i.checked=h;i.defaultChecked=h;i.className="olButton";i._layer=e.id;i._layerSwitcher=this.id;!g&&!e.inRange&&(i.disabled=!0);h=document.createElement("label");h["for"]=i.id;OpenLayers.Element.addClass(h,"labelSpan olButton");h._layer=e.id;h._layerSwitcher=
this.id;!g&&!e.inRange&&(h.style.color="gray");h.innerHTML=e.name;h.style.verticalAlign=g?"bottom":"baseline";var j=document.createElement("br");(g?this.baseLayers:this.dataLayers).push({layer:e,inputElem:i,labelSpan:h});e=g?this.baseLayersDiv:this.dataLayersDiv;e.appendChild(i);e.appendChild(h);e.appendChild(j)}}this.dataLbl.style.display=a?"":"none";this.baseLbl.style.display=b?"":"none";return this.div},updateMap:function(){for(var a=0,b=this.baseLayers.length;a<b;a++){var c=this.baseLayers[a];
c.inputElem.checked&&this.map.setBaseLayer(c.layer,!1)}a=0;for(b=this.dataLayers.length;a<b;a++)c=this.dataLayers[a],c.layer.setVisibility(c.inputElem.checked)},maximizeControl:function(a){this.div.style.width="";this.div.style.height="";this.showControls(!1);null!=a&&OpenLayers.Event.stop(a)},minimizeControl:function(a){this.div.style.width="0px";this.div.style.height="0px";this.showControls(!0);null!=a&&OpenLayers.Event.stop(a)},showControls:function(a){this.maximizeDiv.style.display=a?"":"none";
this.minimizeDiv.style.display=a?"none":"";this.layersDiv.style.display=a?"none":""},loadContents:function(){this.layersDiv=document.createElement("div");this.layersDiv.id=this.id+"_layersDiv";OpenLayers.Element.addClass(this.layersDiv,"layersDiv");this.baseLbl=document.createElement("div");this.baseLbl.innerHTML=OpenLayers.i18n("Base Layer");OpenLayers.Element.addClass(this.baseLbl,"baseLbl");this.baseLayersDiv=document.createElement("div");OpenLayers.Element.addClass(this.baseLayersDiv,"baseLayersDiv");
this.dataLbl=document.createElement("div");this.dataLbl.innerHTML=OpenLayers.i18n("Overlays");OpenLayers.Element.addClass(this.dataLbl,"dataLbl");this.dataLayersDiv=document.createElement("div");OpenLayers.Element.addClass(this.dataLayersDiv,"dataLayersDiv");this.ascending?(this.layersDiv.appendChild(this.baseLbl),this.layersDiv.appendChild(this.baseLayersDiv),this.layersDiv.appendChild(this.dataLbl),this.layersDiv.appendChild(this.dataLayersDiv)):(this.layersDiv.appendChild(this.dataLbl),this.layersDiv.appendChild(this.dataLayersDiv),
this.layersDiv.appendChild(this.baseLbl),this.layersDiv.appendChild(this.baseLayersDiv));this.div.appendChild(this.layersDiv);this.roundedCorner&&(OpenLayers.Rico.Corner.round(this.div,{corners:"tl bl",bgColor:"transparent",color:this.roundedCornerColor,blend:!1}),OpenLayers.Rico.Corner.changeOpacity(this.layersDiv,0.75));var a=OpenLayers.Util.getImageLocation("layer-switcher-maximize.png");this.maximizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv",null,null,a,"absolute");
OpenLayers.Element.addClass(this.maximizeDiv,"maximizeDiv olButton");this.maximizeDiv.style.display="none";this.div.appendChild(this.maximizeDiv);a=OpenLayers.Util.getImageLocation("layer-switcher-minimize.png");this.minimizeDiv=OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MinimizeDiv",null,null,a,"absolute");OpenLayers.Element.addClass(this.minimizeDiv,"minimizeDiv olButton");this.minimizeDiv.style.display="none";this.div.appendChild(this.minimizeDiv)},CLASS_NAME:"OpenLayers.Control.LayerSwitcher"});OpenLayers.Format.Atom=OpenLayers.Class(OpenLayers.Format.XML,{namespaces:{atom:"http://www.w3.org/2005/Atom",georss:"http://www.georss.org/georss"},feedTitle:"untitled",defaultEntryTitle:"untitled",gmlParser:null,xy:!1,read:function(a){"string"==typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));return this.parseFeatures(a)},write:function(a){var b;if(OpenLayers.Util.isArray(a)){b=this.createElementNSPlus("atom:feed");b.appendChild(this.createElementNSPlus("atom:title",{value:this.feedTitle}));
for(var c=0,d=a.length;c<d;c++)b.appendChild(this.buildEntryNode(a[c]))}else b=this.buildEntryNode(a);return OpenLayers.Format.XML.prototype.write.apply(this,[b])},buildContentNode:function(a){var b=this.createElementNSPlus("atom:content",{attributes:{type:a.type||null}});if(a.src)b.setAttribute("src",a.src);else if("text"==a.type||null==a.type)b.appendChild(this.createTextNode(a.value));else if("html"==a.type){if("string"!=typeof a.value)throw"HTML content must be in form of an escaped string";b.appendChild(this.createTextNode(a.value))}else"xhtml"==
a.type?b.appendChild(a.value):"xhtml"==a.type||a.type.match(/(\+|\/)xml$/)?b.appendChild(a.value):b.appendChild(this.createTextNode(a.value));return b},buildEntryNode:function(a){var b=a.attributes,c=b.atom||{},d=this.createElementNSPlus("atom:entry");if(c.authors)for(var e=OpenLayers.Util.isArray(c.authors)?c.authors:[c.authors],f=0,g=e.length;f<g;f++)d.appendChild(this.buildPersonConstructNode("author",e[f]));if(c.categories)for(var e=OpenLayers.Util.isArray(c.categories)?c.categories:[c.categories],
h,f=0,g=e.length;f<g;f++)h=e[f],d.appendChild(this.createElementNSPlus("atom:category",{attributes:{term:h.term,scheme:h.scheme||null,label:h.label||null}}));c.content&&d.appendChild(this.buildContentNode(c.content));if(c.contributors){e=OpenLayers.Util.isArray(c.contributors)?c.contributors:[c.contributors];f=0;for(g=e.length;f<g;f++)d.appendChild(this.buildPersonConstructNode("contributor",e[f]))}a.fid&&d.appendChild(this.createElementNSPlus("atom:id",{value:a.fid}));if(c.links){e=OpenLayers.Util.isArray(c.links)?
c.links:[c.links];f=0;for(g=e.length;f<g;f++)h=e[f],d.appendChild(this.createElementNSPlus("atom:link",{attributes:{href:h.href,rel:h.rel||null,type:h.type||null,hreflang:h.hreflang||null,title:h.title||null,length:h.length||null}}))}c.published&&d.appendChild(this.createElementNSPlus("atom:published",{value:c.published}));c.rights&&d.appendChild(this.createElementNSPlus("atom:rights",{value:c.rights}));if(c.summary||b.description)d.appendChild(this.createElementNSPlus("atom:summary",{value:c.summary||
b.description}));d.appendChild(this.createElementNSPlus("atom:title",{value:c.title||b.title||this.defaultEntryTitle}));c.updated&&d.appendChild(this.createElementNSPlus("atom:updated",{value:c.updated}));a.geometry&&(b=this.createElementNSPlus("georss:where"),b.appendChild(this.buildGeometryNode(a.geometry)),d.appendChild(b));return d},initGmlParser:function(){this.gmlParser=new OpenLayers.Format.GML.v3({xy:this.xy,featureNS:"http://example.com#feature",internalProjection:this.internalProjection,
externalProjection:this.externalProjection})},buildGeometryNode:function(a){this.gmlParser||this.initGmlParser();return this.gmlParser.writeNode("feature:_geometry",a).firstChild},buildPersonConstructNode:function(a,b){var c=["uri","email"],d=this.createElementNSPlus("atom:"+a);d.appendChild(this.createElementNSPlus("atom:name",{value:b.name}));for(var e=0,f=c.length;e<f;e++)b[c[e]]&&d.appendChild(this.createElementNSPlus("atom:"+c[e],{value:b[c[e]]}));return d},getFirstChildValue:function(a,b,c,
d){return(a=this.getElementsByTagNameNS(a,b,c))&&0<a.length?this.getChildValue(a[0],d):d},parseFeature:function(a){var b={},c=null,d=null,e=null,f=this.namespaces.atom;this.parsePersonConstructs(a,"author",b);d=this.getElementsByTagNameNS(a,f,"category");0<d.length&&(b.categories=[]);for(var g=0,h=d.length;g<h;g++){c={};c.term=d[g].getAttribute("term");if(e=d[g].getAttribute("scheme"))c.scheme=e;if(e=d[g].getAttribute("label"))c.label=e;b.categories.push(c)}d=this.getElementsByTagNameNS(a,f,"content");
if(0<d.length){c={};if(e=d[0].getAttribute("type"))c.type=e;(e=d[0].getAttribute("src"))?c.src=e:(c.value="text"==c.type||"html"==c.type||null==c.type?this.getFirstChildValue(a,f,"content",null):"xhtml"==c.type||c.type.match(/(\+|\/)xml$/)?this.getChildEl(d[0]):this.getFirstChildValue(a,f,"content",null),b.content=c)}this.parsePersonConstructs(a,"contributor",b);b.id=this.getFirstChildValue(a,f,"id",null);d=this.getElementsByTagNameNS(a,f,"link");0<d.length&&(b.links=Array(d.length));for(var i=["rel",
"type","hreflang","title","length"],g=0,h=d.length;g<h;g++){c={};c.href=d[g].getAttribute("href");for(var j=0,k=i.length;j<k;j++)(e=d[g].getAttribute(i[j]))&&(c[i[j]]=e);b.links[g]=c}if(c=this.getFirstChildValue(a,f,"published",null))b.published=c;if(c=this.getFirstChildValue(a,f,"rights",null))b.rights=c;if(c=this.getFirstChildValue(a,f,"summary",null))b.summary=c;b.title=this.getFirstChildValue(a,f,"title",null);b.updated=this.getFirstChildValue(a,f,"updated",null);c={title:b.title,description:b.summary,
atom:b};a=this.parseLocations(a)[0];a=new OpenLayers.Feature.Vector(a,c);a.fid=b.id;return a},parseFeatures:function(a){var b=[],c=this.getElementsByTagNameNS(a,this.namespaces.atom,"entry");0==c.length&&(c=[a]);for(var a=0,d=c.length;a<d;a++)b.push(this.parseFeature(c[a]));return b},parseLocations:function(a){var b=this.namespaces.georss,c={components:[]},d=this.getElementsByTagNameNS(a,b,"where");if(d&&0<d.length){this.gmlParser||this.initGmlParser();for(var e=0,f=d.length;e<f;e++)this.gmlParser.readChildNodes(d[e],
c)}c=c.components;if((d=this.getElementsByTagNameNS(a,b,"point"))&&0<d.length){e=0;for(f=d.length;e<f;e++){var g=OpenLayers.String.trim(d[e].firstChild.nodeValue).split(/\s+/);2!=g.length&&(g=OpenLayers.String.trim(d[e].firstChild.nodeValue).split(/\s*,\s*/));c.push(new OpenLayers.Geometry.Point(g[1],g[0]))}}var h=this.getElementsByTagNameNS(a,b,"line");if(h&&0<h.length)for(var i,e=0,f=h.length;e<f;e++){d=OpenLayers.String.trim(h[e].firstChild.nodeValue).split(/\s+/);i=[];for(var j=0,k=d.length;j<
k;j+=2)g=new OpenLayers.Geometry.Point(d[j+1],d[j]),i.push(g);c.push(new OpenLayers.Geometry.LineString(i))}if((a=this.getElementsByTagNameNS(a,b,"polygon"))&&0<a.length){e=0;for(f=a.length;e<f;e++){d=OpenLayers.String.trim(a[e].firstChild.nodeValue).split(/\s+/);i=[];j=0;for(k=d.length;j<k;j+=2)g=new OpenLayers.Geometry.Point(d[j+1],d[j]),i.push(g);c.push(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(c)]))}}if(this.internalProjection&&this.externalProjection){e=0;for(f=c.length;e<
f;e++)c[e]&&c[e].transform(this.externalProjection,this.internalProjection)}return c},parsePersonConstructs:function(a,b,c){for(var d=[],e=this.namespaces.atom,a=this.getElementsByTagNameNS(a,e,b),f=["uri","email"],g=0,h=a.length;g<h;g++){var i={};i.name=this.getFirstChildValue(a[g],e,"name",null);for(var j=0,k=f.length;j<k;j++){var l=this.getFirstChildValue(a[g],e,f[j],null);l&&(i[f[j]]=l)}d.push(i)}0<d.length&&(c[b+"s"]=d)},CLASS_NAME:"OpenLayers.Format.Atom"});OpenLayers.Control.KeyboardDefaults=OpenLayers.Class(OpenLayers.Control,{autoActivate:!0,slideFactor:75,observeElement:null,draw:function(){this.handler=new OpenLayers.Handler.Keyboard(this,{keydown:this.defaultKeyPress},{observeElement:this.observeElement||document})},defaultKeyPress:function(a){var b,c=!0;switch(a.keyCode){case OpenLayers.Event.KEY_LEFT:this.map.pan(-this.slideFactor,0);break;case OpenLayers.Event.KEY_RIGHT:this.map.pan(this.slideFactor,0);break;case OpenLayers.Event.KEY_UP:this.map.pan(0,
-this.slideFactor);break;case OpenLayers.Event.KEY_DOWN:this.map.pan(0,this.slideFactor);break;case 33:b=this.map.getSize();this.map.pan(0,-0.75*b.h);break;case 34:b=this.map.getSize();this.map.pan(0,0.75*b.h);break;case 35:b=this.map.getSize();this.map.pan(0.75*b.w,0);break;case 36:b=this.map.getSize();this.map.pan(-0.75*b.w,0);break;case 43:case 61:case 187:case 107:this.map.zoomIn();break;case 45:case 109:case 189:case 95:this.map.zoomOut();break;default:c=!1}c&&OpenLayers.Event.stop(a)},CLASS_NAME:"OpenLayers.Control.KeyboardDefaults"});OpenLayers.Format.WMTSCapabilities.v1_0_0=OpenLayers.Class(OpenLayers.Format.OWSCommon.v1_1_0,{version:"1.0.0",namespaces:{ows:"http://www.opengis.net/ows/1.1",wmts:"http://www.opengis.net/wmts/1.0",xlink:"http://www.w3.org/1999/xlink"},yx:null,defaultPrefix:"wmts",initialize:function(a){OpenLayers.Format.XML.prototype.initialize.apply(this,[a]);this.options=a;a=OpenLayers.Util.extend({},OpenLayers.Format.WMTSCapabilities.prototype.yx);this.yx=OpenLayers.Util.extend(a,this.yx)},read:function(a){"string"==
typeof a&&(a=OpenLayers.Format.XML.prototype.read.apply(this,[a]));a&&9==a.nodeType&&(a=a.documentElement);var b={};this.readNode(a,b);b.version=this.version;return b},readers:{wmts:{Capabilities:function(a,b){this.readChildNodes(a,b)},Contents:function(a,b){b.contents={};b.contents.layers=[];b.contents.tileMatrixSets={};this.readChildNodes(a,b.contents)},Layer:function(a,b){var c={styles:[],formats:[],dimensions:[],tileMatrixSetLinks:[],layers:[]};this.readChildNodes(a,c);b.layers.push(c)},Style:function(a,
b){var c={};c.isDefault="true"===a.getAttribute("isDefault");this.readChildNodes(a,c);b.styles.push(c)},Format:function(a,b){b.formats.push(this.getChildValue(a))},TileMatrixSetLink:function(a,b){var c={};this.readChildNodes(a,c);b.tileMatrixSetLinks.push(c)},TileMatrixSet:function(a,b){if(b.layers){var c={matrixIds:[]};this.readChildNodes(a,c);b.tileMatrixSets[c.identifier]=c}else b.tileMatrixSet=this.getChildValue(a)},TileMatrix:function(a,b){var c={supportedCRS:b.supportedCRS};this.readChildNodes(a,
c);b.matrixIds.push(c)},ScaleDenominator:function(a,b){b.scaleDenominator=parseFloat(this.getChildValue(a))},TopLeftCorner:function(a,b){var c=this.getChildValue(a).split(" "),d;b.supportedCRS&&(d=!!this.yx[b.supportedCRS.replace(/urn:ogc:def:crs:(\w+):.+:(\w+)$/,"urn:ogc:def:crs:$1::$2")]);b.topLeftCorner=d?new OpenLayers.LonLat(c[1],c[0]):new OpenLayers.LonLat(c[0],c[1])},TileWidth:function(a,b){b.tileWidth=parseInt(this.getChildValue(a))},TileHeight:function(a,b){b.tileHeight=parseInt(this.getChildValue(a))},
MatrixWidth:function(a,b){b.matrixWidth=parseInt(this.getChildValue(a))},MatrixHeight:function(a,b){b.matrixHeight=parseInt(this.getChildValue(a))},ResourceURL:function(a,b){b.resourceUrl=b.resourceUrl||{};b.resourceUrl[a.getAttribute("resourceType")]={format:a.getAttribute("format"),template:a.getAttribute("template")}},WSDL:function(a,b){b.wsdl={};b.wsdl.href=a.getAttribute("xlink:href")},ServiceMetadataURL:function(a,b){b.serviceMetadataUrl={};b.serviceMetadataUrl.href=a.getAttribute("xlink:href")},
LegendURL:function(a,b){b.legend={};b.legend.href=a.getAttribute("xlink:href");b.legend.format=a.getAttribute("format")},Dimension:function(a,b){var c={values:[]};this.readChildNodes(a,c);b.dimensions.push(c)},Default:function(a,b){b["default"]=this.getChildValue(a)},Value:function(a,b){b.values.push(this.getChildValue(a))}},ows:OpenLayers.Format.OWSCommon.v1_1_0.prototype.readers.ows},CLASS_NAME:"OpenLayers.Format.WMTSCapabilities.v1_0_0"});
/*
* Tooltips.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * Tooltips JSON
 * GeoTemCo tooltips definition file
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
var Tooltips = {
	"en" : {
        "institution" : "Institution",
        "institutions" : "Institutions",
        "institutes" : "Institutes",
		"locationType" : "Location type",
		"selectLocationType" : "Select location type",
		"mapType" : "Background map",
		"selectMapType" : "Select background map",
		"selectOverlay" : "Select layer for spatial filtering",
		"overlays" : "Select layer",
		"mapSelectorTools" : "Map selector tools",
		"overlaySelector" : "Selection layer",
		"square" : "Square selection: Mouse down for the center and mouse move to set square bounds",
		"circle" : "Circle selection: Mouse down for the center and mouse move to set circle radius",
		"polygon" : "Polygon selection: Click to add vertex and double click to complete the polygon",
		"country" : "Country selection: Click inside the political borders of a country",
		"singleEntry" : "Only 1 entry available",
		"resultsLocation" : "with location information",
		"home" : "Reset map to initial view",
		"zoomIn" : "Zoom in",
		"zoomOut" : "Zoom out",
		"zoomSlider" : "Zoom slider",
		"dragSelection" : "Drag&Drop shape",
		"zoomSelection" : "Zoom into selection",
		"clearSelection" : "Clear selection",
		"contemporaryMap" : "Contemporary Map",
		"activateGeoLocation" : "Show my location",
		"deactivateGeoLocation" : "Hide my location",
		"mapOf" : "Map of",
		"close" : "Close",
		"genericBinning" : "delaunay",
		"squareBinning" : "square",
		"hexagonalBinning" : "hexagonal",
		"triangularBinning" : "triangular",
		"noBinning" : "none",
		"selectBinningType" : "Select aggregation type",
		"binningType" : "Aggregation type",
		"binningTooltip" : "Select the aggregation type for the data sources",
		"results" : "results",
		"result" : "result",
		"timeType" : "Time type",
		"timeUnit" : "Time unit:",
		"selectTimeType" : "Select time type",
		"timeAnimation" : "Animation",
		"resultsTime" : "with time information",
		"animationDisabled" : "Animation control (disabled)",
		"animationPlay" : "Animate selected time range",
		"animationPause" : "Pause animation",
		"leftHandle" : "Drag&Drop left border",
		"rightHandle" : "Drag&Drop right border",
		"dragTimeRange" : "Drag&Drop time range",
		"connectionsOn" : "Switch on time-dependent connections between map circles",
		"connectionsOff" : "Switch off time-dependent connections",
		"timeFeather" : "Adjust time range feather to smoothen map animations",
		"allResults" : "all",
		"pageInfo" : "Page PAGE_ID of PAGES_ID",
		"resultsInfo" : "RESULTS_FROM_ID-RESULTS_TO_ID of RESULTS_ID Results",
		"otherResults" : "others",
		"mapAggregation" : "Aggregation",
		"aggregation" : "Circle aggregation",
		"noAggregation" : "No circle aggregation",
		"showBoxTitle" : "Boundingbox",
		"showBbox" : "Shows given Boundingbox extension",
		"hideBbox" : "Hides given Boundingbox extension",
		"spaceHelp" : "A point on the map corresponds to one or more objects from the result list. ",
		"timeHelp" : "On the timeline are the search results sorted by year. You can choose different time-based categories as basis for the representation.",
		"selectTablePageItemsHelp" : "Click to select all rows of this page",
		"deselectTablePageItemsHelp" : "Click to deselect all rows of this page",
		"selectAllTableItemsHelp" : "Click to select all rows of the table",
		"deselectAllTableItemsHelp" : "Click to deselect all rows of the table",
		"filter" : "Filter",
		"filterSelectedItemsHelp" : "Filter the selected items",
		"inverseFilterSelectedItemsHelp" : "Apply an inverse filter on the selected items removing them from the views",
		"undoFilterSelection" : "Undo the last filter / inverse filter",
		"cancelSelection" : "Discard the current selection (all items appear as deselected)",
		"showSelectedHelp" : "Show only elements within the selection",
		"showAllElementsHelp" : "Show all elements",
		"paginationFirsPageHelp" : "Show first page",
		"paginationPreviousPageHelp" : "Show previous page",
		"paginationNextPageHelp" : "Show next page",
		"paginationLastPageHelp" : "Show last page",
		"sortAZHelp" : "Sort table elements ascending according this column",
		"sortZAHelp" : "Sort table elements descending according this column",
		"paginationDropdownHelp" : "Select number of elements per page",
		"selectTimeUnit" : "Select Time Unit",
		"valueScale" : "Value Scale",
		"linearPlot" : "Linear Value Scale",
		"logarithmicPlot" : "Logarithmic Value Scale",
		"playButton" : "Animate Selected Range",
		"pauseButton" : "Pause Animation"
	},
	"de" : {
        "institution" : "Institution",
        "institutions" : "Institutionen",
        "institutes" : "Institute",
		"locationType" : "Ortsfacette",
		"selectLocationType" : "Wähle Ortsfacette",
		"mapType" : "Kartentyp",
		"selectMapType" : "Wähle Kartentyp",
		"selectOverlay" : "Kartenauswahl für rämliches filtern",
		"overlays" : "Wähle layer",
		"mapSelectorTools" : "Bereichsauswahl",
		"overlaySelector" : "Selection layer",
		"square" : "Quadratauswahl: Maus ziehen und loslassen um Mittelpunkt und Seitenlänge des Quadrats zu bestimmen",
		"circle" : "Kreisauswahl: Maus ziehen und loslassen um Mittelpunkt und Radius des Kreises zu bestimmen",
		"polygon" : "Polygonauswahl: Mausklick zum Hinzufügen eines Eckpunktes, Doppelklick zum Fertigstellen",
		"country" : "Landauswahl: Mausklick innerhalb politischer Grenze eines Landes",
		"singleEntry" : "Nur 1 Eintrag vorhanden",
		"resultsLocation" : "mit Geoinformation",
		"home" : "Zurücksetzen zur initialen Sicht",
		"zoomIn" : "Vergrößern",
		"zoomOut" : "Verkleinern",
		"zoomSlider" : "Zoomregler",
		"dragSelection" : "Verschiebe Auswahl",
		"zoomSelection" : "Vergrößere Auswahl",
		"clearSelection" : "Entferne Auswahlbereich",
		"contemporaryMap" : "Aktuelle Weltkarte",
		"activateGeoLocation" : "Meinen Standort anzeigen",
		"deactivateGeoLocation" : "Meinen Standort ausblenden",
		"mapOf" : "Karte von",
		"close" : "Schließen",
		"genericBinning" : "Generisch",
		"squareBinning" : "Quadrate",
		"hexagonalBinning" : "Hexagone",
		"triangularBinning" : "Dreiecke",
		"noBinning" : "Keine Bins",
		"selectBinningType" : "Wähle Binningart",
		"binningTooltip" : "Wähle die Binninart für die Datenquellen",
		"binningType" : "Binningart",
		"results" : "Resultate",
		"result" : "Resultat",
		"timeType" : "Zeitfacette",
		"timeUnit" : "Zeiteinheit",
		"selectTimeType" : "Wähle Zeitfacette",
		"timeAnimation" : "Animation",
		"resultsTime" : "mit Zeitinformation",
		"animationDisabled" : "Animationswerkzeug (deaktiviert)",
		"animationPlay" : "Animiere ausgewählten Zeitbereich",
		"animationPause" : "Animation anhalten",
		"leftHandle" : "Verschiebe linke Grenze",
		"rightHandle" : "Verschiebe rechte Grenze",
		"dragTimeRange" : "Verschiebe Zeitbereich",
		"connectionsOn" : "Aktiviere zeitabhängige Verbindungen zwischen Kreisen auf der Karte",
		"connectionsOff" : "Deaktiviere zeitabhängige Verbindungen",
		"timeFeather" : "Verändere Zeitbereichsübergänge zum Glätten der Animation",
		"pageInfo" : "Seite PAGE_ID von PAGES_ID",
		"resultsInfo" : "RESULTS_FROM_ID-RESULTS_TO_ID von RESULTS_ID Ergebnissen",
		"allResults" : "alle",
		"otherResults" : "sonstige",
		"mapAggregation" : "Aggregation",
		"aggregation" : "Kreise aggregiert",
		"noAggregation" : "Kreise nicht aggregiert",
		"showBbox" : "Geografische Ausdehnung anzeigen",
		"hideBbox" : "Geografische Ausdehnung ausblenden",
		"spaceHelp" : "Jeder Punkt auf der Karte entspricht einem oder mehreren Objekten der Ergebnisliste. Sie können verschiedene ortsbezogene Kategorien als Grundlage für die Darstellung wählen (Auswahlfeld <strong>Ortsfacette</strong>) und verschiedene Kartentypen. <br> Da es Objekte geben kann, die keine Ortsangabe in ihrer Beschreibung enthalten, ist die Menge der in der Karte dargestellten Objekte in der Regel kleiner als in der Ergebnisliste (Anzahl darstellbarer Objekte siehe rechts oben über der Karte). <br> Mit der Karte können Sie die Suchergebnisse weiter eingrenzen, indem Sie auf einen der Punkte klicken. Wählen Sie einen Ort aus und klicken Sie auf die kleine Lupe, um die Ergebnisliste so einzuschränken, dass nur noch die diesem Ort zugeordneten Objekte als Suchergebnis erscheinen. Mehr zur Karte im Benutzerhandbuch ...",
		"timeHelp" : "In der Zeitleiste sind die Suchergebnisse nach Jahren geordnet. Sie können verschiedene zeitbezogene Kategorien als Grundlage für die Darstellung wählen (Auswahlfeld <strong>Zeitfacette</strong>). <br> Da es Objekte geben kann, die keine Zeitangabe in ihrer Beschreibung enthalten, ist die Zahl der in der Zeitleiste dargestellten Objekte in der Regel kleiner als in der Ergebnisliste. Die Angabe über darstellbare Objekte finden Sie rechts über der Zeitleiste. <br>Mit der Zeitleiste können Sie die Suchergebnisse weiter eingrenzen. Wählen Sie ein Jahr oder einen Zeitraum durch Klicken und Ziehen und klicken Sie auf die kleine Lupe. Die Ergebnisliste zeigt nur noch die Objekte in diesem Zeitraum. Mehr zur Zeitleiste im Benutzerhandbuch ...",
		"selectTablePageItemsHelp" : "Click to select all rows of this page",
		"deselectTablePageItemsHelp" : "Click to deselect all rows of this page",
		"selectAllTableItemsHelp" : "Click to select all rows of the table",
		"deselectAllTableItemsHelp" : "Click to deselect all rows of the table",
		"filter" : "Filter",
		"filterSelectedItemsHelp" : "Filter the selected items",
		"inverseFilterSelectedItemsHelp" : "Apply an inverse filter on the selected items removing them from the views",
		"undoFilterSelection" : "Undo the last filter / inverse filter",
		"cancelSelection" : "Discard the current selection (all items appear as deselected)",
		"showSelectedHelp" : "Show only elements within the selection",
		"showAllElementsHelp" : "Show all elements",
		"paginationFirsPageHelp" : "Show first page",
		"paginationPreviousPageHelp" : "Show previous page",
		"paginationNextPageHelp" : "Show next page",
		"paginationLastPageHelp" : "Show last page",
		"sortAZHelp" : "Sort table elements ascending according this column",
		"sortZAHelp" : "Sort table elements descending according this column",
		"paginationDropdownHelp" : "Select number of elements per page",
		"selectTimeUnit" : "Wähle Zeitinervalle",
		"valueScale" : "Value Scale",
		"linearPlot" : "Linear Value Scale",
		"logarithmicPlot" : "Logarithmic Value Scale",
		"playButton" : "Animate Selected Range",
		"pauseButton" : "Pause Animation"
	}
}
/*
* GeoTemConfig.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class GeoTemConfig
 * Global GeoTemCo Configuration File
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */

var GeoTemConfig = {

	incompleteData : true, // show/hide data with either temporal or spatial metadata
	inverseFilter : true, // if inverse filtering is offered
	mouseWheelZoom : true, // enable/disable zoom with mouse wheel on map & timeplot
	language : 'de', // default language of GeoTemCo
	allowFilter : true, // if filtering should be allowed
	//colors for several datasets; rgb1 will be used for selected objects, rgb0 for unselected
	colors : [{
		r1 : 165, // 255,
		g1 : 0,   // 101,
		b1 : 59,  // 0,
		r0 : 240, // 253,
		g0 : 99,  // 229,
		b0 : 115  // 205
	}, {
		r1 : 144,
		g1 : 26,
		b1 : 255,
		r0 : 230,
		g0 : 225,
		b0 : 255
	}, {
		r1 : 0,
		g1 : 217,
		b1 : 0,
		r0 : 213,
		g0 : 255,
		b0 : 213
	}, {
		r1 : 240,
		g1 : 220,
		b1 : 0,
		r0 : 247,
		g0 : 244,
		b0 : 197
	}]

}

GeoTemConfig.ie = false;
GeoTemConfig.ie8 = false;

if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	GeoTemConfig.ie = true;
	var ieversion = new Number(RegExp.$1);
	if (ieversion == 8) {
		GeoTemConfig.ie8 = true;
	}
}

GeoTemConfig.determineAndSetUrlPrefix = function(jsFilename) {
    if (typeof GeoTemCoMinifier_urlPrefix != "undefined") {
        // the url is already determined when loading a concatenated/minified distribution
        GeoTemConfig.configure(GeoTemCoMinifier_urlPrefix);
    } else {
        // locate the url of jsFileName
        var ux = GeoTemConfig.resolveUrlPrefix(jsFilename);
        GeoTemConfig.configure(ux);
    }
}

GeoTemConfig.resolveUrlPrefix = function(filename) {
    var sources = document.getElementsByTagName("script");
    for (var i = 0; i < sources.length; i++) {
        var index = sources[i].src.indexOf(filename);
        if (index != -1) {
            return sources[i].src.substring(0, index);
        }
    }
    if (typeof console != "undefined") {
        console.warn("cannot resolve url prefix of: " + filename);
    }
}

GeoTemConfig.configure = function(urlPrefix) {
    if (typeof console != "undefined") {
        console.log("GeoTemConfig.configure urlPrefix: " + urlPrefix);
    };
	GeoTemConfig.urlPrefix = urlPrefix;
	GeoTemConfig.path = GeoTemConfig.urlPrefix + "images/";
}

GeoTemConfig.applySettings = function(settings) {
	$.extend(this, settings);
};

GeoTemConfig.getColor = function(id){
	if( GeoTemConfig.colors.length <= id ){
		GeoTemConfig.colors.push({
			r1 : Math.floor((Math.random()*255)+1),
			g1 : Math.floor((Math.random()*255)+1),
			b1 : Math.floor((Math.random()*255)+1),
			r0 : 230,
			g0 : 230,
			b0 : 230
		});
	}
	return GeoTemConfig.colors[id];
};

GeoTemConfig.getString = function(field) {
	if ( typeof Tooltips[GeoTemConfig.language] == 'undefined') {
		GeoTemConfig.language = 'de';
	}
	return Tooltips[GeoTemConfig.language][field];
}
/**
 * returns the actual mouse position
 * @param {Event} e the mouseevent
 * @return the top and left position on the screen
 */
GeoTemConfig.getMousePosition = function(e) {
	if (!e) {
		e = window.event;
	}
	var body = (window.document.compatMode && window.document.compatMode == "CSS1Compat") ? window.document.documentElement : window.document.body;
	return {
		top : e.pageY ? e.pageY : e.clientY,
		left : e.pageX ? e.pageX : e.clientX
	};
}
/**
 * returns the json object of the file from the given url
 * @param {String} url the url of the file to load
 * @return json object of given file
 */
GeoTemConfig.getJson = function(url) {
	var data;
	$.ajax({
		url : url,
		async : false,
		dataType : 'json',
		success : function(json) {
			data = json;
		}
	});
	return data;
}

GeoTemConfig.mergeObjects = function(set1, set2) {
	var inside = [];
	var newSet = [];
	for (var i = 0; i < set1.length; i++) {
		inside.push([]);
		newSet.push([]);
		for (var j = 0; j < set1[i].length; j++) {
			inside[i][set1[i][j].index] = true;
			newSet[i].push(set1[i][j]);
		}
	}
	for (var i = 0; i < set2.length; i++) {
		for (var j = 0; j < set2[i].length; j++) {
			if (!inside[i][set2[i][j].index]) {
				newSet[i].push(set2[i][j]);
			}
		}
	}
	return newSet;
}
/**
 * returns the xml dom object of the file from the given url
 * @param {String} url the url of the file to load
 * @return xml dom object of given file
 */
GeoTemConfig.getKml = function(url,asyncFunc) {
	var data;
	var async = false;
	if( asyncFunc ){
		async = true;
	}
	$.ajax({
		url : url,
		async : async,
		dataType : 'xml',
		success : function(xml) {
			if( asyncFunc ){
				asyncFunc(xml);
			}
			else {
				data = xml;
			}
		}
	});
	if( !async ){
		return data;
	}
}

/**
 * returns a Date and a SimileAjax.DateTime granularity value for a given XML time
 * @param {String} xmlTime the XML time as String
 * @return JSON object with a Date and a SimileAjax.DateTime granularity
 */
GeoTemConfig.getTimeData = function(xmlTime) {
	if (!xmlTime)
		return;
	var dateData;
	try {
		var bc = false;
		if (xmlTime.startsWith("-")) {
			bc = true;
			xmlTime = xmlTime.substring(1);
		}
		var timeSplit = xmlTime.split("T");
		var timeData = timeSplit[0].split("-");
		for (var i = 0; i < timeData.length; i++) {
			parseInt(timeData[i]);
		}
		if (bc) {
			timeData[0] = "-" + timeData[0];
		}
		if (timeSplit.length == 1) {
			dateData = timeData;
		} else {
			var dayData;
			if (timeSplit[1].indexOf("Z") != -1) {
				dayData = timeSplit[1].substring(0, timeSplit[1].indexOf("Z") - 1).split(":");
			} else {
				dayData = timeSplit[1].substring(0, timeSplit[1].indexOf("+") - 1).split(":");
			}
			for (var i = 0; i < timeData.length; i++) {
				parseInt(dayData[i]);
			}
			dateData = timeData.concat(dayData);
		}
	} catch (exception) {
		return null;
	}
	var date, granularity;
	if (dateData.length == 6) {
		granularity = SimileAjax.DateTime.SECOND;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, dateData[2], dateData[3], dateData[4], dateData[5]));
	} else if (dateData.length == 3) {
		granularity = SimileAjax.DateTime.DAY;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, dateData[2]));
	} else if (dateData.length == 2) {
		granularity = SimileAjax.DateTime.MONTH;
		date = new Date(Date.UTC(dateData[0], dateData[1] - 1, 1));
	} else if (dateData.length == 1) {
		granularity = SimileAjax.DateTime.YEAR;
		date = new Date(Date.UTC(dateData[0], 0, 1));
	}
	if (timeData[0] && timeData[0] < 100) {
		date.setFullYear(timeData[0]);
	}
	return {
		date : date,
		granularity : granularity
	};
}
/**
 * converts a JSON array into an array of data objects
 * @param {JSON} JSON a JSON array of data items
 * @return an array of data objects
 */
GeoTemConfig.loadJson = function(JSON) {
	var mapTimeObjects = [];
	var runningIndex = 0;
	for (var i in JSON ) {
		try {
			var item = JSON[i];
			var index = item.index || item.id || runningIndex++;
			var name = item.name || "";
			var description = item.description || "";
			var tableContent = item.tableContent || [];
			var locations = [];
			if (item.location instanceof Array) {
				for (var j = 0; j < item.location.length; j++) {
					var place = item.location[j].place || "unknown";
					var lon = item.location[j].lon || "";
					var lat = item.location[j].lat || "";
					if ((lon == "" || lat == "" || isNaN(lon) || isNaN(lat) ) && !GeoTemConfig.incompleteData) {
						throw "e";
					}
					locations.push({
						longitude : lon,
						latitude : lat,
						place : place
					});
				}
			} else {
				var place = item.place || "unknown";
				var lon = item.lon || "";
				var lat = item.lat || "";
				if ((lon == "" || lat == "" || isNaN(lon) || isNaN(lat) ) && !GeoTemConfig.incompleteData) {
					throw "e";
				}
				locations.push({
					longitude : lon,
					latitude : lat,
					place : place
				});
			}
			var dates = [];
			if (item.time instanceof Array) {
				for (var j = 0; j < item.time.length; j++) {
					var time = GeoTemConfig.getTimeData(item.time[j]);
					if (time == null && !GeoTemConfig.incompleteData) {
						throw "e";
					}
					dates.push(time);
				}
			} else {
				var time = GeoTemConfig.getTimeData(item.time);
				if (time == null && !GeoTemConfig.incompleteData) {
					throw "e";
				}
				dates.push(time);
			}
			var weight = item.weight || 1;
			var mapTimeObject = new DataObject(name, description, locations, dates, weight, tableContent);
			mapTimeObject.setIndex(index);
			mapTimeObjects.push(mapTimeObject);
		} catch(e) {
			continue;
		}
	}

	return mapTimeObjects;
}
/**
 * converts a KML dom into an array of data objects
 * @param {XML dom} kml the XML dom for the KML file
 * @return an array of data objects
 */
GeoTemConfig.loadKml = function(kml) {
	var mapObjects = [];
	var elements = kml.getElementsByTagName("Placemark");
	if (elements.length == 0) {
		return [];
	}
	var index = 0;
	for (var i = 0; i < elements.length; i++) {
		var placemark = elements[i];
		var name, description, place, granularity, lon, lat, tableContent = [], time = [], location = [];
		var weight = 1;
		var timeData = false, mapData = false;
		try {
			name = placemark.getElementsByTagName("name")[0].childNodes[0].nodeValue;
			tableContent["name"] = name;
		} catch(e) {
			name = "";
		}

		try {
			description = placemark.getElementsByTagName("description")[0].childNodes[0].nodeValue;
			tableContent["description"] = description;
		} catch(e) {
			description = "";
		}

		try {
			place = placemark.getElementsByTagName("address")[0].childNodes[0].nodeValue;
			tableContent["place"] = place;
		} catch(e) {
			place = "";
		}

		try {
			var coordinates = placemark.getElementsByTagName("Point")[0].getElementsByTagName("coordinates")[0].childNodes[0].nodeValue;
			var lonlat = coordinates.split(",");
			lon = lonlat[0];
			lat = lonlat[1];
			if (lon == "" || lat == "" || isNaN(lon) || isNaN(lat)) {
				throw "e";
			}
			location.push({
				longitude : lon,
				latitude : lat,
				place : place
			});
		} catch(e) {
			if (!GeoTemConfig.incompleteData) {
				continue;
			}
		}

		try {
			var tuple = GeoTemConfig.getTimeData(placemark.getElementsByTagName("TimeStamp")[0].getElementsByTagName("when")[0].childNodes[0].nodeValue);
			if (tuple != null) {
				time.push(tuple);
				timeData = true;
			} else if (!GeoTemConfig.incompleteData) {
				continue;
			}
		} catch(e) {
			try {
				throw "e";
				var timeSpanTag = placemark.getElementsByTagName("TimeSpan")[0];
				var tuple1 = GeoTemConfig.getTimeData(timeSpanTag.getElementsByTagName("begin")[0].childNodes[0].nodeValue);
				timeStart = tuple1.d;
				granularity = tuple1.g;
				var tuple2 = GeoTemConfig.getTimeData(timeSpanTag.getElementsByTagName("end")[0].childNodes[0].nodeValue);
				timeEnd = tuple2.d;
				if (tuple2.g > granularity) {
					granularity = tuple2.g;
				}
				timeData = true;
			} catch(e) {
				if (!GeoTemConfig.incompleteData) {
					continue;
				}
			}
		}
		var object = new DataObject(name, description, location, time, 1, tableContent);
		object.setIndex(index);
		index++;
		mapObjects.push(object);
	}
	return mapObjects;
};
/*
* MapControl.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapControl
 * Generic map control interface
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
function MapControl(map, button, label, onActivate, onDeactivate) {

	var control = this;
	this.button = button;
	this.enabled = true;
	this.activated = false;
	this.label = label;

	if (this.button != null) {
		$(this.button).addClass(label + 'Deactivated');
		$(this.button).attr("title", GeoTemConfig.getString(GeoTemConfig.language, label));
		//vhz
		$(this.button).click(function() {
			control.checkStatus();
		});
	}

	this.checkStatus = function() {
		if (control.enabled) {
			if ( typeof map.activeControl != 'undefined') {
				if (control.activated) {
					control.deactivate();
				} else {
					map.activeControl.deactivate();
					control.activate();
				}
			} else {
				control.activate();
			}
		}
	};

	this.setButtonClass = function(removeClass, addClass) {
		if (this.button != null) {
			$(this.button).removeClass(label + removeClass);
			$(this.button).addClass(label + addClass);
			$(this.button).attr("title", GeoTemConfig.getString(GeoTemConfig.language, label));
		}
	};

	this.disable = function() {
		this.enabled = false;
		this.setButtonClass('Deactivated', 'Disabled');
	};

	this.enable = function() {
		this.enabled = true;
		this.setButtonClass('Disabled', 'Deactivated');
	};

	this.activate = function() {
		onActivate();
		this.activated = true;
		this.setButtonClass('Deactivated', 'Activated');
		map.activeControl = this;
	};

	this.deactivate = function() {
		onDeactivate();
		this.activated = false;
		this.setButtonClass('Activated', 'Deactivated');
		map.activeControl = undefined;
	};

};
/*
* CircleObject.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class CircleObject
 * circle object aggregate for the map
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {float} x the x (longitude) value for the circle
 * @param {float} y the y (latitude) value for the circle
 * @param {DataObject[]} elements array of data objects belonging to the circle
 * @param {float} radius the resulting radius (in pixel) for the circle
 * @param {int} search dataset index
 * @param {int} weight summed weight of all elements
 * @param {JSON} fatherBin bin of the circle object if its part of a circle pack
 */
CircleObject = function(originX, originY, shiftX, shiftY, elements, radius, search, weight, fatherBin) {

	this.originX = originX;
	this.originY = originY;
	this.shiftX = shiftX;
	this.shiftY = shiftY;
	this.elements = elements;
	this.radius = radius;
	this.search = search;
	this.weight = weight;
	this.overlay = 0;
	this.smoothness = 0;
	this.fatherBin = fatherBin;

	this.feature
	this.olFeature
	this.percentage = 0;
	this.selected = false;

};

CircleObject.prototype = {

	/**
	 * sets the OpenLayers point feature for this point object
	 * @param {OpenLayers.Feature} pointFeature the point feature for this object
	 */
	setFeature : function(feature) {
		this.feature = feature;
	},

	/**
	 * sets the OpenLayers point feature for this point object to manage its selection status
	 * @param {OpenLayers.Feature} olPointFeature the overlay point feature for this object
	 */
	setOlFeature : function(olFeature) {
		this.olFeature = olFeature;
	},

	reset : function() {
		this.overlay = 0;
		this.smoothness = 0;
	},

	setSelection : function(s) {
		this.selected = s;
	},

	toggleSelection : function() {
		this.selected = !this.selected;
	}
};
/*
* FilterBar.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class FilterBar
 * Implementation for FilterBar Object
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {Object} parent parent to call filter functions
 * @param {HTML object} parentDiv div to append filter buttons
 */
function FilterBar(parent, parentDiv) {

	var bar = this;

	this.filter = document.createElement('div');
	this.filter.setAttribute('class', 'smallButton filterDisabled');
	this.filter.onclick = function() {
		parent.filtering();
	};

	this.filterInverse = document.createElement('div');
	this.filterInverse.setAttribute('class', 'smallButton filterInverseDisabled');
	this.filterInverse.onclick = function() {
		parent.inverseFiltering();
	};
	if (!GeoTemConfig.inverseFilter) {
		this.filterInverse.style.display = 'none';
	}

	this.cancelSelection = document.createElement('div');
	this.cancelSelection.setAttribute('class', 'smallButton filterCancelDisabled');
	this.cancelSelection.onclick = function() {
		parent.deselection();
	};

	this.appendTo = function(parentDiv) {
		parentDiv.appendChild(this.filter);
		parentDiv.appendChild(this.filterInverse);
		parentDiv.appendChild(this.cancelSelection);
	}
	if ( typeof parentDiv != 'undefined') {
		this.appendTo(parentDiv);
	}

	this.reset = function(show) {
		if (show) {
			this.filter.setAttribute('class', 'smallButton filter');
			this.filterInverse.setAttribute('class', 'smallButton filterInverse');
			this.cancelSelection.setAttribute('class', 'smallButton filterCancel');
		} else {
			this.filter.setAttribute('class', 'smallButton filterDisabled');
			this.filterInverse.setAttribute('class', 'smallButton filterInverseDisabled');
			this.cancelSelection.setAttribute('class', 'smallButton filterCancelDisabled');
		}
	};

};
/*
* Selection.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class Selection
 * Selection Class
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {Array} objects array of selected objects
 * @param {Object} widget which belongs to selection
 */
function Selection(objects, widget) {

	this.objects = objects;
	if ( typeof objects == 'undefined') {
		this.objects = [];
		for (var i = 0; i < GeoTemConfig.datasets; i++) {
			this.objects.push([]);
		}
	}
	this.widget = widget;

	this.getObjects = function(widget) {
		if (!this.equal(widget)) {
			return this.objects;
		}
		this.objects = [];
		for (var i = 0; i < GeoTemConfig.datasets; i++) {
			this.objects.push([]);
		}
		return this.objects;
	};

	this.equal = function(widget) {
		if (this.valid() && this.widget != widget) {
			return false;
		}
		return true;
	};

	this.valid = function() {
		if ( typeof this.widget != 'undefined') {
			return true;
		}
		return false;
	};

};

/*
* PlacenameTags.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class PlacenameTags
 * place labels computation for circles
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
function PlacenameTags(circle, map) {

	this.circle = circle;
	this.map = map;

	this.placeLabels
	this.selectedLabel

	this.allLabel
	this.othersLabel
	this.unknownLabel

	this.calculate = function() {
		this.calculateLabels();
		this.calculatePlacenameTags();
	}

	this.calculateLabels = function() {
		var elements = this.circle.elements;
		var k = this.circle.search;
		var weight = 0;
		var labels = [];
		var levelOfDetail = this.map.getLevelOfDetail();
		for (var i = 0; i < elements.length; i++) {
			weight += elements[i].weight;
			var found = false;
			var label = elements[i].getPlace(this.map.options.mapIndex, levelOfDetail);
			if (label == "") {
				label = "unknown";
			}
			for (var j = 0; j < labels.length; j++) {
				if (labels[j].place == label) {
					labels[j].elements.push(elements[i]);
					labels[j].weight += elements[i].weight;
					found = true;
					break;
				}
			}
			if (!found) {
				labels.push({
					id : elements[i].name,
					place : label,
					elements : new Array(elements[i]),
					weight : elements[i].weight,
					index : k
				});
			}
		}
		var sortBySize = function(label1, label2) {
			if (label1.weight > label2.weight) {
				return -1;
			}
			return 1;
		}
		labels.sort(sortBySize);
		if (map.options.maxPlaceLabels) {
			var ml = map.options.maxPlaceLabels;
			if (ml == 1) {
				labels = [];
				labels.push({
					place : "all",
					elements : elements,
					weight : weight,
					index : k
				});
			}
			if (ml == 2) {
				ml++;
			}
			if (ml > 2 && labels.length + 1 > ml) {
				var c = [];
				var w = 0;
				for (var i = ml - 2; i < labels.length; i++) {
					c = c.concat(labels[i].elements);
					w += labels[i].weight;
				}
				labels = labels.slice(0, ml - 2);
				labels.push({
					place : "others",
					elements : c,
					weight : w,
					index : k
				});
			}
            if (ml > 1 && labels.length > 1) {
                labels.push({
                    place : "all",
                    elements : elements,
                    weight : weight,
                    index : k
                });
            }
		}
		this.placeLabels = labels;
	};

	this.calculatePlacenameTags = function() {
		var cloud = this;

		var c = GeoTemConfig.getColor(this.circle.search);
		var color0 = 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')';
		var color1 = 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')';
		var allStyles = "", hoverStyle = "", highlightStyle = "", selectedStyle = "", unselectedStyle = "";

		if (GeoTemConfig.ie) {
			highlightStyle += map.options.ieHighlightLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			hoverStyle += map.options.ieHoveredLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			selectedStyle += map.options.ieSelectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			unselectedStyle += map.options.ieUnselectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
		} else {
			highlightStyle += map.options.highlightLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			hoverStyle += map.options.hoveredLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			selectedStyle += map.options.selectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			unselectedStyle += map.options.unselectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
		}

		var clickFunction = function(label) {
			label.div.onclick = function() {
				cloud.changeLabelSelection(label);
			}
		}
		var maxLabelSize = this.count
		for (var i = 0; i < this.placeLabels.length; i++) {
			var l = this.placeLabels[i];
			l.selected = false;
			var div = document.createElement("div");
			div.setAttribute('class', 'tagCloudItem');
			var fontSize = 1 + (l.weight - 1) / this.map.count * map.options.maxLabelIncrease;
			if (l.place == "all") {
				fontSize = 1;
			}
			div.style.fontSize = fontSize + "em";
			l.allStyle = allStyles + "font-size: " + fontSize + "em;";
			l.selectedStyle = selectedStyle;
			l.unselectedStyle = unselectedStyle;
			l.highlightStyle = highlightStyle;
			l.hoverStyle = hoverStyle;
			div.innerHTML = l.place + "<span style='font-size:" + (1 / fontSize) + "em'>&nbsp;(" + l.weight + ")</span>";
			l.div = div;
			clickFunction(l);
		}
		if (map.options.labelGrid) {
			this.showPlacelabels();
		} else {
			for (var i = 0; i < this.placeLabels.length; i++) {
				this.placeLabels[i].div.setAttribute('style', this.placeLabels[i].allStyle + "" + this.placeLabels[i].highlightStyle);
			}
		}
	};

	this.selectLabel = function(label) {
		if ( typeof label == 'undefined') {
			label = this.placeLabels[this.placeLabels.length - 1];
		}
		if (this.map.popup) {
			this.map.popup.showLabelContent(label);
		}
		this.selectedLabel = label;
		this.selectedLabel.div.setAttribute('style', this.selectedLabel.allStyle + "" + this.selectedLabel.selectedStyle);
		this.map.mapLabelSelection(label);
	};

	// changes selection between labels (click, hover)
	this.changeLabelSelection = function(label) {
		if (this.selectedLabel == label) {
			return;
		}
		if ( typeof this.selectedLabel != 'undefined') {
			this.selectedLabel.div.setAttribute('style', this.selectedLabel.allStyle + "" + this.selectedLabel.unselectedStyle);
		}
		this.selectLabel(label);
	};

	this.showPlacelabels = function() {
		this.leftDiv = document.createElement("div");
		this.leftDiv.setAttribute('class', 'tagCloudDiv');
		this.map.gui.mapWindow.appendChild(this.leftDiv);
		this.rightDiv = document.createElement("div");
		this.rightDiv.setAttribute('class', 'tagCloudDiv');
		this.map.gui.mapWindow.appendChild(this.rightDiv);
		for (var i = 0; i < this.placeLabels.length; i++) {
			if (i % 2 == 0) {
				this.leftDiv.appendChild(this.placeLabels[i].div);
			} else {
				this.rightDiv.appendChild(this.placeLabels[i].div);
			}
			this.placeLabels[i].div.setAttribute('style', this.placeLabels[i].allStyle + "" + this.placeLabels[i].highlightStyle);
		}
		this.placeTagCloud();
	};

	this.placeTagCloud = function() {
		var lonlat = new OpenLayers.LonLat(this.circle.feature.geometry.x, this.circle.feature.geometry.y);
		var pixel = map.openlayersMap.getPixelFromLonLat(lonlat);
		var radius = this.circle.feature.style.pointRadius;
		var lw = this.leftDiv.offsetWidth;
		var rw = this.rightDiv.offsetWidth;
		this.leftDiv.style.left = (pixel.x - radius - lw - 5) + "px";
		this.rightDiv.style.left = (pixel.x + radius + 5) + "px";
		var lh = this.leftDiv.offsetHeight;
		var rh = this.rightDiv.offsetHeight;
		var lt = pixel.y - lh / 2;
		var rt = pixel.y - rh / 2;
		this.leftDiv.style.top = lt + "px";
		this.rightDiv.style.top = rt + "px";
	};

	this.remove = function() {
		$(this.leftDiv).remove();
		$(this.rightDiv).remove();
	};

};

function PackPlacenameTags(circle, map) {

	this.circle = circle;
	this.map = map;

	this.placeLabels
	this.selectedLabel

	this.allLabel
	this.othersLabel
	this.unknownLabel

	this.calculate = function() {
		this.calculateLabels();
		this.calculatePlacenameTags();
	}

	this.getLabelList = function(circle) {

		var elements = circle.elements;
		var k = circle.search;
		var weight = 0;
		var labels = [];
		var levelOfDetail = this.map.getLevelOfDetail();
		for (var i = 0; i < elements.length; i++) {
			weight += elements[i].weight;
			var found = false;
			var label = elements[i].getPlace(this.map.options.mapIndex, levelOfDetail);
			if (label == "") {
				label = "unknown";
			}
			for (var j = 0; j < labels.length; j++) {
				if (labels[j].place == label) {
					labels[j].elements.push(elements[i]);
					labels[j].weight += elements[i].weight;
					found = true;
					break;
				}
			}
			if (!found) {
				labels.push({
					id : elements[i].name,
					place : label,
					elements : new Array(elements[i]),
					weight : elements[i].weight,
					index : k
				});
			}
		}
		var sortBySize = function(label1, label2) {
			if (label1.weight > label2.weight) {
				return -1;
			}
			return 1;
		}
		labels.sort(sortBySize);
		var droppedLabels = [];
		if (map.options.maxPlaceLabels) {
			var ml = map.options.maxPlaceLabels;
			if (ml == 1) {
				labels = [];
				labels.push({
					place : "all",
					elements : elements,
					weight : weight,
					index : k
				});
			}
			if (ml == 2) {
				ml++;
			}
			if (ml > 2 && labels.length + 1 > ml) {
				var c = [];
				var w = 0;
				for (var i = ml - 2; i < labels.length; i++) {
					c = c.concat(labels[i].elements);
					w += labels[i].weight;
					droppedLabels.push(labels[i]);
				}
				labels = labels.slice(0, ml - 2);
				var ol = {
					place : "others",
					elements : c,
					weight : w,
					index : k
				};
				labels.push(ol);
				this.othersLabels.push(ol);
			}
		}
		if (labels.length > 1) {
			labels.push({
				place : "all",
				elements : elements,
				weight : weight,
				index : k
			});
		}
		this.placeLabels.push(labels);
		this.droppedLabels.push(droppedLabels);
	};

	this.calculateLabels = function() {
		var circles = this.circle.circles;
		this.placeLabels = [];
		this.droppedLabels = [];
		this.othersLabels = [];
		for (var i = 0; i < circles.length; i++) {
			this.getLabelList(circles[i]);
		}
	};

	this.calculatePlacenameTags = function() {
		var cloud = this;

		var unselectedStyles = [];
		var selectedStyles = [];
		var hoverStyles = [];

		for (var k = 0; k < this.placeLabels.length; k++) {
			var c = GeoTemConfig.getColor(this.circle.circles[k].search);
			var color0 = 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')';
			var color1 = 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')';
			var allStyles = "", hoverStyle = "", highlightStyle = "", selectedStyle = "", unselectedStyle = "";

			if (GeoTemConfig.ie) {
				highlightStyle += map.options.ieHighlightLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
				hoverStyle += map.options.ieHoveredLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
				selectedStyle += map.options.ieSelectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
				unselectedStyle += map.options.ieUnselectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			} else {
				highlightStyle += map.options.highlightLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
				hoverStyle += map.options.hoveredLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
				selectedStyle += map.options.selectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
				unselectedStyle += map.options.unselectedLabel.replace(/COLOR1/g, color1).replace(/COLOR0/g, color0) + ";";
			}

			allStyles += 'margin-right:5px;';
			allStyles += 'margin-left:5px;';
			unselectedStyles.push(unselectedStyle);
			selectedStyles.push(selectedStyle);
			hoverStyles.push(hoverStyle);

			var clickFunction = function(label, id) {
				label.div.onmouseover = function() {
					if (!label.opposite) {
						var oppositeLabel, oppositeLabelDiv;
						label.div.setAttribute('style', allStyles + "" + selectedStyles[id]);
						var c = GeoTemConfig.getColor(id);
						var color0 = 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')';
						if (id == 0) {
							for (var i = 0; i < cloud.droppedLabels[1].length; i++) {
								if (cloud.droppedLabels[1][i].place == label.place) {
									oppositeLabel = cloud.droppedLabels[1][i];
									cloud.rightDiv.appendChild(oppositeLabel.div);
									cloud.drawLine(cloud.ctxOl, label.div, oppositeLabel.div);
									var olDiv = cloud.othersLabels[1].div;
									olDiv.innerHTML = olDiv.innerHTML.replace(/\(\d*\)/g, '(' + (cloud.othersLabels[1].weight - oppositeLabel.weight) + ')');
									break;
								}
							}
						} else {
							for (var i = 0; i < cloud.droppedLabels[0].length; i++) {
								if (cloud.droppedLabels[0][i].place == label.place) {
									oppositeLabel = cloud.droppedLabels[0][i];
									cloud.leftDiv.appendChild(oppositeLabel.div);
									cloud.drawLine(cloud.ctxOl, oppositeLabel.div, label.div);
									var olDiv = cloud.othersLabels[0].div;
									olDiv.innerHTML = olDiv.innerHTML.replace(/\(\d*\)/g, '(' + (cloud.othersLabels[0].weight - oppositeLabel.weight) + ')');
									break;
								}
							}
						}
						if ( typeof oppositeLabel == 'undefined') {
							oppositeLabel = {
								div : cloud.naDiv
							};
							if (id == 0) {
								cloud.rightDiv.appendChild(cloud.naDiv);
								cloud.drawLine(cloud.ctxOl, label.div, cloud.naDiv);
								oppositeLabel.div.setAttribute('style', allStyles + "" + selectedStyles[1]);
							} else {
								cloud.leftDiv.appendChild(cloud.naDiv);
								cloud.drawLine(cloud.ctxOl, cloud.naDiv, label.div);
								oppositeLabel.div.setAttribute('style', allStyles + "" + selectedStyles[0]);
							}
							cloud.map.mapLabelHighlight(label);
						} else {
							cloud.map.mapLabelHighlight([label, oppositeLabel]);
						}
						label.div.onmouseout = function() {
							label.div.setAttribute('style', allStyles + "" + unselectedStyles[id]);
							var olDiv = cloud.othersLabels[0].div;
							olDiv.innerHTML = olDiv.innerHTML.replace(/\(\d*\)/g, '(' + cloud.othersLabels[0].weight + ')');
							var olDiv2 = cloud.othersLabels[1].div;
							olDiv2.innerHTML = olDiv2.innerHTML.replace(/\(\d*\)/g, '(' + cloud.othersLabels[1].weight + ')');
							$(oppositeLabel.div).remove();
							cloud.ctxOl.clearRect(0, 0, cloud.cvOl.width, cloud.cvOl.height);
							cloud.map.mapLabelHighlight();
						}
					}
				}
			}
			var maxLabelSize = this.count
			for (var i = 0; i < this.placeLabels[k].length; i++) {
				var l = this.placeLabels[k][i];
				l.selected = false;
				var div = document.createElement("div");
				div.setAttribute('class', 'tagCloudItem');
				var fontSize = 1 + (l.weight - 1) / this.map.count * map.options.maxLabelIncrease;
				if (l.place == "all") {
					fontSize = 1;
				}
				div.style.fontSize = fontSize + "em";
				l.allStyle = allStyles + "font-size: " + fontSize + "em;";
				l.selectedStyle = selectedStyle;
				l.unselectedStyle = unselectedStyle;
				l.hoverStyle = hoverStyle;
				div.innerHTML = l.place + "<span style='font-size:" + (1 / fontSize) + "em'>&nbsp;(" + l.weight + ")</span>";
				l.div = div;
				clickFunction(l, k);
			}
			for (var i = 0; i < this.droppedLabels[k].length; i++) {
				var l = this.droppedLabels[k][i];
				l.selected = false;
				var div = document.createElement("div");
				div.setAttribute('class', 'tagCloudItem');
				var fontSize = 1 + (l.weight - 1) / this.map.count * map.options.maxLabelIncrease;
				div.style.fontSize = fontSize + "em";
				l.allStyle = allStyles + "font-size: " + fontSize + "em;";
				l.selectedStyle = selectedStyle;
				l.unselectedStyle = unselectedStyle;
				l.hoverStyle = hoverStyle;
				div.innerHTML = l.place + "<span style='font-size:" + (1 / fontSize) + "em'>&nbsp;(" + l.weight + ")</span>";
				l.div = div;
				div.setAttribute('style', allStyles + "" + selectedStyle);
			}
		}

		this.naDiv = document.createElement("div");
		this.naDiv.setAttribute('class', 'tagCloudItem');
		var fontSize = 1;
		div.style.fontSize = fontSize + "em";
		l.allStyle = allStyles + "font-size: " + fontSize + "em;";
		l.selectedStyle = selectedStyle;
		l.unselectedStyle = unselectedStyle;
		l.hoverStyle = hoverStyle;
		this.naDiv.innerHTML = "Not available";
		l.div = this.naDiv;

		if (map.options.labelGrid) {
			this.showPlacelabels();
		}
	};

	this.showPlacelabels = function() {
		this.leftDiv = document.createElement("div");
		this.leftDiv.setAttribute('class', 'tagCloudDiv');
		this.leftDiv.style.textAlign = 'right';
		this.map.gui.mapWindow.appendChild(this.leftDiv);
		this.centerDiv = document.createElement("div");
		this.centerDiv.setAttribute('class', 'tagCloudDiv');
		this.centerDiv.style.opacity = 0.7;
		this.map.gui.mapWindow.appendChild(this.centerDiv);
		this.centerDivOl = document.createElement("div");
		this.centerDivOl.setAttribute('class', 'tagCloudDiv');
		this.centerDivOl.style.opacity = 0.7;
		this.map.gui.mapWindow.appendChild(this.centerDivOl);
		this.rightDiv = document.createElement("div");
		this.rightDiv.setAttribute('class', 'tagCloudDiv');
		this.rightDiv.style.textAlign = 'left';
		this.map.gui.mapWindow.appendChild(this.rightDiv);
		for (var i = 0; i < this.placeLabels.length; i++) {
			for (var j = 0; j < this.placeLabels[i].length; j++) {
				if (i == 0) {
					this.leftDiv.appendChild(this.placeLabels[i][j].div);
				} else {
					this.rightDiv.appendChild(this.placeLabels[i][j].div);
				}
				this.placeLabels[i][j].div.setAttribute('style', this.placeLabels[i][j].allStyle + "" + this.placeLabels[i][j].unselectedStyle);
			}
		}
		this.placeTagCloud();
		this.setCanvas();
	};

	this.placeTagCloud = function() {
		var lonlat = new OpenLayers.LonLat(this.circle.feature.geometry.x, this.circle.feature.geometry.y);
		var pixel = map.openlayersMap.getPixelFromLonLat(lonlat);
		var radius = this.circle.feature.style.pointRadius;
		var lw = this.leftDiv.offsetWidth;
		var rw = this.rightDiv.offsetWidth;
		this.leftDiv.style.left = (pixel.x - radius - lw - 5) + "px";
		this.rightDiv.style.left = (pixel.x + radius + 5) + "px";
		var lh = this.leftDiv.offsetHeight;
		var rh = this.rightDiv.offsetHeight;
		var lt = pixel.y - lh / 2;
		var rt = pixel.y - rh / 2;
		this.leftDiv.style.top = lt + "px";
		this.rightDiv.style.top = rt + "px";
	};

	this.setCanvas = function() {
		var height = Math.max(this.leftDiv.offsetHeight, this.rightDiv.offsetHeight);
		var top = Math.min(this.leftDiv.offsetTop, this.rightDiv.offsetTop);
		var left = this.leftDiv.offsetLeft + this.leftDiv.offsetWidth;
		this.width = this.rightDiv.offsetLeft - left;
		this.centerDiv.style.left = left + "px";
		this.centerDiv.style.top = top + "px";
		this.centerDiv.style.height = height + "px";
		this.centerDiv.style.width = this.width + "px";

		this.centerDivOl.style.left = left + "px";
		this.centerDivOl.style.top = top + "px";
		this.centerDivOl.style.height = height + "px";
		this.centerDivOl.style.width = this.width + "px";

		var cv = document.createElement("canvas");
		this.centerDiv.appendChild(cv);
		if (!cv.getContext && G_vmlCanvasManager) {
			cv = G_vmlCanvasManager.initElement(cv);
		}
		cv.width = this.width;
		cv.height = height;
		ctx = cv.getContext('2d');

		this.cvOl = document.createElement("canvas");
		this.centerDivOl.appendChild(this.cvOl);
		if (!this.cvOl.getContext && G_vmlCanvasManager) {
			this.cvOl = G_vmlCanvasManager.initElement(this.cvOl);
		}
		this.cvOl.width = this.width;
		this.cvOl.height = height + 50;
		this.ctxOl = this.cvOl.getContext('2d');

		for (var i = 0; i < this.placeLabels[0].length; i++) {
			this.placeLabels[0][i].opposite = false;
		}
		for (var i = 0; i < this.placeLabels[1].length; i++) {
			this.placeLabels[1][i].opposite = false;
		}
		for (var i = 0; i < this.placeLabels[0].length; i++) {
			for (var j = 0; j < this.placeLabels[1].length; j++) {
				if (this.placeLabels[0][i].place == this.placeLabels[1][j].place) {
					this.drawLine(ctx, this.placeLabels[0][i].div, this.placeLabels[1][j].div);
					this.placeLabels[0][i].opposite = true;
					this.placeLabels[1][j].opposite = true;
				}
			}
		}
	}

	this.drawLine = function(ctx, label1, label2) {
		var x1 = 5;
		var x2 = this.width - 5;
		var y1 = label1.offsetTop + label1.offsetHeight / 2;
		var y2 = label2.offsetTop + label2.offsetHeight / 2;
		if (this.leftDiv.offsetTop > this.rightDiv.offsetTop) {
			y1 += this.leftDiv.offsetTop - this.rightDiv.offsetTop;
		} else {
			y2 += this.rightDiv.offsetTop - this.leftDiv.offsetTop;
		}
		ctx.lineCap = 'round';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = '#555';
		ctx.stroke();
	}

	this.remove = function() {
		$(this.leftDiv).remove();
		$(this.rightDiv).remove();
		$(this.centerDiv).remove();
		$(this.centerDivOl).remove();
	};

};
/*
* MapConfig.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapConfig
 * Map Configuration File
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
function MapConfig(options) {

	this.options = {
		mapWidth : false, // false or desired width css definition for the map
		mapHeight : '580px', // false or desired height css definition for the map
		mapTitle : 'GeoTemCo Map View', // title will be shown in map header
		mapIndex : 0, // index = position in location array; for multiple locations the 2nd map refers to index 1
		alternativeMap : false, // alternative map definition for a web mapping service or 'false' for no alternative map
		/* an example:
		 {
		 name: 'someMapName',
		 url: '/geoserver/wms',
		 layer: 'namespace:layerName'
		 }
		 */
		googleMaps : false, // enable/disable Google maps (actually, no Google Maps API key is required)
		bingMaps : false, // enable/disable Bing maps (you need to set the Bing Maps API key below)
		bingApiKey : 'none', // bing maps api key, see informations at http://bingmapsportal.com/
		osmMaps : true, // enable/disable OSM maps
		baseLayer : 'Open Street Map', // initial layer to show (e.g. 'Google Streets')
		resetMap : true, // show/hide map reset button
		countrySelect : true, // show/hide map country selection control button
		polygonSelect : true, // show/hide map polygon selection control button
		circleSelect : true, // show/hide map circle selection control button
		squareSelect : true, // show/hide map square selection control button
		multiSelection : true, // true, if multiple polygons or multiple circles should be selectable
		popups : true, // enabled popups will show popup windows for circles on the map
		olNavigation : false, // show/hide OpenLayers navigation panel
		olLayerSwitcher : false, // show/hide OpenLayers layer switcher
		olMapOverview : false, // show/hide OpenLayers map overview
		olKeyboardDefaults : true, // (de)activate Openlayers keyboard defaults
		olScaleLine : false, // (de)activate Openlayers keyboard defaults
		geoLocation : true, // show/hide GeoLocation feature
		boundaries : {
			minLon : -29,
			minLat : 35,
			maxLon : 44,
			maxLat : 67
		}, // initial map boundaries or 'false' for no boundaries
		mapCanvasFrom : '#9db9d8', // map widget background gradient color top
		mapCanvasTo : '#5783b5', // map widget background gradient color bottom
		labelGrid : true, // show label grid on hover (enables/disables hover)
		maxPlaceLabels : 0, // Integer value for fixed number of place labels:
                            //  0 --> (default) unlimited, without "all" and "others" label
                            //  1 --> 1 label (won't be shown in popup),
                            //  2 --> handled as 3, 2 is not possible because of others & all labels,
                            // [3,...,N] --> [3,...,N] place labels
		selectDefault : true, // true, if strongest label should be selected as default
		maxLabelIncrease : 2, // maximum increase (in em) for the font size of a label
		labelHover : true, // true, to update on label hover (hover labels are clickable to be selected for filtering)
		ieHighlightLabel : "color: COLOR1; background-color: COLOR0; filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';", // css code for a highlighted place label in IE
		highlightLabel : "color: COLOR0; text-shadow: 0 0 0.4em black, 0 0 0.4em black, 0 0 0.4em black, 0 0 0.4em COLOR0;", // css code for a highlighted place label
		ieSelectedLabel : "color: COLOR1; font-weight: bold;", // css code for a selected place label in IE
		selectedLabel : "color: COLOR1; font-weight: bold;", // css code for a selected place label
		ieUnselectedLabel : "color: COLOR1; font-weight: normal;", // css code for an unselected place label in IE
		unselectedLabel : "color: COLOR1; font-weight: normal;", // css code for an unselected place label
		ieHoveredLabel : "color: COLOR1; font-weight: bold;", // css code for a hovered place label in IE
		hoveredLabel : "color: COLOR1; font-weight: bold;", // css code for a hovered place label
		circleGap : 0, // gap between the circles on the map (>=0)
		minimumRadius : 4, // minimum radius of a circle with mimimal weight (>0)
		circleOutline : true, // true if circles should have a default outline
		circleTransparency : true, // transparency of the circles
		minTransparency : 0.4, // maximum transparency of a circle
		maxTransparency : 0.8, // minimum transparency of a circle
		binning : 'generic', // binning algorithm for the map, possible values are: 'generic', 'square', 'hexagonal', 'triangular' or false for 'no binning'
		noBinningRadii : 'dynamic', // for 'no binning': 'static' for only minimum radii, 'dynamic' for increasing radii for increasing weights
		circlePackings : true, // if circles of multiple result sets should be displayed in circle packs, if a binning is performed
		binCount : 10, // number of bins for x and y dimension for lowest zoom level
		showDescriptions : true, // true to show descriptions of data items (must be provided by kml/json), false if not
		mapSelection : true, // show/hide select map dropdown
		binningSelection : false, // show/hide binning algorithms dropdown
		mapSelectionTools : true, // show/hide map selector tools
		dataInformation : true, // show/hide data information
		overlayVisibility : false, // initial visibility of additional overlays
		proxyHost : ''	//required for selectCountry feature, if the requested GeoServer and GeoTemCo are NOT on the same server

	};
	if ( typeof options != 'undefined') {
		$.extend(this.options, options);
	}

};
/*
* MapGui.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapGui
 * Map GUI Implementation
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {MapWidget} parent map widget object
 * @param {HTML object} div parent div to append the map gui
 * @param {JSON} options map configuration
 */
MapGuiCanvasEmulation = false; // XXX experiment

function MapGui(map, div, options) {

	this.map = map;

	this.container = div;
	if (options.mapWidth) {
		this.container.style.width = options.mapWidth;
	}
	if (options.mapHeight) {
		this.container.style.height = options.mapHeight;
	}
	this.container.style.position = 'relative';

	this.mapWindow = document.createElement("div");
	this.mapWindow.id = "mapWindow";
	this.container.appendChild(this.mapWindow);

	this.mapContainer = document.createElement("div");
	this.mapContainer.id = "mapContainer";
	this.mapContainer.style.position = "absolute";
	this.mapContainer.style.zIndex = 0;
	this.mapWindow.appendChild(this.mapContainer);

    if (MapGuiCanvasEmulation) {
        if (typeof console != "undefined") {
            console.warn("With canvas emulation");
        }
        this.background = document.createElement("canvas");
        this.background.setAttribute('class', 'mapCanvas');
        this.mapWindow.appendChild(this.background);
        if (!this.background.getContext && G_vmlCanvasManager) {
            this.background = G_vmlCanvasManager.initElement(this.background);
        }
    } else {
        if (typeof console != "undefined") {
            console.warn("No canvas emulation");
        }
    }


	var toolbarTable = document.createElement("table");
	toolbarTable.setAttribute('class', 'absoluteToolbar ddbToolbar');
	this.container.appendChild(toolbarTable);
	this.mapToolbar = toolbarTable;

	var titles = document.createElement("tr");
	toolbarTable.appendChild(titles);
	var tools = document.createElement("tr");
	toolbarTable.appendChild(tools);

	if (options.mapSelection) {
		this.mapTypeTitle = document.createElement("td");
		titles.appendChild(this.mapTypeTitle);
		this.mapTypeTitle.innerHTML = GeoTemConfig.getString('mapType');
		this.mapTypeSelector = document.createElement("td");
		tools.appendChild(this.mapTypeSelector);
	}

	if (options.mapSelectionTools) {
		this.mapSelectorTitle = document.createElement("td");
		titles.appendChild(this.mapSelectorTitle);
		this.mapSelectorTitle.innerHTML = GeoTemConfig.getString('mapSelectorTools');
		var mapSelectorTools = document.createElement("td");
		var selectorTools = this.map.initSelectorTools();
		for (var i in selectorTools ) {
			mapSelectorTools.appendChild(selectorTools[i].button);
		}
		tools.appendChild(mapSelectorTools);
	}

	if (options.binningSelection) {
		this.binningTitle = document.createElement("td");
		titles.appendChild(this.binningTitle);
		this.binningTitle.innerHTML = GeoTemConfig.getString('binningType');
		this.binningSelector = document.createElement("td");
		tools.appendChild(this.binningSelector);
	}

	if (GeoTemConfig.allowFilter) {
		this.filterTitle = document.createElement("td");
		titles.appendChild(this.filterTitle);
		this.filterTitle.innerHTML = GeoTemConfig.getString('filter');
		this.filterOptions = document.createElement("td");
		tools.appendChild(this.filterOptions);
	}

	if (options.dataInformation) {
		this.infoTitle = document.createElement("td");
		this.infoTitle.innerHTML = options.mapTitle;
		titles.appendChild(this.infoTitle);
		var mapSum = document.createElement("td");
		this.mapElements = document.createElement("div");
		this.mapElements.setAttribute('class', 'ddbElementsCount');
		mapSum.appendChild(this.mapElements);
		tools.appendChild(mapSum);
	}

	var gui = this;
	if (navigator.geolocation && options.geoLocation) {
		this.geoActive = false;
		this.geoLocation = document.createElement("div");
		this.geoLocation.setAttribute('class', 'geoLocationOff');
		this.geoLocation.title = GeoTemConfig.getString('activateGeoLocation');
		this.container.appendChild(this.geoLocation);
		this.geoLocation.style.left = "20px";
		this.geoLocation.onclick = function() {
			var changeStyle = function() {
				if (gui.geoActive) {
					gui.geoLocation.setAttribute('class', 'geoLocationOn');
					gui.geoLocation.title = GeoTemConfig.getString(GeoTemConfig.language, 'deactivateGeoLocation');
				} else {
					gui.geoLocation.setAttribute('class', 'geoLocationOff');
					gui.geoLocation.title = GeoTemConfig.getString(GeoTemConfig.language, 'activateGeoLocation');
				}
			}
			if (!gui.geoActive) {
				if ( typeof gui.longitude == 'undefined') {
					navigator.geolocation.getCurrentPosition(function(position) {
						gui.longitude = position.coords.longitude;
						gui.latitude = position.coords.latitude;
						gui.map.setMarker(gui.longitude, gui.latitude);
						gui.geoActive = true;
						changeStyle();
					}, function(msg) {
                        if (typeof console != 'undefined') {
                            console.log( typeof msg == 'string' ? msg : "error");
                        }
					});
				} else {
					gui.map.setMarker(gui.longitude, gui.latitude);
					gui.geoActive = true;
					changeStyle();
				}
			} else {
				gui.map.removeMarker();
				gui.geoActive = false;
				changeStyle();
			}
		}
	}

	if (!options.olNavigation) {
		this.map.zoomSlider = new MapZoomSlider(this.map, "vertical");
		this.container.appendChild(this.map.zoomSlider.div);
		this.map.zoomSlider.div.style.left = "20px";
        this.map.zoomSlider.setLanguage();
	}

	if (options.resetMap) {
		this.homeButton = document.createElement("div");
		this.homeButton.setAttribute('class', 'mapHome');
		this.homeButton.title = GeoTemConfig.getString('home');
		this.container.appendChild(this.homeButton);
		this.homeButton.style.left = "20px";
        var theMap = this.map;
		this.homeButton.onclick = function() {
            if (theMap.popup) {
                theMap.popup.reset();
            }
            if (options.detailedViewSpec) {
                map.centerAndMarkPosition();
            } else {
                gui.map.drawObjectLayer(true);
            }
		}
	}

	//		var tooltip = document.createElement("div");
	//		tooltip.setAttribute('class','ddbTooltip');
	//		toolbarTable.appendChild(tooltip);

	//		var tooltip = document.createElement("div");
	//		tooltip.setAttribute('class','ddbTooltip');
	//		toolbarTable.appendChild(tooltip);
	//
	//		tooltip.onmouseover = function(){
	//			/*
	//		    Publisher.Publish('TooltipContent', {
	//						content: GeoTemConfig.getString(GeoTemConfig.language,'timeHelp'),
	//						target: $(tooltip)
	//					    });
	//			*/
	//		}
	//		tooltip.onmouseout = function(){
	//		 //   Publisher.Publish('TooltipContent');
	//		}
	//		//vhz tooltip on click should open a help file if defined in GeoTemConfig
	//		if(GeoTemConfig.helpURL) {
	//			tooltip.onclick = function () {
	//
	//			}
	//		}

	//		}
	//		tooltip.onmouseout = function(){
	//   			Publisher.Publish('TooltipContent');
	//		}

	this.resize = function() {
		var w = this.container.offsetWidth;
		var h = this.container.offsetHeight;
//		this.mapWindow.style.width = w + "px";
		this.mapWindow.style.height = h + "px";
//		this.mapContainer.style.width = w + "px";
		this.mapContainer.style.height = h + "px";
		var top = toolbarTable.offsetHeight + 20;
		if (options.olLayerSwitcher) {
			var switcherDiv = $('.olControlLayerSwitcher')[0];
			$(switcherDiv).css('top', top + "px");
		}
		if ( typeof this.geoLocation != "undefined") {
			this.geoLocation.style.top = top + "px";
			top += this.geoLocation.offsetHeight + 4;
		}
		if (options.olNavigation) {
			var panZoomBar = $('.olControlPanZoom')[0];
			$(panZoomBar).css('top', top + 'px');
			$(panZoomBar).css('left', '12px');
			var zoomOut = document.getElementById('OpenLayers.Control.PanZoom_23_zoomout');
			top += $(zoomOut).height() + $(zoomOut).position().top + 4;
		} else {
			this.map.zoomSlider.div.style.top = top + "px";
			top += this.map.zoomSlider.div.offsetHeight + 2;
		}
		if (options.resetMap) {
			this.homeButton.style.top = top + "px";
		}

        if (MapGuiCanvasEmulation) {
            this.background.width = w;
            this.background.height = h;
            var ctx = this.background.getContext('2d');
            var gradient = ctx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0, options.mapCanvasFrom);
            gradient.addColorStop(1, options.mapCanvasTo);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        }

		this.headerHeight = toolbarTable.offsetHeight;
		this.headerWidth = toolbarTable.offsetWidth;
	};

	this.updateSpaceQuantity = function(count) {
		if (!options.dataInformation) {
			return;
		}
		this.mapCount = count;
		if (count != 1) {
			this.mapElements.innerHTML = this.beautifyCount(count) + " " + GeoTemConfig.getString('results');
		} else {
			this.mapElements.innerHTML = this.beautifyCount(count) + " " + GeoTemConfig.getString('result');
		}
	}

	this.setMapsDropdown = function() {
		if (!options.mapSelection) {
			return;
		}
		$(this.mapTypeSelector).empty();
		var maps = [];
		var gui = this;
		var addMap = function(name, index) {
			var setMap = function() {
				gui.map.setMap(index);
			}
			maps.push({
				name : name,
				onclick : setMap
			});
		}
		for (var i = 0; i < this.map.baseLayers.length; i++) {
			addMap(this.map.baseLayers[i].name, i);
		}
		this.mapTypeDropdown = new Dropdown(this.mapTypeSelector, maps, GeoTemConfig.getString('selectMapType'));
	}

	this.setMap = function() {
		if (options.mapSelection) {
			this.mapTypeDropdown.setEntry(this.map.baselayerIndex);
		}
	}

	this.setBinningDropdown = function() {
		if (!options.binningSelection) {
			return;
		}
		$(this.binningSelector).empty();
		var binnings = [];
		var gui = this;
		var index = 0;
		var entry;
		var addBinning = function(name, id) {
			if (options.binning == id) {
				entry = index;
			} else {
				index++;
			}
			var setBinning = function() {
				options.binning = id;
				gui.map.initWidget(gui.map.datasets, false);
				gui.map.riseLayer();
			}
			binnings.push({
				name : name,
				onclick : setBinning
			});
		}
		addBinning(GeoTemConfig.getString('genericBinning'), 'generic');
		addBinning(GeoTemConfig.getString('squareBinning'), 'square');
		addBinning(GeoTemConfig.getString('hexagonalBinning'), 'hexagonal');
		addBinning(GeoTemConfig.getString('triangularBinning'), 'triangular');
		addBinning(GeoTemConfig.getString('noBinning'), false);
		var binningDropdown = new Dropdown(this.binningSelector, binnings, GeoTemConfig.getString('binningTooltip'));
		binningDropdown.setEntry(entry);
	}
	this.setBinningDropdown();

	this.beautifyCount = function(count) {
		var c = count + '';
		var p = 0;
		var l = c.length;
		while (l - p > 3) {
			p += 3;
			c = c.substring(0, l - p) + "." + c.substring(l - p);
			p++;
			l++;
		}
		return c;
	}

	$(window).resize(function(){
		
	});
};
/*
* MapWidget.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapWidget
 * MapWidget Implementation
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {MapWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the map widget div
 * @param {JSON} options user specified configuration that overwrites options in MapConfig.js
 */
function MapWidget(core, div, options) {

	this.core = core;
	this.core.setWidget(this);
	this.openlayersMap
	this.baseLayers
	this.objectLayer

	this.drawPolygon
	this.drawCircle
	this.selectCountry
	this.dragArea
	this.selectFeature
	this.navigation

	this.div = div;

	this.options = (new MapConfig(options)).options;
	this.formerCP = this.options.circlePackings;
	this.gui = new MapGui(this, this.div, this.options);

	this.initialize();

}

MapWidget.prototype = {

	/**
	 * initializes the map for the Spatio Temporal Interface.
	 * it includes setting up all layers of the map and defines all map specific interaction possibilities
	 */
	initialize : function() {

		var map = this;

		//OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
		if (map.options.proxyHost) {
			OpenLayers.ProxyHost = map.options.proxyHost;
		}

		this.polygons = [];
		this.connections = [];
		this.selection = new Selection();
		this.wmsOverlays = [];

		this.layerZIndex = 1;
		this.zIndices = [];

		var activateDrag = function() {
			map.dragArea.activate();
		}
		var deactivateDrag = function() {
			map.dragArea.deactivate();
		}
		this.dragControl = new MapControl(this, null, 'drag', activateDrag, deactivateDrag);

		/*
		 this.editPolygon = document.createElement("div");
		 this.editPolygon.title = GeoTemConfig.getString('editPolygon');
		 this.editPolygon.setAttribute('class','editMapPolygon');
		 this.toolbar.appendChild(this.editPolygon);
		 this.drag.onclick = function(evt){
		 if( map.activeControl == "drag" ){
		 map.deactivate("drag");
		 if( GeoTemConfig.navigate ){
		 map.activate("navigate");
		 }
		 }
		 else {
		 map.deactivate(map.activControl);
		 map.activate("drag");
		 }
		 }
		 map.addEditingMode(new OpenLayers.Control.EditingMode.PointArraySnapping());
		 */

		var linkForOsm = 'http://www.openstreetmap.org/';
		var linkForLicense = 'http://creativecommons.org/licenses/by-sa/2.0/';
		this.osmLink = document.createElement("div");
		this.osmLink.setAttribute('class', 'osmLink');
		this.osmLink.innerHTML = '© <a href=' + linkForOsm + '>OpenStreetMap contributors</a>, <a href=' + linkForLicense + '>CC-BY-SA</a>';
		this.gui.mapWindow.appendChild(this.osmLink);

		this.filterBar = new FilterBar(this, this.gui.filterOptions);

		this.objectLayer = new OpenLayers.Layer.Vector("Data Objects", {
			projection : "EPSG:4326",
			'displayInLayerSwitcher' : false,
			rendererOptions : {
				zIndexing : true
			}
		});

		this.markerLayer = new OpenLayers.Layer.Markers("Markers");

		this.navigation = new OpenLayers.Control.Navigation({
			zoomWheelEnabled : GeoTemConfig.mouseWheelZoom
		});
		this.navigation.defaultDblClick = function(evt) {
            if (map.popup) { map.popup.reset(); }; // resetPopup
			var newCenter = this.map.getLonLatFromViewPortPx(evt.xy);
			this.map.setCenter(newCenter, this.map.zoom + 1);
			map.drawObjectLayer(false);
			if (map.zoomSlider) {
				map.zoomSlider.setValue(map.openlayersMap.getZoom());
			}
		}
		this.navigation.wheelUp = function(evt) {
            if (map.popup) { map.popup.reset(); }; // resetPopup
			this.wheelChange(evt, 1);
			map.drawObjectLayer(false);
			if (map.zoomSlider) {
				map.zoomSlider.setValue(map.openlayersMap.getZoom());
			}
			map.core.triggerHighlight([]);
		}
		this.navigation.wheelDown = function(evt) {
            if (map.popup) { map.popup.reset(); }; // resetPopup
			this.wheelChange(evt, -1);
			map.drawObjectLayer(false);
			if (map.zoomSlider) {
				map.zoomSlider.setValue(map.openlayersMap.getZoom());
			}
			map.core.triggerHighlight([]);
		}

		this.resolutions = [78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677];

		var options = {
			controls : [this.navigation],
			projection : new OpenLayers.Projection("EPSG:900913"),
			displayProjection : new OpenLayers.Projection("EPSG:4326"),
			resolutions : this.resolutions,
			units : 'meters',
			maxExtent : new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34)
		};
		this.openlayersMap = new OpenLayers.Map("mapContainer", options);
		if (map.options.navigate) {
			this.activeControl = "navigate";
		}
		this.mds = new MapDataSource(this.openlayersMap, this.options);

		if (map.options.olNavigation) {
			var zoomPanel = new OpenLayers.Control.PanZoom();
			zoomPanel.onButtonClick = function(evt) {
				var btn = evt.buttonElement;
				switch (btn.action) {
					case "panup":
						this.map.pan(0, -this.getSlideFactor("h"));
						break;
					case "pandown":
						this.map.pan(0, this.getSlideFactor("h"));
						break;
					case "panleft":
						this.map.pan(-this.getSlideFactor("w"), 0);
						break;
					case "panright":
						this.map.pan(this.getSlideFactor("w"), 0);
						break;
					case "zoomin":
                        if (map.popup) { map.popup.reset(); }; // resetPopup
						map.zoom(1);
						break;
					case "zoomout":
                        if (map.popup) { map.popup.reset(); }; // resetPopup
						map.zoom(-1);
						break;
					case "zoomworld":
						if (this.map) {
                            if (map.popup) { map.popup.reset(); }; // resetPopup
							map.zoom(this.map.zoom * -1);
						}
						break;
				}
			};
			this.openlayersMap.addControl(zoomPanel);
		}

		if (map.options.popups) {
			var panMap = function() {
				if (map.selectedGlyph) {
					var lonlat = new OpenLayers.LonLat(map.selectedGlyph.lon, map.selectedGlyph.lat);
					var pixel = map.openlayersMap.getPixelFromLonLat(lonlat);
					if (map.popup) {
						map.popup.shift(pixel.x, pixel.y);
					}
				}
			}
			this.openlayersMap.events.register("move", this.openlayersMap, panMap);
		}

		if (map.options.olMapOverview) {
			this.openlayersMap.addControl(new OpenLayers.Control.OverviewMap());
		}
		if (map.options.olKeyboardDefaults) {
			var keyboardControl = new OpenLayers.Control.KeyboardDefaults();
			keyboardControl.defaultKeyPress = function(evt) {
				switch(evt.keyCode) {
					case OpenLayers.Event.KEY_LEFT:
						this.map.pan(-this.slideFactor, 0);
						break;
					case OpenLayers.Event.KEY_RIGHT:
						this.map.pan(this.slideFactor, 0);
						break;
					case OpenLayers.Event.KEY_UP:
						this.map.pan(0, -this.slideFactor);
						break;
					case OpenLayers.Event.KEY_DOWN:
						this.map.pan(0, this.slideFactor);
						break;

					case 33:
						// Page Up. Same in all browsers.
						var size = this.map.getSize();
						this.map.pan(0, -0.75 * size.h);
						break;
					case 34:
						// Page Down. Same in all browsers.
						var size = this.map.getSize();
						this.map.pan(0, 0.75 * size.h);
						break;
					case 35:
						// End. Same in all browsers.
						var size = this.map.getSize();
						this.map.pan(0.75 * size.w, 0);
						break;
					case 36:
						// Home. Same in all browsers.
						var size = this.map.getSize();
						this.map.pan(-0.75 * size.w, 0);
						break;

					case 43:
					// +/= (ASCII), keypad + (ASCII, Opera)
					case 61:
					// +/= (Mozilla, Opera, some ASCII)
					case 187:
					// +/= (IE)
					case 107:
						// keypad + (IE, Mozilla)
						map.zoom(1);
						break;
					case 45:
					// -/_ (ASCII, Opera), keypad - (ASCII, Opera)
					case 109:
					// -/_ (Mozilla), keypad - (Mozilla, IE)
					case 189:
					// -/_ (IE)
					case 95:
						// -/_ (some ASCII)
						map.zoom(-1);
						break;
				}
			};
			this.openlayersMap.addControl(keyboardControl);
		}
		if (map.options.olLayerSwitcher) {
			this.openlayersMap.addControl(new OpenLayers.Control.LayerSwitcher());
		}
		if (map.options.olScaleLine) {
			this.openlayersMap.addControl(new OpenLayers.Control.ScaleLine());
		}
		this.gui.resize();
		this.openlayersMap.updateSize();
		this.setBaseLayers();
		this.gui.setMapsDropdown();
		this.gui.setMap();
		this.openlayersMap.addLayers([this.objectLayer, this.markerLayer]);

		if (map.options.boundaries) {
			var boundaries = map.options.boundaries;
			var bounds = new OpenLayers.Bounds(boundaries.minLon, boundaries.minLat, boundaries.maxLon, boundaries.maxLat);
			var projectionBounds = bounds.transform(this.openlayersMap.displayProjection, this.openlayersMap.projection);
			this.openlayersMap.zoomToExtent(projectionBounds);
		} else {
			this.openlayersMap.zoomToMaxExtent();
		}

		// manages selection of elements if a polygon was drawn
		this.drawnPolygonHandler = function(polygon) {
			if (map.mds.getAllObjects() == null) {
				return;
			}
			var polygonFeature;
			if ( polygon instanceof OpenLayers.Geometry.Polygon) {
				polygonFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon([polygon]));
			} else if ( polygon instanceof OpenLayers.Geometry.MultiPolygon) {
				polygonFeature = new OpenLayers.Feature.Vector(polygon);
			}
			map.polygons.push(polygonFeature);
			var style = $.extend(true, {}, OpenLayers.Feature.Vector.style['default']);
			style.graphicZIndex = 0;
			polygonFeature.style = style;
			map.objectLayer.addFeatures([polygonFeature]);
			try {
				map.activeControl.deactivate();
			} catch(e) {
			}
			var circles = map.mds.getObjectsByZoom();
			for (var i = 0; i < circles.length; i++) {
				for (var j = 0; j < circles[i].length; j++) {
					var c = circles[i][j];
					if (map.inPolygon(c)) {
						if ( typeof c.fatherBin != 'undefined') {
							for (var k = 0; k < c.fatherBin.circles.length; k++) {
								if (c.fatherBin.circles[k]) {
									c.fatherBin.circles[k].setSelection(true);
								}
							}
						} else {
							c.setSelection(true);
						}
					}
				}
			}
			map.mapSelection();
		}

		this.polygonDeselection = function() {
			var circles = map.mds.getObjectsByZoom();
			for (var i = 0; i < circles.length; i++) {
				for (var j = 0; j < circles[i].length; j++) {
					var c = circles[i][j];
					if (map.inPolygon(c)) {
						c.setSelection(false);
					}
				}
			}
		}
		this.snapper = function() {
			if (map.polygons.length == 0 || !map.options.multiSelection) {
				map.deselection();
			}
		}
		if (map.options.polygonSelect) {
			this.drawPolygon = new OpenLayers.Control.DrawFeature(map.objectLayer, OpenLayers.Handler.Polygon, {
				displayClass : "olControlDrawFeaturePolygon",
				callbacks : {
					"done" : map.drawnPolygonHandler,
					"create" : map.snapper
				}
			});
			this.openlayersMap.addControl(this.drawPolygon);
		}

		if (map.options.circleSelect) {
			this.drawCircle = new OpenLayers.Control.DrawFeature(map.objectLayer, OpenLayers.Handler.RegularPolygon, {
				displayClass : "olControlDrawFeaturePolygon",
				handlerOptions : {
					sides : 40
				},
				callbacks : {
					"done" : map.drawnPolygonHandler,
					"create" : map.snapper
				}
			});
			this.openlayersMap.addControl(this.drawCircle);
		}

		if (map.options.squareSelect) {
			this.drawSquare = new OpenLayers.Control.DrawFeature(map.objectLayer, OpenLayers.Handler.RegularPolygon, {
				displayClass : "olControlDrawFeaturePolygon",
				handlerOptions : {
					sides : 4
				},
				callbacks : {
					"done" : map.drawnPolygonHandler,
					"create" : map.snapper
				}
			});
			this.openlayersMap.addControl(this.drawSquare);
		}

		if (map.options.polygonSelect || map.options.circleSelect || map.options.squareSelect) {
			this.dragArea = new OpenLayers.Control.DragFeature(map.objectLayer, {
				onStart : function(feature) {
					feature.style.graphicZIndex = 10000;
					map.polygonDeselection();
				},
				onComplete : function(feature) {
					feature.style.graphicZIndex = 0;
					map.drawnPolygonHandler(feature.geometry);
				}
			});
			this.openlayersMap.addControl(this.dragArea);

			this.modifyArea = new OpenLayers.Control.ModifyFeature(map.objectLayer, {
				onStart : function(feature) {
					feature.style.graphicZIndex = 10000;
					map.polygonDeselection();
				},
				onComplete : function(feature) {
					feature.style.graphicZIndex = 0;
					map.drawnPolygonHandler(feature.geometry);
				}
			});
			this.openlayersMap.addControl(this.modifyArea);
			this.modifyArea.mode = OpenLayers.Control.ModifyFeature.RESHAPE;

		}

		// calculates the tag cloud
		// manages hover selection of point objects
		var hoverSelect = function(event) {
			var object = event.feature;
			if (object.geometry instanceof OpenLayers.Geometry.Point) {
				if ( typeof map.placenameTags != 'undefined') {
					map.placenameTags.remove();
				}
				var circle = event.feature.parent;
				if ( circle instanceof CircleObject) {
					circle.placenameTags = new PlacenameTags(circle, map);
					map.placenameTags = circle.placenameTags;
				} else {
					return;
					/*
					 event.feature.style.fillOpacity = 0.2;
					 event.feature.style.strokeOpacity = 1;
					 map.objectLayer.drawFeature(event.feature);
					 circle.placenameTags = new PackPlacenameTags(circle,map);
					 */
				}
				circle.placenameTags.calculate();
				map.mapCircleHighlight(object.parent, false);
				if ( typeof map.featureInfo != 'undefined') {
					map.featureInfo.deactivate();
				}
			} else {
				map.dragControl.checkStatus();
			}
		};
		var hoverUnselect = function(event) {
			var object = event.feature;
			if (object.geometry instanceof OpenLayers.Geometry.Point) {
				var circle = event.feature.parent;
				if (!( circle instanceof CircleObject )) {
					return;
					/*
					 event.feature.style.fillOpacity = 0;
					 event.feature.style.strokeOpacity = 0;
					 map.objectLayer.drawFeature(event.feature);
					 */
				}
				circle.placenameTags.remove();
				map.mapCircleHighlight(object.parent, true);
				if ( typeof map.featureInfo != 'undefined') {
					map.featureInfo.activate();
				}
			} else {
				map.dragControl.deactivate();
			}
		};
		var highlightCtrl = new OpenLayers.Control.SelectFeature(this.objectLayer, {
			hover : true,
			highlightOnly : true,
			renderIntent : "temporary",
			eventListeners : {
				featurehighlighted : hoverSelect,
				featureunhighlighted : hoverUnselect
			}
		});
		this.openlayersMap.addControl(highlightCtrl);
		highlightCtrl.activate();

		this.selectFeature = new OpenLayers.Control.SelectFeature(this.objectLayer);

		document.onkeydown = function(e) {
			if (typeof e != "undefined" && e.ctrlKey) {
				map.ctrlKey = true;
			}
		}
		document.onkeyup = function(e) {
			map.ctrlKey = false;
		}
		// manages click selection of point objects
		var onFeatureSelect = function(event, evt) {
			if (!(event.feature.geometry instanceof OpenLayers.Geometry.Point)) {
				return;
			}
			var circle = event.feature.parent;
			if (map.options.multiSelection && map.ctrlKey) {
				if (map.popup) {
					map.popup.reset();
					map.selectedGlyph = false;
				}
				circle.toggleSelection();
				map.mapSelection();
				return;
			}
			map.reset();
			circle.setSelection(true);
			map.objectLayer.drawFeature(circle.feature);
			if (map.options.popups) {
				if (map.popup) {
					map.popup.reset();
				}
				var lonlat = event.feature.geometry.getBounds().getCenterLonLat();
				var pixel = map.openlayersMap.getPixelFromLonLat(lonlat);
				map.selectedGlyph = {
					lon : lonlat.lon,
					lat : lonlat.lat
				};
				map.popup = new PlacenamePopup(map);
				map.popup.createPopup(pixel.x, pixel.y, circle.placenameTags.placeLabels);
				if (map.options.selectDefault) {
					circle.placenameTags.selectLabel();
				}
			}
		}
		this.objectLayer.events.on({
			"featureselected" : onFeatureSelect
		});

		this.openlayersMap.addControl(this.selectFeature);
		this.selectFeature.activate();

		if (this.zoomSlider) {
			this.zoomSlider.setMaxAndLevels(1000, this.openlayersMap.getNumZoomLevels());
			this.zoomSlider.setValue(this.openlayersMap.getZoom());
		}
	},

	shift : function(shiftX, shiftY) {
		this.openlayersMap.pan(shiftX, shiftY);
	},

	addBaseLayers : function(layers) {
		if ( layers instanceof Array) {
			for (var i in layers ) {
				var layer = new OpenLayers.Layer.WMS(layers[i].name, layers[i].url, {
					projection : "EPSG:4326",
					layers : layers[i].layer,
					transparent : "true",
					format : "image/png"
				}, {
					isBaseLayer : true
				});
				this.baseLayers.push(layer);
				this.openlayersMap.addLayers([layer]);
			}
		}
		this.gui.setMapsDropdown();
	},

	/**
	 * set online available maps for Google, Bing and OSM
	 */
	setBaseLayers : function() {
		this.baseLayers = [];
		if (this.options.googleMaps) {
			// see http://openlayers.org/blog/2010/07/10/google-maps-v3-for-openlayers/ for information
			var gphy = new OpenLayers.Layer.Google("Google Physical", {
				type : google.maps.MapTypeId.TERRAIN,
				minZoomLevel : 1,
				maxZoomLevel : 19
			});
			var gmap = new OpenLayers.Layer.Google("Google Streets", {
				minZoomLevel : 1,
				maxZoomLevel : 19
			});
			var ghyb = new OpenLayers.Layer.Google("Google Hybrid", {
				type : google.maps.MapTypeId.HYBRID,
				minZoomLevel : 1,
				maxZoomLevel : 19
			});
			var gsat = new OpenLayers.Layer.Google("Google Satellite", {
				type : google.maps.MapTypeId.SATELLITE,
				minZoomLevel : 1,
				maxZoomLevel : 19
			});
			this.baseLayers.push(gphy);
			this.baseLayers.push(gmap);
			this.baseLayers.push(ghyb);
			this.baseLayers.push(gsat);
		}
		if (this.options.bingMaps) {
			// see http://openlayers.org/blog/2010/12/18/bing-tiles-for-openlayers/ for information
			var apiKey = this.options.bingApiKey;
			var road = new OpenLayers.Layer.Bing({
				name : "Road",
				key : apiKey,
				type : "Road"
			});
			var hybrid = new OpenLayers.Layer.Bing({
				name : "Hybrid",
				key : apiKey,
				type : "AerialWithLabels"
			});
			var aerial = new OpenLayers.Layer.Bing({
				name : "Aerial",
				key : apiKey,
				type : "Aerial"
			});
			this.baseLayers.push(road);
			this.baseLayers.push(hybrid);
			this.baseLayers.push(aerial);
		}
		if (this.options.osmMaps) {
            //var osmTileServer = "openstreetmap.org";
            //var osmTileServer = "opencyclemap.org/cycle";
            //var osmTileServer = "ddbmap-p1";
            var osmTileServer = "maps.deutsche-digitale-bibliothek.de";
            var osmServer = ["http://a.tile." + osmTileServer + "/${z}/${x}/${y}.png",
                             "http://b.tile." + osmTileServer + "/${z}/${x}/${y}.png",
                             "http://c.tile." + osmTileServer + "/${z}/${x}/${y}.png"];
            
            if (typeof console != "undefined") {
                console.log("new Openlayers.Layers.OSM('OpenStreetMap', '" + osmServer + "', {..}");
            };
			this.baseLayers.push(new OpenLayers.Layer.OSM('Open Street Map', osmServer, {
				sphericalMercator : true,
				zoomOffset : 1,
				resolutions : this.resolutions
			}));
		}
		for (var i = 0; i < this.baseLayers.length; i++) {
			this.openlayersMap.addLayers([this.baseLayers[i]]); // this also sets openlayerMap.getNumZoomLevels()
		}
		if (this.options.alternativeMap) {
			this.addBaseLayers([this.options.alternativeMap]);
		}
		for (var i = 0; i < this.baseLayers.length; i++) {
			if (this.baseLayers[i].name == this.options.baseLayer) {
				this.setMap(i);
			}
		}
	},

	getBaseLayerName : function() {
		return this.openlayersMap.baseLayer.name;
	},

	setOverlays : function(layers) {
		var map = this;
		for (var i in this.wmsOverlays ) {
			this.openlayersMap.removeLayer(this.wmsOverlays[i]);
		}
		this.wmsOverlays = [];
		var featureInfoLayers = [];
		if ( layers instanceof Array) {
			for (var i in layers ) {
				var layer = new OpenLayers.Layer.WMS(layers[i].name, layers[i].url, {
					projection : "EPSG:4326",
					layers : layers[i].layer,
					transparent : "true",
					format : "image/png"
				}, {
					isBaseLayer : false,
					visibility : map.options.overlayVisibility
				});
				this.wmsOverlays.push(layer);
				if (layers[i].featureInfo) {
					featureInfoLayers.push(layer);
				}
			}
			this.openlayersMap.addLayers(this.wmsOverlays);
		}
		if (this.wmsOverlays.length > 0 && map.options.overlayVisibility) {
			var map = this;
			if ( typeof this.featureInfo != 'undefined') {
				this.featureInfo.deactivate();
				this.openlayersMap.removeControl(this.featureInfo);
			}
			this.featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
				url : '/geoserver/wms',
				layers : featureInfoLayers,
				eventListeners : {
					getfeatureinfo : function(event) {
						if (event.text == '') {
							return;
						}
						var lonlat = map.openlayersMap.getLonLatFromPixel(new OpenLayers.Pixel(event.xy.x, event.xy.y));
						map.selectedGlyph = {
							lon : lonlat.lon,
							lat : lonlat.lat
						};
						if ( typeof map.popup != 'undefined') {
							map.popup.reset();
						}
						map.popup = new MapPopup(map);
						map.popup.initialize(event.xy.x, event.xy.y);
						map.popup.setContent(event.text);
					}
				}
			});
			this.openlayersMap.addControl(this.featureInfo);
			this.featureInfo.activate();
			this.activateCountrySelector(this.wmsOverlays[this.wmsOverlays.length - 1]);
		} else {
			this.deactivateCountrySelector();
			if (this.openlayersMap.baseLayer instanceof OpenLayers.Layer.WMS) {
				this.activateCountrySelector(this.openlayersMap.baseLayer);
			}
		}
	},

	addBaseLayer : function(layer) {
		this.baseLayers.push(layer);
		this.openlayersMap.addLayers([layer]);
		for (var i in this.baseLayers ) {
			if (this.baseLayers[i].name == this.options.baseLayer) {
				this.setMap(i);
			}
		}
	},

	/**
	 * draws the object layer.
	 * @param {boolean} zoom if there was a zoom; if not, the new boundary of the map is calculated
	 */
	drawObjectLayer : function(zoom) {
		if ( typeof this.placenameTags != 'undefined') {
			this.placenameTags.remove();
		}
		var points = this.mds.getAllObjects();
		if (points == null) {
			return;
		}
		this.objectLayer.removeAllFeatures();

		if (zoom) {
			var minLat, maxLat, minLon, maxLon;
            if (this.options.boundaries) {
                var boundaries = this.options.boundaries;
                var bounds = new OpenLayers.Bounds(boundaries.minLon, boundaries.minLat, boundaries.maxLon, boundaries.maxLat);
                var projectionBounds = bounds.transform(this.openlayersMap.displayProjection, this.openlayersMap.projection);
                this.openlayersMap.zoomToExtent(projectionBounds);
            } else {
                var pointsHighestZoom = points[points.length - 1];
                for (var i = 0; i < pointsHighestZoom.length; i++) {
                    for (var j = 0; j < pointsHighestZoom[i].length; j++) {
                        var point = pointsHighestZoom[i][j];
                        if (minLon == null || point.originX < minLon) {
                            minLon = point.originX;
                        }
                        if (maxLon == null || point.originX > maxLon) {
                            maxLon = point.originX;
                        }
                        if (minLat == null || point.originY < minLat) {
                            minLat = point.originY;
                        }
                        if (maxLat == null || point.originY > maxLat) {
                            maxLat = point.originY;
                        }
                    }
                }
                if (minLon == maxLon && minLat == maxLat) {
                    this.openlayersMap.setCenter(new OpenLayers.LonLat(minLon, minLat));
                } else {
                    var gapX = 0.1 * (maxLon - minLon );
                    var gapY1 = 0.1 * (maxLat - minLat );
                    var gapY2 = (this.gui.headerHeight / this.gui.mapWindow.offsetHeight + 0.1 ) * (maxLat - minLat );
                    this.openlayersMap.zoomToExtent(new OpenLayers.Bounds(minLon - gapX, minLat - gapY1, maxLon + gapX, maxLat + gapY2));
                    this.openlayersMap.zoomTo(Math.floor(this.openlayersMap.getZoom()));
                }
			}
			if (this.zoomSlider) {
				this.zoomSlider.setValue(this.openlayersMap.getZoom());
			}
		}
		var displayPoints = this.mds.getObjectsByZoom();
		var resolution = this.openlayersMap.getResolution();
		for (var i = 0; i < displayPoints.length; i++) {
			for (var j = 0; j < displayPoints[i].length; j++) {
				var p = displayPoints[i][j];
				var x = p.originX + resolution * p.shiftX;
				var y = p.originY + resolution * p.shiftY;
				p.feature.geometry.x = x;
				p.feature.geometry.y = y;
				p.olFeature.geometry.x = x;
				p.olFeature.geometry.y = y;
				p.feature.style.graphicZIndex = this.zIndices[i];
				p.olFeature.style.graphicZIndex = this.zIndices[i] + 1;
				this.objectLayer.addFeatures([p.feature]);
				this.objectLayer.addFeatures([p.olFeature]);
			}
		}
		var zoomLevel = this.openlayersMap.getZoom();
		/*
		 for (var i = 0; i < this.bins[zoomLevel].length; i++) {
		 var p = this.bins[zoomLevel][i];
		 p.feature.style.graphicZIndex = 0;
		 this.objectLayer.addFeatures([p.feature]);
		 }
		 */

		var dist = function(p1, p2) {
			return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
		}

		this.highlightChanged(this.selection.getObjects(this.core));

	},

	riseLayer : function(id) {
		this.lastId = id;
		if ( typeof id == 'undefined') {
			id = this.lastId || 0;
		}
		this.zIndices[id] = this.layerZIndex;
		this.layerZIndex += 2;
		this.reset();
		this.drawObjectLayer(false);
	},

	/**
	 * initializes the object layer.
	 * all point representations for all zoom levels are calculated and initialized
	 * @param {MapObject[][]} mapObjects an array of map objects from different (1-4) sets
	 */
	initWidget : function(datasets, zoom) {

		this.clearMap();

		this.datasets = datasets;
		var mapObjects = [];
		for (var i = 0; i < datasets.length; i++) {
			mapObjects.push(datasets[i].objects);
		}
		if (mapObjects.length > 4) {
			this.options.circlePackings = false;
		} else {
			this.options.circlePackings = this.formerCP;
		}

		if ( typeof mapObjects == 'undefined') {
			return;
		}

		this.count = 0;
		this.objectCount = 0;
		for (var i = 0; i < mapObjects.length; i++) {
			var c = 0;
			for (var j = 0; j < mapObjects[i].length; j++) {
				if (mapObjects[i][j].isGeospatial) {
					c += mapObjects[i][j].weight;
					this.objectCount++;
				}
			}
			this.count += c;
			this.zIndices.push(this.layerZIndex);
			this.layerZIndex += 2;
		}

		this.mds.initialize(mapObjects);
		var points = this.mds.getAllObjects();
		if (points == null) {
			return;
		}

		var getArea = function(radius) {
			return Math.PI * radius * radius;
		}
		for (var i = 0; i < points.length; i++) {
			var area = 0;
			var maxRadius = 0;
			for (var j = 0; j < points[i].length; j++) {
				for (var k = 0; k < points[i][j].length; k++) {
					if (points[i][j][k].radius > maxRadius) {
						maxRadius = points[i][j][k].radius;
						area = getArea(maxRadius);
					}
				}
			}
			var minArea = getArea(this.options.minimumRadius);
			var areaDiff = area - minArea;
			for (var j = 0; j < points[i].length; j++) {
				for (var k = 0; k < points[i][j].length; k++) {
					var point = points[i][j][k];
					var c = GeoTemConfig.getColor(point.search);
					var transparency = 1;
					if (this.options.circleTransparency) {
						var min = this.options.minTransparency;
						var max = this.options.maxTransparency;
						transparency = min + Math.abs(min - max) * (1 - (getArea(point.radius) - minArea) / areaDiff);
					}
					var col = this.options.circleOutline;
					//transparency = 0.8;
					var style = {
						fillColor : 'rgb(' + c.r0 + ',' + c.g0 + ',' + c.b0 + ')',
						fillOpacity : transparency,
						strokeWidth : 2,
						strokeColor : 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')',
						stroke : col,
						pointRadius : point.radius,
						cursor : "pointer"
					};
					var pointGeometry = new OpenLayers.Geometry.Point(point.originX, point.originY, null);
					var feature = new OpenLayers.Feature.Vector(pointGeometry);
					feature.style = style;
					feature.parent = point;
					point.setFeature(feature);
					var olStyle = {
						fillColor : 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')',
						fillOpacity : transparency,
						stroke : false,
						pointRadius : 0,
						cursor : "pointer"
					};
					var olPointGeometry = new OpenLayers.Geometry.Point(point.originX, point.originY, null);
					var olFeature = new OpenLayers.Feature.Vector(olPointGeometry);
					olFeature.style = olStyle;
					olFeature.parent = point;
					point.setOlFeature(olFeature);
				}
			}
		}

		/*
		 this.bins = this.mds.getAllBins();
		 for (var i = 0; i < this.bins.length; i++) {
		 for (var j = 0; j < this.bins[i].length; j++) {
		 var bin = this.bins[i][j];
		 var style = {
		 fillColor : 'rgb(140,140,140)',
		 fillOpacity : 0,
		 strokeWidth : 2,
		 strokeOpacity : 0,
		 strokeColor : 'rgb(140,140,140)',
		 //					stroke: false,
		 pointRadius : bin.radius,
		 cursor : "pointer"
		 };
		 var pointGeometry = new OpenLayers.Geometry.Point(bin.x, bin.y, null);
		 var feature = new OpenLayers.Feature.Vector(pointGeometry);
		 feature.style = style;
		 feature.parent = bin;
		 bin.feature = feature;
		 }
		 }
		 */

		if ( typeof zoom == "undefined") {
			this.drawObjectLayer(true);
		} else {
			this.drawObjectLayer(zoom);
		}
		this.gui.updateSpaceQuantity(this.count);

	},

	/**
	 * resets the map by destroying all additional elements except the point objects, which are replaced
	 */
	reset : function() {
		if ( typeof this.placenameTags != 'undefined') {
			this.placenameTags.remove();
		}
		this.objectLayer.removeFeatures(this.polygons);
		this.polygons = [];
		this.objectLayer.removeFeatures(this.connections);
		this.connections = [];
		this.selectFeature.unselectAll();
		this.selectedGlyph = false;
		if (this.dragControl.activated) {
			this.dragControl.deactivate();
		}
		if (this.popup) {
			this.popup.reset();
		}
		this.filterBar.reset(false);
		var points = this.mds.getObjectsByZoom();
		if (points == null) {
			return;
		}
		for (var i = 0; i < points.length; i++) {
			for (var j = 0; j < points[i].length; j++) {
				points[i][j].setSelection(false);
			}
		}
	},

	/**
	 * resets the map by destroying all elements
	 */
	clearMap : function() {
		this.reset();
		this.selection = new Selection();
		this.zIndices = [];
		this.layerZIndex = 1;
		this.objectLayer.destroyFeatures();
	},

	/**
	 * updates the proportional selection status of a point object
	 * @param {PointObject} point the point to update
	 * @param {OpenLayers.Geometry.Polygon} polygon the actual displayed map polygon
	 */
	updatePoint : function(point, polygon) {
		var olRadius = this.mds.binning.getRadius(point.overlay);
		if (olRadius != point.olFeature.style.pointRadius) {
			point.olFeature.style.pointRadius = olRadius;
			if (polygon.containsPoint(point.feature.geometry)) {
				this.objectLayer.drawFeature(point.olFeature);
			}
		}
	},

	/**
	 * updates the the object layer of the map after selections had been executed in timeplot or table or zoom level has changed
	 */
	highlightChanged : function(mapObjects) {
		this.mds.clearOverlay();
		if (this.selection.valid()) {
			this.mds.setOverlay(GeoTemConfig.mergeObjects(mapObjects, this.selection.getObjects()));
		} else {
			this.mds.setOverlay(mapObjects);
		}
		var points = this.mds.getObjectsByZoom();
		var polygon = this.openlayersMap.getExtent().toGeometry();
		for (var i in points ) {
			for (var j in points[i] ) {
				this.updatePoint(points[i][j], polygon);
			}
		}
		this.displayConnections();
	},

	selectionChanged : function(selection) {
		this.reset();
		this.selection = selection;
		this.highlightChanged(selection.objects);
	},

	inPolygon : function(point) {
		for (var i = 0; i < this.polygons.length; i++) {
			var polygon = this.polygons[i].geometry;
			for (var j = 0; j < polygon.components.length; j++) {
				if (polygon.components[j].containsPoint(point.feature.geometry)) {
					return true;
				}
			}
		}
		return false;
	},

	mapSelection : function() {
		var selectedObjects = [];
		for (var i = 0; i < this.mds.size(); i++) {
			selectedObjects.push([]);
		}
		var circles = this.mds.getObjectsByZoom();
		for (var i = 0; i < circles.length; i++) {

			for (var j = 0; j < circles[i].length; j++) {
				var c = circles[i][j];
				if (c.selected) {
					selectedObjects[i] = selectedObjects[i].concat(c.elements);
				}
			}
		}
		this.selection = new Selection(selectedObjects, this);
		this.highlightChanged(selectedObjects);
		this.core.triggerSelection(this.selection);
		this.filterBar.reset(true);
	},

	deselection : function() {
		this.reset();
		this.selection = new Selection();
		this.highlightChanged([]);
		this.core.triggerSelection(this.selection);
	},

	filtering : function() {
		for (var i = 0; i < this.datasets.length; i++) {
			this.datasets[i].objects = this.selection.objects[i];
		}
		this.core.triggerRefining(this.datasets);
	},

	inverseFiltering : function() {
		var selectedObjects = [];
		for (var i = 0; i < this.mds.size(); i++) {
			selectedObjects.push([]);
		}
		var circles = this.mds.getObjectsByZoom();
		for (var i = 0; i < circles.length; i++) {
			for (var j = 0; j < circles[i].length; j++) {
				var c = circles[i][j];
				if (!c.selected) {
					selectedObjects[i] = selectedObjects[i].concat(c.elements);
				}
			}
		}
		this.selection = new Selection(selectedObjects, this);
		this.filtering();
	},

	mapCircleHighlight : function(circle, undo) {
		if (this.polygons.length > 0 && this.inPolygon(circle)) {
			return;
		}
		var mapObjects = [];
		for (var i = 0; i < this.mds.size(); i++) {
			mapObjects.push([]);
		}
		if (!undo && !circle.selected) {
			mapObjects[circle.search] = circle.elements;
		}
		this.objectLayer.drawFeature(circle.feature);
		this.core.triggerHighlight(mapObjects);
	},

	mapLabelSelection : function(label) {
		var selectedObjects = [];
		for (var i = 0; i < this.mds.size(); i++) {
			selectedObjects.push([]);
		}
		selectedObjects[label.index] = label.elements;
		this.selection = new Selection(selectedObjects, this);
		this.highlightChanged(selectedObjects);
		this.core.triggerSelection(this.selection);
		this.filterBar.reset(true);
	},

	/**
	 * displays connections between data objects
	 */
	displayConnections : function() {
		return;
		if ( typeof this.connection != 'undefined') {
			this.objectLayer.removeFeatures(this.connections);
			this.connections = [];
		}
		if (this.options.connections) {
			var points = this.mds.getObjectsByZoom();
			for (var i in points ) {
				for (var j in points[i] ) {

				}
			}

			var slices = this.core.timeplot.getSlices();
			for (var i = 0; i < slices.length; i++) {
				for (var j = 0; j < slices[i].stacks.length; j++) {
					var e = slices[i].stacks[j].elements;
					if (e.length == 0) {
						continue;
					}
					var points = [];
					for (var k = 0; k < e.length; k++) {
						var point = this.mds.getCircle(j, e[k].index).feature.geometry;
						if (arrayIndex(points, point) == -1) {
							points.push(point);
						}
					}
					var matrix = new AdjMatrix(points.length);
					for (var k = 0; k < points.length - 1; k++) {
						for (var l = k + 1; l < points.length; l++) {
							matrix.setEdge(k, l, dist(points[k], points[l]));
						}
					}
					var tree = Prim(matrix);
					var lines = [];
					for (var z = 0; z < tree.length; z++) {
						lines.push(new OpenLayers.Geometry.LineString(new Array(points[tree[z].v1], points[tree[z].v2])));
					}
					this.connections[j].push({
						first : this.mds.getCircle(j, e[0].index).feature.geometry,
						last : this.mds.getCircle(j, e[e.length - 1].index).feature.geometry,
						lines : lines,
						time : slices[i].date
					});
				}
			}
			var ltm = this.core.timeplot.leftFlagTime;
			var rtm = this.core.timeplot.rightFlagTime;
			if (ltm == undefined || ltm == null) {
				return;
			} else {
				ltm = ltm.getTime();
				rtm = rtm.getTime();
			}
			//        this.connectionLayer.destroyFeatures();
			if (thisConnections) {
				for (var i = 0; i < this.connections.length; i++) {
					var c = GeoTemConfig.colors[i];
					var style = {
						strokeColor : 'rgb(' + c.r1 + ',' + c.g1 + ',' + c.b1 + ')',
						strokeOpacity : 0.5,
						strokeWidth : 3
					};
					var pointsToConnect = [];
					var last = undefined;
					for (var j = 0; j < this.connections[i].length; j++) {
						var c = this.connections[i][j];
						var ct = c.time.getTime();
						if (ct >= ltm && ct <= rtm) {
							if (last != undefined) {
								var line = new OpenLayers.Geometry.LineString(new Array(last, c.first));
								this.connectionLayer.addFeatures([new OpenLayers.Feature.Vector(line, null, style)]);
							}
							for (var k = 0; k < c.lines.length; k++) {
								this.connectionLayer.addFeatures([new OpenLayers.Feature.Vector(c.lines[k], null, style)]);
							}
							last = c.last;
						}
					}
				}
				//            this.connectionLayer.redraw();
			}
		}
	},

	/**
	 * performs a zoom on the map
	 * @param {int} delta the change of zoom levels
	 */
	zoom : function(delta) {
		var zoom = this.openlayersMap.getZoom() + delta;
		if (this.openlayersMap.baseLayer instanceof OpenLayers.Layer.WMS) {
			this.openlayersMap.zoomTo(zoom);
		} else {
			this.openlayersMap.zoomTo(Math.round(zoom));
			if (this.zoomSlider) {
				this.zoomSlider.setValue(this.openlayersMap.getZoom());
			}
		}
		this.drawObjectLayer(false);
		return true;
	},

	deactivateCountrySelector : function() {
		this.openlayersMap.removeControl(this.selectCountry);
		this.selectCountry = undefined;
	},

	activateCountrySelector : function(layer) {
		var map = this;
		if (this.options.countrySelect && this.options.mapSelectionTools) {
			this.selectCountry = new OpenLayers.Control.GetFeature({
				protocol : OpenLayers.Protocol.WFS.fromWMSLayer(layer),
				click : true
			});
			this.selectCountry.events.register("featureselected", this, function(e) {
				map.snapper();
				map.drawnPolygonHandler(e.feature.geometry);
			});
			this.openlayersMap.addControl(this.selectCountry);
			this.countrySelectionControl.enable();
		}
	},

	setMap : function(index) {
		this.baselayerIndex = index;
		if (this.selectCountry) {
			//			if( this.wmsOverlays.length == 0 ){
			this.deactivateCountrySelector();
			//			}
		}
		if (this.baseLayers[index] instanceof OpenLayers.Layer.WMS) {
			//			if( this.wmsOverlays.length == 0 ){
			this.activateCountrySelector(this.baseLayers[index]);
			//			}
		} else {
			if (this.countrySelectionControl) {
				this.countrySelectionControl.disable();
			}
		}
		this.openlayersMap.zoomTo(Math.floor(this.openlayersMap.getZoom()));
		this.openlayersMap.setBaseLayer(this.baseLayers[index]);
		if (this.baseLayers[index].name == 'Open Street Map') {
			this.osmLink.style.visibility = 'visible';
		} else {
			this.osmLink.style.visibility = 'hidden';
		}
	},

	//vhz added title to buttons
	initSelectorTools : function() {
		var map = this;
		this.mapControls = [];

		if (this.options.squareSelect) {
			var button = document.createElement("div");
			$(button).addClass('mapControl');
			var activate = function() {
				map.drawSquare.activate();
			}
			var deactivate = function() {
				map.drawSquare.deactivate();
			}
			this.mapControls.push(new MapControl(this, button, 'square', activate, deactivate));
		}
		if (this.options.circleSelect) {
			var button = document.createElement("div");
			$(button).addClass('mapControl');
			var activate = function() {
				map.drawCircle.activate();
			}
			var deactivate = function() {
				map.drawCircle.deactivate();
			}
			this.mapControls.push(new MapControl(this, button, 'circle', activate, deactivate));
		}
		if (this.options.polygonSelect) {
			var button = document.createElement("div");
			$(button).addClass('mapControl');
			var activate = function() {
				map.drawPolygon.activate();
			}
			var deactivate = function() {
				map.drawPolygon.deactivate();
			}
			this.mapControls.push(new MapControl(this, button, 'polygon', activate, deactivate));
		}
		if (this.options.countrySelect) {
			var button = document.createElement("div");
			$(button).addClass('mapControl');
			var activate = function() {
				map.selectCountry.activate();
				map.dragControl.disable();
			}
			var deactivate = function() {
				map.selectCountry.deactivate();
				map.dragControl.enable();
			}
			this.countrySelectionControl = new MapControl(this, button, 'country', activate, deactivate);
			this.mapControls.push(this.countrySelectionControl);
			/*
			 if( !(this.openlayersMap.baseLayer instanceof OpenLayers.Layer.WMS) ){
			 this.countrySelectionControl.disable();
			 }
			 */
		}
		return this.mapControls;
	},

	getZoom : function() {
		return this.openlayersMap.getZoom();
	},

    centerAndMarkPosition : function() {
        var posSpec = this.options.detailedViewSpec;
        var lon = posSpec.longitude;
        var lat = posSpec.latitude;
        var zoomLevel = posSpec.zoomLevel;
        var markerPath = GeoTemConfig.path + posSpec.marker;
        var markerWidth = posSpec.markerWidth;
        var markerHeight = posSpec.markerHeight;

		var p = new OpenLayers.Geometry.Point(lon, lat, null);
		p.transform(this.openlayersMap.displayProjection, this.openlayersMap.projection);
		this.openlayersMap.setCenter(new OpenLayers.LonLat(p.x, p.y));
		var size = new OpenLayers.Size(markerWidth, markerHeight);
		var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
		var icon = new OpenLayers.Icon(markerPath, size, offset);
		var marker = new OpenLayers.Marker(new OpenLayers.LonLat(p.x, p.y), icon);
		marker.setOpacity(0.9);
		this.markerLayer.setZIndex(parseInt(this.objectLayer.getZIndex()) + 1);
		this.markerLayer.addMarker(marker);

		// set zoom level
        this.openlayersMap.zoomTo(zoomLevel);
        if (this.zoomSlider) {
            this.zoomSlider.setValue(this.openlayersMap.getZoom());
        }
        this.drawObjectLayer(true);
        if (typeof console != "undefined") {
            console.log("openlayers getZoom: " + this.openlayersMap.getZoom());
        };
    },

	setMarker : function(lon, lat) {
		var p = new OpenLayers.Geometry.Point(lon, lat, null);
		p.transform(this.openlayersMap.displayProjection, this.openlayersMap.projection);
		this.openlayersMap.setCenter(new OpenLayers.LonLat(p.x, p.y));
		var size = new OpenLayers.Size(22, 33);
		var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
		var icon = new OpenLayers.Icon(GeoTemConfig.path + 'marker.png', size, offset);
		var marker = new OpenLayers.Marker(new OpenLayers.LonLat(p.x, p.y), icon);
		marker.setOpacity(0.9);
		this.markerLayer.setZIndex(parseInt(this.objectLayer.getZIndex()) + 1);
		this.markerLayer.addMarker(marker);
		// find nearest neighbor
		var nearestNeighbor;
		var points = this.mds.getAllObjects();
		if (points == null) {
			return;
		}
		var dist = function(p1, p2) {
			return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
		}
		var zoomLevels = this.openlayersMap.getNumZoomLevels();
		var pointSet = points[zoomLevels - 1];
		var closestDistance = undefined;
		var closestPoint;
		for (var i = 0; i < pointSet.length; i++) {
			for (var j = 0; j < pointSet[i].length; j++) {
				var point = pointSet[i][j].feature.geometry;
				var d = dist(point, p);
				if (!closestDistance || d < closestDistance) {
					closestDistance = d;
					closestPoint = point;
				}
			}
		}
		// find minimal zoom level
		var gap = 0;
		var x_s = this.gui.mapWindow.offsetWidth / 2 - gap;
		var y_s = this.gui.mapWindow.offsetHeight / 2 - gap;
		var xDist = Math.abs(p.x - closestPoint.x);
		var yDist = Math.abs(p.y - closestPoint.y);
		for (var i = 0; i < zoomLevels; i++) {
			var resolution = this.openlayersMap.getResolutionForZoom(zoomLevels - i - 1);
			if (xDist / resolution < x_s && yDist / resolution < y_s) {
				this.openlayersMap.zoomTo(zoomLevels - i - 1);
				if (this.zoomSlider) {
					this.zoomSlider.setValue(this.openlayersMap.getZoom());
				}
				this.drawObjectLayer(false);
				break;
			}
		}
	},

	removeMarker : function() {
		this.markerLayer.removeMarker(this.markerLayer.markers[0]);
	},

	getLevelOfDetail : function() {
		var zoom = Math.floor(this.openlayersMap.getZoom());
		if (zoom <= 1) {
			return 0;
		} else if (zoom <= 3) {
			return 1;
		} else if (zoom <= 8) {
			return 2;
		} else {
			return 3;
		}
	}
}
/*
* DataObject.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class DataObject
 * GeoTemCo's data object class
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {String} name name of the data object
 * @param {String} description description of the data object
 * @param {JSON} locations a list of locations with longitude, latitide and place name
 * @param {JSON} dates a list of dates
 * @param {float} lon longitude value of the given place
 * @param {float} lat latitude value of the given place
 * @param {Date} timeStart start time of the data object
 * @param {Date} timeEnd end time of the data object
 * @param {int} granularity granularity of the given time
 * @param {int} weight weight of the time object
 */

function DataObject(name, description, locations, dates, weight, tableContent) {

	this.name = name;
	this.description = description;
	this.weight = weight;
	this.tableContent = tableContent;

	this.percentage = 0;
	this.setPercentage = function(percentage) {
		this.percentage = percentage;
	}

	this.locations = locations;
	this.isGeospatial = false;
	if (this.locations.length > 0) {
		this.isGeospatial = true;
	}

	this.placeDetails = [];
	for (var i = 0; i < this.locations.length; i++) {
		this.placeDetails.push(this.locations[i].place.split("/"));
	}

	this.getLatitude = function(locationId) {
		return this.locations[locationId].latitude;
	}

	this.getLongitude = function(locationId) {
		return this.locations[locationId].longitude;
	}

	this.getPlace = function(locationId, level) {
		if (level >= this.placeDetails[locationId].length) {
			return this.placeDetails[locationId][this.placeDetails[locationId].length - 1];
		}
		return this.placeDetails[locationId][level];
	}

	this.dates = dates;
	this.isTemporal = false;
	if (this.dates.length > 0) {
		this.isTemporal = true;
	}

	this.getDate = function(dateId) {
		return this.dates[dateId].date;
	}

	this.getTimeGranularity = function(dateId) {
		return this.dates[dateId].granularity;
	}

	this.setIndex = function(index) {
		this.index = index;
	}

	this.getTimeString = function() {
		if (this.timeStart != this.timeEnd) {
			return (SimileAjax.DateTime.getTimeString(this.granularity, this.timeStart) + " - " + SimileAjax.DateTime.getTimeString(this.granularity, this.timeEnd));
		} else {
			return SimileAjax.DateTime.getTimeString(this.granularity, this.timeStart) + "";
		}
	};

};
/*
* Dataset.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class Dataset
 * GeoTemCo's Dataset class
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {Array} objects data item arrays from different datasets
 * @param {String} label label for the datasets
 */
function Dataset(objects, label) {

	this.objects = objects;
	this.label = label;

}
/*
* Binning.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class Binning
 * Calculates map aggregation with several binning algorithms
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
Binning = function(map, options) {

	this.map = map;
	this.options = options;
	this.reset();

};

Binning.prototype = {

	getSet : function() {
		var type = this.options.binning;
		if (!type) {
			return this.getExactBinning();
		} else if (type == 'generic') {
			return this.getGenericBinning();
		} else if (type == 'square') {
			return this.getSquareBinning();
		} else if (type == 'hexagonal') {
			return this.getHexagonalBinning();
		} else if (type == 'triangular') {
			return this.getTriangularBinning();
		}
	},

	getExactBinning : function() {
		if ( typeof this.binnings['exact'] == 'undefined') {
			this.exactBinning();
		}
		return this.binnings['exact'];
	},

	getGenericBinning : function() {
		if ( typeof this.binnings['generic'] == 'undefined') {
			this.genericBinning();
		}
		return this.binnings['generic'];
	},

	getSquareBinning : function() {
		if ( typeof this.binnings['square'] == 'undefined') {
			this.squareBinning();
		}
		return this.binnings['square'];
	},

	getHexagonalBinning : function() {
		if ( typeof this.binnings['hexagonal'] == 'undefined') {
			this.hexagonalBinning();
		}
		return this.binnings['hexagonal'];
	},

	getTriangularBinning : function() {
		if ( typeof this.binnings['triangular'] == 'undefined') {
			this.triangularBinning();
		}
		return this.binnings['triangular'];
	},

	reset : function() {
		this.zoomLevels = this.map.getNumZoomLevels();
		this.binnings = [];
		this.minimumRadius = this.options.minimumRadius;
		this.maximumRadius = 0;
		this.maximumPoints = 0;
		this.minArea = 0;
		this.maxArea = 0;
	},

	getMaxRadius : function(size) {
		return 4 * Math.log(size) / Math.log(2);
	},

	setObjects : function(objects) {
		this.objects = objects;
		for (var i = 0; i < this.objects.length; i++) {
			var weight = 0;
			for (var j = 0; j < this.objects[i].length; j++) {
				if (this.objects[i][j].isGeospatial) {
					weight += this.objects[i][j].weight;
				}
			}
			var r = this.getMaxRadius(weight);
			if (r > this.maximumRadius) {
				this.maximumRadius = r;
				this.maximumPoints = weight;
				this.maxArea = Math.PI * this.maximumRadius * this.maximumRadius;
				this.minArea = Math.PI * this.minimumRadius * this.minimumRadius;
			}
		}
	},

	dist : function(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	},

	exactBinning : function() {
		var circleSets = [];
		var hashMaps = [];
		var selectionHashs = [];

		var circleAggregates = [];
		var bins = [];
		for (var i = 0; i < this.objects.length; i++) {
			bins.push([]);
			circleAggregates.push([]);
			for (var j = 0; j < this.objects[i].length; j++) {
				var o = this.objects[i][j];
				if (o.isGeospatial) {
					if ( typeof circleAggregates[i]['' + o.getLongitude(this.options.mapIndex)] == 'undefined') {
						circleAggregates[i]['' + o.getLongitude(this.options.mapIndex)] = [];
					}
					if ( typeof circleAggregates[i][''+o.getLongitude(this.options.mapIndex)]['' + o.getLatitude(this.options.mapIndex)] == 'undefined') {
						circleAggregates[i][''+o.getLongitude(this.options.mapIndex)]['' + o.getLatitude(this.options.mapIndex)] = [];
						bins[i].push(circleAggregates[i][''+o.getLongitude(this.options.mapIndex)]['' + o.getLatitude(this.options.mapIndex)]);
					}
					circleAggregates[i][''+o.getLongitude(this.options.mapIndex)]['' + o.getLatitude(this.options.mapIndex)].push(o);
				}
			}
		}

		var circles = [];
		var hashMap = [];
		var selectionMap = [];
		for (var i = 0; i < bins.length; i++) {
			circles.push([]);
			hashMap.push([]);
			selectionMap.push([]);
			for (var j = 0; j < bins[i].length; j++) {
				var bin = bins[i][j];
				var p = new OpenLayers.Geometry.Point(bin[0].getLongitude(this.options.mapIndex), bin[0].getLatitude(this.options.mapIndex), null);
				p.transform(this.map.displayProjection, this.map.projection);
				var weight = 0;
				for (var z = 0; z < bin.length; z++) {
					weight += bin[z].weight;
				}
				var radius = this.options.minimumRadius;
				if (this.options.noBinningRadii == 'dynamic') {
					radius = this.getRadius(weight);
				}
				var circle = new CircleObject(p.x, p.y, 0, 0, bin, radius, i, weight);
				circles[i].push(circle);
				for (var z = 0; z < bin.length; z++) {
					hashMap[i][bin[z].index] = circle;
					selectionMap[i][bin[z].index] = false;
				}
			}
		}
		for (var k = 0; k < this.zoomLevels; k++) {
			circleSets.push(circles);
			hashMaps.push(hashMap);
			selectionHashs.push(selectionMap);
		}
		this.binnings['exact'] = {
			circleSets : circleSets,
			hashMaps : hashMaps,
			selectionHashs : selectionHashs
		};
	},

	genericClustering : function(objects, id) {
		var binSets = [];
		var circleSets = [];
		var hashMaps = [];
		var selectionHashs = [];
		var clustering = new Clustering(-20037508.34, -20037508.34, 20037508.34, 20037508.34);
		for (var i = 0; i < objects.length; i++) {
			for (var j = 0; j < objects[i].length; j++) {
				var o = objects[i][j];
				if (o.isGeospatial) {
					var p = new OpenLayers.Geometry.Point(o.getLongitude(this.options.mapIndex), o.getLatitude(this.options.mapIndex), null);
					p.transform(this.map.displayProjection, this.map.projection);
					var point = new Vertex(Math.floor(p.x), Math.floor(p.y), objects.length, this);
					point.addElement(o, o.weight, i);
					clustering.add(point);
				}
			}
		}

		for (var i = 0; i < this.zoomLevels; i++) {
			var bins = [];
			var circles = [];
			var hashMap = [];
			var selectionMap = [];
			for (var j = 0; j < objects.length; j++) {
				circles.push([]);
				hashMap.push([]);
				selectionMap.push([]);
			}
			var resolution = this.map.getResolutionForZoom(this.zoomLevels - i - 1);
			clustering.mergeForResolution(resolution, this.options.circleGap);
			for (var j = 0; j < clustering.vertices.length; j++) {
				var point = clustering.vertices[j];
				if (!point.legal) {
					continue;
				}
				var balls = [];
				for (var k = 0; k < point.elements.length; k++) {
					if (point.elements[k].length > 0) {
						balls.push({
							search : k,
							elements : point.elements[k],
							radius : point.radii[k],
							weight : point.weights[k]
						});
					}
				}
				var orderBalls = function(b1, b2) {
					if (b1.radius > b2.radius) {
						return -1;
					}
					if (b2.radius > b1.radius) {
						return 1;
					}
					return 0;
				}
				var fatherBin = {
					circles : [],
					length : 0,
					radius : point.radius / resolution,
					x : point.x,
					y : point.y
				};
				for (var k = 0; k < objects.length; k++) {
					fatherBin.circles.push(false);
				}
				var createCircle = function(sx, sy, ball) {
					var index = id || ball.search;
					var circle = new CircleObject(point.x, point.y, sx, sy, ball.elements, ball.radius, index, ball.weight, fatherBin);
					circles[ball.search].push(circle);
					fatherBin.circles[index] = circle;
					fatherBin.length++;
					for (var k = 0; k < ball.elements.length; k++) {
						hashMap[ball.search][ball.elements[k].index] = circle;
						selectionMap[ball.search][ball.elements[k].index] = false;
					}
				}
				if (balls.length == 1) {
					createCircle(0, 0, balls[0]);
				} else if (balls.length == 2) {
					var r1 = balls[0].radius;
					var r2 = balls[1].radius;
					createCircle(-1 * r2, 0, balls[0]);
					createCircle(r1, 0, balls[1]);
				} else if (balls.length == 3) {
					balls.sort(orderBalls);
					var r1 = balls[0].radius;
					var r2 = balls[1].radius;
					var r3 = balls[2].radius;
					var d = ((2 / 3 * Math.sqrt(3) - 1) / 2) * r2;
					var delta1 = point.radius / resolution - r1 - d;
					var delta2 = r1 - delta1;
					createCircle(-delta1, 0, balls[0]);
					createCircle(delta2 + r2 - 3 * d, r2, balls[1]);
					createCircle(delta2 + r3 - (3 * d * r3 / r2), -1 * r3, balls[2]);
				} else if (balls.length == 4) {
					balls.sort(orderBalls);
					var r1 = balls[0].radius;
					var r2 = balls[1].radius;
					var r3 = balls[2].radius;
					var r4 = balls[3].radius;
					var d = (Math.sqrt(2) - 1) * r2;
					createCircle(-1 * d - r2, 0, balls[0]);
					createCircle(r1 - r2, -1 * d - r4, balls[3]);
					createCircle(r1 - r2, d + r3, balls[2]);
					createCircle(d + r1, 0, balls[1]);
				}
				if (fatherBin.length > 1) {
					bins.push(fatherBin);
				}
			}
			circleSets.push(circles);
			binSets.push(bins);
			hashMaps.push(hashMap);
			selectionHashs.push(selectionMap);
		}
		circleSets.reverse();
		binSets.reverse();
		hashMaps.reverse();
		selectionHashs.reverse();
		return {
			circleSets : circleSets,
			binSets : binSets,
			hashMaps : hashMaps,
			selectionHashs : selectionHashs
		};
	},

	genericBinning : function() {
		if (this.options.circlePackings || this.objects.length == 1) {
			this.binnings['generic'] = this.genericClustering(this.objects);
		} else {
			var circleSets = [];
			var hashMaps = [];
			var selectionHashs = [];
			for (var i = 0; i < this.objects.length; i++) {
				var sets = this.genericClustering([this.objects[i]], i);
				if (i == 0) {
					circleSets = sets.circleSets;
					hashMaps = sets.hashMaps;
					selectionHashs = sets.selectionHashs;
				} else {
					for (var j = 0; j < circleSets.length; j++) {
						circleSets[j] = circleSets[j].concat(sets.circleSets[j]);
						hashMaps[j] = hashMaps[j].concat(sets.hashMaps[j]);
						selectionHashs[j] = selectionHashs[j].concat(sets.selectionHashs[j]);
					}
				}
			}
			this.binnings['generic'] = {
				circleSets : circleSets,
				hashMaps : hashMaps,
				selectionHashs : selectionHashs
			};
		}
	},

	getRadius : function(n) {
		if (n == 0) {
			return 0;
		}
		if (n == 1) {
			return this.minimumRadius;
		}
		return Math.sqrt((this.minArea + (this.maxArea - this.minArea) / (this.maximumPoints - 1) * (n - 1) ) / Math.PI);
	},

	getBinRadius : function(n, r_max, N) {
		if (n == 0) {
			return 0;
		}
		/*
		function log2(x) {
			return (Math.log(x)) / (Math.log(2));
		}
		var r0 = this.options.minimumRadius;
		var r;
		if ( typeof r_max == 'undefined') {
			return r0 + n / Math.sqrt(this.options.maximumPoints);
		}
		return r0 + (r_max - r0 ) * log2(n) / log2(N);
		*/
		var minArea = Math.PI * this.options.minimumRadius * this.options.minimumRadius;
		var maxArea = Math.PI * r_max * r_max;
		return Math.sqrt((minArea + (maxArea - minArea) / (N - 1) * (n - 1) ) / Math.PI);
	},

	shift : function(type, bin, radius, elements) {

		var x1 = bin.x, x2 = 0;
		var y1 = bin.y, y2 = 0;
		for (var i = 0; i < elements.length; i++) {
			x2 += elements[i].x / elements.length;
			y2 += elements[i].y / elements.length;
		}

		var sx = 0, sy = 0;

		if (type == 'square') {
			var dx = Math.abs(x2 - x1);
			var dy = Math.abs(y2 - y1);
			var m = dy / dx;
			var n = y1 - m * x1;
			if (dx > dy) {
				sx = bin.x - (x1 + bin.r - radius );
				sy = bin.y - (m * bin.x + n );
			} else {
				sy = bin.y - (y1 + bin.r - radius );
				sx = bin.x - (bin.y - n) / m;
			}
		}

		return {
			x : sx,
			y : sy
		};

	},

	binSize : function(elements) {
		var size = 0;
		for (var i in elements ) {
			size += elements[i].weight;
		}
		return size;
	},

	setCircleSet : function(id, binData) {
		var circleSets = [];
		var hashMaps = [];
		var selectionHashs = [];
		for (var i = 0; i < binData.length; i++) {
			var circles = [];
			var hashMap = [];
			var selectionMap = [];
			for (var j = 0; j < this.objects.length; j++) {
				circles.push([]);
				hashMap.push([]);
				selectionMap.push([]);
			}
			var points = [];
			var max = 0;
			var radius = 0;
			var resolution = this.map.getResolutionForZoom(i);
			for (var j = 0; j < binData[i].length; j++) {
				for (var k = 0; k < binData[i][j].bin.length; k++) {
					var bs = this.binSize(binData[i][j].bin[k]);
					if (bs > max) {
						max = bs;
						radius = binData[i][j].r / resolution;
					}
				}
			}
			for (var j = 0; j < binData[i].length; j++) {
				var bin = binData[i][j];
				for (var k = 0; k < bin.bin.length; k++) {
					if (bin.bin[k].length == 0) {
						continue;
					}
					var weight = this.binSize(bin.bin[k]);
					var r = this.getBinRadius(weight, radius, max);
					var shift = this.shift(id, bin, r * resolution, bin.bin[k], i);
					var circle = new CircleObject(bin.x - shift.x, bin.y - shift.y, 0, 0, bin.bin[k], r, k, weight);
					circles[k].push(circle);
					for (var z = 0; z < bin.bin[k].length; z++) {
						hashMap[k][bin.bin[k][z].index] = circle;
						selectionMap[k][bin.bin[k][z].index] = false;
					}
				}
			}
			circleSets.push(circles);
			hashMaps.push(hashMap);
			selectionHashs.push(selectionMap);
		}
		this.binnings[id] = {
			circleSets : circleSets,
			hashMaps : hashMaps,
			selectionHashs : selectionHashs
		};
	},

	squareBinning : function() {

		var l = 20037508.34;
		var area0 = l * l * 4;
		var binCount = this.options.binCount;

		var bins = [];
		var binData = [];
		for (var k = 0; k < this.zoomLevels; k++) {
			bins.push([]);
			binData.push([]);
		}

		for (var i = 0; i < this.objects.length; i++) {
			for (var j = 0; j < this.objects[i].length; j++) {
				var o = this.objects[i][j];
				if (!o.isGeospatial) {
					continue;
				}
				var p = new OpenLayers.Geometry.Point(o.getLongitude(this.options.mapIndex), o.getLatitude(this.options.mapIndex), null);
				p.transform(this.map.displayProjection, this.map.projection);
				o.x = p.x;
				o.y = p.y;
				for (var k = 0; k < this.zoomLevels; k++) {
					var bc = binCount * Math.pow(2, k);
					var a = 2 * l / bc;
					var binX = Math.floor((p.x + l) / (2 * l) * bc);
					var binY = Math.floor((p.y + l) / (2 * l) * bc);
					if ( typeof bins[k]['' + binX] == 'undefined') {
						bins[k]['' + binX] = [];
					}
					if ( typeof bins[k][''+binX]['' + binY] == 'undefined') {
						bins[k][''+binX]['' + binY] = [];
						for (var z = 0; z < this.objects.length; z++) {
							bins[k][''+binX]['' + binY].push([]);
						}
						var x = binX * a + a / 2 - l;
						var y = binY * a + a / 2 - l;
						binData[k].push({
							bin : bins[k][''+binX]['' + binY],
							x : x,
							y : y,
							a : a,
							r : a / 2
						});
					}
					bins[k][''+binX][''+binY][i].push(o);
				}
			}
		}

		this.setCircleSet('square', binData);

	},

	triangularBinning : function() {

		var l = 20037508.34;
		var a0 = this.options.binCount;
		var a1 = Math.sqrt(4 * a0 * a0 / Math.sqrt(3));
		var binCount = a0 / a1 * a0;

		var bins = [];
		var binData = [];
		for (var k = 0; k < this.zoomLevels; k++) {
			bins.push([]);
			binData.push([]);
		}

		for (var i = 0; i < this.objects.length; i++) {
			for (var j = 0; j < this.objects[i].length; j++) {
				var o = this.objects[i][j];
				if (!o.isGeospatial) {
					continue;
				}
				var p = new OpenLayers.Geometry.Point(o.getLongitude(this.options.mapIndex), o.getLatitude(this.options.mapIndex), null);
				p.transform(this.map.displayProjection, this.map.projection);
				o.x = p.x;
				o.y = p.y;
				for (var k = 0; k < this.zoomLevels; k++) {
					var x_bc = binCount * Math.pow(2, k);
					var y_bc = x_bc * x_bc / Math.sqrt(x_bc * x_bc - x_bc * x_bc / 4);
					var a = 2 * l / x_bc;
					var h = 2 * l / y_bc;
					var binY = Math.floor((p.y + l) / (2 * l) * y_bc);
					if ( typeof bins[k]['' + binY] == 'undefined') {
						bins[k]['' + binY] = [];
					}
					var triangleIndex;
					var partitionsX = x_bc * 2;
					var partition = Math.floor((p.x + l) / (2 * l) * partitionsX);
					var xMax = a / 2;
					var yMax = h;
					var x = p.x + l - partition * a / 2;
					var y = p.y + l - binY * h;
					if (binY % 2 == 0 && partition % 2 == 1 || binY % 2 == 1 && partition % 2 == 0) {
						if (y + yMax / xMax * x < yMax) {
							triangleIndex = partition;
						} else {
							triangleIndex = partition + 1;
						}
					} else {
						if (y > yMax / xMax * x) {
							triangleIndex = partition;
						} else {
							triangleIndex = partition + 1;
						}
					}
					if ( typeof bins[k][''+binY]['' + triangleIndex] == 'undefined') {
						bins[k][''+binY]['' + triangleIndex] = [];
						for (var z = 0; z < this.objects.length; z++) {
							bins[k][''+binY]['' + triangleIndex].push([]);
						}
						var r = Math.sqrt(3) / 6 * a;
						var x = (triangleIndex - 1) * a / 2 + a / 2 - l;
						var y;
						if (binY % 2 == 0 && triangleIndex % 2 == 0 || binY % 2 == 1 && triangleIndex % 2 == 1) {
							y = binY * h + h - r - l;
						} else {
							y = binY * h + r - l;
						}
						binData[k].push({
							bin : bins[k][''+binY]['' + triangleIndex],
							x : x,
							y : y,
							a : a,
							r : r
						});
					}
					bins[k][''+binY][''+triangleIndex][i].push(o);
				}
			}
		}

		this.setCircleSet('triangular', binData);

	},

	hexagonalBinning : function() {

		var l = 20037508.34;
		var a0 = this.options.binCount;
		var a2 = Math.sqrt(4 * a0 * a0 / Math.sqrt(3)) / Math.sqrt(6);
		var binCount = a0 / a2 * a0;

		var bins = [];
		var binData = [];
		for (var k = 0; k < this.zoomLevels; k++) {
			bins.push([]);
			binData.push([]);
		}

		for (var i = 0; i < this.objects.length; i++) {
			for (var j = 0; j < this.objects[i].length; j++) {
				var o = this.objects[i][j];
				if (!o.isGeospatial) {
					continue;
				}
				var p = new OpenLayers.Geometry.Point(o.getLongitude(this.options.mapIndex), o.getLatitude(this.options.mapIndex), null);
				p.transform(this.map.displayProjection, this.map.projection);
				o.x = p.x;
				o.y = p.y;
				for (var k = 0; k < this.zoomLevels; k++) {
					var x_bc = binCount * Math.pow(2, k);
					var y_bc = x_bc * x_bc / Math.sqrt(x_bc * x_bc - x_bc * x_bc / 4);
					var a = 2 * l / x_bc;
					var h = 2 * l / y_bc;
					var binY = Math.floor((p.y + l) / (2 * l) * y_bc);
					if ( typeof bins[k]['' + binY] == 'undefined') {
						bins[k]['' + binY] = [];
					}
					var triangleIndex;
					var partitionsX = x_bc * 2;
					var partition = Math.floor((p.x + l) / (2 * l) * partitionsX);
					var xMax = a / 2;
					var yMax = h;
					var x = p.x + l - partition * a / 2;
					var y = p.y + l - binY * h;
					if (binY % 2 == 0 && partition % 2 == 1 || binY % 2 == 1 && partition % 2 == 0) {
						if (y + yMax / xMax * x < yMax) {
							triangleIndex = partition;
						} else {
							triangleIndex = partition + 1;
						}
					} else {
						if (y > yMax / xMax * x) {
							triangleIndex = partition;
						} else {
							triangleIndex = partition + 1;
						}
					}
					if ( typeof bins[k][''+binY]['' + triangleIndex] == 'undefined') {
						bins[k][''+binY]['' + triangleIndex] = [];
						for (var z = 0; z < this.objects.length; z++) {
							bins[k][''+binY]['' + triangleIndex].push([]);
						}
						var r = Math.sqrt(3) / 6 * a;
						var x = (triangleIndex - 1) * a / 2 + a / 2 - l;
						var y;
						if (binY % 2 == 0 && triangleIndex % 2 == 0 || binY % 2 == 1 && triangleIndex % 2 == 1) {
							y = binY * h + h - r - l;
						} else {
							y = binY * h + r - l;
						}
						binData[k].push({
							bin : bins[k][''+binY]['' + triangleIndex],
							x : x,
							y : y,
							a : a,
							r : r,
							h : h,
							binX : triangleIndex,
							binY : binY
						});
					}
					bins[k][''+binY][''+triangleIndex][i].push(o);
				}
			}
		}

		var hexaBins = [];
		var hexaBinData = [];
		for (var k = 0; k < this.zoomLevels; k++) {
			hexaBins.push([]);
			hexaBinData.push([]);
		}

		for (var i = 0; i < binData.length; i++) {
			for (var j = 0; j < binData[i].length; j++) {
				var bin = binData[i][j];
				var binY = Math.floor(bin.binY / 2);
				var binX = Math.floor(bin.binX / 3);
				var x, y;
				var a = bin.a;
				var h = bin.h;
				if (bin.binX % 6 < 3) {
					if ( typeof hexaBins[i]['' + binY] == 'undefined') {
						hexaBins[i]['' + binY] = [];
					}
					y = binY * 2 * bin.h + bin.h - l;
					x = binX * 1.5 * bin.a + a / 2 - l;
				} else {
					if (bin.binY % 2 == 1) {
						binY++;
					}
					if ( typeof hexaBins[i]['' + binY] == 'undefined') {
						hexaBins[i]['' + binY] = [];
					}
					y = binY * 2 * bin.h - l;
					x = binX * 1.5 * bin.a + a / 2 - l;
				}
				if ( typeof hexaBins[i][''+binY]['' + binX] == 'undefined') {
					hexaBins[i][''+binY]['' + binX] = [];
					for (var z = 0; z < this.objects.length; z++) {
						hexaBins[i][''+binY]['' + binX].push([]);
					}
					hexaBinData[i].push({
						bin : hexaBins[i][''+binY]['' + binX],
						x : x,
						y : y,
						a : bin.a,
						r : bin.h
					});
				}
				for (var k = 0; k < bin.bin.length; k++) {
					for (var m = 0; m < bin.bin[k].length; m++) {
						hexaBins[i][''+binY][''+binX][k].push(bin.bin[k][m]);
					}
				}
			}
		}

		this.setCircleSet('hexagonal', hexaBinData);

	}
}

/*
* MapDataSource.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapDataSource
 * implementation for aggregation of map items
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {OpenLayers.Map} olMap openlayers map object of the map widget
 * @param {JSON} options map configuration
 */
function MapDataSource(olMap, options) {

	this.olMap = olMap;
	this.circleSets = [];
	this.binning = new Binning(olMap, options);

};

MapDataSource.prototype = {

	/**
	 * initializes the MapDataSource
	 * @param {MapObject[][]} mapObjects an array of map objects of different sets
	 */
	initialize : function(mapObjects) {

		if (mapObjects != this.mapObjects) {
			this.binning.reset();
			this.binning.setObjects(mapObjects);
		}
		this.mapObjects = mapObjects;

        var time0 = (new Date()).getTime();
		var set = this.binning.getSet();
		this.circleSets = set.circleSets;
		this.binSets = set.binSets;
		this.hashMapping = set.hashMaps;

        timeCluster = (new Date()).getTime();
        var timeClusterInfo = (this.mapObjects[0].length +
                               " elements clustered in " + (timeCluster - time0) + "ms");
// XXXXX   alert(timeClusterInfo);
        if (typeof console != 'undefined') {
            console.log(timeClusterInfo);
        }
    

    },

	getObjectsByZoom : function() {
		var zoom = Math.floor(this.olMap.getZoom());
		if (this.circleSets.length < zoom) {
			return null;
		}
		return this.circleSets[zoom];
	},

	getAllObjects : function() {
		if (this.circleSets.length == 0) {
			return null;
		}
		return this.circleSets;
	},

	getAllBins : function() {
		if (this.binSets.length == 0) {
			return null;
		}
		return this.binSets;
	},

	clearOverlay : function() {
		var zoom = Math.floor(this.olMap.getZoom());
		var circles = this.circleSets[zoom];
		for (var i in circles ) {
			for (var j in circles[i] ) {
				circles[i][j].reset();
			}
		}
	},

	setOverlay : function(mapObjects) {
		var zoom = Math.floor(this.olMap.getZoom());
		for (var j in mapObjects ) {
			for (var k in mapObjects[j] ) {
				var o = mapObjects[j][k];
				if (o.isGeospatial) {
					this.hashMapping[zoom][j][o.index].overlay += o.weight;
				}
			}
		}
	},

	size : function() {
		if (this.circleSets.length == 0) {
			return 0;
		}
		return this.circleSets[0].length;
	},

	getCircle : function(index, id) {
		var zoom = Math.floor(this.olMap.getZoom());
		return this.hashMapping[zoom][index][id];
	}
};
/*
* Clustering.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class Vertex, Edge, Triangle, Clustering, BinaryHeap
 * Dynamic Delaunay clustering algorithm (see GeoTemCo paper)
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */

function Vertex(x, y, categories, binning) {
	this.x = x;
	this.y = y;
	this.radius
	this.size = 0;
	this.elements = [];
	this.radii = [];
	this.weights = [];
	this.legal = true;
	this.binning = binning;
	if (categories != undefined) {
		for (var i = 0; i < categories; i++) {
			this.elements.push([]);
			this.weights.push(0);
		}
	}
}

Vertex.prototype.merge = function(v0, v1) {
	for (var i = 0; i < v0.elements.length; i++) {
		this.elements[i] = v0.elements[i].concat(v1.elements[i]);
		this.weights[i] = v0.weights[i] + v1.weights[i];
		this.size += this.weights[i];
	}
}

Vertex.prototype.CalculateRadius = function(resolution) {
	this.radii = [];
	for (i in this.elements ) {
		this.radii.push(this.binning.getRadius(this.weights[i]));
	}
	if (this.radii.length == 1) {
		this.radius = this.radii[0] * resolution;
	} else {
		var count = 0;
		var max1 = 0;
		var max2 = 0;
		for (i in this.radii ) {
			if (this.radii[i] != 0) {
				count++;
			}
			if (this.radii[i] > max1) {
				if (max1 > max2) {
					max2 = max1;
				}
				max1 = this.radii[i];
			} else if (this.radii[i] > max2) {
				max2 = this.radii[i];
			}
		}
		if (count == 1) {
			this.radius = max1 * resolution;
		} else if (count == 2) {
			this.radius = (max1 + max2) * resolution;
		} else if (count == 3) {
			var d = (2 / 3 * Math.sqrt(3) - 1) * max1;
			this.radius = (d + max1 + max2) * resolution;
		} else if (count == 4) {
			var d = (Math.sqrt(2) - 1) * max2;
			this.radius = (d + max1 + max2) * resolution;
		}
	}
}

Vertex.prototype.addElement = function(e, weight, index) {
	this.elements[index].push(e);
	this.size += weight;
	this.weights[index] += weight;
}
function Edge(v0, v1) {
	this.v0 = v0;
	this.v1 = v1;
	this.leftFace
	this.rightFace
	this.legal = true;
	this.setLength();
}

Edge.prototype.setLength = function() {
	var dx = this.v0.x - this.v1.x;
	var dy = this.v0.y - this.v1.y;
	this.length = Math.sqrt(dx * dx + dy * dy);
}

Edge.prototype.contains = function(v) {
	if (this.v0 == v || this.v1 == v) {
		return true;
	}
	return false;
}

Edge.prototype.replaceFace = function(f_old, f_new) {
	if (this.leftFace == f_old) {
		this.leftFace = f_new;
	} else if (this.rightFace == f_old) {
		this.rightFace = f_new;
	}
}

Edge.prototype.setFace = function(f) {
	if (f.leftOf(this)) {
		this.leftFace = f;
	} else {
		this.rightFace = f;
	}
}

Edge.prototype.setFaces = function(f1, f2) {
	if (f1.leftOf(this)) {
		this.leftFace = f1;
		this.rightFace = f2;
	} else {
		this.leftFace = f2;
		this.rightFace = f1;
	}
}

Edge.prototype.removeFace = function(f) {
	if (this.leftFace == f) {
		this.leftFace = null;
	} else {
		this.rightFace = null;
	}
}

Edge.prototype.equals = function(e) {
	if (this.v0 == e.v0 && this.v1 == e.v1 || this.v0 == e.v1 && this.v1 == e.v0) {
		return true;
	}
	return false;
}
function Triangle(edges) {
	this.edges = edges;
	this.setVertices();
	this.descendants = [];
}

Triangle.prototype.getTriple = function(e) {
	var i = arrayIndex(this.edges, e);
	return {
		e_s : this.edges[(i + 1) % 3],
		e_p : this.edges[(i + 2) % 3],
		u : this.vertices[(i + 2) % 3]
	};
}

Triangle.prototype.leftOf = function(e) {
	var i = arrayIndex(this.edges, e);
	if (this.vertices[i].y != this.vertices[(i + 1) % 3].y) {
		return this.vertices[i].y > this.vertices[(i + 1) % 3].y;
	}
	return this.vertices[i].y > this.vertices[(i + 2) % 3].y;
}

Triangle.prototype.getNext = function(v) {
	var i = arrayIndex(this.vertices, v);
	return this.vertices[(i + 1) % 3];
}

Triangle.prototype.oppositeEdge = function(v) {
	var i = arrayIndex(this.vertices, v);
	return this.edges[(i + 1) % 3];
}

Triangle.prototype.contains = function(v) {
	return arrayIndex(this.vertices, v) != -1;
}

Triangle.prototype.replace = function(e_old, e_new) {
	this.edges[arrayIndex(this.edges, e_old)] = e_new;
}

Triangle.prototype.setVertices = function() {
	if (this.edges[1].v0 == this.edges[0].v0 || this.edges[1].v1 == this.edges[0].v0) {
		this.vertices = [this.edges[0].v1, this.edges[0].v0];
	} else {
		this.vertices = [this.edges[0].v0, this.edges[0].v1];
	}
	if (this.edges[2].v0 == this.vertices[0]) {
		this.vertices.push(this.edges[2].v1);
	} else {
		this.vertices.push(this.edges[2].v0);
	}
}

Triangle.prototype.replaceBy = function(triangles) {
	this.descendants = triangles;
	this.edges[0].replaceFace(this, triangles[0]);
	this.edges[1].replaceFace(this, triangles[1]);
	this.edges[2].replaceFace(this, triangles[2]);
}

Triangle.prototype.CalcCircumcircle = function() {
	var v0 = this.vertices[0];
	var v1 = this.vertices[1];
	var v2 = this.vertices[2];
	var A = v1.x - v0.x;
	var B = v1.y - v0.y;
	var C = v2.x - v0.x;
	var D = v2.y - v0.y;
	var E = A * (v0.x + v1.x) + B * (v0.y + v1.y);
	var F = C * (v0.x + v2.x) + D * (v0.y + v2.y);
	var G = 2.0 * (A * (v2.y - v1.y) - B * (v2.x - v1.x));
	var cx = (D * E - B * F) / G;
	var cy = (A * F - C * E) / G;
	this.center = new Vertex(cx, cy);
	var dx = this.center.x - v0.x;
	var dy = this.center.y - v0.y;
	this.radius_squared = dx * dx + dy * dy;
};

Triangle.prototype.inCircumcircle = function(v) {
	if (this.radius_squared == undefined) {
		this.CalcCircumcircle();
	}
	var dx = this.center.x - v.x;
	var dy = this.center.y - v.y;
	var dist_squared = dx * dx + dy * dy;
	return (dist_squared <= this.radius_squared );
};

Triangle.prototype.interior = function(v) {
	var v0 = this.vertices[0];
	var v1 = this.vertices[1];
	var v2 = this.vertices[2];
	var dotAB = (v.x - v0.x ) * (v0.y - v1.y ) + (v.y - v0.y ) * (v1.x - v0.x );
	var dotBC = (v.x - v1.x ) * (v1.y - v2.y ) + (v.y - v1.y ) * (v2.x - v1.x );
	var dotCA = (v.x - v2.x ) * (v2.y - v0.y ) + (v.y - v2.y ) * (v0.x - v2.x );
	if (dotAB > 0 || dotBC > 0 || dotCA > 0) {
		return null;
	} else if (dotAB < 0 && dotBC < 0 && dotCA < 0) {
		return this;
	} else if (dotAB == 0) {
		if (dotBC == 0) {
			return this.vertices[1];
		} else if (dotCA == 0) {
			return this.vertices[0];
		}
		return this.edges[0];
	} else if (dotBC == 0) {
		if (dotCA == 0) {
			return this.vertices[2];
		}
		return this.edges[1];
	} else if (dotCA == 0) {
		return this.edges[2];
	}
};

function Clustering(xMin, yMin, xMax, yMax) {
	this.triangles = [];
	this.newTriangles = [];
	this.bbox = {
		x1 : xMin,
		y1 : yMin,
		x2 : xMax,
		y2 : yMax
	};
	this.CreateBoundingTriangle();
	this.edges = [];
	this.vertices = [];
	this.legalizes = 0;
	this.collapses = 0;
}

Clustering.prototype.locate = function(v) {
	if (this.boundingTriangle.descendants.length == 0) {
		return this.boundingTriangle;
	}
	var triangles = this.boundingTriangle.descendants;
	while (true) {
		for (var i = 0; i < triangles.length; i++) {
			var simplex = triangles[i].interior(v);
			if (simplex == null) {
				continue;
			}
			if ( simplex instanceof Vertex || this.isLeaf(triangles[i])) {
				return simplex;
			}
			triangles = triangles[i].descendants;
			break;
		}
	}
}

Clustering.prototype.legalize = function(v, e, t0_old) {
	if (!e.v0.legal && !e.v1.legal) {
		return;
	}
	this.legalizes++;
	var flip = false;
	var t1_old, tr1;
	if (e.leftFace == t0_old && e.rightFace.inCircumcircle(v)) {
		flip = true;
		t1_old = e.rightFace;
	} else if (e.rightFace == t0_old && e.leftFace.inCircumcircle(v)) {
		flip = true;
		t1_old = e.leftFace;
	}
	if (flip) {
		var tr0 = t0_old.getTriple(e);
		var tr1 = t1_old.getTriple(e);
		var e_flip = new Edge(tr0.u, tr1.u);
		var poly = [];
		poly.push(e.v0);
		poly.push(e_flip.v0);
		poly.push(e.v1);
		poly.push(e_flip.v1);
		if (!this.JordanTest(poly, e_flip)) {
			return;
		}
		e.legal = false;
		this.edges.push(e_flip);
		var t0_new = new Triangle([e_flip, tr0.e_p, tr1.e_s]);
		var t1_new = new Triangle([e_flip, tr1.e_p, tr0.e_s]);
		e_flip.setFaces(t0_new, t1_new);
		tr0.e_p.replaceFace(t0_old, t0_new);
		tr1.e_s.replaceFace(t1_old, t0_new);
		tr1.e_p.replaceFace(t1_old, t1_new);
		tr0.e_s.replaceFace(t0_old, t1_new);
		t0_old.descendants = [t0_new, t1_new];
		t1_old.descendants = [t0_new, t1_new];
		this.legalize(v, t0_new.edges[2], t0_new);
		this.legalize(v, t1_new.edges[1], t1_new);
	}
}

Clustering.prototype.add = function(v) {
	this.addVertex(v, this.locate(v));
}

Clustering.prototype.addVertex = function(v, simplex) {
	if ( simplex instanceof Vertex) {
		simplex.merge(simplex, v);
	} else if ( simplex instanceof Edge) {
		this.vertices.push(v);
		simplex.legal = false;
		var tr0 = simplex.leftFace.getTriple(simplex);
		var tr1 = simplex.rightFace.getTriple(simplex);
		var e0 = new Edge(v, tr0.u);
		var e1 = new Edge(v, simplex.leftFace.getNext(tr0.u));
		var e2 = new Edge(v, tr1.u);
		var e3 = new Edge(v, simplex.rightFace.getNext(tr1.u));
		var t0 = new Triangle([e0, tr0.e_p, e1]);
		var t1 = new Triangle([e1, tr1.e_s, e2]);
		var t2 = new Triangle([e2, tr1.e_p, e3]);
		var t3 = new Triangle([e3, tr0.e_s, e0]);
		simplex.leftFace.descendants = [t0, t3];
		simplex.rightFace.descendants = [t1, t2];
		this.edges.push(e0);
		this.edges.push(e1);
		this.edges.push(e2);
		this.edges.push(e3);
		e0.setFaces(t0, t3);
		e1.setFaces(t0, t1);
		e2.setFaces(t1, t2);
		e3.setFaces(t2, t3);
		tr0.e_p.replaceFace(simplex.leftFace, t0);
		tr1.e_s.replaceFace(simplex.rightFace, t1);
		tr1.e_p.replaceFace(simplex.rightFace, t2);
		tr0.e_s.replaceFace(simplex.leftFace, t3);
		this.legalize(v, tr0.e_p, t0);
		this.legalize(v, tr1.e_s, t1);
		this.legalize(v, tr1.e_p, t2);
		this.legalize(v, tr0.e_s, t3);
	} else {
		this.vertices.push(v);
		var e_i = new Edge(simplex.vertices[0], v);
		var e_j = new Edge(simplex.vertices[1], v);
		var e_k = new Edge(simplex.vertices[2], v);
		this.edges.push(e_i);
		this.edges.push(e_j);
		this.edges.push(e_k);
		var t0 = new Triangle([e_i, simplex.edges[0], e_j]);
		var t1 = new Triangle([e_j, simplex.edges[1], e_k]);
		var t2 = new Triangle([e_k, simplex.edges[2], e_i]);
		e_i.setFaces(t0, t2);
		e_j.setFaces(t0, t1);
		e_k.setFaces(t1, t2);
		simplex.replaceBy([t0, t1, t2]);
		this.legalize(v, simplex.edges[0], t0);
		this.legalize(v, simplex.edges[1], t1);
		this.legalize(v, simplex.edges[2], t2);
	}
}

Clustering.prototype.isLeaf = function(t) {
	return t.descendants.length == 0;
}

Clustering.prototype.CreateBoundingTriangle = function() {
	var dx = (this.bbox.x2 - this.bbox.x1 ) * 10;
	var dy = (this.bbox.y2 - this.bbox.y1 ) * 10;
	var v0 = new Vertex(this.bbox.x1 - dx, this.bbox.y1 - dy * 3);
	var v1 = new Vertex(this.bbox.x2 + dx * 3, this.bbox.y2 + dy);
	var v2 = new Vertex(this.bbox.x1 - dx, this.bbox.y2 + dy);
	var e0 = new Edge(v1, v0);
	var e1 = new Edge(v0, v2);
	var e2 = new Edge(v2, v1);
	v0.legal = false;
	v1.legal = false;
	v2.legal = false;
	this.boundingTriangle = new Triangle([e0, e1, e2]);
	var inf = new Triangle([e0, e1, e2]);
	e0.setFaces(this.boundingTriangle, inf);
	e1.setFaces(this.boundingTriangle, inf);
	e2.setFaces(this.boundingTriangle, inf);
}

Clustering.prototype.mergeVertices = function(e) {
	this.collapses++;
	var s0 = e.v0.size;
	var s1 = e.v1.size;
	var x = (e.v0.x * s0 + e.v1.x * s1 ) / (s0 + s1 );
	var y = (e.v0.y * s0 + e.v1.y * s1 ) / (s0 + s1 );
	var v = new Vertex(x, y, e.v0.elements.length, e.v0.binning);
	v.merge(e.v0, e.v1);

	e.v0.legal = false;
	e.v1.legal = false;

	var hole = [];
	var oldFacets = [];
	e.legal = false;

	var vertices = [];
	var traverse = function(eLeft, eRight, triangle) {
		eLeft.legal = false;
		do {
			var triple;
			if (eLeft.leftFace == triangle) {
				triple = eLeft.rightFace.getTriple(eLeft);
				oldFacets.push(eLeft.rightFace);
				triple.e_s.removeFace(eLeft.rightFace);
				triangle = eLeft.rightFace;
			} else {
				triple = eLeft.leftFace.getTriple(eLeft);
				oldFacets.push(eLeft.leftFace);
				triple.e_s.removeFace(eLeft.leftFace);
				triangle = eLeft.leftFace;
			}
			if (arrayIndex(hole, triple.e_s) == -1) {
				hole.push(triple.e_s);
			}
			vertices.push(triple.u);
			eLeft = triple.e_p;
			eLeft.legal = false;
		} while( eLeft != eRight );
	}
	var tr0 = e.leftFace.getTriple(e);
	var tr1 = e.rightFace.getTriple(e);
	oldFacets.push(e.leftFace);
	oldFacets.push(e.rightFace);
	traverse(tr0.e_p, tr1.e_s, e.leftFace);
	traverse(tr1.e_p, tr0.e_s, e.rightFace);

	var hd = new Clustering(this.bbox.x1 - 10, this.bbox.y1 - 10, this.bbox.x2 + 10, this.bbox.y2 + 10);
	var hull = [];
	for (var i in hole ) {
		if (!(hole[i].leftFace == null && hole[i].rightFace == null)) {
			hull.push(hole[i].v0);
			hull.push(hole[i].v1);
		}
	}
	var hullVertices = [];
	var distinct = [];
	for (var i in vertices ) {
		if (arrayIndex(distinct, vertices[i]) == -1) {
			hd.add(vertices[i]);
			distinct.push(vertices[i]);
		}
		if (arrayIndex(hull, vertices[i]) != -1) {
			hullVertices.push(vertices[i]);
		}
	}

	var newFacets = [];
	var isBoundary = function(e) {
		for (var i = 0; i < hole.length; i++) {
			if (hole[i].equals(e)) {
				return i;
			}
		}
		return -1;
	}
	var holeEdges = new Array(hole.length);
	var nonHoleEdges = [];

	for (var i = 0; i < hd.edges.length; i++) {
		var e = hd.edges[i];
		var b = isBoundary(e);
		if (b != -1) {
			if (!e.legal) {
				var t1 = e.leftFace.getTriple(e);
				var t2 = e.rightFace.getTriple(e);
				var edge = new Edge(t1.u, t2.u);
				for (var j = 0; j < hd.edges.length; j++) {
					if (hd.edges[j].equals(edge) && hd.edges[j].legal) {
						hd.edges[j].legal = false;
						break;
					}
				}
				t1.e_p.setFace(e.leftFace);
				t1.e_s.setFace(e.leftFace);
				t2.e_p.setFace(e.rightFace);
				t2.e_s.setFace(e.rightFace);

				e.legal = true;
			}
			holeEdges[b] = e;
		} else {
			nonHoleEdges.push(e);
		}
	}

	for (var i = 0; i < holeEdges.length; i++) {
		var e = holeEdges[i];
		if (hole[i].leftFace == null) {
			hole[i].leftFace = e.leftFace;
			hole[i].leftFace.replace(e, hole[i]);
			if (arrayIndex(newFacets, hole[i].leftFace) == -1) {
				newFacets.push(hole[i].leftFace);
			}
		}
		if (hole[i].rightFace == null) {
			hole[i].rightFace = e.rightFace;
			hole[i].rightFace.replace(e, hole[i]);
			if (arrayIndex(newFacets, hole[i].rightFace) == -1) {
				newFacets.push(hole[i].rightFace);
			}
		}
	}

	for (var i = 0; i < nonHoleEdges.length; i++) {
		var e = nonHoleEdges[i];
		if (!e.legal) {
			continue;
		}
		if (this.JordanTest(hullVertices, e)) {
			this.edges.push(e);
			if (arrayIndex(newFacets, e.rightFace) == -1) {
				newFacets.push(e.rightFace);
			}
			if (arrayIndex(newFacets, e.leftFace) == -1) {
				newFacets.push(e.leftFace);
			}
		}
	}

	for (var i in oldFacets ) {
		oldFacets[i].descendants = newFacets;
	}

	for (var i = 0; i < newFacets.length; i++) {
		var simplex = newFacets[i].interior(v);
		if (simplex == null) {
			continue;
		} else {
			this.addVertex(v, simplex);
			break;
		}
	}

	return v;

}

Clustering.prototype.JordanTest = function(pol, e) {
	var p = new Vertex((e.v0.x + e.v1.x) * 0.5, (e.v0.y + e.v1.y) * 0.5);
	var inside = false;
	var i, j = pol.length - 1;
	for ( i = 0; i < pol.length; j = i++) {
		var p1 = pol[i];
		var p2 = pol[j];
		if ((((p1.y <= p.y) && (p.y < p2.y)) || ((p2.y <= p.y) && (p.y < p1.y))) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x))
			inside = !inside;
	}
	return inside;
}

Clustering.prototype.mergeForResolution = function(resolution, circleGap) {
	this.deleteEdges = new BinaryHeap(function(e) {
		return e.weight;
	});
	this.weightEdges(resolution, circleGap);
	var index = 0;
	while (this.deleteEdges.size() > 0) {
		var e = this.deleteEdges.pop();
		if (e.legal) {
			var l = this.edges.length;
			var newVertex = this.mergeVertices(e);
			newVertex.CalculateRadius(resolution);
			for (var k = l; k < this.edges.length; k++) {
				var eNew = this.edges[k];
				if (eNew.legal) {
					eNew.weight = eNew.length / (eNew.v0.radius + eNew.v1.radius + circleGap * resolution );
					if (eNew.weight < 1) {
						this.deleteEdges.push(eNew);
					}
				}
			}
		}
	}
}

Clustering.prototype.weightEdges = function(resolution, circleGap) {
	for (var i = 0; i < this.vertices.length; i++) {
		if (this.vertices[i].legal) {
			this.vertices[i].CalculateRadius(resolution);
		}
	}
	var newEdges = [];
	for (var i = 0; i < this.edges.length; i++) {
		var e = this.edges[i];
		if (e.legal) {
			if (!e.v0.legal || !e.v1.legal) {
				e.weight = 1;
			} else {
				e.weight = e.length / (e.v0.radius + e.v1.radius + circleGap * resolution );
				if (e.weight < 1) {
					this.deleteEdges.push(e);
				}
			}
			newEdges.push(e);
		}
	}
	this.edges = newEdges;
}

Clustering.prototype.ValidityTest = function() {
	console.info("Test 1: Valid Delaunay ...");
	/*
	var leafs = [];
	var triangles = this.boundingTriangle.descendants;
	var j = 0;
	while( triangles.length > j ){
	var t = triangles[j];
	if( t.taken == undefined ){
	t.taken = true;
	if( this.isLeaf(t) ){
	leafs.push(t);
	}
	else {
	triangles = triangles.concat(t.descendants);
	}
	}
	j++;
	}
	console.info("  Number of Triangles: "+leafs.length);

	var c = 0;
	for( i in this.edges ){
	if( this.edges[i].legal ){
	c++;
	}
	}
	console.info("  Number of Edges: "+c);*/
	/*

	for( var i=0; i<leafs.length; i++ ){
	for( var j=0; j<vertices.length; j++ ){
	if( !leafs[i].contains(vertices[j]) && leafs[i].inCircumcircle(vertices[j]) ){
	console.info(leafs[i],vertices[j]);

	}
	}
	}
	*/

	//console.info("Test 2: Edges Facets (null) ...");
	for (i in this.edges ) {
		var e = this.edges[i];
		if (e.leftFace == null || e.rightFace == null) {
			console.info(e);
			alert();
		}
	}

	//console.info("Test 3: Edges Facets ...");
	var leftOf = function(v1, v2, v) {
		var x2 = v1.x - v2.x;
		var x3 = v1.x - v.x;
		var y2 = v1.y - v2.y;
		var y3 = v1.y - v.y;
		if (x2 * y3 - y2 * x3 < 0) {
			return true;
		}
		return false;
	}
	var c = 0;
	for (i in this.edges ) {
		var e = this.edges[i];
		var t1 = e.leftFace.getTriple(e);
		var t2 = e.rightFace.getTriple(e);
		if (e.v0.y == e.v1.y) {
			if (t1.u.y > t2.u.y) {
				console.info("equal y conflict ...");
				console.info(e);
				alert();
				c++;
			}
		} else {
			var v1, v2;
			if (e.v0.y > e.v1.y) {
				v1 = e.v0;
				v2 = e.v1;
			} else {
				v1 = e.v1;
				v2 = e.v0;
			}
			if (!leftOf(v1, v2, t1.u)) {
				console.info("left right conflict ... left is right");
				console.info(e);
				alert();
				c++;
			}
			if (leftOf(v1, v2, t2.u)) {
				console.info("left right conflict ... right is left");
				console.info(e);
				alert();
				c++;
			}
		}
	}
	//console.info("Number of Edges: "+this.edges.length);
	//console.info("Number of Conflicts: "+c);

	for (i in this.edges ) {
		if (this.edges[i].legal) {
			var e = this.edges[i];
			var tr0 = e.leftFace.getTriple(e);
			var tr1 = e.rightFace.getTriple(e);
			if (!tr0.e_p.legal || !tr0.e_s.legal || !tr1.e_p.legal || !tr1.e_s.legal) {
				console.info(e);
				console.info("conflict in edge continuity");
				return;
			}
		}
	}

}
function BinaryHeap(scoreFunction) {
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
	push : function(element) {
		// Add the new element to the end of the array.
		this.content.push(element);
		// Allow it to bubble up.
		this.bubbleUp(this.content.length - 1);
	},

	pop : function() {
		// Store the first element so we can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();
		// If there are any elements left, put the end element at the
		// start, and let it sink down.
		if (this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}
		return result;
	},

	remove : function(node) {
		var len = this.content.length;
		// To remove a value, we must search through the array to find
		// it.
		for (var i = 0; i < len; i++) {
			if (this.content[i] == node) {
				// When it is found, the process seen in 'pop' is repeated
				// to fill up the hole.
				var end = this.content.pop();
				if (i != len - 1) {
					this.content[i] = end;
					if (this.scoreFunction(end) < this.scoreFunction(node))
						this.bubbleUp(i);
					else
						this.sinkDown(i);
				}
				return;
			}
		}
		throw new Error("Node not found.");
	},

	size : function() {
		return this.content.length;
	},

	bubbleUp : function(n) {
		// Fetch the element that has to be moved.
		var element = this.content[n];
		// When at 0, an element can not go up any further.
		while (n > 0) {
			// Compute the parent element's index, and fetch it.
			var parentN = Math.floor((n + 1) / 2) - 1, parent = this.content[parentN];
			// Swap the elements if the parent is greater.
			if (this.scoreFunction(element) < this.scoreFunction(parent)) {
				this.content[parentN] = element;
				this.content[n] = parent;
				// Update 'n' to continue at the new position.
				n = parentN;
			}
			// Found a parent that is less, no need to move it further.
			else {
				break;
			}
		}
	},

	sinkDown : function(n) {
		// Look up the target element and its score.
		var length = this.content.length, element = this.content[n], elemScore = this.scoreFunction(element);

		while (true) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) * 2, child1N = child2N - 1;
			// This is used to store the new position of the element,
			// if any.
			var swap = null;
			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.content[child1N], child1Score = this.scoreFunction(child1);
				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore)
					swap = child1N;
			}
			// Do the same checks for the other child.
			if (child2N < length) {
				var child2 = this.content[child2N], child2Score = this.scoreFunction(child2);
				if (child2Score < (swap == null ? elemScore : child1Score))
					swap = child2N;
			}

			// If the element needs to be moved, swap it, and continue.
			if (swap != null) {
				this.content[n] = this.content[swap];
				this.content[swap] = element;
				n = swap;
			}
			// Otherwise, we are done.
			else {
				break;
			}
		}
	}
};
/*
* Dropdown.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class Dropdown
 * Implementation for Dropdown box
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {HTML object} parent parent div for the dropdown box
 * @param {Array} elements list of dropdown entries
 * @param {String} title dropdown button title
 */
function Dropdown(parent, elements, title) {

	var dropdown = this;
	this.visibility = false;
	this.div = document.createElement("div");
	this.div.setAttribute('class', 'dropdown');

	this.selection = document.createElement("div");
	this.selection.setAttribute('class', 'dropdownSelection');
	parent.appendChild(this.div);

	var leftBorder = document.createElement("div");
	leftBorder.setAttribute('class', 'dropdownLeft');
	this.div.appendChild(leftBorder);

	this.div.appendChild(this.selection);

	var dropdownButton = document.createElement("div");
	this.div.appendChild(dropdownButton);
	if (elements.length > 1) {
		dropdownButton.setAttribute('class', 'dropdownButtonEnabled');
	} else {
		dropdownButton.setAttribute('class', 'dropdownButtonDisabled');
	}
	dropdownButton.onclick = function() {
		if (elements.length > 1) {
			dropdown.changeVisibility();
		}
	}
	dropdownButton.title = title;

	this.getValue = function() {
		return this.selectedEntry.innerHTML;
	};

	var entryMenu = document.createElement("div");
	entryMenu.setAttribute('class', 'dropdownMenu');
	this.div.appendChild(entryMenu);

	var entries = document.createElement("dl");
	var addEntry = function(e) {
		var entry = document.createElement("dt");
		entry.innerHTML = e.name;
		entry.onclick = function() {
			e.onclick();
			dropdown.changeVisibility();
			dropdown.changeEntries(e);
		}
		entries.appendChild(entry);
		e.entry = entry;
	}
	for (var i = 0; i < elements.length; i++) {
		addEntry(elements[i]);
	}
	entryMenu.appendChild(entries);
	this.selection.style.width = entryMenu.offsetWidth + "px";
	entryMenu.style.width = (entryMenu.offsetWidth + leftBorder.offsetWidth + dropdownButton.offsetWidth - 2) + "px";
	this.div.style.maxHeight = this.div.offsetHeight + "px";

	entryMenu.style.display = 'none';

	this.setEntry = function(index) {
		if ( typeof (index) == "undefined") {
			if ((elements) && elements.length > 0) {
				this.changeEntries(elements[0]);
			}
		} else {
			this.changeEntries(elements[index]);
		}
	}

	this.changeEntries = function(element) {
		if (this.selectedEntry) {
			this.selectedEntry.setAttribute('class', 'dropdownUnselectedEntry');
		}
		this.selectedEntry = element.entry;
		this.selectedEntry.setAttribute('class', 'dropdownSelectedEntry');
		this.selection.innerHTML = "<div style='display:inline-block;vertical-align:middle;'>" + element.name + "</div>";
	}

	this.changeVisibility = function() {
		this.visibility = !this.visibility;
		if (this.visibility) {
			entryMenu.style.display = "block";
		} else {
			entryMenu.style.display = "none";
		}
	}
}
/*
* MapZoomSlider.js
*
* Copyright (c) 2012, Stefan J�nicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapZoomSlider
 * GeoTemCo style for map zoom control
 * @author Stefan J�nicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
function MapZoomSlider(parent, orientation) {

	this.parent = parent;

	var zs = this;
	this.div = document.createElement("div");
	this.div.setAttribute('class', 'sliderStyle-' + orientation);

	var sliderContainer = document.createElement("div");
	sliderContainer.setAttribute('class', 'zoomSliderContainer-' + orientation);
	var sliderDiv = document.createElement("div");
	sliderDiv.tabIndex = 1;
	var sliderInputDiv = document.createElement("div");
	sliderDiv.appendChild(sliderInputDiv);
	sliderContainer.appendChild(sliderDiv);
	this.slider = new Slider(sliderDiv, sliderInputDiv, orientation);
	this.div.appendChild(sliderContainer);

	var zoomIn = document.createElement("img");

  	zoomIn.src = GeoTemConfig.path + "ddb_zoom_in.png"; // "+"
	zoomIn.setAttribute('class', 'zoomSliderIn-' + orientation);
	zoomIn.onclick = function() {
        if (zs.parent.core.widget.popup) {
            zs.parent.core.widget.popup.reset();
        }
        if (zs.parent.getZoom() < 18) { // avoid zoom Level 19. 19 has no tiles / does not exists
            zs.parent.zoom(1);  
        }
	}
	this.div.appendChild(zoomIn);

	var zoomOut = document.createElement("img");

  	zoomOut.src = GeoTemConfig.path + "ddb_zoom_out.png"; // "-"
	zoomOut.setAttribute('class', 'zoomSliderOut-' + orientation);
	zoomOut.onclick = function() {
        if (zs.parent.core.widget.popup) {
            zs.parent.core.widget.popup.reset();
        }
		zs.parent.zoom(-1);
	}
	this.div.appendChild(zoomOut);

	this.slider.onclick = function() {
        if (typeof console != "undefined") {
            console.info(zs.slider.getValue());
        }
	}

	this.slider.handle.onmousedown = function() {
        if (zs.parent.core.widget.popup) {
            zs.parent.core.widget.popup.reset();
        }
		var oldValue = zs.slider.getValue();
		document.onmouseup = function() {
			if (!zs.parent.zoom((zs.slider.getValue() - oldValue) / zs.max * zs.levels)) {
				zs.setValue(oldValue);
			}
			document.onmouseup = null;
		}
	}

	this.setValue = function(value) {
		this.slider.setValue(value / this.levels * this.max);
	}

	this.setMaxAndLevels = function(max, levels) {
		this.max = max;
		this.levels = (levels==19)?18:levels;
		this.slider.setMaximum(max);
	}
	//	this.setMaxAndLevels(1000,parent.openlayersMap.getNumZoomLevels());
	//	this.setValue(parent.openlayersMap.getZoom());

	this.setLanguage = function() {
		zoomIn.title = GeoTemConfig.getString('zoomIn');
		zoomOut.title = GeoTemConfig.getString('zoomOut');
		this.slider.handle.title = GeoTemConfig.getString('zoomSlider');
	}
}
/*
* MapPopup.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapPopup
 * map popup implementaion
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
function MapPopup(parent) {

	this.parentDiv = parent.gui.mapWindow;

	this.initialize = function(x, y, onclose) {

		var popup = this;
		this.x = x;
		this.y = y;

		this.popupDiv = document.createElement("div");
		this.popupDiv.setAttribute('class', 'ddbPopupDiv');
		this.popupDiv.onclick = function() {
			if ( typeof onclose != 'undefined') {
				onclose();
			}
			popup.reset();
		}
		this.parentDiv.appendChild(this.popupDiv);

		this.headDiv = document.createElement("div");
		this.headDiv.setAttribute('class', 'ddbPopupHead');

		this.title = document.createElement("div");
		this.title.setAttribute('class', 'ddbPopupTitle');

		this.cancel = document.createElement("div");
		this.cancel.setAttribute('class', 'ddbPopupCancel');
		this.cancel.title = GeoTemConfig.getString('close');
		this.cancel.onclick = function() {
			if ( typeof onclose != 'undefined') {
				onclose();
			}
			popup.reset();
		}

        this.headDiv.appendChild(this.title);
        this.headDiv.appendChild(this.cancel);


		this.input = document.createElement("div");
  		this.input.style.maxWidth = Math.floor(this.parentDiv.offsetWidth * 0.75) + "px";
  		this.input.style.maxHeight = Math.floor(this.parentDiv.offsetHeight * 0.75) + "px";
		this.input.setAttribute('class', 'ddbPopupInput');

		this.popupDiv.appendChild(this.headDiv);
		this.popupDiv.appendChild(this.input);

	}

    this.makeAndPlacePeak = function(orientation) {
		var peak = document.createElement("div");
		peak.setAttribute('class', 'popupPeak'+orientation);
		peak.title = GeoTemConfig.getString('close');
		peak.onclick = function() {
			if ( typeof onclose != 'undefined') {
				onclose();
			}
			popup.reset();
		}

		this.popupDiv.appendChild(peak);

    }

	this.setContent = function(content) {
		$(this.input).empty();
		this.visible = true;
		$(this.input).append(content);
		this.decorate();
	}

	this.reset = function() {
		$(this.popupDiv).remove();
		this.visible = false;
	}

	this.decorate = function() {
        var divHeight=  this.popupDiv.offsetHeight;
        var divWidth =  this.popupDiv.offsetWidth ;

        var orientation = ["NO","SO","NW","SW"];

		this.left = this.x; // NO: + 9;
		this.top = this.y - this.popupDiv.offsetHeight; // NO: - 10;
        var bitval = 0;
        if( this.top < 10) {
            this.top = this.top  + divHeight + 10;
            bitval = 1;
        } else {
            this.top = this.top - 10;
            bitval = 0;
        }
        if(this.left + divWidth > 730 - 9) {
            bitval +=2;
            this.left = this.left - divWidth - 9;
        } else {
            this.left += 9; 
        }

		this.popupDiv.style.left = this.left + "px";
		this.popupDiv.style.top = this.top + "px";

        this.makeAndPlacePeak(orientation[bitval]);

		var shiftX = 0, shiftY = 0;
		if (this.popupDiv.offsetTop < parent.gui.headerHeight + 10) {
			shiftY = -1 * (parent.gui.headerHeight + 10 - this.popupDiv.offsetTop);
		}
		if (this.popupDiv.offsetLeft + this.popupDiv.offsetWidth > parent.gui.headerWidth - 10) {
			shiftX = -1 * (parent.gui.headerWidth - 10 - this.popupDiv.offsetLeft - this.popupDiv.offsetWidth);
		}
		parent.shift(shiftX, shiftY);
	}

	this.shift = function(x, y) {
		this.left = this.left - this.x + x;
		this.top = this.top - this.y + y;
		this.x = x;
		this.y = y;
		if (this.left + this.popupDiv.offsetWidth > this.parentDiv.offsetWidth) {
			this.popupDiv.style.left = 'auto';
			this.popupDiv.style.right = (this.parentDiv.offsetWidth - this.left - this.popupDiv.offsetWidth) + "px";
		} else {
			this.popupDiv.style.right = 'auto';
			this.popupDiv.style.left = this.left + "px";
		}
		this.popupDiv.style.top = this.top + "px";
	}
}
/*
* PlacenamePopup.js
*
* Copyright (c) 2012, Stefan J�nicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class PlacenamePopup
 * specific map popup for showing and interacting on placename labels
 * @author Stefan J�nicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
function PlacenamePopup(parent) {

	this.parentDiv = parent.gui.mapWindow;

	this.createPopup = function(x, y, labels) {
		this.labels = labels;
		var pnPopup = this;
		var popup = new MapPopup(parent);
		var onClose = function() {
			parent.deselection();
			pnPopup.reset();
		}
		popup.initialize(x, y, onClose);
		$.extend(this, popup);

		this.content = document.createElement("div");
		this.inner = document.createElement("div");
		this.inner.setAttribute('class', 'ddbPopupInner');

		this.content.appendChild(this.inner);
		var ilist = this.listLabelsDdb();
		this.showLabelsDdb(ilist);

	};

	this.setCount = function() {
		var c = this.count;
		if (c > 1) {
			this.resultsLabel.innerHTML = c + " " + GeoTemConfig.getString('results');
		} else {
			this.resultsLabel.innerHTML = c + " " + GeoTemConfig.getString('result');
		}
	}

	this.listLabelsDdb = function() {
        var theLabels = this.labels;

        var elementInfos = []
		for (var i = 0; i < theLabels.length; i++) {
            var label = theLabels[i];
			for (var j = 0; j < label.elements.length; j++) {
                var descr = label.elements[j].description;
                var elementInfo = {
                    member : true,
                    description : descr
                };
                elementInfos.push(elementInfo);
			}
		}
        return elementInfos;
	}
        
    this.showLabelsDdb = function(elementInfos) {

        var nb = elementInfos.length;
        var instText = "";
        if (nb == 1) {
            instText = GeoTemConfig.getString('institution');
        } else {
            instText = GeoTemConfig.getString('institutions');
        }
        this.title.innerHTML = nb + " " + instText;


        function pushElement_r(elInfo,resultList) {
            var superNodeRef = InstitutionsMapModel.getNode(elInfo.description.superNode);
            if (superNodeRef) {
                var superNodeInfo={ member: false,
                                    description: superNodeRef.description };
                pushElement_r(superNodeInfo,resultList);
            }
            resultList.push(elInfo);
        };

        /* include parents and sort the list */
        var listWithParents = [];
        for (var i = 0; i < elementInfos.length; i++) {
            var member = elementInfos[i];
            pushElement_r(member,listWithParents);
        };

        listWithParents.sort( function(a,b) {
                                var an = a.description.number;
                                var bn = b.description.number;
                                if (an<bn) return -1;
                                if (an>bn) return 1;
                                return 0;
                              } );

        /* distinct/uniq elements with same number, take nodes with member: true */
        var distinctList = [];
        if (listWithParents.length > 0) {
            var distinctElement = listWithParents[0];
            var distinctNumber = distinctElement.description.number;
            for (var n = 0; n < listWithParents.length; n++) {
                var el = listWithParents[n];
                var num = el.description.number;
                if (num !== distinctNumber) { // the next number approaches
                    distinctList.push(distinctElement);
                    distinctElement = el;
                    distinctNumber = el.description.number;
                } else { // its still the same number
                    if (el.member) {          // is el a member of the cluster?
                        distinctElement = el; // then use el as distinct exemplar
                    }
                };
            };
            distinctList.push(distinctElement); // don't forget the last distinct element
        };

        /* build html ul list/tree according to indentLevel */
        function makeLi(el) {
            var li = document.createElement('li');
            li.setAttribute('class', 'ddbPopupLine');
            var elNode =  el.description.node;
            var elText =  elNode.name + " (" + InstitutionsMapModel.sectorName(elNode.sector) + ")";
            var isSelected = InstitutionsMapModel.isSelected(elNode.sector);
            var text = ((isSelected)?'<strong>':'') +
                        '<a href="' + elNode.detailViewUri + '"' +
                     // ' target="_blank"' +  // open a new tab/window for this page
                        '>' + elText +
                        '</a>' +
                        ((isSelected)?'</strong>':'');
            li.innerHTML = text; // XXX + " # " +  el.description.number;
            return li;
        };

        function buildGroup(iStart, elList, groupIndent, holder) {
            for (var i = iStart; i < elList.length ; i++) {
                var elIndentLevel = elList[i].description.indentLevel;
                if (elIndentLevel < groupIndent) {
                    return i; // leave the group
                } else if (elIndentLevel > groupIndent) {
                    var innerGroup = document.createElement('ul'); // a new group
                    innerGroup.setAttribute('class', 'ddb_grey-arrow ddbPopupInnerUL');
                    // innerGroup.style is inherited from rootGroup
                    i = buildGroup(i,elList,elIndentLevel,innerGroup);
                    holder.appendChild(innerGroup); // add the inner group
                    if (i < elList.length) {  // not yet at end
                        var el = elList[i];   // add element to the current group
                        holder.appendChild(makeLi(el));
                    }
                } else {
                    var el = elList[i];  // add to the current group
                    holder.appendChild(makeLi(el));
                };
            }
            return i;
        }

        var rootGroup = document.createElement('ul');
		rootGroup.setAttribute('class', 'ddb_plum-arrow ddbPopupList ddbPopupRootUL');

        // groups are adjacent members of the same indent level 
        if (distinctList.length > 0) {
            buildGroup(0, distinctList, distinctList[0].description.indentLevel,rootGroup);
        };


        /* display the html structure */
		$(this.inner).empty();

		this.inner.style.width = "0px"; // this.labelsWidth + "px";
        this.inner.appendChild(rootGroup);

	  	this.setContent(this.content);
    }


	this.showLabelContent = function(label) {
	}

	this.setLanguage = function(language) {
		this.language = language;
		if (this.visible) {
			this.updateTexts();
		}
	}
};
/*
* Dropdown.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class Publisher
 * Publish/Subscribe mechanism
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */
if ( typeof GeoPublisher == 'undefined') {

	GeoPublisher = function() {

		var _topics = {};

		var f_get = function(topic) {
			var value = _topics[topic];
			if (!value) {
				value = _topics[topic] = [];
			}
			return value;
		};

		var f_publish = function(topic, data, publisher) {
			var subscribers = f_get(topic);
			for (var i = 0; i < subscribers.length; i++) {
				if (publisher == null || subscribers[i].client != publisher) {
					subscribers[i].callback(data);
				}
			}
		};

		var f_subscribe = function(topic, subscriber, callbackFn) {
			var subscribers = f_get(topic);
			subscribers.push({ client : subscriber, callback : callbackFn });
		};

		var f_unsubscribe = function(topic, unsubscriber) {
			var subscribers = f_get(topic);
			for (var i = 0; i < subscribers.length; i++) {
				if (subscribers[i].client == unsubscriber) {
					subscribers.splice(i, 1);
					return;
				}
			}
		};

		return {
            GeoPublish: f_publish,
            GeoSubscribe: f_subscribe,
            GeoUnsubscribe: f_unsubscribe,
            topics : _topics
        };
	}();
    if (typeof console != "undefined") {
        console.log("GeoPublisher created");
    }
}
/*
* WidgetWrapper.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class WidgetWrapper
 * Interface-like implementation for widgets interaction to each other; aimed to be modified for dynamic data sources
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {Object} widget either a map, time or table widget
 */
function WidgetWrapper() {

	var wrapper = this;

	this.setWidget = function(widget) {
		this.widget = widget;
	}

	this.display = function(data) {
		if ( data instanceof Array) {
			GeoTemConfig.datasets = data.length;
			if ( typeof wrapper.widget != 'undefined') {
				this.widget.initWidget(data);
			}
		}
	};

	GeoPublisher.GeoSubscribe('highlight', this, function(data) {
		if (data == undefined) {
			return;
		}
		if ( typeof wrapper.widget != 'undefined') {
			wrapper.widget.highlightChanged(data);
		}
	});

	GeoPublisher.GeoSubscribe('selection', this, function(data) {
		if ( typeof wrapper.widget != 'undefined') {
			wrapper.widget.selectionChanged(data);
		}
	});

	GeoPublisher.GeoSubscribe('filter', this, function(data) {
		wrapper.display(data);
	});

	GeoPublisher.GeoSubscribe('rise', this, function(id) {
		if ( typeof wrapper.widget != 'undefined' && typeof wrapper.widget.riseLayer != 'undefined') {
			wrapper.widget.riseLayer(id);
		}
	});

	this.triggerRefining = function(datasets) {
		GeoPublisher.GeoPublish('filter', datasets, null);
	};

	this.triggerSelection = function(selectedObjects) {
		GeoPublisher.GeoPublish('selection', selectedObjects, this);
	};

	this.triggerHighlight = function(highlightedObjects) {
		GeoPublisher.GeoPublish('highlight', highlightedObjects, this);
	};

	this.triggerRise = function(id) {
		GeoPublisher.GeoPublish('rise', id);
	};

};

var INSTITUTION_ITEM_MAP_DIV = 'divOSM';

function drawmap(itemDiv,language,lon, lat, instName, street, houseIdentifier, postalCode, city) {
    console.log("xxx called: drawmap('" + itemDiv + "','" + language + "') ");

    var position =  { longitude: lon, latitude: lat };
    InstitutionItemMapModel.initialize(itemDiv, language, position);
}



if ( typeof InstitutionItemMapModel == 'undefined' ) {

    InstitutionItemMapModel = (function () {

        var _initialized = false;

        var _allMapData; // constant, a flattened tree

        var _sectorSelection;   // as last published on InstitutionsSectors
        var _sectorsMapData; // the data to display depending on selected sectors
        var _allSectors; // count and name of sectors selected

        var _mapWidget;
        var _detailedViewSpec;

        var f_isInitialized = function() {
            return _initialized;
        }

        var f_initialize = function (mapDivId, language, position) {

            GeoTemConfig.determineAndSetUrlPrefix("InstitutionItemMapModel.js");

            if (typeof console != 'undefined') {
                console.log("f_initialize mapDivId=" + mapDivId + " language=" + language);
                console.log("             position:");
                console.dir(position);
                console.log("             urlPrefix=" + GeoTemConfig.urlPrefix);
            }

            GeoTemConfig.language = language;
            GeoTemConfig.allowFilter = false;

            var mapDiv = document.getElementById(mapDivId);
            _detailedViewSpec = {
                        longitude: position.longitude,
                        latitude: position.latitude,
                        zoomLevel: 15,
                        marker: 'ddb_marker_final.png',
                        markerWidth: 38,
                        markerHeight: 45
                    };

            var map = new WidgetWrapper();

            _mapWidget = new MapWidget(map, mapDiv, {
                mapTitle: GeoTemConfig.getString('institutes'),
                popups: false,
		        mapHeight : false, // '240px', // false or desired height css definition for the map
		        showDescriptions : false,
		        olNavigation : false, // show/hide OpenLayers navigation panel
                mapSelectionTools : false, // show/hide map selector tools
                labelGrid: false, // enables, disables hove
                countrySelect: false,
                resetMap: true,
                mapSelection: false, // disable background map selection
                boundaries: false,
                maxPlaceLabels: 0, // unlimited
                geoLocation: false,
                detailedViewSpec: _detailedViewSpec
            });

            if (typeof console != 'undefined') {
                console.log("MapWidget displayed");
            }

            _initialized = true;

            $('.absoluteToolbar').css("display","none");

            f_displayPosition();
            return map;
        };

        var f_displayPosition = function() {
            _mapWidget.centerAndMarkPosition();
        }

        var f_getUrlPrefix = function() {
            return GeoTemConfig.urlPrefix;
        }

        return {
            initialize: f_initialize,
            isInitialized: f_isInitialized,
            displayPosition: f_displayPosition,
            getUrlPrefix: f_getUrlPrefix
        };
    })();
}

/*
* final.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * code which is included after all other sources have been included for the minified version
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 */

OpenLayers.Util.getImagesLocation = function() {
	return GeoTemCoMinifier_urlPrefix + "lib/openlayers/img/";
};

OpenLayers._getScriptLocation = function() {
	return GeoTemCoMinifier_urlPrefix + "lib/openlayers/";
};

GeoTemConfig.configure(GeoTemCoMinifier_urlPrefix);

GeoPublisher.GeoPublish('GeoTemCoReady');
