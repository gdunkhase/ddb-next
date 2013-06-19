/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.ddb.next

class EntityController {

    def cultureGraphService

    def show() {

        def entityId = params.id

        entityId = "118540238"

        def jsonGraph = cultureGraphService.getCultureGraph(entityId)
        def xmlDnb = cultureGraphService.getDNBInformation(entityId)

        def entity = [:]

        println "########################### 1 " + jsonGraph
        println "########################### 2 " + xmlDnb

        entity["externalLinks"] = jsonGraph.seeAlso

        println "########################### 3 " + entity["externalLinks"]

        entity["thumbnail"] = jsonGraph.thumbnail

        println "########################### 4 " + entity["thumbnail"]

        def entityType = jsonGraph.type

        println "########################### 5 " + entityType

        entity["title"] = jsonGraph[entityType].name

        println "########################### 6 " + entity["title"]

        entity["dateOfBirth"] = xmlDnb.breadthFirst().find {it.name() == "dateOfBirth"}[0].text()
        entity["dateOfDeath"] = xmlDnb.breadthFirst().find {it.name() == "dateOfDeath"}[0].text()

        def dnbPlaceOfBirthUrl = xmlDnb.breadthFirst().find {it.name() == "placeOfBirth"}."@rdf:resource".text()
        def dnbPlaceOfDeathUrl = xmlDnb.breadthFirst().find {it.name() == "placeOfDeath"}."@rdf:resource".text()

        def dnbPlaceOfBirthId = dnbPlaceOfBirthUrl.substring(dnbPlaceOfBirthUrl.lastIndexOf("/")+1)
        def dnbPlaceOfDeathId = dnbPlaceOfDeathUrl.substring(dnbPlaceOfDeathUrl.lastIndexOf("/")+1)

        def xmlDnbPlaceOfBirth = cultureGraphService.getDNBInformation(dnbPlaceOfBirthId)
        def xmlDnbPlaceOfDeath = cultureGraphService.getDNBInformation(dnbPlaceOfDeathId)

        entity["placeOfBirth"] = xmlDnbPlaceOfBirth.breadthFirst().find {it.name() == "preferredNameForThePlaceOrGeographicName"}[0].text()
        entity["placeOfDeath"] = xmlDnbPlaceOfDeath.breadthFirst().find {it.name() == "preferredNameForThePlaceOrGeographicName"}[0].text()

        println "########################### 7 " + entity["dateOfBirth"]
        println "########################### 8 " + entity["dateOfDeath"]
        println "########################### 9 " + dnbPlaceOfBirthId
        println "########################### 10 " + dnbPlaceOfDeathId
        println "########################### 11 " + entity["placeOfBirth"]
        println "########################### 12 " + entity["placeOfDeath"]

        def dnbProfessionUrls = xmlDnb.breadthFirst().findAll {it.name() == "professionOrOccupation"}."@rdf:resource".collect {it.text()}
        def dnbProfessionIds = dnbProfessionUrls.collect {it.substring(it.lastIndexOf("/")+1)}

        def professions = []
        dnbProfessionIds.each {
            def xmlProfession = cultureGraphService.getDNBInformation(it)
            def professionName = xmlProfession.breadthFirst().find {it.name() == "preferredNameForTheSubjectHeading"}[0].text()
            professions.add(professionName)
        }

        entity["professions"] = professions.join(', ')

        println "########################### 13 " + dnbProfessionUrls
        println "########################### 14 " + dnbProfessionIds
        println "########################### 15 " + entity["professions"]

        render(view: 'entity', model: ["entity": entity])
    }
}
