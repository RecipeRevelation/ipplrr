import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/login';
import Register from '../src/pages/register';
import Halamanutama from '../src/pages/halaman utama';
import Header from './component/headbar';
import MyAccount from './pages/myAccount';
import CookingDictionary from './pages/cookingDictionary';
import RecipeList from './pages/myRecipe';
import "./utils/firebase"


export default function App() {


  return (

    <Router>
      <Header>
      </Header>
      
      <Routes>
        <Route path="/reciperevelation" element={<Halamanutama />} />
        <Route path="/reciperevelation/login" element= {<Login />} />
        <Route path="/reciperevelation/register" element={<Register />} />
        <Route path="/reciperevelation/myAccount" element={<MyAccount />} />
        <Route path="/reciperevelation/cookingDictionary" element={<CookingDictionary />} />
        <Route path="/reciperevelation/myRecipe" element={<RecipeList />} />
      </Routes>
    </Router>
  );
}

