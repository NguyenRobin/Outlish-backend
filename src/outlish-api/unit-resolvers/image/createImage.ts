import { ListBackupsCommand } from "@aws-sdk/client-dynamodb";
import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { S3_BUCKET } from "@src/core-setup/services/s3-bucket";
import { generateId, slugifyString } from "@src/core-setup/utils";
import { AppSyncResolverEvent } from "aws-lambda";
import { KinesisVideoSignalingChannels } from "aws-sdk";
import sharp from "sharp";

// export const handler = async (event: AppSyncResolverEvent<any>) => {
//   console.log(event);

//   // Incoming file should be encoded as a base64-string which is binary data as ASCII-text (file as text)
//   const { file: base64File } = event.arguments.input;

//   // Convert the image back to it binary format and then send it to S3 bucket
//   const decodedFile = Buffer.from(
//     // if the encoded base64-string starts with "data:image/png;base64," it will be replaced with ""
//     base64File.replace(/^data:image\/\w+;base64,/, ""),
//     "base64"
//   );

//   try {
//     // resize the incoming image to different sizes
//     const IMAGE_SIZE_XS = await sharp(decodedFile).resize(300).toBuffer();
//     const IMAGE_SIZE_SMALL = await sharp(decodedFile).resize(400).toBuffer();
//     const IMAGE_SIZE_MEDIUM = await sharp(decodedFile).resize(500).toBuffer();
//     const IMAGE_SIZE_LARGE = await sharp(decodedFile).resize(700).toBuffer();
//     const ORIGINAL_IMAGE_SIZE = decodedFile;

//     const imagesToResize = [
//       IMAGE_SIZE_XS,
//       IMAGE_SIZE_SMALL,
//       IMAGE_SIZE_MEDIUM,
//       IMAGE_SIZE_LARGE,
//       ORIGINAL_IMAGE_SIZE,
//     ];

//     for (const image of imagesToResize) {
//       const command = new PutObjectCommand({
//         ACL: "public-read",
//         Bucket: process.env.AWS_S3_BUCKET,
//         Key: `product-images/${new Date().toISOString()}.jpeg`,
//         Body: image,
//       });

//       const response = await S3_BUCKET.send(command);
//       console.log(response);
//     }
//     return true;
//   } catch (err) {
//     console.error(err);
//   }
// };

export async function addResizeImagesToS3Bucket(file: string, name: string) {
  // Incoming file should be encoded as a base64-string which is binary data as ASCII-text (file as text)
  const base64File = file;

  // Convert the image back to it binary format and then send it to S3 bucket
  const decodedFile = Buffer.from(
    // if the encoded base64-string starts with "data:image/png;base64," it will be replaced with ""
    base64File.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  try {
    // resize the incoming image to different sizes
    const IMAGE_SIZE_XS = await sharp(decodedFile).resize(300).toBuffer();
    const IMAGE_SIZE_SMALL = await sharp(decodedFile).resize(400).toBuffer();
    const IMAGE_SIZE_MEDIUM = await sharp(decodedFile).resize(500).toBuffer();
    const IMAGE_SIZE_LARGE = await sharp(decodedFile).resize(700).toBuffer();
    const ORIGINAL_IMAGE_SIZE = decodedFile;

    const imagesToResize = [
      { resize: IMAGE_SIZE_XS, filename: `${slugifyString(name)}-xs` },
      { resize: IMAGE_SIZE_SMALL, filename: `${slugifyString(name)}-small` },
      { resize: IMAGE_SIZE_MEDIUM, filename: `${slugifyString(name)}-medium` },
      { resize: IMAGE_SIZE_LARGE, filename: `${slugifyString(name)}-large` },
      {
        resize: ORIGINAL_IMAGE_SIZE,
        filename: `${slugifyString(name)}-original`,
      },
    ];

    // pushing all url with images to the results array. When we then create a product the urls get stored as a attribute in dynamoDB
    // const result = [];
    // const images = [
    //   "image_xs",
    //   "image_small",
    //   "image_medium",
    //   "image_large",
    //   "image_original",
    // ];

    // for (const image of imagesToResize) {
    //   const id = generateId();
    //   const command = new PutObjectCommand({
    //     ACL: "public-read",
    //     Bucket: process.env.AWS_S3_BUCKET,
    //     Key: `product-images/${image.filename}-${id}.jpeg`,
    //     Body: image.resize,
    //   });
    //   result.push(
    //     `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_MY_REGION}.amazonaws.com/product-images/${image.filename}-${id}.jpeg`
    //   );
    //   const response = await S3_BUCKET.send(command);
    // }

    const obj = {};
    const imageSizes = [
      "image_xs",
      "image_small",
      "image_medium",
      "image_large",
      "image_original",
    ];

    for (let i = 0; i < imagesToResize.length; i++) {
      const id = generateId();
      const key = imageSizes[i];

      const command = new PutObjectCommand({
        ACL: "public-read",
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `product-images/${imagesToResize[i].filename}-${id}.jpeg`,
        Body: imagesToResize[i].resize,
      });

      Object.assign(obj, {
        [key]: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_MY_REGION}.amazonaws.com/product-images/${imagesToResize[i].filename}-${id}.jpeg`,
      });
      const response = await S3_BUCKET.send(command);
    }
    console.log(obj);
    return obj;
  } catch (err) {
    console.error(err);
  }
}
