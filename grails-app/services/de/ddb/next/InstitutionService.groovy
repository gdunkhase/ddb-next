package de.ddb.next

import groovyx.net.http.HTTPBuilder

class InstitutionService {

    private static final def LETTERS='A'..'Z'
    def NUMBERS = 0..9

    def transactional = false

    def grailsApplication

    def grailsLinkGenerator

    def findAll() {
        def cortexHostPort = grailsApplication.config.ddb.backend.url

        def http = new HTTPBuilder(cortexHostPort)
        ApiConsumer.setProxy(http, cortexHostPort)

        def totalInstitution = 0
        def allInstitutions = [data: [:], total: totalInstitution]

        http.get(path: '/institutions') { resp, institutionList->
            def institutionByFirstChar = buildIndex()

            institutionList.each { it ->

                totalInstitution++

                def firstChar = it?.name[0]?.toUpperCase()
                it.firstChar = firstChar

                /*
                 * mark an institution as the first one that start with the
                 * character. We will use it for assigning id in the HTML.
                 * See: views/institutions/_listItem.gsp
                 * */
                if (LETTERS.contains(firstChar) && institutionByFirstChar.get(firstChar)?.size() == 0) {
                    it.isFirst = true
                }

                it.sectorLabelKey = 'ddbnext.' + it.sector
                buildChildren(it, totalInstitution)
                institutionByFirstChar = putToIndex(institutionByFirstChar, addUri(it), firstChar)
            }

            allInstitutions.data = institutionByFirstChar
            allInstitutions.total = getTotal(institutionList)

            return allInstitutions
        }

        return allInstitutions
    }

    private getTotal(rootList) {
        def total = rootList.size()

        for (root in rootList) {
            if (root.children?.size() > 0) {
                total = total + root.children.size()
                total = total + countDescendants(root.children)
            }
        }

        return total
    }

    private countDescendants(children) {
        def totalDescendants = 0

        for (institution in children) {
            if(institution.children) {
                totalDescendants = totalDescendants + institution.children.size()
                totalDescendants = totalDescendants + countDescendants(institution.children)
            }
        }
        return totalDescendants
    }

    private putToIndex(institutionByFirstLetter, institutionWithUri, firstLetter) {
        switch(firstLetter) {
            case 'Ä':
                institutionByFirstLetter['A'].add(institutionWithUri)
                break
            case 'Ö':
                institutionByFirstLetter['O'].add(institutionWithUri)
                break
            case 'Ü':
                institutionByFirstLetter['U'].add(institutionWithUri)
                break
            default:
                institutionByFirstLetter[firstLetter].add(institutionWithUri)
        }
        return institutionByFirstLetter
    }

    private buildChildren(institution, counter) {
        if(institution.children?.size() > 0 ) {
            institution.children.each { child ->
                child.uri = buildUri(child.id)
                child.sectorLabelKey = 'ddbnext.' + child.sector
                child.parentId = institution.id
                child.firstChar = child?.name[0]?.toUpperCase()
                buildChildren(child, counter)
            }
        }
    }

    private def buildIndex() {
        def institutionByFirstLetter = [:].withDefault{ [] }

        // create a map with intial value an empty array.
        // use A..Z as keys
        LETTERS.each {
            institutionByFirstLetter[it] = []
        }

        // add '0-9' as key for institution starts with a number
        def numberIndex = '0-9'
        institutionByFirstLetter[numberIndex] = [];

        return institutionByFirstLetter
    }

    private def addUri(json) {
        json.uri = buildUri(json.id)
        return json
    }

    private String buildUri(id) {
        grailsLinkGenerator.link(url: [controller: 'institution', action: 'readByItemId', id: id ])
    }
}