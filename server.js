const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const net = require('net');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());
app.use(express.static('public'));

let browserSocket = null;

wss.on('connection', (ws) => {
  browserSocket = ws;
  ws.on('close', () => {
    browserSocket = null;
  });
});

function logToBrowser(headline, message) {
  const logEntry = JSON.stringify({ headline, message });
  console.log(`[${headline}] ${message}`);
  if (browserSocket && browserSocket.readyState === WebSocket.OPEN) {
    browserSocket.send(logEntry);
  }
}

// Global relay state
let relayServer = null;
let currentDeviceSocket = null;
let currentServerSocket = null;

app.post('/tool_start', (req, res) => {
  const { listenPort, targetHost, targetPort } = req.body;

  if (relayServer) {
    return res.status(400).json({ error: 'Relay already running' });
  }

  relayServer = net.createServer((deviceSocket) => {
    currentDeviceSocket = deviceSocket;
    logToBrowser('Device Connected', 'Device connected to relay tool.');

    currentServerSocket = net.connect(targetPort, targetHost, () => {
      logToBrowser('Connected to Server', `Target server: ${targetHost}:${targetPort}`);
    });

    deviceSocket.on('data', (data) => {
      const hex = data.toString('hex');
      logToBrowser('Device → Server', hex);
      currentServerSocket.write(data);
    });

    currentServerSocket.on('data', (data) => {
      const hex = data.toString('hex');
      logToBrowser('Server → Device', hex);
      deviceSocket.write(data);
    });

    const closeAll = () => {
      logToBrowser('Connection Closed', 'Device or server closed the connection.');
      deviceSocket.destroy();
      currentServerSocket.destroy();
      currentDeviceSocket = null;
      currentServerSocket = null;
    };

    deviceSocket.on('close', closeAll);
    deviceSocket.on('error', closeAll);
    currentServerSocket.on('close', closeAll);
    currentServerSocket.on('error', closeAll);
  });

  relayServer.listen(listenPort, () => {
    logToBrowser('Relay Started', `Listening on port ${listenPort}`);
    res.json({ success: true });
  });

  relayServer.on('error', (err) => {
    logToBrowser('Server Error', err.message);
    res.status(500).json({ error: err.message });
  });
});

app.post('/tool_stop', (req, res) => {
  if (!relayServer) {
    return res.status(400).json({ error: 'Relay not running' });
  }

  if (currentDeviceSocket) currentDeviceSocket.destroy();
  if (currentServerSocket) currentServerSocket.destroy();

  relayServer.close(() => {
    logToBrowser('Relay Stopped', 'TCP relay server has been stopped.');
    relayServer = null;
    currentDeviceSocket = null;
    currentServerSocket = null;
    res.json({ success: true });
  });
});

server.listen(3000, () => {
  console.log('Web app running at http://localhost:3000');
});
