"use client"
import { useContext, useState } from "react";
import { confirmCode } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
export default function ConfirmCode() {

  const {userEmail }= useContext(Context); // global state, retrieve data

  const {isLoading, setLoading} = useContext(Context);
  const [isFailed, setFail] = useState(false);
  const router = useRouter();
  async function onConfirmation(event) {
    event.preventDefault(); 

    const form = event.target;
    const email = userEmail;
    const code = form.elements.code.value;

    const confirmUser = {
      email: email,
      code: code,
    };

    setLoading(true);

    try {
      const data = await confirmCode(confirmUser);
      setFail(false);
      router.push('/auth/login')
    } catch (err) {
        setFail(true);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex_wrapper">
      <div className="wrapper">      
        <form onSubmit= {onConfirmation}>
            <h1>Confirm Code</h1>
            <h4>{userEmail}</h4>
            <div className="input-box">
                <input name = "code" required/>
                <i className='bx bx-message-square-dots' ></i>
            </div>          
            <button type="submit" className="btn">Confirm</button>
            {isFailed && <p className = "error-msg">Invalid code</p>}
            <div className="register-link">
                <p>Wrong email? <a href="/auth/register">Register</a></p>
            </div>
        </form>
    </div>

    </main>
  );
}
