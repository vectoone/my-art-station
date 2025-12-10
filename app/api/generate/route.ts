
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const session = await auth();

        // 1. Auth Check
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const promptVal = formData.get("prompt") as string;
        const styleVal = formData.get("style_preset") as string;
        const userId = session.user.id;

        if (!promptVal) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }
        if (!userId) return NextResponse.json({ error: "User ID missing" }, { status: 401 });

        // 2. Credit Check
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        if (user.credits < 1) {
            return NextResponse.json({ error: "Insufficient Credits" }, { status: 402 });
        }

        // 3. Deduct Credit
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 1 } }
        });

        // 4. Call Python API
        const backendFormData = new FormData();
        backendFormData.append("prompt", promptVal);
        backendFormData.append("style_preset", styleVal);
        backendFormData.append("user_id", userId);

        const refInfo = formData.get("reference_image");
        if (refInfo && refInfo instanceof File) {
            backendFormData.append("reference_image", refInfo);
        }

        const pythonApiUrl = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";
        let pythonResponse;

        try {
            console.log(`[API] Connecting to Python Engine at ${pythonApiUrl}...`);
            pythonResponse = await fetch(`${pythonApiUrl}/generate`, {
                method: "POST",
                body: backendFormData as any,
            });
        } catch (fetchError: any) {
            console.error("[API] Python Connection Failed:", fetchError);
            throw new Error(`Could not connect to Python Engine at ${pythonApiUrl}. Is it running? Details: ${fetchError.message}`);
        }

        if (!pythonResponse.ok) {
            const errorText = await pythonResponse.text();
            console.error("[API] Python Engine Error:", errorText);

            // Refund credit on failure
            await prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: 1 } }
            });

            throw new Error(`Python Engine returned ${pythonResponse.status}: ${errorText}`);
        }

        // 5. Save Results
        const svgText = await pythonResponse.text();
        console.log("[API] Received SVG response, length:", svgText.length);

        await prisma.image.create({
            data: {
                userId: userId,
                prompt: promptVal,
                style: styleVal || "flat",
                svgUrl: "data:image/svg+xml;base64," + Buffer.from(svgText).toString("base64"),
            }
        });

        return new NextResponse(svgText, {
            headers: { "Content-Type": "image/svg+xml" }
        });

    } catch (error: any) {
        console.error("GENERATE API ERROR:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            details: "Check server logs"
        }, { status: 500 });
    }
}
