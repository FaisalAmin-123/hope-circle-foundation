// // pages/AdminWorkUpdates.js
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const AdminWorkUpdates = () => {
//   const navigate = useNavigate();
//   const [workUpdates, setWorkUpdates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingUpdate, setEditingUpdate] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     impact: '',
//     category: 'other',
//     media: null
//   });

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   useEffect(() => {
//     fetchWorkUpdates();
//   }, []);

//   const fetchWorkUpdates = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/api/admin/work-updates`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setWorkUpdates(response.data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching work updates:', error);
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const token = localStorage.getItem('token');
//     const formDataToSend = new FormData();
    
//     formDataToSend.append('title', formData.title);
//     formDataToSend.append('description', formData.description);
//     formDataToSend.append('impact', formData.impact);
//     formDataToSend.append('category', formData.category);
    
//     if (formData.media) {
//       formDataToSend.append('media', formData.media);
//     }

//     try {
//       if (editingUpdate) {
//         await axios.put(
//           `${API_URL}/api/admin/work-updates/${editingUpdate._id}`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
//         alert('Work update updated successfully!');
//       } else {
//         await axios.post(
//           `${API_URL}/api/admin/work-updates`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
//         alert('Work update created successfully!');
//       }
      
//       setShowModal(false);
//       setFormData({ title: '', description: '', impact: '', category: 'other', media: null });
//       setEditingUpdate(null);
//       fetchWorkUpdates();
//     } catch (error) {
//       console.error('Error saving work update:', error);
//       alert('Error saving work update: ' + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this work update?')) return;
    
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${API_URL}/api/admin/work-updates/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       alert('Work update deleted successfully!');
//       fetchWorkUpdates();
//     } catch (error) {
//       console.error('Error deleting work update:', error);
//       alert('Error deleting work update');
//     }
//   };

//   const toggleActive = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(
//         `${API_URL}/api/admin/work-updates/${id}/toggle-active`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchWorkUpdates();
//     } catch (error) {
//       console.error('Error toggling work update:', error);
//     }
//   };

//   const openEditModal = (update) => {
//     setEditingUpdate(update);
//     setFormData({
//       title: update.title,
//       description: update.description,
//       impact: update.impact,
//       category: update.category,
//       media: null
//     });
//     setShowModal(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with Back Button */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/admin/dashboard')}
//                 className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
//               >
//                 <ArrowLeft size={20} />
//                 <span>Back to Dashboard</span>
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setEditingUpdate(null);
//                 setFormData({ title: '', description: '', impact: '', category: 'other', media: null });
//                 setShowModal(true);
//               }}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
//             >
//               <Plus size={20} />
//               Add New Update
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Manage Work Updates</h1>
//           <p className="text-gray-600 mt-2">Share your impact stories with photos and videos</p>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading updates...</p>
//           </div>
//         ) : workUpdates.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow">
//             <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No Updates Yet</h3>
//             <p className="text-gray-600 mb-4">Start sharing your impact by creating your first work update</p>
//             <button
//               onClick={() => {
//                 setEditingUpdate(null);
//                 setFormData({ title: '', description: '', impact: '', category: 'other', media: null });
//                 setShowModal(true);
//               }}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
//             >
//               <Plus size={20} />
//               Create First Update
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {workUpdates.map((update) => (
//               <div key={update._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
//                 <div className="relative h-48">
//                   {update.mediaType === 'video' ? (
//                     <video src={update.mediaUrl} className="w-full h-full object-cover" />
//                   ) : (
//                     <img src={update.mediaUrl} alt={update.title} className="w-full h-full object-cover" />
//                   )}
//                   <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold ${update.isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}>
//                     {update.isActive ? 'Active' : 'Inactive'}
//                   </div>
//                 </div>
                
//                 <div className="p-4">
//                   <h3 className="font-bold text-lg mb-2 line-clamp-1">{update.title}</h3>
//                   <p className="text-green-600 font-semibold text-sm mb-2">{update.impact}</p>
//                   <p className="text-gray-500 text-sm mb-4 line-clamp-2">{update.description}</p>
                  
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => toggleActive(update._id)}
//                       className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 flex items-center justify-center gap-1 text-sm font-medium"
//                     >
//                       {update.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
//                       {update.isActive ? 'Hide' : 'Show'}
//                     </button>
//                     <button
//                       onClick={() => openEditModal(update)}
//                       className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 flex items-center justify-center gap-1 text-sm font-medium"
//                     >
//                       <Edit size={16} />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(update._id)}
//                       className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 flex items-center justify-center gap-1 text-sm font-medium"
//                     >
//                       <Trash2 size={16} />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Modal */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <h2 className="text-2xl font-bold mb-6">
//                   {editingUpdate ? 'Edit Work Update' : 'Add New Work Update'}
//                 </h2>
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Title *</label>
//                     <input
//                       type="text"
//                       value={formData.title}
//                       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                       maxLength="200"
//                       placeholder="e.g., Education Support for 10 Students"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Description *</label>
//                     <textarea
//                       value={formData.description}
//                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       rows="4"
//                       required
//                       maxLength="1000"
//                       placeholder="Describe the impact of this work..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Impact Statement *</label>
//                     <input
//                       type="text"
//                       value={formData.impact}
//                       onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                       placeholder="e.g., 15 Families Fed"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Category *</label>
//                     <select
//                       value={formData.category}
//                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="education">Education</option>
//                       <option value="food">Food Distribution</option>
//                       <option value="medical">Medical Aid</option>
//                       <option value="emergency">Emergency Relief</option>
//                       <option value="marriage">Marriage Assistance</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       Media (Image or Video) {editingUpdate ? '' : '*'}
//                     </label>
//                     {editingUpdate && (
//                       <p className="text-sm text-gray-600 mb-2">Leave empty to keep current media</p>
//                     )}
//                     <input
//                       type="file"
//                       accept="image/*,video/*"
//                       onChange={(e) => setFormData({ ...formData, media: e.target.files[0] })}
//                       className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required={!editingUpdate}
//                     />
//                     <p className="text-sm text-gray-500 mt-1">Max size: 50MB. Supported formats: JPG, PNG, MP4</p>
//                   </div>

//                   <div className="flex gap-4 pt-4">
//                     <button
//                       type="submit"
//                       className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
//                     >
//                       {editingUpdate ? 'Update Work Update' : 'Create Work Update'}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowModal(false);
//                         setEditingUpdate(null);
//                         setFormData({ title: '', description: '', impact: '', category: 'other', media: null });
//                       }}
//                       className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default AdminWorkUpdates;



// pages/AdminWorkUpdates.js
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminWorkUpdates = () => {
  const navigate = useNavigate();
  const [workUpdates, setWorkUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    impact: "",
    category: "other",
    media: null,
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchWorkUpdates();
  }, []);

  const fetchWorkUpdates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/admin/work-updates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWorkUpdates(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching work updates:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("impact", formData.impact);
    formDataToSend.append("category", formData.category);

    if (formData.media) formDataToSend.append("media", formData.media);

    try {
      if (editingUpdate) {
        await axios.put(
          `${API_URL}/api/admin/work-updates/${editingUpdate._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Work update updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/api/admin/work-updates`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Work update created successfully!");
      }

      setShowModal(false);
      setEditingUpdate(null);
      setFormData({
        title: "",
        description: "",
        impact: "",
        category: "other",
        media: null,
      });
      fetchWorkUpdates();
    } catch (error) {
      console.error("Error saving work update:", error);
      alert("Error saving work update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/admin/work-updates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Work update deleted!");
      fetchWorkUpdates();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting update");
    }
  };

  const toggleActive = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/admin/work-updates/${id}/toggle-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchWorkUpdates();
    } catch (error) {
      console.error("Error toggling:", error);
    }
  };

  const openEditModal = (update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      description: update.description,
      impact: update.impact,
      category: update.category,
      media: null,
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* PREMIUM NAVBAR */}
      <nav className="w-full backdrop-blur-xl bg-white/30 shadow-lg rounded-2xl border border-white/40 p-4 mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
            >
              <ArrowLeft size={26} />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/hero1.jpg"
                className="w-12 h-12 rounded-full shadow-md border border-gray-300 object-cover"
                alt="Logo"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                Manage Work Updates
              </h1>
            </div>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              setEditingUpdate(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition"
          >
            <Plus size={20} /> Add Update
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">

        <p className="text-gray-600 mb-6 text-lg font-medium">
          Post your social work, events, or impact stories with media.
        </p>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600">Loading updates...</p>
          </div>
        ) : workUpdates.length === 0 ? (
          <div className="text-center bg-white/70 backdrop-blur-lg p-16 rounded-2xl shadow-lg border border-white/40">
            <h2 className="text-xl font-semibold text-gray-800">
              No Updates Available
            </h2>
            <p className="text-gray-600 mt-2">Start by adding your first update.</p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow flex items-center gap-2"
            >
              <Plus size={20} /> Create First Update
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workUpdates.map((update) => (
              <div
                key={update._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition overflow-hidden"
              >
                <div className="relative h-48">
                  {update.mediaType === "video" ? (
                    <video
                      src={update.mediaUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={update.mediaUrl}
                      alt={update.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <span
                    className={`absolute top-3 right-3 px-4 py-1 rounded-full text-sm font-semibold shadow ${
                      update.isActive
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {update.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">
                    {update.title}
                  </h3>

                  <p className="text-green-700 font-semibold mb-1">
                    {update.impact}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {update.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(update._id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      {update.isActive ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                      {update.isActive ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => openEditModal(update)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(update._id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-8">

              <h2 className="text-2xl font-bold mb-6">
                {editingUpdate ? "Edit Work Update" : "Create Work Update"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Impact Statement *
                  </label>
                  <input
                    type="text"
                    value={formData.impact}
                    onChange={(e) =>
                      setFormData({ ...formData, impact: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="education">Education</option>
                    <option value="food">Food Distribution</option>
                    <option value="medical">Medical Aid</option>
                    <option value="emergency">Emergency Relief</option>
                    <option value="marriage">Marriage Assistance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Media (Image or Video)
                  </label>
                  {editingUpdate && (
                    <p className="text-sm text-gray-600 mb-1">
                      Leave empty to keep existing media
                    </p>
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      setFormData({ ...formData, media: e.target.files[0] })
                    }
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                    required={!editingUpdate}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow transition"
                  >
                    {editingUpdate ? "Update" : "Create"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUpdate(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow transition"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminWorkUpdates;
