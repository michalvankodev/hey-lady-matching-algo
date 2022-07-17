// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { membersRouter } from "./members";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("members.", membersRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
