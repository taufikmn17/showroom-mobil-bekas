import React, { useState, useEffect } from "react";
import { SHEET_API_URL } from "./config";

function App() {
  const [selectedBrand, setSelectedBrand] = useState("Semua");
  const [carsData, setCarsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // State untuk membuka/menutup menu mobile di Navbar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State untuk slider foto dummy di hero section
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
      title: "Sporty & Elegan",
    },
    {
      url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      title: "SUV Tangguh Segala Medan",
    },
    {
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      title: "Keluarga Nyaman & Luas",
    },
  ];

  // Efek untuk auto-slide hero section setiap 3 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextHeroSlide = () => {
    setHeroSlideIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const prevHeroSlide = () => {
    setHeroSlideIndex(
      (prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length
    );
  };

  const brands = [
    "Semua",
    "Toyota",
    "Honda",
    "Hyundai",
    "Mitsubishi",
    "Suzuki",
  ];

  useEffect(() => {
    if (!SHEET_API_URL || SHEET_API_URL.includes("MASUKKAN_URL")) {
      setErrorMessage("Gagal memuat data, silahkan muat ulang halaman");
      setLoading(false);
      return;
    }

    fetch(SHEET_API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCarsData(data);
        } else {
          setErrorMessage("Gagal memuat data, silahkan muat ulang halaman");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setErrorMessage("Gagal memuat data, silahkan muat ulang halaman");
        setLoading(false);
      });
  }, []);

  const getCarImages = (car) => {
    const images = [car.image1, car.image2, car.image3, car.image4, car.image5];
    const validImages = images.filter(
      (img) => img && String(img).trim() !== ""
    );
    return validImages.length > 0 ? validImages : ["🚗"];
  };

  const formatRupiah = (priceValue) => {
    if (!priceValue) return "Hubungi Kami";

    const cleanNumber = Number(String(priceValue).replace(/[^0-9]/g, ""));

    if (isNaN(cleanNumber) || cleanNumber === 0) {
      return priceValue;
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(cleanNumber);
  };

  const filteredCars =
    selectedBrand === "Semua"
      ? carsData
      : carsData.filter(
          (car) =>
            car.brand && car.brand.toLowerCase() === selectedBrand.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative">
      {/* 1. NAVBAR */}
      <nav className="bg-[#18181b] text-white px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold tracking-wide flex items-center gap-2">
            <span className="text-[#f8a720]">Showroom</span>Mobil
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-6 text-sm font-medium items-center">
            <a href="#home" className="hover:text-[#f8a720] transition">
              Beranda
            </a>
            <a href="#katalog" className="hover:text-[#f8a720] transition">
              Daftar Mobil
            </a>
            <a href="#kontak" className="hover:text-[#f8a720] transition">
              Kontak
            </a>
          </div>

          {/* Tombol Hamburger Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white focus:outline-none p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            aria-label="Toggle Menu"
          >
            <span className="text-xl">{isMobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Menu Dropdown Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800 flex flex-col space-y-3 pb-2 text-sm font-medium animate-fadeIn">
            <a
              href="#home"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#f8a720] transition py-1"
            >
              Beranda
            </a>
            <a
              href="#katalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#f8a720] transition py-1"
            >
              Daftar Mobil
            </a>
            <a
              href="#kontak"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#f8a720] transition py-1"
            >
              Kontak
            </a>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section
        id="home"
        className="relative bg-[#18181b] text-white py-20 px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="bg-[#f8a720] text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Showroom Mobil Bekas Berkualitas
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Temukan Mobil Impian Anda dengan{" "}
              <span className="text-[#f8a720]">Mudah & Aman</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg">
              Koleksi mobil bekas pilihan terbaik dengan kondisi prima, siap
              pakai, dan harga bersaing. Klik mobil untuk melihat detail dan
              galeri foto lengkapnya.
            </p>
            <div className="flex gap-4">
              <a
                href="#katalog"
                className="bg-[#f8a720] hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition shadow-lg"
              >
                Lihat Katalog Mobil
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-600 hover:border-white text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                Tanya via WhatsApp
              </a>
            </div>
          </div>

          {/* Slider Foto Dummy Hero Section */}
          <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl h-72 md:h-96 flex flex-col items-center justify-center group">
            {/* Gambar Slide */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={heroImages[heroSlideIndex].url}
                alt="Hero Slide"
                className="w-full h-full object-cover transition-all duration-700 ease-in-out brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-white font-bold text-lg drop-shadow-md">
                  {heroImages[heroSlideIndex].title}
                </p>
              </div>
            </div>

            {/* Tombol Navigasi Kiri */}
            <button
              onClick={prevHeroSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg text-xl font-bold z-10 pb-1 pl-0.5"
            >
              ‹
            </button>

            {/* Tombol Navigasi Kanan */}
            <button
              onClick={nextHeroSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg text-xl font-bold z-10 pb-1 pr-0.5"
            >
              ›
            </button>

            {/* Indikator Dots */}
            <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    heroSlideIndex === idx ? "bg-[#f8a720] w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION KATALOG & FILTER */}
      <section id="katalog" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Daftar Mobil Pilihan
          </h2>
          <p className="text-gray-600 mt-2">
            Filter berdasarkan merek favorit Anda di bawah ini
          </p>
        </div>

        {/* Tombol Filter Merek */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                selectedBrand === brand
                  ? "bg-[#f8a720] text-gray-900 shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Grid Katalog Mobil / Status Pesan */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium animate-pulse">
              Memuat data mobil dari Google Sheets...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="text-center py-16 bg-red-50 border border-red-200 rounded-2xl max-w-xl mx-auto p-6 space-y-3">
            <p className="text-3xl">⚠️</p>
            <p className="text-lg font-bold text-red-600">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow"
            >
              Muat Ulang Halaman
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCars.length > 0 ? (
              filteredCars.map((car, index) => {
                const carImages = getCarImages(car);
                return (
                  <div
                    key={car.id || index}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {String(carImages[0]).startsWith("http") ? (
                          <img
                            src={carImages[0]}
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-5xl">{carImages[0]}</span>
                        )}
                      </div>
                      <div className="p-5 space-y-3">
                        <span className="text-xs font-bold text-[#ec1b21] bg-red-50 px-2.5 py-1 rounded">
                          {car.brand}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {car.name}
                        </h3>
                        <p className="text-[#f8a720] font-extrabold text-lg">
                          {formatRupiah(car.price)}
                        </p>
                        <p className="text-sm text-gray-500">{car.specs}</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setActiveImageIndex(0);
                        }}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition shadow"
                      >
                        Lihat Selengkapnya
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p className="text-lg">
                  Belum ada unit tersedia untuk merek ini.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. MODAL DETAIL MOBIL */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#f8a720]">
                Detail Kendaraan
              </h3>
              <button
                onClick={() => setSelectedCar(null)}
                className="text-gray-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-inner border border-gray-200">
                {String(getCarImages(selectedCar)[activeImageIndex]).startsWith(
                  "http"
                ) ? (
                  <img
                    src={getCarImages(selectedCar)[activeImageIndex]}
                    alt={selectedCar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-7xl">
                    {getCarImages(selectedCar)[activeImageIndex]}
                  </span>
                )}
              </div>

              <div className="flex gap-2 justify-center">
                {getCarImages(selectedCar).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg bg-gray-100 border-2 overflow-hidden flex items-center justify-center transition ${
                      activeImageIndex === idx
                        ? "border-[#f8a720] shadow-md scale-105"
                        : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {String(img).startsWith("http") ? (
                      <img
                        src={img}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{img}</span>
                    )}
                  </button>
                ))}
              </div>

              <div>
                <span className="text-xs font-bold text-[#ec1b21] bg-red-50 px-2.5 py-1 rounded">
                  {selectedCar.brand}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {selectedCar.name}
                </h2>
                <p className="text-[#f8a720] font-extrabold text-xl mt-1">
                  {formatRupiah(selectedCar.price)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-sm">
                <p>
                  <strong className="text-gray-700">Spesifikasi:</strong>{" "}
                  {selectedCar.specs}
                </p>
                <p>
                  <strong className="text-gray-700">Keterangan:</strong>{" "}
                  {selectedCar.description ||
                    "Kondisi kendaraan sangat prima, siap test drive langsung di showroom."}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20mobil%20${encodeURIComponent(
                    selectedCar.name
                  )}%20harga%20${encodeURIComponent(
                    formatRupiah(selectedCar.price)
                  )}%20apakah%20unitnya%20masih%20tersedia?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full bg-[#ec1b21] hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg"
                >
                  Tanya / Beli via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER & MENU KONTAK */}
      <footer
        id="kontak"
        className="bg-[#18181b] text-gray-400 py-12 px-6 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
          {/* Kolom 1: Tentang Singkat */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-[#f8a720]">Showroom</span>Mobil
            </h3>
            <p className="text-sm">
              Pusat jual beli mobil bekas berkualitas, bergaransi, dan
              terpercaya. Melayani pembelian tunai dan konsultasi online.
            </p>
          </div>

          {/* Kolom 2: Informasi Kontak & Alamat */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base border-b border-gray-800 pb-2">
              Kontak & Alamat
            </h3>
            <p className="text-sm">
              📍 <strong className="text-white">Alamat:</strong> Jl. Raya
              Otomotif No. 88, Blok B5, Jepara
            </p>
            <p className="text-sm">
              📞 <strong className="text-white">Telp / WA:</strong>{" "}
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f8a720] transition"
              >
                +62 812-3456-7890
              </a>
            </p>
            <p className="text-sm">
              ✉️ <strong className="text-white">Email:</strong>{" "}
              <a
                href="mailto:info@showroommobil.com"
                className="hover:text-[#f8a720] transition"
              >
                info@showroommobil.com
              </a>
            </p>
            <p className="text-sm pt-1">
              🗺️{" "}
              <a
                href="https://maps.app.goo.gl/2UV1jSB54gQpYmxX7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f8a720] hover:underline font-semibold"
              >
                Lihat Lokasi di Google Maps
              </a>
            </p>
          </div>

          {/* Kolom 3: Sosial Media */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-base border-b border-gray-800 pb-2">
              Ikuti Kami
            </h3>
            <p className="text-sm">
              Dapatkan update unit terbaru dan promo menarik di sosial media
              kami:
            </p>
            <div className="flex gap-4 pt-2">
              {/* Instagram Icon/Button */}
              <a
                href="https://instagram.com/showroommobil_random"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:opacity-90 transition"
              >
                <span>📸</span> Instagram
              </a>
              {/* TikTok Icon/Button */}
              <a
                href="https://tiktok.com/@showroommobil_random"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black border border-gray-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-gray-900 transition"
              >
                <span>🎵</span> TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-500 pt-6 border-t border-gray-800">
          © 2026 Showroom Mobil. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}

export default App;
