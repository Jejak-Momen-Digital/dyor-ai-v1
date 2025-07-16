# Dyor AI - Your Personal AI Assistant

Dyor AI adalah aplikasi web yang mengintegrasikan kemampuan OpenManus untuk memberikan pengalaman AI assistant yang lengkap dan interaktif.

## 🚀 Live Demo

Aplikasi telah di-deploy dan dapat diakses di: **https://3dhkilcjm57o.manus.space**

## ✨ Fitur Utama

- **Chat Interface**: Interface chat yang modern dan responsif
- **Real-time Communication**: WebSocket untuk komunikasi real-time
- **Agent Status Monitoring**: Monitoring status dan performa AI agent
- **Multi-capability Support**: Mendukung berbagai kemampuan AI seperti:
  - Web browsing dan research
  - Code generation dan execution
  - File management
  - Image generation
  - Data analysis
  - Dan banyak lagi

## 🏗️ Arsitektur

### Backend (Flask + SocketIO)
- **Framework**: Flask dengan Flask-SocketIO
- **API Routes**: RESTful API untuk chat dan status
- **WebSocket**: Real-time communication
- **OpenManus Integration**: Wrapper untuk integrasi dengan OpenManus
- **CORS**: Configured untuk frontend-backend communication

### Frontend (React + TypeScript)
- **Framework**: React dengan Vite
- **UI Components**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context
- **WebSocket Client**: Socket.IO client

## 📁 Struktur Proyek

```
dyor-ai/
├── backend/                 # Flask backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── static/         # Frontend build files
│   │   └── main.py         # Entry point
│   ├── venv/               # Virtual environment
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── assets/         # Static assets
│   ├── dist/               # Build output
│   └── package.json        # Node dependencies
├── openmanus/              # OpenManus integration
└── docs/                   # Documentation
```

## 🛠️ Instalasi dan Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm atau pnpm

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Development
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python src/main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Copy build to Flask static
cp -r dist/* ../backend/src/static/

# Run production server
cd ../backend
source venv/bin/activate
python src/main.py
```

## 🔧 Konfigurasi

### Environment Variables
- `FLASK_ENV`: development/production
- `SECRET_KEY`: Flask secret key
- `OPENAI_API_KEY`: OpenAI API key (jika diperlukan)

### WebSocket Configuration
- Default port: 5000 (backend), 5174 (frontend dev)
- CORS: Enabled untuk semua origins
- Transport: WebSocket + polling fallback

## 🎯 Penggunaan

1. **Akses aplikasi** di browser
2. **Mulai chat** dengan mengetik pesan di input field
3. **Monitor status** agent di panel kanan
4. **Gunakan fitur** seperti:
   - "Help me write some code"
   - "Search the web for information"
   - "Generate an image"
   - "Analyze some data"

## 🔌 API Endpoints

### REST API
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/send` - Send message
- `GET /api/agent/status` - Get agent status

### WebSocket Events
- `connect` - Client connection
- `send_message` - Send chat message
- `message_response` - Receive agent response
- `agent_status_update` - Agent status updates

## 🧩 Komponen Utama

### Frontend Components
- `ChatInterface` - Main chat interface
- `MessageBubble` - Individual message display
- `AgentStatus` - Agent monitoring panel
- `Sidebar` - Navigation and menu
- `Header` - Top navigation bar

### Backend Services
- `AgentService` - Core agent logic
- `DyorAgent` - OpenManus wrapper
- `SocketEvents` - WebSocket event handlers

## 🚀 Deployment

Aplikasi telah di-deploy menggunakan Manus deployment service:
- **URL**: https://3dhkilcjm57o.manus.space
- **Framework**: Flask backend dengan frontend terintegrasi
- **Hosting**: Manus Cloud Platform

## 🔮 Roadmap

- [ ] Integrasi penuh dengan OpenManus capabilities
- [ ] File upload dan management
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Plugin system
- [ ] Advanced agent configurations

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 👥 Tim Pengembang

Dikembangkan dengan ❤️ menggunakan OpenManus framework.

---

**Dyor AI** - Bringing AI capabilities to everyone through an intuitive and powerful interface.

