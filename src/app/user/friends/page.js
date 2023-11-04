"use client"

import { useEffect, useState } from "react";

export default function Friends() {
    const key = "userInfo"
    
    const [userInfo, setInfo] = useState("");

    useEffect(() => {
        const data =  JSON.parse(localStorage.getItem(key));
       
        setInfo(data)
        console.log(data.userId);
    }, [key]);

    return (
        <main>
            <div style={{color:"white"}}>
                {userInfo.userId}
            </div>

        </main>
    );
}