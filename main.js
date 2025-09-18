const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { SerialPort } = require("serialport");
const fs = require("fs").promises;

let mainWindow;
let port;
<<<<<<< HEAD
let responseBuffer = "";

async function sendCommand(message) {
  if (!port || !port.isOpen) {
    return { error: "Port not open!" };
  }
  try {
    const command = message + "\r\n";
    console.log(`Sending command: ${JSON.stringify(command)}`);
    // Only send firmware-facing commands to the UI
    mainWindow.webContents.send("serial-data", `> ${message}`);
    await new Promise((resolve, reject) => {
      port.write(command, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    return `Successfully sent: ${message}`;
  } catch (error) {
    console.error(`Failed to send command "${message}":`, error);
    return { error: `Failed to send data: ${error.message}` };
  }
}

async function sendFile(filePath, fileName) {
  if (!port || !port.isOpen) {
    return { error: "Port not open!" };
  }

  try {
    // 1. Read the entire file into a buffer
    const fileContent = await fs.readFile(filePath);
    const command = `UPLOAD_FILE:${fileName}\r\n`;

    // 2. Flush UART buffer
    while (port.readable && port.readableLength > 0) {
      port.read();
    }
    console.log("Flushed UART buffer before sending UPLOAD_FILE");

    // 3. Send the upload command
    console.log(`Sending upload command for: ${fileName} (${fileContent.length} bytes)`);
    mainWindow.webContents.send("serial-data", `> UPLOAD_FILE:${fileName}`);
    await new Promise((resolve, reject) => {
      port.write(command, (err) => (err ? reject(err) : resolve()));
    });

    // 4. Wait 2 seconds before sending file data
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Send the entire file content
    await new Promise((resolve, reject) => {
      port.write(fileContent, (err) => (err ? reject(err) : resolve()));
    });
    console.log(`Sent ${fileContent.length} bytes for ${fileName}`);

    // 6. Send the end-of-file marker
    await new Promise((resolve, reject) => {
      port.write("END_FILE\r\n", (err) => (err ? reject(err) : resolve()));
    });
    console.log(`Sent END_FILE for ${fileName}`);
    mainWindow.webContents.send("serial-data", `> END_FILE`);

    // 7. Wait for confirmation with longer timeout
    const confirmation = await new Promise((resolve, reject) => {
      let responseData = "";
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`Timeout: No confirmation received for ${fileName}`));
      }, 60000); // 60-second timeout

      const dataListener = (data) => {
        const text = data.toString("utf8");
        responseData += text;
        console.log(`Received chunk during confirmation: "${text}"`);
        mainWindow.webContents.send("serial-data", text); // Send raw firmware response to UI

        if (responseData.includes("and saved OK")) {
          cleanup();
          resolve(`Successfully uploaded ${fileName}`);
        } else if (responseData.includes("Error") || responseData.includes("Invalid protocol")) {
          cleanup();
          reject(new Error(`Firmware error while receiving ${fileName}: ${responseData.substring(0, 200)}`));
        }
      };

      const cleanup = () => {
        clearTimeout(timeout);
        port.removeListener("data", dataListener);
      };

      port.on("data", dataListener);
    });

    return confirmation;

  } catch (error) {
    console.error(`Failed to send file "${fileName}":`, error);
    return { error: `Failed to send file ${fileName}: ${error.message}` };
  }
}
=======
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
<<<<<<< HEAD
=======

>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  mainWindow.loadFile("index.html");
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (port && port.isOpen) {
      port.close(() => console.log("Serial port closed."));
    }
    app.quit();
  }
});

<<<<<<< HEAD
=======
// Serial Port Handlers
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
ipcMain.handle("list-ports", async () => {
  try {
    const ports = await SerialPort.list();
    return ports.map(p => p.path);
  } catch (error) {
<<<<<<< HEAD
    console.error("List ports error:", error);
=======
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
    return { error: `Failed to list ports: ${error.message}` };
  }
});

