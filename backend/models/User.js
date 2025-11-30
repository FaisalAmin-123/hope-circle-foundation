// // Import mongoose to create schema
// const mongoose = require('mongoose');

// // Import bcrypt to hash passwords
// const bcrypt = require('bcryptjs');

// // Define how a User should look in database
// const userSchema = new mongoose.Schema(
//   {
//     // Name field
//     name: {
//       type: String,
//       required: [true, 'Please add a name'], // Validation: must provide name
//       trim: true, // Remove extra spaces
//     },
    
//     // Email field
//     email: {
//       type: String,
//       required: [true, 'Please add an email'],
//       unique: true, // No two users can have same email
//       lowercase: true, // Convert to lowercase
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         'Please add a valid email', // Regex to validate email format
//       ],
//     },
    
//     // Password field
//     password: {
//       type: String,
//       required: [true, 'Please add a password'],
//       minlength: 6, // Minimum 6 characters
//       select: false, // Don't return password when fetching user (security)
//     },
    
//     // Role field - who is this user?
//     role: {
//       type: String,
//       enum: ['admin', 'donor', 'beneficiary'], // Can only be one of these 3
//       default: 'donor', // If not specified, user is donor
//     },
    
//     // Phone number (optional for now, required later for beneficiaries)
//     phone: {
//       type: String,
//     },
//     // Add this field to your User schema (around line 50-60, after other fields)

// // ✅ NEW: Recurring donation settings
// recurringDonation: {
//   active: {
//     type: Boolean,
//     default: false,
//   },
//   amount: {
//     type: Number,
//     default: 0,
//   },
//   frequency: {
//     type: String,
//     enum: ['monthly', 'quarterly', 'yearly'],
//     default: 'monthly',
//   },
//   startDate: {
//     type: Date,
//   },
//   nextDonationDate: {
//     type: Date,
//   },
//   lastDonationDate: {
//     type: Date,
//   },
// },
//   // NEW: For Regular Donors
//   isRegularDonor: { type: Boolean, default: false },
//   recurringDonation: {
//     active: { type: Boolean, default: false },
//     amount: { type: Number },
//     frequency: { type: String, enum: ['monthly'], default: 'monthly' },
//     donationDay: { type: Number, min: 1, max: 31 }, // Day of month (1-31)
//     emailNotifications: { type: Boolean, default: true },
//     smsNotifications: { type: Boolean, default: false },
//     whatsappNotifications: { type: Boolean, default: false },
//     consecutiveMonths: { type: Number, default: 0 },
//     lastDonationDate: { type: Date },
//     nextDonationDate: { type: Date },
//   },
//   // For Beneficiaries
//   beneficiaryDetails: {
//     address: { type: String },
//     city: { type: String },
//     state: { type: String },
//     pincode: { type: String },
//     category: { 
//       type: String, 
//       enum: ['poor', 'orphan', 'physically_challenged'] 
//     },
//     needAmount: { type: Number },
//     needDescription: { type: String },
//     // Cloudinary URLs
//     identityProof: { type: String },
//     addressProof: { type: String },
//     incomeProof: { type: String },
//     // Cloudinary public IDs (for deletion)
//     identityProofPublicId: { type: String },
//     addressProofPublicId: { type: String },
//     incomeProofPublicId: { type: String },
//     verificationStatus: { 
//       type: String, 
//       enum: ['pending', 'approved', 'rejected'], 
//       default: 'pending' 
//     },
//     verifiedAt: { type: Date },
//     verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   },
  
//   totalDonated: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now },
// });
// //    


// // MIDDLEWARE: This runs BEFORE saving user to database
// // Purpose: Hash the password before saving
// userSchema.pre('save', async function (next) {
//   // If password is not modified, skip hashing
//   if (!this.isModified('password')) {
//     next();
//   }

//   // Generate salt (random string added to password for extra security)
//   const salt = await bcrypt.genSalt(10);
  
//   // Hash the password with salt
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // METHOD: Compare entered password with hashed password in database
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   // bcrypt compares plain password with hashed password
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Export the model
// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    
    role: {
      type: String,
      enum: ['admin', 'donor', 'beneficiary'],
      default: 'donor',
    },
    
    phone: {
      type: String,
    },

    // ✅ SINGLE recurringDonation field (cleaned up)
    isRegularDonor: { 
      type: Boolean, 
      default: false 
    },
    
    recurringDonation: {
      active: { 
        type: Boolean, 
        default: false 
      },
      amount: { 
        type: Number,
        default: 0,
      },
      frequency: { 
        type: String, 
        enum: ['monthly', 'quarterly', 'yearly'], 
        default: 'monthly' 
      },
      donationDay: { 
        type: Number, 
        min: 1, 
        max: 31 
      },
      emailNotifications: { 
        type: Boolean, 
        default: true 
      },
      smsNotifications: { 
        type: Boolean, 
        default: false 
      },
      whatsappNotifications: { 
        type: Boolean, 
        default: false 
      },
      consecutiveMonths: { 
        type: Number, 
        default: 0 
      },
      startDate: { 
        type: Date 
      },
      lastDonationDate: { 
        type: Date 
      },
      nextDonationDate: { 
        type: Date 
      },
    },
    
    // ✅ Beneficiary details (NO documents here - those go in Application model)
    beneficiaryCategory: {
      type: String,
      enum: ['poor', 'orphan', 'physically_challenged'],
    },
    
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'not_submitted'],
      default: 'not_submitted', // ✅ Default for new beneficiaries
    },
    
    totalDonated: { 
      type: Number, 
      default: 0 
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);