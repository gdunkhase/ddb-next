/*
 * Add a leaf node to the current node.
 * 
 * @param {Element} currentNode current node (LI element)
 * 
 * @param {JSON} value data object
 * 
 * @param {boolean} isCurrent true if the value points to the currently
 * displayed object
 * 
 * @param {boolean} isLast true if the current node is the last node in the list
 */
function addLeafNode(currentNode, value, isCurrent, isLast) {
  currentNode.empty();
  currentNode.addClass("leaf");
  if (isLast) {
    currentNode.addClass("last");
  } else {
    currentNode.removeClass("last");
  }

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

  if (isCurrent) {
    leafIndicator.addClass("current-node");
    a.addClass("current-node");
  }
  branchType.append(i);
  currentNode.append(branchType);
  a.append(value.label);
  currentNode.append(leafIndicator);
  currentNode.append(a);
}

/*
 * Add a parent (branch) node to the current node.
 * 
 * @param {String} url URL to the item service
 * 
 * @param {Element} currentNode current node (LI element)
 * 
 * @param {String} parentId id of the parent node in the hierarchy
 * 
 * @param {JSON} value data object
 * 
 * @param {boolean} isCurrent true if the value points to the currently
 * displayed object
 * 
 * @param {boolean} isLast true if the current node is the last node in the list
 * 
 * @param {boolean} countSiblings true if the number of siblings must be counted
 */
function addParentNode(url, currentNode, parentId, value, isCurrent, isLast, countSiblings) {
  currentNode.empty();
  if (isLast) {
    currentNode.addClass("last");
  } else {
    currentNode.removeClass("last");
  }

  // add sibling count
  if (countSiblings) {
    addSiblingCount(url, currentNode.parent(), parentId);
  }

  var branchType = $("<span>", {
    class : "branch-type"
  });

  currentNode.append(branchType);

  var i = $("<i>", {
    class : "collapsed"
  });

  branchType.append(i);

  if (value.aggregationEntity) {
    i.click(function() {
      var isExpanded = $(this).hasClass("expanded");
      var isRoot = currentNode.hasClass("root");

      setNodeIcon($(this), !isExpanded);
      if (isExpanded && !isRoot) {
        var dataBind = currentNode.attr("data-bind");
        var id = null;

        if (dataBind != null) {
          var parents = JSON.parse(dataBind);

          $.each(parents, function(index, value) {
            if (value.id == parentId) {
              if (index > 0) {
                id = parents[index - 1].id;
              }
              return;
            }
          });
        }
        showChildren(url, currentNode.parent().parent(), parentId, id);
      } else {
        showChildren(url, currentNode, value.id, parentId);
      }
    });

    var label = $("<span>", {
      class : "item-hierarchy-label" + (isCurrent ? " current-path" : "")
    });

    label.append(value.label);
    currentNode.append(label);
  } else {
    var leafIndicator = $("<div>", {
      class : "leaf-indicator"
    });
    var a = $("<a>", {
      href : value.id
    });

    if (isCurrent) {
      leafIndicator.addClass("current-node");
      a.addClass("current-node");
    }
    a.append(value.label);
    currentNode.append(leafIndicator);
    currentNode.append(a);
  }
}

/*
 * Add the number of siblings to the current node's parent.
 * 
 * @param {String} url URL to the item service
 * 
 * @param {Element} currentNode current node
 * 
 * @param {String} parentId id of the parent node in the hierarchy
 */
function addSiblingCount(url, currentNode, parentId) {
  var siblingCount = $("<span>", {
    class : "sibling-count"
  });

  if (parentId != null) {
    getChildren(url, parentId, function(children) {
      if (children.length > 1) {
        if (children.length > 500) {
          siblingCount.append(messages.ddbnext.Hierarchy_SiblingCountRestricted_Format(500));
        } else {
          siblingCount.append("+" + (children.length - 1));
        }
        currentNode.children("li").addClass("more-hidden");
      }
    });
  }
  currentNode.children(".sibling-count").remove();
  currentNode.append(siblingCount);
}

/*
 * Add a wait image to the current node.
 * 
 * @param {Element} currentNode current node
 */
