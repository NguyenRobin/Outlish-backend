// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/
// https://thomasstep.com/blog/how-to-use-the-dynamodb-document-client

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

// Full DynamoDB Client
const client = new DynamoDB({
  region: process.env.AWS_MY_REGION,
  credentials: {
    accessKeyId: process.env.AWS_MY_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_MY_SECRET_ACCESS_KEY!,
  },
});

// Full document client
const db = DynamoDBDocument.from(client);

export { db };
