package de.ddb.next

import org.springframework.web.servlet.support.RequestContextUtils;

/**
 * Taglib for I18N issues.
 * @author hla
 */
class I18NHelperTagLib {

    def messageSource

    /**
     * Prints out the currently selected language. The language itself is internationalized. The language must be 
     * available as entry in the message.property files with the format "ddbnext.language_<ISO2-language>".
     */
    def currentLanguage = { attrs, body ->
        def locale = RequestContextUtils.getLocale(request)
        def i18nLanguageString = messageSource.getMessage("ddbnext.language_"+locale.getLanguage(), null, locale)

        out << i18nLanguageString
    }

    /**
     * Renders a language switching link dependend on the current url params, the given locale and the internationalized name.
     */
    def languageLink = {attrs, body ->
        def checkLocaleString = attrs.locale
        def localeclass = attrs.islocaleclass
        def locale = RequestContextUtils.getLocale(request)

        boolean isLocale = false

        if(checkLocaleString && locale){
            if(locale.getLanguage().equalsIgnoreCase(checkLocaleString)){
                isLocale = true
            }
        }

        if(isLocale){
            out << "<a class=\""+localeclass+"\">"+currentLanguage(attrs)+"</a>"
        }else{
            attrs.remove("locale")
            attrs.remove("islocaleclass")
            if(attrs.params){
                attrs.params = attrs.params.plus([lang: checkLocaleString])
            }else{
                attrs.params = [lang: checkLocaleString]
            }
            out << link(attrs, { body() })
        }
    }
}
