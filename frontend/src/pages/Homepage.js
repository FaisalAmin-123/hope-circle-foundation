


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  Calendar,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workUpdates, setWorkUpdates] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

useEffect(() => {
  const fetchWorkUpdates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/work-updates?limit=6`);
      setWorkUpdates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching work updates:", error);
      setWorkUpdates([]); // Empty array if error
    }
  };
  fetchWorkUpdates();
}, [API_URL]);

  // Fetch work updates from admin
  useEffect(() => {
    const fetchWorkUpdates = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/public/work-updates`);
        setWorkUpdates(response.data.data || []);
      } catch (error) {
        console.error("Error fetching work updates:", error);
        // Fallback demo data if API not ready
        setWorkUpdates([
          {
            id: 1,
            title: "Education Support for 10 Students",
            description: "This week, we provided education fees for 10 underprivileged students. Your donations are helping build futures!",
            mediaType: "image",
            mediaUrl: "/feed.jpeg",
            
          },
          {
            id: 2,
            title: "Weekly Food Distribution",
            description: "Distributed food packets to 50 families in need. Every contribution matters.",
            mediaType: "image",
            mediaUrl: "/hero2.jpg",
           
          },
          {
            id: 3,
            title: "Emergency Medical Aid",
            description: "Provided emergency medical assistance to 5 families this month. Together, we save lives.",
            mediaType: "image",
            mediaUrl: "/hero3.jpg",
            
          },
        ]);
      }
    };
    fetchWorkUpdates();
  }, [API_URL]);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/public/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        overview: {
          totalDistributions: 0,
          totalBeneficiaries: 0,
          totalDonors: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [API_URL]);


  // Auto-slide hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ENHANCED NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer group" onClick={() => scrollToSection("hero")}>
              <div className="relative">
                      <img
                      src="/hero1.jpg"
                       alt="Hope Circle Logo"
                       className="h-12 w-12 mr-2 rounded-full shadow-md"
      />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Hope Circle Foundation
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {["Home", "About", "Our Work", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                  className="text-gray-700 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Login Button */}
            <div className="hidden md:block">
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 rounded-full hover:shadow-xl hover:scale-105 transition-all font-semibold"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {["Home", "About", "Our Work", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                  className="block w-full text-left py-3 px-4 hover:bg-red-50 rounded-lg transition"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-3 rounded-lg font-semibold mt-2"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ENHANCED HERO SECTION */}
      <section id="home" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT - IMAGE SLIDER */}
          <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            {["/feed.jpeg", "/hero2.jpg", "/hero3.jpg"].map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
                  currentSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-110"
                }`}
                style={{ backgroundImage: `url('${img}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            ))}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? "bg-white w-8" : "bg-white/50"
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* RIGHT - REGULAR DONOR FEATURE */}
          <div className="bg-white rounded-3xl p-10 shadow-2xl border-2 border-yellow-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-200 rounded-full filter blur-3xl opacity-50"></div>
            <div className="relative">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
                <span className="mr-2">⭐</span> MOST POPULAR
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">
                Become a Regular Donor
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Make a lasting impact with monthly contributions. Earn exclusive badges, receive regular updates, and transform lives consistently.
              </p>
              
              <div className="space-y-3 mb-8">
                {[
                  "Monthly impact reports",
                  "Exclusive donor badges",
                  "Priority support access",
                  "Tax benefits & receipts"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={20} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/register-regular-donor")}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center group"
              >
                🌟 Join Regular Donor Program
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED TWO-COLUMN CTA SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DONATE NOW */}
          <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-red-500 to-orange-500"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative text-white p-12">
              <div className="mb-6">
                <Heart className="mb-4" size={48} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Quick Donation</h3>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                No registration required. Make an immediate impact with a one-time donation for emergency relief and weekly distributions.
              </p>
              <button
                onClick={() => navigate("/donate")}
                className="bg-white text-red-600 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center group"
              >
                ❤️ Donate Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>

          {/* BENEFICIARY REGISTRATION */}
          <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative text-white p-12">
              <div className="mb-6">
                <Users className="mb-4" size={48} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Need Assistance?</h3>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                Register as a beneficiary to receive support for food, medical care, education, emergencies, and marriage assistance.
              </p>
              <button
                onClick={() => navigate("/register-beneficiary")}
                className="bg-white text-blue-700 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center group"
              >
                📝 Apply for Aid
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ENHANCED LIVE STATS */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-gray-300 text-lg">Real-time transparency of every contribution</p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <TrendingUp size={40} />,
                  label: "Total Funds Distributed",
                  // value: `₹${stats.overview.totalDistributions.toLocaleString()}`,
                  value: `100000+`,
                  color: "from-green-400 to-emerald-600",
                },
                {
                  icon: <Users size={40} />,
                  label: "People Helped",
                  // value: stats.overview.totalBeneficiaries,
                  value: '500+',
                  color: "from-blue-400 to-indigo-600",
                },
                {
                  icon: <Heart size={40} />,
                  label: "Regular Donors",
                  // value: stats?.totalRegularDonors || 0,
                  value: '1K+' || 0,
                  color: "from-red-400 to-pink-600",
                 
                  
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-gray-300 text-lg mb-2">{stat.label}</h3>
                  <p className="text-4xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ENHANCED ABOUT + VIDEO SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Hope Circle Foundation
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-pink-600 mx-auto mb-8"></div>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
              Hope Circle Foundation is dedicated to uplifting poor families, orphans, disabled individuals,
              and those facing emergencies. Our mission is built on three pillars: <strong>transparency</strong>,
              <strong> trust</strong>, and <strong>measurable impact</strong>. Every donation is tracked, every beneficiary is verified,
              and every rupee is accounted for.
            </p>
          </div>
{/* VIDEO SECTION */}
<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-xl">
  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">See Our Work in Action</h3>
  <div className="relative w-full h-80 md:h-[500px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group">
    {/* Local Video Player */}
    <video
      className="absolute inset-0 w-full h-full object-cover"
      controls
      poster="/thumbnail1.jpg" 
    >
      <source src="/hopecirclevedio.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    
    {/* Optional: Custom Play Button Overlay */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
      </div>
    </div>
  </div>
</div>

          {/* Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: <Shield size={32} />, title: "100% Transparency", desc: "Every transaction is tracked and reported" },
              { icon: <Users size={32} />, title: "Verified Beneficiaries", desc: "AI & manual verification for authenticity" },
              { icon: <Heart size={32} />, title: "Direct Impact", desc: "Funds reach beneficiaries immediately" },
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl text-center hover:shadow-xl transition-all">
                <div className="inline-flex p-4 bg-white rounded-xl shadow-md mb-4 text-red-600">
                  {item.icon}
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* OUR WORK - DYNAMIC UPDATES */}
      <section id="our-work" className="py-20 bg-gradient-to-b from-gray-50 to-white">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {workUpdates.length > 0 ? (
    workUpdates.map((update) => (
      <div key={update._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        {/* Media Section */}
        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
          {update.mediaType === "video" ? (
            <video
              src={update.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover"
              controls
            />
          ) : (
            <img
              src={update.mediaUrl}
              alt={update.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {update.impact}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar size={16} />
            <span>{new Date(update.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{update.title}</h3>
          <p className="text-gray-600 leading-relaxed">{update.description}</p>
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-3 text-center py-12">
      <p className="text-gray-500 text-lg">No updates available yet</p>
    </div>
  )}
</div>
      </section>
{/* HOW HOPE CIRCLE WORKS */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How Hope Circle Works</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              A transparent, verified process from application to impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Apply for Aid",
                description: "Beneficiaries submit applications with required documents and verification details through our secure platform.",
                icon: "📝",
                color: "from-blue-400 to-cyan-400"
              },
              {
                step: "2",
                title: "AI + Manual Verification",
                description: "Our team conducts thorough verification using both AI-powered document checks and manual field verification.",
                icon: "✅",
                color: "from-purple-400 to-pink-400"
              },
              {
                step: "3",
                title: "Immediate Support",
                description: "Once verified, funds and assistance are provided immediately. Regular donors receive detailed impact reports.",
                icon: "❤️",
                color: "from-orange-400 to-red-400"
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                    {item.icon}
                  </div>
                  <div className="text-5xl font-bold mb-4 opacity-20">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-white/80 text-lg leading-relaxed">{item.description}</p>
                </div>
                
                {/* Connecting Arrow (except for last item) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-white/40" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full text-white border border-white/30">
              <Shield className="mr-2" size={20} />
              <span className="font-semibold">100% Transparent • Every Transaction Tracked</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stories That Inspire Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from those whose lives have been transformed through your generosity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Fatima Khan",
                role: "Single Mother of 3",
                image: "/testimonial1.jpg",
                text: "Hope Circle supported my children's education when I lost my job. Today, my eldest daughter is in college. Thank you for believing in us.",
                rating: 5
              },
              {
                name: "Ahmed Malik",
                role: "Regular Donor",
                image: "/testimonial2.jpg",
                text: "I love the transparency! Every month I get detailed reports showing exactly how my donation helped families. It's incredibly fulfilling.",
                rating: 5
              },
              {
                name: "Zainab Ali",
                role: "Medical Aid Recipient",
                image: "/testimonial3.jpg",
                text: "When my father needed emergency surgery, Hope Circle was there within hours. They literally saved his life. Forever grateful.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of donors who are transforming lives every single day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register-regular-donor")}
              className="bg-white text-red-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center"
            >
              🌟 Become Regular Donor
            </button>
            <button
              onClick={() => navigate("/donate")}
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all inline-flex items-center justify-center"
            >
              ❤️ Donate Once
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center mb-6">
                <Heart className="text-red-500 mr-3" size={36} />
                <span className="text-2xl font-bold">Hope Circle</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Bringing hope and change to communities through transparent charitable work.
              </p>
              <div className="flex items-center text-gray-400 mb-2">
                <Shield className="mr-2 flex-shrink-0" size={16} />
                <span className="text-sm">100% Transparent</span>
              </div>
              <div className="flex items-center text-gray-400">
                <CheckCircle className="mr-2 flex-shrink-0" size={16} />
                <span className="text-sm">Verified Impact</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {["Home", "About", "Our Work", "How It Works"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-"))}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Involved */}
            <div>
              <h4 className="text-lg font-bold mb-6">Get Involved</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate("/donate")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Donate Now
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/register-regular-donor")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Become Regular Donor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/register-beneficiary")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Apply for Aid
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="mr-3 mt-1 flex-shrink-0 text-red-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a href="mailto:info@hopecircle.org" className="text-white hover:text-red-400 transition-colors">
                      hopecirclefundation@.org
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="mr-3 mt-1 flex-shrink-0 text-red-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <a href="tel:+911234567890" className="text-white hover:text-red-400 transition-colors">
                      +91 7051696994
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 mt-1 flex-shrink-0 text-red-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-white">Pulwama, Jammu & Kashmir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h4 className="text-lg font-bold mb-4">Follow Our Journey</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, link: "#" },
                    { icon: Twitter, link: "#" },
                    { icon: Instagram, link: "#" },
                    { icon: Linkedin, link: "#" }
                  ].map((social, index) => {
                    const Icon =social.icon;
                    return (
                     <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Icon size={20} />
                    </a>
                  );
             } )}
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm mb-2">
                  Registered Charity Organization
                </p>
                <p className="text-gray-500 text-sm">
                  Reg. No: HC/2025/001
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Hope Circle Foundation. All Rights Reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <button className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-500 hover:text-white transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;