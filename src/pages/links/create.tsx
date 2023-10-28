import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";
import { ToastAction } from "~/components/ui/toast";

export const createLinkFormSchema = z.object({
  link: z.string().url(),
  description: z.string().optional(),
  slug: z.string().optional(),
  enabled: z.boolean().default(true),
});

const CreateLink = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createLinkFormSchema>>({
    resolver: zodResolver(createLinkFormSchema),
    defaultValues: {
      link: "",
      description: undefined,
      slug: undefined,
      enabled: true,
    },
  });

  const { mutateAsync } = api.url.createLink.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Link Created",
        description: data,
        action: (
          <ToastAction
            altText="Copy"
            onClick={() => navigator.clipboard.writeText(data)}
          >
            Copy
          </ToastAction>
        ),
      });
      form.reset();
    },
  });

  const onSubmit = async (values: z.infer<typeof createLinkFormSchema>) => {
    await mutateAsync(values);
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight">Create Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable</FormLabel>
                  <FormDescription>
                    User can click and redirect to orginal link.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://" {...field} />
                </FormControl>
                <FormDescription>This is your original link.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Will redirect to google" {...field} />
                </FormControl>
                <FormDescription>
                  This is your link description.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="sqwd-link" {...field} />
                </FormControl>
                <FormDescription>
                  Leave black to automatically generate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateLink;
