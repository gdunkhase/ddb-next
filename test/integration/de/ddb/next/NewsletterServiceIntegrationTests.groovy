package de.ddb.next

import static org.junit.Assert.*

import org.junit.*

import de.ddb.next.beans.User

class NewsletterServiceIntegrationTests {

    def newsletterService

    @Test
    void shouldAddUserAsSubscriber() {
        User user = new User(email: 'john.doe@example.com')
        def userId = UUID.randomUUID() as String
        user.setId(userId)
        newsletterService.addSubscriber(user)
        assert newsletterService.isSubscriber(user) == true
    }

    @Test
    void shouldRemoveUserAsSubscriber() {
        User user = new User(email: 'john.doe@example.com')
        def userId = UUID.randomUUID() as String
        user.setId(userId)
        newsletterService.addSubscriber(user)
        assert newsletterService.isSubscriber(user) == true

        newsletterService.removeSubscriber(user)
        assert newsletterService.isSubscriber(user) == false
    }

    @Test
    void shouldReturnFalseIfUserIsNotSubscriber() {
        User user = new User(email: 'john.doe@example.com')
        def userId = UUID.randomUUID() as String
        user.setId(userId)
        assert newsletterService.isSubscriber(user) == false
    }
}
