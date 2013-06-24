package de.ddb.next

import static org.junit.Assert.*

import org.junit.*


class BookmarkIntegrationTests {

    def bookmarksService

    @Before
    void setUp() {
        // Setup logic here
    }

    @After
    void tearDown() {
        // Tear down logic here
    }

//    @Test
    void shouldListAllFolders() {
        // The user ID 'crh'
        def userId = 'crh'

        bookmarksService.findAllFolders(nickname)
    }

//    @Test
    void shouldFindFolderByName() {
        // The user email 'crh'
        def nickname = 'crh'

        bookmarksService.findFolderByName(nickname)
    }

//    @Test
    void shouldSaveBookmarkToFavoriteFolder() {
        // The userId 'crh'
        def userId = 'crh'

        // The id of a folder with the title 'Favorites', which belongs to the user crh
        def folderId = 'XYZ'

        // TODO: should save the bookmark to the folder 'Favorites' which belongs to the user crh
        bookmarksService.save(userId, folderId, pizzaUndMarmelade)
    }

    @Test
    void shouldBeAbleToCreateFolder() {
        // The userId 'crh'
        def userId = 'crh'

        def folderTitle= 'Favorite'

        def folderId = bookmarksService.newFolder(userId, folderTitle)
    }
}
