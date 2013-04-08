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
function PlacenamePopup_IE8Gen(parent) {

	this.parentDiv = parent.gui.mapWindow;

	this.createPopup = function(x, y, clusterIndex) {
		var pnPopup = this;
		var popup = new MapPopup_IE8Gen(parent);
		var onClose = function() {
			parent.deselection();
			pnPopup.reset();
		}
		popup.initialize(x, y, onClose);
		$.extend(this, popup);

        this.theCluster = InstitutionsMapModel.getCluster(clusterIndex);
        this.x = this.theCluster.x;
        this.y = this.theCluster.y;

		this.content = document.createElement("div");
		this.inner = document.createElement("div");
		this.inner.setAttribute('class', 'ddbPopupInner');

		this.content.appendChild(this.inner);
		var ilist = this.listLabelsDdb();
		this.showLabelsDdb(ilist);

	};


	this.listLabelsDdb = function() {

        var elementInfos = []

        var elements = this.theCluster.elementIds;
        for (var x =0; x < elements.length; x++) {
            var id = elements[x];
            var node =  InstitutionsMapModel.getNode(id);
            if (!node) continue;
            var elementInfo = {
                member : true,
                description : node.description
            };
            elementInfos.push(elementInfo);
        }
        return elementInfos;
	}
        
    this.showLabelsDdb = function(elementInfos) {


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
        function makeLi(el,countHolder) {
            var li = document.createElement('li');
            countHolder.push(1);
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
            li.innerHTML = text; // "test: #" +  el.description.number;
            return li;
        };

        function buildGroup(iStart, elList, groupIndent, holder, countHolder) {
            for (var i = iStart; i < elList.length ; i++) {
                var elIndentLevel = elList[i].description.indentLevel;
                if (elIndentLevel < groupIndent) {
                    return i; // leave the group
                } else if (elIndentLevel > groupIndent) {
                    var innerGroup = document.createElement('ul'); // a new group
                    innerGroup.setAttribute('class', 'ddbPopupInnerUL');
                    // innerGroup.style is inherited from rootGroup
                    i = buildGroup(i,elList,elIndentLevel,innerGroup,countHolder);
                    holder.appendChild(innerGroup); // add the inner group
                    if (i < elList.length) {  // not yet at end
                        var el = elList[i];   // add element to the current group
                        holder.appendChild(makeLi(el,countHolder));
                    }
                } else {
                    var el = elList[i];  // add to the current group
                    holder.appendChild(makeLi(el,countHolder));
                };
            }
            return i;
        }


        var rootGroup = document.createElement('ul');
      	rootGroup.setAttribute('class', 'ddbPopupRootUL');

        // groups are adjacent members of the same indent level 
        var countHolder = [];
        if (distinctList.length > 0) {
            buildGroup(0, distinctList,
                          distinctList[0].description.indentLevel,
                          rootGroup,
                          countHolder
                       );
        };

        var nb = countHolder.length; // >= elementInfos.length;
        var instText = "";
        if (nb == 1) {
            instText = GeoTemConfig.getString('institution');
        } else {
            instText = GeoTemConfig.getString('institutions');
        }
        this.title.innerHTML = nb + " " + instText;

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
