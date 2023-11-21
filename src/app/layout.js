"use client"

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })


import { createContext, useEffect, useState } from 'react';
import { Header } from '../components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Loader } from '@/components/Loader';
import { getOwnFiles } from '@/services/api';
import { useRouter } from 'next/navigation';

export const Context = createContext(null);



export default function RootLayout({ children }) {

  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const router = useRouter();

  const [stateIsAuthorized, setAuthorize] = useState(true);
  const key = "userInfo"
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key));
    if (data == null) {
      setAuthorize(false);
    }
    else {

      CheckToken(data.userId, data.access_token);
    }
  }, [key]);


  async function CheckToken(userId, access_token){
    try {
      await getOwnFiles(userId, access_token);
      setAuthorize(true);
    }
    catch (err) {
      console.log(err)
      setAuthorize(false);
      router.push('/');
    }
  }

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle the sidebar visibility
  };

  return (
    <html lang="en">

      <Context.Provider value={{ userEmail, setUserEmail, isLoading, setLoading, sidebarVisible, toggleSidebar, stateIsAuthorized, setAuthorize }}>
        <body className={inter.className} >

          <Header />
          <div className='false_header'></div>
          {stateIsAuthorized && <div className="block_button">
            <button className={`toggle-button ${sidebarVisible ? 'button-open' : ''}`} onClick={toggleSidebar}><i className="gg-sidebar"></i></button> {/* Button to toggle the sidebar */}
          </div>}
          <div className=" ">
            {stateIsAuthorized && <Sidebar/>}
            {children}
            {isLoading && <div className="loading-msg"><Loader /></div>}
          </div>
          <div id="modal"></div>
        </body>
      </Context.Provider>
    </html>
  )
}
