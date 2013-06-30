package de.ddb.next

import static org.junit.Assert.*

import org.junit.*


class BookmarkServiceIntegrationTests extends GroovyTestCase {

    def bookmarksService

    def userId = 'crh'

    // Folder
    @Test void shouldCreateNewFolder() {
        def folderId = createNewFolder()
        assertNotNull folderId
        log.info "Created a bookmark folder with the ID: ${folderId}"
    }

    def createNewFolder() {
        def folderTitle= 'Favorites-' + new Date().getTime().toString()
        def isPublic = true
        return bookmarksService.newFolder(userId, folderTitle, isPublic)
    }


    @Test void shouldGetAllFolders() {
        createNewFolder()
        def folderList = bookmarksService.findAllFolders(userId)
        assertTrue folderList.size() >0

        if(folderList) {
            folderList.each { it ->
                log.info "found folder: ${it}"
            }
        } else {
            log.info 'empty folder.'
        }
    }

    // Bookmark
    @Test void shouldSaveBookmarkInFolder() {
        def folderId = createNewFolder()
        def itemId = 'foobar'
        def bookmarkId = bookmarksService.saveBookmark(userId, folderId, itemId)

        assertNotNull bookmarkId
        log.info 'bookmark is saved, ID is: ' + bookmarkId
    }

    @Ignore('Can not search immediately after Indexing?')
    @Test void shouldFindBookmarksByFolderId() {
        def folderId = createNewFolder()
        def itemId = 'foobarbaz'
        def bookmarkId = bookmarksService.saveBookmark(userId, folderId, itemId)
        def bookmarks = bookmarksService.findBookmarksByFolderId(userId, folderId)
        assert bookmarks.size() > 0
    }

    @Ignore('Can not search immediately after Indexing?')
    @Test void shouldFindBookmarkedItems() {
        def folderId = createNewFolder()
        def itemId = 'foobar' + new Date().getTime().toString()
        def bookmarkId = bookmarksService.saveBookmark(userId, folderId, itemId)

        def foundBookmarkedItems = bookmarksService.findBookmarkedItems(userId, [itemId])
        assert foundBookmarkedItems.size() > 0
    }

    @Ignore('Not yet implemented')
    @Test void shouldBulkDeleteBookmarks() {
       // { "delete" : { "_index" : "ddb", "_type" : "bookmark", "_id" : "Oq3T4o34TWO_D-cJ4ok2hA" } }
        assert false
    }

    @Ignore('Not yet implemented')
    @Test void shouldFindFolderById(){
        assert false
    }

    @Ignore('Not yet implemented')
    @Test void shouldFindBookmarkById() {
        assert false
    }
}
