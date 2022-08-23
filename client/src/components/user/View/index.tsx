import React, { ReactElement, useContext, useState, useEffect } from "react";
import profPic from "public/assets/images/profile-sample.png";
import { User } from "src/types/user";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import moment from "moment";
import trimUsername from "src/utils/trimUsername";
import { Goal } from "src/types/goal";
import GoalCard from "src/components/goal/Card";
import styles from "./styles.module.css";

const UserView = ({ user }: { user: User }): ReactElement => {
  const { retrieveUserGoals, updateUser } = useContext(CrowdfundContext);
  const [userGoals, setUserGoals] = useState<Goal[]>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("Retrieving...");

  const confirmEdit = async (e: any) => {
    e.preventDefault();
    await updateUser(user.id, username, "");
    setIsEditing(false);
  };

  useEffect(() => {
    const getUserGoals = async () => {
      const goals = await retrieveUserGoals(user.id);
      setUserGoals(goals);

      if (user.username) setUsername(user.username);
    };

    getUserGoals();
  }, [user]);

  return (
    <main className={styles.profile}>
      <h3 className={styles.profile__title}>Profile</h3>
      <section className={styles.profile__content}>
        <div className={styles.profile__imgWrapper}>
          <img
            className={styles.profile__img}
            src={profPic.src}
            alt={"Profile Pic"}
          />
        </div>
        <div className={styles.profile__infoWrapper}>
          <div className={styles.profile__info}>
            <div className={styles.profile__fields}>
              <p className={styles.profile__field}>Username:</p>
              <p className={styles.profile__field}>Joined:</p>
            </div>
            <div className={styles.profile__values}>
              {isEditing ? (
                <input
                  className={styles.profile__editName}
                  type={"text"}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              ) : (
                <p className={styles.profile__value}>
                  {trimUsername(username, 20)}
                </p>
              )}

              <p className={styles.profile__value}>
                {moment(user.createdAt).fromNow()}
              </p>
            </div>
          </div>
          {isEditing ? (
            <div className={styles.profile__editBtns}>
              <button
                className={styles.profile__editCancel}
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                  setUsername(user.username);
                }}
              >
                Cancel
              </button>
              <button
                className={styles.profile__editConfirm}
                onClick={(e) => {
                  confirmEdit(e);
                }}
              >
                Confirm
              </button>
            </div>
          ) : (
            <button
              className={styles.profile__editBtn}
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          )}
        </div>
      </section>
      {userGoals && (
        <section className={styles.profile__goalsSection}>
          <h4 className={styles.profile__goalsTitle}>Goals</h4>
          <div className={styles.profile__goals}>
            {userGoals.map((goal: Goal) => (
              <GoalCard goal={goal} key={goal.id} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default UserView;
