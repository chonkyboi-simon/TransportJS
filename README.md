<h1>TransportJS</h1>
<p>TransportJS is a lightweight, browser-controlled TCP relay tool for developers, testers, and protocol engineers. It intercepts and relays TCP packets between a client device and a remote server — with advanced features for viewing, modifying, and debugging data in real-time.</p>

<h2>What Does It Do?</h2>
<p>TransportJS sits between two TCP endpoints — a client device and a target server — and acts as a relay that can:</p>
<ul>
  <li>Intercept and log TCP traffic in real time</li>
  <li>Edit and forward packets manually using a "hold mode"</li>
  <li>Provide insights into packet structure (e.g. TLS record dissection)</li>
  <li>Visually inspect, test, and debug TCP-based communication</li>
</ul>

<h2>Main Features</h2>
<ul>
  <li>Bidirectional TCP relay: Forwards packets between client and server</li>
  <li>Hold Mode: Intercepts packets and waits for manual approval before forwarding</li>
  <li>Live Logging: All traffic logged and visible in the browser</li>
  <li>Packet Editing: Edit payloads before they reach their destination</li>
  <li>TLS Record Highlighting: Color-coded parsing for easier protocol analysis</li>
  <li>Start/Stop Control: Manage relay operation from the frontend</li>
  <li>Liveness Indicator: Confirms backend is still running</li>
</ul>

<h2>How to Use TransportJS</h2>
<ol>
  <li>Start the backend</li>
  node server.js
By default, the backend runs on http://localhost:3000.
  <li>Open the frontend</li>
  Navigate to http://localhost:3000 in your browser. You’ll see:
  <ul>
    <li>Input boxes for:
      <ul>
        <li>Listen Port (for device to connect)</li>
        <li>Target Host (e.g. 127.0.0.1)</li>
        <li>Target Port (e.g. 443)</li>
      </ul>
    </li>
    <li>A Start/Stop button</li>
    <li>A Hold Mode toggle</li>
    <li>A live packet log</li>
    <li>An edit + forward panel (when hold mode is enabled)</li>
  </ul>
  <li>Connect a device</li>
  Configure your device or test script to connect to the TCP port you chose (e.g. localhost:9000). TransportJS will relay the traffic to your target server, or pause it for editing in hold mode.
</ol>

<h2>How to Install</h2>
<h3>Prerequisites</h3>
<p>You need Node.js installed. If you don’t have it:</br>

<h4>Install Node.js (Linux/macOS/Windows)</h4>
Visit: https://nodejs.org/</br>
Download the LTS version for your platform</br>
Follow the installer</br>

<h4>To verify Node.js installation:</h4>
<code>node -v</code></br>
<code>npm -v</code></br>

<h3>Clone and Set Up TransportJS</h3>
<code>git clone https://github.com/chonkyboi-simon/TransportJS.git</code>code></br>
<code>cd TransportJS</code></br>
<code>npm install</code></br>

<h3>Run the Tool</h3>
<code>node server.js</code></br>
Open your browser to:<code>http://localhost:3000</code></br>
</p>



