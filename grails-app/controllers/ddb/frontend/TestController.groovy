package ddb.frontend

class TestController {

    def index() {
		def testUser = new User(name: "Frank", surname: "Schwichtenberg")
		render(view:"test", model:[user: testUser])
	}
}
