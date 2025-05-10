import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const text = await response.text();
      setMessage(text);

      if (text.includes("başarılı")) {
        const userInfoResponse = await fetch(`http://localhost:8080/api/users/email/${email}`);
        const userInfo = await userInfoResponse.json();

        localStorage.setItem("userId", userInfo.id);

        setTimeout(() => navigate("/recommend"), 1500);
      }
    } catch (error) {
      setMessage("Bir hata oluştu.");
      console.error("Giriş hatası:", error);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Kullanıcı Giriş Formu</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Şifre:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" style={{ marginTop: "15px" }}>Giriş Yap</button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}

      <p style={{ marginTop: "20px" }}>
        Üye değil misiniz? <Link to="/register">Kayıt olun</Link>
      </p>
    </div>
  );
}

export default LoginForm;
