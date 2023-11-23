import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../utils/firebase'; // Pastikan Anda mengimpor firestore dari konfigurasi Firebase Anda
import Popup  from '../component/popupmr';

function formatTimestamp(timestamp) {
  const date = timestamp.toDate();
  return date.toDateString();
}

function RecipeList() {
  const [user, setUser] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);

        const fetchUserRecipes = async () => {
          const querySnapshot = await getDocs(
            collection(firestore, 'users', authUser.uid, 'resep')
          );
          const userRecipeList = [];
          querySnapshot.forEach((doc) => {
            userRecipeList.push(doc.data());
          });
          setUserRecipes(userRecipeList);
        };

        fetchUserRecipes();
      } else {
        setUser(null);
        setUserRecipes([]);
      }
    });
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <>
      <h1 style={{ margin: '0', marginBottom: '0px', marginTop: '70px', textAlign: 'center', color: 'white' }}>My Recipe</h1>
      <div className="container-fluid" style={{ backgroundColor: '#a8dadc' , marginTop: '20px'}}>
        <div className="container text-dark" style={{ height: '100vh' }}>
          {user ? (
            userRecipes.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-3 g-2">
                {userRecipes.map((recipe, index) => (
                  <div className="col" key={index}>
                    <div className="card h-100 margin-top-10">
                      <div className="card-body">
                        <h5 className="card-title">{recipe.judul}</h5>
                        <p className="card-text">{truncateText(recipe.alatBahan, 100)}</p>
                        <button
                          className="btn btn-primary " style={{ backgroundColor: '#1d3557' }}
                          onClick={() => {
                            setSelectedRecipe(recipe);
                            setIsPopupOpen(true);
                          }}
                        >
                          Baca Selengkapnya
                        </button>
                      </div>
                      <div className="card-footer">
                        <small className="text-muted">
                          {formatTimestamp(recipe.timestamp)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className=" text-center text-light">Anda belum memiliki resep yang tersimpan.</p>
            )
          ) : (
            <p className="text-center text-light">
              Silakan login untuk melihat resep Anda.
            </p>
          )}
          {isPopupOpen && <Popup setIsOpenPopup={setIsPopupOpen} recipe={selectedRecipe} />}
        </div>
      </div>
    </>
  );
}

export default RecipeList;
