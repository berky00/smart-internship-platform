from flask import Flask, request, jsonify
from flask_cors import CORS
from matching_model import match_cv_with_jobs
from PyPDF2 import PdfReader
import base64
import io

app = Flask(__name__)
CORS(app)  # Tüm kaynaklardan gelen isteklere izin verir

# 1. CV metni ve iş ilanları üzerinden eşleştirme API'si
@app.route("/match", methods=["POST"])
def match():
    data = request.get_json()

    cv_text = data.get("cv")
    job_descriptions = data.get("jobs")

    if not cv_text or not job_descriptions:
        return jsonify({"error": "CV ve iş ilanları zorunludur."}), 400

    print("📩 Flask'a gelen veri:")
    print(data)

    try:
        results = match_cv_with_jobs(cv_text, job_descriptions)
        print("📤 Flask'tan dönen sonuçlar:")
        print(results)
        return jsonify(results)
    except Exception as e:
        print("❌ Eşleştirme sırasında hata:", str(e))
        return jsonify({"error": str(e)}), 500

# 2. Base64 formatındaki PDF'ten metin çıkarma
@app.route("/extract", methods=["POST"])
def extract_text_from_cv():
    data = request.get_json()
    base64_file = data.get("file")

    if not base64_file:
        return jsonify({"error": "Base64 formatında CV dosyası gereklidir."}), 400

    try:
        # PDF verisini oku
        pdf_bytes = base64.b64decode(base64_file)
        pdf_stream = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_stream)

        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

        return jsonify({"text": text.strip()})
    except Exception as e:
        return jsonify({"error": f"PDF okunurken hata oluştu: {str(e)}"}), 400

# 🔧 Portu 5001'e çektik
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
