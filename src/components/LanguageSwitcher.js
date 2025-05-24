"use client";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher({ currentLocale, localeToSlug, routeSegment = "news" }) {
  // Strapi locales: 'en', 'el-GR'
  // Your Next.js routing: 'en', 'el'
  const supportedLocales = [
    { code: 'en', label: 'EN' },
    { code: 'el', label: 'EL' }
  ];
  const pathname = usePathname();

  const handleLocaleChange = (locale, targetSlug) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    let newPath;

    if (targetSlug) {
      // On a details page, build the correct target path for the translation
      newPath = `/${locale}/${routeSegment}/${targetSlug}`;
    } else {
      // Otherwise, just swap the locale segment
      newPath = pathname.replace(/^\/(en|el)/, `/${locale}`);
    }

    window.location.pathname = newPath;
  };

  return (
    <div className="flex space-x-2 mb-4 sm:mb-0">
      {supportedLocales.map(({ code, label }) => {
        // Use localized slug if available (on detail page)
        const targetSlug = localeToSlug ? localeToSlug[code] : null;

        // If localeToSlug is present but no translation for this locale, disable the button
        const isDisabled = !!localeToSlug && !targetSlug;

        return (
          <button
            key={code}
            onClick={() => !isDisabled && handleLocaleChange(code, targetSlug)}
            disabled={isDisabled}
            className={`px-2 py-1 border rounded transition-all ${
              code === currentLocale
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
