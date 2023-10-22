import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const SignUpPage = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="absolute z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-sm">
      <SignUp
        path="/sign-up"
        routing="path"
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
};

export default SignUpPage;
