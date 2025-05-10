import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper
} from "@mui/material";

const RegisterStudent = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [cvFile, setCvFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword || !cvFile) {
      alert("Lütfen tüm alanları ve CV dosyasını doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    const formData = new FormData();
    formData.append("username", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "user"); // Öğrenciler "user" rolünde
    formData.append("cvFile", cvFile);

    try {
      const response = await fetch("http://localhost:8080/api/users/register-with-cv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Kayıt başarılı!");
      } else {
        const err = await response.text();
        alert("Kayıt başarısız: " + err);
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ width: 400, p: 4, bgcolor: "rgba(255,255,255,0.95)", borderRadius: 3 }}>
        <Typography variant="h5" mb={3}>Öğrenci Kayıt</Typography>

        <Stack spacing={2}>
          <TextField name="name" label="Ad Soyad" value={form.name} onChange={handleChange} />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} />
          <TextField name="password" type="password" label="Şifre" value={form.password} onChange={handleChange} />
          <TextField name="confirmPassword" type="password" label="Şifre Tekrar" value={form.confirmPassword} onChange={handleChange} />
          
          <Button variant="outlined" component="label">
            CV Yükle (PDF)
            <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
          </Button>
          {cvFile && <Typography fontSize={14}>Yüklenen Dosya: {cvFile.name}</Typography>}

          <Button variant="contained" onClick={handleSubmit}>Kayıt Ol</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterStudent;
