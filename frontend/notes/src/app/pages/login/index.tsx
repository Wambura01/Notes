"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AtSign, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { Toaster, toast } from "sonner";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TLoginInputs } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "@/shared/components/errorMessage";
import Link from "next/link";
import { GoogleIcon } from "@/assets/icons";
import apiCall from "@/utils/apiCall";
import { setAuthCookie } from "@/actions/setAuthCookie";
import { redirect } from "next/navigation";
import useStore from "@/store";

function Login() {
  const [seePassword, setSeePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setUserProfile = useStore((state) => state.setUserProfile);

  const loginSchema = yup.object({
    username: yup.string().required("Username is required!"),
    password: yup
      .string()
      .required("Password is required!")
      .min(8, "Password must be at least 8 characters!")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter!")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character!"
      ),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginInputs>({
    resolver: yupResolver(loginSchema),
  });

  const handleShowPassword = () => {
    setSeePassword(!seePassword);
  };

  const onSubmit: SubmitHandler<TLoginInputs> = async (data) => {
    setLoading(true);
    const response = await apiCall("/auth/signin", "POST", data, false);

    if (response.status === 200) {
      setLoading(false);
      reset();
      toast.success("Login successful! Redirecting...");
      setUserProfile({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        roles: response.data.roles,
      });
      await setAuthCookie(response.data).then(() => {
        setTimeout(() => {
          redirect("/");
        }, 2000);
      });
    }

    if (response.status === 404) {
      setLoading(false);
      toast.error(response.data.message);
    }

    if (response.status === 401) {
      setLoading(false);
      toast.error(response.data.message);
    }

    if (response.status === 500) {
      setLoading(false);
      toast.error(response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0F0F0F]">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col items-center justify-center bg-[#181818] rounded-lg p-4 w-[90%] md:w-[50%] lg:w-[30%] shadow-lg">
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-[#FFFFFF]">Login</h1>
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </div>
        <form
          className="flex flex-col items-center justify-center gap-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-lg py-1 px-2 w-full">
              <AtSign className="w-6 h-6 text-[#FFFFFF]" />
              <Input
                type="text"
                {...register("username")}
                placeholder="Username"
                className="text-[#FFFFFF] border-none outline-none"
              />
            </div>
            {errors.username ? (
              <ErrorMessage message={errors.username?.message} />
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-lg py-1 px-2 w-full">
              <LockKeyhole className="w-6 h-6 text-[#FFFFFF]" />
              <Input
                type={seePassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="text-[#FFFFFF] border-none outline-none"
              />
              {seePassword ? (
                <EyeOff
                  className="w-6 h-6 text-[#FFFFFF]"
                  onClick={handleShowPassword}
                />
              ) : (
                <Eye
                  className="w-6 h-6 text-[#FFFFFF]"
                  onClick={handleShowPassword}
                />
              )}
            </div>
            {errors.password ? (
              <ErrorMessage message={errors.password?.message} />
            ) : (
              ""
            )}
          </div>
          {loading ? (
            <Button
              disabled
              className="w-full cursor-pointer"
              variant="outline"
            >
              <Loader2 className="animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full cursor-pointer"
              variant="outline"
            >
              Login
            </Button>
          )}
        </form>
        <div className="flex items-center justify-center gap-2 w-full my-4">
          <div className="w-full h-[1px] bg-gray-400"></div>
          <p className="text-gray-400">or</p>
          <div className="w-full h-[1px] bg-gray-400"></div>
        </div>
        <div className="flex items-center justify-center gap-2 w-full">
          <Button
            variant="outline"
            size="icon"
            className="w-[20%] cursor-pointer"
          >
            <GoogleIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
