import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] flex-1 items-center justify-center bg-bg-primary px-4 py-12">
      <SignUp
        forceRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
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
