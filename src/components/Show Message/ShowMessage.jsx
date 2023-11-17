import css from './ShowMessage.module.css'

function ShowMessage({message, title, username}) {
  return (
    <div className={css.show_message_modal}>
        <div className={css.title}>{title}{username} </div>
        <p className={css.message}>{message}</p>
    </div>
  );
}

export default ShowMessage;
