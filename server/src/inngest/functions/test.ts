import { inngest } from "../client.js";

export const test = inngest.createFunction(
  { id: "test", triggers: [{ event: "test" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
