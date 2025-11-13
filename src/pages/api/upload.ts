import type { APIRoute } from "astro";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const photo = formData.get("photo") as File;
    const transaction = formData.get("transaction") as File;
    const phone = formData.get("phone")?.toString() || null;
    const email = formData.get("email")?.toString() || null;
    const childName = formData.get("childName")?.toString() || null;

    if (!photo || !transaction) {
      return new Response(JSON.stringify({ error: "Missing files" }), {
        status: 400,
      });
    }

    const uploadToCloudinary = (file: File, folder: string) => {
      return new Promise((resolve, reject) => {
        file.arrayBuffer().then((bufferArray) => {
          const buffer = Buffer.from(bufferArray);
          const stream = cloudinary.uploader.upload_stream(
            { folder },
            (err, res) => (err ? reject(err) : resolve(res))
          );
          stream.end(buffer);
        });
      });
    };

    // Upload both files
    const [photoUpload, transactionUpload]: any = await Promise.all([
      uploadToCloudinary(photo, "event-gallery"),
      uploadToCloudinary(transaction, "event-transactions"),
    ]);

    // Insert both URLs into Supabase
    await supabase.from("images").insert({
      cloudinary_id: photoUpload.public_id,
      url: photoUpload.secure_url,
      transaction_url: transactionUpload.secure_url,
      verified: false,
      phone,
      email,
      child_name: childName,
    });

    return new Response(
      JSON.stringify({
        photoUrl: photoUpload.secure_url,
        transactionUrl: transactionUpload.secure_url,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
};
