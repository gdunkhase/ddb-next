package de.ddb.next

import groovyx.net.http.HTTPBuilder

class InstitutionService {

    private static final def INDEX='A'..'Z'

    def transactional = false

    def grailsApplication

    def grailsLinkGenerator

    def findAll() {
        def cortexHostPort = grailsApplication.config.ddb.backend.url
        log.debug cortexHostPort

        def http = new HTTPBuilder(cortexHostPort)
        ApiConsumer.setProxy(http, cortexHostPort)

        def totalInstitution = 0
        def allInstitutions = [data: [:], total: totalInstitution]

        http.get(path: 'institutions') { resp, institutionList->
            def institutionByFirstLetter = buildIndex()


            institutionList.each { it ->
                totalInstitution++
                def firstLetter = it?.name[0]?.toUpperCase()

                it.firstChar = firstLetter
                it.sectorLabelKey = 'ddbnext.' + it.sector

                if (INDEX.contains(firstLetter)) {
                    if(institutionByFirstLetter.get(firstLetter)?.size() == 0) {
                        it.isFirst = true
                    }
                }

                buildChildren(it, totalInstitution)
                institutionByFirstLetter = putToIndex(institutionByFirstLetter, addUri(it), firstLetter)
            }

            allInstitutions.data = institutionByFirstLetter
            allInstitutions.total = getTotal(institutionList)


            return allInstitutions
        }

        return allInstitutions
    }

    private getTotal(rootList) {
        def total = rootList.size()

        for (root in rootList) {
            if (root.children?.size() > 0) {
                total = total + root.children.size();
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
        def az = 'A'..'Z'
        def institutionByFirstLetter = [:].withDefault{
            []
        }

        az.each {
            institutionByFirstLetter[it] = []
        }

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
