package de.ddb.next

class LoginController {

    def index() {

        render(view: "login")
    }

    def login() {

        def email = params.email
        def password = params.password

        println "####################### email: "+email+" / password: "+password

        render(view: "login", model: [
            'loginSuccess': true]
        )
    }
}
