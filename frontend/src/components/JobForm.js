import React, { useState } from 'react';

function JobForm() {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    company: '',
    location: ''
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        alert('İş ilanı başarıyla eklendi!');
        setJobData({ title: '', description: '', company: '', location: '' });
      } else {
        alert('Ekleme başarısız.');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>İş İlanı Ekle</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <label>Başlık:</label>
        <input type="text" name="title" value={jobData.title} onChange={handleChange} />

        <label>Açıklama:</label>
        <textarea name="description" value={jobData.description} onChange={handleChange}></textarea>

        <label>Şirket:</label>
        <input type="text" name="company" value={jobData.company} onChange={handleChange} />

        <label>Lokasyon:</label>
        <input type="text" name="location" value={jobData.location} onChange={handleChange} />

        <button type="submit" style={{ marginTop: "15px" }}>İlanı Kaydet</button>
      </form>
    </div>
  );
}

export default JobForm;
