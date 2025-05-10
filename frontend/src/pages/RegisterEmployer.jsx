import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterEmployer = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    const employers = JSON.parse(localStorage.getItem("employers") || "[]");
    const exists = employers.some(emp => emp.email === email);
    if (exists) {
      alert("Bu e-posta ile kayıtlı bir işveren zaten var.");
      return;
    }

    const newEmployer = { name, email, password };
    employers.push(newEmployer);
    localStorage.setItem("employers", JSON.stringify(employers));

    alert("Kayıt başarılı!");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper elevation={6} sx={{ width: 400, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" mb={3}>İşveren Kayıt</Typography>
        <Stack spacing={2}>
          <TextField name="name" label="Firma Adı" value={form.name} onChange={handleChange} />
          <TextField name="email" label="Email" value={form.email} onChange={handleChange} />
          <TextField name="password" type="password" label="Şifre" value={form.password} onChange={handleChange} />
          <TextField name="confirmPassword" type="password" label="Şifre Tekrar" value={form.confirmPassword} onChange={handleChange} />
          <Button variant="contained" onClick={handleSubmit}>Kayıt Ol</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterEmployer;
