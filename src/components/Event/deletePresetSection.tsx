import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiEdit2, FiDownload, FiInfo, FiX, FiCheck, FiPlus, FiSearch, FiFilter, FiGrid, FiList } from "react-icons/fi";

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

export default function DeletePreset() {
  const [data, setData] = useState<Preset[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const dataPreset = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/presets`);
        if (!response.ok) {
          throw new Error("Failed to fetch presets");
        }
        const result = await response.json();
        setData(result.data || result);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };
    dataPreset();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/preset/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete preset");
      }

      setData(prev => prev.filter(item => item.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.message || "An error occurred while deleting");
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Filter data based on search and category
  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.kategori.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(data.map(item => item.kategori)))];

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-green-300 border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-red-500 text-center p-6 bg-red-50 rounded-xl border border-red-200"
    >
      <FiInfo className="mx-auto text-2xl mb-2" />
      <p className="font-medium">Error: {error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Preset Manager</h2>
            <p className="text-gray-600 mt-1">Manage your design presets efficiently</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search presets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {viewMode === "grid" ? <FiList size={20} /> : <FiGrid size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredData.length} of {data.length} presets
          </span>
          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
            {data.length} total
          </span>
        </div>
      </motion.div>
      
      {filteredData.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <div className="mb-4">
            <FiInfo className="mx-auto text-6xl text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No presets found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="px-6 py-3 bg-green-300 text-green-800 rounded-xl hover:bg-green-400 transition-colors font-medium"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredData.map((item, index) => (
              <motion.div
                key={`${item.id}-${viewMode}`}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group`}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar Placeholder */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-200 to-green-300 rounded-xl flex items-center justify-center"
                  >
                    <span className="text-green-800 font-bold text-lg">
                      {item.title.charAt(0).toUpperCase()}
                    </span>
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-800 text-lg truncate group-hover:text-green-600 transition-colors">
                        {item.title}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'xml' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{item.subtitle}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-3 py-1.5 bg-green-100 text-green-800 rounded-full font-medium">
                    {item.kategori}
                  </span>
                  <span className="text-xs px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {item.format}
                  </span>
                  <span className="text-xs px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full font-medium">
                    {item.size}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => console.log('Edit:', item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-300 text-green-800 rounded-xl hover:bg-green-400 transition-colors font-medium"
                  >
                    <FiEdit2 size={16} />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDeleteClick(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                  >
                    <FiTrash2 size={16} />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Konfirmasi Hapus */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <FiTrash2 className="text-red-600" size={24} />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
                  <p className="text-gray-600 text-sm">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this preset? All associated data will be permanently removed.
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                >
                  <FiCheck size={16} />
                  <span>Delete</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cancelDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                >
                  <FiX size={16} />
                  <span>Cancel</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}