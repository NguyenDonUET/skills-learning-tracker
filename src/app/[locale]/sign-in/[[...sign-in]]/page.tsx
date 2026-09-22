import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] flex-1 items-center justify-center bg-bg-primary px-4 py-12">
      <SignIn
        forceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-surface shadow-md border border-border-subtle",
          },
        }}
      />
    </div>
  );
}
