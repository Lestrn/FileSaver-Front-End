"use client"

import { acceptFriendRequest, deleteFriendship, denyFriendRequest, getAcceptedFriendRequests, getDeclinedFriendRequests, getPendingFriendRequests, getUserInfo, sendFriendRequest } from "@/services/api";
import { useEffect, useState } from "react";

export default function Friends() {
    const key = "userInfo"

    const [userInfo, setInfo] = useState(null);
    const [stateAcceptedFriendsInfo, setAcceptedFriendUserInfo] = useState([]);
    const [statePendingFriendsInfo, setPendingFriendUserInfo] = useState([]);
    const [stateDeclinedFriendsInfo, setDeclinedFriendUserInfo] = useState([]);

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
            alert("success");
        }
        catch (err) {
            console.log(err);
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

    async function acceptPendingFriendRequest(senderId) {
        try {
            await acceptFriendRequest(senderId, userInfo.userId, userInfo.access_token);
            await showPendingFriendRequests();
            await initializeAcceptedFriendsInfo(userInfo.userId, userInfo.access_token);
        }
        catch (err) {
            console.log(err);
        }
    }
    //delete friendship
    async function deleteFriend(friendId){
        try{
            await deleteFriendship(userInfo.userId, friendId, userInfo.access_token);
            await initializeAcceptedFriendsInfo(userInfo.userId, userInfo.access_token);
        }
        catch(err){
            console.log(err);
        }
    }
    // decline friend request
    async function denyPendingFriendRequest(senderId){
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
        <main>
            <div style={{ color: "white" }}>
                <h3>Accepted friends</h3>
                <ul>
                    {stateAcceptedFriendsInfo.length > 0 && stateAcceptedFriendsInfo.map(friendInfo => (
                        <li key={friendInfo.id}>
                            <p>{friendInfo.username}</p>
                            <button type = "button" onClick={() => {deleteFriend(friendInfo.id)}}>Delete friend</button>
                        </li>
                    ))}
                </ul>

                <h3>Send friend request</h3>
                <form onSubmit={addFriend}>
                    <input name="username" placeholder="Username" required />
                    <button type="submit" className="btn">
                        Send  request
                    </button>
                </form>

                <h3>Show pending requests</h3>
                <button type="button" onClick={showPendingFriendRequests}>Show pending requests</button>
                <ul>
                    {statePendingFriendsInfo.length > 0 && statePendingFriendsInfo.map(friendInfo => (
                        <li key={friendInfo.id}>
                            <p>{friendInfo.username}</p>
                            <button onClick={() => { acceptPendingFriendRequest(friendInfo.id) }}>Accepted Request</button>
                            <button onClick={() => { denyPendingFriendRequest(friendInfo.id) }}>Deny Request</button>
                        </li>
                    ))}
                </ul>
                <h3>Show declined requests</h3>
                <button type="button" onClick={showDeclinedFriendRequests}>Show declined requests</button>
                <ul>
                    {stateDeclinedFriendsInfo.length > 0 && stateDeclinedFriendsInfo.map(friendInfo => (
                        <li key={friendInfo.id}>
                            <p>{friendInfo.username}</p>
                            <button onClick={() => { acceptPendingFriendRequest(friendInfo.id) }}>Accepted Request</button>
                            <button onClick={() => { deleteFriend(friendInfo.id) }}>Delete Request</button>
                        </li>
                    ))}
                </ul>
            </div>


        </main>
    );
}