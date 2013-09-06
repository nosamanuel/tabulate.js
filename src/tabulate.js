;(function() {
  var body = document.getElementsByTagName('body')[0],
      highlightClass = 'tt-table-highlight',
      highlight = null;

  function each(collection, fn, scope) {
    if (collection == null) {
      return;
    }

    for (var i = 0, l = collection.length; i < l; ++i) {
      if (i in collection) {
          fn.call(scope, collection[i], i, collection);
      }
    }
  }

  function onMouseMove(event) {
    var el = document.elementFromPoint(event.x, event.y),
      table = findParentTable(el);

    if (table !== null) {
      highlight = createHighlight(table);
    } else if (el !== highlight) {
      destroyHighlights();
      highlight = null;
    }
  }

  function tabulate(table) {
    var rows = [];
    each(table.getElementsByTagName('TR'), function(tr) {
      var cells = [];
      each(tr.cells, function(cell) {
        var text = cell.innerText.replace(/(^\s+)|(\s+$)/g, '');
        if (text.indexOf(',') !== -1 ||
            text.indexOf('"') !== -1 ||
            text.indexOf('\n') !== -1) {
          text = '"' + text.replace(/\"/g, '""') + '"';
        }

        cells.push(text);
      });

      rows.push(cells);
    });

    return rows;
  };

  function findParentTable(el) {
    if (el.tagName === 'TABLE') {
      return el;
    } else if (el.tagName === 'BODY') {
      return null;
    } else {
      return findParentTable(el.parentNode);
    }
  }

  function createHighlight(table) {
    var highlight = document.createElement('DIV');
    highlight.className = highlightClass;

    highlight.style.position = 'absolute';
    highlight.style.top = table.offsetTop + 'px';
    highlight.style.left = table.offsetLeft + 'px';
    highlight.style.width = table.offsetWidth + 'px';
    highlight.style.height = table.offsetHeight + 'px';
    highlight.style.opacity = '0.3';
    highlight.style.filter = 'alpha(opacity=30)';
    highlight.style.cursor = 'pointer';
    highlight.style.zIndex = 999;
    highlight.style.background = 'lightblue';
    highlight.style.border = '2px dotted black';

    function clickHighlight() {
      var rows = tabulate(table),
          csv = '';
      for (var i = 0; i < rows.length; i++) {
          csv += rows[i].join(',') + '\n';
      }

      // Display the CSV in a textarea child of highlight
      var textArea = document.createElement('textarea');
      textArea.value = csv;
      textArea.style.width = '100%';
      textArea.style.height = '100%';
      textArea.style.overflow = 'scroll';
      highlight.appendChild(textArea);

      // Restore full opacity to the highlight
      highlight.style.opacity = '1.0';
      highlight.style.background = null;
      highlight.style.border = null;

      // Tear down the script
      body.removeEventListener('mousemove', onMouseMove);
      highlight.removeEventListener('click', clickHighlight);
      // destroyHighlights();
    }

    highlight.addEventListener('click', clickHighlight);

    body.appendChild(highlight);
    return highlight;
  }

  function destroyHighlights() {
    var highlights = document.getElementsByClassName(highlightClass);
    for (var i = 0; i < highlights.length; i++) {
      highlights[i].remove();
    }
  }

  body.addEventListener('mousemove', onMouseMove);
})();
