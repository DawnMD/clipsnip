import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ClipboardCopy, ShieldBan, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type URL = {
  description: string | null;
  disabled: boolean;
  id: number;
  shortUrl: string;
  totalUniqueVisitCount: number;
  totalVisitCount: number;
  url: string;
  createdAt: Date;
};

export const columns: ColumnDef<URL>[] = [
  {
    accessorKey: "url",
    header: "URL",
    cell(props) {
      return (
        <Link href={props.getValue() as string}>
          {props.getValue() as string}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "shortUrl",
    header: "Short URL",
    cell(props) {
      return (
        <div className="group flex min-h-[70px] w-28 items-center justify-center gap-2 text-center">
          <span className="whitespace-nowrap">{`/snip/${
            props.getValue() as string
          }`}</span>
          <TooltipProvider delayDuration={0.3}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden lg:group-hover:flex"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      `${window.location.origin}/snip/${
                        props.getValue() as string
                      }`,
                    );
                  }}
                >
                  <ClipboardCopy className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    accessorKey: "totalVisitCount",
    header: "Total Visits",
    accessorFn: (row) => row.totalVisitCount - 1,
  },
  // {
  //   accessorKey: "totalUniqueVisitCount",
  //   header: "Unique Visits",
  //   accessorFn: (row) => row.totalUniqueVisitCount - 1,
  // },
  {
    accessorKey: "createdAt",
    header: "Created At",
    accessorFn: (row) => format(new Date(row.createdAt), "dd MMM yyyy"),
  },
  {
    accessorKey: "disabled",
    header: "Status",
    cell(props) {
      return (
        <TooltipProvider delayDuration={0.3}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={
                  (props.getValue() as boolean) ? "destructive" : "default"
                }
              >
                {(props.getValue() as boolean) ? (
                  <ShieldBan className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{(props.getValue() as boolean) ? "Disabled" : "Enabled"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
