import * as z from "zod";

export const thearedValidation = z.object({
  threads: z.string().nonempty().min(3),
  accountId: z.string(),
});
export const commentValidation = z.object({
  threads: z.string().nonempty().min(3),
});
