"use server";

import { cookies } from "next/headers";

type TUser = {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
};

export async function setAuthCookie(user: TUser) {
  (await cookies()).set("accessToken", user.accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });

  (await cookies()).set("user", JSON.stringify(user), {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}
