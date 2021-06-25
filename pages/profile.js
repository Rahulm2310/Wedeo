import React,{useEffect, useState} from 'react';
import { connect } from 'react-redux';
import AuthContainer from '../components/AuthContainer';
import BaseLayout from '../components/BaseLayout';
import Navbar from '../components/Navbar';
import { deleteProfile, getProfile,updateProfile } from '../redux/profile/actions';
import styles from '../styles/Profile.module.css';
import {storage} from '../firebase/firebaseApp';
import Spinner from "../components/Spinner";
import { setAlert } from '../redux/alert/actions';
import DialogBox from '../components/DialogBox';

const Profile = ({user,profile,getProfile,updateProfile,setAlert,isDarkMode,deleteProfile}) => {
    const [edit,setEdit] = useState(false);
    const [name,setName] = useState("");
    const [image,setImage] = useState("");
    const [uploading,setUploading]=useState(false);
    const [showDialogBox,setShowDialogBox]=useState(false);

    useEffect(()=>{
        getProfileData();
    },[]);

    useEffect(()=>{
        if(profile){
            setName(profile.name);
            setImage(profile.image);
        }
    },[profile])

    const getProfileData = async()=>{
        if(user){
            await getProfile(user.uid);
        }
    }

    const uploadHandler = ()=>{
      if(typeof window!=="undefined"){
        const fileInput = document.querySelector("#file-upload");
        fileInput.addEventListener('change',function(){
            onSelectImage(this);
        });
        fileInput.click();
    }
    }

    const onSelectImage = async (input)=>{
        try {
          setUploading(true);
          const file = input.files[0];
          const storageRef = storage.ref();
          const fileRef = storageRef.child(file.name);
          await fileRef.put(file);
          const url = await fileRef.getDownloadURL();
        //   console.log("uploaded :",url);
          setImage(url);
          setUploading(false);
          setAlert('Image uploaded','success');
          } catch (error) {
            console.log(error);
            setAlert("Failed to upload file","danger");
          }
    }

    const onSubmitHandler = async ()=>{
        if(!name){
            setAlert("Name can't be empty");
            return;
        }
        await updateProfile(profile.uid,image?{name,image}:{name});
        setEdit(false);
    }

    const onDeleteHandler = async()=>{
        await deleteProfile(profile.uid);
    }

    return (
        <BaseLayout>
            <AuthContainer>
                { !profile?<Spinner/>:<>
                <Navbar/>
                    <div className={`${styles.profileCard} ${isDarkMode?styles.profileCardDark:""}`}>
                        <div className={styles.editButton} onClick={()=>{setEdit(!edit)}}>
                            {!edit?<i class="fa fa-pencil" aria-hidden="true"></i>:<i class="fa fa-times" aria-hidden="true"></i>}
                        </div>
                        <div className={styles.profilePic}>
                            {uploading ? <Spinner/>:
                            <>
                            <div className={styles.profilePicImage}>
                                {image?<img src={image} alt="profile-image"/>:<i class={`fa fa-user-circle ${styles.userIcon}`} aria-hidden="true"></i>}
                            </div>
                            {edit && <>
                            <input id="file-upload" type="file" accept="image/*" />
                            <i class={`fa fa-camera ${styles.camera}`} aria-hidden="true" onClick={uploadHandler}></i>
                            </>}
                            </>}
                        </div>
                        {edit ? <div className={styles.editUserData}>
                            <input name="name" value={name} onChange={(event)=>{setName(event.target.value)}} className={styles.input} type="text" placeholder="Name" required/>
                            <button disabled={uploading || !name } className={styles.button} type="submit" onClick={onSubmitHandler}>Update</button>
                            <button className={`${styles.button} ${styles.deleteButton}`} type="submit" onClick={()=>{setShowDialogBox(true)}}>Delete Account</button>
                            <DialogBox show={showDialogBox} question={"Are you sure? This operation is irreversible"} clickOk={onDeleteHandler} clickCancel={()=>{setShowDialogBox(false)}}/>
                        </div>:
                        <>
                        <div className={styles.userData}>
                            <div className={styles.username}>
                                {profile.name}
                            </div>
                            <div className={styles.useremail}>
                                {user.email}
                            </div>
                        </div>
                        <div className={styles.meetingData}>
                            <div className={styles.meetingDataBox}>
                                <p className={styles.dataTitle}>Meetings Attended</p>
                                <h3>{profile.attended?profile.attended:0}</h3>
                            </div>
                            <div className={styles.meetingDataBox}>
                                <p className={styles.dataTitle}>Meetings Hosted</p>
                                <h3>{profile.hosted?profile.hosted:0}</h3>
                            </div>
                        </div>
                        </>
                        }
                    </div>
                </>}
            </AuthContainer>
        </BaseLayout>
    )
}

const mapStateToProps = ({auth,profile,theme})=>({
    user:auth.user,
    profile:profile.data,
    isDarkMode:theme.isDarkMode
})

export default connect(mapStateToProps,{getProfile,updateProfile,setAlert,deleteProfile})(Profile);