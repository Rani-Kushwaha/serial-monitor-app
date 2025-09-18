const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  listPorts: () => ipcRenderer.invoke("list-ports"),
<<<<<<< HEAD
  connectPort: (portName, baudRate) => ipcRenderer.invoke("connect-port", portName, baudRate),
=======
  connectPort: (portName) => ipcRenderer.invoke("connect-port", portName),
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  disconnectPort: () => ipcRenderer.invoke("disconnect-port"),
  sendData: (msg) => ipcRenderer.invoke("send-data", msg),
  setInterval: (interval) => ipcRenderer.invoke("set-interval", interval),
  getInterval: () => ipcRenderer.invoke("get-interval"),
  setProtocol: (protocol) => ipcRenderer.invoke("set-protocol", protocol),
  setFTPHost: (host) => ipcRenderer.invoke("set-ftp-host", host),
  setFTPPort: (port) => ipcRenderer.invoke("set-ftp-port", port),
  setFTPUser: (user) => ipcRenderer.invoke("set-ftp-user", user),
  setFTPPassword: (password) => ipcRenderer.invoke("set-ftp-password", password),
  getFTPConfig: () => ipcRenderer.invoke("get-ftp-config"),
<<<<<<< HEAD
  setMQTTCACert: (filePath) => ipcRenderer.invoke("set-mqtt-ca-cert", filePath),
  setMQTTClientKey: (filePath) => ipcRenderer.invoke("set-mqtt-client-key", filePath),
  setMQTTBroker: (broker) => ipcRenderer.invoke("set-mqtt-broker", broker),
  setMQTTUser: (user) => ipcRenderer.invoke("set-mqtt-user", user),
  setMQTTPassword: (password) => ipcRenderer.invoke("set-mqtt-password", password),
  setMQTTPort: (port) => ipcRenderer.invoke("set-mqtt-port", port),
=======
  setMQTTBroker: (broker) => ipcRenderer.invoke("set-mqtt-broker", broker),
  setMQTTPort: (port) => ipcRenderer.invoke("set-mqtt-port", port),
  setMQTTUser: (user) => ipcRenderer.invoke("set-mqtt-user", user),
  setMQTTPassword: (password) => ipcRenderer.invoke("set-mqtt-password", password),
  setMQTTSSL: (enabled) => ipcRenderer.invoke("set-mqtt-ssl", enabled),
  uploadMQTTCert: (type, fileData) => ipcRenderer.invoke("upload-mqtt-cert", { type, fileData }),
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
  getMQTTConfig: () => ipcRenderer.invoke("get-mqtt-config"),
  setHTTPURL: (url) => ipcRenderer.invoke("set-http-url", url),
  setHTTPAuth: (auth) => ipcRenderer.invoke("set-http-auth", auth),
  getHTTPConfig: () => ipcRenderer.invoke("get-http-config"),
<<<<<<< HEAD
  setSensorType: (sensor) => ipcRenderer.invoke("set-sensor-type", sensor),
  setSensorFormat: (format) => ipcRenderer.invoke("set-sensor-format", format),
  getSensorConfig: () => ipcRenderer.invoke("get-sensor-config"),
  uploadFile: (filename) => ipcRenderer.invoke("upload-file", filename),
  onSerialData: (callback) => ipcRenderer.on("serial-data", (event, data) => callback(data)),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  setMQTTCertificates: (paths) => ipcRenderer.invoke('set-mqtt-certificates', paths),
  
=======
  uploadFile: (filename) => ipcRenderer.invoke("upload-file", filename),
  setTCPHost: (host) => ipcRenderer.invoke("set-tcp-host", host),
  setTCPPort: (port) => ipcRenderer.invoke("set-tcp-port", port),
  getTCPConfig: () => ipcRenderer.invoke("get-tcp-config"),
  onSerialData: (callback) => ipcRenderer.on("serial-data", (event, data) => callback(data)),
>>>>>>> 25a00f69ef664f70abfda3cd8ca54dfac9077c34
});