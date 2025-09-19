let selectedCACertFile = null;
let selectedClientKeyFile = null;

function updateProtocolUI() {
  const protocol = document.getElementById("protocol-select").value;

  document.getElementById("ftp-section").style.display = protocol === "FTP" ? "block" : "none";
  document.getElementById("mqtt-section").style.display = protocol === "MQTT" ? "block" : "none";
  document.getElementById("http-section").style.display = protocol === "HTTP" ? "block" : "none";

  if (protocol === "MQTT") {
    toggleCertUploadAndPort();
  } else {
    document.getElementById("cert-upload-button").style.display = "none";
  }
}

function toggleCertUploadAndPort() {
  const sslEnabled = document.getElementById("mqtt-ssl").value;
  const certSection = document.getElementById("cert-section");
  const certUploadButton = document.getElementById("cert-upload-button");

  certSection.style.display = sslEnabled === "yes" ? "block" : "none";
  certUploadButton.style.display = sslEnabled === "yes" ? "block" : "none";

  const portInput = document.getElementById("mqtt-port");

  if (sslEnabled === "yes" && (portInput.value === "1883" || portInput.value === "")) {
    portInput.value = "8883";
  } else if (sslEnabled === "no" && (portInput.value === "8883" || portInput.value === "")) {
    portInput.value = "1883";
  }
}

function clearOutput() {
  document.getElementById("output").innerHTML = "";
}

async function browseCACert() {
  const filePath = await window.electronAPI.openFileDialog();
  if (filePath) {
    selectedCACertFile = filePath;
    document.getElementById("mqtt-ca-cert-path").value = "/usr/device_cert.pem.crt";
    console.log("Selected certificate file:", filePath);
    document.getElementById("output").innerHTML += `Selected certificate: ${filePath}<br>`;
  } else {
    console.log("Certificate file selection cancelled");
    document.getElementById("output").innerHTML += "Certificate file selection cancelled<br>";
  }
}

async function browseClientKey() {
  const filePath = await window.electronAPI.openFileDialog();
  if (filePath) {
    selectedClientKeyFile = filePath;
    document.getElementById("mqtt-client-key-path").value = "/usr/private_key.pem.key";
    console.log("Selected private key file:", filePath);
    document.getElementById("output").innerHTML += `Selected private key: ${filePath}<br>`;
  } else {
    console.log("Private key file selection cancelled");
    document.getElementById("output").innerHTML += "Private key file selection cancelled<br>";
  }
}

async function uploadCertificates() {
  console.log("Attempting to upload certificates...");

  if (!selectedCACertFile || !selectedClientKeyFile) {
    const errorMsg = "Please select both certificate and private key.";
    console.log(errorMsg);
    document.getElementById("output").innerHTML += `<span style="color: red;">${errorMsg}</span><br>`;
    return;
  }

  console.log("Uploading certificate:", selectedCACertFile, "and key:", selectedClientKeyFile);

  const result = await window.electronAPI.setMQTTCertificates({
    caCertPath: selectedCACertFile,
    clientKeyPath: selectedClientKeyFile,
  });

  if (result.error) {
    console.log("Upload failed:", result.error);
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    console.log("Upload successful:", result);
    document.getElementById("output").innerHTML += `<span style="color: green;">${result}</span><br>`;
  }
}

async function listPorts() {
  const result = await window.electronAPI.listPorts();
  const select = document.getElementById("ports");
  select.innerHTML = "";

  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    return;
  }

  result.forEach((p) => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    select.appendChild(option);
  });
}

async function connectPort() {
  const portName = document.getElementById("ports").value;
  const baudRate = document.getElementById("baud-rate").value;

  if (!portName) {
    document.getElementById("output").innerHTML += `<span style="color: red;">Please select a port.</span><br>`;
    return;
  }

  if (!baudRate || isNaN(baudRate) || baudRate <= 0) {
    document.getElementById("output").innerHTML += `<span style="color: red;">Please select a valid baud rate.</span><br>`;
    return;
  }

  const result = await window.electronAPI.connectPort(portName, baudRate);

  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    return;
  }

  document.getElementById("output").innerHTML += `<span style="color: green;">${result}</span><br>`;
}

