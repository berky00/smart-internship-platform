#!/bin/bash

# Flask (5000)
fpid=$(lsof -ti :5000)
if [ ! -z "$fpid" ]; then
  echo "🧹 Flask (5000) işlemi durduruluyor: PID $fpid"
  kill -9 $fpid
fi

# Spring Boot (8080)
bpid=$(lsof -ti :8080)
if [ ! -z "$bpid" ]; then
  echo "🧹 Spring Boot (8080) işlemi durduruluyor: PID $bpid"
  kill -9 $bpid
fi

# React (3000)
rpid=$(lsof -ti :3000)
if [ ! -z "$rpid" ]; then
  echo "🧹 React (3000) işlemi durduruluyor: PID $rpid"
  kill -9 $rpid
fi

echo "✅ Port temizliği tamamlandı."

