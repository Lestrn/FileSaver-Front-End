"use client"

import { Modal } from "@/components/Modal/Modal";
import { Portal } from "@/components/Portal/Portal";
import { acceptFriendRequest, deleteFriendship, denyFriendRequest, getAcceptedFriendRequests, getDeclinedFriendRequests, getPendingFriendRequests, getUserInfo, sendFriendRequest } from "@/services/api";
import { useEffect, useState } from "react";

import s from "./page.module.css"
import { SendMessage } from "@/components/SendMessage/SendMessage";

export default function Friends() {
    const key = "userInfo"

    const [userInfo, setInfo] = useState(null);
    const [stateAcceptedFriendsInfo, setAcceptedFriendUserInfo] = useState([]);
    const [statePendingFriendsInfo, setPendingFriendUserInfo] = useState([]);
    const [stateDeclinedFriendsInfo, setDeclinedFriendUserInfo] = useState([]);
    const [stateFailMessage, setFailMessage] = useState("");
    const [isFailed, setFail] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const [onShow, setOnShow] = useState(false);
    const [stateFriend, setFriend] = useState(null);

    const onClose = () => setOnShow(false)

    let acceptedFriendIds = [];
    let acceptedFriendInfos = [];
    let pendingFriendIds = [];
    let pendingFriendInfos = [];
    let declinedFriendIds = [];
    let declinedFriendInfos = [];
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(key));
        setInfo(data)
    }, [key]);


    useEffect(() => {
        if (!userInfo) return;
        initializeAcceptedFriendsInfo(userInfo.userId, userInfo.access_token)
    }, [userInfo]);

    async function getAcceptedFriendIds(userId, token) {
        try {
            const friends = await getAcceptedFriendRequests(userId, token);
            acceptedFriendIds = friends.value;
            return acceptedFriendIds;
        }
        catch (err) {
            console.log(err.message);
        }
    }

    async function initializeAcceptedFriendsInfo(userId, token) {
        acceptedFriendIds = await getAcceptedFriendIds(userId, token);
        console.log("friend ids", acceptedFriendIds);
        acceptedFriendInfos = [];
        for (let i = 0; i < acceptedFriendIds.length; i++) {
            const fullInfo = await getUserInfo(acceptedFriendIds[i].friendId, token);
            await acceptedFriendInfos.push(fullInfo.value);
        }

        setAcceptedFriendUserInfo(acceptedFriendInfos);
    }


    //add friend

    async function addFriend(event) {
        event.preventDefault();
        const form = event.target;
        const username = form.elements.username.value;
        try {
            await sendFriendRequest(userInfo.userId, username, userInfo.access_token);
            setFail(false);
            setSuccess(true);
        }
        catch (err) {
            setSuccess(false);
            setFail(true);
            setFailMessage(err.response.data);
        }
    }

    // show friend requests

    async function showPendingFriendRequests() {
        try {
            pendingFriendIds = (await getPendingFriendRequests(userInfo.userId, userInfo.access_token)).value;
        }
        catch (err) {
            console.log(err);
        }
        console.log("pending ids", pendingFriendIds);
        pendingFriendInfos = [];
        try {
            for (let i = 0; i < pendingFriendIds.length; i++) {
                pendingFriendInfos.push((await getUserInfo(pendingFriendIds[i].senderUserID, userInfo.access_token)).value);
            }
            setPendingFriendUserInfo(pendingFriendInfos);
            console.log("Pending friend infos", pendingFriendInfos);
        }
        catch (err) {
            console.log(err);
        }
    }

    //accept friend request

    async function acceptPendingFriendRequest(senderId, showDeclinedRequests = false) {
        try {
            await acceptFriendRequest(senderId, userInfo.userId, userInfo.access_token);
            if (showDeclinedRequests) {
                await showDeclinedFriendRequests();
            }
            else {
                await showPendingFriendRequests();
            }
            await initializeAcceptedFriendsInfo(userInfo.userId, userInfo.access_token);
        }
        catch (err) {
            console.log(err);
        }
    }
    //delete friendship
    async function deleteFriend(friendId, showDeclinedRequest = false) {
        try {
            await deleteFriendship(userInfo.userId, friendId, userInfo.access_token);
            await initializeAcceptedFriendsInfo(userInfo.userId, userInfo.access_token);
            if (showDeclinedRequest) {
                await showDeclinedFriendRequests();
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    // decline friend request
    async function denyPendingFriendRequest(senderId) {
        try {
            await denyFriendRequest(senderId, userInfo.userId, userInfo.access_token);
            await showPendingFriendRequests();
        }
        catch (err) {
            console.log(err);
        }
    }

    // show  declined friend requests
    async function showDeclinedFriendRequests() {
        try {
            declinedFriendIds = (await getDeclinedFriendRequests(userInfo.userId, userInfo.access_token)).value;
        }
        catch (err) {
            console.log(err);
        }
        declinedFriendInfos = [];
        try {
            for (let i = 0; i < declinedFriendIds.length; i++) {
                declinedFriendInfos.push((await getUserInfo(declinedFriendIds[i].senderUserID, userInfo.access_token)).value);
            }
            setDeclinedFriendUserInfo(declinedFriendInfos);
            console.log("Declined friend infos", declinedFriendInfos);
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <main className="container">
            <div className={s.friends} >
                <section className={s.first_block}>
                    <table className={s.table}>
                        <caption className={s.caption} >Friends</caption>
                        <thead className={s.thread}>
                            <tr>
                                <th>Friend Username</th>
                                <th>Action</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stateAcceptedFriendsInfo.length > 0 &&
                                stateAcceptedFriendsInfo.map((friendInfo) => (
                                    <tr className={s.row} key={friendInfo.id}>
                                        <td className={s.friend_username}>{friendInfo.username}</td>
                                        <td>
                                            <button className={s.button_appearing} type="button" onClick={() => deleteFriend(friendInfo.id)}>
                                                Delete friend
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className={s.button_appearing}
                                                type="button"
                                                onClick={() => {
                                                    setFriend(friendInfo);
                                                    setOnShow(true);
                                                    console.log(friendInfo);
                                                }}
                                            >
                                                Write message
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </section>
                <section className={s.black_form}>
                    <h3 className={s.title_form}>Send friend request</h3>
                    <form className={s.form} onSubmit={addFriend}>
                        <input className={s.input} name="username" placeholder="Username" required />
                        <button type="submit" className={s.button}>
                            Send  request
                        </button>
                    </form>
                    {isFailed && <div className={s.error_msg}>{stateFailMessage}</div>}
                    {isSuccess && <div className={s.success_msg}>friend request has been successfully sent!</div>}
                </section>
                <section className={s.black_div}>
                    <button type="button" className={s.button} onClick={showPendingFriendRequests}>Show pending requests</button>
                    <table className={s.table}>
                        <caption>Pending requests</caption>
                        <thead>
                            <tr>
                                <th>Friend Username</th>
                                <th>Action</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statePendingFriendsInfo.length > 0 &&
                                statePendingFriendsInfo.map((friendInfo) => (
                                    <tr className={s.row} key={friendInfo.id}>
                                        <td className={s.friend_username}>{friendInfo.username}</td>
                                        <td>
                                            <button className={s.button_appearing} onClick={() => acceptPendingFriendRequest(friendInfo.id)} type="button">
                                                Accept Request
                                            </button>
                                        </td>
                                        <td>
                                            <button className={s.button_appearing} onClick={() => denyPendingFriendRequest(friendInfo.id)} type="button">
                                                Deny Request
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                </section>
                <section className={s.black_div}>

                    <button type="button" className={s.button} onClick={showDeclinedFriendRequests}>Show declined requests</button>
                    <table className={s.table}>
                        <caption>Declined requests</caption>
                        <thead>
                            <tr>
                                <th>Friend Username</th>
                                <th>Action</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stateDeclinedFriendsInfo.length > 0 &&
                                stateDeclinedFriendsInfo.map((friendInfo) => (
                                    <tr className={s.row} key={friendInfo.id}>
                                        <td className={s.friend_username}>{friendInfo.username}</td>
                                        <td>
                                            <button className={s.button_appearing} onClick={() => acceptPendingFriendRequest(friendInfo.id, true)} type="button">
                                                Accept Request
                                            </button>
                                        </td>
                                        <td>
                                            <button className={s.button_appearing} onClick={() => deleteFriend(friendInfo.id, true)} type="button">
                                                Delete Request
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                </section>
            </div>

            {onShow && <Portal onClose={onClose} ><Modal onClose={onClose} ><SendMessage userInfo={userInfo} friend={stateFriend} onClose={onClose} /> </Modal> </Portal>}
        </main>
    );
}