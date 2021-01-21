import React from 'react';
import styles from '../styles/DialogBox.module.css';

const DialogBox = ({show,question,clickOk,clickCancel}) => {
    return show?(
        <div className={styles.overlay}>
        <div className={styles.dialogBox}>
            <p className={styles.question}>{question}</p>
            <div className={styles.buttonRow}>
                <div className={styles.okBtn} onClick={()=>{clickOk()}}>Ok</div>
                <div className={styles.cancelBtn} onClick={()=>{clickCancel()}}>Cancel</div>
            </div>
        </div>
        </div>
    ):null;
}

export default DialogBox;