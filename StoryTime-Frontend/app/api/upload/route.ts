import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the storage path inside "public/uploads"
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure the directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate a unique filename
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        // Save file to disk
        await writeFile(filePath, buffer);

        // Return relative path for database storage
        const relativePath = `/uploads/${fileName}`;

        return NextResponse.json({ success: true, filePath: relativePath });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Error uploading file" }, { status: 500 });
    }
}
