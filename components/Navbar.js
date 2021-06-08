import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/auth/actions';
import { toggleTheme } from '../redux/theme/actions';
import styles from '../styles/Navbar.module.css';

const Navbar = ({profile,logoutUser,toggleTheme,isDarkMode})=> {
    const logoutHandler = ()=>{
        logoutUser();
    }

        /* Set the width of the side navigation to 250px */
    function openNav() {
      document.getElementById("mySideNav").style.width = "300px";
    }

    /* Set the width of the side navigation to 0 */
    function closeNav() {
      document.getElementById("mySideNav").style.width = "0";
    }

    const toggleThemeHandler = ()=>{
      toggleTheme();
    }

    return (
        <nav className={`navbar ${styles.navbar} ${isDarkMode?styles.navbarDark:""} navbar-default`}>
      <div class="container-fluid">
        <div className={`navbar-header`}>
          <a className={`${styles.navbarBrand} navbar-brand`} href="#">Wedeo</a>
        </div>
        <div className={`${styles.navRight} collapse`} id="navbar">
        <div className={styles.user}><Link href="/profile"><a><i className="fa fa-user-circle" aria-hidden="true"></i> <span>{profile && profile.name}</span></a></Link></div>
        <div className={styles.user} onClick={openNav}><i class="fa fa-bars" aria-hidden="true"></i></div>
        <div className={styles.sideNav}  id="mySideNav">
        <div className={styles.closeBtn} onClick={closeNav}>&times;</div>
        <Link href="/dashboard">
        <div className={styles.menuItem}>
            <p>Home</p>
          </div>
          </Link>
          <Link href="/profile">
          <div className={styles.menuItem}>
            <p>My Profile</p>
          </div>
          </Link>
        <div className={styles.menuItem}>
          <p>Dark Mode</p>
          <div className={styles.themeButton} >
            <input type="checkbox" checked={isDarkMode} className={styles.toggleModeCb} />
            <div className={styles.modeWrapper}>  
              <label className={styles.toggleMode} onClick={toggleThemeHandler}>
                <span class="sr-only">Toggle</span>
                <span className={styles.toggleBorder}>
                  <span className={styles.toggleIndicator}></span>
                </span>
              </label>
            </div>
            </div>
            </div>
            
        <button className={styles.logOutBtn} onClick={logoutHandler}>Log Out</button>
        </div>
        
        </div>
      </div>
    </nav>
    )
}

const mapStateToProps = ({profile,theme})=>({
    profile:profile.data,
    isDarkMode:theme.isDarkMode
})

export default connect(mapStateToProps,{logoutUser,toggleTheme})(Navbar);