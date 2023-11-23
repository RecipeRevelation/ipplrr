import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth"
import FloatingMessage from '../component/pesan';
import { useNavigate } from 'react-router-dom'; 
import { BiShowAlt, BiHide , BiSolidError } from "react-icons/bi";
import './Bahan.css';



const LoginForm = ({}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Silahkan lengkapi data!');
      return;
    }
    setMessage('');

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
      if ( result.user.emailVerified){
        console.info(result.user)
        localStorage.setItem('user', JSON.stringify(result.user))
        navigate("/reciperevelation/")
      }else{
        setMessage('Verifikasi email anda terlebih dahulu')
        signOut(auth)
        navigate("/reciperevelation/login")
      }

    })
    .catch((error)=>{
      if (error.code === 'auth/invalid-email') {
        setError(' Format Email salah!');
      }else if (error.code === 'auth/invalid-login-credentials') {
          setError(' Email atau password salah!');   
      } else {
        setError('Pendaftaran gagal. Error: ' + error.message);
      }
      setSuccessMessage('');
    
    });
  }

  return (
      <form className='login-input'>
        {message&&(
          <div className="message" style={{color : "red" , animation:'dropTop 0.3s linear'}}>
            <p style={{fontSize:'12px'}}><BiSolidError /> {message} </p>
          </div>
          )}
        <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{marginBottom:"0px"}}
          />
          {error && <div className="error" style={{color : 'red', marginTop:'0', marginBottom:'10px',animation:'dropTop 0.3s linear', fontSize:'12px'}}><BiSolidError /> {error}</div>}
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{marginTop:"10px"}}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-hide-button2"
            >
              {showPassword ?  <BiHide /> : <BiShowAlt />}
            </button>
          </div>
        <button className="Email" onClick={handleLogin}>Masuk</button>
      </form>
  );
};


const Registerform = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();


  const handleregister = (e) => {
    e.preventDefault();

    if (!email || !password || !password2 ) {
      setMessage('Silahkan lengkapi data!');
      return;
    }
    setMessage('');
  
      

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {
      console.info('Pendaftaran berhasil:', result.user);
      signOut(auth)

      // Kirim email verifikasi
      sendEmailVerification(auth.currentUser)
        .then(() => {
          // Email verifikasi berhasil dikirim
          alert('Email verifikasi telah dikirim. silahkan lakukan verifikaasi email anda');
          setSuccessMessage('Registrasi berhasil! Selamat datang, ' + username);
          navigate("/reciperevelation/login")
          setError(null);
        })
        .catch((error) => {
          alert('Error mengirim email verifikasi:', error);
        });

    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar! Silahkan gunakan email lain.');
      }
      else if (error.code === 'auth/invalid-email') {
        setError('Format Email salah!');  
      } else {
        setError('Pendaftaran gagal. Error: ' + error.message);
      }
      setSuccessMessage('');
    });

    
  };

  return (
    <section>
      <form className='regis-input'>
        {message&&(
        <div className="message" style={{color : "red" , animation:'dropTop 0.3s linear'}}>
          <p style={{fontSize:'12px',marginBottom:'0px'}}><BiSolidError /> {message}</p>
        </div>
        )}
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{marginBottom:"0px", marginTop:'10px'}}
        />
        {error && <div className="error" style={{color : 'red', marginTop:'0', marginBottom:'0px',animation:'dropTop 0.3s linear',fontSize:'12px'}}><BiSolidError />{error}</div>}
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{marginBottom:"0px", marginTop:'10px'}}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-hide-button1"
          >
            {showPassword ?  <BiHide /> : <BiShowAlt />}
          </button>
        </div>
        {message && password.length < 8 && (
        <div className="message" style={{color : "red" , animation:'dropTop 0.3s linear',marginTop:'0px',marginBottom:'0px'}}>
          <p style={{fontSize:'12px'}}><BiSolidError /> Password harus lebih dari 8 karakter!</p>
        </div>
        )}
        <input
          type="password"
          id="password2"
          placeholder="Konfirmasi Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          style={{marginBottom:"0px", marginTop:'10px'}}
        />
        {message && password !== password2 && (
        <div className="message" style={{color : "red" , animation:'dropTop 0.3s linear',marginTop:"0px"}}>
          <p style={{fontSize:'12px',marginBottom:'0px'}}><BiSolidError /> Password harus sama!</p>
        </div>
        )}
        {successMessage && (
        <FloatingMessage
          message={successMessage}
          duration={3000}
          onMessageClose={() => setSuccessMessage('')}
        />
        )}
        <button className="Register" onClick={handleregister}>Daftar</button>
      </form>

      <form>
      </form>
    </section>
  );
};


export { LoginForm, Registerform };


