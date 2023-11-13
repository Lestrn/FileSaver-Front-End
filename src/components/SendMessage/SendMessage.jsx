import { sendMessage } from "@/services/api";
import s from "./SendMessage.module.css"

export const SendMessage = ({ userInfo = null, friend = null, onClose }) => {
  async function sendMessageToFriend(event) {
    event.preventDefault();
    const form = event.target;
    const message = form.elements.message.value;
    const sendMessageDTO ={
      senderId: userInfo.userId,
      receiverId: friend.id,
      content: message,
    }
    try{
      await sendMessage(sendMessageDTO, userInfo.access_token);
      console.log("OK");
      onClose();
    }
    catch(err){
      console.log(err);
    }
  }
  return (
      <form onSubmit={sendMessageToFriend}>
        <div className={s.title}>Message to {friend.username}</div>
        <input className={s.input} placeholder="Your message" name="message" required/>
        <button className={s.button} type="submit">Send message!</button>
      </form>
  );
};