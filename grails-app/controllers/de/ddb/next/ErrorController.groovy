package de.ddb.next

class ErrorController {
    static defaultAction = "notfound"

    def notFound() {
        log.error("404 Dummy-Message: will be implemented by DDBNEXT-74. Throw away this code.")
    }

    def serverError() {
        log.error("500 Dummy-Message: will be implemented by DDBNEXT-74. Throw away this code.")
    }

}
