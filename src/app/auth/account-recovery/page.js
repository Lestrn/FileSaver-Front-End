"use client"
import { useContext, useState } from "react";
import { recoverAccount } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
export default function RecoverAccount() {


  const { isLoading, setLoading } = useContext(Context);
  const [isFailed, setFail] = useState(false);

  const { userEmail, setUserEmail } = useContext(Context);

  const router = useRouter();
  async function onRecovery(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.elements.email.value;

    const recoverUser = {
      email: email
    };

    setLoading(true);

    try {
      const data = await recoverAccount(recoverUser);
      setUserEmail(email)
      setFail(false);
      router.push('/auth/confirm-recovery')
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
        <form onSubmit={onRecovery}>
          <h1>Account Recovery</h1>
          <div className="input-box">
            <input name="email" type="email" placeholder="Email" required />
            <i className='bx bx-message-square-dots' ></i>
          </div>
          <button type="submit" className="btn">Confirm</button>
          {isFailed && <p className="error-msg">Invalid email</p>}
          <div className="register-link">
            <p>Don't have an account? <a href="/auth/register">Register</a></p>
          </div>
        </form>
      </div>

    </main>
  );
}


