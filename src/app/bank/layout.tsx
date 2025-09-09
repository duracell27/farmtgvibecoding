import { Header } from "@/components/Header";

export default function BankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-4">
        {children}
      </main>
    </div>
  );
}