async function disconnectPort() {
  const result = await window.electronAPI.disconnectPort();
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    return;
  }
  document.getElementById("output").innerHTML += `<span style="color: green;">${result}</span><br>`;
}

async function sendCommand(cmd) {
  if (!cmd) return;

  const result = await window.electronAPI.sendData(cmd);
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    return;
  }

  document.getElementById("output").innerHTML += result + "<br>";
}

async function setInterval() {
  const interval = document.getElementById("interval").value;

  if (!interval || isNaN(interval) || interval <= 0) {
    document.getElementById("output").innerHTML += `<span style="color: red;">Please enter a valid interval (positive seconds).</span><br>`;
    return;
  }

  const result = await window.electronAPI.setInterval(interval);
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    return;
  }

  document.getElementById("output").innerHTML += result + "<br>";
  await delay(500); // Wait for firmware to save
  await window.electronAPI.getInterval(); // Confirm setting
}

async function getInterval() {
  const result = await window.electronAPI.getInterval();
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function setProtocol() {
  const protocol = document.getElementById("protocol-select").value;
  const result = await window.electronAPI.setProtocol(protocol);

  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    return;
  }

  document.getElementById("output").innerHTML += result + "<br>";
  updateProtocolUI();
}

async function setFTPConfig() {
  const host = document.getElementById("ftp-host").value;
  const port = document.getElementById("ftp-port").value;
  const user = document.getElementById("ftp-user").value;
  const password = document.getElementById("ftp-password").value;

  if (!host && !port && !user && !password) {
    document.getElementById("output").innerHTML += `<span style="color: red;">Please enter at least one FTP configuration field.</span><br>`;
    return;
  }

  const commands = [];
  if (host) commands.push(`SET_FTP_HOST:${host}`);
  if (port && !isNaN(port) && port > 0) commands.push(`SET_FTP_PORT:${port}`);
  if (user) commands.push(`SET_FTP_USER:${user}`);
  if (password) commands.push(`SET_FTP_PASS:${password}`);

  for (const cmd of commands) {
    const result = await window.electronAPI.sendData(cmd);
    if (result.error) {
      document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    } else {
      document.getElementById("output").innerHTML += result + "<br>";
    }
  }

  await delay(500);
  await window.electronAPI.getFTPConfig(); // Verify settings
}

