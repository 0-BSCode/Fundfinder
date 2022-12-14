import Navbar from "src/components/navbar";
import Head from "next/head";
import React, { ReactElement } from "react";
import Attribution from "src/components/attribution";

const Layout = ({ children }: { children: ReactElement }): ReactElement => {
  return (
    <>
      <Head>
        <title>Fundfinder</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/icon-online.svg" />
      </Head>
      <Navbar />
      {children}
      <Attribution />
    </>
  );
};

export default Layout;
