import twilio from 'twilio';
import { envVars } from './env.js';

if (!envVars.twilio.accountSid || !envVars.twilio.authToken || !envVars.twilio.phoneNumber) {
    throw new Error('Twilio credentials are not configured properly');
}

export const twilioClient = twilio(envVars.twilio.accountSid, envVars.twilio.authToken);

export const sendSMS = async (to, message) => {
    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: envVars.twilio.phoneNumber,
            to: to
        });

        console.log('SMS sent successfully:', result.sid);
        return { success: true, messageSid: result.sid };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message };
    }
};

export const sendOTP = async (phoneNumber, otp) => {
    const message = `Your OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`;
    return await sendSMS(phoneNumber, message);
};