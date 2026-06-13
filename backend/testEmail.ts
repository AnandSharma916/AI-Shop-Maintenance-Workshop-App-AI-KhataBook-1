import * as dotenv from 'dotenv';
dotenv.config();

import { sendOtpEmail } from './src/utils/emailService';

async function test() {
  console.log('Testing OTP email sending with .env...');
  console.log('Admin Email:', process.env.ADMIN_EMAIL);
  const success = await sendOtpEmail('anandkpp2023@gmail.com', '123456', 'Test OTP', false);
  console.log('Success:', success);
}

test();
