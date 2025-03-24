"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const supportedLocales = ["en", "el"];

  // Get the current locale from the pathname. Assumes the first segment is the locale.
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale = supportedLocales.includes(pathSegments[0])
    ? pathSegments[0]
    : "en";

  // Function to generate a new pathname for a target locale.
  const generateLocalizedPath = (targetLocale) => {
    const segments = pathname.split("/").filter(Boolean);
    // If there's no segment, then return /targetLocale
    if (segments.length === 0) {
      return `/${targetLocale}`;
    }
    // If the first segment is a locale, replace it
    if (supportedLocales.includes(segments[0])) {
      segments[0] = targetLocale;
    } else {
      // Otherwise, add the targetLocale at the start
      segments.unshift(targetLocale);
    }
    return `/${segments.join("/")}`;
  };

  return (
    <div className="flex space-x-2">
      {supportedLocales.map((locale) => (
        <Link
          key={locale}
          href={generateLocalizedPath(locale)}
          locale={locale}
          className={`px-2 py-1 border rounded ${
            locale === currentLocale
              ? "bg-white text-black"
              : "bg-black text-white"
          }`}
        >
          <h2>{locale.toUpperCase()}</h2>
        </Link>
      ))}
    </div>
  );
}
