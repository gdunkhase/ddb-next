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
package de.ddb.next

import de.ddb.next.beans.Item;

class HierarchyOutputTagLib {

    public static final int MAX_HIERARCHY_SIZE = 501

    def itemService

    def renderHierarchy = { attrs, body ->
        def itemId = attrs.item

        // Build the hierarchy from the item to the root element. The root element is kept.
        def parentList = itemService.getParent(itemId)

        // No parentList -> No hierarchy
        if(!Item.doesParentListContainHierarchy(itemId, parentList)) {
            out << ""
            return
        }

        def rootItem = Item.buildHierarchy(parentList)

        // Get all the sibling nodes
        def parentNode = rootItem.getItemFromHierarchy(itemId).getParentItem()
        def childListJson = itemService.getChildren(parentNode.id);
        // Remove the starting item from the hierarchy, it will come again with the sibling list
        rootItem.removeItemFromHierarchy(itemId)
        // Cut list after 501 items
        if(childListJson.size() > MAX_HIERARCHY_SIZE){
            childListJson = childListJson.subList(0, MAX_HIERARCHY_SIZE)
        }
        // Add them to the hierarchie tree
        rootItem.addItemsToHierarchy(childListJson)

        // Get the mainItem
        Item mainItem = rootItem.getItemFromHierarchy(itemId)

        // Start building the html code
        def renderString = "<ul>\n"
        renderString += renderItem(mainItem, rootItem)
        renderString += "</ul>\n"

        out << renderString
    }

    private def renderItem(Item mainItem, Item item){
        def out = "<li>\n"
        if(item.id == mainItem.id){
            out += "<strong>" + item.label + "</strong>\n"
        }else{
            out += item.label + "\n"
        }
        if(item.hasChildren()){
            out += "<ul>\n"
            for(int i=0; i<item.getChildren().size(); i++){
                Item child = item.getChildren().get(i)
                out += renderItem(mainItem, child)
            }
            out += "</ul>\n"
        }
        out += "</li>\n"
        return out;
    }

    def hasHierarchy = { attrs, body ->
        def itemId = attrs.item

        // Check if the item has parents
        def parentList = itemService.getParent(itemId)

        if(Item.doesParentListContainHierarchy(itemId, parentList)){
            out << body()
        }else{
            out << ""
        }

    }
}
