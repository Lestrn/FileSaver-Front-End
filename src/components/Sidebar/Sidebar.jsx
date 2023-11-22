// Sidebar.js
import { Context } from '@/app/layout';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import css from './Sidebar.module.css'
import { getAvatarImage } from '@/services/api';
const path = { files: "/user/files", friends: "/user/friends", messages: "/user/messages", settings: "/user/settings" }

function Sidebar() {
  const { sidebarVisible, setSidebarVisible } = useContext(Context);
  const [userInfo, setUserInfo] = useState(null);
  const [stateBlobImage, setBlobImage] = useState(null);
  const key = "userInfo";

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key));
    setUserInfo(data);
    getUserAvatarImage(data.userId, data.access_token);
  }, [key]) 


  async function getUserAvatarImage(userId, token) {
    try {
      const response = await getAvatarImage(userId, token);
      console.log(  "RESPONSE",response);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
     
        setBlobImage(blobUrl);
      } else {
        console.error('Error downloading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
    finally{
    }
  }


  return (
    <div className=''>
      <div className={`${css.sidebar} ${sidebarVisible ? css.open : ''}`}>
        <ul className=''>
          <li className={css.userInfo}> Logged in as {userInfo != null && userInfo.username}</li>
          <li> {stateBlobImage && <img className={css.imageAvatar} src={stateBlobImage} alt="Blob Image" />}</li>
          <li><Link onClick={() => { setSidebarVisible(false) }} className={css.link} href={path.files}>My files</Link> </li>
          <li><Link onClick={() => { setSidebarVisible(false) }} className={css.link} href={path.friends}>Friends</Link></li>
          <li><Link onClick={() => { setSidebarVisible(false) }} className={css.link} href={path.messages}>Messages</Link></li>
          <li><Link onClick={() => { setSidebarVisible(false) }} className={css.link} href={path.settings}>Settings</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
