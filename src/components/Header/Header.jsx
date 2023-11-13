import Link from "next/link";

import css from './Header.module.css'

const path = { home: "/", login: "/auth/login", register: "/auth/register" }



export const Header = () => (
    <div className="container">
    <header className={css.header }>
        <nav className={css.list}>

            <li>
                <Link className={css.link} href={path.home}>Home</Link>
            </li>
            <div className={css.auth}>
            <li>
                <Link className={css.link} href={path.login}>Login</Link>
            </li>
            <li>
                <Link className={css.link} href={path.register}>Register</Link>
            </li>
            </div>
        </nav>

    </header>
    </div>
);