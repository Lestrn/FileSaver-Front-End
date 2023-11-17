"use client"
import { useContext, useState } from "react";
import { login } from "@/services/api";
import { Context } from "@/app/layout";

export default function Login() {
  const [retrievedData, setRetrievedData] = useState(null);
  const {isLoading, setLoading, setAuthorize} = useContext(Context);
  const [isFailed, setFail] = useState(false);
  
  const key = "userInfo"

  async function onLogin(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    const loginUser = {
      email: email,
      password: password,
    };

    setLoading(true);

    try {
      const data = await login(loginUser);
      setRetrievedData(data);
      // 
      localStorage.setItem(key, JSON.stringify(data));
      // 
      setAuthorize(true);
      setFail(false);
    } catch (err) {
        setFail(true);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex_wrapper" >
      <div className="wrapper">
        <form onSubmit={onLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input name="email" type="email" placeholder="Email" required />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="input-box">
            <input name="password" type="password" placeholder="Password" required />
            <i className="bx bx-lock-alt"></i>
          </div>
          <div className="forgot">
            <a href="/auth/account-recovery">Forgot password?</a>
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          {isFailed && <p className = "error-msg">Invalid login or password</p>}
          <div className="register-link">
            <p>
              Don't have an account? <a href="/auth/register">Register</a>
            </p>
          </div>
        </form>
      </div>


    </main>
  );
}
