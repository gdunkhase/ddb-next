package de.ddb.next

class LoginController {

    def index() {

        render(view: "login")
    }

    def login() {

        def email = params.email
        def password = params.password

        def EMAILDUMMY = "fiz@fiz.fiz"
        def PASSWORDDUMMY = "fiz"

        def loginSuccess = false
        if(email == EMAILDUMMY && password == PASSWORDDUMMY){
            loginSuccess = true
        }

        println "####################### email: "+email+" / password: "+password

        render(view: "login", model: [
            'loginSuccess': false]
        )
    }
}
