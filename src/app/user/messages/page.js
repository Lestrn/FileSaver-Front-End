"use client"
import { useContext, useEffect, useState } from "react";
import { getReceivedMessages, getSentMessages, getUserInfo } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
export default function Message() {
    const key = "userInfo"
    const [userInfo, setInfo] = useState(null);
    const [stateReceivedMessages, setStateReceivedMessages] = useState([]);
    const [stateSentMessages, setStateSentMessages] = useState([]);


    const { isLoading, setLoading } = useContext(Context);
    const [isFailed, setFail] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(key));
        setInfo(data)
    }, [key]);

    useEffect(() => {
        if (!userInfo) {
            return;
        }
        receivedMessages();
        sentMessages();
    }, [userInfo])

    async function receivedMessages() {
        try {
            const messages = await getReceivedMessages(userInfo.userId, userInfo.access_token);
            const messagesWithUsername = await getUsernameWithMessages(messages.value);
            setStateReceivedMessages(messagesWithUsername);
        }
        catch (err) {
            console.log(err)
        }
    }

    async function sentMessages() {
        try{
            const messages = await getSentMessages(userInfo.userId, userInfo.access_token);
            const messagesWithUsername = await getUsernameWithMessages(messages.value);
            setStateSentMessages(messagesWithUsername);
        }
        catch(err){
            console.log(err);
        }
    }

    async function getUsernameWithMessages(messages) {

        const messagesWithUsername = [];

        for (let i = 0; i < messages.length; i++) {
            const senderUser = (await getUserInfo(messages[i].senderUserID, userInfo.access_token)).value.username;
            const receiverUser = (await getUserInfo(messages[i].receiverUserID, userInfo.access_token)).value.username;
            console.log(senderUser);
            messagesWithUsername.push({
                receivedFrom: senderUser,
                sentTo: receiverUser,
                content: messages[i].content,
                timestamp: messages[i].timestamp,
                senderUserID: messages[i].senderUserID,
                messageId: messages[i].id
            });
        }
        console.log(messagesWithUsername);
        return messagesWithUsername;
       

    }

    return (
        <main>
            <div style={{ color: "white" }}>
                <h3>Received Messages</h3>
                <ul>
                    {stateReceivedMessages.length > 0 && stateReceivedMessages.map(message => (
                        <li key={message.messageId}>
                            <p>{message.receivedFrom}</p>
                            <p>{message.timestamp}</p>
                        </li>
                    ))}
                </ul>
                <h3>Sent Messages</h3>
                <ul>
                    {stateSentMessages.length > 0 && stateSentMessages.map(message => (
                        <li key={message.messageId}>
                            <p>{message.sentTo}</p>
                            <p>{message.timestamp}</p>
                            <div>{message.content}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
