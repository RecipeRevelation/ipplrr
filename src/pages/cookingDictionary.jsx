import React from 'react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../utils/firebase'; 
import Image from 'react-bootstrap/Image';
import Popup  from '../component/popupcd';

function IstilahList() {
  const [istilahs, setIstilahs] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedIstilah, setSelectedIstilah] = useState(null);

  // Fungsi untuk mengambil daftar istilah dari Firestore
  const fetchIstilahs = async () => {
    const istilahCollection = collection(firestore, 'istilah'); // 'istilah' adalah nama koleksi di Firestore Anda
    const querySnapshot = await getDocs(istilahCollection);
    const istilahList = [];
    querySnapshot.forEach((doc) => {
      istilahList.push(doc.data());
    });
    setIstilahs(istilahList);
  };

  useEffect(() => {
    // Panggil fungsi untuk mengambil istilah saat komponen dimuat
    fetchIstilahs();
  }, []);

  return (
    <div style={{ backgroundColor: '#a8dadc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ margin: '0', marginBottom: '30px',marginTop:'70px' ,color: 'white' }}>Cooking Dictionary</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
        {istilahs.map((istilah, index) => (
          <button key={index} style={{ padding: '5px 10px', whiteSpace: 'nowrap', borderRadius: '20px', minWidth: '100px', backgroundColor: '#f1faee', color: '#1d3557' }}
            onClick={() => {
              setSelectedIstilah(istilah);
              setIsPopupOpen(true);
            }}
          >
            {istilah.nama}
          </button>
        ))}
      </div>
      {isPopupOpen && <Popup setIsOpenPopup={setIsPopupOpen} istilah={selectedIstilah} />}
    </div>
  );
}

export default IstilahList;

