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
//    @Ignore('Can not search immediately after Indexing?')
    @Test void shouldFindBookmarkedItems() {
        def folderId = createNewFolder()
        def itemId = 'foobar' + new Date().getTime().toString()
        def bookmarkId = bookmarksService.saveBookmark(userId, folderId, itemId)

        sleep 3000
        def foundBookmarkedItems = bookmarksService.findBookmarkedItems(userId, [itemId])
        assert foundBookmarkedItems.size() > 0
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

    @Test void shouldFindFoldersByTitle() {
       log.info "the bookmark service should find folders by its title."
       def userId = UUID.randomUUID() as String

       def folderId = bookmarksService.newFolder(userId, BookmarksService.FAVORITES, BookmarksService.IS_PUBLIC)
       log.info "the bookmark service created a ${BookmarksService.FAVORITES} folder(${folderId}) for a user(${userId})"

       def favFolderList = bookmarksService.findFoldersByTitle(userId, BookmarksService.FAVORITES)
       log.info "The user(${userId}) has ${favFolderList.size()} folders with the title `Favorites`"

       // wait for 3 seconds before second try
       sleep 3000

       if(!favFolderList) {
           favFolderList = bookmarksService.findFoldersByTitle(userId, BookmarksService.FAVORITES)
           log.info "Second try, the user(${userId}) has ${favFolderList.size()} folders with the title `Favorites`"
       }

       assert favFolderList.size() == 1
       assertEquals favFolderList[0].folderId, folderId
    }

    @Test void shouldGetAllUserFavorites() {
        def userId = UUID.randomUUID() as String
        def firstItemId = 'foobarbaz'
        def secondItemId = UUID.randomUUID() as String

        // if the user don't have a favorite list, then the service should create it.
        def firstFav = bookmarksService.addFavorite(userId, firstItemId)

        sleep 3000

        def allFavs = bookmarksService.findFavoritesByUserId(userId)
        assert allFavs.size() > 0
    }

    @Test void shouldDeleteFavoritesByItemIDs() {
        log.info "the bookmark service should delete favorites by item IDs."
        def userId = UUID.randomUUID() as String
        def firstItemId = 'foobarbaz'
        log.info "adding item (${firstItemId} to the folder Favorite."

        def firstFav = bookmarksService.addFavorite(userId, firstItemId)
        sleep 3000

        def allFavs = bookmarksService.findFavoritesByUserId(userId)
        assert allFavs.size() == 1

        def itemIds = [firstItemId]
        bookmarksService.deleteFavorites(userId, itemIds)

        sleep 3000

        def emptyFavs = bookmarksService.findFavoritesByUserId(userId)
        assert emptyFavs.size() == 0
    }

    @Test void shouldFindFavoritesByItemIds() {
        log.info "the bookmark service should find favorites by item IDs."
        def userId = UUID.randomUUID() as String
        def firstItemId = 'foobarbaz'
        log.info "adding item ${firstItemId} to the folder Favorite."

        def firstFav = bookmarksService.addFavorite(userId, firstItemId)
        sleep 3000

        def itemIds = [firstItemId]

        def foundBookmarkedItems = bookmarksService.findFavoritesByItemIds(userId, itemIds)
        assert foundBookmarkedItems.size() > 0
    }
}