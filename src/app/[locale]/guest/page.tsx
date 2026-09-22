import { setRequestLocale } from "next-intl/server";

import { DashboardView } from "@/components/dashboard/dashboard-view";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GuestDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DashboardView />;
}
