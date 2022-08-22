import React, { ReactElement, useContext, useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import { User } from "src/types/user";
import UserView from "src/components/user/View";

const UserPage: NextPage = (): ReactElement => {
  const router = useRouter();
  const userId = router?.query?.userId;
  const { retrieveUser } = useContext(CrowdfundContext);
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const getUser = async () => {
      const retrievedUser = await retrieveUser(userId);
      setUser(retrievedUser);
    };

    getUser();
  }, [userId]);

  return <UserView user={user} />;
};

export default UserPage;
