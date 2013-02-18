function createHierarchy(url) {
  getParents(url, url.file, function(parents) {
    var list = $("<div>");
    var currentNode = list;

    $.each(parents.reverse(), function(index, value) {
      if (index < parents.length - 1) {
        // show parents
        var parentId = null;

        if (index > 0) {
          parentId = parents[index - 1].id;
        }
        currentNode = createParentNode(url, currentNode, parentId, value);
      } else if (parents.length > 1) {
        // show children
        getChildren(url, parents[parents.length - 2].id, function(children) {
          var childList = $("<ul>");
          var length = children.length;

          $.each(children, function(index, value) {
            createChildNode(childList, value, index == length - 1);
          });
          currentNode.append(childList);
        });
      }
    });
    $(".item-hierarchy-result").html(list);
  });
}

function createChildNode(currentNode, value, isLast) {
  var li = $("<li>", {
    class : "leaf" + (isLast ? " last" : "")
  });
  var branchType = $("<span>", {
    class : "branch-type"
  });
  var i = $("<i>");
  var leafIndicator = $("<div>", {
    class : "leaf-indicator"
  });
  var a = $("<a>", {
    href : value.id
  });

  branchType.append(i);
  li.append(branchType);
  a.append(value.label);
  li.append(leafIndicator);
  li.append(a);
  currentNode.append(li);
}

function createParentNode(url, currentNode, parentId, value) {
  var result = $("<li>", {
    class : (parentId == null ? "root" : "node")
  });
  var siblingCount = $("<span>", {
    class : "sibling-count"
  });

  // count siblings
  if (parentId != null) {
    getChildren(url, parentId, function(children) {
      if (children.length > 1) {
        siblingCount.append("+" + (children.length - 1));
        result.addClass("more-hidden");
      }
    });
  }

  var branchType = $("<span>", {
    class : "branch-type"
  });
  var i = $("<i>");
  var label = $("<span>", {
    class : "item-hierarchy-label"
  }).append(value.label);

  branchType.append(i);
  result.append(branchType);
  result.append(label);
  currentNode.append($("<ul>").append(siblingCount).append(result));
  return result;
}

function getChildren(url, id, complete) {
  $.ajax({
    type : "GET",
    dataType : "json",
    async : true,
    url : url.dir + "children/" + id,
    complete : function(data) {
      complete(jQuery.parseJSON(data.responseText));
    }
  });
}

function getParents(url, id, complete) {
  $.ajax({
    type : "GET",
    dataType : "json",
    async : true,
    url : url.dir + "parents/" + id,
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
  $(".item-hierarchy").removeClass("off");

  var imgLoader = document.createElement("img");

  imgLoader.src = "../images/icons/loader_small.gif";
  $(".item-hierarchy-result").prepend(imgLoader);
  createHierarchy(parseUrl(this.location.href));
}
