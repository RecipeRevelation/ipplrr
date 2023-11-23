import React from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import './Bahan.css';

const Popup = ({ setIsOpenPopup, istilah }) => {
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
          <h1>{istilah.nama}</h1>
          <div
            onClick={() => setIsOpenPopup(false)}
            className="popup-close"
          >
            <AiOutlineCloseSquare />
          </div>
        </div>
        <div className="popup-body">
          <p>{istilah.penjelasan}</p>
        </div>
        <footer className="popup-footer">
        </footer>
      </div>
    </div>
  );
};

export default Popup;