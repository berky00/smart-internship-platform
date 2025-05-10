import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Paper
} from "@mui/material";

const EmployerDashboard = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [ads, setAds] = useState([]);

  const handleSubmit = async () => {
    if (!title || !company || !description || !location) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const newAd = { title, company, description, location };

    try {
      const response = await fetch("http://localhost:8080/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAd)
      });

      if (response.ok) {
        alert("İş ilanı başarıyla kaydedildi!");
        setAds([...ads, newAd]); // UI'de göstermek için yerel state'e ekle
        setTitle("");
        setCompany("");
        setDescription("");
        setLocation("");
      } else {
        alert("İş ilanı kaydedilemedi.");
      }
    } catch (error) {
      console.error("İstek hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.pexels.com/photos/6238186/pexels-photo-6238186.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 4,
      }}
    >
      <Paper elevation={6} sx={{ maxWidth: 800, mx: "auto", p: 4, bgcolor: "rgba(255,255,255,0.95)", borderRadius: 3 }}>
        <Typography variant="h4" mb={4}>
          İlan Ver (İşveren Paneli)
        </Typography>

        {/* Form Alanı */}
        <Stack spacing={2} mb={3}>
          <TextField label="İlan Başlığı" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField label="Şirket Adı" value={company} onChange={(e) => setCompany(e.target.value)} fullWidth />
          <TextField
            label="İş Tanımı"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <TextField label="Lokasyon" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleSubmit}>İlan Ver</Button>
        </Stack>

        {/* Verilen İlanlar */}
        {ads.length > 0 && (
          <Typography variant="h6" mb={2}>Verilen İlanlar</Typography>
        )}

        <Stack spacing={2}>
          {ads.map((ad, index) => (
            <Card key={index} sx={{ bgcolor: "#f9f9f9" }}>
              <CardContent>
                <Typography variant="h6">{ad.title}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {ad.description}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Şirket: {ad.company} • Lokasyon: {ad.location}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default EmployerDashboard;
