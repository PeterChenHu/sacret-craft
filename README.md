# 🏛️ Sacred Craft Marketplace

A full-stack e-commerce platform built with Django (backend) and React + TypeScript (frontend).

## 📁 Project Structure

```
sacred-craft-marketplace/
├── frontend/                 # React + TypeScript frontend
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.mts      # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── tsconfig*.json       # TypeScript configuration
├── backend/                  # Django backend
│   ├── sacred_crafts/       # Django project
│   ├── users/               # User management app
│   ├── products/            # Product management app
│   ├── orders/              # Order management app
│   ├── faq/                 # FAQ management app
│   ├── requirements.txt     # Python dependencies
│   └── manage.py            # Django management script
├── pipeline/                 # CI/CD and deployment
│   ├── .github/             # GitHub Actions workflows
│   ├── scripts/             # Deployment scripts
│   ├── Dockerfile           # Docker configuration
│   ├── docker-compose.yml   # Docker Compose setup
│   ├── nginx.conf           # Nginx configuration
│   └── DEPLOYMENT.md        # Deployment documentation
├── package.json              # Root package.json with scripts
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd sacred-craft-marketplace
   ```

2. **Install dependencies:**
   ```bash
   npm run setup
   ```

3. **Start development servers:**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   npm run dev              # Frontend (http://localhost:5173)
   npm run backend:dev      # Backend (http://localhost:8000)
   ```

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linting

#### Backend
- `npm run backend:dev` - Start Django development server
- `npm run backend:migrate` - Run database migrations
- `npm run backend:makemigrations` - Create new migrations
- `npm run backend:collectstatic` - Collect static files
- `npm run backend:shell` - Open Django shell
- `npm run backend:createsuperuser` - Create admin user

#### Docker
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run docker:logs` - View Docker logs

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Context** for state management
- **i18next** for internationalization

### Backend
- **Django 4.2** with Django REST Framework
- **PostgreSQL** database
- **Redis** for caching
- **JWT** authentication
- **Django CORS** for cross-origin requests

## 🚀 Deployment

### Automated Deployment (GitHub Actions)
1. Push to `dev` branch
2. GitHub Actions automatically:
   - Runs tests
   - Builds frontend
   - Deploys to Ubuntu server

### Manual Deployment
See [DEPLOYMENT.md](pipeline/DEPLOYMENT.md) for detailed instructions.

### Docker Deployment
```bash
cd pipeline
docker-compose up -d --build
```

## 🌍 Internationalization

The platform supports multiple languages:
- English (en)
- Chinese (zh)

Language files are located in `frontend/src/i18n/`.

## 🔧 Configuration

### Frontend
- Environment variables in `frontend/.env`
- Vite configuration in `frontend/vite.config.mts`
- TypeScript configuration in `frontend/tsconfig*.json`

### Backend
- Environment variables in `backend/.env`
- Django settings in `backend/sacred_crafts/settings.py`
- Database configuration in `backend/.env`

## 📚 Documentation

- [Deployment Guide](pipeline/DEPLOYMENT.md)
- [API Documentation](backend/README.md)
- [Frontend Components](frontend/src/components/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check logs: `pipeline/logs/`
- Service status: `sudo systemctl status sacred-craft-*`
- GitHub Issues: [Repository Issues](https://github.com/your-username/sacred-craft-marketplace/issues)

---

**Happy Coding! 🎉**
