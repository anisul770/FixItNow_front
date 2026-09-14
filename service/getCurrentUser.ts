import { cache } from "react";

import type { IUser } from "@/lib/types";

import { authorizedRequest } from "./authorizedRequest";

type TSessionError = { success: boolean; message: string };

export const getCurrentUser = cache(
  async (): Promise<IUser | TSessionError> => {
    try {
      const result = await authorizedRequest("/api/users/me");

      if (!result) {
        return {
          success: false,
          message: "User not logged in!",
        };
      }

      const profile = (result.data as { profile?: IUser } | undefined)
        ?.profile;

      return (
        profile ?? {
          success: false,
          message:
            (result.message as string) ??
            "Your session has expired. Please log in again.",
        }
      );
    } catch {
      return {
        success: false,
        message: "Could not reach the server.",
      };
    }
  }
);
