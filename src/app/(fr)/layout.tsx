import type { Metadata } from "next";
import { I18nProvider } from "@/app/i18n/provider";
import { buildHomeMetadata } from "@/app/lib/seo/metadata";

export const metadata: Metadata = buildHomeMetadata("fr");

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider initialLocale="fr">
      {children}
    </I18nProvider>
  );
}
