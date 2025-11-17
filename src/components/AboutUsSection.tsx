import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaHistory, FaRocket, FaUserTie } from 'react-icons/fa';

// Define the type for tab IDs
type TabId = 'about' | 'history' | 'founders' | 'mission';

// Define the type for content structure
interface ContentItem {
  title: string;
  description: string;
  highlight: string;
}

interface Content {
  about: ContentItem;
  history: ContentItem;
  founders: ContentItem;
  mission: ContentItem;
}

export default function AboutUsSection() {
  // Use the TabId type for the activeTab state
  const [activeTab, setActiveTab] = useState<TabId>('about');

  const tabs = [
    { id: 'about' as TabId, label: 'Tentang Kami', icon: FaInfoCircle },
    { id: 'history' as TabId, label: 'Sejarah', icon: FaHistory },
    { id: 'founders' as TabId, label: 'Pendiri', icon: FaUserTie },
    { id: 'mission' as TabId, label: 'Misi & Visi', icon: FaRocket }
  ];

  // Type the content object with the Content interface
  const content: Content = {
    about: {
      title: 'Siapa Kami',
      description: 'Kami adalah komunitas kreatif yang berdedikasi untuk mengembangkan keterampilan dan pengetahuan di bidang desain grafis, animasi, dan multimedia. Dengan semangat kolaborasi, kami menciptakan ruang bagi para profesional dan pemula untuk belajar, berbagi, dan berinovasi.',
      highlight: 'Bergabunglah dengan kami untuk menjelajahi dunia kreatif yang penuh inspirasi!'
    },
    history: {
      title: 'Perjalanan Kami',
      description: 'Dimulai pada tahun 2024, komunitas kami terbentuk dari sekelompok desainer dan animator yang memiliki visi sama untuk menciptakan ekosistem kreatif yang inklusif. Dari pertemuan kecil hingga menjadi komunitas dengan ratusan anggota aktif, kami terus berkembang dan berinovasi.',
      highlight: 'Lebih dari 80+ anggota aktif telah bergabung dalam perjalanan kreatif kami.'
    },
    founders: {
      title: 'Tim Pendiri',
      description: 'Komunitas kami didirikan oleh tiga profesional kreatif: Alex Pratama (Creative Director), Sarah Indah (Lead Animator), dan Budi Santoso (Design Strategist). Dengan pengalaman gabungan lebih dari 20 tahun di industri kreatif, mereka membawa visi untuk membangun komunitas yang mendukung pertumbuhan setiap anggotanya.',
      highlight: 'Dipimpin oleh para ahli dengan passion untuk berbagi pengetahuan.'
    },
    mission: {
      title: 'Misi & Visi Kami',
      description: 'Visi kami adalah menjadi komunitas kreatif terdepan di Indonesia yang menginspirasi dan memberdayakan talenta-talenta baru. Misi kami adalah menyediakan platform pembelajaran, kolaborasi, dan networking yang berkualitas bagi semua anggota, dari pemula hingga profesional.',
      highlight: 'Memberdayakan 1000+ kreator dalam 5 tahun ke depan.'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="bg-linear-to-br from-green-50 via-white to-green-50/30 px-6 sm:px-10 py-16" id="about">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-center mb-12">
          <div className="bg-linear-to-r from-green-400/20 to-green-300/20 p-3 rounded-2xl backdrop-blur-sm border border-green-200/50 shadow-lg shadow-green-100/50">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-green-400 to-green-500 rounded-xl p-3 shadow-lg">
                <FaInfoCircle className="text-white size-4 sm:size-6" />
              </div>
              <h2 className="text-green-500 text-xl sm:text-3xl pr-4">
                Tentang Komunitas
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="flex justify-center items-center mb-8">
          <div className="flex flex-wrap justify-center max-w-min min-w-max bg-white backdrop-blur-sm rounded-2xl border border-gray-200/50 p-3 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-linear-to-r from-green-400 to-green-500 rounded-xl shadow-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`size-5 relative z-10 ${activeTab === tab.id ? 'text-white' : ''}`} />
                  <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200"
          >
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-gray-800 mb-6"
            >
              {content[activeTab].title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg leading-relaxed mb-6"
            >
              {content[activeTab].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-linear-to-r from-green-50 to-green-100/50 border-l-4 border-green-400 p-6 rounded-r-2xl"
            >
              <p className="text-green-700 font-semibold text-lg">
                {content[activeTab].highlight}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.a
                href="#"
                className="bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-green-400/30 transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(74, 222, 128, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Bergabung Sekarang
              </motion.a>
              <motion.a
                href="#"
                className="bg-white hover:bg-gray-50 text-green-600 font-semibold px-8 py-3.5 rounded-full border-2 border-green-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pelajari Lebih Lanjut
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
        >
          {[
            { number: '80+', label: 'Anggota Aktif' },
            { number: '5', label: 'Workshop Diadakan' },
            { number: '10+', label: 'Proyek Kolaborasi' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 text-center border border-gray-200"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                className="text-4xl font-bold text-green-500 mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}