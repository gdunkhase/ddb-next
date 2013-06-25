package de.ddb.next.beans

import groovy.transform.ToString

@ToString(includeNames=true)
class Bookmark {

    String bookmarkId
    String userId
    String itemId
    Date creationDate

}
