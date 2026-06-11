import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface LicenseKey {
  key: string;
  maxUses: number;
  uses: number;
  expiryDate: string;
  createdAt: string;
  status: string;
}

interface DataStore {
  maintenanceActive: boolean;
  licenseKeys: LicenseKey[];
}

const DATA_FILE = path.join(process.cwd(), "maintenance_store.json");

function loadStore(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading data file, using default:", err);
  }
  return {
    maintenanceActive: false,
    licenseKeys: [
      { key: "VX-D3F9-2A8B-4C6D", maxUses: 5, uses: 1, expiryDate: "2026-12-31", createdAt: new Date().toISOString(), status: "Active" },
      { key: "VX-KEYS-WORM-HOLE", maxUses: 999, uses: 12, expiryDate: "2027-01-01", createdAt: new Date().toISOString(), status: "Active" }
    ]
  };
}

function saveStore(data: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing data file:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API: Get maintenance status
  app.get("/api/maintenance", (req, res) => {
    const store = loadStore();
    res.json({ active: store.maintenanceActive });
  });

  // API: Set maintenance status
  app.post("/api/maintenance", (req, res) => {
    const { active } = req.body;
    const store = loadStore();
    store.maintenanceActive = !!active;
    saveStore(store);
    res.json({ active: store.maintenanceActive });
  });

  // API: Get active license keys
  app.get("/api/licenses", (req, res) => {
    const store = loadStore();
    res.json(store.licenseKeys);
  });

  // API: Generate new license key
  app.post("/api/licenses/generate", (req, res) => {
    const { maxUses, expiryDate } = req.body;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const part3 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    const newKey = `VX-${part1}-${part2}-${part3}`;

    const newLicense: LicenseKey = {
      key: newKey,
      maxUses: Number(maxUses) || 5,
      uses: 0,
      expiryDate: expiryDate || "2026-12-31",
      createdAt: new Date().toISOString(),
      status: "Active"
    };

    const store = loadStore();
    store.licenseKeys.unshift(newLicense);
    saveStore(store);
    res.json(newLicense);
  });

  // API: Toggle key status
  app.post("/api/licenses/toggle", (req, res) => {
    const { key } = req.body;
    const store = loadStore();
    const match = store.licenseKeys.find(k => k.key.toUpperCase() === key.toUpperCase());
    if (match) {
      match.status = match.status === "Active" ? "Disabled" : "Active";
      saveStore(store);
      res.json({ success: true, license: match });
    } else {
      res.status(404).json({ success: false, error: "License key not found" });
    }
  });

  // API: Delete license key
  app.delete("/api/licenses/:key", (req, res) => {
    const { key } = req.params;
    const store = loadStore();
    const countBefore = store.licenseKeys.length;
    store.licenseKeys = store.licenseKeys.filter(k => k.key.toUpperCase() !== key.toUpperCase());
    if (store.licenseKeys.length < countBefore) {
      saveStore(store);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "License key not found" });
    }
  });

  // API: Verify license key (from front-end locked view)
  app.post("/api/licenses/verify", (req, res) => {
    const { key } = req.body;
    if (!key) {
      return res.json({ success: false, error: "Please enter a license key code." });
    }

    const store = loadStore();
    const match = store.licenseKeys.find(k => k.key.toUpperCase() === key.trim().toUpperCase());

    if (!match) {
      return res.json({ success: false, error: "Invalid license key. Check format (VX-XXXX-XXXX-XXXX)." });
    }

    if (match.status !== "Active") {
      return res.json({ success: false, error: "This license key code has been disabled by system operations." });
    }

    const isExpired = new Date(match.expiryDate) < new Date();
    if (isExpired) {
      return res.json({ success: false, error: "This key has expired on " + match.expiryDate });
    }

    if (match.uses >= match.maxUses) {
      return res.json({ success: false, error: "License limit reached (" + match.uses + "/" + match.maxUses + " uses)." });
    }

    match.uses += 1;
    saveStore(store);
    res.json({ success: true });
  });

  // Dev server Setup or Prod Build serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
