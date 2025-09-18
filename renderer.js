<<<<<<< HEAD
let selectedCACertFile = null;
let selectedClientKeyFile = null;

=======
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
function updateProtocolUI() {
  const protocol = document.getElementById("protocol-select").value;
  document.getElementById("ftp-section").style.display = protocol === "FTP" ? "block" : "none";
  document.getElementById("mqtt-section").style.display = protocol === "MQTT" ? "block" : "none";
  document.getElementById("http-section").style.display = protocol === "HTTP" ? "block" : "none";
<<<<<<< HEAD
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
    document.getElementById('mqtt-ca-cert-path').value = "/usr/device_cert.pem.crt";
    console.log("Selected certificate file:", filePath);
  } else {
    console.log("Certificate file selection cancelled");
  }
}

async function browseClientKey() {
  const filePath = await window.electronAPI.openFileDialog();
  if (filePath) {
    selectedClientKeyFile = filePath;
    document.getElementById('mqtt-client-key-path').value = "/usr/private_key.pem.key";
    console.log("Selected private key file:", filePath);
  } else {
    console.log("Private key file selection cancelled");
  }
}

async function uploadCertificates() {
  console.log("Attempting to upload certificates...");
  if (!selectedCACertFile || !selectedClientKeyFile) {
    const errorMsg = "Please select both certificate and private key.";
    console.log(errorMsg);
    document.getElementById("output").innerHTML += errorMsg + "<br>";
    return;
  }
  console.log("Uploading certificate:", selectedCACertFile, "and key:", selectedClientKeyFile);
  const result = await window.electronAPI.setMQTTCertificates({
    caCertPath: selectedCACertFile,
    clientKeyPath: selectedClientKeyFile,
    caCertName: "device_cert.pem.crt",
    clientKeyName: "private_key.pem.key"
  });
  if (result.error) {
    console.log("Upload failed:", result.error);
    document.getElementById("output").innerHTML += result.error + "<br>";
  } else {
    console.log("Upload successful:", result);
    document.getElementById("output").innerHTML += result + "<br>";
  }
}
=======
}

window.addEventListener('DOMContentLoaded', () => {
  updateProtocolUI();
});
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34

