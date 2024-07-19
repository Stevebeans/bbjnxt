// src/pages/_app.js

import React from "react";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/utils/AuthContext";
import "@/app/styles/index.css";

function MyApp({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default MyApp;
