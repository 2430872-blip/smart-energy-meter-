import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfIiGjpH2RTThslwkm0w8UsPWvOL8i-es",
  authDomain: "energy-smart-meter.firebaseapp.com",
  databaseURL: "https://energy-smart-meter-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "energy-smart-meter",
  storageBucket: "energy-smart-meter.firebasestorage.app",
  messagingSenderId: "111683424486",
  appId: "1:111683424486:web:86e3d941e7037c0e0a6b27",
  measurementId: "G-B81T45BJMT"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// IMPORTANT: We'll set this to your real node later (example: "/meter/live")
const DATA_PATH = "/";

const el = (id) => document.getElementById(id);
const setVal = (id, v) => el(id).textContent = (v === undefined || v === null) ? "—" : v;

function pickNumber(obj, keys) {
  for (const k of keys) {
    const val = obj?.[k];
    if (val !== undefined && val !== null && val !== "") {
      const n = Number(val);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}

onValue(ref(db, DATA_PATH), (snap) => {
  const data = snap.val();
  el("status").textContent = "Connected ✅";
  el("raw").textContent = JSON.stringify(data, null, 2);

  const V  = pickNumber(data, ["voltage","V"]);
  const I  = pickNumber(data, ["current","I"]);
  const P  = pickNumber(data, ["power","P"]);
  const E  = pickNumber(data, ["energy","kwh"]);
  const F  = pickNumber(data, ["frequency","freq"]);
  const PF = pickNumber(data, ["pf","powerFactor"]);
  const T  = pickNumber(data, ["temperature","temp"]);
  const H  = pickNumber(data, ["humidity","hum"]);

  setVal("v",  V?.toFixed(1));
  setVal("i",  I?.toFixed(3));
  setVal("p",  P?.toFixed(1));
  setVal("e",  E?.toFixed(4));
  setVal("f",  F?.toFixed(1));
  setVal("pf", PF?.toFixed(2));
  setVal("t",  T?.toFixed(1));
  setVal("h",  H?.toFixed(1));
}, (err) => {
  el("status").textContent = "Error: " + err.message;
});
