const express = require('express');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/report', express.static(path.join(__dirname, '../playwright-report')));

let activeTestProcess = null;
let currentRunStatus = {
  running: false,
  suite: null,
  logs: [],
  exitCode: null,
  startTime: null,
  duration: 0
};

// GET status
app.get('/api/status', (req, res) => {
  res.json(currentRunStatus);
});

// POST run tests
app.post('/api/run', (req, res) => {
  const { target } = req.body; // 'all', 'smoke', 'e2e', 'api', 'saucedemo'
  if (currentRunStatus.running) {
    return res.status(400).json({ error: 'A test run is already in progress' });
  }

  let testArgs = ['playwright', 'test'];
  if (target === 'smoke') testArgs.push('tests/smoke');
  else if (target === 'e2e') testArgs.push('tests/e2e');
  else if (target === 'api') testArgs.push('tests/api');
  else if (target === 'saucedemo') testArgs.push('tests/e2e/saucedemo-live.spec.ts');
  testArgs.push('--project=chromium');

  const fullCmd = `npx ${testArgs.join(' ')}`;

  currentRunStatus = {
    running: true,
    suite: target,
    logs: [`🚀 Starting test execution: ${fullCmd} ...\n`],
    exitCode: null,
    startTime: Date.now(),
    duration: 0
  };

  try {
    activeTestProcess = spawn(fullCmd, {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, FORCE_COLOR: '1' },
      shell: true
    });

    activeTestProcess.stdout.on('data', (data) => {
      currentRunStatus.logs.push(data.toString());
    });

    activeTestProcess.stderr.on('data', (data) => {
      currentRunStatus.logs.push(data.toString());
    });

    activeTestProcess.on('error', (err) => {
      currentRunStatus.running = false;
      currentRunStatus.logs.push(`\n❌ Process error: ${err.message}\n`);
      activeTestProcess = null;
    });

    activeTestProcess.on('close', (code) => {
      currentRunStatus.running = false;
      currentRunStatus.exitCode = code;
      currentRunStatus.duration = ((Date.now() - currentRunStatus.startTime) / 1000).toFixed(1);
      currentRunStatus.logs.push(`\n🏁 Test run finished with exit code ${code} (Duration: ${currentRunStatus.duration}s)\n`);
      activeTestProcess = null;
    });

    res.json({ message: `Started test run for "${target}"` });
  } catch (err) {
    currentRunStatus.running = false;
    currentRunStatus.logs.push(`\n❌ Failed to start test process: ${err.message}\n`);
    res.status(500).json({ error: err.message });
  }
});

// GET Framework Metrics
app.get('/api/metrics', (req, res) => {
  res.json({
    framework: 'Playwright + TypeScript POM',
    version: '1.49.0',
    totalSuites: 6,
    totalTestCases: 27,
    modules: ['Authentication', 'Catalog & Filters', 'Cart & Coupons', 'Checkout & Orders', 'REST API', 'Visual Regression', 'SauceDemo Benchmark'],
    browsers: ['Chromium', 'Firefox', 'WebKit', 'Mobile Chrome (Pixel 7)', 'Mobile Safari (iPhone 14)'],
    features: ['Page Object Model (POM)', 'REST API Client', 'Faker.js Data Generation', 'Trace Viewer & Video', 'Auto-Starting Mock Server']
  });
});

const server = app.listen(PORT, () => {
  console.log(`📊 E-Commerce Test Automation Dashboard running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use.`);
  } else {
    console.error('Dashboard server error', err);
  }
});
