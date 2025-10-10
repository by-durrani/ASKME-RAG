import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import React from "react";

const Auth = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <SignIn
        appearance={{ theme: dark }}
        fallbackRedirectUrl={"/api/callback/clerk"}
        signUpForceRedirectUrl={"/api/callback/clerk"}
      />
    </div>
  );
};

export default Auth;
