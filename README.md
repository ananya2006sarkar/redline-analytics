# Redline Analytics Dashboard

A **real-time analytics dashboard with embedded ETL pipeline** for processing and visualizing streaming event data.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Node.js](https://img.shields.io/badge/node.js-v18+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Project Overview

**Redline Analytics** is an enterprise-grade analytics platform built to demonstrate:
- **Real-time data processing** with WebSocket streaming
- **ETL pipeline implementation** (Extract, Transform, Load)
- **Modern web architecture** with Express backend & vanilla JS frontend
- **Data visualization** using Chart.js
- **Responsive design** with progressive enhancement

Perfect for companies analyzing customer behavior, tracking KPIs, and making data-driven decisions.

## ✨ Key Features

### Backend
- ✅ **Express.js REST API** with CORS support
- ✅ **Server-Sent Events (SSE)** for real-time data streaming
- ✅ **ETL Pipeline** - Generate, Transform, Load events automatically
- ✅ **In-memory data storage** with event queue management
- ✅ **Health check endpoints** for monitoring
- ✅ **Automatic metric calculation** from event streams

### Frontend
- ✅ **Interactive Dashboard** with 5+ metric cards
- ✅ **Real-time charts** (Trend line, Traffic sources doughnut)
- ✅ **Live event stream** with 50-event buffer
- ✅ **Responsive design** - Works on desktop, tablet, mobile
- ✅ **Dark gradient theme** with glass-morphism effects
- ✅ **Zero external dependencies** (except Chart.js)

### Data Pipeline
- ✅ Generates 500ms event intervals
- ✅ Simulates real user behaviors (page views, clicks, conversions)
- ✅ Tracks multiple dimensions (device, source, page, action)
- ✅ Calculates KPIs: conversion rate, bounce rate, session duration
- ✅ Maintains 48-hour historical data for trends

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/redline-analytics.git
cd redline-analytics

# Install dependencies
npm install

# Start the server
npm start
```

Server will start at `http://localhost:5001`

### Development Mode

```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

## 📊 API Endpoints

### Metrics
```
GET /api/metrics
```
Returns current KPI values:
```json
{
  "totalSessions": 24567,
  "uniqueVisitors": 18234,
  "avgSessionDuration": 287,
  "conversionRate": "3.45",
  "bounceRate": "42.15"
}
```

### Hourly Data
```
GET /api/hourly-data
```
Returns 48 hours of historical metrics for trend visualization.

### Traffic Sources
```
GET /api/source-data
```
Returns performance metrics by traffic source (Organic, Paid, Social, etc).

### Live Events
```
GET /api/events?limit=50
```
Returns recent events processed by the pipeline.

### Health Check
```
GET /api/health
```
Server status and processing statistics.

### Real-time Stream
```
GET /api/stream
```
Server-Sent Events stream for real-time dashboard updates.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│             Frontend (HTML/CSS/JS)                   │
│    - Dashboard UI with Chart.js visualization        │
│    - Real-time WebSocket connection                  │
│    - Responsive metric cards & live event log        │
└─────────────┬───────────────────────────────────────┘
              │ HTTP REST + SSE
┌─────────────▼───────────────────────────────────────┐
│       Express.js Backend (server.js)                 │
│  ┌──────────────────────────────────────────────┐   │
│  │  API Routes & REST Endpoints                 │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  ETL Pipeline                                │   │
│  │  - Event Generation (500ms interval)         │   │
│  │  - Data Transformation & Enrichment          │   │
│  │  - Metric Calculation & Aggregation          │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Real-time Broadcasting                      │   │
│  │  - SSE to connected clients                  │   │
│  │  - Metric updates                            │   │
│  │  - Live event streams                        │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
redline-analytics/
├── server.js                 # Main Express server & ETL logic
├── package.json             # Dependencies
├── public/
│   └── index.html          # Dashboard UI (HTML + CSS + JS 
├── tests/
│   └── test.js             # Unit & integration tests
├── README.md               # This file
├── .gitignore              # Git ignore rules
```

## 🔄 ETL Pipeline Details

### Extract
Events are generated every 500ms with realistic attributes:
- User ID, Session ID, Timestamp
- Traffic source (Organic, Paid, Social, etc)
- Page visited
- Device type
- User action (page_view, click, scroll, add_to_cart, purchase)
- Session duration

### Transform
Each event undergoes transformation:
- Timestamp enrichment (extract hour, day)
- Add processing flags
- Confidence scoring
- Data validation

### Load
Events are loaded into in-memory data store:
- Stored in event queue (max 1000 events)
- Aggregate metrics calculated
- Real-time broadcast to all connected clients

## 📈 Performance Metrics

**Dashboard calculates:**
- **Total Sessions** - Count of unique sessions in 48h window
- **Unique Visitors** - Estimated from session data
- **Avg Session Duration** - Mean duration across all sessions (seconds)
- **Conversion Rate** - Percentage of sessions with purchases
- **Bounce Rate** - Percentage of single-page sessions

**Visualization:**
- Trend chart showing visitors & conversions over 48 hours
- Traffic source breakdown (doughnut chart)
- Source performance table with bounce rates

## 🧪 Testing

```bash
npm test
```

Test coverage includes:
- API endpoint functionality
- ETL pipeline transformation logic
- Real-time broadcasting
- Data validation

## 🛠️ Technology Stack

**Backend:**
- Node.js 18+
- Express.js 4.18
- CORS for cross-origin requests
- UUID for unique identifiers

**Frontend:**
- HTML5
- CSS3 (Grid, Flexbox, Gradients)
- Vanilla JavaScript (ES6+)
- Chart.js 4.4 for data visualization
- Server-Sent Events API

**Deployment Ready:**
- Stateless design (can scale horizontally)
- Environment-based configuration
- Health check endpoint
- Error handling & logging

## 🚢 Deployment

### Local
```bash
npm start
# Runs on localhost:5001
```

### Production
```bash
NODE_ENV=production npm start
```

### Docker (Optional)
```bash
docker build -t redline-analytics .
docker run -p 5000:5000 redline-analytics
```

## 📝 Environment Variables

```env
PORT=5000                    # Server port
NODE_ENV=production         # Environment mode
```

## 🔐 Security Considerations

- ✅ CORS properly configured
- ✅ Input validation on all APIs
- ✅ No sensitive data in events
- ✅ Rate limiting ready (can add)
- ✅ XSS protection via Content Security Policy (optional)

## 📖 Learning Resources

**Understanding the Code:**
1. Start with `server.js` - See the overall structure
2. Review the `ETLPipeline` class - Understand the transformation logic
3. Check the frontend `setupCharts()` function - See data visualization
4. Examine `broadcastUpdate()` - Real-time mechanism

**Key Concepts:**
- **Server-Sent Events** - One-way real-time communication from server to client
- **Event-Driven Architecture** - Components react to data changes
- **Pipeline Pattern** - Data moves through Extract → Transform → Load stages
- **Responsive Web Design** - Mobile-first CSS approach

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- [ ] Database persistence (MongoDB, PostgreSQL)
- [ ] Advanced filtering & search
- [ ] Custom metric builders
- [ ] Alert system
- [ ] User authentication
- [ ] Webhooks integration

## ⚡ Next Steps

1. **Run locally** - `npm start`
2. **Explore the dashboard** - Visit `http://localhost:5001`
3. **Check the API** - Visit `http://localhost:5000/api/metrics`
4. **Study the code** - Review `server.js` and `public/index.html`
5. **Deploy** - Push to GitHub and deploy to Heroku, Railway, or Vercel
---
