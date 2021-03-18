import React, { useContext, Fragment, useState, useEffect } from "react";
import { AppContext } from "../../Context";
import { Avatar } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { auth } from "../../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoVerified } from "react-icons/go";
import { IoMdGrid } from "react-icons/io";
import { RiLayoutRowLine } from "react-icons/ri";
import { BsPlusSquare } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";

const UsersProfile = (props) => {
  const [_, loading] = useAuthState(auth);
  const [isFollowed, setFollowingState] = useState(false);
  const [isFollower, setFollowerState] = useState(false);
  const [grid, setGrid] = useState(true);
  const context = useContext(AppContext);
  const [openSuggestionsBox, setSuggestionsBox] = useState(false);
  const {
    usersProfileData,
    changeMainState,
    initializeChatDialog,
    uid,
    handleFollowing,
    receivedData,
    handleUsersModal,
    igVideoImg,
    suggestionsList,
    getUsersProfile,
    notify,
  } = context;

  const redirectToPost = (i, id) => {
    changeMainState("currentPostIndex", { index: i, id: id });
    props.history.push("/browse-post");
  };
  const message = (uid, username, avatarUrl) => {
    initializeChatDialog(uid, username, avatarUrl);
    props.history.push("/messages");
  };
  useEffect(() => {
    receivedData?.following &&
      setFollowingState(
        receivedData?.following?.some(
          (item) => item?.receiverUid === usersProfileData?.uid
        )
      );
    receivedData?.followers &&
      setFollowerState(
        receivedData?.followers?.some(
          (item) => item?.senderUid === usersProfileData?.uid
        )
      );
  }, [receivedData, usersProfileData]);

  useEffect(() => {
    changeMainState("currentPage", usersProfileData.userName || "User Profile");
  }, [usersProfileData, changeMainState]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const browseUser = (specialUid, name) => {
      if(specialUid, name){
            getUsersProfile(specialUid)
        .then(() => {
            setSuggestionsBox(false);
            props.history.push(`/user-profile/${name}`);
        })
        .catch((err) => {
            notify(
            (err && err.message) || "error has occurred. please try again later!",
            "error"
            );
        }); 
      }
    
  };
  return (
    <Fragment>
      <section id="usersProfile" className="users--profile--container ">
        {/* Header */}
        {/* upper row */}

        <div className="desktop-comp">
          <div className="user--top--info flex-column">
            <header className="user-top-inner flex-row">
              <div className="user--pic--container flex-column">
                <Avatar
                  className="user__picture"
                  title={usersProfileData?.userName}
                  src={usersProfileData?.userAvatarUrl}
                  alt={usersProfileData?.userName}
                />
              </div>
              <div className="desktop--inner--info flex-column">
                <div className="users--action--row flex-row">
                  <h5
                    className="profile__display__name"
                    title={usersProfileData?.userName}
                  >
                    {usersProfileData?.userName}
                    {usersProfileData?.isVerified ? (
                      <GoVerified className="verified_icon" />
                    ) : null}
                  </h5>
                  <div className="flex-row">
                    {isFollowed && (
                      <button
                        disabled={!usersProfileData?.uid}
                        className="profile__btn prof__btn__unfollowed"
                        onClick={() =>
                          message(
                            usersProfileData?.uid,
                            usersProfileData?.userName,
                            usersProfileData?.userAvatarUrl
                          )
                        }
                      >
                        Message
                      </button>
                    )}

                    <button
                      disabled={!usersProfileData?.uid}
                      onClick={() =>
                        handleFollowing(
                          isFollowed,
                          usersProfileData?.uid,
                          usersProfileData?.userName,
                          usersProfileData?.userAvatarUrl,
                          uid,
                          receivedData?.userName,
                          receivedData?.userAvatarUrl
                        )
                      }
                      className={
                        !isFollowed
                          ? "profile__btn prof__btn__followed"
                          : "profile__btn prof__btn__unfollowed"
                      }
                    >
                      {" "}
                      {!isFollowed && isFollower
                        ? "follow back"
                        : !isFollowed && !isFollower
                        ? "follow"
                        : "unfollow"}
                    </button>
                    <button
                      className="sugg__btn profile__btn prof__btn__followed"
                      style={{
                        backgroundColor: openSuggestionsBox
                          ? "#63baf4"
                          : "#0095f6",
                        border: openSuggestionsBox ? "#63baf4" : "#0095f6",
                      }}
                      onClick={() => setSuggestionsBox(!openSuggestionsBox)}
                    >
                      <IoMdArrowDropdown />
                    </button>
                  </div>
                </div>
                <div className="desktop--social--row flex-row">
                  <p>
                    <span>
                      {usersProfileData?.posts?.length.toLocaleString()}
                    </span>{" "}
                    {usersProfileData?.posts?.length > 1 ? "posts" : "post"}
                  </p>
                  <p
                    className="acc-action"
                    onClick={() =>
                      handleUsersModal(
                        true,
                        usersProfileData?.followers,
                        "followers"
                      )
                    }
                  >
                    <span>
                      {usersProfileData?.followers?.length.toLocaleString()}
                    </span>{" "}
                    {usersProfileData?.followers?.length > 1
                      ? "followers"
                      : "follower"}
                  </p>
                  <p
                    className="acc-action"
                    onClick={() =>
                      handleUsersModal(
                        true,
                        usersProfileData?.following,
                        "following"
                      )
                    }
                  >
                    <span>
                      {usersProfileData?.following?.length.toLocaleString()}
                    </span>{" "}
                    following
                  </p>
                </div>

                {/* bottom row */}
                {usersProfileData?.profileInfo &&
                  usersProfileData?.profileInfo.professionalAcc &&
                  usersProfileData?.profileInfo.professionalAcc.show && (
                    <div className="prof--acc--category">
                      <span>
                        {
                          usersProfileData.profileInfo?.professionalAcc
                            ?.category
                        }
                      </span>
                    </div>
                  )}

                <div className="bottom--row--user-info flex-column">
                  <span>{usersProfileData?.profileInfo?.bio}</span>
                </div>
              </div>
            </header>
            {openSuggestionsBox && (
              <div className="users--suggestions--container">
                <div className="user--sugg--header flex-row">
                  <span className="user__sugg__title__title">Suggestions</span>
                  <span className="user__see__all__btn">see all</span>
                </div>
                <div className="suggestions--list--container flex-row">
                  <ul className="suggestion--items flex-row">
                    {suggestionsList
                      ?.filter(
                        (item) =>
                          item?.uid !== receivedData?.uid &&
                          item?.uid !== usersProfileData?.uid
                      )
                      .map((item, i) => {
                        return (
                          <li key={i} className="suggestion--item flex-column">
                            <div className="suggestion--item-inner">
                              <Avatar
                                onClick={() =>
                                  browseUser(item?.uid, item?.userName)
                                }
                                src={item?.userAvatarUrl}
                                alt={item?.userName}
                                className="mb-2"
                              />
                              <span
                                onClick={() =>
                                  browseUser(item?.uid, item?.userName)
                                }
                                title={item?.userName}
                                className="acc__name"
                              >
                                {item?.userName}
                              </span>
                              <span
                                className="user__name"
                                title={item?.userName}
                              >
                                {item?.profileInfo?.name}
                              </span>
                              <button
                                className={
                                  receivedData?.following &&
                                  receivedData?.following?.length > 0 &&
                                  receivedData?.following?.some(
                                    (q) => q.receiverUid === item?.uid
                                  )
                                    ? "profile__btn prof__btn__unfollowed"
                                    : "profile__btn prof__btn__followed"
                                }
                                color="primary"
                                onClick={() =>
                                  handleFollowing(
                                    receivedData?.following &&
                                      receivedData?.following?.length > 0 &&
                                      receivedData?.following?.some(
                                        (el) => el?.receiverUid === item?.uid
                                      ),
                                    item?.uid,
                                    item?.userName,
                                    item?.userAvatarUrl,
                                    receivedData?.uid,
                                    receivedData?.userName,
                                    receivedData?.userAvatarUrl
                                  )
                                }
                              >
                                {receivedData?.following &&
                                receivedData?.following?.length > 0 &&
                                receivedData?.following?.some(
                                  (user) => user?.receiverUid === item?.uid
                                )
                                  ? "Unfollow"
                                  : "Follow"}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* body */}
          <div className="users--profile--stripe flex-row">
            {usersProfileData?.posts?.length >= 1 ? (
              <div className="profile--stripe--inner flex-row">
                <span
                  onClick={() => setGrid(true)}
                  style={{
                    color: grid ? "#1d8cd6" : "#8e8e8e",
                    borderTop: grid ? "2px solid #363636" : "none",
                  }}
                >
                  <IoMdGrid />
                </span>
                <span
                  onClick={() => setGrid(false)}
                  style={{
                    color: !grid ? "#1d8cd6" : "#8e8e8e",
                    borderTop: !grid ? "2px solid #363636" : "none",
                  }}
                >
                  <RiLayoutRowLine />
                </span>
              </div>
            ) : null}
          </div>

          {usersProfileData?.posts?.length >= 1 && !loading ? (
            <div
              className={
                grid
                  ? "users--profile--posts"
                  : "users--profile--rowLine flex-column"
              }
            >
              {usersProfileData?.posts?.map((post, i) => {
                return (
                  <div
                    key={post?.id + i}
                    className="profile--posts--container "
                  >
                    <div
                      onClick={() => redirectToPost(i, post?.id)}
                      className="user--img--container flex-column"
                    >
                      <img
                        style={{ width: "100%" }}
                        className="users__profile__image"
                        src={
                          post?.contentType === "image"
                            ? post?.contentURL
                            : post?.contentType === "video"
                            ? igVideoImg
                            : null
                        }
                        alt={`post #${i}`}
                      />
                      <div className="user--img--cover">
                        <div className="flex-row">
                          <span className="mr-3">
                            <FaHeart /> {post?.likes?.people?.length}
                          </span>
                          <span>
                            <FaRegComment />{" "}
                            {post?.comments.length > 0
                              ? post?.comments.length
                              : post?.comments.length}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : loading ? (
            <Skeleton
              count={10}
              height={250}
              width={250}
              className="mt-4 mr-4 mx-auto"
            />
          ) : (
            <div className="empty--posts--container flex-column">
              <div className="empty--posts--inner mx-auto flex-column">
                <div className="plus--icon--container flex-column">
                  <BsPlusSquare className="plus__icon" />
                </div>
                <h3>Profile</h3>
                <p>
                  When you share photos and videos, they'll <br /> be appear on
                  your profile page
                </p>

                <span>Share your first photo or video</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </Fragment>
  );
};
export default withRouter(UsersProfile);
