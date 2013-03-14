package de.ddb.next;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public enum SupportedLocales {

    DE(new Locale("de", "DE")), EN(new Locale("en", "EN"));

    private Locale locale;

    SupportedLocales(Locale locale) {
        this.locale = locale;
    }

    public static Locale getDefaultLocale() {
        return SupportedLocales.EN.locale;
    }

    public String getISO2() {
        return this.locale.getLanguage();
    }

    public String getISO3() {
        return this.locale.getISO3Language();
    }

    public static List<Locale> getSupportedLocales() {
        SupportedLocales[] supported = SupportedLocales.values();
        ArrayList<Locale> out = new ArrayList<Locale>();
        for (SupportedLocales support : supported) {
            out.add(support.locale);
        }
        return out;
    }

    public static List<String> getSupportedLanguagesISO2() {
        SupportedLocales[] supported = SupportedLocales.values();
        ArrayList<String> out = new ArrayList<String>();
        for (SupportedLocales support : supported) {
            out.add(support.locale.getLanguage());
        }
        return out;
    }

    public static List<String> getSupportedLanguagesISO3() {
        SupportedLocales[] supported = SupportedLocales.values();
        ArrayList<String> out = new ArrayList<String>();
        for (SupportedLocales support : supported) {
            out.add(support.locale.getISO3Language());
        }
        return out;
    }

    public static boolean supports(Locale locale) {
        if (locale == null) {
            return false;
        }
        String language = locale.getLanguage();
        SupportedLocales[] supported = SupportedLocales.values();
        for (SupportedLocales support : supported) {
            if (support.locale.getLanguage().equals(language)) {
                return true;
            }
        }
        return false;
    }

    public static Locale getDefinedLocale(Locale locale) {
        if (locale == null) {
            return null;
        }
        String language = locale.getLanguage();
        SupportedLocales[] supported = SupportedLocales.values();
        for (SupportedLocales support : supported) {
            if (support.locale.getLanguage().equals(language)) {
                return support.locale;
            }
        }
        return null;
    }

    public static String test() {
        return "test";
    }
}