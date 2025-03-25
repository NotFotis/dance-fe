"use client";
import Link from "next/link";

export default function LanguageSwitcher({ currentLocale }) {
  const supportedLocales = ['en', 'el'];
console.log(currentLocale);

  // When user clicks a locale, store it in a cookie.
  const handleLocaleChange = (locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    // Manually change the URL or let the navigation mechanism (Link) update the URL.
    window.location.pathname = `/${locale}${window.location.pathname.replace(/^\/(en|el)/, '')}`;
  };

  return (
    <div className="flex space-x-2">
      {supportedLocales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className={`px-2 py-1 border rounded ${
            locale === currentLocale
            ? "bg-white text-black"
            : "bg-black text-white"
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
