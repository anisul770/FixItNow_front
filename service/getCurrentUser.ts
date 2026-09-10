import { cookies } from "next/headers";

import type { IUser } from "@/lib/types";

/**
 * Resolves the signed-in user from the accessToken cookie.
 * Returns null whenever there is no usable session, so callers can render
 * their logged-out state without try/catch of their own.
 */
export const getCurrentUser = async (): Promise<IUser | {success : boolean,message: string}> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if(!accessToken){
        // throw new Error("User not logged In!")

        return{
            success  : false,
            message: "User not logged in!",
        }
    }
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "force-cache",
      next : {
            revalidate : 60*60*24,
            tags : ["my-profile"]
        }
    });

    const result = await res.json();
    return result?.data?.profile ?? null;
};
