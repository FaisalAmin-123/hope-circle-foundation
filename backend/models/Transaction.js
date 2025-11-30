// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema(
//   {
//     // Type: donation or distribution
//     type: {
//       type: String,
//       enum: ['donation', 'distribution'],
//       required: true,
//     },

//     // Amount in rupees/dollars
//     amount: {
//       type: Number,
//       required: [true, 'Please add an amount'],
//       min: 0,
//     },

//     // Who made the donation (for donations only)
//     // ✅ FIXED: Changed to NOT required to allow guest donations
//     donor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: false, // ✅ Now optional
//       default: null,
//     },

//     // ✅ NEW: Guest donor information (for donations without login)
//     guestDonor: {
//       name: {
//         type: String,
//         default: 'Anonymous',
//       },
//       phone: {
//         type: String,
//         default: null,
//       },
//       email: {
//         type: String,
//         default: null,
//       },
//     },

//     // Who received the aid (for distributions only)
//     beneficiary: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: function () {
//         return this.type === 'distribution';
//       },
//     },

//     // Admin who approved distribution
//     approvedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },

//     // Description/notes
//     description: {
//       type: String,
//     },

//     // Payment method (for donations)
//     paymentMethod: {
//       type: String,
//       enum: ['card', 'upi', 'netbanking', 'cash', null],
//       default: null,
//     },

//     // Payment ID (from payment gateway)
//     paymentId: {
//       type: String,
//     },

//     // Transaction Reference (for distributions - bank transfer reference)
//     transactionReference: {
//       type: String,
//       required: function () {
//         return this.type === 'distribution';
//       },
//     },

//     // Status
//     status: {
//       type: String,
//       enum: ['pending', 'completed', 'failed'],
//       default: 'pending',
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt
//   }
// );

// module.exports = mongoose.model('Transaction', transactionSchema);



// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    // Type: donation or distribution
    type: {
      type: String,
      enum: ['donation', 'distribution'],
      required: true,
    },

    // Amount in rupees/dollars
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: 0,
    },

    // Who made the donation (for donations only)
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },

    // Guest donor information
    guestDonor: {
      name: { type: String, default: 'Anonymous' },
      phone: { type: String, default: null },
      email: { type: String, default: null },
    },

    // Who received the aid (for distributions only)
    beneficiary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return this.type === 'distribution';
      },
    },

    // Admin who approved distribution
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Description/notes
    description: {
      type: String,
    },

    // Payment method (for donations)
    // Added 'razorpay' to support Razorpay-created transactions
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'cash', 'razorpay', null],
      default: null,
    },

    // Payment ID (from payment gateway)
    paymentId: {
      type: String,
      default: null,
    },

    // Razorpay order id (optional, for reconciliation)
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },

    // Receipt / transaction reference used with Razorpay
    receipt: {
      type: String,
      default: null,
      index: true,
    },

    // Transaction Reference (for distributions - bank transfer reference)
    transactionReference: {
      type: String,
      required: function () {
        return this.type === 'distribution';
      },
    },

    // Status
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index createdAt to speed up monthly queries (e.g. createdAt >= startOfMonth)
transactionSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
