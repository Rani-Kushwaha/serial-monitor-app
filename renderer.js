function updateProtocolUI() {
  const protocol = document.getElementById("protocol-select").value;
  document.getElementById("ftp-section").style.display = protocol === "FTP" ? "block" : "none";
  document.getElementById("mqtt-section").style.display = protocol === "MQTT" ? "block" : "none";
  document.getElementById("http-section").style.display = protocol === "HTTP" ? "block" : "none";
}

window.addEventListener('DOMContentLoaded', () => {
  updateProtocolUI();
});

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
  if (!portName) {
    document.getElementById("output").innerHTML += "Please select a port.<br>";
    return;
  }
  const result = await window.electronAPI.connectPort(portName);
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
  if (cmd !== "LED_ON" && cmd !== "LED_OFF") {
    document.getElementById("output").innerHTML += "Invalid command!<br>";
    return;
  }
  const result = await window.electronAPI.sendData(cmd);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";

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
}

async function setInterval() {
  const interval = document.getElementById("interval").value;
  if (!interval || isNaN(interval) || interval <= 0) {
    document.getElementById("output").innerHTML +=
      "Please enter a valid interval (positive seconds).<br>";
    return;
  }
  const result = await window.electronAPI.setInterval(interval);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";

  // Listen for serial response
  window.electronAPI.onSerialData((data) => {
    if (data.includes("Interval set to")) {
      document.getElementById("output").innerHTML += data + "<br>";
    } else if (data.includes("Invalid interval value")) {
      document.getElementById("output").innerHTML += "Error: " + data + "<br>";
    }
  });
}

async function getInterval() {
  const result = await window.electronAPI.getInterval();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
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
async function setProtocol() {
  const protocol = document.getElementById("protocol-select").value;
  const result = await window.electronAPI.setProtocol(protocol);
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
    return;
  }
  document.getElementById("output").innerHTML += result + "<br>";
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
}

async function getFTPConfig() {
  const result = await window.electronAPI.getFTPConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
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
}

async function getMQTTConfig() {
  const result = await window.electronAPI.getMQTTConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
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
}

async function getHTTPConfig() {
  const result = await window.electronAPI.getHTTPConfig();
  if (result.error) {
    document.getElementById("output").innerHTML += result.error + "<br>";
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

// --- Global listener for incoming serial data ---
window.electronAPI.onSerialData((data) => {
  if (data) {
    document.getElementById("output").innerHTML += "Received: " + data + "<br>";
  }
});