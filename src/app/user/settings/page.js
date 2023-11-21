"use client"
import { useContext, useEffect, useState } from "react";
import { changePassword } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
import css from "./page.module.css"
export default function Settings() {
    const { setLoading } = useContext(Context);
    const [isFailed, setFail] = useState(false);
    const [stateFailMessage, setFailMessage] = useState("");
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

    return (
        <main className="container" >
            <section className={css.formSection}>
                <h1 className={css.caption}>Change password</h1>
                <form className={css.form} onSubmit={onPasswordChange}>
                    <input className={css.input} name="password" placeholder="New Password" />
                    <input className={css.input} name="passwordConfirm" placeholder="New Password Confirm" />
                    <button className={css.button} type="submit">Save password</button>
                    {isFailed && <div className={css.error_msg}>{stateFailMessage}</div>}
                    {isSuccess && <div className={css.success_msg}>{stateSuccessMessage}</div>}
                </form>
            </section>
        </main>
    );
}