function addWaitSymbol(currentNode) {
  var waitSymbol = document.createElement("img");

  waitSymbol.src = "../images/icons/loader_small.gif";
  currentNode.prepend(waitSymbol);
}

/*
 * Create the item hierarchy (main function).
 * 
 * @param {String} url URL to the item service
 */
function createHierarchy(url) {
  getParents(url, url.file, function(parents) {
    // check if there is a hierarchy
    if (parents.length > 0) {
      $(".item-hierarchy").removeClass("off");
    }

    var list = $("<div>");
    var currentNode = list;

    $.each(parents.reverse(), function(index, value) {
      if (index < parents.length - 1) {
        // show parents
        var parentId = null;

        if (index > 0) {
          parentId = parents[index - 1].id;
        }

        var ul = $("<ul>");
        var li = $("<li>", {
          class : (parentId == null ? "root" : "node"),
          "data-bind" : JSON.stringify(parents)
        });

        ul.append(li);
        currentNode.append(ul);
        addParentNode(url, li, parentId, value, true, false, true);
        currentNode = li;
      } else if (parents.length > 1) {
        // show children
        getChildren(url, parents[parents.length - 2].id, function(children) {
          var ul = $("<ul>");
          var length = children.length;

          $.each(children, function(index, value) {
            var currentNode = $("<li>");

            ul.append(currentNode);
            addLeafNode(currentNode, value, value.id == parents[parents.length - 1].id, index == length - 1);
          });
          currentNode.append(ul);
          setNodeIcon(currentNode.find("span.branch-type>i"), true);
        });
      }
    });
    $(".item-hierarchy-result").html(list);
  });
}

// REST request to get all children of a given item
function getChildren(url, id, complete) {
  $.ajax({
    type : "GET",
    dataType : "json",
    async : true,
    url : url.dir + "children/" + id + "?rows=501",
    complete : function(data) {
      complete(jQuery.parseJSON(data.responseText));
    }
  });
}

// REST request to get all parents of a given item
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

/*
 * Set the node icon to a plus or a minus symbol
 * 
 * @param {Element} currentNode current node of type "i"
 * 
 * @param {boolean} setExpanded draw a minus symbol if true, otherwise draw a
 * plus symbol
 */
function setNodeIcon(currentNode, setExpanded) {
  if (setExpanded) {
    currentNode.removeClass("collapsed");
    currentNode.addClass("expanded");
  } else {
    currentNode.removeClass("expanded");
    currentNode.addClass("collapsed");
  }
}

/*
 * Show all children of the current node.
 * 
 * @param {String} url URL to the item service
 * 
 * @param {Element} currentNode current node
 * 
 * @param {String} currentId id of the current node in the hierarchy
 * 
 * @param {String} parentId id of the parent node in the hierarchy
 */
function showChildren(url, currentNode, currentId, parentId) {
  // remove other nodes on the current level and below
  currentNode.siblings().remove();
  currentNode.children("ul").remove();

  // show plus sign on parent node if this is a leaf node
  var isLeaf = currentNode.hasClass("leaf");

  if (isLeaf) {
    setNodeIcon(currentNode.parent().parent().children("span.branch-type").children("i"), false);
  }

  // get the id of the child which is on the current path
  var id = "";
  var dataBind = currentNode.attr("data-bind");

  if (dataBind != null) {
    var parents = JSON.parse(dataBind);

    $.each(parents, function(index, value) {
      if (value.id == currentId) {
        id = parents[index + 1].id;
        return;
      }
    });
  }

  var ul = $("<ul>");

  currentNode.append(ul);
  currentNode.removeClass("leaf");

  // add sibling count
  addSiblingCount(url, currentNode.parent(), parentId);

  // add children
  getChildren(url, currentId, function(children) {
    var length = children.length;

    $.each(children, function(index, value) {
      var isCurrent = value.id == id;
      var isLast = index == length - 1;
      var li = $("<li>", {
        class : "leaf node last"
      });

      li.attr("data-bind", dataBind);
      ul.append(li);
      addWaitSymbol(li);
      getParents(url, value.id, function(parents) {
        if (parents[0].aggregationEntity) {
          addParentNode(url, li, currentId, value, isCurrent, isLast, false);
        } else {
          addLeafNode(li, value, isCurrent, isLast);
        }
        return;
      });
    });
  });
}