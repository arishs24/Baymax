import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = "dev-pwdodbrxd6zavbuz.us.auth0.com";
const clientId = "nnxyJ9vtxjj8mgAtyse2HIP4LOBwNC4x";

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>
);
