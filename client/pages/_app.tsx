import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CrowdfundProvider } from "src/context/CrowdfundContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CrowdfundProvider>
      <Component {...pageProps} />
    </CrowdfundProvider>
  );
}

export default MyApp;
