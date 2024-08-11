import { ZodIssue } from "zod";

type ActionResult<T> =
  //delete union in case
  | { status: "success"; data: T }
  | { status: "error"; error: string | ZodIssue[] };
