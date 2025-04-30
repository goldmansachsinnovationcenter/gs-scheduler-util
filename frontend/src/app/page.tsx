import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, ListChecks, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">API Scheduler</h1>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">
            <CalendarClock className="mr-2 h-4 w-4" />
            Schedule API Calls
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="executions">
            <ListChecks className="mr-2 h-4 w-4" />
            Execution History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Schedule</CardTitle>
              <CardDescription>
                Configure and schedule API calls with customizable parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Link href="/schedules/new">
                  <Button size="lg">
                    Create New Schedule
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Analytics</CardTitle>
              <CardDescription>
                View and analyze schedule performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Link href="/analytics">
                  <Button size="lg">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="executions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>
                View detailed execution history for all schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Link href="/executions">
                  <Button size="lg">
                    View Execution History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
