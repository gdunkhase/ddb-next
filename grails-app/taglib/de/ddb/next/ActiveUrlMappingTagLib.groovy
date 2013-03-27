package de.ddb.next

class ActiveUrlMappingTagLib {

    def isMappingActive = {attrs, body ->
        def controller = attrs?.context?.controller
        def action = attrs?.context?.action
        def dir = attrs?.context?.dir
        def testForMappings = attrs?.testif

        boolean doesPageMatch = false

        if(controller && action && testForMappings){
            for(it in testForMappings){
                if(it.controller && it.action){
                    if(controller == it.controller && action == it.action){
                        doesPageMatch = true
                        break
                    }
                }else if(it.controller && it.dir){
                    if(controller == it.controller && dir == it.dir){
                        doesPageMatch = true
                        break
                    }
                }else if(it.controller){
                    if(controller == it.controller){
                        doesPageMatch = true
                        break
                    }
                }
            }
        }

        if(doesPageMatch){
            out << body()
        }else{
            out << ""
        }
    }
}
