package ddb.frontend

class BookController {

    def index() {
      def ninjaBook = new Book(title: "Secrets of JavaScript Ninja", author: "J. Ressig")
      render(template:"bookTemplate", model:[book: ninjaBook])
    }
}
