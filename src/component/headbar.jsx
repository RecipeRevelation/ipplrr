import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import './Bahan.css';

function Header() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const hideButtonsOnPaths = ['/reciperevelation/login', '/reciperevelation/register'];

  const shouldHideButtons = hideButtonsOnPaths.includes(location.pathname);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleProfileClick = () => {
    navigate("/reciperevelation/myAccount");
  };

  return (
    <Navbar variant="dark" expand="sm" style={{ backgroundColor: '#1d3557' , position: 'fixed', width: '100%'}} className="sticky-top ">
      <Navbar.Brand as={Link} to="/reciperevelation/">
        <Image src="src/assets/rr_logo.png" alt="Logo" width="80" height="40" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarSupportedContent" />
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/reciperevelation/" className="active">Generator</Nav.Link>
          <NavDropdown title="Other" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/reciperevelation/myRecipe">My Recipe</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/reciperevelation/cookingDictionary">Cooking Dictionary</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/reciperevelation/myAccount">My Account</NavDropdown.Item>
          </NavDropdown>
        </Nav >
        {user ? (
          <div className="d-flex align-items-center" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <Image src={user.photoURL} alt="Profile" roundedCircle style={{ width: '30px', height: '30px', marginRight:'5px' }} />
            <span className="text-light me-2">{user.email.replace('@gmail.com', '')}</span>
          </div>
        ) : (
          !shouldHideButtons && (
            <div className="me-2">
              <Button as={Link} to="/reciperevelation/login" variant="outline-light" className="me-2">Masuk</Button>
              <Button as={Link} to="/reciperevelation/register" variant="light">Daftar</Button>
            </div>
          )
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;








