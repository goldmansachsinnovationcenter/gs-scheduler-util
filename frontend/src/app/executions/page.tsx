"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { executionHistoryApi, scheduleApi } from "@/lib/api";
import { LoadingBackdrop } from "@/components/ui/backdrop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Schedule = {
  id: string;
  description: string;
  workflowIdentifier: string;
  targetApplication: string;
  httpMethod: string;
  frequency: string;
  cronExpression: string;
  active: boolean;
  shouldRetry: boolean;
  maxRetries: number;
  payload: string;
  communicationDL: string;
  contactPersons: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  automationRequestId: string;
};

type ExecutionHistory = {
  id: string;
  scheduleId: string;
  executionTime: string;
  responseUrl: string;
  status: string;
  retryCount: number;
  errorMessage?: string;
};

export default function ExecutionsPage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [executions, setExecutions] = useState<ExecutionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExecutions, setFilteredExecutions] = useState<ExecutionHistory[]>([]);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/executions\/([^\/]+)/);
    if (match && match[1]) {
      setScheduleId(match[1]);
    }
  }, []);

  useEffect(() => {
    if (!scheduleId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [scheduleResponse, executionsResponse] = await Promise.all([
          scheduleApi.getById(scheduleId),
          executionHistoryApi.getByScheduleId(scheduleId)
        ]);
        
        setSchedule(scheduleResponse.data);
        setExecutions(executionsResponse.data);
        setFilteredExecutions(executionsResponse.data);
      } catch (error) {
        console.error("Failed to fetch execution data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [scheduleId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredExecutions(executions);
    } else {
      const filtered = executions.filter(
        (execution) =>
          execution.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          execution.responseUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (execution.errorMessage && execution.errorMessage.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredExecutions(filtered);
    }
  }, [searchTerm, executions]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return (
          <div className="flex items-center">
            <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
            <Badge className="bg-green-500">Success</Badge>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center">
            <XCircle className="mr-1 h-4 w-4 text-red-500" />
            <Badge className="bg-red-500">Failed</Badge>
          </div>
        );
      case "retrying":
        return (
          <div className="flex items-center">
            <AlertCircle className="mr-1 h-4 w-4 text-yellow-500" />
            <Badge className="bg-yellow-500">Retrying</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-blue-500" />
            <Badge className="bg-blue-500">{status}</Badge>
          </div>
        );
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/analytics" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Execution History</h1>
      </div>
      
      {schedule ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{schedule.description}</CardTitle>
              <CardDescription>
                Execution history for workflow: {schedule.workflowIdentifier}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">
                    Schedule Details
                  </TabsTrigger>
                  <TabsTrigger value="executions">
                    Execution History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">Target Application:</div>
                        <div>{schedule.targetApplication}</div>
                        <div className="font-medium">HTTP Method:</div>
                        <div>{schedule.httpMethod}</div>
                        <div className="font-medium">Workflow ID:</div>
                        <div>{schedule.workflowIdentifier}</div>
                        <div className="font-medium">Status:</div>
                        <div>
                          {schedule.active ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Schedule Configuration</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">Frequency:</div>
                        <div>{schedule.frequency}</div>
                        <div className="font-medium">Cron Expression:</div>
                        <div>{schedule.cronExpression}</div>
                        <div className="font-medium">Retry on Failure:</div>
                        <div>{schedule.shouldRetry ? 'Yes' : 'No'}</div>
                        {schedule.shouldRetry && (
                          <>
                            <div className="font-medium">Max Retries:</div>
                            <div>{schedule.maxRetries}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="text-sm font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {schedule.contactPersons.map((person, index) => (
                        <div key={index} className="border rounded-md p-3 space-y-2">
                          <div className="font-medium">Contact Person {index + 1}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium">Name:</div>
                            <div>{person.name}</div>
                            <div className="font-medium">Email:</div>
                            <div>{person.email}</div>
                            <div className="font-medium">Phone:</div>
                            <div>{person.phone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-2">
                      <div className="font-medium">Communication DL:</div>
                      <div>{schedule.communicationDL}</div>
                      <div className="font-medium">Automation Request ID:</div>
                      <div>{schedule.automationRequestId}</div>
                    </div>
                  </div>
                  
                  {schedule.httpMethod === "POST" && (
                    <div className="space-y-2 mt-4">
                      <h3 className="text-sm font-medium">Payload</h3>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto text-xs">
                        {schedule.payload}
                      </pre>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="executions" className="space-y-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search executions by status or response URL..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {filteredExecutions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Execution Time</TableHead>
                          <TableHead>Response URL</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Retry Count</TableHead>
                          <TableHead>Error Message</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredExecutions.map((execution) => (
                          <TableRow key={execution.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                {formatDateTime(execution.executionTime)}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {execution.responseUrl}
                            </TableCell>
                            <TableCell>{getStatusBadge(execution.status)}</TableCell>
                            <TableCell>{execution.retryCount}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {execution.errorMessage || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      {searchTerm ? (
                        <>
                          <p className="text-lg font-medium">No matching executions found</p>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search term or clear the filter
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-medium">No execution history available</p>
                          <p className="text-sm text-muted-foreground">
                            This schedule has not been executed yet
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Select a Schedule</CardTitle>
            <CardDescription>
              Please select a schedule from the analytics page to view its execution history
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/analytics">
              <Button>Go to Analytics</Button>
            </Link>
          </CardContent>
        </Card>
      )}
      
      <LoadingBackdrop isOpen={isLoading} />
    </div>
  );
}
