📦 TransportJS
TransportJS is a lightweight, browser-controlled TCP relay tool for developers, testers, and protocol engineers. It intercepts and relays TCP packets between a client device and a remote server — with advanced features for viewing, modifying, and debugging data in real-time.

🔍 What Does It Do?
TransportJS sits between two TCP endpoints — a client device and a target server — and acts as a relay that can:
-Intercept and log TCP traffic in real time
-Edit and forward packets manually using a "hold mode"
-Provide insights into packet structure (e.g. TLS record dissection)
-Visually inspect, test, and debug TCP-based communication

✨ Main Features
✅ Bidirectional TCP relay: Forwards packets between client and server
🛑 Hold Mode: Intercepts packets and waits for manual approval before forwarding
📝 Live Logging: All traffic logged and visible in the browser
🧪 Packet Editing: Edit payloads before they reach their destination
🎨 TLS Record Highlighting: Color-coded parsing for easier protocol analysis
🔄 Start/Stop Control: Manage relay operation from the frontend
❤️ Liveness Indicator: Confirms backend is still running

🚀 How to Use TransportJS
1. Start the backend
node server.js
By default, the backend runs on http://localhost:3000.
2. Open the frontend
Navigate to http://localhost:3000 in your browser. You’ll see:
Input boxes for:
-Listen Port (for device to connect)
-Target Host (e.g. 127.0.0.1)
-Target Port (e.g. 443)
A Start/Stop button
A Hold Mode toggle
A live packet log
An edit + forward panel (when hold mode is enabled)
3. Connect a device
Configure your device or test script to connect to the TCP port you chose (e.g. localhost:9000). TransportJS will relay the traffic to your target server, or pause it for editing in hold mode.

🛠️ How to Install
✅ Prerequisites
You need Node.js installed. If you don’t have it:
📥 Install Node.js (Linux/macOS/Windows)
Visit: https://nodejs.org/
Download the LTS version for your platform
Follow the installer
To verify installation:
node -v
npm -v
📦 Clone and Set Up TransportJS
git clone https://github.com/chonkyboi-simon/TransportJS.git
cd TransportJS
npm install

▶️ Run the Tool
node server.js
Open your browser to:
👉 http://localhost:3000




