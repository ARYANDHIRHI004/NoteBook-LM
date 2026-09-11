import { findSourceContentById } from "../../repositories/source.repository.js";
import { findSourceChunksBySourceId } from "../../repositories/sourceChunk.repository.js";
import { chunkSourceContent, embedAndIndexSource, extractSourceContent, markSourceFailed, markSourceProcessing } from "../../services/source-process.service.js";
import { inngest } from "../client.js";

export const processSource = inngest.createFunction(
    {
        id: "process-source",
        retries: 3,
        triggers: [{ event: "source/created" }],
    },
    async ({ event, step }) => {
        const { sourceId } = event.data;

        await step.run("mark-processing", () => markSourceProcessing(sourceId));

        try {
            const extracted = await step.run("extract-content", () =>
                extractSourceContent(sourceId),
            );

            await step.run("chunk-content", () =>
                chunkSourceContent(
                    sourceId,
                    extracted.text as string,
                    extracted.pages as string[],
                ),
            );

            const result = await step.run("embed-and-index", async () => {
                const source = await findSourceContentById(sourceId);
                if (!source) {
                    throw new Error("Source not found");
                }

                const chunks = await findSourceChunksBySourceId(sourceId);
                await embedAndIndexSource(source, chunks);

                return { chunkCount: chunks.length };
            });

            return { sourceId, status: "READY", ...result };
        } catch (error) {
            await step.run("mark-failed", async () => {
                const source = await findSourceContentById(sourceId);
                if (source) {
                    await markSourceFailed(sourceId, error, source.metadata);
                }
            });
            throw error;
        }
    },
);
