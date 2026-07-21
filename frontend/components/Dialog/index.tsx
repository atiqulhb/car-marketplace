'use client'

import { createPortal } from 'react-dom'
import styles from './styles.module.css'

export function Dialog({ children }) {
    return createPortal(
        <div className={styles.Wrapper}>
            <div className={styles.Children}>{children}</div>
        </div>,
        document.body
    )
}