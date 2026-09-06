import Link from "next/link";

export const metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">You&rsquo;re offline</h1>
      <p className="text-muted-foreground">
        No connection right now. Tools you&rsquo;ve already opened may still work — everything runs in your
        browser, nothing is uploaded to a server.
      </p>
      <Link
        href="/"
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Try again
      </Link>
    </div>
  );
}
