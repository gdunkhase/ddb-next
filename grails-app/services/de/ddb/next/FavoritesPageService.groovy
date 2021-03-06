package de.ddb.next
import de.ddb.next.beans.User
import grails.converters.JSON
import org.codehaus.groovy.grails.web.json.*
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.List;
import java.util.Locale;

import org.springframework.web.servlet.support.RequestContextUtils
import org.springframework.web.context.request.RequestContextHolder

class FavoritesPageService {

    def transactional = false
    def bookmarksService
    def sessionService
    def grailsApplication
    def searchService
    def configurationService
    

    def getFavorites() {
        def User user = getUserFromSession()
        if (user != null) {
            def result = bookmarksService.findFavoritesByUserId(user.getId())
            return result as JSON
        }
        else {
            log.info "getFavorites returns " + response.SC_UNAUTHORIZED
            return null
        }
    }
    
    private User getUserFromSession() {
        return sessionService.getSessionAttributeIfAvailable(User.SESSION_USER)
    }
    
    def private createAllFavoritesLink(Integer offset,Integer rows,String order,Integer lastPgOffset){
        return [firstPg:createFavoritesLinkNavigation(0,rows,order),prevPg:createFavoritesLinkNavigation(offset.toInteger()-rows,rows,order),nextPg:createFavoritesLinkNavigation(offset.toInteger()+rows,rows,order),lastPg:createFavoritesLinkNavigation(lastPgOffset,rows,order)]
    }
    def private createFavoritesLinkNavigation(offset,rows,order){
        def g = grailsApplication.mainContext.getBean('org.codehaus.groovy.grails.plugins.web.taglib.ApplicationTagLib')
        return g.createLink(controller:'user', action: 'favorites',params:[offset:offset,rows:rows,order:order])
    }
    
    def private formatDate(items,String id,Locale locale) {
        def newDate
        def oldDate
        items.each { favItems ->
            if (id== favItems.itemId){
                String pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'"
                SimpleDateFormat oldFormat = new SimpleDateFormat(pattern)
                SimpleDateFormat newFormat = new SimpleDateFormat("dd.MM.yyy HH:mm")
                oldFormat.setTimeZone(TimeZone.getTimeZone("GMT"))
                newFormat.setTimeZone(TimeZone.getTimeZone("Europe/Berlin"))
                DateFormat df = DateFormat.getDateInstance(DateFormat.MEDIUM, locale)
                def Date javaDate = oldFormat.parse(favItems.creationDate)
                newDate = newFormat.format(javaDate)
                oldDate = favItems.creationDate;
            }
        }
        return [newdate:newDate.toString(),oldDate:oldDate]
    }
    
    /**
     * Retrieve from Backend the Metadata for the items retrieved from the favorites list
     * @param items
     * @return
     */
    def private retriveItemMD(JSONArray items, Locale locale){
        def totalResults= items.length()
        def step = 20
        def queryItems
        def orQuery=""
        def allRes = []
        items.eachWithIndex() { it, i ->
            if ( (i==0) || ( ((i>1)&&(i-1)%step==0)) ){
                orQuery=it.itemId
            }else if (i%step==0){
                orQuery=orQuery + " OR "+ it.itemId
                queryBackend(orQuery, locale).each { item ->
                    allRes.add(item)
                }
                orQuery=""
            }else{
                orQuery+=" OR "+ it.itemId
            }
        }
        if (orQuery){
            queryBackend(orQuery,locale).each { item ->
                allRes.add(item)
            }
        }
        return allRes
    }

    def private queryBackend(String query, Locale locale){
        def params = RequestContextHolder.currentRequestAttributes().params
        params.query = "id:("+query+")"

        def urlQuery = searchService.convertQueryParametersToSearchParameters(params)
        urlQuery["offset"]=0
        urlQuery["rows"]=21
        def apiResponse = ApiConsumer.getJson(configurationService.getApisUrl() ,'/apis/search', false, urlQuery)
        if(!apiResponse.isOk()){
            log.error "Json: Json file was not found"
            apiResponse.throwException(request)
        }
        def resultsItems = apiResponse.getResponse()
        return resultsItems["results"]["docs"]
    }
    
    def private getAllFoldersPerUser(){
        def User user = getUserFromSession()
        if (user != null) {
            return bookmarksService.findAllFolders(user.getId())
        }
        else {
            log.info "getFavorites returns " + response.SC_UNAUTHORIZED
            return null
        }
    }
    
    private List addDateToFavResults(allRes, List items, Locale locale) {
        def all = []
        def temp = []
        allRes.each { searchItem->
            temp = []
            temp = searchItem
            temp["creationDate"]=formatDate(items,searchItem.id,locale).get("newdate")
            temp["serverDate"]=formatDate(items,searchItem.id,locale).get("oldDate")
            all.add(temp)
        }
        return all
    }
}
