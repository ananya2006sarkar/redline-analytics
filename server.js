import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============ DATA STORAGE ============
let analyticsData = {
  metrics: {
    totalSessions: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    conversionRate: 0,
    bounceRate: 0
  },
  events: [],
  hourlyData: [],
  sourceData: []
};

// Initialize with sample data
function initializeData() {
  const sources = ['Organic', 'Paid Search', 'Social', 'Direct', 'Referral'];
  const devices = ['Desktop', 'Mobile', 'Tablet'];
  const pages = ['/home', '/products', '/pricing', '/about', '/contact'];

  // Generate 48 hours of data
  for (let i = 47; i >= 0; i--) {
    const date = new Date();
    date.setHours(date.getHours() - i);
    
    const visitors = Math.floor(Math.random() * 500) + 100;
    const sessionDuration = Math.floor(Math.random() * 600) + 60;
    const conversions = Math.floor(visitors * (Math.random() * 0.08 + 0.02));

    analyticsData.hourlyData.push({
      timestamp: date.toISOString(),
      visitors,
      pageViews: visitors * (Math.random() * 3 + 1),
      conversions,
      bounceRate: Math.random() * 0.6 + 0.2,
      avgSessionDuration: sessionDuration
    });
  }

  // Generate source data
  sources.forEach(source => {
    analyticsData.sourceData.push({
      name: source,
      users: Math.floor(Math.random() * 2000) + 500,
      sessions: Math.floor(Math.random() * 3000) + 1000,
      bounceRate: Math.random() * 0.7 + 0.1,
      conversionRate: Math.random() * 0.08 + 0.01
    });
  });

  // Calculate summary metrics
  const allVisitors = analyticsData.hourlyData.reduce((sum, h) => sum + h.visitors, 0);
  const allConversions = analyticsData.hourlyData.reduce((sum, h) => sum + h.conversions, 0);
  const avgDuration = analyticsData.hourlyData.reduce((sum, h) => sum + h.avgSessionDuration, 0) / analyticsData.hourlyData.length;
  const avgBounce = analyticsData.hourlyData.reduce((sum, h) => sum + h.bounceRate, 0) / analyticsData.hourlyData.length;

  analyticsData.metrics = {
    totalSessions: allVisitors,
    uniqueVisitors: Math.floor(allVisitors * 0.7),
    avgSessionDuration: Math.floor(avgDuration),
    conversionRate: (allConversions / allVisitors * 100).toFixed(2),
    bounceRate: (avgBounce * 100).toFixed(2)
  };
}

class ETLPipeline {
  static generateEvent() {
    const sources = ['Organic', 'Paid Search', 'Social', 'Direct', 'Referral'];
    const pages = ['/home', '/products', '/pricing', '/about', '/contact'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const actions = ['page_view', 'click', 'scroll', 'add_to_cart', 'purchase'];

    return {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      userId: 'user_' + Math.floor(Math.random() * 10000),
      sessionId: 'session_' + Math.floor(Math.random() * 5000),
      source: sources[Math.floor(Math.random() * sources.length)],
      page: pages[Math.floor(Math.random() * pages.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      duration: Math.floor(Math.random() * 300),
      converted: Math.random() > 0.95
    };
  }

  static transformEvent(event) {
    return {
      ...event,
      hour: new Date(event.timestamp).getHours(),
      day: new Date(event.timestamp).toLocaleDateString(),
      processed: true,
      confidence: 0.98
    };
  }

  static loadEvent(event) {
    analyticsData.events.push(event);
    if (analyticsData.events.length > 1000) {
      analyticsData.events.shift();
    }
    
    const recentEvents = analyticsData.events.slice(-100);
    const conversions = recentEvents.filter(e => e.converted).length;
    analyticsData.metrics.conversionRate = ((conversions / recentEvents.length) * 100).toFixed(2);
  }
}
app.get('/api/metrics', (req, res) => {
  res.json(analyticsData.metrics);
});

app.get('/api/hourly-data', (req, res) => {
  res.json(analyticsData.hourlyData);
});

app.get('/api/source-data', (req, res) => {
  res.json(analyticsData.sourceData);
});

app.get('/api/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(analyticsData.events.slice(-limit).reverse());
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    eventsProcessed: analyticsData.events.length
  });
});

// Serve the dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============ REAL-TIME DATA STREAM ============
let clients = [];

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  clients.push(res);

  // Send initial data
  res.write(`data: ${JSON.stringify({ type: 'init', data: analyticsData.metrics })}\n\n`);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

function broadcastUpdate(event) {
  clients.forEach(res => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });
}

// ============ DATA GENERATION ============
setInterval(() => {
  const event = ETLPipeline.generateEvent();
  const transformedEvent = ETLPipeline.transformEvent(event);
  ETLPipeline.loadEvent(transformedEvent);

  broadcastUpdate({
    type: 'event',
    data: transformedEvent
  });

  // Update metrics every 10 events
  if (analyticsData.events.length % 10 === 0) {
    broadcastUpdate({
      type: 'metrics',
      data: analyticsData.metrics
    });
  }
}, 500);

// ============ SERVER ============
app.listen(PORT, () => {
  initializeData();
  console.log(`
╔════════════════════════════════════════╗
║   Redline Analytics Dashboard Started  ║
║   Server running at http://localhost:${PORT}         ║
║   Dashboard at http://localhost:${PORT}              ║
╚════════════════════════════════════════╝
  `);
});

export default app;