#!/bin/bash

clear
echo "🔧 PostgreSQL servisinin çalıştığından emin olun..."
sleep 1

# -------------------------------
# 1. Python Flask Servisi
# -------------------------------
echo "🚀 Python Flask servisi başlatılıyor..."
cd ai-matching || { echo "❌ ai-matching klasörü bulunamadı"; exit 1; }

if [ ! -d "venv" ]; then
  echo "⚠️ Sanal ortam bulunamadı. 'python3 -m venv venv' komutuyla oluşturmalısınız."
  exit 1
fi

source venv/bin/activate
python main.py &
PYTHON_PID=$!
cd ..

# -------------------------------
# 2. Spring Boot Backend
# -------------------------------
echo "🚀 Spring Boot backend başlatılıyor..."
cd backend || { echo "❌ backend klasörü bulunamadı"; exit 1; }

if [ ! -f "./mvnw" ]; then
  echo "⚠️ mvnw dosyası eksik. 'mvn wrapper:wrapper' komutunu çalıştırın."
  exit 1
fi

./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# -------------------------------
# 3. React Frontend
# -------------------------------
echo "🚀 React frontend başlatılıyor..."
cd frontend || { echo "❌ frontend klasörü bulunamadı"; exit 1; }

if [ ! -f "package.json" ]; then
  echo "⚠️ package.json dosyası eksik. React projesi başlatılmamış olabilir."
  exit 1
fi

npm start &
FRONTEND_PID=$!
cd ..

# -------------------------------
# Bilgilendirme
# -------------------------------
echo "✅ Tüm servisler arka planda başlatıldı."
echo ""
echo "🌐 Uygulama Bağlantıları:"
echo " - Frontend:   http://localhost:3000"
echo " - Backend:    http://localhost:8080"
echo " - Python API: http://127.0.0.1:5000"
echo ""
echo "🔚 Tüm servisleri kapatmak için:"
echo "   kill $PYTHON_PID $BACKEND_PID $FRONTEND_PID"

