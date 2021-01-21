import Head from 'next/head'
import {useRouter} from 'next/router';
import BaseLayout from '../components/BaseLayout'
import styles from '../styles/Home.module.css'
import Image from 'next/image';
import { useEffect } from 'react';
import { connect } from 'react-redux';

const Home = ({isAuthenticated})=> {
  const router=useRouter();
  useEffect(()=>{
    if(isAuthenticated){
      router.push('/dashboard');
    }
  },[isAuthenticated]);
  return (
    <div className={styles.homeContainer}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      </Head>
      <BaseLayout>
      <nav className={`navbar ${styles.navbar} navbar-default`}>
      <div class="container-fluid">
        <div className={`navbar-header`}>
          <button
            type="button"
            class="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false"
          >
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a className={`${styles.navbarBrand} navbar-brand`} href="#">Wedeo</a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li className={`${styles.navLink} nav-link`} data-toggle="modal" data-target="#joinModal">
              <a href="/signin">Login</a>
            </li>
            <li className={`${styles.navLink} nav-link`} data-toggle="modal" data-target="#createModal">
              <a href="/signin">Sign Up</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
      <div className={styles.header}></div>
      <div className={styles.banner}>
      <div>
        <h1 className={styles.bannerHead}>Let's Connect</h1>
        <p className={styles.bannerLead}>Video. Chat. Fun</p>
      </div>
      <div className={styles.bannerImg}>
        <img src='/static/images/video-call.svg' alt="banner-image" />
      </div>
    </div>
    <div class="content">
      <div className={`${styles.contentItem} row`} >
        <div className={styles.contentImg}>
          <img className={styles.contentImgImg} src="/static/images/world-connected.svg" alt="world-connected" />
        </div>
        <div className={styles.headText}>Keeping the world connected</div>
      </div>
      <div className={styles.contentItem} >
        <div className={styles.headText}>Host your business meetings</div>
        <div className={styles.contentImg}>
          <img className={styles.contentImgImg} src="/static/images/business-meeting.svg" alt="business" />
        </div>
      </div>
      <div className={styles.contentItem} >
        <div className={styles.contentImg}>
          <img className={styles.contentImgImg} src="/static/images/webinar.svg" alt="webinar" />
        </div>
        <div className={styles.headText}>Conduct your events and webinars</div>
      </div>
      <div className={styles.contentItem} >
        <div className={styles.headText}>Hangout with your friends and family</div>

        <div className={styles.contentImg}>
          <img className={styles.contentImgImg} src="/static/images/group-hangout.svg" alt="friends" />
        </div>
      </div>
    </div>
    </BaseLayout>
    </div>
  )
}

const mapStateToProps = ({auth})=>({
  isAuthenticated:auth.isAuthenticated
});

export default connect(mapStateToProps,null)(Home);