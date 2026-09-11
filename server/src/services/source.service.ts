import { extractPdfFromBuffer } from "../lib/pdf.js";
import { enqueueSourceProcessing } from "../lib/source-event.js";
import { createSourceRecord } from "../repositories/source.repository.js";
import { getWorkspaceByIdService } from "./workspace.service.js";


async function createAndProcessSource(
    data: Parameters<typeof createSourceRecord>[0],
) {
    const source = await createSourceRecord(data);

    await enqueueSourceProcessing({
        sourceId: source.id,
        workspaceId: source.workspaceId,
    });

    return source;
}

export async function uploadPdfSource(
    workspaceId: string,
    userId: string,
    file: Express.Multer.File,
    title?: string,
) {
    await getWorkspaceByIdService(workspaceId, userId);

    // const upload = await uploadPdfToCloudinary(
    //     file.buffer,
    //     file.originalname,
    // );

    let content: string | null = null;
    let pageCount: number | undefined;

    try {
        const extracted = await extractPdfFromBuffer(file.buffer);
        content = extracted.text;
        pageCount = extracted.pageCount;
    } catch {
        // Inngest will retry extraction from Cloudinary if upload-time parse fails.
    }

    return createAndProcessSource({
        workspaceId,
        type: "PDF",
        title: title?.trim() || file.originalname.replace(/\.pdf$/i, ""),
        content,
        status: "PENDING",
        metadata: {
            // fileUrl: upload.secureUrl,
            // fileName: upload.originalFilename,
            // fileSize: upload.bytes,
            // publicId: upload.publicId,
            // resourceType: upload.resourceType,
            pageCount,
        },
    });
}