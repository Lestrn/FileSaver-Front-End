"use client"
import { useContext, useEffect, useState } from "react";
import { deleteFileById, downloadFile, getAcceptedFriendRequests, getFileInfo, getFilesThatUserShares, getOwnFiles, getReceivedFiles, getUserInfo, stopSharingFile, uploadFile } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
import ShareFile from "@/components/ShareFile/ShareFile";
import { Portal } from "@/components/Portal/Portal";
import { Modal } from "@/components/Modal/Modal";
import css from "./page.module.css"
export default function FileService() {

  const key = "userInfo"
  const { isLoading, setLoading } = useContext(Context);
  const [isFailed, setFail] = useState(false);
  const [stateUserOwnFiles, setUserOwnFiles] = useState([]);
  const [stateUserReceivedFiles, setUserReceivedFiles] = useState([]);
  const [stateUserSharedFiles, setUserSharedFiles] = useState([]);
  const [statefileUserInfo, setFileUserInfo] = useState([]);
  const [onShow, setOnShow] = useState(false);
  const [stateFile, setFile] = useState(null);
  const [userInfo, setInfo] = useState(null);



  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      setInfo(data)
      getUserOwnFiles(data.userId, data.access_token);
    }
  }, [key]);

  useEffect(() => {
    if (!userInfo) return;
    getUserReceivedFiles(userInfo.userId, userInfo.access_token);
  }, [userInfo])

  useEffect(() => {
    if (!userInfo) return;
    initializeAcceptedFriendsInfo(userInfo.userId, userInfo.access_token)
  }, [userInfo]);
  const [stateAcceptedFriendsInfo, setAcceptedFriendUserInfo] = useState([]);


  async function initializeAcceptedFriendsInfo(userId, token) {
    const loadingIsAlreadyActive = isLoading;
    !loadingIsAlreadyActive && setLoading(true);
    let acceptedFriendIds = [];
    try {
      acceptedFriendIds = (await getAcceptedFriendRequests(userId, token)).value;
    }
    catch (err) {
      console.log(err)
    }
    console.log("friend ids", acceptedFriendIds);
    let acceptedFriendInfos = [];
    for (let i = 0; i < acceptedFriendIds.length; i++) {
      const fullInfo = await getUserInfo(acceptedFriendIds[i].friendId, token);
      acceptedFriendInfos.push(fullInfo.value);
    }
    console.log("Friend infos", acceptedFriendInfos);
    setAcceptedFriendUserInfo(acceptedFriendInfos);
    !loadingIsAlreadyActive && setLoading(false);
  }


  const onClose = () => setOnShow(false)
  const router = useRouter();


  async function getUserOwnFiles(userId, token) {
    const loadingIsAlreadyActive = isLoading;
    try {
      !loadingIsAlreadyActive && setLoading(true);
      const files = await getOwnFiles(userId, token);
      setUserOwnFiles(files.value);
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      !loadingIsAlreadyActive && setLoading(false);
    }

  }

  async function getUserReceivedFiles(userId, token) {
    const loadingIsAlreadyActive = isLoading;
    try {
      !loadingIsAlreadyActive && setLoading(true);
      const files = await getReceivedFiles(userId, token);
      setUserReceivedFiles(files.value);
    }
    catch (err) {
      console.log(err.message);
    }
    finally{
      !loadingIsAlreadyActive && setLoading(false);
    }
  }

  async function getUserSharedFiles(userId, token) {
    let userSharedFiles = [];
    const loadingIsAlreadyActive = isLoading;
    try {
      !loadingIsAlreadyActive && setLoading(true);
      userSharedFiles = (await getFilesThatUserShares(userId, token)).value;
    }
    catch (err) {
      console.log(err);
    }
    let userFullInfo = [];
    let fileFullInfo = [];
    try {
      for (let i = 0; i < userSharedFiles.length; i++) {
        userFullInfo.push((await getUserInfo(userSharedFiles[i].sharedWithUserId, userInfo.access_token)).value);
        fileFullInfo.push((await getFileInfo(userSharedFiles[i].fileId, userInfo.userId, userInfo.access_token)).value);
      }
    }
    catch (err) {
      console.log(err);
    }
    let userFileInfo = [];
    for (let i = 0; i < userFullInfo.length; i++) {
      userFileInfo.push({
        fileId: fileFullInfo[i].id,
        userSharedWithId: userFullInfo[i].id,
        username: userFullInfo[i].username,
        fileName: fileFullInfo[i].fileName
      });
    }
    setFileUserInfo(userFileInfo);
    !loadingIsAlreadyActive && setLoading(false);
  }

  async function onDownloadFile(fileId, fileName) {
    const loadingIsAlreadyActive = isLoading;
    try {
      !loadingIsAlreadyActive && setLoading(true);
      const response = await downloadFile(fileId, userInfo.userId, userInfo.access_token);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      } else {
        console.error('Error downloading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
    finally{
      !loadingIsAlreadyActive && setLoading(false);
    }
  }

  async function onDeleteFile(fileId) {
    const loadingIsAlreadyActive = isLoading;
    !loadingIsAlreadyActive && setLoading(true);
    try {
      await deleteFileById(fileId, userInfo.userId, userInfo.access_token);
      getUserOwnFiles(userInfo.userId, userInfo.access_token);
    }
    catch (err) {
      console.log(err)
    }
    finally{
      !loadingIsAlreadyActive && setLoading(false);
    }
  }

  async function uploadUserFile(e) {
    e.preventDefault();
    const loadingIsAlreadyActive = isLoading;
    !loadingIsAlreadyActive && setLoading(true);
    const files = e.target.file.files;

    if (files.length === 0) {
      console.log("No files selected");
      return;
    }

    const body = new FormData();

    body.append("file", files[0]);

    try {
      await uploadFile(userInfo.userId, body, userInfo.access_token);
      await getUserOwnFiles(userInfo.userId, userInfo.access_token);
    } catch (err) {
      console.error(err);
    }
    finally{
      !loadingIsAlreadyActive && setLoading(false);
    }
  }

  async function StopFileSharing(fileId, sharedWithId) {
    try {
      await stopSharingFile(fileId, userInfo.userId, sharedWithId, userInfo.access_token);
      await getUserSharedFiles(userInfo.userId, userInfo.access_token);
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="container">
      <section className={css.section}>
        <table className={css.table}>
          <caption>Own Files</caption>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Action</th>
              <th>Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stateUserOwnFiles.length > 0 &&
              stateUserOwnFiles.map((el) => (
                <tr className={css.row} key={el.id}>
                  <td className={css.text}>{el.fileName}</td>
                  <td>
                    <button className={css.button} onClick={() => onDownloadFile(el.id, el.fileName)} type="button">
                      Download file
                    </button>
                  </td>
                  <td>
                    <button className={css.button} onClick={() => onDeleteFile(el.id)} type="button">
                      Delete file
                    </button>
                  </td>
                  <td>
                    <button
                      className={css.button}
                      onClick={() => {
                        setFile(el);
                        setOnShow(true);
                      }}
                      type="button"
                    >
                      Share file
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <section className={css.section}>
        <table className={css.table}>
          <caption>Received Files</caption>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stateUserReceivedFiles.length > 0 &&
              stateUserReceivedFiles.map((el) => (
                <tr className={css.row} key={el.id}>
                  <td className={css.text}>{el.fileName}</td>
                  <td>
                    <button className={css.button} onClick={() => onDownloadFile(el.id, el.fileName)} type="button">
                      Download file
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
      <section className={css.section}>
        <table className={css.table}>
          <caption>Upload Files</caption>
          <tbody>
            <tr>
              <td>
                <h3 className={css.h3}>Choose a file:</h3>
              </td>
            </tr>
            <tr>
              <td>
                <form className={css.upload_form} onSubmit={uploadUserFile}>
                  <label htmlFor="file" style={{ color: "white" }}>
                    Choose a file:
                  </label>
                  <input name="file" type="file" id="file" onChange={(event) => console.log(event.target.value)} />
                  <button className={css.button} type="submit">
                    Upload
                  </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className={css.section}>
      <button className={css.button} onClick={() => getUserSharedFiles(userInfo.userId, userInfo.access_token)} type="button">
          Show files that I am sharing
        </button>
        <table className={css.table}>
          <caption>Shared Files</caption>
          <thead>
            <tr>
              <th>Shared with</th>
              <th>File name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {statefileUserInfo.length > 0 &&
              statefileUserInfo.map((el, index) => (
                <tr className={css.row} key={index}>
                  <td className={css.text}>{el.username}</td>
                  <td className={css.text}>{el.fileName}</td>
                  <td>
                    <button className={css.button} onClick={() => StopFileSharing(el.fileId, el.userSharedWithId)} type="button">
                      Stop sharing
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
      {onShow && (
        <Portal onClose={onClose}>
          <Modal onClose={onClose}>
            <ShareFile userInfo={userInfo} shareFileId={stateFile.id} onClose={onClose} acceptedFriendsInfo={stateAcceptedFriendsInfo} fileName={stateFile.fileName} />
          </Modal>
        </Portal>
      )}
    </main>
  );
}