<<<<<<< HEAD
ipcMain.handle("connect-port", async (event, portName, baudRate = 115200) => {
  try {
    if (port && port.isOpen) {
      await new Promise(resolve => port.close(resolve));
    }
    responseBuffer = "";
    port = new SerialPort({
      path: portName,
      baudRate: parseInt(baudRate),
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      autoOpen: false
    });

    await new Promise((resolve, reject) => {
      port.open((err) => (err ? reject(err) : resolve()));
    });
=======
ipcMain.handle("connect-port", async (event, portName) => {
  try {
    if (port && port.isOpen) {
      port.close();
    }
    port = new SerialPort({ path: portName, baudRate: 115200 });
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34

    await new Promise(resolve => setTimeout(resolve, 2000));

    port.on("data", (data) => {
<<<<<<< HEAD
      try {
        const incomingText = data.toString("utf8");
        console.log(`Raw data received: "${incomingText}"`);
        responseBuffer += incomingText;
        let lines = responseBuffer.split(/\r?\n/);
        responseBuffer = lines.pop();
        for (const line of lines) {
          const message = line.trim();
          if (message) {
            console.log(`Processed line: "${message}"`);
            mainWindow.webContents.send("serial-data", message); // Send only firmware responses
          }
        }
      } catch (err) {
        console.error("Error processing serial data:", err);
        mainWindow.webContents.send("serial-data", `Error: ${err.message}`);
      }
=======
      setTimeout(() => {
        mainWindow.webContents.send("serial-data", data.toString("utf8", 0, data.length));
      }, 200);
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
    });

    port.on("error", (err) => {
      console.error("Serial port error:", err.message);
<<<<<<< HEAD
      mainWindow.webContents.send("serial-data", `Port error: ${err.message}`);
    });

    return `Connected to ${portName} at ${baudRate} baud`;
  } catch (error) {
    console.error("Connect port error:", error);
    return { error: `Failed to connect to ${portName}: ${error.message}` };
=======
      mainWindow.webContents.send("serial-data", `Error: ${err.message}`);
    });

    return `Connected to ${portName}`;
  } catch (error) {
    return { error: `Failed to connect: ${error.message}` };
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  }
});

ipcMain.handle("disconnect-port", async () => {
  try {
    if (port && port.isOpen) {
<<<<<<< HEAD
      await new Promise(resolve => port.close(resolve));
      responseBuffer = "";
      return "Disconnected from port.";
    }
    return "No port to disconnect.";
  } catch (error) {
    console.error("Disconnect port error:", error);
=======
      port.close();
      return "Disconnected from serial port.";
    }
    return "No active serial connection.";
  } catch (error) {
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
    return { error: `Failed to disconnect: ${error.message}` };
  }
});

<<<<<<< HEAD
ipcMain.handle("send-data", (event, message) => sendCommand(message));
ipcMain.handle("get-interval", () => sendCommand("GET_INTERVAL"));
ipcMain.handle("get-ftp-config", () => sendCommand("GET_FTP_CONFIG"));
ipcMain.handle("get-mqtt-config", () => sendCommand("GET_MQTT_CONFIG"));
ipcMain.handle("get-http-config", () => sendCommand("GET_HTTP_CONFIG"));
ipcMain.handle("get-tcp-config", () => sendCommand("GET_TCP_CONFIG"));
ipcMain.handle("get-sensor-config", () => sendCommand("GET_SENSOR_CONFIG"));

ipcMain.handle("set-interval", (event, interval) => {
  const i = parseInt(interval);
  if (isNaN(i) || i <= 0) return { error: "Invalid interval" };
  return sendCommand(`SET_INTERVAL:${i}`);
});

ipcMain.handle("set-protocol", (event, protocol) => {
  if (!["FTP", "MQTT", "HTTP"].includes(protocol)) return { error: "Invalid protocol" };
  return sendCommand(`SET_PROTOCOL:${protocol}`);
});

ipcMain.handle("set-ftp-host", (event, host) => sendCommand(`SET_FTP_HOST:${host}`));
ipcMain.handle("set-ftp-user", (event, user) => sendCommand(`SET_FTP_USER:${user}`));
ipcMain.handle("set-ftp-password", (event, pass) => sendCommand(`SET_FTP_PASS:${pass}`));
ipcMain.handle("set-ftp-port", (event, portNum) => sendCommand(`SET_FTP_PORT:${portNum}`));

ipcMain.handle("set-mqtt-broker", (event, broker) => sendCommand(`SET_MQTT_BROKER:${broker}`));
ipcMain.handle("set-mqtt-user", (event, user) => sendCommand(`SET_MQTT_USER:${user}`));
ipcMain.handle("set-mqtt-password", (event, pass) => sendCommand(`SET_MQTT_PASS:${pass}`));
ipcMain.handle("set-mqtt-port", (event, portNum) => sendCommand(`SET_MQTT_PORT:${portNum}`));
ipcMain.handle("set-mqtt-ca-cert", (event, path) => sendCommand(`SET_MQTT_CERT:${path}`));
ipcMain.handle("set-mqtt-client-key", (event, path) => sendCommand(`SET_MQTT_KEY:${path}`));

ipcMain.handle("set-http-url", (event, url) => sendCommand(`SET_HTTP_URL:${url}`));
ipcMain.handle("set-http-auth", (event, auth) => sendCommand(`SET_HTTP_AUTH:${auth}`));

