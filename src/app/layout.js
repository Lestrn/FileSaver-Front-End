"use client"

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })


import { createContext, useState } from 'react';
import { Header } from '../components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import { Loader } from '@/components/Loader';

export const Context = createContext(null);



export default function RootLayout({ children }) {

  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle the sidebar visibility
  };

  return (
    <html lang="en">
         
      <Context.Provider value={{ userEmail, setUserEmail, isLoading, setLoading, sidebarVisible, toggleSidebar }}>
        <body className={inter.className} >
        
          <Header />
          <div className='false_header'></div>
          <div className ="block_button">
          <button className={`toggle-button ${sidebarVisible ? 'button-open' : ''}`} onClick={toggleSidebar}><i className="gg-sidebar"></i></button> {/* Button to toggle the sidebar */}
          </div>
          <div className=" ">
            <Sidebar />
            {children}
            {isLoading && <div className="loading-msg"><Loader/></div>}
          </div>
          <div id="modal"></div>
        </body>
      </Context.Provider>
    </html>
  )
}
