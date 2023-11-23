import OpenAI from 'openai';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Halaman.css';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { FaQuestion } from "react-icons/fa";



export default function HalamanUtama() {
  const [sajian, setSajian] = useState('');
  const [khas, setKhas] = useState('');
  const [caraMasak, setCaraMasak] = useState('');
  const [bahan, setBahan] = useState('');
  const [hidangan, setHidangan] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [gptResponse, setGptResponse] = useState('');
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [savedRecipe, setSavedRecipe] = useState(null);
  const [pesan, setPesan] = useState('');
  const [isTourStarted, setIsTourStarted] = useState(false);



    const startGuidedTour = () => {
      if (isTourStarted) {
        const driverObj = driver({
          showProgress: true,
          steps: [
            { element: '#mulai', popover: { title: 'Tutorial Penggunaan', description: 'Ikuti langkah langkah berikut untuk dapat memahami cara penggunaan web ini.' } },
            { element: '#hidanganDataList', popover: { title: 'Jenis Hidangan', description: 'Masukkan jenis hidangan yang ingin kamu buat.' } },
            { element: '#exampleFormControlTextarea1', popover: { title: 'Bahan-bahan', description: 'Masukkan bahan-bahan yang kamu miliki untuk membuat hidangan.' } },
            { element: '#sajianDataList', popover: { title: 'Sajian', description: 'Masukkan jenis sajian dari hidangan yang ingin kamu buat jika perlu, Tidak harus diisi.' } },
            { element: '#khasDataList', popover: { title: 'Khas', description: 'Masukkan Khas dari hidangan yang ingin kamu buat jika perlu, Tidak harus diisi.' } },
            { element: '#caraDataList', popover: { title: 'Cara', description: 'Masukkan Cara pembuatan dari hidangan yang ingin kamu buat jika perlu, Tidak harus diisi.' } },
            { element: '#buatresep', popover: { title: 'Buat resep', description: 'Jika sudah mengisi semua hal yang diperlukan untuk membuat resep, tekan tombol buat resep untuk membuatnya.' } },
            { element: '.resep', popover: { title: 'Tampilan resep', description: 'Resep akan tersedia pada bagian ini jika sudah menekan tombol buat resep, Jika hasil Resep dirasa kurang memuaskan tekan saja kembali tombol buat resepnya, sehingga akan menampilkan resep baru.' } },
            { element: '#simpan', popover: { title: 'Simpan resep', description: 'Jika kamu sudah dapat menemukan resep yang cocok dan ingin menyimpannya, kamu dapat menekan tombol simpan resep yang akan muncul ketika resep telah dibuat. dengan catatan kamu sudah masuk atau login agar dapat menyimpan resep.' } },
            { element: '#basic-nav-dropdown', popover: { title: 'Menu', description: 'Didalam menu other terdapat 3 halaman yang pertama adalah myrecipe yang merupakan tempat untuk melihat resep ayng sudah disimpan, kemudian yang kedua ada coocking dictionary yang merupakan beberapa penjelasan dari bahan bahan masakan, dan yang terakhir ada menu my account untuk melihat akun yang tertaut pada web kami.' } },
            { element: '#selesai', popover: { title: 'Selamat Mencoba', description: 'Buat dan temukan resep idaman kamu mulai dari sekarang.' } },
          ],
        });

        driverObj.drive();
      };
    }

  const handleStartTour = () => {
    setIsTourStarted(true);
  };

  useEffect(() => {
    if (isTourStarted) {
      startGuidedTour();
      setIsTourStarted(false); // Reset the state to allow for restarting
    }
  }, [isTourStarted]);
  
  

  const db = getFirestore();
  const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY ,dangerouslyAllowBrowser: true});


  const callGPTAPI = async () => {
    setIsCreatingRecipe(true);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: [
          { role: 'user', content: `Buatkan satu resep ${hidangan} dengan sajian ${sajian}, khas dari ${khas}, cara Masak ${caraMasak}, dan menggunakan Bahan-bahan berikut ${bahan}. berikan dalam 3 bagian yaitu judul,bahan dan caramasaknya` }
        ],
        max_tokens: 4000,
      });
      

      console.log(completion.choices[0]);

      const responseText = completion.choices[0].message.content;

      const [ judul, alatBahan, caraMasak2 , baru ] = responseText.split('\n\n');


      setSavedRecipe({ judul, alatBahan, caraMasak2 });
      setGptResponse({ judul, alatBahan, caraMasak2, baru });

    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    } finally {
      setIsCreatingRecipe(false);
    }
  };

  const handleSubmit = () => {
    if (sajian && khas && caraMasak && bahan && hidangan) {
      callGPTAPI();
    } else {
      alert('Mohon isi semua inputan terlebih dahulu.');
    }
  };

  const checkFormValidity = () => {
    if (sajian && khas && caraMasak && bahan && hidangan) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const simpanResep = async () => {
    if (savedRecipe) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const resepDenganTimestamp = {
              ...savedRecipe,
              timestamp: serverTimestamp(),
            };

            const resepCollectionRef = collection(userDocRef, 'resep');
            const docRef = await addDoc(resepCollectionRef, resepDenganTimestamp);

            console.log('Resep berhasil disimpan dengan ID:', docRef.id);
            setPesan('Resep berhasil disimpan.');
          } else {
            const userData = {};

            await setDoc(userDocRef, userData);

            const resepDenganTimestamp = {
              ...savedRecipe,
              timestamp: serverTimestamp(),
            };

            const resepCollectionRef = collection(userDocRef, 'resep');
            const docRef = await addDoc(resepCollectionRef, resepDenganTimestamp);

            console.log('Resep berhasil disimpan dengan ID:', docRef.id);
            setPesan('Resep berhasil disimpan.');
          }
        } catch (error) {
          console.error('Terjadi kesalahan saat menyimpan resep:', error);
          setPesan('Terjadi kesalahan saat menyimpan resep. Coba lagi nanti.');
        }
      } else {
        console.error('Pengguna belum login.');
        setPesan('Anda harus login untuk menyimpan resep.');
      }
    } else {
      setPesan('Resep belum tersedia. Harap buat resep terlebih dahulu.');
    }
  };

  return (
    <div className="container-fluid " style={{ backgroundColor: '#a8dadc' }}>
      <div className="container text-light">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-4 mt-3">
            <div className="formInput">
              <h5>Jenis Hidangan*</h5>
              <input
                className="form-control"
                list="datalisthidangan"
                id="hidanganDataList"
                placeholder="Jenis hidangan"
                value={hidangan}
                onChange={(e) => {
                  setHidangan(e.target.value);
                  checkFormValidity();
                }}
              />
              <datalist id="datalisthidangan">
                <option value="makanan" />
                <option value="minuman" />
                <option value="kue" />
                <option value="gorengan" />
                <option value="Kudapan" />
              </datalist>
            </div>
            <div className="formInput mt-3">
              <h5>Bahan-bahan*</h5>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                placeholder="Isi bahan-bahan yang akan digunakan"
                value={bahan}
                onChange={(e) => {
                  setBahan(e.target.value);
                  checkFormValidity();
                }}
              />
            </div>
            <div className="formInput mt-3">
              <h5>Sajian, Khas, dan Cara Masak (opsional) </h5>

              <input
                className="form-control"
                list="datalistSajian"
                id="sajianDataList"
                placeholder="jenis sajiannya"
                value={sajian}
                onChange={(e) => {
                  setSajian(e.target.value);
                  checkFormValidity();
                }}
              />
              <datalist id="datalistSajian">
                <option value="Hidangan Pembuka" />
                <option value="Hidangan Utama" />
                <option value="Hidangan Penutup" />
                <option value="Sarapan" />
                <option value="minuman dingin" />
                <option value="minuman panas" />

              </datalist>

              <input
                className="form-control mt-1"
                list="datalistKhas"
                id="khasDataList"
                placeholder="khas Dari mana"
                value={khas}
                onChange={(e) => {
                  setKhas(e.target.value);
                  checkFormValidity();
                }}
              />
              <datalist id="datalistKhas">
                <option value="indonesia" />
                <option value="Japanese" />
                <option value="Thailand" />
                <option value="Chinese" />
                <option value="Italia" />
              </datalist>

              <input
                className="form-control mt-1"
                list="datalistCara"
                id="caraDataList"
                placeholder="Isi cara masaknya"
                value={caraMasak}
                onChange={(e) => {
                  setCaraMasak(e.target.value);
                  checkFormValidity();
                }}
              />
              <datalist id="datalistCara">
                <option value="Panggang" />
                <option value="Rebus" />
                <option value="Goreng" />
                <option value="Tumis" />
                <option value="Kukus" />
              </datalist>
              
            </div>
          </div>
          <div className="col-12 col-sm-8 my-3 ">

            <div className="result-box">
            <button onClick={handleStartTour} style={{border:" 0px",right:'0px'}}><FaQuestion /></button>

            <h5 style={{textAlign : 'center'}}>Resep Anda</h5>
            
              <div className="resep">
              {isCreatingRecipe && (
                <div className="creating-recipe">
                  <p>LoadingResep</p>
                  <div className="loader"></div>
                </div>
                )}

                <p id="judul">{gptResponse.judul}</p>
                {gptResponse.alatBahan ? (
                <ul>
                    {gptResponse.alatBahan.split('\n').map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                </ul>
                  ) : (
                    <p style={{textAlign : "center"}}> belum ada resep</p>
                  )}
                  {gptResponse.caraMasak2 ? (
                    <ul>
                      {gptResponse.caraMasak2.split('\n').map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p></p>
                  )}
              </div>

              <div className="justify-content-center my-2">
                <button
                  className="btn btn-outline-success"
                  id="buatresep"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                >
                  Buat Resep
                </button>

                {gptResponse && (
                  <button
                    className="btn"
                    id="simpan"
                    type="submit"
                    onClick={simpanResep}
                    style={{
                      backgroundColor: '#457b9d', 
                    }}
                  >
                    Simpan Resep
                  </button>
              )}
              </div>
            </div>
            <div className="pesan">{pesan}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
