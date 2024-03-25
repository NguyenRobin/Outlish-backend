import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET } from "@src/core-setup/services/s3-bucket";
import { generateId, slugifyString } from "@src/core-setup/utils";
import sharp from "sharp";

export async function addResizeImagesToS3Bucket(file: string, name: string) {
  // Incoming image/file should be encoded as a base64-string which is binary data as ASCII-text (file as text)
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

    // store the images in an array so we can loop over them later
    const imagesToResize = [
      {
        resize: IMAGE_SIZE_XS,
        filename: `${slugifyString(name)}-xs`,
        name: "image_xs",
      },
      {
        resize: IMAGE_SIZE_SMALL,
        filename: `${slugifyString(name)}-small`,
        name: "image_small",
      },
      {
        resize: IMAGE_SIZE_MEDIUM,
        filename: `${slugifyString(name)}-medium`,
        name: "image_medium",
      },
      {
        resize: IMAGE_SIZE_LARGE,
        filename: `${slugifyString(name)}-large`,
        name: "image_large",
      },
      {
        resize: ORIGINAL_IMAGE_SIZE,
        filename: `${slugifyString(name)}-original`,
        name: "image_original",
      },
    ];

    // init a empty object which will store each KEY(imagesToResize.name) and VALUE (url)
    const obj = {};

    for (const image of imagesToResize) {
      const id = generateId();

      // Adding to S3-bucket
      const command = new PutObjectCommand({
        ACL: "public-read",
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `product-images/${image.filename}-${id}.jpeg`,
        Body: image.resize,
      });

      // We take the obj and add every image.name and the url of the image to the object.
      Object.assign(obj, {
        [image.name]: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_MY_REGION}.amazonaws.com/product-images/${image.filename}-${id}.jpeg`,
      });

      const response = await S3_BUCKET.send(command);
    }
    console.log(obj);
    return obj;
  } catch (err) {
    console.error(err);
  }
}
