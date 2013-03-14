package de.ddb.next

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import org.apache.log4j.Logger;


class DdbSessionListener implements HttpSessionListener {

    private Logger log = Logger.getLogger(this.getClass())

    // called by servlet container upon session creation
    void sessionCreated(HttpSessionEvent event) {
        HttpSession session = event.getSession()
        log.error "A serverside session was created. This should not happen!"
        def stackElements = Thread.currentThread().getStackTrace()
        for(stackElement in stackElements){
            log.error "Stack: "+stackElement.getClassName()+"."+stackElement.getMethodName()+" ["+stackElement.getLineNumber()+"]"
        }
    }

    // called by servlet container upon session destruction
    void sessionDestroyed(HttpSessionEvent event) {
        HttpSession session = event.getSession()
        log.info "A serverside session was destroyed."
    }
}
