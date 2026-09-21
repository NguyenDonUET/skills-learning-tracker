import { TrackerProvider } from "@/components/providers/tracker-provider";
import { TopBar } from "@/components/layout/top-bar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TrackerProvider>
      <TopBar />
      <div className="flex flex-1 flex-col bg-bg-primary">{children}</div>
    </TrackerProvider>
  );
}
