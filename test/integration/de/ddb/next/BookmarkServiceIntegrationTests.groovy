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
            log.info "The user with the ID: ${userId} has: "
            folderList.each { it ->
                log.info "- ${it}"
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

    // TODO: fix this
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

    // Favorites
    @Test void shouldAddItemToUserFavorite() {
        log.info "should add item to the user's Favorites"
        // should add a cultural item to user's favorite list.
        def userId = UUID.randomUUID() as String
        def itemId = UUID.randomUUID() as String
        // if the user don't have a favorite list, then the service should create it.
        def favoriteId = bookmarksService.addFavorite(userId, itemId)
        assert favoriteId != null
        log.info "The user ${userId} just added item ${itemId} to their Favorites folder favoriteId"
    }

    // TODO: fix this
    @Ignore('Can not search immediately after Indexing?')
    @Test void shouldFindFoldersByTitle() {
       def userId = UUID.randomUUID() as String
       def itemId = UUID.randomUUID() as String
       // if the user don't have a favorite list, then the service should create it.
       def favoriteId = bookmarksService.addFavorite(userId, itemId)
       def fav = bookmarksService.findFoldersByTitle(userId, BookmarksService.FAVORITES)
       assert fav.size() == 1
       log.info "The user ${userId} has ${fav.size()} folders with the title `Favorites`"
    }

    @Ignore('Not Yet Implemented')
    @Test void shouldGetAllUserFavorites() {
        def userId = UUID.randomUUID() as String
        def firstItemId = UUID.randomUUID() as String
        def secondItemId = UUID.randomUUID() as String

        // if the user don't have a favorite list, then the service should create it.
        def firstFav = bookmarksService.addFavorite(userId, firstItemId)
        def secondFav = bookmarksService.addFavorite(userId, secondItemId)
        // should get a list of item IDs in user's favorite list.
        def allFavs = bookmarksService.findFavoritesByUserId(userId)
        // if the user don't have a favorite list, then the service should create it.
        assert allFavs.size() > 0
    }

}