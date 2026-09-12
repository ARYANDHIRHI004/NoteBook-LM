"use client";

import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn, signOut } from "@/features/auth/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    // Connect your Better Auth Google sign-in here
    // Example:
    await signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000/workspaces",
    });
  };

  

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left branding section */}
        <section className="relative hidden overflow-hidden bg-muted lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">
            <div className="flex items-center gap-2">
              <NotebookPen className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Quire</span>
            </div>

            <div className="max-w-lg">
              <h1 className="text-4xl font-semibold tracking-tight xl:text-5xl">
                Your sources.
                <br />
                Your notebook.
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Bring your documents, papers, recordings, and links together.
                Ask questions and get answers grounded in your own sources.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              A notebook that reads your sources before you do.
            </p>
          </div>
        </section>

        {/* Login section */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-center gap-2 lg:hidden">
              <NotebookPen className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Quire</span>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to continue to your notebook
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full gap-3"
                onClick={handleGoogleLogin}
              >
                {/* Google icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.57-5.17 3.57-8.64Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.07 7.92-2.91l-3.87-3c-1.07.72-2.44 1.15-4.05 1.15-3.12 0-5.76-2.11-6.7-4.95H1.3v3.1A12 12 0 0 0 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.29a7.22 7.22 0 0 1 0-4.58v-3.1H1.3a12 12 0 0 0 0 10.78l4-3.1Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.76c1.76 0 3.34.61 4.58 1.81l3.43-3.43C17.94 1.15 15.24 0 12 0A12 12 0 0 0 1.3 6.61l4 3.1c.94-2.84 3.58-4.95 6.7-4.95Z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative py-2">
                <Separator />

                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                  OR
                </span>
              </div>

              <Button type="button" variant="secondary" className="h-11 w-full">
                Continue with email
              </Button>
            </div>

            <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to our{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
