#!/bin/bash

echo "========================================"
echo "    Dyor AI Installation Script"
echo "    macOS/Linux Version"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed"
    echo "Please install Python 3.11+ from https://python.org/downloads"
    echo "Or use your package manager:"
    echo "  Ubuntu/Debian: sudo apt install python3 python3-pip python3-venv"
    echo "  macOS: brew install python3"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 20+ from https://nodejs.org/download"
    echo "Or use your package manager:"
    echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "  macOS: brew install node"
    exit 1
fi

print_success "Python and Node.js are installed"
echo

# Create project directory
echo "Creating project directory..."
mkdir -p dyor-ai
cd dyor-ai

# Download or clone source code
echo "Downloading source code..."
if [ -d ".git" ]; then
    print_warning "Updating existing repository..."
    git pull
else
    echo "Cloning repository..."
    git clone https://github.com/FoundationAgents/OpenManus.git .
    if [ $? -ne 0 ]; then
        print_error "Failed to clone repository"
        echo "Please check your internet connection"
        exit 1
    fi
fi

# Setup backend
echo
echo "Setting up backend..."
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    print_error "Failed to create virtual environment"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    print_error "Failed to install Python dependencies"
    exit 1
fi

# Setup frontend
echo
echo "Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install Node.js dependencies"
    exit 1
fi

# Build frontend
echo "Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi

# Copy build to backend static
echo "Copying frontend build to backend..."
cp -r dist/* ../backend/src/static/
if [ $? -ne 0 ]; then
    print_error "Failed to copy frontend build"
    exit 1
fi

# Create startup script
echo
echo "Creating startup script..."
cd ..
cat > start-dyor-ai.sh << 'EOF'
#!/bin/bash

echo "Starting Dyor AI..."
cd "$(dirname "$0")/backend"
source venv/bin/activate

echo "Dyor AI is starting..."
echo "Open your browser and go to: http://localhost:5000"

# Wait a moment then open browser
sleep 3 &
SLEEP_PID=$!

# Try to open browser
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5000 &
elif command -v open &> /dev/null; then
    open http://localhost:5000 &
fi

wait $SLEEP_PID

# Start the server
python src/main.py
EOF

chmod +x start-dyor-ai.sh

# Create desktop entry for Linux
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Creating desktop entry..."
    DESKTOP_FILE="$HOME/Desktop/Dyor AI.desktop"
    cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Dyor AI
Comment=Your Personal AI Assistant
Exec=$PWD/start-dyor-ai.sh
Icon=$PWD/backend/src/static/favicon.ico
Terminal=true
Categories=Development;
EOF
    chmod +x "$DESKTOP_FILE"
fi

# Create alias for easy access
echo
echo "Creating shell alias..."
SHELL_RC=""
if [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
elif [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
fi

if [ -n "$SHELL_RC" ]; then
    echo "alias dyor-ai='$PWD/start-dyor-ai.sh'" >> "$SHELL_RC"
    print_success "Added 'dyor-ai' alias to $SHELL_RC"
fi

echo
echo "========================================"
echo "    Installation Complete!"
echo "========================================"
echo
print_success "Dyor AI has been successfully installed!"
echo
echo "To start Dyor AI:"
echo "1. Run: ./start-dyor-ai.sh"
echo "2. Or use alias: dyor-ai (after restarting terminal)"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "3. Or double-click 'Dyor AI' on your desktop"
fi
echo "4. Or manually: cd backend && source venv/bin/activate && python src/main.py"
echo
echo "The application will open in your browser at:"
echo "http://localhost:5000"
echo
echo "Starting Dyor AI now..."
sleep 3
./start-dyor-ai.sh

