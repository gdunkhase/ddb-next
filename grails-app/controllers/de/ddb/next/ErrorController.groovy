package de.ddb.next

import grails.util.Environment

/**
 * Central controller for handling error situations (404, 500, etc).
 */
class ErrorController {


    /**
     * Handler method for error 500 situations
     * @return Either the 500_development view or the 500_production view, dependent on the environment
     */
    def serverError() {

        //Lot of logging to make bugfixing easier
        log.error "An uncaught exception occured in the frontend. The user will be redirected to the 500 page."
        if(request?.exception){
            try{
                log.error "Source of the error is: '"+request.exception.getMessage()+"'"
                def stackElements = request.exception.getStackTrace();
                for(stackElement in stackElements){
                    log.error "Stack: "+stackElement.getClassName()+"."+stackElement.getMethodName()+" ["+stackElement.getLineNumber()+"]"
                }

            }catch(Throwable ex){
                log.error "Grails did not provide a valid error object", ex
            }
        }else{
            log.error "Grails did not provide an error object. No stacktrace available. Most probably an earlier try-catch already consumed it. Check your log."
        }

        // Return response code 500
        response.status = 500

        // Return the view dependent on the configured environment (PROD vs DEV)
        if ( Environment.PRODUCTION == Environment.getCurrent() ) {

            // Production: show a nice error message
            log.error "Return view '505_production'"
            return render(view:'500_production')
        } else {
            // Not it production? show an ugly, developer-focused error message
            log.error "Return view '505_development'"
            return render(view:'500_development')
        }
    }

    /**
     * Handler method for error 400 situations
     * @return The notfound view
     */
    def notFound() {

        // Here we have the possibility to add further logging to identify if some 404 urls were called

        // Return response code 400
        response.status = 404

        // Return the 404 view
        log.error "Return view 'notfound'"
        return render(view:'notfound')
    }
}