async function getFTPConfig() {
  const result = await window.electronAPI.getFTPConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function setMQTTConfig() {
  const broker = document.getElementById("mqtt-broker").value;
  const port = document.getElementById("mqtt-port").value;
  const user = document.getElementById("mqtt-user").value;
  const password = document.getElementById("mqtt-password").value;
  const sslEnabled = document.getElementById("mqtt-ssl").value;

  if (!broker && !port && !user && !password && sslEnabled === "no") {
    document.getElementById("output").innerHTML += `<span style="color: red;">Please enter at least one MQTT configuration field.</span><br>`;
    return;
  }

  // Send SSL first to ensure correct port alignment
  if (sslEnabled !== "") {
    await window.electronAPI.setMQTTSSL(sslEnabled === "yes");
    await delay(1000); // Allow firmware to update and reinitialize
  }
  if (port && !isNaN(port) && port > 0) {
    await window.electronAPI.setMQTTPort(port);
    await delay(500);
  }
  if (broker) {
    await window.electronAPI.setMQTTBroker(broker);
    await delay(500);
  }
  if (user) {
    await window.electronAPI.setMQTTUser(user);
    await delay(500);
  }
  if (password) {
    await window.electronAPI.setMQTTPassword(password);
    await delay(500);
  }

  // Force reinitialization to apply settings
  await window.electronAPI.setProtocol("MQTT");
  await delay(2000); // Allow firmware to reinitialize MQTTClient

  document.getElementById("output").innerHTML += `<span style="color: green;">MQTT config sent and reinitialized. Verifying...</span><br>`;
  await delay(1000);
  await window.electronAPI.getMQTTConfig(); // Verify settings
}

async function getMQTTConfig() {
  const result = await window.electronAPI.getMQTTConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function setHTTPConfig() {
  const url = document.getElementById("http-url").value;
  const user = document.getElementById("http-auth-user").value;
  const password = document.getElementById("http-auth-password").value;

  if (!url && !user && !password) {
    document.getElementById("output").innerHTML += `<span style="color: red;">Please enter at least one HTTP configuration field.</span><br>`;
    return;
  }

  const commands = [];
  if (url) commands.push(`SET_HTTP_URL:${url}`);
  if (user && password) commands.push(`SET_HTTP_AUTH:${user}:${password}`);

  for (const cmd of commands) {
    const result = await window.electronAPI.sendData(cmd);
    if (result.error) {
      document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    } else {
      document.getElementById("output").innerHTML += result + "<br>";
    }
  }

  await delay(500);
  await window.electronAPI.getHTTPConfig(); // Verify settings
}

async function getHTTPConfig() {
  const result = await window.electronAPI.getHTTPConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function setSensorType() {
  const sensor = document.getElementById("sensor-select").value;
  const result = await window.electronAPI.setSensorType(sensor);

  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }

  await delay(500);
  await window.electronAPI.getSensorConfig(); // Verify settings
}

async function setSensorFormat() {
  const format = document.getElementById("sensor-format").value;
  const result = await window.electronAPI.setSensorFormat(format);

  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }

  await delay(500);
  await window.electronAPI.getSensorConfig(); // Verify settings
}

async function getSensorConfig() {
  const result = await window.electronAPI.getSensorConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function uploadFile() {
  const filePath = await window.electronAPI.openFileDialog();
  if (!filePath) {
    document.getElementById("output").innerHTML += `<span style="color: red;">No file selected for upload.</span><br>`;
    return;
  }

  const result = await window.electronAPI.uploadFile(filePath);
  if (result.error) {
    document.getElementById("output").innerHTML += `<span style="color: red;">${result.error}</span><br>`;
    return;
  }

  document.getElementById("output").innerHTML += `<span style="color: green;">${result}</span><br>`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Replace the existing window.electronAPI.onSerialData handler with this:
window.electronAPI.onSerialData((data) => {
  if (!data) return;

  // 1) Remove common ANSI / control sequences (VT100)
  const stripAnsi = (s) => {
    // remove CSI sequences like \x1b[31m and other control chars except CR/LF
    s = s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '');
    // remove other C0 control characters except newline/carriage return
    s = s.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, '');
    return s;
  };

  let text = stripAnsi(String(data));

  // 2) Sanitize < and >
  text = text.replace(/</g, '&lt;'); // only escape "<", keep ">" visible


  // 3) Normalize whitespace (trim trailing CR/LF)
  text = text.replace(/\r?\n$/, '');

  const outputDiv = document.getElementById('output');
  if (!outputDiv) return;

  // 4) Dedupe adjacent identical lines (prevents echo duplicates)
  const lastEl = outputDiv.lastElementChild;
  if (lastEl && lastEl.textContent === text) {
    // Already present as last line — skip appending
    return;
  }

  // 5) Create element and add semantic classes
  const lineEl = document.createElement('div');
  lineEl.className = 'log-line';

  const low = text.toLowerCase();
  if (low.includes('error') || low.includes('failed') || low.includes('enoent')) {
    lineEl.classList.add('log-error');
  } else if (
    low.includes('successfully') ||
    low.includes('saved ok') ||
    low.includes('directory created') ||
    low.includes('connected to') ||
    low.includes('sent') ||
    low.includes('ok')
  ) {
    lineEl.classList.add('log-success');
  } else if (text.startsWith('>')) {
    lineEl.classList.add('log-cmd'); // command echo
  } else if (low.includes('mqtt') && low.includes('connect')) {
    lineEl.classList.add('log-info');
  } else {
    lineEl.classList.add('log-default');
  }

  // Use textContent to preserve raw characters and spacing
  lineEl.textContent = text;

  // 6) Append and scroll
  outputDiv.appendChild(lineEl);
  outputDiv.scrollTop = outputDiv.scrollHeight;
});

window.addEventListener("DOMContentLoaded", () => {
  updateProtocolUI();
  listPorts();
});