export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 's3', // 's3' | 'gcp' | 'local'
  s3: {
    bucket: process.env.AWS_S3_BUCKET || 'roomia-vault-documents',
    region: process.env.AWS_REGION || 'us-east-1'
  },
  gcp: {
    bucket: process.env.GCP_STORAGE_BUCKET || 'roomia-vault-documents-gcp'
  }
};
