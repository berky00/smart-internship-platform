import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const navigate = useNavigate();

  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [employerEmail, setEmployerEmail] = useState("");
  const [employerPassword, setEmployerPassword] = useState("");

  const handleStudentLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: studentEmail,
          password: studentPassword,
        }),
      });

      const text = await response.text();
      console.log("Login yanıtı:", text);
  
      if (response.ok && text.includes("başarılı")) {
        // 🔄 Giriş başarılıysa kullanıcı bilgilerini çek
        const userInfoResponse = await fetch(`http://localhost:8080/api/users/email/${studentEmail}`);
        const userInfo = await userInfoResponse.json();
  
        localStorage.setItem("userId", userInfo.id);
        localStorage.setItem("username", userInfo.username);
        localStorage.setItem("role", userInfo.role);
  
        navigate("/student-dashboard");
      } else {
        alert(text || "Giriş başarısız.");
      }
    } catch (error) {
      console.error("Sunucu hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleEmployerLogin = () => {
    const employers = JSON.parse(localStorage.getItem("employers") || "[]");
    const matched = employers.find(
      emp => emp.email === employerEmail && emp.password === employerPassword
    );
  
    if (matched) {
      localStorage.setItem("employerEmail", employerEmail);
      navigate("/employer-dashboard");
    } else {
      alert("İşveren girişi başarısız.");
    }
  };
  
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url('https://images.pexels.com/photos/5439433/pexels-photo-5439433.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 2,
      }}
    >
      <Typography
        variant="h3"
        mb={5}
        color="white"
        fontWeight="bold"
        sx={{ textShadow: "1px 1px 4px rgba(0,0,0,0.6)" }}
      >
        Akıllı Staj Platformu
      </Typography>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="center" alignItems="center">
        {/* Öğrenci Girişi */}
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "white",
            width: 300,
            m: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>Kullanıcı Girişi</Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
          <TextField
            label="Şifre"
            type="password"
            fullWidth
            margin="normal"
            value={studentPassword}
            onChange={(e) => setStudentPassword(e.target.value)}
          />
          <Stack direction="column" spacing={1} mt={2}>
            <Button variant="contained" onClick={handleStudentLogin}>Giriş Yap</Button>
            <Button onClick={() => navigate("/register-student")}>Kayıt Ol</Button>
            <Button onClick={() => navigate("/forgot-password")}>Şifremi Unuttum</Button>
          </Stack>
        </Box>

        {/* İşveren Girişi */}
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "white",
            width: 300,
            m: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>İşveren Girişi</Typography>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={employerEmail}
            onChange={(e) => setEmployerEmail(e.target.value)}
          />
          <TextField
            label="Şifre"
            type="password"
            fullWidth
            margin="normal"
            value={employerPassword}
            onChange={(e) => setEmployerPassword(e.target.value)}
          />
          <Stack direction="column" spacing={1} mt={2}>
            <Button variant="contained" color="secondary" onClick={handleEmployerLogin}>Giriş Yap</Button>
            <Button onClick={() => navigate("/register-employer")}>Kayıt Ol</Button>
            <Button onClick={() => navigate("/forgot-password")}>Şifremi Unuttum</Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
