- **Frontend:** https://xenon-invoices-frontend.vercel.app
- **Backend API:** https://xenon-invoices-backend.railway.app

## Deployment Status

### Backend (Railway)
- ✅ Rails API deployed
- ✅ PostgreSQL database configured
- ✅ Environment variables set
- ✅ CORS configured for frontend

### Frontend (Vercel)
- ✅ React app deployed
- ✅ API URL configured
- ✅ Build optimized for production

## Health Check

Test the deployment:
```bash
# Backend health
curl https://xenon-invoices-backend.railway.app/api/v1/invoices

# Frontend
open https://xenon-invoices-frontend.vercel.app
```

## Local Development

### Backend Setup
```bash
cd Backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3000
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/v1/invoices` - List all invoices
- `POST /api/v1/invoices/upload` - Upload XML invoices
- `POST /api/v1/invoices/:id/generate_payment_complement` - Generate payment complement
- `GET /api/v1/invoices/:id/download/pdf` - Download PDF
- `GET /api/v1/invoices/:id/download/xml` - Download XML
