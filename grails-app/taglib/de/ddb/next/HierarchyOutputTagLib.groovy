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

/**
 * This taglib renders the hierarchy tree of an item in the form of nested ul/li tags. 
 * The taglib code itself only ensures a correct model und calls to the embedded gsp templates.
 * @author hla
 */
class HierarchyOutputTagLib {

    /**
     * Maximum number of hierarchy-entries to display
     */
    public static final int MAX_HIERARCHY_SIZE = 501

    def itemService

    /**
     * This tag renders the hierarchy of a given item-id. The hierarchy of the given item-id is 
     * dynamically created via two calls to the backend.
     * 
     * @attr item The item-ID (e.g. AYKQ6FKHP6A7KFKCK2K3DP6HCVNZQEQC).
     */
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

        Item emptyStartItem = new Item()
        emptyStartItem.getChildren().add(rootItem)

        attrs["item"] = emptyStartItem
        attrs["mainItem"] = mainItem

        // Start building the html code
        out << renderItemChilds(attrs, body)
    }


    /**
     * This tag should only be used by the taglib itself! 
     * It renders a single item entry and triggers the recursive render call to its childs (if it has any).
     * 
     * @attr item The current Item object (of type de.ddb.next.beans.Item) of the recursive call hierarchy
     * @attr mainItem The main Item (of type de.ddb.next.beans.Item), meaning the Item that was initially 
     *      given to render the whole hierarchy
     * 
     */
    def renderItem = { attrs, body ->
        def itemMap = [:]
        def item = attrs.item
        def mainItem = attrs.mainItem

        itemMap["label"] = item.label
        itemMap["isMainItem"] = (item.id == mainItem.id)
        itemMap["item"] = item
        itemMap["mainItem"] = mainItem
        if(item.hasChildren()){
            itemMap["hasChildren"] = true
        }else{
            itemMap["hasChildren"] = false
        }

        out << render(template:"/item/hierarchyItem", model:[item: itemMap])
    }

    /**
     * This tag should only be used by the taglib itself! 
     * It triggers the rendering of the childs of the current item.
     * 
     * @attr item The current child Item object (of type de.ddb.next.beans.Item) of the recursive call hierarchy
     * @attr mainItem The main Item (of type de.ddb.next.beans.Item), meaning the Item that was initially 
     *      given to render the whole hierarchy
     */
    def renderItemChilds = { attrs, body ->
        def itemMap = [:]
        def item = attrs.item
        def mainItem = attrs.mainItem

        itemMap["item"] = item
        itemMap["mainItem"] = mainItem
        itemMap["childs"] = item.getChildren()

        out << render(template:"/item/hierarchyItemChilds", model:[item: itemMap])

    }

    /**
     * Checks if a given item-id has a hierarchy. If it has, the body of the tag is rendered. If it has no 
     * hierarchy the body of the tag is ignored.
     * 
     * @attr item The item-ID (e.g. AYKQ6FKHP6A7KFKCK2K3DP6HCVNZQEQC)
     */
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
