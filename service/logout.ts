"use server";

import { refresh, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  revalidatePath("/", "layout");
  refresh();

  redirect("/login");
};
