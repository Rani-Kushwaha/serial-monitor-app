const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { SerialPort } = require("serialport");
const fs = require("fs").promises;

let mainWindow;
let port;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

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

// Serial Port Handlers
ipcMain.handle("list-ports", async () => {
  try {
    const ports = await SerialPort.list();
    return ports.map(p => p.path);
  } catch (error) {
    return { error: `Failed to list ports: ${error.message}` };
  }
});

ipcMain.handle("connect-port", async (event, portName) => {
  try {
    if (port && port.isOpen) {
      port.close();
    }
    port = new SerialPort({ path: portName, baudRate: 115200 });

    await new Promise(resolve => setTimeout(resolve, 2000));

    port.on("data", (data) => {
      setTimeout(() => {
        mainWindow.webContents.send("serial-data", data.toString("utf8", 0, data.length));
      }, 200);
    });

    port.on("error", (err) => {
      console.error("Serial port error:", err.message);
      mainWindow.webContents.send("serial-data", `Error: ${err.message}`);
    });

    return `Connected to ${portName}`;
  } catch (error) {
    return { error: `Failed to connect: ${error.message}` };
  }
});

ipcMain.handle("disconnect-port", async () => {
  try {
    if (port && port.isOpen) {
      port.close();
      return "Disconnected from serial port.";
    }
    return "No active serial connection.";
  } catch (error) {
    return { error: `Failed to disconnect: ${error.message}` };
  }
});

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
  }
});