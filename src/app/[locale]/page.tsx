import { HomePage } from "@/app/components/HomePage";
import type { Locale } from "@/config/locales";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  return <HomePage locale={locale as Locale} />;
}
