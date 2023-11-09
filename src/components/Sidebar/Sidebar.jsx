// Sidebar.js
import { Context } from '@/app/layout';
import Link from 'next/link';
import React, { useContext } from 'react';
import css from './Sidebar.module.css'
const path = { files: "/user/files", friends: "/user/friends", messages: "/user/messages" }

function Sidebar() {
    const { sidebarVisible, setSidebarVisible } = useContext(Context);

    
  return (
    <div className={`${css.sidebar} ${sidebarVisible ? css.open : ''}`}>
      <ul>
       <li><Link onClick={() => {setSidebarVisible(false)}} className={css.link} href={path.files}>My files</Link> </li>
       <li><Link onClick={() => {setSidebarVisible(false)}} className={css.link} href={path.friends}>Friends</Link></li> 
       <li><Link onClick={() => {setSidebarVisible(false)}} className={css.link} href='#'>Messages</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
