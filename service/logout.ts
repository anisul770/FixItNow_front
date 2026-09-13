"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // Every page renders the navbar from the session, so the whole tree's
  // cached output is stale the moment the session changes.
  revalidatePath("/", "layout");

  redirect("/login");
};
