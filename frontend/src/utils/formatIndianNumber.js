/**
 * Formats a number using the Indian numbering system
 * Example: 1000000 -> 10,00,000
 * @param {number} num - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - Formatted number string
 */
export const formatIndianNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  const fixedNum = Number(num).toFixed(decimals);
  const [integerPart, decimalPart] = fixedNum.split('.');
  
  // Convert to string and reverse for easier processing
  let numStr = integerPart;
  let lastThree = numStr.substring(numStr.length - 3);
  let otherNumbers = numStr.substring(0, numStr.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  // Add comma every 2 digits for the remaining part
  let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  // Add decimal part if exists
  if (decimalPart && parseInt(decimalPart) > 0) {
    result += '.' + decimalPart;
  }
  
  return result;
};
