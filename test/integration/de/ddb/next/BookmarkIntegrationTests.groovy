package de.ddb.next

import static org.junit.Assert.*

import org.junit.*

import de.ddb.next.beans.Bookmark

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

    @Test
    void shouldSaveBookmarkToFavoriteFolder() {
        // The user 'crh'
        def nickname = 'crh'

        // The id of a folder with the title 'Favorites', which belongs to the user crh
        def folderId = 'XYZ'

        // The item `crh` wants to save as a bookmark in their `Favorites` folder
        def pizzaUndMarmelade = new Bookmark(itemId:'WWJDRDG73T4U6QK7G34M6Y5U6WEPSDEI')

        // TODO: should save the bookmark to the folder 'Favorites' which belongs to the user crh
        bookmarksService.save(nickname, folderId, pizzaUndMarmelade)
    }
}
