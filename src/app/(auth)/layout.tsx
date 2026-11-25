import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold text-primary">
            EchtNah
          </Link>
        </div>
      </header>
      <main id="hauptinhalt" className="mx-auto w-full max-w-md flex-1 p-4 py-10">
        {children}
      </main>
    </div>
  );
}
