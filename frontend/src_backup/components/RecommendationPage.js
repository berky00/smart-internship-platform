import React, { useEffect, useState, useCallback } from 'react';
import LogoutButton from './LogoutButton';

function RecommendationPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  const getRecommendations = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/jobs/recommend/${userId}`);
      const data = await response.json();
      console.log("Gelen öneriler:", data);
      if (Array.isArray(data)) {
        setRecommendations(data);
      } else {
        console.warn("Beklenmeyen veri formatı:", data);
        setRecommendations([]);
      }
    } catch (err) {
      console.error("API isteği başarısız:", err);
      setError("Öneriler alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getRecommendations();
    } else {
      setLoading(false);
    }
  }, [userId, getRecommendations]);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>İş Öneri Sistemi</h2>
      <LogoutButton />

      {!userId ? (
        <p style={{ color: "red" }}>Lütfen önce giriş yapınız.</p>
      ) : loading ? (
        <p>Öneriler yükleniyor...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : recommendations.length === 0 ? (
        <p>Henüz öneri bulunmamaktadır.</p>
      ) : (
        <ul style={{ marginTop: "20px" }}>
          {recommendations.map((job, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{job.description}</strong><br />
              Eşleşme Skoru: {job.score.toFixed(3)}<br />
              Seviye: {job.match_level}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecommendationPage;
