import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom"

function MyAccount() {

  const [user, setUser] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')))
  }, [])

  const handleLogout = () => {
    const auth = getAuth()
    signOut(auth)
      .then(result => {
        localStorage.clear()
        navigate("/reciperevelation/") 
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column', 
    }}>
    <div className="container text-dark">
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh'}}>
        <div className="card" style={{ width: '500px' }}>
          <div className="card-body">
            <h5 className="card-title ">My Account</h5>
            {user ? ( // Tampilkan jika pengguna sudah login
              <div className="text-center">
                <div className="form-floating mb-3">
                  <img src={user.photoURL} alt="" />
                </div>
                <div className="form-floating mb-3">
                  <p>{user.email}</p>
                </div>
                <button className="Logout" type='button' onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : ( // Tampilkan jika pengguna belum login
              <div className="text-center">
                <p> Anda belum login. </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  )

}

export default MyAccount;


