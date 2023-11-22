"use client"
import { useContext, useEffect, useState } from "react";
import { changePassword, uploadAvatar } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
import css from "./page.module.css"
export default function Settings() {
    const { setLoading, isLoading } = useContext(Context);
    const [isFailed, setFail] = useState(false);
    const [stateFailMessage, setFailMessage] = useState("");
    const [stateFailMessageAvatar, setFailMessageAvatar] = useState("");
    const [isFailedAvatar, setFailAvatar] = useState(false);
    const [isSuccessAvatar, setSuccessAvatar] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isSuccess, setSuccess] = useState(false);
    const [stateSuccessMessage, setSuccessMessage] = useState("");
    const key = "userInfo";
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(key));
        setUserInfo(data);
    }, [key])

    async function onPasswordChange(event) {
        setLoading(true);
        event.preventDefault();
        const form = event.target;
        const password = form.elements.password.value;
        const passwordConfirm = form.elements.passwordConfirm.value;
        if (password != passwordConfirm) {
            setFailMessage("New password and confirmation of it must be equal");
            setSuccess(false);
            setFail(true);
            setLoading(false);
            return;
        }
        try {
            await changePassword(userInfo.userId, passwordConfirm, userInfo.access_token);
            setFail(false);
            setSuccess(true);
            setSuccessMessage("Password has been successfully changed!");

        }
        catch (err) {
            setFailMessage(err.response.data);
            setSuccess(false);
            setFail(true);
        }
        setLoading(false);
    }

    async function uploadUserAvatar(e) {
        e.preventDefault();
        const loadingIsAlreadyActive = isLoading;
        !loadingIsAlreadyActive && setLoading(true);
        const files = e.target.file.files;
        if (files.length === 0) {
          setFailMessageAvatar("No files selected");
          setFailAvatar(true);
          !loadingIsAlreadyActive && setLoading(false);
          return;
        }
    
        const body = new FormData();
    
        body.append("image", files[0]);
    
        try {
          await uploadAvatar(userInfo.userId, body, userInfo.access_token);
          setFailAvatar(false);
          setSuccessAvatar(true);
        } catch (err) {
            setSuccessAvatar(false);
            setFailAvatar(true);
            setFailMessageAvatar(err.response.data);
        }
        finally{
          !loadingIsAlreadyActive && setLoading(false);
        }
      }

    return (
        <main className="container" >
            <section className={css.formSection}>
                <h1 className={css.caption}>Change password</h1>
                <form className={css.form} onSubmit={onPasswordChange}>
                    <input className={css.input} name="password" placeholder="New Password" required />
                    <input className={css.input} name="passwordConfirm" placeholder="New Password Confirm" required />
                    <button className={css.button} type="submit">Save password</button>
                    {isFailed && <div className={css.error_msg}>{stateFailMessage}</div>}
                    {isSuccess && <div className={css.success_msg}>{stateSuccessMessage}</div>}
                </form>
            </section>
            <section className={css.formSection}>
            <h1 className={css.caption}>Upload avatar</h1>
            <form className={css.upload_form} onSubmit={uploadUserAvatar}>
                  <label htmlFor="file" style={{ color: "white" }}>
                    Choose a file:
                  </label>
                  <input style={{ color: "white" }}  name="file" type="file" id="file" accept=".png" onChange={(event) => console.log(event.target.value)} />
                  <button className={css.button} type="submit">
                    Upload
                  </button>
                  {isFailedAvatar && <div className={css.error_msg}>{stateFailMessageAvatar}</div>}
                  {isSuccessAvatar && <div className={css.success_msg}>Successfully uploaded avatar</div>}
                </form>
            </section>
        </main>
    );
}
