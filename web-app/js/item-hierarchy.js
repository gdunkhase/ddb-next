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
      var moreAvailable = $(document.createElement("li"));
      moreAvailable.addClass("more-available");
      currentNode.parent().append(moreAvailable);
    } else {
      currentNode.addClass("last");
    }
  } else {
    currentNode.removeClass("last");
  }

  var branchType = $(document.createElement("span"));
  branchType.addClass("branch-type fl");
  var i = $("<i>");
  var leafIndicator = $(document.createElement("div"));
  leafIndicator.addClass("leaf-indicator");

  var a = $(document.createElement("a"));
  a.addClass("label");
  a.attr("href", value.id);
  a.attr("title", truncateTitle(value.label, 350));

  if (isCurrent) {
    leafIndicator.addClass("current-node current-path");
    a.addClass("current-node current-path");
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
 * @param {boolean} isCurrentPath true if the value is a parent of the currently
 * displayed object
 * 
 * @param {boolean} isLast true if the current node is the last node in the list
 * 
 * @param {boolean} countSiblings true if the number of siblings must be counted
 * 
 * @param {boolean} drawBorder draw a border around the plus sign if true
 * 
 * @param {boolean} isExpanded show a minus sign if true
 */
function addParentNode(url, currentNode, parentId, value, isCurrent, isCurrentPath, isLast, countSiblings, drawBorder,
    isExpanded) {
  currentNode.empty();
  if (isLast) {
    currentNode.addClass("last");
  } else {
    currentNode.removeClass("last");
  }

  // draw a border around the plus sign
  if (isCurrent && drawBorder) {
    currentNode.addClass("last-exited");
  }

  var branchType = $(document.createElement("span"));
  branchType.addClass("branch-type fl");

  currentNode.append(branchType);

  var isRoot = parentId == null;
  var i = $("<i>");

  if (isRoot) {
    i.addClass("root");
  } else {
    i.addClass("collapsed");
    if (value.type != null) {
      currentNode.attr("data-type", value.type);
    }
  }

  // show plus or minus sign
  setNodeIcon(i, isExpanded);

  branchType.append(i);

  // add sibling count
  if (countSiblings) {
    addSiblingCount(url, currentNode.parent(), parentId);
  }

  i.click(function() {
    var isExpanded = $(this).hasClass("expanded");
    var isRoot = currentNode.hasClass("root");
    var li = $(this).parent().parent();
    var hasName = li.parent().hasClass("has-name");

    setNodeIcon($(this), !isExpanded);
    if (isExpanded) {
      // collapse node
      var dataBind = li.attr("data-bind");
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

      // show minus sign on parent node
      setNodeIcon(currentNode.parent().parent().children("span").children("i"), true);

      if (hasName) {
        showChildren(url, li.parent().parent().parent().parent(), parentId, id, true);
      } else {
        showChildren(url, li.parent().parent(), parentId, id, true);
      }
    } else {
      // expand node
      if (!isRoot) {
        // remove siblings
        currentNode.parent().parent().siblings("li").remove();
        currentNode.addClass("last");
      }

      // show plus sign on parent node
      setNodeIcon(currentNode.parent().parent().children("span").children("i"), false);

      showChildren(url, li, value.id, parentId, false);
    }
  });

  if (value.aggregationEntity) {
    var label = $(document.createElement("span"));

    label.addClass("label" + (isCurrent ? " current-node" : "") + (isCurrentPath ? " current-path" : ""));
    label.append(truncateTitle(value.label, 350));
    currentNode.append(label);
  } else {
    var leafIndicator = $(document.createElement("div"));
    leafIndicator.addClass("leaf-indicator" + (isCurrentPath ? " current-path" : ""));

    var a = $(document.createElement("a"));
    a.addClass("label" + (isCurrentPath ? " current-path" : ""));
    a.attr("href", value.id);

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
 * @param {Element} currentNode current node (ul element)
 * 
 * @param {String} parentId id of the parent node in the hierarchy
 */
function addSiblingCount(url, currentNode, parentId) {
  var siblingCount = $(document.createElement("span"));
  siblingCount.addClass("sibling-count");

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
        setNodeIcon(currentNode.parent().children("span").children("i"), true);
      }
    });
  }
  currentNode.children(".sibling-count").remove();
  currentNode.append(siblingCount);
}

/*
 * Add the hierarchy type name to the current node.
 * 
 * @param {Element} currentNode current node (ul element)
 * 
 * @param {String} type hierarchy type name
 * 
 * @return {Element} replacement for the "ul" child
 */
