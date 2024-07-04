"use client";
import { uservalidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import * as z from "zod";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { UpdateUser } from "@/lib/actions/user.actions";

interface Props {
  user: {
    id: string;
    name: string;
    username: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function AccountProfile({ user, btnTitle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");

  const form = useForm({
    resolver: zodResolver(uservalidation),
    defaultValues: {
      profile_photo: user?.image || "",
      username: user.username || "",
      name: user?.name || "",
      bio: user?.bio || "",
    },
  });
  const onSubmit = async (values: z.infer<typeof uservalidation>) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }

    await UpdateUser({
      name: values.name,
      path: pathname,
      username: values.username,
      userId: user.id,
      bio: values.bio,
      image: values.profile_photo,
    });

    // if (pathname === "/profile/edit") {
    //   router.back();
    // } else {
    //   router.push("/");
    // }
  };

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className=" account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    width={96}
                    height={96}
                    alt="profile photo"
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    width={24}
                    height={24}
                    alt="profile photo"
                    priority
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1  text-base-semibold text-gary-200">
                <Input

                  className="account-form_image-input"
                  type="file"
                  accept="image/*"
                  placeholder="import image"
                  onChange={(e) => handleImage(e, field.onChange)}

                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus"
                  type="text"
                  placeholder="Enter your Name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                userName
              </FormLabel>
              <FormControl>
                <Input
                  className="account-form_input no-focus"
                  type="text"
                  placeholder="Enter your userName"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                userName
              </FormLabel>
              <FormControl>
                <Textarea
                  className="account-form_input no-focus"
                  rows={10}
                  placeholder="Enter your bio"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
}

export default AccountProfile;
