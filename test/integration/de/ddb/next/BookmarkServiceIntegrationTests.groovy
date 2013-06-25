package de.ddb.next

import static org.junit.Assert.*

import org.junit.*


class BookmarkServiceIntegrationTests extends GroovyTestCase {

    def bookmarksService

    def userId = 'crh'

    @Before
    void setUp() {
        // Setup logic here
    }

    @After
    void tearDown() {
        // Tear down logic here
    }

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
            folderList.each {
                log.info "folder: ${it._source}"
            }
        } else {
            log.info 'empty folder.'
        }
    }

    @Test void shouldSaveBookmarkInFolder() {
        def folderId = createNewFolder()
        def itemId = 'foobar'
        def creationDate =  new Date().getTime().toString()
        log.info "creation date: ${creationDate}"
        def bookmarkId = bookmarksService.saveBookmark(userId, folderId, itemId, creationDate)

        assertNotNull bookmarkId
        log.info 'bookmark is saved, ID is: ' + bookmarkId
    }

    @Test void shouldFindBookmarks() {}
    @Test void shouldBulkDeleteBookmarks(){
       // { "delete" : { "_index" : "ddb", "_type" : "bookmark", "_id" : "Oq3T4o34TWO_D-cJ4ok2hA" } }
    }
}