ipcMain.handle("set-tcp-host", (event, host) => sendCommand(`SET_TCP_HOST:${host}`));
ipcMain.handle("set-tcp-port", (event, portNum) => sendCommand(`SET_TCP_PORT:${portNum}`));

ipcMain.handle("set-sensor-type", (event, type) => sendCommand(`SET_SENSOR_TYPE:${type}`));
ipcMain.handle("set-sensor-format", (event, format) => sendCommand(`SET_SENSOR_FORMAT:${format}`));

ipcMain.handle("upload-file", (event, filename) => sendCommand(`UPLOAD:${filename}`));



const { dialog } = require('electron');

ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile']
  });
  return canceled ? null : filePaths[0];
});

ipcMain.handle('set-mqtt-certificates', async (event, { caCertPath, clientKeyPath }) => {
  if (!port || !port.isOpen) return { error: "Port not open!" };

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const certFileName = "device_cert.pem.crt";
  const keyFileName = "private_key.pem.key";
  const maxRetries = 3;

  try {
    console.log("Starting certificate upload sequence...");

    // Flush UART buffer before MKDIR
    while (port.readable && port.readableLength > 0) {
      port.read();
    }
    console.log("Flushed UART buffer before MKDIR");

    // Ensure /usr/ directory exists
    console.log("Sending MKDIR:/usr/ to ensure directory exists");
    await sendCommand("MKDIR:/usr/");

    // Wait for MKDIR confirmation
    const mkdirConfirmation = await new Promise((resolve, reject) => {
      let responseData = "";
      const timeout = setTimeout(() => {
        cleanup();
        resolve("No MKDIR response, proceeding");
      }, 5000);

      const dataListener = (data) => {
        const text = data.toString("utf8");
        responseData += text;
        console.log(`Received during MKDIR confirmation: "${text}"`);
        mainWindow.webContents.send("serial-data", text);

        if (responseData.includes("Directory created") || responseData.includes("OK")) {
          cleanup();
          resolve("Directory created successfully");
        } else if (responseData.includes("Error")) {
          cleanup();
          reject(new Error(`MKDIR failed: ${responseData.substring(0, 200)}`));
        }
      };

      const cleanup = () => {
        clearTimeout(timeout);
        port.removeListener("data", dataListener);
      };

      port.on("data", dataListener);
    });
    console.log(mkdirConfirmation);
    await delay(4000); // 4s to ensure directory creation

    // Flush UART buffer before uploads
    while (port.readable && port.readableLength > 0) {
      port.read();
    }
    console.log("Flushed UART buffer before certificate upload");

    // Upload certificate with retries
    let certResult;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to upload ${certFileName}`);
        certResult = await sendFile(caCertPath, certFileName);
        if (certResult.error) throw new Error(certResult.error);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === maxRetries) throw error;
        await delay(3000); // Wait before retry
        while (port.readable && port.readableLength > 0) {
          port.read();
        }
      }
    }
    await delay(3000); // 3s between uploads

    // Flush UART buffer before key upload
    while (port.readable && port.readableLength > 0) {
      port.read();
    }
    console.log("Flushed UART buffer before private key upload");

    // Upload private key with retries
    let keyResult;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to upload ${keyFileName}`);
        keyResult = await sendFile(clientKeyPath, keyFileName);
        if (keyResult.error) throw new Error(keyResult.error);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === maxRetries) throw error;
        await delay(3000); // Wait before retry
        while (port.readable && port.readableLength > 0) {
          port.read();
        }
      }
    }
    await delay(3000); // 3s after uploads

    // Set certificate and key paths
    await sendCommand(`SET_MQTT_CERT:/usr/${certFileName}`);
    await delay(1000);
    await sendCommand(`SET_MQTT_KEY:/usr/${keyFileName}`);
    await delay(1000);
    await sendCommand("SET_MQTT_SSL:ON");
    await delay(1000);
    await sendCommand("SET_MQTT_PORT:8883");
    await delay(1000);

    // Verify MQTT configuration
    await sendCommand("GET_MQTT_CONFIG");
    await delay(1000);

    return "Certificates uploaded and configured successfully.";
  } catch (error) {
    console.error("Failed to upload certificates:", error);
    return { error: `Failed to upload certificates: ${error.message}` };
=======
ipcMain.handle("send-data", async (event, msg) => {
  try {
    if (port && port.isOpen) {
      port.write(msg + "\n", (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `Sent: ${msg}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to send data: ${error.message}` };
  }
});

// Interval Handlers
ipcMain.handle("set-interval", async (event, interval) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_INTERVAL ${interval}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `Interval set to ${interval} seconds`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set interval: ${error.message}` };
  }
});

ipcMain.handle("get-interval", async () => {
  try {
    if (port && port.isOpen) {
      port.write("GET_INTERVAL\n", (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "Requesting current interval...";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to get interval: ${error.message}` };
  }
});

