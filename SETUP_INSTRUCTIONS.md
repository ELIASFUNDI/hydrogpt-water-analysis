# HydroGPT Setup Instructions (WSL + Windows PostgreSQL)

## Current Status
- ✅ Backend code configured for Windows PostgreSQL connection (172.26.16.1:5432)
- ❌ PostgreSQL not accessible from WSL
- ❌ Python dependencies not installed

## Step 1: Configure PostgreSQL on Windows

### 1.1 Find PostgreSQL Configuration Files
In Windows Command Prompt:
```cmd
psql -U postgres -c "SHOW config_file;"
```
This shows the path to `postgresql.conf`. The same directory contains `pg_hba.conf`.

### 1.2 Edit postgresql.conf
Find this line:
```
#listen_addresses = 'localhost'
```
Change to:
```
listen_addresses = '*'
```

### 1.3 Edit pg_hba.conf
Add these lines at the end:
```
# WSL connections
host    hydrogpt    postgres    172.26.0.0/16    md5
host    all         postgres    172.26.0.0/16    md5
```

### 1.4 Restart PostgreSQL Service
- Open Windows Services (`services.msc`)
- Find "PostgreSQL" service
- Right-click → Restart

### 1.5 Configure Windows Firewall
Run PowerShell as Administrator:
```powershell
New-NetFirewallRule -DisplayName "PostgreSQL WSL" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow
```

## Step 2: Install Python Dependencies in WSL

### 2.1 Install pip and venv (if needed)
```bash
# If you have sudo access:
sudo apt update
sudo apt install python3-pip python3-venv

# Or install to user directory without sudo:
curl -sS https://bootstrap.pypa.io/get-pip.py | python3 --user
```

### 2.2 Create Virtual Environment
```bash
cd /home/elias/projects/Hydrogpt/backend
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Install Dependencies
```bash
pip install -r requirements.txt
```

### 2.4 Set Environment Variables
Create `.env` file:
```bash
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
echo "DATABASE_URL=postgresql://postgres:%4092201418Ef@172.26.16.1:5432/hydrogpt" >> .env
```

**Database Connection Parameters:**
- Host: 172.26.16.1
- Port: 5432
- Database: hydrogpt
- Username: postgres
- Password: @92201418Ef (URL-encoded as %4092201418Ef)

## Step 3: Test Connection

### 3.1 Test Database Connection
```bash
python3 test_connection.py
```

### 3.2 Start Backend Server
```bash
# With virtual environment activated:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Step 4: Start Frontend

### 4.1 Install Node Dependencies
```bash
cd /home/elias/projects/Hydrogpt/frontend/hydrogpt-frontend
npm install
```

### 4.2 Start React Development Server
```bash
npm start
```

## Expected Results
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- Database: Connected to Windows PostgreSQL
- Map: Displays actual sublocation data from database
- Chat: AI-powered responses using Claude API

## Troubleshooting

### Database Connection Issues
1. Check PostgreSQL is running on Windows
2. Verify firewall allows port 5432
3. Test connection: `telnet 172.26.16.1 5432`
4. Check PostgreSQL logs for connection errors

### Python Dependency Issues
1. Try system packages: `apt install python3-asyncpg python3-fastapi`
2. Use conda/miniconda if available
3. Install without virtual environment (not recommended)

### WSL Network Issues
1. Restart WSL: `wsl --shutdown` (in Windows)
2. Check WSL IP: `ip route show | grep default`
3. Update database connection string if IP changed