package de.ddb.next.beans

class Item {

    static constraints = {
    }

    String id
    String parent
    String label
    String type
    String position
    String leaf
    String aggregationEntity
    List<Item> children = []
    Item parentItem

    Item(){
    }

    Item(Map itemMap){
        id = itemMap.id
        parent = itemMap.parent
        label = itemMap.label
        type = itemMap.type
        position = itemMap.position
        leaf = itemMap.leaf
        aggregationEntity = itemMap.aggregationEntity
    }

    public String toString(){
        return "Item["+this.id+"]"
    }

    public boolean hasChildren(){
        if(children.size()>0){
            return true;
        }else{
            return false
        }
    }

    public List<Item> getChildren(){
        return children;
    }


    public void addItemsToHierarchy(List itemListJson) {
        List<Item> allItemList = []
        itemListJson.each {
            allItemList.add(new Item(it))
        }

        for(int i=0; i<allItemList.size(); i++){
            Item currentItem = allItemList.get(i)
            Item parent = this.getItemFromHierarchy(currentItem.parent)
            if(parent != null){
                parent.children.add(currentItem)
                currentItem.parentItem = parent
            }
        }
    }

    public Item getItemFromHierarchy(String id){
        if(this.id == id){
            return this
        }else{
            for(int i=0; i<this.children.size(); i++){
                Item currentChild = this.children.get(i)
                Item foundItem = currentChild.getItemFromHierarchy(id)
                if(foundItem != null){
                    return foundItem
                }
            }
        }
    }

    public void removeItemFromHierarchy(String id){
        for(int i=0; i<this.children.size(); i++){
            Item currentChild = this.children.get(i)
            if(currentChild.id == id){
                currentChild.parent = null
                children.remove(currentChild)
                return
            }
            currentChild.removeItemFromHierarchy(id)
        }
    }

    static Item buildHierarchy(List allItemsJson){
        List<Item> allItemList = []
        allItemsJson.each {
            allItemList.add(new Item(it))
        }

        Item root = getRootItem(allItemList)
        allItemList.remove(root)

        List<Item> currentParents = [root]
        while(allItemList.size() > 0){
            List<Item> appendedChilds = appendChildren(currentParents, allItemList)
            currentParents = appendedChilds;
        }
        return root
    }

    private static Item getRootItem(List allItems) {
        for(int i=0; i<allItems.size(); i++){
            Item currentItem = allItems.get(i)
            if(currentItem.parent == null || "null".equals(currentItem.parent) ){
                return currentItem
            }
        }
        return null
    }

    private static List<Item> appendChildren(List<Item> parents, List possibleChildList){
        List<Item> addedChilds = []
        for(int i=0; i<parents.size(); i++){
            Item currentParent = parents.get(i)
            for(int j=possibleChildList.size()-1; j>=0; j--){
                Item currentChild = possibleChildList.get(j)
                if(currentChild.parent.equals(currentParent.id)){
                    currentParent.children.add(currentChild)
                    currentChild.parentItem = currentParent
                    possibleChildList.remove(j)
                    addedChilds.add(currentChild)
                }
            }
        }
        return addedChilds
    }
}
