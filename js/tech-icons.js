/* =========================================
   Technology icon mapping
   -----------------------------------------
   Maps the technology names referenced across
   the page (experience tags + skills list) to
   their brand icons, stored locally in
   assets/icons/, then injects a small <img>
   before the matching label.

   Names that aren't technologies (e.g. generic
   tags like "productivity") simply get no icon.
   ========================================= */
(function () {

  var ICON_BASE = 'assets/icons/';

  /* Each entry maps a normalised label to one or
     more local SVG files. Compound labels such as
     "HTML & CSS" resolve to several icons.        */
  var TECH_ICONS = {
    'angular':         ['angular.svg'],
    'react':           ['react.svg'],
    'jquery':          ['jquery.svg'],
    'javascript':      ['javascript.svg'],
    'python':          ['python.svg'],
    'c#':              ['csharp.svg'],
    'vb.net':          ['dotnet.svg'],
    'java':            ['java.svg'],
    'html & css':      ['html5.svg', 'css3.svg'],
    'html/css':        ['html5.svg', 'css3.svg'],
    'sql server':      ['microsoftsqlserver.svg'],
    'mysql':           ['mysql.svg'],
    'sqlite':          ['sqlite.svg'],
    'sqllite':         ['sqlite.svg'],
    'aws':             ['aws.svg'],
    'linux':           ['linux.svg'],
    'cpanel':          ['cpanel.svg'],
    'github actions':  ['github.svg'],
    '.net blazor':     ['csharp.svg'],
    'vs code':         ['vscode.svg'],
    'activemq':        ['apache.svg'],
    'mulesoft esb':    ['mulesoft.svg'],
    'intersystems caché': ['intersystems.svg'],
    'adobe flash/flex': ['adobe.svg'],
    'git & github':    ['git.svg', 'github.svg'],
    'github copilot':  ['github-copilot.svg']
  };

  /* Normalise a label for lookup. */
  function normalise(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  /* Build the icon element(s) for a label, or null. */
  function buildIcons(label, accessibleName) {
    var paths = TECH_ICONS[normalise(label)];
    if (!paths) { return null; }

    var frag = document.createDocumentFragment();
    paths.forEach(function (path) {
      var img = document.createElement('img');
      img.className = 'tech-icon';
      img.src = ICON_BASE + path;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.loading = 'lazy';
      frag.appendChild(img);
    });
    return frag;
  }

  /* Prepend matching icons to each element in a set. */
  function decorate(selector) {
    var nodes = document.querySelectorAll(selector);
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.querySelector('.tech-icon')) { return; }
      var icons = buildIcons(node.textContent);
      if (icons) {
        node.classList.add('has-tech-icon');
        node.insertBefore(icons, node.firstChild);
      }
    });
  }

  function init() {
    decorate('.tag');
    decorate('.skill-group ul li');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
