const express = require('express');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9000;

// Statik dosyaları sun (public/ klasörü)
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucuyu başlat
const server = app.listen(PORT, () => {
  console.log(`🍓 Çilek sunucusu çalışıyor: http://localhost:${PORT}`);
});

// PeerJS sunucusunu Express'e bağla
const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: false,
  // Keepalive: 10 saniyede bir ping gönder
  alive_timeout: 60000,
  // Peer bağlantı isteğini 10 saniye tut
  expire_timeout: 30000,
  // Concurrent limit
  concurrent_limit: 10
});

app.use('/peerjs', peerServer);

peerServer.on('connection', (client) => {
  console.log(`✅ Peer bağlandı: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`❌ Peer ayrıldı: ${client.getId()}`);
});

console.log('📡 PeerJS sinyal sunucusu /peerjs yolunda aktif');
