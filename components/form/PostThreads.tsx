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
import { Textarea } from "@/components/ui/textarea";
import { thearedValidation } from "@/lib/validations/theareds";
import { createThreads } from "@/lib/actions/threads.action";



interface Props {
  userId: string;
}


function PostThreads({userId}:Props) {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm<z.infer<typeof thearedValidation>>({
        resolver: zodResolver(thearedValidation),
        defaultValues: {
            threads: "",
          accountId: userId,
        },
      });
      const onSubmit = async (values: z.infer<typeof thearedValidation>) => {
        await createThreads({
          text: values.threads,
          author: userId,
          communityId:  null,
          path: pathname,
        });
    
        router.push("/");
      };
  return (
    <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='threads'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Enter Your Message:
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Post Thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThreads;
