import React from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import './Bahan.css';

const Popup = ({ setIsOpenPopup, recipe }) => {
const processedCaraMasak = recipe.caraMasak2.replace(/^(Cara Masak :|Cara Membuat|Cara Memasak|:)/i, '').trim();

const caraMasakSteps = processedCaraMasak.split('-').map((item, index) => (
  <li key={index}>{item}</li>
));

  return (
    <div
      onClick={() => setIsOpenPopup(false)}
      className="popup-container"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="popup-content"
      >
        <div className="popup-header">
          <h1>{recipe.judul}</h1>
          <div
            onClick={() => setIsOpenPopup(false)}
            className="popup-close"
          >
            <AiOutlineCloseSquare />
          </div>
        </div>
        <div className="popup-body">
          <h3>Alat dan Bahan:</h3>
          <ul>
            {recipe.alatBahan.split('-').map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <h3>cara Masak:</h3>
          <ol>
            {caraMasakSteps}
          </ol>
        </div>
        <footer className="popup-footer">
          {recipe.timestamp && (
            <small className="text-muted">
              Tanggal: {recipe.timestamp.toDate().toDateString()}
            </small>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Popup;
