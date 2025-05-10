import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Paper,
  LinearProgress,
} from "@mui/material";

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(""); // ✅ Kullanıcı adını tutmak için

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleAnalyze = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Kullanıcı girişi yapılmamış.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/jobs/recommend/${userId}`);
      if (!response.ok) throw new Error("Öneri alınamadı.");
      const data = await response.json();
      console.log("Gelen işler:", data);
      setJobs(data);
    } catch (error) {
      console.error("Öneri hatası:", error);
      alert("CV analiz edilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1584697964154-19a5f7f07ca2?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 4,
          bgcolor: "rgba(255,255,255,0.95)",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" mb={4}>
          Hoş Geldin, {username} 👋
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
          <Button variant="contained" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analiz Ediliyor..." : "CV Analiz Et"}
          </Button>
        </Stack>

        {jobs.length > 0 && (
          <Typography variant="h5" mb={2}>
            🎯 Sana Uygun İş İlanları
          </Typography>
        )}

        <Stack spacing={2}>
          {jobs.map((job, index) => {
            const score = typeof job.score === "number" ? Math.round(job.score * 100) : 0;

            return (
              <Card key={index} sx={{ bgcolor: "#f8f9fa", position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor:
                      score >= 80
                        ? "#4caf50"
                        : score >= 50
                        ? "#ffb300"
                        : "#f44336",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                >
                  %{score}
                </Box>

                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {job.description}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    Firma: {job.company} • Lokasyon: {job.location}
                  </Typography>

                  <Box mt={2}>
                    <Typography variant="body2" mb={0.5}>
                      Uygunluk Yüzdesi
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
