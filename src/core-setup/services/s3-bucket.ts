// https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3

import { S3Client } from "@aws-sdk/client-s3";

const S3_BUCKET = new S3Client({
  region: process.env.AWS_MY_REGION,
  credentials: {
    accessKeyId: process.env.AWS_MY_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_MY_SECRET_ACCESS_KEY!,
  },
});

export { S3_BUCKET };
