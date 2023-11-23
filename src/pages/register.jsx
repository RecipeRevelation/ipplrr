import React from 'react'
import {Registerform} from '../component/form'
import { Link } from "react-router-dom"
import './Halaman.css'

function Register() {

  return (
    <div className="register-container" style={{backgroundColor: "#f1faee"}}>
      <h2>Daftar</h2>
      <Registerform  />
      <p>sudah punya akun?  <Link to="/reciperevelation/login"> masuk </Link></p>
    </div>
  );
};

export default Register;