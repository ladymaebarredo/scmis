import React from "react";
import { auth } from "../utils/firebase";

export function SignoutButton() {
  return (
    <button
      onClick={() => auth.signOut()}
      className="bg-red-950 text-white rounded-lg px-4 py-2 border-2 mt-auto hover:bg-white hover:text-red-950 transition-colors"
    >
      Signout
    </button>
  );
}
