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
    <div className="cookie-banner">
      <span className="cookie-message">
        {t("message") + " "}
        <Link
          href={`/${locale}/cookie-policy`}
          style={{
            color: "#fff",
            fontWeight: "bold",
            textDecoration: "underline",
            whiteSpace: "nowrap"
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
        className="cookie-accept"
      >
        {t("accept")}
      </button>
      <style jsx>{`
        .cookie-banner {
          position: fixed;
          left: 50%;
          bottom: 32px;
          transform: translateX(-50%);
          background: #141414;
          color: #fff;
          border-radius: 16px;
          box-shadow: 0 6px 32px rgba(0, 0, 0, 0.2);
          padding: 20px 48px;
          z-index: 1000;
          min-width: 420px;
          max-width: 700px;   /* Made it wider! */
          width: 90vw;        /* Responsive width */
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .cookie-message {
          color: #fff;
          font-size: 1.09rem;
          text-align: center;
          line-height: 1.7;
          flex: 1;
        }
        .cookie-accept {
          background: #fff;
          color: #111;
          font-weight: 700;
          padding: 10px 32px;
          border: none;
          border-radius: 7px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          font-size: 1.12rem;
          cursor: pointer;
          transition: background 0.1s;
        }

        /* Responsive for tablets and below */
        @media (max-width: 900px) {
          .cookie-banner {
            max-width: 98vw;
            min-width: 0;
            padding: 16px 10px;
          }
        }
        @media (max-width: 600px) {
          .cookie-banner {
            flex-direction: column;
            align-items: stretch;
            padding: 12px 2vw;
            gap: 16px;
            max-width: 100vw;
            width: 98vw;
            min-width: 0;
            left: 50%;
            bottom: 10px;
          }
          .cookie-message {
            font-size: 0.97rem;
            text-align: left;
          }
          .cookie-accept {
            width: 100%;
            padding: 14px 0;
            font-size: 1.05rem;
          }
        }
      `}</style>
    </div>
  );
}
