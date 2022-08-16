import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CrowdfundProvider } from "src/context/CrowdfundContext";
import { MediaProvider } from "src/context/MediaContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CrowdfundProvider>
      <MediaProvider>
        <Component {...pageProps} />
      </MediaProvider>
    </CrowdfundProvider>
  );
}

export default MyApp;
