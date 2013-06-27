Error-Handling in DDB-NEXT:

Goal:
-Browser gets HTTP-Status in Head + Description in Page

Handling by ErrorController:
forward controller: "error", action: "notFound"

In case of Exception, Controller (eg ItemController) forwards to ErrorController

ErrorController: 
-has different methods for different stati currently serverError(500), notFound(404) and auth(401)
-expects exception and ApiResponse-Object in request
-just returns default-view + status in Production-Mode
-returns messages from exception and ApiResponse in Development mode.
-either is explicitely called with forward controller:"error" ....
-or is implicitly called when throwing an Exception (defined in UrlMappings)

ApiConsumer:
Always return ApiResponse-Object. Object contains Exception, Status etc.
--> Check if ApiRespose-Object isOk() 
--> If not, call throwException(request) which sets the ApiConsumer as Attribute in the request and throws an Exception.
