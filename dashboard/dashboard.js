let pollingInterval = null;

// Tab Navigation
function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const activeTab = document.getElementById(`tab-${tabId}`);
  if (activeTab) activeTab.classList.add('active');

  const navLink = document.querySelector(`.nav-item[href="#${tabId}"]`);
  if (navLink) navLink.classList.add('active');
}

// Trigger Test Run
async function triggerTestRun(suiteName) {
  switchTab('runner');

  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const consoleOutput = document.getElementById('consoleOutput');

  statusDot.className = 'status-dot running';
  statusText.textContent = `Status: Running (${suiteName.toUpperCase()})...`;
  consoleOutput.textContent = `⚡ Triggering execution for "${suiteName}" suite...\n`;

  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: suiteName })
    });

    const data = await res.json();
    if (data.error) {
      consoleOutput.textContent += `\n❌ ${data.error}\n`;
      statusDot.className = 'status-dot';
      statusText.textContent = 'Status: Idle';
      return;
    }

    startLogPolling();
  } catch (err) {
    consoleOutput.textContent += `\n❌ Network error connecting to dashboard test server: ${err.message}\n`;
    statusDot.className = 'status-dot';
    statusText.textContent = 'Status: Error';
  }
}

// Stream logs from runner
function startLogPolling() {
  if (pollingInterval) clearInterval(pollingInterval);

  pollingInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/status');
      const status = await res.json();

      const consoleOutput = document.getElementById('consoleOutput');
      const statusDot = document.getElementById('statusDot');
      const statusText = document.getElementById('statusText');

      if (status.logs && status.logs.length > 0) {
        consoleOutput.textContent = status.logs.join('');
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
      }

      if (!status.running) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        statusDot.className = 'status-dot';

        if (status.exitCode === 0) {
          statusText.textContent = `Status: Passed in ${status.duration}s ✔`;
        } else {
          statusText.textContent = `Status: Finished (Exit Code ${status.exitCode})`;
        }
      }
    } catch (e) {
      console.error('Polling error', e);
    }
  }, 500);
}

function clearConsole() {
  document.getElementById('consoleOutput').textContent = 'Console cleared.';
}

function openPlaywrightReport() {
  window.open('http://localhost:8080/report', '_blank');
}
