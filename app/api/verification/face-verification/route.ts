
import { NextResponse } from "next/server";
import { RekognitionClient, CompareFacesCommand } from "@aws-sdk/client-rekognition";
import crypto from "crypto";

export const runtime = "nodejs"; // pastikan pakai runtime nodejs (bukan edge)


// Helper untuk konversi base64 ke Buffer
function base64ToBuffer(data: string) {
  const base64 = data.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64, "base64");
}

// AES decryption helper
function decryptAES(ciphertextB64: string, key: string, iv: string): string {
  const encrypted = Buffer.from(ciphertextB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export async function POST(request: Request) {
  try {
    // Ambil kunci dan iv dari env
    const key = process.env.NEXT_PUBLIC_FACE_ENCRYPT_KEY;
    const iv = process.env.NEXT_PUBLIC_FACE_ENCRYPT_IV;
    if (!key || !iv) {
      return NextResponse.json({ success: false, message: "Encryption key/iv not set" }, { status: 500 });
    }

    // Data terenkripsi dikirim dari client
    const { ktmPhotoEnc, selfieImageEnc } = await request.json();
    if (!ktmPhotoEnc || !selfieImageEnc) {
      return NextResponse.json({ success: false, message: "Encrypted data missing" }, { status: 400 });
    }

    // Dekripsi
    const ktmPhoto = decryptAES(ktmPhotoEnc, key, iv);
    const selfieImage = decryptAES(selfieImageEnc, key, iv);

    const SourceImage = base64ToBuffer(ktmPhoto);
    const TargetImage = base64ToBuffer(selfieImage);

    const client = new RekognitionClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const command = new CompareFacesCommand({
      SourceImage: { Bytes: SourceImage },
      TargetImage: { Bytes: TargetImage },
      SimilarityThreshold: 80,
    });

    const result = await client.send(command);

    const similarity =
      result.FaceMatches && result.FaceMatches.length > 0
        ? result.FaceMatches[0].Similarity ?? 0
        : 0;

    return NextResponse.json({
      success: similarity >= 80,
      similarity,
      message:
        similarity >= 80
          ? "Face match successful"
          : "Face match failed or faces not detected",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "AWS Rekognition error", error: error.message },
      { status: 500 }
    );
  }
}