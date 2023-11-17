import Link from "next/link";

import css from './Header.module.css'
import { useContext } from "react";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";



export const Header = () => {

    const path = { home: "/", login: "/auth/login", register: "/auth/register" }
    const { stateIsAuthorized, setAuthorize, isLoading } = useContext(Context);
    const router = useRouter();
    async function logout() {
        const key = "userInfo"
        localStorage.setItem(key, null);
        setAuthorize(false);
        router.push(path.home);
    }
    return (
        <div className="container">
            <header className={css.header}>
                {!isLoading &&
                    <nav className={css.list}>
                        <li>
                            <Link className={css.link} href={path.home}>Home</Link>
                        </li>
                        <div className={css.auth}>
                            {!stateIsAuthorized && <li>
                                <Link className={css.link} href={path.login}>Login</Link>
                            </li>
                            }
                            {!stateIsAuthorized && <li>
                                <Link className={css.link} href={path.register}>Register</Link>
                            </li>
                            }
                            {stateIsAuthorized && <li>
                                <button className={css.link} onClick={logout}>Logout</button>
                            </li>}
                        </div>
                    </nav>
                }
            </header>
        </div>
    );
} 