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
import { api } from "~/utils/api";
import { CountUp } from "use-count-up";
import { DataTable } from "~/components/ui/data-table";
import { columns as urlColumns } from "~/components/UrlTable/columns";

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
    // isError: userLinksIsError
    isLoading: userLinksIsLoading,
  } = api.url.getUserLinks.useQuery();

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
              <p className="text-xl font-bold">
                <CountUp
                  isCounting
                  end={totalLinksCount}
                  duration={1}
                  easing="easeOutCubic"
                />
              </p>
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
              <p className="text-xl font-bold">
                <CountUp
                  isCounting
                  end={totalLinksClickCount}
                  duration={1}
                  easing="easeOutCubic"
                />
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <DataTable
          columns={urlColumns}
          data={userLinks ?? []}
          loading={userLinksIsLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
