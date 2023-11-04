"use client"

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })


import { createContext,  useState } from 'react';
import { Header } from '../components/Header/Heder';

export const Context = createContext(null);

export default function RootLayout({ children }) {

  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setLoading] = useState(false)
  return (
      <html lang="en">
        <Context.Provider value={{userEmail, setUserEmail, isLoading, setLoading}}>
        
        <body className={inter.className}>
        <Header/>
          {children}
            
        {isLoading && <p className="loading-msg">Loading...</p>}
        </body>
        
        </Context.Provider>
      </html>
  )
}
