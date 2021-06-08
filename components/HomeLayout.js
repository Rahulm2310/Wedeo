import React from 'react'
import Meta from './Meta'
import styles from '../styles/HomeLayout.module.css';

const HomeLayout = ({children}) => {
    return (
        <div className={`${styles.homeLayout}`}>
            <Meta/>
            <div>{children}</div>
        </div>
    )
}

export default HomeLayout;