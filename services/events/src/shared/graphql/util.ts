import { Request } from "express";
import { XHasuraRole, XHasuraUserID } from "../types";

export function rangeScalaNames(name: string, length: number): string {
  let result = "";

  for (let i = 0; i <= length; i++) {
    result += `scalar ${name}${i}\n`;
  }

  return result;
}

export function getCtxUserID(req: Request): string {
  return req.get(XHasuraUserID);
}

export function getCtxUserRole(req: Request): string {
  return req.get(XHasuraRole);
}
