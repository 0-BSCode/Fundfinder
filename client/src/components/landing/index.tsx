import React, { ReactElement } from "react";
import LandingCall from "./Call";
import LandingFeatures from "./Features";
import LandingHero from "./Hero";

const Landing = (): ReactElement => {
  return (
    <>
      <LandingHero />
      <LandingFeatures />
      <LandingCall />
    </>
  );
};

export default Landing;
