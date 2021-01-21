import React from 'react'
import { connect } from 'react-redux'
import { logoutUser } from '../redux/auth/actions';
import styles from '../styles/Navbar.module.css';

const Navbar = ({user,logoutUser})=> {
    const logoutHandler = ()=>{
        logoutUser();
    }
    return (
        <nav className={`navbar ${styles.navbar} navbar-default`}>
      <div class="container-fluid">
        <div className={`navbar-header`}>
          {/* <button
            type="button"
            class="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button> */}
          <a className={`${styles.navbarBrand} navbar-brand`} href="#">Wedeo</a>
        </div>
        <div className={`${styles.navRight} collapse`} id="navbar">
        <div className={styles.user}><i className="fa fa-user-circle" aria-hidden="true"></i> <span>{user && user.name}</span></div>
        <button className={styles.logOutBtn} onClick={logoutHandler}>Log Out</button>
        </div>
      </div>
    </nav>
    )
}

const mapStateToProps = ({auth})=>({
    user:auth.user
})

export default connect(mapStateToProps,{logoutUser})(Navbar);