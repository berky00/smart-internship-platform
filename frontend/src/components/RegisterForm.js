import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch("http://localhost:8080/api/users/register-with-cv", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("Kayıt başarısız. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setMessage("Sunucu hatası oluştu.");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Kullanıcı Kayıt Formu</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label>Kullanıcı Adı:</label>
        <input type="text" name="username" required />

        <label>Email:</label>
        <input type="email" name="email" required />

        <label>Şifre:</label>
        <input type="password" name="password" required />

        <label>Rol:</label>
        <input type="text" name="role" required />

        <label>CV Dosyası:</label>
        <input type="file" name="cvFile" required />

        <button type="submit" style={{ marginTop: "15px" }}>Kayıt Ol</button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
    </div>
  );
}

export default RegisterForm;
