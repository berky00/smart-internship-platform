import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Arial',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '60%',
        maxWidth: '800px',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Kullanıcı Paneli */}
        <div style={{ textAlign: 'center' }}>
          <h2>Kullanıcı Paneli</h2>
          <p>Giriş yap veya kayıt ol</p>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
          >
            Giriş Yap / Kayıt Ol
          </button>
        </div>

        {/* İşveren Paneli */}
        <div style={{ textAlign: 'center' }}>
          <h2>İşveren Paneli</h2>
          <p>Yeni iş ilanı ekleyin</p>
          <button
            onClick={() => navigate('/add-job')}
            style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
          >
            İş İlanı Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
