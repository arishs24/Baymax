import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => {
        console.log("Redirecting to login...");
        loginWithRedirect();
      }}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4B4BFF",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "10px",
      }}
    >
      Log In
    </button>
  );
}

export function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => {
        console.log("Logging out...");
        logout({ returnTo: window.location.origin });
      }}
      style={{
        padding: "10px 20px",
        backgroundColor: "#FF4B4B",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "10px",
      }}
    >
      Log Out
    </button>
  );
}
