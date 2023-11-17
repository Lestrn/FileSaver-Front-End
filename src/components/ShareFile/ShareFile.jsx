import s from './ShareFile.module.css'
import { shareFile } from "@/services/api";

function ShareFile({userInfo, shareFileId, onClose, acceptedFriendsInfo =[], fileName}) {

  async function shareFileWithFriend(friendId) {
    const shareFileDTO = {
      ownerId: userInfo.userId,
      sharedWithId: friendId,
      fileId: shareFileId
    }
    try {
      await shareFile(shareFileDTO, userInfo.access_token);
      onClose();
    }
    catch (err) {
      console.log(err);
    }
  }
  return (
    <div className='share-file-modal'>
      <div className={s.title}>Share {fileName} with</div>
      <ul className={s.list}>
        {acceptedFriendsInfo.length > 0 && acceptedFriendsInfo.map(friendInfo => (
          <li className={s.item} key={friendInfo.id}>
            <p className={s.friend_username}>{friendInfo.username}</p>
            <button className={s.button_appearing} type="button" onClick={() => { shareFileWithFriend(friendInfo.id) }}>Share file!</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShareFile;
