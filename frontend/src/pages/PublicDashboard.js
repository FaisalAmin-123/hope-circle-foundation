// components/LivePublicStats.jsx
import React, { useEffect, useState } from "react";
import { TrendingUp, Users, Heart } from "react-feather";

export default function LivePublicStats({ apiUrl = "/api/public-stats/stats", pollInterval = 30000 }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(apiUrl, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to load");
      setData(json.data);
    } catch (err) {
      console.error("LivePublicStats fetch error:", err);
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, pollInterval);
    return () => clearInterval(id);
  }, [apiUrl, pollInterval]);

  const formatCurrencyINR = (v) => {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(v || 0));
    } catch {
      return `₹${Number(v || 0).toLocaleString()}`;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-gray-300 text-lg">Real-time transparency of every contribution</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-300">{error}</div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 mb-4">
                <TrendingUp size={40} />
              </div>
              <h3 className="text-gray-300 text-lg mb-2">Total Funds Distributed</h3>
              <p className="text-4xl font-bold">{formatCurrencyINR(data.financial.totalDistributions)}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 mb-4">
                <Users size={40} />
              </div>
              <h3 className="text-gray-300 text-lg mb-2">People Helped</h3>
              <p className="text-4xl font-bold">{data.counts.beneficiaries}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-red-400 to-pink-600 mb-4">
                <Heart size={40} />
              </div>
              <h3 className="text-gray-300 text-lg mb-2">Regular Donors</h3>
              <p className="text-4xl font-bold">{data.counts.regularDonors}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
