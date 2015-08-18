var sheet = (function () {
  var cssOwoPhone = '{{insertedCss}}';
  
  var style = document.createElement("style");
  style.setAttribute('type', 'text/css');

  style.appendChild(document.createTextNode(cssOwoPhone));
  document.head.appendChild(style);

  return style.sheet;
})();