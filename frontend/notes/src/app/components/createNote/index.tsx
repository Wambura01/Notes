"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMessage from "@/shared/components/errorMessage";
import apiCall from "@/utils/apiCall";
import { Loader2 } from "lucide-react";
import useStore from "@/store";
import { TCreateNoteInputs } from "@/shared/types";
import Editor from "../textEditor/editor";

function CreateNote() {
  const [loading, setLoading] = useState(false);
  const userProfile = useStore((state) => state.userProfile);

  const noteSchema = yup.object({
    title: yup.string().required("Title is required!"),
    content: yup.string().required("Content is required!"),
  });

  const {
    register,
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(noteSchema),
  });

  const onSubmit: SubmitHandler<TCreateNoteInputs> = async (values) => {
    setLoading(true);

    const data = {
      ...values,
      owner: userProfile?.id,
    };

    const response = await apiCall("/notes/create-note", "POST", data, true);

    if (response.status === 201) {
      setLoading(false);
      reset();
      toast.success("Note created successfully!");
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
    <div className="flex flex-col items-center justify-start bg-[#0F0F0F] w-[50%]">
      <Toaster richColors position="top-right" />
      <div className="flex flex-col items-center justify-center bg-[#181818] rounded-lg p-4 w-[90%] shadow-lg">
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-[#FFFFFF]">Create a note</h1>
          <p className="text-sm text-gray-400">Post a note</p>
        </div>
        <form
          className="flex flex-col items-center justify-center gap-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="title" className="text-[#FFFFFF]">
              Title
            </Label>
            <Input
              placeholder="Note title..."
              className="text-[#FFFFFF] bg-[#0F0F0F]"
              id="title"
              {...register("title")}
            />
            {errors.title ? (
              <ErrorMessage message={errors.title?.message} />
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="content" className="text-[#FFFFFF]">
              Note
            </Label>
            <Controller
              name="content"
              control={control}
              render={({ field: { value } }) => (
                <Editor
                  value={value}
                  placeholder="Enter your note..."
                  onChange={(value) => setValue("content", value)}
                />
              )}
            />
            {errors.content ? (
              <ErrorMessage message={errors.content?.message} />
            ) : (
              ""
            )}
          </div>
          {/* <div className="flex flex-col gap-2 w-full"> */}
          {/* <div className="flex items-center gap-2 bg-[#0F0F0F] rounded-lg py-1 px-2 w-full">
              <Tag className="w-6 h-6 text-[#FFFFFF]" />
              <Input
                type="text"
                // {...register("tags")}
                placeholder="Tag someone..."
                className="text-[#FFFFFF] border-none outline-none"
              />
            </div> */}
          {/* {errors.tags ? <ErrorMessage message={errors.tags?.message} /> : ""} */}
          {/* </div> */}
          <div className="w-full mt-10">
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
                Create
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNote;
