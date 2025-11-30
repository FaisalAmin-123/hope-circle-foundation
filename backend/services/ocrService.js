const Tesseract = require('tesseract.js');
const fetch = require('node-fetch');

// Extract text from image URL
const extractTextFromImage = async (imageUrl) => {
  try {
    console.log('Starting OCR for:', imageUrl);

    // Fetch image from Cloudinary
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // Perform OCR
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      'eng', // Language: English (use 'hin' for Hindi)
      {
        logger: (m) => console.log(m), // Progress logger
      }
    );

    console.log('OCR completed successfully');
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

// Extract Aadhaar card details
const extractAadhaarDetails = (text) => {
  const details = {
    name: null,
    aadhaarNumber: null,
    dob: null,
    address: null,
    rawText: text,
  };

  try {
    // Extract Aadhaar number (12 digits, possibly with spaces)
    const aadhaarRegex = /\d{4}\s?\d{4}\s?\d{4}/;
    const aadhaarMatch = text.match(aadhaarRegex);
    if (aadhaarMatch) {
      details.aadhaarNumber = aadhaarMatch[0].replace(/\s/g, '');
    }

    // Extract DOB (various formats)
    const dobRegex = /(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})|(\d{4}[\/\-\.]\d{2}[\/\-\.]\d{2})/;
    const dobMatch = text.match(dobRegex);
    if (dobMatch) {
      details.dob = dobMatch[0];
    }

    // Extract name (after "Name:" or similar patterns)
    const nameRegex = /(?:Name|NAME|name)[\s:]+([A-Za-z\s]+)/i;
    const nameMatch = text.match(nameRegex);
    if (nameMatch) {
      details.name = nameMatch[1].trim();
    }

    // Extract address (basic extraction - lines after "Address" keyword)
    const addressRegex = /(?:Address|ADDRESS|address)[\s:]+(.+?)(?:\n\n|$)/is;
    const addressMatch = text.match(addressRegex);
    if (addressMatch) {
      details.address = addressMatch[1].trim().replace(/\n/g, ' ');
    }
  } catch (error) {
    console.error('Error parsing Aadhaar details:', error);
  }

  return details;
};

// Extract Ration Card details
const extractRationCardDetails = (text) => {
  const details = {
    name: null,
    cardNumber: null,
    rawText: text,
  };

  try {
    // Extract ration card number (varies by state, usually alphanumeric)
    const cardRegex = /[A-Z0-9]{10,15}/;
    const cardMatch = text.match(cardRegex);
    if (cardMatch) {
      details.cardNumber = cardMatch[0];
    }

    // Extract name
    const nameRegex = /(?:Name|NAME|name)[\s:]+([A-Za-z\s]+)/i;
    const nameMatch = text.match(nameRegex);
    if (nameMatch) {
      details.name = nameMatch[1].trim();
    }
  } catch (error) {
    console.error('Error parsing Ration Card details:', error);
  }

  return details;
};

// Extract Income Certificate details
const extractIncomeCertificateDetails = (text) => {
  const details = {
    name: null,
    income: null,
    rawText: text,
  };

  try {
    // Extract name
    const nameRegex = /(?:Name|NAME|name)[\s:]+([A-Za-z\s]+)/i;
    const nameMatch = text.match(nameRegex);
    if (nameMatch) {
      details.name = nameMatch[1].trim();
    }

    // Extract income (numbers with Rs, ₹, or "income" keyword)
    const incomeRegex = /(?:Income|INCOME|income|Rs\.?|₹)[\s:]*([0-9,]+)/i;
    const incomeMatch = text.match(incomeRegex);
    if (incomeMatch) {
      details.income = incomeMatch[1].replace(/,/g, '');
    }
  } catch (error) {
    console.error('Error parsing Income Certificate details:', error);
  }

  return details;
};

// Cross-verify data across documents
const crossVerifyDocuments = (extractedData, applicationData) => {
  const results = {
    nameMatch: false,
    documentsConsistent: false,
    suspiciousFlags: [],
  };

  try {
    // Collect all extracted names
    const names = [];
    if (extractedData.aadhaarCard?.name) names.push(extractedData.aadhaarCard.name.toLowerCase());
    if (extractedData.rationCard?.name) names.push(extractedData.rationCard.name.toLowerCase());
    if (extractedData.incomeCertificate?.name) names.push(extractedData.incomeCertificate.name.toLowerCase());

    const applicationName = applicationData.fullName.toLowerCase();

    // Check if any extracted name matches application name
    // (allowing for partial matches due to OCR errors)
    results.nameMatch = names.some((name) => {
      const similarity = calculateSimilarity(name, applicationName);
      return similarity > 0.6; // 60% similarity threshold
    });

    // Check for suspicious patterns
    if (!extractedData.aadhaarCard?.aadhaarNumber) {
      results.suspiciousFlags.push('Aadhaar number not detected');
    }

    if (names.length > 0 && !results.nameMatch) {
      results.suspiciousFlags.push('Name mismatch across documents');
    }

    if (extractedData.aadhaarCard?.aadhaarNumber) {
      const aadhaar = extractedData.aadhaarCard.aadhaarNumber;
      // Basic Aadhaar validation (12 digits)
      if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
        results.suspiciousFlags.push('Invalid Aadhaar number format');
      }
    }

    // Overall consistency check
    results.documentsConsistent = results.suspiciousFlags.length === 0;
  } catch (error) {
    console.error('Error in cross-verification:', error);
  }

  return results;
};

// Calculate string similarity (simple Levenshtein-based)
const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

// Levenshtein distance calculation
const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

// Calculate confidence score
const calculateConfidenceScore = (extractedData, verificationResults) => {
  let score = 0;

  // Data extraction points (40 points)
  if (extractedData.aadhaarCard?.aadhaarNumber) score += 15;
  if (extractedData.aadhaarCard?.name) score += 10;
  if (extractedData.aadhaarCard?.dob) score += 5;
  if (extractedData.rationCard?.name) score += 5;
  if (extractedData.rationCard?.cardNumber) score += 5;

  // Verification points (60 points)
  if (verificationResults.nameMatch) score += 30;
  if (verificationResults.documentsConsistent) score += 20;
  if (verificationResults.suspiciousFlags.length === 0) score += 10;

  return Math.min(score, 100); // Cap at 100
};

module.exports = {
  extractTextFromImage,
  extractAadhaarDetails,
  extractRationCardDetails,
  extractIncomeCertificateDetails,
  crossVerifyDocuments,
  calculateConfidenceScore,
};