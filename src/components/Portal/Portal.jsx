import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import s from "./Portal.module.css"

export const Portal = ({ onClose, children }) => {



    useEffect(() => {
        const onClickEscape = (e) => {
            if (e.code === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', onClickEscape);
        return () => {
            document.removeEventListener('keydown', onClickEscape);
        };
    }, [onClose]);

    const handleBackdrop = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (

        createPortal(
            <div className={s.overlay} onClick={handleBackdrop}>
                {children}
            </div>
            ,
            document.getElementById('modal')
        ))

};