import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import {useRouter} from 'next/router';

const AuthContainer = ({children,isAuthenticated}) => {
    const router = useRouter();
    useEffect(()=>{
        if(!isAuthenticated){
            router.push('/signin');
        }
    },[isAuthenticated]);
    
    return (
        <>{children}</>
    )
}
const mapStateToProps = ({auth})=>({
    isAuthenticated:auth.isAuthenticated
});
export default connect(mapStateToProps)(AuthContainer);