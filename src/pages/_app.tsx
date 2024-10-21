import Layout from "@/components/Layout";
import ErrorBoundaryWrapper from "@/features/common/ErrorBoundaryWrapper";
import GlobalLoadingBar from "@/features/common/GlobalLoadingBar";
import CustomQueryClientProvider from "@/libs/react-query/CustomQueryClientProvider";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ErrorBoundaryWrapper>
      <CustomQueryClientProvider>
        <SessionProvider session={session}>
          <Layout>
            <GlobalLoadingBar />
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </CustomQueryClientProvider>
    </ErrorBoundaryWrapper>
  );
}

export default appWithTranslation(App);
