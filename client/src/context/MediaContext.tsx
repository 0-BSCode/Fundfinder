import React, { useState, useEffect, ReactElement } from "react";
import { MediaContextType } from "src/types/mediaContext";

export const MediaContext = React.createContext<MediaContextType>(
  {} as MediaContextType
);

export const MediaProvider = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  const [deviceWidth, setDeviceWidth] = useState<number>(-1);

  useEffect(() => {
    setDeviceWidth(window?.innerWidth);

    window?.addEventListener("resize", () => {
      setDeviceWidth(window?.innerWidth);
    });

    return () => {
      window?.removeEventListener("resize", () => {
        setDeviceWidth(window?.innerWidth);
      });
    };
  }, []);

  return (
    <MediaContext.Provider value={{ deviceWidth }}>
      {children}
    </MediaContext.Provider>
  );
};
