"use client"
import { useContext, useEffect, useState } from "react";
import { deleteFileById, downloadFile, getAcceptedFriendRequests, getFileInfo, getFilesThatUserShares, getOwnFiles, getReceivedFiles, getUserInfo, stopSharingFile, uploadFile } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
import ShareFile from "@/components/ShareFile/ShareFile";
import { Portal } from "@/components/Portal/Portal";
import { Modal } from "@/components/Modal/Modal";
export default function FileService() {

  const key = "userInfo"
  const { isLoading, setLoading } = useContext(Context);
  const [isFailed, setFail] = useState(false);
  const [stateUserOwnFiles, setUserOwnFiles] = useState([]);
  const [stateUserReceivedFiles, setUserReceivedFiles] = useState([]);
  const [stateUserSharedFiles, setUserSharedFiles] = useState([]);
  const [statefileUserInfo, setFileUserInfo] = useState([]);
  const [onShow, setOnShow] = useState(false);
  const [stateFileId, setFileId] = useState(null);
  const [userInfo, setInfo] = useState(null);



  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      setInfo(data)
      getUserOwnFiles(data.userId, data.access_token);
    }
  }, [key]);

  useEffect(() => {
    if(!userInfo)  return;
    getUserReceivedFiles(userInfo.userId, userInfo.access_token);
  }, [userInfo])

  useEffect(() => {
    if (!userInfo) return;
    initializeAcceptedFriendsInfo(userInfo.userId, userInfo.access_token)
  }, [userInfo]);
  const [stateAcceptedFriendsInfo, setAcceptedFriendUserInfo] = useState([]);


  async function initializeAcceptedFriendsInfo(userId, token) {
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
  }


  const onClose = () => setOnShow(false)
  const router = useRouter();


  async function getUserOwnFiles(userId, token) {
    try {
      const files = await getOwnFiles(userId, token);
      setUserOwnFiles(files.value);
    }
    catch (err) {
      console.log(err.message);
    }

  }

  async function getUserReceivedFiles(userId, token) {
    try {
      const files = await getReceivedFiles(userId, token);
      setUserReceivedFiles(files.value);
    }
    catch (err) {
      console.log(err.message);
    }
  }

  async function getUserSharedFiles(userId, token) {
    let userSharedFiles = [];
    try{
       userSharedFiles = (await getFilesThatUserShares(userId, token)).value;
    }
    catch(err){
      console.log(err);
    }
    let userFullInfo = [];
    let fileFullInfo = [];
    try{
      for (let i = 0; i < userSharedFiles.length; i++) {
        userFullInfo.push((await getUserInfo(userSharedFiles[i].sharedWithUserId, userInfo.access_token)).value);
        fileFullInfo.push((await getFileInfo(userSharedFiles[i].fileId, userInfo.userId, userInfo.access_token)).value);
      }
    }
    catch(err){
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
  }

  async function onDownloadFile(fileId, fileName) {
    try {
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
  }

  async function onDeleteFile(fileId) {
    try {
      await deleteFileById(fileId, userInfo.userId, userInfo.access_token);
      getUserOwnFiles(userInfo.userId, userInfo.access_token);
    }
    catch (err) {
      console.log(err)
    }
  }

  async function uploadUserFile(e) {
    e.preventDefault();

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
  }

  async function StopFileSharing(fileId, sharedWithId){
    try{
      await stopSharingFile(fileId, userInfo.userId, sharedWithId, userInfo.access_token);
      await getUserSharedFiles(userInfo.userId, userInfo.access_token);
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <main className="">
      <h3>Own Files</h3>
      <ul>
        {stateUserOwnFiles.length > 0 && stateUserOwnFiles.map(el => (
          <li key={el.id}>
            <p style={{ color: "white" }}>{el.fileName}</p>
            <button onClick={() => onDownloadFile(el.id, el.fileName)} type="button">downLoad file</button>
            <button onClick={() => onDeleteFile(el.id)} type="button">delete file</button>
            <button onClick={() => {
              setFileId(el.id);
              setOnShow(true)
            }} type="button">Share file</button>
          </li>
        ))}
      </ul>
      <h3>Received Files</h3>
      <ul>
        {stateUserReceivedFiles.length > 0 && stateUserReceivedFiles.map(el => (
          <li key={el.id}>
            <p style={{ color: "white" }}>{el.fileName}</p>
            <button onClick={() => onDownloadFile(el.id, el.fileName)} type="button">downLoad file</button>
          </li>
        ))}
      </ul>
      <form onSubmit={uploadUserFile}>
        <input
          style={{ color: "white" }}
          name="file"
          type="file"
          onChange={(event) => console.log(event.target.value)} />
        <button type="submit">Upload</button>
      </form>
      <button onClick={() => {getUserSharedFiles(userInfo.userId, userInfo.access_token)}}>Show files that i am sharing</button>
      <h3>Received Files</h3>
      <ul>
        {statefileUserInfo.length > 0 && statefileUserInfo.map((el, index) => (
          <li key={index}>
            <p style={{ color: "white" }}>Shared with {el.username}</p>
            <p style={{ color: "white" }}> File name {el.fileName}</p>
            <button onClick={() => StopFileSharing(el.fileId, el.userSharedWithId)} type="button">Stop sharing</button>
          </li>
        ))}
      </ul>
      {onShow && <Portal onClose={onClose} ><Modal onClose={onClose} ><ShareFile userInfo={userInfo} shareFileId = {stateFileId} onClose={onClose} acceptedFriendsInfo={stateAcceptedFriendsInfo} /> </Modal> </Portal>}
    </main>
  );
}




