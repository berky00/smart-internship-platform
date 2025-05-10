from sentence_transformers import SentenceTransformer, util
import numpy as np
import re

# Çok dilli model (Türkçe destekli)
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# Eşik değeri (0.5 üzeri olan eşleşmeler gösterilecek)
THRESHOLD = 0.5

def yorum_uret(score):
    if score >= 0.75:
        return "Yüksek"
    elif score >= 0.5:
        return "Orta"
    else:
        return "Düşük"

def basit_cumle_tokenizer(text):
    # Nokta, ünlem, soru işareti, yeni satıra göre cümleleri böl
    return [c.strip() for c in re.split(r'[.!?\n]', text) if c.strip()]

def match_cv_with_jobs(cv_text, job_descriptions):
    if not cv_text or not job_descriptions:
        return []

    try:
        cv_sentences = basit_cumle_tokenizer(cv_text)
    except Exception as e:
        print("❌ Cümle ayırma hatası:", e)
        return []

    if not cv_sentences:
        print("⚠️ Hiçbir CV cümlesi bulunamadı.")
        return []

    # Vektörleştirme
    cv_embeddings = model.encode(cv_sentences, convert_to_tensor=True)
    job_embeddings = model.encode(job_descriptions, convert_to_tensor=True)

    results = []
    for idx, job_embedding in enumerate(job_embeddings):
        try:
            similarity_scores = util.cos_sim(job_embedding, cv_embeddings)
            max_score = float(similarity_scores.max().item())  # PyTorch tensor'dan float'a dön
            results.append({
                'job_index': idx,
                'description': job_descriptions[idx],
                'score': round(max_score, 4),
                'match_level': yorum_uret(max_score)
            })
        except Exception as e:
            print(f"⚠️ Eşleştirme hatası (iş {idx}):", e)
            continue

    # Skorları azalan şekilde sırala
    results.sort(key=lambda x: x['score'], reverse=True)

    # Sadece 0.5 ve üzeri skora sahip sonuçları döndür
    filtered_results = [res for res in results if res["score"] >= THRESHOLD]
    return filtered_results
