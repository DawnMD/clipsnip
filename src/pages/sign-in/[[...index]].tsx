import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const SignInPage = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="absolute z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
};

export default SignInPage;
