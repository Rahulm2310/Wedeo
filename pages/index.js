import Head from 'next/head'
import {useRouter} from 'next/router';
import HomeLayout from '../components/HomeLayout'
import styles from '../styles/Home.module.css'
import Image from 'next/image';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from '../components/Button';

const Home = ({isAuthenticated})=> {
  const router=useRouter();
  useEffect(()=>{
    if(isAuthenticated){
      router.push('/dashboard');
    }
  },[isAuthenticated]);

  const onTryNowBtnClick = ()=>{
    router.push('/signin');
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      </Head>
      <HomeLayout>
      <nav className={`navbar ${styles.navbar} navbar-default`}>
      <div className="container-fluid">
        <div className={`navbar-header`}>
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className={`${styles.navbarBrand} navbar-brand`} href="#">Wedeo</a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
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
      <div className={styles.bannerTitle}>
        <h1 className={styles.bannerHead}>Enjoy free endless video calls</h1>
        <p className={styles.bannerLead}>Wedeo is a high quality video calling app. It's free and works on the web.</p>
        <br/>
        <Button title="Try Now" onClickHandler={onTryNowBtnClick}/>
      </div>
      <div className={styles.bannerImg}>
        <img src='/static/images/video-call.svg' alt="banner-image" />
      </div>
    </div>
    <div className={`${styles.featureItem} row`} >
        <div className={styles.featureImg}>
          <img className={styles.featureImgImg} src="/static/images/video-call2.gif" alt="world-connected" />
        </div>
        <div className={styles.featureText}>Keeping the world connected</div>
      </div>
    <div className="content">
    <div className={styles.headline}>What can you do with Wedeo?</div>
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
    <div className={styles.reminder}>
      <img className={styles.reminderImg} src="/static/images/happy-customer.gif" alt="We love our users"/>
      <p>We are sure you will love us</p>
      <Button title="Try Wedeo now" onClickHandler={onTryNowBtnClick}/>
    </div>
    <div className={styles.footer}>
    <a className={`${styles.navbarBrand}`} href="#">Wedeo</a>
    <p className={styles.footerText}>Copyright© 2021 Wedeo. All rights reserved.</p>
    </div>
    </HomeLayout>
    </>
  )
}

const mapStateToProps = ({auth})=>({
  isAuthenticated:auth.isAuthenticated
});

export default connect(mapStateToProps,null)(Home);