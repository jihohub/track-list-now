import Layout from "@/components/Layout";
import SentryContextProvider from "@/components/SentryContextProvider";
import ErrorBoundaryWrapper from "@/features/common/components/ErrorBoundaryWrapper";
import useScrollRestoration from "@/hooks/useScrollRestoration";
import CustomQueryClientProvider from "@/libs/react-query/CustomQueryClientProvider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useScrollRestoration();

  return (
    <ErrorBoundaryWrapper>
      <CustomQueryClientProvider>
        <SessionProvider session={session}>
          <SentryContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SentryContextProvider>
        </SessionProvider>
      </CustomQueryClientProvider>
    </ErrorBoundaryWrapper>
  );
}

export default appWithTranslation(App);
