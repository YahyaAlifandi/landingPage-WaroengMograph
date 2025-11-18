import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiRefreshCcw, FiCheck, FiFilter, FiX as FiClose } from 'react-icons/fi';

interface FilterState {
  search: string;
  type: 'xml' | 'align' | '';
  kategori: string;
  format: string[];
  size: number;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    kategori: '',
    format: [],
    size: 50,
  });
  
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleTypeChange = (value: 'xml' | 'align') => {
    setFilters(prev => ({ ...prev, type: value }));
  };

  const handleKategoriChange = (value: string) => {
    setFilters(prev => ({ ...prev, kategori: value }));
  };

  const handleFormatChange = (value: string) => {
    setFilters(prev => {
      const newFormats = prev.format.includes(value)
        ? prev.format.filter(format => format !== value)
        : [...prev.format, value];
      return { ...prev, format: newFormats };
    });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const snapThreshold = 5;
    let newValue = value;
    
    const checkpoints = [0, 1, 2, 3, 4, 5];
    const percentages = checkpoints.map(mb => (mb / 5) * 100);
    
    let closest = value;
    let minDiff = snapThreshold + 1;
    
    for (const percentage of percentages) {
      const diff = Math.abs(value - percentage);
      if (diff < minDiff) {
        minDiff = diff;
        closest = percentage;
      }
    }
    
    if (minDiff <= snapThreshold) {
      newValue = closest;
    }
    
    setFilters(prev => ({ ...prev, size: newValue }));
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: '' as 'xml' | 'align' | '',
      kategori: '',
      format: [],
      size: 50,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleApply = () => {
    onFilterChange(filters);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const sizeInMB = (percentage: number) => {
    return (percentage / 100) * 5;
  };

  const percentageFromMB = (mb: number) => {
    return (mb / 5) * 100;
  };

  const checkpoints = [0, 1, 2, 3, 4, 5];

  if (isMobile) {
    return (
      <>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg"
        >
          <FiFilter size={20} />
        </motion.button>

        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-50"
                onClick={() => setIsSidebarOpen(false)}
              />
              
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 p-5 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiClose size={20} />
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search by author or name"
                        value={filters.search}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200 shadow-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Type</label>
                    <div className="flex space-x-4">
                      {[
                        { value: 'xml', label: 'XML' },
                        { value: 'align', label: 'Align Link' }
                      ].map((option) => (
                        <label 
                          key={option.value} 
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="type"
                            value={option.value}
                            checked={filters.type === option.value}
                            onChange={() => handleTypeChange(option.value as 'xml' | 'align')}
                            className="sr-only"
                          />
                          <div 
                            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200 group-hover:border-green-300 ${
                              filters.type === option.value 
                                ? 'border-green-500 bg-green-500' 
                                : 'border-gray-300'
                            }`}
                          >
                            {filters.type === option.value && (
                              <FiCheck className="text-white text-xs" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Kategori</label>
                    <div className="flex flex-wrap gap-3">
                      {categories.map((category) => (
                        <label 
                          key={category} 
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="kategori"
                            value={category}
                            checked={filters.kategori === category}
                            onChange={() => handleKategoriChange(category)}
                            className="sr-only"
                          />
                          <div 
                            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200 group-hover:border-green-300 ${
                              filters.kategori === category 
                                ? 'border-green-500 bg-green-500' 
                                : 'border-gray-300'
                            }`}
                          >
                            {filters.kategori === category && (
                              <FiCheck className="text-white text-xs" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-800">Format</label>
                    <div className="flex flex-wrap gap-3">
                      {['MP4', 'Image', 'PNG'].map((format) => (
                        <label 
                          key={format} 
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={filters.format.includes(format.toLowerCase())}
                            onChange={() => handleFormatChange(format.toLowerCase())}
                            className="sr-only"
                          />
                          <div 
                            className={`flex items-center justify-center w-5 h-5 rounded border-2 mr-2 transition-all duration-200 group-hover:border-green-300 ${
                              filters.format.includes(format.toLowerCase()) 
                                ? 'border-green-500 bg-green-500' 
                                : 'border-gray-300'
                            }`}
                          >
                            {filters.format.includes(format.toLowerCase()) && (
                              <FiCheck className="text-white text-xs" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{format}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-800">Size</label>
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {sizeInMB(filters.size).toFixed(1)} MB
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="w-full h-6 rounded-full bg-gray-200 relative overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-300 to-green-500 rounded-full transition-all duration-200"
                          style={{ width: `${filters.size}%` }}
                        />
                        {checkpoints.map((mb) => (
                          <div
                            key={mb}
                            className={`absolute top-1/2 transform -translate-y-1/2 w-1 h-3 rounded-full ${
                              percentageFromMB(mb) <= filters.size 
                                ? 'bg-white z-10' 
                                : 'bg-gray-400'
                            }`}
                            style={{ left: `${percentageFromMB(mb)}%` }}
                          />
                        ))}
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filters.size}
                          onChange={handleSizeChange}
                          className="absolute top-0 left-0 w-full h-full appearance-none cursor-pointer accent-green-500 opacity-0"
                        />
                        <div 
                          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full shadow-md border-2 border-white cursor-pointer z-20 transition-transform hover:scale-110"
                          style={{ left: `calc(${filters.size}% - 12px)` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                            {sizeInMB(filters.size).toFixed(1)} MB
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0 MB</span>
                        <span>5 MB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleApply}
                    className="px-5 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <FiCheck className="mr-2" />
                    Apply Filter
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleReset}
                    className="px-5 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <FiRefreshCcw className="mr-2" />
                    Reset All
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg p-5 w-full"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by author or name"
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">Type</label>
          <div className="flex space-x-4">
            {[
              { value: 'xml', label: 'XML' },
              { value: 'align', label: 'Align Link' }
            ].map((option) => (
              <label 
                key={option.value} 
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="type"
                  value={option.value}
                  checked={filters.type === option.value}
                  onChange={() => handleTypeChange(option.value as 'xml' | 'align')}
                  className="sr-only"
                />
                <div 
                  className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200 group-hover:border-green-300 ${
                    filters.type === option.value 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {filters.type === option.value && (
                    <FiCheck className="text-white text-xs" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">Kategori</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <label 
                key={category} 
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="kategori"
                  value={category}
                  checked={filters.kategori === category}
                  onChange={() => handleKategoriChange(category)}
                  className="sr-only"
                />
                <div 
                  className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200 group-hover:border-green-300 ${
                    filters.kategori === category 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {filters.kategori === category && (
                    <FiCheck className="text-white text-xs" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">Format</label>
          <div className="flex flex-wrap gap-3">
            {['MP4', 'Image', 'PNG'].map((format) => (
              <label 
                key={format} 
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.format.includes(format.toLowerCase())}
                  onChange={() => handleFormatChange(format.toLowerCase())}
                  className="sr-only"
                />
                <div 
                  className={`flex items-center justify-center w-5 h-5 rounded border-2 mr-2 transition-all duration-200 group-hover:border-green-300 ${
                    filters.format.includes(format.toLowerCase()) 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {filters.format.includes(format.toLowerCase()) && (
                    <FiCheck className="text-white text-xs" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">{format}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-800">Size</label>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {sizeInMB(filters.size).toFixed(1)} MB
            </span>
          </div>
          <div className="relative pt-1">
            <div className="w-full h-6 rounded-full bg-gray-200 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-300 to-green-500 rounded-full transition-all duration-200"
                style={{ width: `${filters.size}%` }}
              />
              {checkpoints.map((mb) => (
                <div
                  key={mb}
                  className={`absolute top-1/2 transform -translate-y-1/2 w-1 h-3 rounded-full ${
                    percentageFromMB(mb) <= filters.size 
                      ? 'bg-white z-10' 
                      : 'bg-gray-400'
                  }`}
                  style={{ left: `${percentageFromMB(mb)}%` }}
                />
              ))}
              <input
                type="range"
                min="0"
                max="100"
                value={filters.size}
                onChange={handleSizeChange}
                className="absolute top-0 left-0 w-full h-full appearance-none cursor-pointer accent-green-500 opacity-0"
              />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full shadow-md border-2 border-white cursor-pointer z-20 transition-transform hover:scale-110"
                style={{ left: `calc(${filters.size}% - 12px)` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                  {sizeInMB(filters.size).toFixed(1)} MB
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 MB</span>
              <span>5 MB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleApply}
          className="flex-1 px-5 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
        >
          <FiCheck className="mr-2" />
          Apply Filter
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleReset}
          className="flex-1 px-5 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
        >
          <FiRefreshCcw className="mr-2" />
          Reset All
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FilterPanel;