async function listPorts() {
  const result = await window.electronAPI.listPorts();
  const select = document.getElementById("ports");
  select.innerHTML = "";
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
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
<<<<<<< HEAD
  const baudRate = document.getElementById("baud-rate").value;
=======
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  if (!portName) {
    document.getElementById("output").innerHTML += "Please select a port.<br>";
    return;
  }
<<<<<<< HEAD
  if (!baudRate || isNaN(baudRate) || baudRate <= 0) {
    document.getElementById("output").innerHTML += "Please select a valid baud rate.<br>";
    return;
  }
  const result = await window.electronAPI.connectPort(portName, baudRate);
=======
  const result = await window.electronAPI.connectPort(portName);
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function disconnectPort() {
  const result = await window.electronAPI.disconnectPort();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function sendCommand(cmd) {
<<<<<<< HEAD
  if (!cmd) return;
=======
  if (cmd !== "LED_ON" && cmd !== "LED_OFF") {
    document.getElementById("output").innerHTML += "Invalid command!<br>";
    return;
  }
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  const result = await window.electronAPI.sendData(cmd);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
<<<<<<< HEAD
=======

  // Toggle buttons
  const onBtn = document.getElementById("led-on");
  const offBtn = document.getElementById("led-off");
  if (cmd === "LED_ON") {
    onBtn.disabled = true;
    offBtn.disabled = false;
  } else {
    onBtn.disabled = false;
    offBtn.disabled = true;
  }
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
}

async function setInterval() {
  const interval = document.getElementById("interval").value;
  if (!interval || isNaN(interval) || interval <= 0) {
<<<<<<< HEAD
    document.getElementById("output").innerHTML += "Please enter a valid interval (positive seconds).<br>";
=======
    document.getElementById("output").innerHTML +=
      "Please enter a valid interval (positive seconds).<br>";
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
    return;
  }
  const result = await window.electronAPI.setInterval(interval);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
<<<<<<< HEAD
=======

  // Listen for serial response
  window.electronAPI.onSerialData((data) => {
    if (data.includes("Interval set to")) {
      document.getElementById("output").innerHTML += data + "<br>";
    } else if (data.includes("Invalid interval value")) {
      document.getElementById("output").innerHTML += "Error: " + data + "<br>";
    }
  });
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
}

async function getInterval() {
  const result = await window.electronAPI.getInterval();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
<<<<<<< HEAD
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

=======
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";

  window.electronAPI.onSerialData((data) => {
    if (data.includes("Current interval:")) {
      const seconds = parseInt(data.split(":")[1].trim().split("s")[0]);
      document.getElementById("output").innerHTML += `Interval: ${seconds} seconds<br>`;
    }
  });
}

// --- Protocol, FTP, MQTT, HTTP functions ---
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
async function setProtocol() {
  const protocol = document.getElementById("protocol-select").value;
  const result = await window.electronAPI.setProtocol(protocol);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
<<<<<<< HEAD
  updateProtocolUI();
}

async function setFTPConfig() {
  const host = document.getElementById("ftp-host").value;
  const port = document.getElementById("ftp-port").value;
  const user = document.getElementById("ftp-user").value;
  const password = document.getElementById("ftp-password").value;
  
  if (!host && !port && !user && !password) {
    document.getElementById("output").innerHTML += "Please enter at least one FTP configuration field.<br>";
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
      document.getElementById("output").innerHTML += result.error + "<br>";
    } else {
      document.getElementById("output").innerHTML += result + "<br>";
    }
  }
=======
  updateProtocolUI(); // Update UI after setting
}

async function setFTPHost() {
  const host = document.getElementById("ftp-host").value;
  if (!host) {
    document.getElementById("output").innerHTML += "Please enter FTP host.<br>";
    return;
  }
  const result = await window.electronAPI.setFTPHost(host);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function setFTPUser() {
  const user = document.getElementById("ftp-user").value;
  if (!user) {
    document.getElementById("output").innerHTML += "Please enter FTP user.<br>";
    return;
  }
  const result = await window.electronAPI.setFTPUser(user);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function setFTPPassword() {
  const password = document.getElementById("ftp-password").value;
  if (!password) {
    document.getElementById("output").innerHTML += "Please enter FTP password.<br>";
    return;
  }
  const result = await window.electronAPI.setFTPPassword(password);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
}

async function getFTPConfig() {
  const result = await window.electronAPI.getFTPConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
<<<<<<< HEAD
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

// In renderer.js, replace the old setMQTTConfig function with this one
async function setMQTTConfig() {
  const broker = document.getElementById("mqtt-broker").value;
  const port = document.getElementById("mqtt-port").value;
  const user = document.getElementById("mqtt-user").value;
  const password = document.getElementById("mqtt-password").value;
  const sslEnabled = document.getElementById("mqtt-ssl").value;

  if (broker) {
    await window.electronAPI.sendData(`SET_MQTT_BROKER:${broker}`);
    await delay(200); // Wait 200ms
  }
  if (port && !isNaN(port) && port > 0) {
    await window.electronAPI.sendData(`SET_MQTT_PORT:${port}`);
    await delay(200); // Wait 200ms
  }
  if (user) {
    await window.electronAPI.sendData(`SET_MQTT_USER:${user}`);
    await delay(200); // Wait 200ms
  }
  if (password) {
    await window.electronAPI.sendData(`SET_MQTT_PASS:${password}`);
    await delay(200); // Wait 200ms
  }
  if (sslEnabled) {
    await window.electronAPI.sendData(`SET_MQTT_SSL:${sslEnabled === "yes" ? "ON" : "OFF"}`);
    await delay(200); // Wait 200ms
  }
  document.getElementById("output").innerHTML += "MQTT config sent.<br>";
=======
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
  window.electronAPI.onSerialData((data) => {
    if (
      data.includes("FTP protocol is running") ||
      data.includes("FTP connection")
    ) {
      document.getElementById("output").innerHTML += data + "<br>";
    }
  });
}

async function setMQTTBroker() {
  const broker = document.getElementById("mqtt-broker").value;
  if (!broker) {
    document.getElementById("output").innerHTML += "Please enter MQTT broker.<br>";
    return;
  }
  const result = await window.electronAPI.setMQTTBroker(broker);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function setMQTTUser() {
  const user = document.getElementById("mqtt-user").value;
  if (!user) {
    document.getElementById("output").innerHTML += "Please enter MQTT user.<br>";
    return;
  }
  const result = await window.electronAPI.setMQTTUser(user);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function setMQTTPassword() {
  const password = document.getElementById("mqtt-password").value;
  if (!password) {
    document.getElementById("output").innerHTML += "Please enter MQTT password.<br>";
    return;
  }
  const result = await window.electronAPI.setMQTTPassword(password);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
}

async function getMQTTConfig() {
  const result = await window.electronAPI.getMQTTConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
<<<<<<< HEAD
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function setHTTPConfig() {
  const url = document.getElementById("http-url").value;
  const user = document.getElementById("http-auth-user").value;
  const password = document.getElementById("http-auth-password").value;

  if (!url && !user && !password) {
    document.getElementById("output").innerHTML += "Please enter at least one HTTP configuration field.<br>";
    return;
  }

  const commands = [];
  if (url) commands.push(`SET_HTTP_URL:${url}`);
  if (user && password) commands.push(`SET_HTTP_AUTH:${user}:${password}`);

  for (const cmd of commands) {
    const result = await window.electronAPI.sendData(cmd);
    if (result.error) {
      document.getElementById("output").innerHTML += result.error + "<br>";
    } else {
      document.getElementById("output").innerHTML += result + "<br>";
    }
  }
=======
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
  window.electronAPI.onSerialData((data) => {
    if (
      data.includes("MQTT protocol is running") ||
      data.includes("MQTT connection")
    ) {
      document.getElementById("output").innerHTML += data + "<br>";
    }
  });
}

// --- HTTP functions ---
async function setHTTPURL() {
  const url = document.getElementById("http-url").value;
  if (!url) {
    document.getElementById("output").innerHTML += "Please enter HTTP URL.<br>";
    return;
  }
  const result = await window.electronAPI.setHTTPURL(url);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function setHTTPAuth() {
  const user = document.getElementById("http-auth-user").value;
  const password = document.getElementById("http-auth-password").value;
  if (!user || !password) {
    document.getElementById("output").innerHTML +=
      "Please enter HTTP auth user and password.<br>";
    return;
  }
  const auth = `${user}:${password}`;
  const result = await window.electronAPI.setHTTPAuth(auth);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
}

async function getHTTPConfig() {
  const result = await window.electronAPI.getHTTPConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
<<<<<<< HEAD
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function setSensorType() {
  const sensor = document.getElementById("sensor-select").value;
  const result = await window.electronAPI.setSensorType(sensor);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function setSensorFormat() {
  const format = document.getElementById("sensor-format").value;
  const result = await window.electronAPI.setSensorFormat(format);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

async function getSensorConfig() {
  const result = await window.electronAPI.getSensorConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
  } else {
    document.getElementById("output").innerHTML += result + "<br>";
  }
}

=======
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
  window.electronAPI.onSerialData((data) => {
    if (
      data.includes("HTTP protocol is running") ||
      data.includes("HTTP connection")
    ) {
      document.getElementById("output").innerHTML += data + "<br>";
    }
  });
}

// --- File Upload ---
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
async function uploadFile() {
  const filename = document.getElementById("upload-filename").value;
  if (!filename) {
    document.getElementById("output").innerHTML += "Please enter filename for upload.<br>";
    return;
  }
  const result = await window.electronAPI.uploadFile(filename);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
}

async function exitApp() {
  const result = await window.electronAPI.disconnectPort();
  document.getElementById("output").innerHTML += result + "<br>";
  setTimeout(() => window.close(), 500);
}

<<<<<<< HEAD
window.electronAPI.onSerialData((data) => {
  if (data) {
    const sanitizedData = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    document.getElementById("output").innerHTML += sanitizedData + "<br>";

    if (sanitizedData.startsWith("FTP protocol")) {
      const hostMatch = sanitizedData.match(/host=([^,]+)/);
      const userMatch = sanitizedData.match(/user=([^,]+)/);
      if (hostMatch) document.getElementById("ftp-host").value = hostMatch[1];
      if (userMatch) document.getElementById("ftp-user").value = userMatch[1];
    }

    if (sanitizedData.startsWith("MQTT protocol")) {
      const brokerMatch = sanitizedData.match(/broker=([^,]+)/);
      const userMatch = sanitizedData.match(/user=([^,]+)/);
      if (brokerMatch) document.getElementById("mqtt-broker").value = brokerMatch[1];
      if (userMatch) document.getElementById("mqtt-user").value = userMatch[1];
    }

    if (sanitizedData.startsWith("HTTP protocol")) {
      const urlMatch = sanitizedData.match(/url=([^,]+)/);
      if (urlMatch) document.getElementById("http-url").value = urlMatch[1];
    }

    const outputDiv = document.getElementById("output");
    outputDiv.scrollTop = outputDiv.scrollHeight;
  }
});

window.addEventListener('DOMContentLoaded', () => {
  updateProtocolUI();
  listPorts();
=======
// --- Global listener for incoming serial data ---
window.electronAPI.onSerialData((data) => {
  if (data) {
    document.getElementById("output").innerHTML += "Received: " + data + "<br>";
  }
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
});