// Protocol Handlers
ipcMain.handle("set-protocol", async (event, protocol) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_PROTOCOL ${protocol}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `Protocol set to ${protocol}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set protocol: ${error.message}` };
  }
});

// FTP Handlers
ipcMain.handle("set-ftp-host", async (event, host) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_FTP_HOST ${host}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `FTP host set to ${host}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set FTP host: ${error.message}` };
  }
});

ipcMain.handle("set-ftp-port", async (event, port) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_FTP_PORT ${port}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `FTP port set to ${port}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set FTP port: ${error.message}` };
  }
});

ipcMain.handle("set-ftp-user", async (event, user) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_FTP_USER ${user}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `FTP user set to ${user}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set FTP user: ${error.message}` };
  }
});

ipcMain.handle("set-ftp-password", async (event, password) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_FTP_PASSWORD ${password}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "FTP password set";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set FTP password: ${error.message}` };
  }
});

ipcMain.handle("get-ftp-config", async () => {
  try {
    if (port && port.isOpen) {
      port.write("GET_FTP_CONFIG\n", (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "Requesting FTP config...";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to get FTP config: ${error.message}` };
  }
});

// MQTT Handlers
ipcMain.handle("set-mqtt-broker", async (event, broker) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_MQTT_BROKER ${broker}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `MQTT broker set to ${broker}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set MQTT broker: ${error.message}` };
  }
});

ipcMain.handle("set-mqtt-port", async (event, port) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_MQTT_PORT ${port}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `MQTT port set to ${port}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set MQTT port: ${error.message}` };
  }
});

ipcMain.handle("set-mqtt-user", async (event, user) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_MQTT_USER ${user}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `MQTT user set to ${user}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set MQTT user: ${error.message}` };
  }
});

ipcMain.handle("set-mqtt-password", async (event, password) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_MQTT_PASSWORD ${password}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "MQTT password set";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set MQTT password: ${error.message}` };
  }
});

ipcMain.handle("set-mqtt-ssl", async (event, enabled) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_MQTT_SSL ${enabled}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `MQTT SSL set to ${enabled}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set MQTT SSL: ${error.message}` };
  }
});

ipcMain.handle("upload-mqtt-cert", async (event, { type, fileData }) => {
  try {
    if (port && port.isOpen) {
      const command = `UPLOAD_MQTT_${type.toUpperCase()} ${fileData}\n`;
      port.write(command, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `Uploaded MQTT ${type} certificate`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to upload MQTT certificate: ${error.message}` };
  }
});

ipcMain.handle("get-mqtt-config", async () => {
  try {
    if (port && port.isOpen) {
      port.write("GET_MQTT_CONFIG\n", (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "Requesting MQTT config...";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to get MQTT config: ${error.message}` };
  }
});

// HTTP Handlers
ipcMain.handle("set-http-url", async (event, url) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_HTTP_URL ${url}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `HTTP URL set to ${url}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set HTTP URL: ${error.message}` };
  }
});

ipcMain.handle("set-http-auth", async (event, auth) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_HTTP_AUTH ${auth}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "HTTP auth set";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set HTTP auth: ${error.message}` };
  }
});

ipcMain.handle("get-http-config", async () => {
  try {
    if (port && port.isOpen) {
      port.write("GET_HTTP_CONFIG\n", (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "Requesting HTTP config...";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to get HTTP config: ${error.message}` };
  }
});

// TCP Handlers
ipcMain.handle("set-tcp-host", async (event, host) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_TCP_HOST ${host}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `TCP host set to ${host}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set TCP host: ${error.message}` };
  }
});

ipcMain.handle("set-tcp-port", async (event, port) => {
  try {
    if (port && port.isOpen) {
      port.write(`SET_TCP_PORT ${port}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `TCP port set to ${port}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to set TCP port: ${error.message}` };
  }
});

ipcMain.handle("get-tcp-config", async () => {
  try {
    if (port && port.isOpen) {
      port.write("GET_TCP_CONFIG\n", (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return "Requesting TCP config...";
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to get TCP config: ${error.message}` };
  }
});

// Upload File Handler
ipcMain.handle("upload-file", async (event, filename) => {
  try {
    if (port && port.isOpen) {
      port.write(`UPLOAD_FILE ${filename}\n`, (err) => {
        if (err) return { error: `Write error: ${err.message}` };
      });
      return `Upload initiated for ${filename}`;
    }
    return { error: "No active serial connection." };
  } catch (error) {
    return { error: `Failed to initiate upload: ${error.message}` };
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  }
});