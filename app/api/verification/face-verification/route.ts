import { NextResponse } from "next/server";
import { RekognitionClient, CompareFacesCommand } from "@aws-sdk/client-rekognition";

export const runtime = "nodejs"; // pastikan pakai runtime nodejs (bukan edge)

// Helper untuk konversi base64 ke Buffer
function base64ToBuffer(data: string) {
  const base64 = data.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64, "base64");
}

export async function POST(request: Request) {
  try {
    const { ktmPhoto, selfieImage } = await request.json();

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