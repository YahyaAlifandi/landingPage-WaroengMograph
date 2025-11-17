import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Explicit CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// Serve static files from the public directory
const reactPublicPath = path.join(__dirname, "../public");
app.use("/image", express.static(path.join(reactPublicPath, "image")));
app.use("/file", express.static(path.join(reactPublicPath, "file")));

// MULTER UPLOAD SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.fieldname === "image";
    const uploadPath = path.join(reactPublicPath, isImage ? "image" : "file");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `preset-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") {
      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only PNG or JPEG images are allowed"));
      }
    } else if (file.fieldname === "presetFile") {
      const allowedTypes = ["text/xml", "application/zip", "image/png", "image/jpeg"];
      const allowedExts = [".xml", ".zip", ".png", ".jpeg", ".jpg"];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedTypes.includes(file.mimetype) || !allowedExts.includes(ext)) {
        return cb(new Error("Only XML, ZIP, PNG, or JPEG files are allowed for preset"));
      }
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for both
});

// CRUD JSON
const jsonFilePath = path.join(reactPublicPath, "data", "preset.json");

// Initialize preset.json if it doesn't exist
if (!fs.existsSync(jsonFilePath)) {
  fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
  fs.writeFileSync(jsonFilePath, JSON.stringify([], null, 2));
}

// READ ALL PRESETS
app.get("/presets", (req, res) => {
  console.log(`GET /presets from ${req.ip}`);
  try {
    const data = fs.readFileSync(jsonFilePath, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading presets:", err);
    res.status(500).json({ error: "Failed to read presets" });
  }
});

// CREATE PRESET WITH IMAGE AND PRESET FILE
app.post(
  "/preset",
  upload.fields([{ name: "image" }, { name: "presetFile" }]),
  (req, res) => {
    console.log(`POST /preset from ${req.ip}`);
    try {
      const { title, subtitle, kategori, size, format, type, author_url } = req.body;
      const files = req.files;
      if (!files || !files.image || !files.presetFile) {
        return res.status(400).json({ error: "Image and preset file are required" });
      }

      // Validate required fields
      if (
        !title ||
        !subtitle ||
        !kategori ||
        !size ||
        !format ||
        !type ||
        !author_url ||
        !files.image.length ||
        !files.presetFile.length
      ) {
        return res.status(400).json({
          error: "All fields, an image, and a preset file are required",
        });
      }

      // Validate size format
      const sizeRegex = /^\d+(\.\d+)?\s*(KB|MB)$/i;
      if (!sizeRegex.test(size)) {
        return res.status(400).json({
          error: "Size must be in format 'number KB' or 'number MB'",
        });
      }

      // Validate author_url
      const validatedUrl = author_url.startsWith("http") ? author_url : `https://${author_url}`;
      try {
        new URL(validatedUrl);
      } catch {
        return res.status(400).json({ error: "Author URL must be a valid URL" });
      }

      // Read existing presets
      const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

      // Generate new ID
      const newId = data.length > 0 ? Math.max(...data.map((p) => p.id)) + 1 : 1;

      // Create new preset
      const newPreset = {
        id: newId,
        title,
        subtitle,
        kategori,
        size,
        format,
        type,
        img_url: `/image/${files.image[0].filename}`,
        file_url: `/file/${files.presetFile[0].filename}`,
        author_url,
      };

      // Add to presets and save
      data.push(newPreset);
      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));

      res.json({ message: "Preset created successfully", preset: newPreset });
    } catch (err) {
      console.error("Error creating preset:", err);
      res.status(500).json({ error: err.message || "Failed to create preset" });
    }
  }
);

// UPDATE PRESET BY ID
app.put(
  "/preset/:id",
  upload.fields([{ name: "image" }, { name: "presetFile" }]),
  (req, res) => {
    console.log(`PUT /preset/${req.params.id} from ${req.ip}`);
    try {
      const id = Number(req.params.id);
      const { title, subtitle, kategori, size, format, type, author_url } = req.body;
      const files = req.files;

      let data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
      const presetIndex = data.findIndex((p) => p.id === id);

      if (presetIndex === -1) {
        return res.status(404).json({ error: "Preset not found" });
      }

      // Validate size format if provided
      if (size && !/^\d+(\.\d+)?\s*(KB|MB)$/i.test(size)) {
        return res.status(400).json({
          error: "Size must be in format 'number KB' or 'number MB'",
        });
      }

      // Validate author_url if provided
      if (author_url) {
        const validatedUrl = author_url.startsWith("http") ? author_url : `https://${author_url}`;
        try {
          new URL(validatedUrl);
        } catch {
          return res.status(400).json({ error: "Author URL must be a valid URL" });
        }
      }

      // Update preset
      data[presetIndex] = {
        ...data[presetIndex],
        title: title || data[presetIndex].title,
        subtitle: subtitle || data[presetIndex].subtitle,
        kategori: kategori || data[presetIndex].kategori,
        size: size || data[presetIndex].size,
        format: format || data[presetIndex].format,
        type: type || data[presetIndex].type,
        author_url: author_url || data[presetIndex].author_url,
        img_url: files && files.image ? `/image/${files.image[0].filename}` : data[presetIndex].img_url,
        file_url: files && files.presetFile ? `/file/${files.presetFile[0].filename}` : data[presetIndex].file_url,
      };

      fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
      res.json({ message: "Preset updated successfully" });
    } catch (err) {
      console.error("Error updating preset:", err);
      res.status(500).json({ error: "Failed to update preset" });
    }
  }
);

// DELETE PRESET BY ID
app.delete("/preset/:id", (req, res) => {
  console.log(`DELETE /preset/${req.params.id} from ${req.ip}`);
  try {
    const id = Number(req.params.id);
    let data = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    const presetIndex = data.findIndex((p) => p.id === id);

    if (presetIndex === -1) {
      return res.status(404).json({ error: "Preset not found" });
    }

    // Delete associated files
    const imgPath = path.join(reactPublicPath, data[presetIndex].img_url);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
    const filePath = path.join(reactPublicPath, data[presetIndex].file_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    data.splice(presetIndex, 1);
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    res.json({ message: "Preset deleted successfully" });
  } catch (err) {
    console.error("Error deleting preset:", err);
    res.status(500).json({ error: "Failed to delete preset" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  console.log(`GET /health from ${req.ip}`);
  res.json({ status: "Server is running" });
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});