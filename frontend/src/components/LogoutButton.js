import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Oturum bilgisini temizle
    navigate('/'); // Ana sayfaya yönlendir
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Çıkış Yap
    </button>
  );
}

export default LogoutButton;
