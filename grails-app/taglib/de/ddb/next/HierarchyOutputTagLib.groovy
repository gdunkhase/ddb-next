package de.ddb.next

import de.ddb.next.beans.Item;

class HierarchyOutputTagLib {

    public static final int MAX_HIERARCHY_SIZE = 501

    def itemService

    def renderHierarchy = { attrs, body ->
        def itemId = attrs.item

        // Build the hierarchy from the item to the root element. The root element is kept.
        def parentList = itemService.getParent(itemId)
        def rootItem = Item.buildHierarchy(parentList)

        // No hierarchy -> No root item
        if(!rootItem) {
            out << ""
            return
        }

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

        if(parentList.size() > 0){
            out << body()
        }else{
            out << ""
        }

    }
}
