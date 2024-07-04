"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { commentValidation } from "@/lib/validations/theareds";
import { addComment } from "@/lib/actions/threads.action";
import Image from "next/image";

interface Props {
  userId: string;
  threadId: string;
  currentUserImg: string;
}

const CommentForm = ({ userId, threadId, currentUserImg }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      threads: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof commentValidation>) => {
    await addComment
    (JSON.parse(userId),
     values.threads,
      threadId, 
      pathname);

   form.reset()
  };
  return (
    <Form {...form}>
      <form
        className="mt-10 flex flex-row items-center justify-start gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="threads"
          render={({ field }) => (
            <FormItem className="flex flex-1 items-center flex-row gap-3">
              <FormLabel className="text-base-semibold text-light-2">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt='current_user'
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Input type="text" placeholder="comment..." {...field} />
              </FormControl>
          
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          reply
        </Button>
      </form>
    </Form>
  );
};

export default CommentForm;
