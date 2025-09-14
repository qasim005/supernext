// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // The port our server will run on

// --- Middleware ---
app.use(cors()); // Allow requests from our frontend
app.use(bodyParser.json()); // Allow the server to read JSON from requests

// --- In-Memory Database Simulation ---
// In a real app, this data would come from a database like PostgreSQL or MongoDB.
// For now, we'll store it in a simple array.
let vouchers = [];
let nextVoucherId = 1;

// --- Helper Functions ---
const generateVoucherCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const createInitialVouchers = () => {
  console.log('Generating initial set of 50 mock vouchers...');
  const initialVouchers = [];
  const statuses = ['Active', 'Pending', 'Expired', 'Suspended'];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const status = statuses[i % statuses.length];
    const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    initialVouchers.push({
      id: (nextVoucherId++).toString(),
      code: generateVoucherCode(),
      status: status,
      validity: '30d',
      speedLimit: '10 Mbps',
      createdAt: createdAt,
      expiresAt: new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000),
      batch: `Initial-Batch`,
      deviceLimit: 1,
    });
  }
  vouchers = initialVouchers;
  console.log('Initial vouchers created.');
};


// --- API Endpoints ---

// GET /api/vouchers - Fetches all vouchers
app.get('/api/vouchers', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/vouchers - Responded with ${vouchers.length} vouchers.`);
  // Sort by creation date descending to show newest first
  const sortedVouchers = [...vouchers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.status(200).json(sortedVouchers);
});

// POST /api/vouchers - Generates a new batch of vouchers
app.post('/api/vouchers', (req, res) => {
  const { count, validity, speedLimit, deviceLimit, batch } = req.body;

  if (!count) {
    return res.status(400).json({ message: 'Missing required field: count' });
  }

  console.log(`[${new Date().toISOString()}] POST /api/vouchers - Generating ${count} vouchers for batch "${batch}"...`);
  
  const newVouchers = [];
  const now = new Date();
  
  for(let i = 0; i < count; i++) {
    // Logic to parse validity string like '7d', '15d', '30d'
    const validityDays = parseInt(validity.replace('d', '')) || 30; // Default to 30 days if parse fails
    const createdAt = new Date();

    newVouchers.push({
      id: (nextVoucherId++).toString(),
      code: generateVoucherCode(),
      status: 'Pending', // New vouchers are always 'Pending'
      validity: validity,
      speedLimit: speedLimit,
      createdAt: createdAt,
      expiresAt: new Date(createdAt.getTime() + validityDays * 24 * 60 * 60 * 1000),
      batch: batch || `Batch-${new Date().toISOString().slice(0,10)}`,
      deviceLimit: deviceLimit,
    });
  }

  vouchers.unshift(...newVouchers); // Add to the beginning of the array
  console.log(`[${new Date().toISOString()}] POST /api/vouchers - Successfully added ${count} new vouchers.`);
  res.status(201).json(newVouchers);
});

// Helper function for status updates
const updateVoucherStatus = (req, res, newStatus) => {
    const { voucherIds } = req.body;
    if (!voucherIds || !Array.isArray(voucherIds)) {
        return res.status(400).json({ message: 'voucherIds must be an array.' });
    }
    
    console.log(`[${new Date().toISOString()}] POST /api/vouchers/* - Updating status to ${newStatus} for ${voucherIds.length} vouchers.`);
    
    let updatedCount = 0;
    vouchers = vouchers.map(v => {
        if (voucherIds.includes(v.id)) {
            updatedCount++;
            return { ...v, status: newStatus };
        }
        return v;
    });

    res.status(200).json({ message: `Successfully updated ${updatedCount} vouchers to ${newStatus}.` });
};

// POST /api/vouchers/activate
app.post('/api/vouchers/activate', (req, res) => {
    updateVoucherStatus(req, res, 'Active');
});

// POST /api/vouchers/suspend
app.post('/api/vouchers/suspend', (req, res) => {
    updateVoucherStatus(req, res, 'Suspended');
});

// POST /api/vouchers/archive
app.post('/api/vouchers/archive', (req, res) => {
    updateVoucherStatus(req, res, 'Archived');
});

// POST /api/vouchers/delete - Using POST for body as per frontend hook
app.post('/api/vouchers/delete', (req, res) => {
    const { voucherIds } = req.body;
    if (!voucherIds || !Array.isArray(voucherIds)) {
        return res.status(400).json({ message: 'voucherIds must be an array.' });
    }

    console.log(`[${new Date().toISOString()}] POST /api/vouchers/delete - Deleting ${voucherIds.length} vouchers.`);
    
    const initialLength = vouchers.length;
    vouchers = vouchers.filter(v => !voucherIds.includes(v.id));
    const deletedCount = initialLength - vouchers.length;

    res.status(200).json({ message: `Successfully deleted ${deletedCount} vouchers.` });
});


// --- Server Startup ---
createInitialVouchers(); // Create mock data on start

const server = app.listen(port, () => {
  console.log(`✅ SuperNext Backend Server is running at http://localhost:${port}`);
  console.log('Waiting for requests from the frontend...');
});

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`Error: ${bind} requires elevated privileges.`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Error: ${bind} is already in use by another application.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
