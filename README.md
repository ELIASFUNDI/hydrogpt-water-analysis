# 🌊 HydroGPT - AI-Powered Water Accessibility Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-18.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)

> **Advanced water accessibility analysis system for Mbeere South Subcounty, Kenya using SCM-G2SFCA methodology and AI-powered spatial intelligence.**

## 🎯 Overview

HydroGPT is a comprehensive water accessibility analysis platform that combines:
- **AI-Powered Analysis**: Claude API integration for intelligent query processing
- **Advanced GIS**: Interactive maps with real-time data visualization
- **Scientific Methodology**: SCM-G2SFCA (Supply Competition Multiple-modal Gaussian 2-step Floating Catchment Area)
- **Multi-Modal Transport**: Walking, animal, and driving accessibility analysis

## ✨ Features

### 🤖 AI Spatial Intelligence
- Natural language query processing
- Intelligent map control and highlighting
- Proactive suggestions and insights
- Context-aware responses with spatial relationships

### 🗺️ Interactive Mapping
- Real-time sublocation boundary visualization
- Water point capacity analysis
- Color-coded accessibility categories
- Smart zooming and area highlighting

### 📊 Dynamic Visualizations
- Accessibility rankings and comparisons
- Population impact analysis
- Statistical summaries and breakdowns
- AI-generated targeted charts

### 📋 Accessibility Classification
- **Very Weak (0-1.0)**: Critical intervention required
- **Weak (1.0-1.2)**: Priority improvement needed
- **Good (1.2-1.5)**: Acceptable access levels
- **Very Good (1.5+)**: Optimal water accessibility

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │  PostgreSQL+GIS │
│                 │◄──►│                 │◄──►│                 │
│ • Interactive UI │    │ • AI Processing │    │ • Spatial Data  │
│ • Maps & Charts │    │ • Claude API    │    │ • Statistics    │
│ • Real-time Chat│    │ • Data Analysis │    │ • Water Points  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/hydrogpt.git
cd hydrogpt

# Configure environment
cp .env.existing-db .env
# Edit .env with your API keys and database URL

# Start with existing database
docker-compose -f docker-compose.existing-db.yml up -d

# Or start with fresh database
cp .env.production .env
docker-compose up -d
```

### Manual Setup

**Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend Setup:**
```bash
cd frontend/hydrogpt-frontend
npm install
npm start
```

## 🌐 Deployment

### Production Hosting Options

1. **Railway + Vercel (Recommended)**
   - Backend: Railway (auto-deploys from GitHub)
   - Frontend: Vercel (static hosting)
   - Database: Railway PostgreSQL or external

2. **Docker Deployment**
   - DigitalOcean/AWS/GCP droplet
   - Complete infrastructure control
   - Full-stack Docker containers

3. **Cloud Providers**
   - AWS ECS/EKS
   - Google Cloud Run
   - Azure Container Instances

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
ANTHROPIC_API_KEY=your_claude_api_key
DATABASE_URL=postgresql://user:pass@host:port/dbname
CORS_ORIGINS=https://yourdomain.com
PORT=8000
HOST=0.0.0.0
```

**Frontend (.env.production)**
```bash
REACT_APP_API_URL=https://your-backend-url.com
GENERATE_SOURCEMAP=false
```

## 📊 Database Schema

### Required Tables
- **sublocations**: Geographic boundaries with accessibility scores
- **sublocation_statistics**: Pre-computed analytics and population data
- **waterpoints**: Water infrastructure with capacity ratings

### Extensions
- PostGIS for spatial data handling
- Support for EPSG:21037 coordinate system

## 🔍 Usage Examples

### Natural Language Queries
```
"Which areas have the worst water access?"
"Show me Makima on the map"
"Compare walking vs driving accessibility"
"How many people need urgent intervention?"
"Generate accessibility statistics for northern areas"
```

### AI Map Control
- Automatic area highlighting
- Smart zoom to relevant locations
- Context-aware popup display
- Interactive filtering and visualization

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **AsyncPG**: High-performance PostgreSQL driver
- **Anthropic Claude**: AI language model integration
- **Pydantic**: Data validation and serialization

### Frontend
- **React 18**: Modern UI framework
- **Leaflet**: Interactive mapping library
- **Axios**: HTTP client for API communication
- **Recharts**: Data visualization components

### Infrastructure
- **PostgreSQL + PostGIS**: Spatial database
- **Docker**: Containerization
- **Nginx**: Production web server
- **GitHub Actions**: CI/CD pipeline

## 🔒 Security

- Environment variable protection
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- API rate limiting
- Secure database connections

## 📈 Performance

- Async/await throughout the stack
- Database connection pooling
- Optimized spatial queries
- Frontend code splitting
- CDN-ready static assets
- Gzip compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SCM-G2SFCA Methodology**: Advanced spatial accessibility analysis
- **Mbeere South Subcounty**: Geographic focus area
- **Anthropic Claude**: AI-powered natural language processing
- **PostGIS Community**: Spatial database extensions
- **Open Source Contributors**: React, FastAPI, and Leaflet communities

## 📞 Support

- 📧 Email: support@hydrogpt.com
- 📖 Documentation: [docs.hydrogpt.com](https://docs.hydrogpt.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/hydrogpt/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/hydrogpt/discussions)

---

**Built with ❤️ for water accessibility planning and emergency response.**