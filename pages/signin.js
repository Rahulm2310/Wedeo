import React, {useState,useEffect} from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';
import BaseLayout from '../components/BaseLayout';
import styles from '../styles/signin.module.css';
import {signUpUser,signInUser,signInWithGoogle,signInWithFacebook} from '../redux/auth/actions';
import AuthContainer from '../components/AuthContainer';
import Footer from '../components/Footer';

const SignIn = ({signUpUser,signInUser,signInWithGoogle,signInWithFacebook,auth}) => {
const {isAuthenticated}=auth;
const [activeIndex,setActiveIndex]=useState(1);
const [signUpData,setSignUpData] = useState({name:'',email:'',password:''});
const [signInData,setSignInData] = useState({email:'',password:''});

const router = useRouter();
useEffect(()=>{
	if(isAuthenticated){
		router.push('/dashboard');
	}
},[isAuthenticated]);
	
const onClickSignUp = ()=>{
    setActiveIndex(0);
}
const onClickSignIn = ()=>{
    setActiveIndex(1);
}

const onSignUpHandler = async(e)=>{
	e.preventDefault();
	signUpUser(signUpData.name,signUpData.email,signUpData.password);
}

const onSignInHandler = async(e)=>{
	e.preventDefault();
	signInUser(signInData.email,signInData.password);
}

const googleSignInHandler = (e)=>{
	e.preventDefault();
	signInWithGoogle();
}

const facebookSignInHandler = (e)=>{
	e.preventDefault();
	signInWithFacebook();
}

const onChangeSignUpData = (e)=>{
	setSignUpData({...signUpData,[e.target.name]:e.target.value});
}

const onChangeSignInData = (e)=>{
	setSignInData({...signInData,[e.target.name]:e.target.value});
}

    return (
		<BaseLayout>
		<AuthContainer>
        <div className={styles.body}>
			<nav className={`navbar ${styles.navbar} navbar-default`}><a className={`${styles.navbarBrand} navbar-brand`} href="/">Wedeo</a></nav>
            <div className={styles.desktopContainer} id="container">
	<div className={activeIndex==0?`${styles.formContainer} ${styles.signUpContainer}  ${styles.rightPanelActiveSignUpContainer}`:`${styles.formContainer} ${styles.signUpContainer}`}>
		<form action="#" className={styles.form} onSubmit={onSignUpHandler}>
			<h1 className={styles.h1}>Create Account</h1>
			<div className={styles.socialContainer}>
				<a href="#" className="social" className={`${styles.socialFacebook} ${styles.socialContainerA}`} onClick={facebookSignInHandler}><i className={`fa fa-facebook-f`}></i></a>
				<a href="#" className="social" className={`${styles.socialGoogle} ${styles.socialContainerA}`} onClick={googleSignInHandler}><i className={`fa fa-google-plus`}></i></a>
			</div>
			<span className={styles.span}>or use your email for registration</span>
			<input name="name" value={signUpData.name} className={styles.input} type="text" placeholder="Name" required onChange={onChangeSignUpData}/>
			<input name="email" value={signUpData.email} className={styles.input} type="email" placeholder="Email" required onChange={onChangeSignUpData}/>
			<input name="password" value={signUpData.password} className={styles.input} type="password" placeholder="Password" required onChange={onChangeSignUpData}/>
			<button className={styles.button} type="submit">Sign Up</button>
		</form>
	</div>
	<div className={activeIndex==0?`${styles.formContainer} ${styles.signInContainer} ${styles.rightPanelActiveSignInContainer}`:`${styles.formContainer} ${styles.signInContainer} `}>
		<form action="#" className={styles.form} onSubmit={onSignInHandler}>
			<h1 className={styles.h1}>Sign in</h1>
			<div className={styles.socialContainer}>
				<a href="#" className={`${styles.socialFacebook} ${styles.socialContainerA}`} onClick={facebookSignInHandler}><i className="fa fa-facebook-f"></i></a>
				<a href="#" className={`${styles.socialGoogle} ${styles.socialContainerA}`} onClick={googleSignInHandler}><i className="fa fa-google-plus"></i></a>
			</div>
			<span className={styles.span}>or use your account</span>
			<input name="email" value={signInData.email} className={styles.input} type="email" placeholder="Email" onChange={onChangeSignInData}/>
			<input name="password" value={signInData.password} className={styles.input} type="password" placeholder="Password" onChange={onChangeSignInData}/>
			<a href="#" className={styles.a}>Forgot your password?</a>
			<button className={styles.button}>Sign In</button>
		</form>
	</div>
	<div className={activeIndex==0? `${styles.overlayContainer} ${styles.rightPanelActiveOverlayContainer}`:`${styles.overlayContainer}`}>
		<div className={activeIndex==0? `${styles.overlay} ${styles.rightPanelActiveOverlay}`:`${styles.overlay}`}>
			<div className={activeIndex==0?`${styles.overlayPanel} ${styles.overlayLeft} ${styles.rightPanelActiveOverlayLeft}`:`${styles.overlayPanel} ${styles.overlayLeft}`}>
				<h1 className={styles.h1}>Welcome Back!</h1>
				<p className={styles.p}>To keep connected with us please login with your personal info</p>
				<button className={` ${styles.button} ${styles.ghost}`} id="signIn"  onClick={onClickSignIn}>Sign In</button>
			</div>
			<div className={activeIndex==0?`${styles.overlayPanel} ${styles.overlayRight} ${styles.rightPanelActiveOverlayRight}`:`${styles.overlayPanel} ${styles.overlayRight}`}>
				<h1 className={styles.h1}>Hello, Friend!</h1>
				<p className={styles.p}>Enter your personal details and start journey with us</p>
				<button className={`${styles.button} ${styles.ghost}`} id="signUp" onClick={onClickSignUp}>Sign Up</button>
			</div>
		</div>
	</div>
</div>
<div className={styles.mobileContainer}>
<div className={styles.formContainer}>
	{activeIndex==1?
		<form action="#" className={styles.form} onSubmit={onSignInHandler}>
			<h1 className={styles.h1}>Sign in</h1>
			<div className={styles.socialContainer}>
				<a href="#" className={`${styles.socialFacebook} ${styles.socialContainerA}`} onClick={facebookSignInHandler}><i className="fa fa-facebook-f"></i></a>
				<a href="#" className={`${styles.socialGoogle} ${styles.socialContainerA}`} onClick={googleSignInHandler}><i className="fa fa-google-plus"></i></a>
			</div>
			<span className={styles.span}>or use your account</span>
			<input name="email" value={signInData.email} className={styles.input} type="email" placeholder="Email" onChange={onChangeSignInData}/>
			<input name="password" value={signInData.password} className={styles.input} type="password" placeholder="Password" onChange={onChangeSignInData}/>
			<a href="#" className={styles.a}>Forgot your password?</a>
			<button className={styles.button}>Sign In</button>
			<div>
				<p className={styles.already}>Don't have an account?</p>
				<button type="button" className={`${styles.button} ${styles.ghost}`} id="signUp" onClick={onClickSignUp}>Sign Up</button>
			</div>
		</form>:
		<form action="#" className={styles.form} onSubmit={onSignUpHandler}>
			<h1 className={styles.h1}>Create Account</h1>
			<div className={styles.socialContainer}>
				<a href="#" className="social" className={`${styles.socialFacebook} ${styles.socialContainerA}`} onClick={facebookSignInHandler}><i className={`fa fa-facebook-f`}></i></a>
				<a href="#" className="social" className={`${styles.socialGoogle} ${styles.socialContainerA}`} onClick={googleSignInHandler}><i className={`fa fa-google-plus`}></i></a>
			</div>
			<span className={styles.span}>or use your email for registration</span>
			<input name="name" value={signUpData.name} className={styles.input} type="text" placeholder="Name" required onChange={onChangeSignUpData}/>
			<input name="email" value={signUpData.email} className={styles.input} type="email" placeholder="Email" required onChange={onChangeSignUpData}/>
			<input name="password" value={signUpData.password} className={styles.input} type="password" placeholder="Password" required onChange={onChangeSignUpData}/>
			<button className={styles.button} type="submit">Sign Up</button>
			<div>
				<p className={styles.already}>Already have an account?</p>
				<button type="button" className={`${styles.button} ${styles.ghost}`} id="signIn" onClick={onClickSignIn}>Sign In</button>
			</div>
		</form>
}
	</div>
		</div>
        </div>
		
		{/* <Footer/> */}
		</AuthContainer>
		</BaseLayout>
    )
}

const mapStateToProps = ({auth})=>({
	auth:auth
});

// const mapDispatchToProps = (dispatch)=>({
// 	signUpUserAction:async (name,email,password)=>dispatch(await signUpUser(name,email,password)),
// 	signInUserAction:async (email,password)=>dispatch(await signInUser(email,password)),
// 	signInWithGoogleAction:async ()=>dispatch(signInWithGoogle()),
// 	signInWithFacebookAction:async ()=>dispatch(signInWithFacebook()),
// });

export default connect(mapStateToProps,{signInUser,signUpUser,signInWithGoogle,signInWithFacebook})(SignIn);