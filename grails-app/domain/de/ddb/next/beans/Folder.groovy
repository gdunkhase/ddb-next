package de.ddb.next.beans

import groovy.transform.ToString

@ToString(includeNames=true)
class Folder {
    String folderId
    String userId
    String title
    boolean isPublic = false
}
