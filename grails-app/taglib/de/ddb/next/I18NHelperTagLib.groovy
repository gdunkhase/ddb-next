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
}
