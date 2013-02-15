function createHierarchy(url) {
  getParents(url, url.file, function(parents) {
    var list = $('<div>');
    var currentNode = list;

    $.each(parents.reverse(), function(index, value) {
      if (index < parents.length - 1) {
        var parentId = null;

        if (index > 0) {
          parentId = parents[index - 1].id;
        }
        currentNode = createNode(url, currentNode, parentId, value);
      } else if (parents.length > 1) {
        getChildren(url, parents[parents.length - 2].id, function(children) {
          var childList = $('<ul>');

          $.each(children, function(index, value) {
            childList.append($('<li>').append($('<a>', {
              href : value.id
            }).append(value.label)));
          });
          currentNode.append(childList);
        });
      }
    });
    $('.item-hierarchy-result').html(list);
  });
}

function createNode(url, currentNode, parentId, value) {
  var siblingCount = $('<span>', {
    class : "siblingCount"
  });

  if (parentId != null) {
    getChildren(url, parentId, function(children) {
      if (children.length > 1) {
        siblingCount.append("+" + (children.length - 1));
      }
    });
  }

  var result = $('<li>').append($('<a>', {
    href : value.id
  }).append(value.label));

  currentNode.append($('<ul>').append(siblingCount).append(result));
  return result;
}

function getChildren(url, id, complete) {
  $.ajax({
    type : 'GET',
    dataType : 'json',
    async : true,
    url : url.dir + "children/" + id,
    complete : function(data) {
      complete(jQuery.parseJSON(data.responseText));
    }
  });
}

function getParents(url, id, complete) {
  $.ajax({
    type : 'GET',
    dataType : 'json',
    async : true,
    url : url.dir + "parent/" + id,
    complete : function(data) {
      complete(jQuery.parseJSON(data.responseText));
    }
  });
}

function parseUrl(url) {
  var result = []
  var lastSlash = url.lastIndexOf("/");

  result.dir = url.substring(0, lastSlash + 1);
  result.file = url.substring(lastSlash + 1);
  return result;
}

window.onload = function() {
  $('.item-hierarchy').removeClass('off');

  var imgLoader = document.createElement('img');

  imgLoader.src = "/images/icons/loader_small.gif";
  $('.item-hierarchy-result').prepend(imgLoader);

  createHierarchy(parseUrl(this.location.href));
}
