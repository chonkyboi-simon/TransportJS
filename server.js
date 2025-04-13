const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const net = require('net');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let holdMode = false;
let storedPacket = null; // holds the latest intercepted packet for forwarding

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

app.get('/server_status', (req, res) => {
  res.json({ alive: true });
});

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

    // device -> server
    deviceSocket.on('data', (data) => {
      const hex = data.toString('hex');
      logToBrowser('Device → Server', hex); // ✅ always log it
    
      if (holdMode) {
        storedPacket = { direction: 'deviceToServer', dataHex: hex };
        logToBrowser('Hold Mode', `Paused packet for editing`);
        // Don't forward
      } else {
        currentServerSocket.write(data); // ✅ forward if not holding
      }
    });   

    // server -> device
    currentServerSocket.on('data', (data) => {
      const hex = data.toString('hex');
      logToBrowser('Server → Device', hex); // ✅ always log it
    
      if (holdMode) {
        storedPacket = { direction: 'serverToDevice', dataHex: hex };
        logToBrowser('Hold Mode', `Paused packet for editing`);
        // Don't forward
      } else {
        deviceSocket.write(data); // ✅ forward if not holding
      }
    });
    

    const closeAll = () => {
      logToBrowser('Connection Closed', 'Device or server closed the connection.');
    
      if (currentDeviceSocket) {
        currentDeviceSocket.destroy();
        currentDeviceSocket = null;
      }
    
      if (currentServerSocket) {
        currentServerSocket.destroy();
        currentServerSocket = null;
      }
    
      if (browserSocket && browserSocket.readyState === WebSocket.OPEN) {
        browserSocket.send(JSON.stringify({
          headline: 'Relay Status',
          message: 'disconnected'
        }));
      }
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

  closeAll();

  relayServer.close(() => {
    logToBrowser('Relay Stopped', 'TCP relay server has been stopped.');
    relayServer = null;
    res.json({ success: true });
  });
});

app.post('/forward_packet', (req, res) => {
  const { direction, dataHex } = req.body;
  const buffer = Buffer.from(dataHex, 'hex');

  if (direction === 'deviceToServer' && currentServerSocket) {
    currentServerSocket.write(buffer);
    logToBrowser('Manual Forward', `Sent edited packet to server`);
  } else if (direction === 'serverToDevice' && currentDeviceSocket) {
    currentDeviceSocket.write(buffer);
    logToBrowser('Manual Forward', `Sent edited packet to device`);
  } else {
    return res.status(400).json({ error: 'Invalid direction or socket not available' });
  }

  // ✅ log the edited payload as well
  logToBrowser(
    'Edited Forwarded Packet',
    `To ${direction === 'deviceToServer' ? 'Server' : 'Device'}: ${dataHex}`
  );

  res.json({ success: true });
});



app.post('/set_hold_mode', (req, res) => {
  holdMode = !!req.body.enabled;
  logToBrowser('Hold Mode Toggled', `Hold mode is now ${holdMode ? 'ON' : 'OFF'}`);
  res.json({ success: true });
});


server.listen(3000, () => {
  console.log('Web app running at http://localhost:3000');
});
