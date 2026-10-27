import { AuthPage } from "@/components/auth";
import { Loader } from "@/components/ui";
import { Suspense } from "react";

export default function SignUp() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthPage isSignIn={false} />
    </Suspense>
  );
}