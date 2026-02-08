// Simple OTP utility for demo (not production secure)
export function generateOtp(length = 6) {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}

export function verifyOtp(inputOtp, actualOtp) {
  return inputOtp === actualOtp;
}
