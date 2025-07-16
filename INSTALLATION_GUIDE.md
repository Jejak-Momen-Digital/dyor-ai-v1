# Panduan Instalasi Dyor AI untuk Laptop

Panduan ini akan membantu Anda menginstal dan menjalankan Dyor AI di laptop Anda.

## 📋 Persyaratan Sistem

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, atau Linux Ubuntu 18.04+
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Internet**: Koneksi internet untuk download dependencies

### Software Prerequisites
- **Python 3.11+** - [Download Python](https://python.org/downloads)
- **Node.js 20+** - [Download Node.js](https://nodejs.org/download)
- **Git** - [Download Git](https://git-scm.com/downloads)

## 🚀 Instalasi Otomatis (Recommended)

### Windows
1. Download dan jalankan `install-windows.bat`
2. Ikuti instruksi di command prompt
3. Aplikasi akan otomatis terbuka di browser

### macOS/Linux
1. Download dan jalankan `install-unix.sh`
```bash
chmod +x install-unix.sh
./install-unix.sh
```
2. Ikuti instruksi di terminal
3. Aplikasi akan otomatis terbuka di browser

## 🛠️ Instalasi Manual

### Langkah 1: Download Source Code
```bash
# Clone repository
git clone https://github.com/FoundationAgents/OpenManus.git
cd OpenManus

# Atau download ZIP dan extract
```

### Langkah 2: Setup Backend
```bash
# Masuk ke direktori backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Langkah 3: Setup Frontend
```bash
# Masuk ke direktori frontend
cd ../frontend

# Install dependencies
npm install

# Build untuk production
npm run build

# Copy build ke backend static
cp -r dist/* ../backend/src/static/
# Windows: xcopy dist\* ..\backend\src\static\ /E /I
```

### Langkah 4: Jalankan Aplikasi
```bash
# Kembali ke direktori backend
cd ../backend

# Pastikan virtual environment aktif
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Jalankan server
python src/main.py
```

### Langkah 5: Akses Aplikasi
1. Buka browser
2. Kunjungi `http://localhost:5000`
3. Mulai menggunakan Dyor AI!

## 🔧 Konfigurasi

### Environment Variables (Opsional)
Buat file `.env` di direktori backend:
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key-here
```

### Port Configuration
Jika port 5000 sudah digunakan, edit `src/main.py`:
```python
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=False)
```

## 🚨 Troubleshooting

### Error: "Port 5000 is already in use"
**Solusi**:
1. Tutup aplikasi yang menggunakan port 5000
2. Atau ubah port di `src/main.py`

### Error: "Module not found"
**Solusi**:
1. Pastikan virtual environment aktif
2. Install ulang dependencies: `pip install -r requirements.txt`

### Error: "npm command not found"
**Solusi**:
1. Install Node.js dari https://nodejs.org
2. Restart terminal/command prompt

### Error: "python command not found"
**Solusi**:
1. Install Python dari https://python.org
2. Pastikan Python ada di PATH
3. Coba gunakan `python3` instead of `python`

### Frontend tidak muncul
**Solusi**:
1. Pastikan build frontend sudah di-copy ke `backend/src/static/`
2. Clear browser cache
3. Check console browser untuk error

## 📱 Akses dari Device Lain

Untuk mengakses dari smartphone/tablet di jaringan yang sama:
1. Cari IP address laptop Anda
2. Akses `http://[IP-ADDRESS]:5000` dari device lain

### Cara cari IP Address:
**Windows**: `ipconfig`
**macOS/Linux**: `ifconfig` atau `ip addr`

## 🔄 Update Aplikasi

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Update frontend dependencies
cd ../frontend
npm install
npm run build
cp -r dist/* ../backend/src/static/

# Restart aplikasi
cd ../backend
python src/main.py
```

## 🛡️ Keamanan

### Untuk Production Use:
1. Ubah `SECRET_KEY` di konfigurasi
2. Set `FLASK_ENV=production`
3. Gunakan HTTPS jika memungkinkan
4. Batasi akses jaringan jika diperlukan

## 📞 Support

Jika mengalami masalah:
1. Check troubleshooting section di atas
2. Buka issue di GitHub repository
3. Hubungi tim support

## 🎉 Selamat!

Dyor AI sekarang sudah berjalan di laptop Anda! Nikmati pengalaman AI assistant yang powerful dan user-friendly.

---

**Tips**: Bookmark `http://localhost:5000` untuk akses cepat ke Dyor AI Anda!

