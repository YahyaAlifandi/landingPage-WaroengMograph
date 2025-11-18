import { useState, useEffect } from "react";
import { FiArrowLeft, FiHardDrive, FiPlus } from "react-icons/fi";
import FilterPanel from "../../components/Event/FilterComponents";
import { HiOutlineCube } from "react-icons/hi";

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

interface Card {
  id: number;
  title: string;
  description: string;
  tags: string[];
  author: string;
  size: string;
  sizeInMB: number;
  image: string;
  type: string;
  kategori: string;
  format: string;
  file_url: string;
  author_url: string;
}

export default function FreePreset() {
  const [cards, setCards] = useState<Card[]>([]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const convertSizeToMB = (size: string): number => {
    const match = size.match(/(\d+(\.\d+)?)\s*(KB|MB)/i);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[3].toUpperCase();
    return unit === "MB" ? value : value / 1024;
  };

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const isDev = String(import.meta.env.VITE_DEVELOPMENT) === "true";
        const API_URL = import.meta.env.VITE_API_URL as string;

        let presets: Preset[] = [];

        if (isDev) {
          // Development: ambil dari API
          const response = await fetch(`${API_URL}/presets`);
          if (!response.ok) throw new Error("Failed to fetch from API");
          const data = await response.json();
          presets = Array.isArray(data) ? data : data.presets || [];
        } else {
          // Production: ambil dari public/data/preset.json
          const response = await fetch("/data/preset.json");
          if (!response.ok) throw new Error("Failed to load local JSON");
          const data = await response.json();
          presets = Array.isArray(data) ? data : data.presets || [];
        }

        if (presets.length === 0) {
          setCards([]);
          setOriginalCards([]);
          setLoading(false);
          return;
        }

        const mappedCards: Card[] = presets.map((preset) => {
          // Path sudah benar: /image/xxx.jpg dan /file/xxx.jpg
          // Baik dev maupun prod, Vite akan serve dari folder public
          const imageUrl = preset.img_url.startsWith("http")
            ? preset.img_url
            : preset.img_url; // sudah lengkap: /image/...

          const fileUrl = preset.file_url.startsWith("http")
            ? preset.file_url
            : preset.file_url; // sudah lengkap: /file/...

          return {
            id: preset.id,
            title: preset.title,
            description: preset.subtitle,
            tags: [preset.kategori, preset.type, "Free"],
            author: "User",
            size: preset.size,
            sizeInMB: convertSizeToMB(preset.size),
            image: imageUrl,
            type: preset.type,
            kategori: preset.kategori,
            format: preset.format.toLowerCase(),
            file_url: fileUrl,
            author_url: preset.author_url || "#",
          };
        });

        const uniqueCategories = [...new Set(presets.map((p) => p.kategori))];

        setCards(mappedCards);
        setOriginalCards(mappedCards);
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  const handleFilterChange = (filters: {
    search: string;
    type: "xml" | "align" | "";
    kategori: string;
    format: string[];
    size: number;
  }) => {
    let filteredCards = [...originalCards];

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      filteredCards = filteredCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchLower) ||
          card.author.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      filteredCards = filteredCards.filter(
        (card) => card.type === filters.type
      );
    }

    if (filters.kategori) {
      filteredCards = filteredCards.filter(
        (card) => card.kategori === filters.kategori
      );
    }

    if (filters.format.length > 0) {
      filteredCards = filteredCards.filter((card) =>
        filters.format.includes(card.format)
      );
    }

    const maxSizeMB = (filters.size / 100) * 5;
    filteredCards = filteredCards.filter((card) => card.sizeInMB <= maxSizeMB);

    setCards(filteredCards);
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "preset";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hapus blob URL untuk menghindari memory leak
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleSupport = (authorUrl: string) => {
    window.open(authorUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="bg-white flex items-center justify-between gap-4 border border-gray-200 rounded-xl p-3 sm:p-4 mb-5">
          {/* Tombol Kembali */}
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 active:ring-2 active:ring-offset-2 active:ring-green-300 rounded-lg p-2 duration-200"
          >
            <FiArrowLeft className="text-lg" />
            <span className="font-medium hidden sm:inline text-sm">
              Kembali
            </span>
          </button>

          {/* Judul Utama & Ikon Dekoratif */}
          <div className="flex items-center gap-2 justify-center">
            <HiOutlineCube className="text-xl text-gray-500" />
            <h1 className="text-lg font-semibold text-gray-800">
              Free Presets
            </h1>
          </div>

          {/* Tombol Tambah Data */}
          {String(import.meta.env.VITE_DEVELOPMENT) === "true" && (
            <a
              href="/event/free-preset/add-preset"
              className="flex items-center gap-2 bg-green-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-600 duration-200 active:scale-[0.98]"
            >
              <FiPlus className="text-sm" />
              <span className="hidden sm:inline">Tambah</span>
            </a>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-1/4">
            <FilterPanel
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </aside>
          <main className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-600 text-sm sm:text-base">
                  Loading presets...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500 text-sm sm:text-base">{error}</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600 text-sm sm:text-base">
                  No presets found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-95"
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-32 sm:h-40 object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          const img = e.currentTarget;
                          // Cegah infinite loop
                          if (!img.dataset.error) {
                            img.dataset.error = "true";
                            img.src = "/images/fallback.jpg"; // pastikan file ini ADA di public/images/
                          }
                        }}
                      />
                      <span className="absolute top-1.5 right-1.5 bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    </div>

                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                          {card.title}
                        </h2>
                        <div className="flex items-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center mr-1">
                            <span className="text-[10px] sm:text-xs font-bold text-white">
                              {card.author.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[100px] sm:max-w-[120px]">
                            {card.author}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-3">
                        {card.description}
                      </p>

                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-green-50 text-green-700 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                        <div className="flex items-center">
                          <FiHardDrive className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{card.size}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleDownload(card.file_url, card.title)
                          }
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 hover:shadow-md active:bg-green-700"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleSupport(card.author_url)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 hover:shadow-md active:bg-gray-700"
                        >
                          Support
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
