import { sendMessage } from "@/services/api";
import s from "./Modal.module.css"

export const Modal = ({ onClose, children }) => {

  return (
    <div className={s.modal}>
      <button className={s.button} type="button" onClick={onClose}>Close</button>
      <div>
        {children}
      </div>
    </div>
  );
};