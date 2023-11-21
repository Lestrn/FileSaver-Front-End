"use client"

import { Context } from "@/app/layout";
import { register } from "@/services/api";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react"


export default function Register() {

 
  
 
   const [retrievedData, setRetrievedData] = useState(null);
   const [stateFailMessage, setFailMessage] = useState("");
   const [isFailed, setFail] = useState(false);

   const router = useRouter();

   const { userEmail, setUserEmail } = useContext(Context);
   const { isLoading, setLoading } = useContext(Context)

   async function onRegister(event) {

      event.preventDefault();
      const form = event.target;
      const username = form.elements.username.value;
      const email = form.elements.email.value;
      const password = form.elements.password.value;

      const newUser = {
         username: username,
         email: email,
         password: password
      }

      setLoading(true);
      try {
         const data = await register(newUser);
         setUserEmail(data.Email);
         router.push('/auth/confirm-code');
         setFail(false);
      }
      catch (err) {
         setFail(true);
         setFailMessage(err.response.data.message);
      }
      finally {
         setLoading(false);
      }

   }
   return (
      <main className="flex_wrapper">
         <div className="wrapper">
            <form onSubmit={onRegister}>
               <h1> Register</h1>
               <div className="input-box">
                  <input name="email" type="email" placeholder="Email" required />
                  <i className='bx bx-envelope' ></i>
               </div>
               <div className="input-box">
                  <input name="password" type="password" placeholder="Password" required />
                  <i className='bx bx-lock-alt' ></i>
               </div>
               <div className="input-box">
                  <input name="username" placeholder="Username" required />
                  <i className='bx bxs-user' ></i>
               </div>
               <button type="submit" className="btn">Register</button>
               {isFailed && <p className="error-msg">{stateFailMessage}</p>}
               <div className="login-link">
                  <p>
                     Already have an account? <a href="/auth/login">Login</a>
                  </p>
               </div>
            </form>
         </div>

         {isLoading && <p>Loading...</p>}
      </main>
   )

} 