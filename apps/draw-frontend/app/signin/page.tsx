import { AuthPage } from "@/components/auth";
import { Loader } from "@/components/ui";
import { Suspense } from "react";

export default function SignIn() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthPage isSignIn={true} />
    </Suspense>
  );
}