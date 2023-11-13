
import { sendMessage } from "@/services/api";
import s from "./Modal.module.css"

export const Modal = ({ onClose, userInfo = null, friend = null }) => {
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
    catch{
      console.log(err);
    }
  }
  return (
    <div className={s.modal}>
      <button className={s.button} type="button" onClick={onClose}>Close</button>
      <form onSubmit={sendMessageToFriend}>
        <div className={s.title}>Message to {friend.username}</div>
        <input className={s.input} placeholder="Your message" name="message" required/>
        <button className={s.button} type="submit">Send message!</button>
      </form>
    </div>
  );
};