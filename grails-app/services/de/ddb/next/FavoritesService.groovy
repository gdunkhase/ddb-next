package de.ddb.next

import org.apache.commons.logging.LogFactory
import org.codehaus.groovy.grails.web.mapping.LinkGenerator
import org.codehaus.groovy.grails.web.util.WebUtils

import com.sun.org.apache.bcel.internal.generic.RETURN

import static groovyx.net.http.ContentType.*
import static groovyx.net.http.Method.*

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovyx.net.http.HTTPBuilder

class FavoritesService {

    def bookmarksService
    def transactional = false

    private static _FevoritesService
    public static getFevoritesService() {
        if (_FevoritesService == null) {
            _FevoritesService = new FavoritesService()
        }
        return _FevoritesService
    }

    private static final def ATTR_FAVORITE = 'favorite'

    // -- <List<uId>, itemId>
    private static def _favoritesMap = new HashMap<String, List<String>>()

    private HashMap<String, List<String>> getFavoriteMap() {
        if (this._favoritesMap == null) {
            _favoritesMap = new HashMap<String, List<String>>()
        }
        return this._favoritesMap
    }

    def jsonIsFavorit(pUId, pItemId){
        JsonBuilder vJsonResultBuilder = new groovy.json.JsonBuilder()
        def map = vJsonResultBuilder {
            ATTR_FAVORITE Boolean.FALSE.booleanValue()
        }
        if ( this.isFavorit(pUId, pItemId)) {
            map.putAt(ATTR_FAVORITE, Boolean.TRUE.booleanValue())
        }
        return vJsonResultBuilder.toString()
    }

    public boolean isFavorit(pUId, pItemId){
        boolean vResult = false
        if ( this.getFavoriteMap().containsKey(pUId) ) {
            List<String> vItemIds = this.getFavoriteMap().get(pUId)
            vResult = vItemIds.contains(pItemId)
        }
        return vResult
    }

    public boolean addToFavorites(pUId, pItemId){
        boolean vResult = false
        if (!isFavorit(pUId, pItemId)) {
            List<String> vItemIds = this.getFavoriteMap().get(pUId)
            if (vItemIds == null) {
                this.getFavoriteMap().put(pUId, (vItemIds = new ArrayList<String>()))
            }
            vResult = vItemIds.add(pItemId)
        }
        return vResult
    }

    public boolean deleteFromFavoritesList(pUId, pItemId){
        boolean vResult = false
        if (isFavorit(pUId, pItemId)) {
            vResult = this.getFavoriteMap().get(pUId).remove(pItemId)
        }
        return vResult
    }

}
