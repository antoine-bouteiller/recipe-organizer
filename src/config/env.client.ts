import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    VITE_BUCKET_URL: z.string().min(1),
  },
  clientPrefix: "VITE_",

  emptyStringAsUndefined: true,

  runtimeEnvStrict: {
    VITE_BUCKET_URL: import.meta.env.VITE_BUCKET_URL,
  },
});
