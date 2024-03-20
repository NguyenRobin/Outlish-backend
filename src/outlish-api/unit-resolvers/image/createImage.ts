import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET } from "@src/core-setup/services/s3-bucket";
import { AppSyncResolverEvent } from "aws-lambda";

export const handler = async (event: AppSyncResolverEvent<any>) => {
  console.log(event);
  const { file, filetype } = event.arguments.input;

  const decodedFile = Buffer.from(
    file.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const command = new PutObjectCommand({
    Bucket: process.env.OUTLISH_S3_BUCKET,
    Key: `images/-${new Date().toISOString()}.jpeg`,
    Body: decodedFile,
  });

  try {
    const response = await S3_BUCKET.send(command);

    console.log(response);
    return true;
  } catch (err) {
    console.error(err);
  }
};