function addTypeName(currentNode, type) {
  var groupName = $("<span>");

  groupName.addClass("group-name");
  groupName.append(messages.ddbnext["HierarchyType_" + type]);

  var li = $("<li>");

  li.append(groupName);
  currentNode.append(li);

  var hasName = $("<ul>");

  hasName.addClass("has-name");
  li.append(hasName);
  return hasName;
}

/*
 * Add a wait image to the current node.
 * 
 * @param {Element} currentNode current node (li element)
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
        // show parent nodes
        var ul = $("<ul>");
        var hasName = value.type != null;
        var isRoot = index == 0;
        var parentId = null;

        if (!isRoot) {
          parentId = parents[index - 1].id;

          // show hierarchy type
          if (hasName) {
            currentNode.append(ul);
            ul = addTypeName(ul, value.type);
          }
        }

        var li = $("<li>");

        li.addClass(isRoot ? "root" : "node");
        li.attr("data-bind", JSON.stringify(parents));

        ul.append(li);
        if (isRoot || !hasName) {
          currentNode.append(ul);
        }
        addParentNode(url, li, parentId, value, false, true, index == parents.length - 2, true, false,
            index == parents.length - 2 && parents[parents.length - 1].leaf);
        currentNode = li;
      } else if (parents.length > 1) {
        // show this node
        if (!value.leaf) {
          var ul = $("<ul>");
          var hasName = value.type != null;
          var parentId = parents[parents.length - 2].id;

          // show hierarchy type
          if (hasName) {
            currentNode.append(ul);
            ul = addTypeName(ul, value.type);
          }

          var li = $("<li>");

          li.addClass("node");
          li.attr("data-bind", JSON.stringify(parents));

          ul.append(li);
          if (!hasName) {
            currentNode.append(ul);
          }
          addParentNode(url, li, parentId, value, true, true, true, true, false, true);
          currentNode = li;
        }

        // show children / siblings
        if (value.leaf) {
          parentId = parents[parents.length - 2].id;
        } else {
          parentId = parents[parents.length - 1].id;
        }
        getChildren(url, parentId, function(children) {
          var ul = $("<ul>");
          var length = children.length;
          var type = null;

          $.each(children, function(index, value) {
            var hasName = value.type != null;
            var leafNode = $("<li>");
            var showName = false;

            // show hierarchy type
            if (value.type != type) {
              if (hasName) {
                addTypeName(ul, value.type).append(leafNode);
                showName = true;
              }
              type = value.type;
            }

            if (!showName) {
              ul.append(leafNode);
            }
            if (value.leaf) {
              addLeafNode(leafNode, value, value.id == parents[parents.length - 1].id, index == length - 1,
                  length == 501);
            } else {
              leafNode.addClass("node");
              leafNode.attr("data-bind", JSON.stringify(parents));
              addParentNode(url, leafNode, parentId, value, false, false, index == length - 1, false, false, false);
            }
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
  if (!currentNode.hasClass("root")) {
    if (setExpanded) {
      currentNode.removeClass("collapsed");
      currentNode.addClass("expanded");
    } else {
      currentNode.removeClass("expanded");
      currentNode.addClass("collapsed");
    }
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
  currentNode.children("span.group-name").remove();
  currentNode.children("ul").remove();

  // show plus sign on parent node if this is a leaf node
  var isLeaf = currentNode.hasClass("leaf");

  if (isLeaf) {
    setNodeIcon(currentNode.parent().parent().children("span.branch-type").children("i"), false);
  } else {
    currentNode.removeClass("last-exited");
  }

  // show hierarchy type if not already visible
  var dataType = currentNode.attr("data-type");
  var hasName = currentNode.parent().hasClass("has-name");

  if (!hasName && dataType != null) {
    var parent = currentNode.parent();

    currentNode.detach();
    addTypeName(parent, dataType).append(currentNode);
  }

  // get the id of the child which is on the current path
  var id = "";
  var dataBind = currentNode.attr("data-bind");

  if (dataBind != null) {
    var parents = JSON.parse(dataBind);

    $.each(parents, function(index, value) {
      if (value.id == currentId && index < parents.length - 1) {
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
    var type = null;

    $.each(children, function(index, value) {
      var isCurrent = value.id == id;
      var isLast = index == length - 1;
      var li = $(document.createElement("li"));

      currentNode = ul;
      li.addClass("node last");
      li.attr("data-bind", dataBind);

      // show hierarchy type
      if (value.type != type) {
        if (value.type != null) {
          currentNode = addTypeName(currentNode, value.type);
        }
        type = value.type;
      }

      currentNode.append(li);
      addWaitSymbol(li);
      getChildren(url, value.id, function(children) {
        if (children.length > 0) {
          addParentNode(url, li, currentId, value, isCurrent, isCurrent, isLast, false, drawBorder, false);
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
