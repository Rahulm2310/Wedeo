import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../styles/Alert.module.css';
import { removeAlert } from '../redux/alert/actions';

const Alert = ({ alerts,removeAlert }) =>{
    const removeAlertHandler = (id)=>{
        removeAlert(id);
    }
   return alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
        <div key={alert.id} className={`${styles.alert} ${alert.type=="success"?styles.alertSuccess:alert.type=="info"?styles.alertInfo:alert.type=="warning"?styles.alertWarning:styles.alertDanger}  ${styles.alertWhite} ${styles.rounded}`}>
            <button type="button" className={styles.close} data-dismiss="alert" aria-hidden="true" onClick={()=>{removeAlertHandler(alert.id)}}>×</button>
            <div className={`${styles.alertWhiteIcon} ${styles.roundedIcon} ${alert.type=="success"?styles.alertSuccessIcon:alert.type=="info"?styles.alertInfoIcon:alert.type=="warning"?styles.alertWarningIcon:styles.alertDangerIcon}`}><i className={`${styles.alertWhiteIconI} ${alert.type=="success"?`fa fa-check`:alert.type=="info"?'fa fa-info-circle':alert.type=="warning"?'fa fa-warning':'fa fa-times-circle'}`}></i></div>
            <strong>{alert.type=="success"?'Success!':alert.type=="info"?'Info!':alert.type=="warning"?'Warning!':'Error!'}</strong> {alert.msg}
        </div>
    ))
};

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps,{removeAlert})(Alert);
