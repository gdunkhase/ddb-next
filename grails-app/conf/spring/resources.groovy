import de.ddb.next.SupportedLocales;

// Place your Spring DSL code here
beans = {
    localeResolver(org.springframework.web.servlet.i18n.CookieLocaleResolver) {
        java.util.Locale.setDefault(SupportedLocales.getDefaultLocale())
        cookieMaxAge = 31536000 //1y
    }
}
