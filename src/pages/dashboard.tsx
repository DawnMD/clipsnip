import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { type RouterOutputs, api } from "~/utils/api";
import { CountUp } from "use-count-up";
import { DataTable } from "~/components/ui/data-table";
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { format } from "date-fns";
import { ShieldBan, ShieldCheck } from "lucide-react";

type URLDataType = RouterOutputs["url"]["getUserLinks"][1];

const Dashboard = () => {
  const {
    data: totalLinksCount,
    isError: totalLinksCountIsError,
    isLoading: totalLinksCountIsLoading,
  } = api.url.getUserLinksCreateCount.useQuery();

  const {
    data: totalLinksClickCount,
    isError: totalLinksClickCountIsError,
    isLoading: totalLinksClickCountIsLoading,
  } = api.url.getUserLinksClickCount.useQuery();

  const {
    data: userLinks,
    isError: userLinksIsError,
    isLoading: userLinksIsLoading,
    refetch: refetchUserLinks,
  } = api.url.getUserLinks.useQuery();

  const { mutate } = api.url.updateLinkStatus.useMutation({
    onSuccess: async () => {
      await refetchUserLinks();
    },
  });

  const columns = useMemo<ColumnDef<URLDataType>[]>(
    () => [
      {
        accessorKey: "url",
        header: "URL",
        cell(props) {
          return (
            <Link href={props.getValue<string>()}>
              {props.getValue<string>()}
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
            <div className="text-center">
              <TooltipProvider delayDuration={0.3}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="link"
                      onClick={() => {
                        void navigator.clipboard.writeText(
                          `${
                            window.location.origin
                          }/snip/${props.getValue<string>()}`,
                        );
                      }}
                    >
                      <span className="whitespace-nowrap">{`/snip/${props.getValue<string>()}`}</span>
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
                      props.getValue<boolean>() ? "destructive" : "default"
                    }
                    onClick={() =>
                      mutate({
                        slug: props.row.original.shortUrl,
                      })
                    }
                  >
                    {props.getValue<boolean>() ? (
                      <ShieldBan className="h-5 w-5" />
                    ) : (
                      <ShieldCheck className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{props.getValue<boolean>() ? "Disabled" : "Enabled"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
    ],
    [mutate],
  );

  return (
    <div className="container flex flex-col gap-8 px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button
          asChild
          variant="link"
          size="default"
          className="bg-foreground text-background hover:no-underline"
        >
          <Link href="/links/create">Create Short Link</Link>
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
            <CardDescription>Total links shortened</CardDescription>
          </CardHeader>
          <CardContent>
            {totalLinksCountIsError && (
              <p className="text-xl font-bold">
                Unable to fetch data at this time
              </p>
            )}
            {!totalLinksCountIsError && totalLinksCountIsLoading ? (
              <Skeleton className="h-[24px] w-[50px] rounded-full" />
            ) : (
              totalLinksCount && (
                <p className="text-xl font-bold">
                  <CountUp
                    isCounting
                    end={totalLinksCount}
                    duration={1}
                    easing="easeOutCubic"
                  />
                </p>
              )
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visited</CardTitle>
            <CardDescription>Short lniks visited/clicked</CardDescription>
          </CardHeader>
          <CardContent>
            {totalLinksClickCountIsError && (
              <p className="text-xl font-bold">
                Unable to fetch data at this time
              </p>
            )}
            {!totalLinksClickCountIsError && totalLinksClickCountIsLoading ? (
              <Skeleton className="h-[24px] w-[50px] rounded-full" />
            ) : (
              totalLinksClickCount && (
                <p className="text-xl font-bold">
                  <CountUp
                    isCounting
                    end={totalLinksClickCount}
                    duration={1}
                    easing="easeOutCubic"
                  />
                </p>
              )
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={userLinks ?? []}
          loading={userLinksIsLoading}
          isError={userLinksIsError}
        />
      </div>
    </div>
  );
};

export default Dashboard;
