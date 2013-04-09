/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(document).ready(function() {

  if ($(".item-hierarchy").length > 0) {
    var imgLoader = document.createElement("img");
    imgLoader.src = "../images/icons/loader_small.gif";
    $(".item-hierarchy-result").prepend(imgLoader);

    createHierarchy(parseUrl(location.href));
  }
});

/*
 * Add a leaf node to the current node.
 * 
 * @param {Element} currentNode current node (li element)
 * 
 * @param {JSON} value data object
 * 
 * @param {boolean} isCurrent true if the value points to the currently
 * displayed object
 * 
 * @param {boolean} isLast true if the current node is the last node in the list
 * 
 * @param {boolean} moreHidden true if there are more children which are not
 * displayed
 */
function addLeafNode(currentNode, value, isCurrent, isLast, moreHidden) {
  currentNode.empty();
  currentNode.addClass("leaf");
  if (isLast) {
    if (moreHidden) {
      var moreAvailable = $(document.createElement('li'));
      moreAvailable.addClass('more-available');
      currentNode.parent().append(moreAvailable);
    } else {
      currentNode.addClass("last");
    }
  } else {
    currentNode.removeClass("last");
  }

  var branchType = $(document.createElement('span'));
  branchType.addClass('branch-type fl');
  var i = $("<i>");
  var leafIndicator = $(document.createElement('div'));
  leafIndicator.addClass('leaf-indicator');

  var a = $(document.createElement('a'));
  a.addClass('label');
  a.attr('href', value.id);
  a.attr('title', truncateTitle(value.label, 350));

  if (isCurrent) {
    leafIndicator.addClass("current-node");
    a.addClass("current-node");
  }
  branchType.append(i);
  currentNode.append(branchType);
  a.append(truncateTitle(value.label, 350));
  currentNode.append(leafIndicator);
  currentNode.append(a);
}

/*
 * Add a parent (branch) node to the current node.
 * 
 * @param {String} url URL to the item service
 * 
 * @param {Element} currentNode current node (li element)
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
 * 
 * @param {boolean} drawBorder draw a border around the plus sign if true
 */
function addParentNode(url, currentNode, parentId, value, isCurrent, isLast, countSiblings, drawBorder) {
  currentNode.empty();
  if (isLast) {
    currentNode.addClass("last");
  } else {
    currentNode.removeClass("last");
  }

  // draw a border around the plus sign
  if (isCurrent && drawBorder) {
    currentNode.addClass("lastExited");
  }

  var branchType = $(document.createElement('span'));
  branchType.addClass('branch-type fl');

  currentNode.append(branchType);

  var isRoot = parentId == null;
  var i = $("<i>");

  if (isRoot) {
    i.addClass("root");
  } else {
    setNodeIcon(i, isLast);
  }

  branchType.append(i);

  // add sibling count
  if (countSiblings) {
    addSiblingCount(url, currentNode.parent(), parentId);
  }

  i.click(function() {
    var isExpanded = $(this).hasClass("expanded");
    var isRoot = currentNode.hasClass("root");

    if (!isRoot) {
      setNodeIcon($(this), !isExpanded);
    }
    if (isExpanded) {
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
      showChildren(url, currentNode.parent().parent(), parentId, id, true);
    } else {
      showChildren(url, currentNode, value.id, parentId, false);
    }
  });

  if (value.aggregationEntity) {
    var label = $(document.createElement('span'));

    label.addClass("label" + (isCurrent ? " current-path" : ""));
    label.append(truncateTitle(value.label, 350));
    currentNode.append(label);
  } else {
    var leafIndicator = $(document.createElement('div'));
    leafIndicator.addClass('leaf-indicator');

    var a = $(document.createElement('a'));
    a.addClass("label" + (isCurrent ? " current-path" : ""));
    a.attr('href', value.id);

    if (isCurrent) {
      leafIndicator.addClass("current-node");
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
 * @param {Element} currentNode current node (ul element)
 * 
 * @param {String} parentId id of the parent node in the hierarchy
 */
function addSiblingCount(url, currentNode, parentId) {
  var siblingCount = $(document.createElement('span'));
  siblingCount.addClass('sibling-count');

  if (parentId != null) {
    getChildren(url, parentId, function(children) {
      var li = currentNode.children("li");

      if (children.length > 1) {
        if (children.length > 500) {
          siblingCount.append(messages.ddbnext.Hierarchy_SiblingCountRestricted_Format(500));
        } else {
          siblingCount.append("+" + (children.length - 1));
        }
        li.addClass("more-hidden");
      } else {
        li.addClass("last");
        if (!currentNode.parent().hasClass("root")) {
          setNodeIcon(currentNode.parent().children("span").children("i"), true);
        }
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
    if (parents.length > 1) {
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
        var li = $(document.createElement('li'));
        li.addClass(parentId == null ? "root" : "node");
        li.attr('data-bind', JSON.stringify(parents));

        ul.append(li);
        currentNode.append(ul);
        addParentNode(url, li, parentId, value, true, index == parents.length - 2, true, false);
        currentNode = li;
      } else if (parents.length > 1) {
        // show children
        getChildren(url, parents[parents.length - 2].id, function(children) {
          var ul = $("<ul>");
          var length = children.length;

          $.each(children, function(index, value) {
            var currentNode = $("<li>");

            ul.append(currentNode);
            addLeafNode(currentNode, value, value.id == parents[parents.length - 1].id, index == length - 1,
                length == 501);
          });
          currentNode.append(ul);
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
    url : url.dir + "children/" + id,
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
 * @param {Element} currentNode current node (li element)
 * 
 * @param {String} currentId id of the current node in the hierarchy
 * 
 * @param {String} parentId id of the parent node in the hierarchy
 * 
 * @param {boolean} drawBorder draw a border around the plus sign if true
 */
function showChildren(url, currentNode, currentId, parentId, drawBorder) {
  // remove other nodes on the current level and below
  currentNode.siblings().remove();
  currentNode.children("ul").remove();

  // show plus sign on parent node if this is a leaf node
  var isLeaf = currentNode.hasClass("leaf");

  if (isLeaf) {
    setNodeIcon(currentNode.parent().parent().children("span.branch-type").children("i"), false);
  } else {
    currentNode.removeClass("lastExited");
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
      var li = $(document.createElement('li'));
      li.addClass('node last');

      li.attr("data-bind", dataBind);
      ul.append(li);
      addWaitSymbol(li);
      getChildren(url, value.id, function(children) {
        if (children.length > 0) {
          addParentNode(url, li, currentId, value, isCurrent, isLast, false, drawBorder);
        } else {
          addLeafNode(li, value, isCurrent, isLast, length == 501);
        }
        return;
      });
    });
  });
}

/*
 * Truncate a label to a given number of characters.
 * 
 * @param {String} title the title to be truncated
 * 
 * @param {int} length maximum length until the title will be truncated
 */
function truncateTitle(title, length) {
  var result = title;

  if (title != null && title.length > length) {
    var lastSpace = title.substring(0, length).lastIndexOf(" ");

    result = title.substring(0, lastSpace) + "...";
  }
  return result;
}
