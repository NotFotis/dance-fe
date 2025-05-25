"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const t = useTranslations("cookie");
  const locale = useLocale();

  useEffect(() => {
    setHasMounted(true);
    if (!localStorage.getItem("cookieAccepted")) {
      setVisible(true);
    }
  }, []);

  if (!hasMounted || !visible) return null;

  return (
    <div style={{
      position: 'fixed',
      left: '50%',
      bottom: '32px',
      transform: 'translateX(-50%)',
      background: '#141414',
      color: '#fff',
      borderRadius: '16px',
      boxShadow: '0 6px 32px rgba(0,0,0,0.20)',
      padding: '20px 36px',
      zIndex: 1000,
      minWidth: '320px',
      maxWidth: '90vw',
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    }}>
      <span style={{
        color: '#fff',
        fontSize: '1.05rem',
        textAlign: 'center',
        lineHeight: '1.7',
        flex: 1
      }}>
        {t("message") + " "}
        <Link
          href={`/${locale}/cookie-policy`}
          style={{
            color: '#fff',
            fontWeight: 'bold',
            textDecoration: 'underline',
            whiteSpace: 'nowrap'
          }}
        >
          {t("learnMore")}
        </Link>
      </span>
      <button
        onClick={() => {
          localStorage.setItem("cookieAccepted", "yes");
          setVisible(false);
        }}
        style={{
          background: '#fff',
          color: '#111',
          fontWeight: 700,
          padding: '10px 26px',
          border: 'none',
          borderRadius: '7px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          fontSize: '1.08rem',
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
      >
        {t("accept")}
      </button>
    </div>
  );
}
