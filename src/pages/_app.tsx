import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ErrorBoundaryWrapper>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ErrorBoundaryWrapper>
  );
}

export default appWithTranslation(App);
