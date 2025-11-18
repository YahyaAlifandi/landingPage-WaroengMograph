import { useState } from "react";
import type { FormEvent } from "react";
import { FiUpload, FiCheck, FiX, FiMenu, FiList } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { FaMagic, FaStar, FaPlus } from "react-icons/fa";
import DeletePreset from "../../components/Event/deletePresetSection";

//@ts-ignore
interface Preset {
  id: number;
  title: string;
  subtitle: string;
  kategori: string;
  size: string;
  format: string;
  img_url: string;
  type: string;
  file_url: string;
  author_url: string;
}

export default function TambahPreset() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    kategori: "",
    size: "",
    format: "",
    type: "",
    author_url: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [presetFile, setPresetFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Only PNG or JPEG images are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handlePresetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = [".xml", ".zip", ".png", ".jpeg", ".jpg"];
      const fileExtension = file.name
        .toLowerCase()
        .slice(file.name.lastIndexOf("."));
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Only XML, ZIP, PNG, or JPEG files are allowed for preset.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Preset file size must be less than 10MB.");
        return;
      }
      setPresetFile(file);
      setError(null);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.kategori ||
      !formData.size ||
      !formData.format ||
      !formData.type ||
      !formData.author_url ||
      !image ||
      !presetFile
    ) {
      setError("All fields, an image, and a preset file are required.");
      return;
    }

    const sizeRegex = /^\d+(\.\d+)?\s*(KB|MB)$/i;
    if (!sizeRegex.test(formData.size)) {
      setError(
        "Size must be in format 'number KB' or 'number MB' (e.g., '500 KB')."
      );
      return;
    }

    const validatedUrl = formData.author_url.startsWith("http")
      ? formData.author_url
      : `https://${formData.author_url}`;
    try {
      new URL(validatedUrl);
    } catch {
      setError(
        "Author URL must be a valid URL (e.g., https://www.tiktok.com/@user)."
      );
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("kategori", formData.kategori);
    data.append("size", formData.size);
    data.append("format", formData.format);
    data.append("type", formData.type);
    data.append("author_url", formData.author_url);
    if (image) data.append("image", image);
    if (presetFile) data.append("presetFile", presetFile);

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://192.168.50.136:4000";
      console.log("Fetching:", `${apiUrl}/preset`);
      const response = await fetch(`${apiUrl}/preset`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("Fetch error:", result);
        throw new Error(result.error || "Failed to create preset");
      }

      setSuccess("Preset created successfully!");
      setFormData({
        title: "",
        subtitle: "",
        kategori: "",
        size: "",
        format: "",
        type: "",
        author_url: "",
      });
      setImage(null);
      setPresetFile(null);
      setImagePreview(null);
      (document.getElementById("image-input") as HTMLInputElement).value = "";
      (document.getElementById("preset-file-input") as HTMLInputElement).value =
        "";
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the server. Check network or server status."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-50 p-4 sm:p-5">
      <div className="flex flex-col items-center w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -3 }}
          className="w-full max-w-lg bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-lg m-2 p-5 relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-green-200 rounded-full opacity-30"></div>
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-emerald-200 rounded-full opacity-30"></div>

          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="p-2.5 bg-green-100 rounded-lg text-green-600"
            >
              <FaMagic size={24} />
            </motion.div>

            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="text-2xl font-bold text-gray-800 flex items-center gap-1.5"
              >
                Tambah Preset
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    repeatDelay: 0.5,
                  }}
                >
                  <FaStar className="text-yellow-400" />
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-gray-600 text-sm mt-0.5"
              >
                Buat preset animasi dengan mengisi form di bawah ini.
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg shadow-sm text-sm font-medium"
            >
              <FaPlus size={14} />
              <span>Cepat</span>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-3 right-3"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="px-2 py-0.5 bg-green-100 text-green-800 text-[0.6rem] font-semibold rounded-full"
            >
              Baru
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-lg p-5 sm:p-6 mt-2"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Animation Logo"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="e.g., Preset simple animation logo"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Motion Graphic">Motion Graphic</option>
                  <option value="JJ">JJ</option>
                  <option value="Animation">Animation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all"
                >
                  <option value="">Select Format</option>
                  <option value="PNG">PNG</option>
                  <option value="MP4">MP4</option>
                  <option value="Image">Image</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size (e.g., 500 KB)
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 500 KB"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all"
                >
                  <option value="">Select Type</option>
                  <option value="xml">XML</option>
                  <option value="align">Align Link</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author URL (e.g., TikTok profile)
              </label>
              <input
                type="text"
                name="author_url"
                value={formData.author_url}
                onChange={handleInputChange}
                placeholder="e.g., https://www.tiktok.com/@user"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-green-300 border-dashed rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 mb-2 text-green-500" />
                    <p className="mb-2 text-sm text-green-600">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-green-500">
                      PNG or JPEG (max. 5MB)
                    </p>
                  </div>
                  <input
                    id="image-input"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {image && (
                <div className="mt-3">
                  <p className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                    Selected: {image.name}
                  </p>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg border border-green-200"
                    />
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preset File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-green-300 border-dashed rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 mb-2 text-green-500" />
                    <p className="mb-2 text-sm text-green-600">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-green-500">
                      XML, ZIP, PNG, or JPEG (max. 10MB)
                    </p>
                  </div>
                  <input
                    id="preset-file-input"
                    type="file"
                    accept=".xml,.zip,image/png,image/jpeg"
                    onChange={handlePresetFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {presetFile && (
                <div className="mt-3">
                  <p className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded inline-block">
                    Selected: {presetFile.name}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-red-500 text-sm bg-red-50 p-2.5 rounded-lg"
              >
                <FiX className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-green-600 text-sm bg-green-50 p-2.5 rounded-lg"
              >
                <FiCheck className="mr-2 flex-shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

<div className="flex flex-col sm:flex-row gap-3 mt-6">
              {/* Tombol Create Preset */}
              <motion.button
                type="submit"
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <motion.span
                  initial={false}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="mr-2"
                >
                  <FiCheck size={18} />
                </motion.span>
                Create Preset
              </motion.button>

              {/* Tombol List Preset */}
              <motion.a
                href="/event/free-preset/"
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium text-sm flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <motion.span
                  initial={false}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="mr-2"
                >
                  <FiList size={18} />
                </motion.span>
                List Preset
              </motion.a>
            </div>
          </form>
        </motion.div>
      </div>
      {/* <div className="hidden sm:max-w-lg sm:block fixed top-4 left-4 bottom-4 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-lg p-5 sm:p-6 z-10">
        <DeletePreset />
      </div> */}

      {/* Tombol Toggle untuk layar < sm */}
      <div className=" fixed top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-green-400 text-white rounded-lg shadow-md"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay untuk layar < sm */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className=" fixed inset-0 bg-black/20 z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className=" fixed top-0 left-0 bottom-0 w-80 sm:w-5xl bg-white shadow-xl z-40 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiList size={18} className="text-gray-600" />
                    Preset List
                  </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
                  aria-label="Close sidebar"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <DeletePreset />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
