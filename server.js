const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// 1. A te kapcsolódási sztringed (Mongoose-hoz kicsit egyszerűbb)
const uri = process.env.MONGO_URI;

// 2. Csatlakozás (Nem zárjuk be a végén!)
mongoose.connect(uri)
  .then(() => console.log("Sikeresen csatlakoztunk a MongoDB-hez!"))
  .catch(err => console.error("Hiba a csatlakozásnál:", err));

// 3. Egy egyszerű séma (Milyen adatot akarunk tárolni?)
const Uzenet = mongoose.model('Uzenet', {
  szoveg: String,
  datum: { type: Date, default: Date.now }
});

// 4. API végpontok (Endpoints)
app.get('/', (req, res) => {
  res.send('A szerver és az adatbázis kapcsolat kész!');
});

// Új üzenet mentése
app.post('/api/uzenet', async (req, res) => {
  const ujUzenet = new Uzenet({ szoveg: req.body.szoveg });
  await ujUzenet.save();
  res.json({ status: "Mentve!", adat: ujUzenet });
});

// Üzenetek lekérése
app.get('/api/uzenetek', async (req, res) => {
  const uzenetek = await Uzenet.find();
  res.json(uzenetek);
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Szerver fut: http://0.0.0.0:${port}`);
});
