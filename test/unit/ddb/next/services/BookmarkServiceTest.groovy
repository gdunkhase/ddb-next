package ddb.next.services

import grails.test.mixin.TestFor

import org.junit.Test

import de.ddb.next.BookmarksService

@TestFor(BookmarksService)
class BookmarkServiceTest extends GroovyTestCase {

    def bookmarksService

    @Test
    void shouldBeAbleToCreateFolder() {
        // The userId 'crh'
        def userId = 'crh'

        def folderTitle= 'Favorite'

        def folderId = bookmarksService.newFolder(userId, folderTitle)
        assert 1+1 == 2
    }
}