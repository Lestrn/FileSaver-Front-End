// Sidebar.js
import { Context } from '@/app/layout';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import css from './Sidebar.module.css'
const path = { files: "/user/files", friends: "/user/friends", messages: "/user/messages", settings: "/user/settings" }

function Sidebar() {
  const { sidebarVisible, setSidebarVisible } = useContext(Context);
  const [userInfo, setUserInfo] = useState(null);
  const key = "userInfo";
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key));
    setUserInfo(data);
  }, [key]) 
  return (
    <div className=''>
      <div className={`${css.sidebar} ${sidebarVisible ? css.open : ''}`}>
        <ul className=''>
          <li className={css.userInfo}> Logged in as {userInfo != null && userInfo.username}</li>
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
