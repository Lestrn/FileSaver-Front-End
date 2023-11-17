"use client"
import { useContext, useEffect, useState } from "react";
import { deleteMessage, getReceivedMessages, getSentMessages, getUserInfo } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
import ShowMessage from "@/components/Show Message/ShowMessage";
import { Portal } from "@/components/Portal/Portal";
import { Modal } from "@/components/Modal/Modal";
import css from "./page.module.css"
export default function Message() {
    const key = "userInfo"
    const [userInfo, setInfo] = useState(null);
    const [stateReceivedMessages, setStateReceivedMessages] = useState([]);
    const [stateSentMessages, setStateSentMessages] = useState([]);


    const [onShow, setOnShow] = useState(false);
    const [stateMessageInfo, setStateMessageInfo] = useState(null);

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
        try {
            const messages = await getSentMessages(userInfo.userId, userInfo.access_token);
            const messagesWithUsername = await getUsernameWithMessages(messages.value);
            setStateSentMessages(messagesWithUsername);
        }
        catch (err) {
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

    const onClose = () => setOnShow(false)

    async function deleteUserMessage(msgId) {
        try {
            await deleteMessage(msgId, userInfo.userId, userInfo.access_token);
            await receivedMessages();
            await sentMessages();
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <main className="container">
            <section className={css.messageSection}>
                <table className={css.messageTable}>
                <caption className={css.caption} >Received messages </caption>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stateReceivedMessages.length > 0 &&
                            stateReceivedMessages.map((message) => (
                                <tr key={message.messageId} className={css.messageRow}>
                                    <td className={css.textUsername}>{message.receivedFrom}</td>
                                    <td className={css.textTimestamp}>{message.timestamp}</td>
                                    <td>
                                        <button
                                            className={css.messageButton}
                                            onClick={() => {
                                                setOnShow(true);
                                                setStateMessageInfo({
                                                    message: message.content,
                                                    title: "Received from: ",
                                                    username: message.receivedFrom,
                                                });
                                            }}
                                        >
                                            Show received message
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={css.messageButton}
                                            onClick={() => deleteUserMessage(message.messageId)}
                                        >
                                            Delete Message
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </section>
            <section className={css.messageSection}>
                <table className={css.messageTable}>
                <caption className={css.caption} >Sent messages </caption>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stateSentMessages.length > 0 &&
                            stateSentMessages.map((message) => (
                                <tr key={message.messageId} className={css.messageRow}>
                                    <td className={css.textUsername}>{message.sentTo}</td>
                                    <td className={css.textTimestamp}>{message.timestamp}</td>
                                    <td>
                                        <button
                                            className={css.messageButton}
                                            onClick={() => {
                                                setOnShow(true);
                                                setStateMessageInfo({
                                                    message: message.content,
                                                    title: "Sent to ",
                                                    username: message.sentTo,
                                                });
                                            }}
                                        >
                                            Show sent message
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className={css.messageButton}
                                            onClick={() => deleteUserMessage(message.messageId)}
                                        >
                                            Delete Message
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </section>

            {onShow && <Portal onClose={onClose} ><Modal onClose={onClose} ><ShowMessage message={stateMessageInfo.message} title={stateMessageInfo.title} username={stateMessageInfo.username} /> </Modal> </Portal>}
        </main>
    );
}
