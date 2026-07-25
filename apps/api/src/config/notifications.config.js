export const notificationsConfig = {
  webPush: {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
    subject: 'mailto:notifications@roomia.ai'
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || 'resend',
    apiKey: process.env.RESEND_API_KEY || ''
  }
};
