import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CrowdfundProvider } from "src/context/CrowdfundContext";
import { MediaProvider } from "src/context/MediaContext";
import Layout from "layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CrowdfundProvider>
      <MediaProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MediaProvider>
    </CrowdfundProvider>
  );
}

export default MyApp;
