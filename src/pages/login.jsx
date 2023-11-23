import React from 'react';
import {LoginForm} from '../component/form';
import './Halaman.css'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc";

function Login () {

  const navigate = useNavigate()

  const handleGoogleLogin = ()=>{
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
    .then((result)=>{
      console.info(result.user)
      localStorage.setItem('user', JSON.stringify(result.user))
      navigate("/reciperevelation/")
    })
    .catch((err)=>{
      console.error(err)
    })
  }

  return (
    <div className="login-container" style={{backgroundColor: "#f1faee"}}>
      <h2>MASUK</h2>
      <LoginForm />
      <p>belum punya akun? <Link to="/reciperevelation/register"> Daftar disini </Link></p>
      <button className="Google" type='button' onClick={handleGoogleLogin}>
      <FcGoogle style={{fontSize : ' 24px'}} />    Masuk dengan Google 
      </button>
    </div>
  );
};

export default Login;
