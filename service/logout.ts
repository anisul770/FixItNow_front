"use server";

import { refresh, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // revalidatePath tells the SERVER not to serve a stale render of any route
  // sharing the root layout on the next request. refresh() tells THIS
  // browser to drop every route it already has cached client-side — without
  // it, pages visited earlier in the session keep showing logged-in content
  // until their own client cache naturally expires.
  revalidatePath("/", "layout");
  refresh();

  redirect("/login");
};
