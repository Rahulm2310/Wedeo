import React from 'react';
import styles from '../styles/Button.module.css';

export const Button = ({title, onClickHandler}) => {
    return (
        <button className={styles.button} onClick={onClickHandler}>{title}</button>
    )
}
