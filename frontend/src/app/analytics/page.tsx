"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { analyticsApi } from "@/lib/api";
import { LoadingBackdrop } from "@/components/ui/backdrop";

type Schedule = {
  id: string;
  description: string;
  workflowIdentifier: string;
  targetApplication: string;
  httpMethod: string;
  frequency: string;
  cronExpression: string;
  active: boolean;
  successRate: number;
  lastExecutionTime?: string;
};

export default function AnalyticsPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const response = await analyticsApi.getAllWithSuccessRates();
        setSchedules(response.data);
        setFilteredSchedules(response.data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSchedules(schedules);
    } else {
      const filtered = schedules.filter(
        (schedule) =>
          schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.workflowIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.targetApplication.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSchedules(filtered);
    }
  }, [searchTerm, schedules]);

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 90) {
      return <Badge className="bg-green-500">High ({rate}%)</Badge>;
    } else if (rate >= 70) {
      return <Badge className="bg-yellow-500">Medium ({rate}%)</Badge>;
    } else {
      return <Badge className="bg-red-500">Low ({rate}%)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Schedule Analytics</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule Performance</CardTitle>
          <CardDescription>
            View and analyze schedule performance metrics
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schedules by description, workflow ID, or application..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Workflow ID</TableHead>
                  <TableHead>Target Application</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.description}</TableCell>
                    <TableCell>{schedule.workflowIdentifier}</TableCell>
                    <TableCell>{schedule.targetApplication}</TableCell>
                    <TableCell>{schedule.httpMethod}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {schedule.frequency === "once" ? "Once" : schedule.cronExpression}
                      </div>
                    </TableCell>
                    <TableCell>
                      {schedule.active ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getSuccessRateBadge(schedule.successRate)}</TableCell>
                    <TableCell>
                      <Link href={`/executions/${schedule.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          History
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              {searchTerm ? (
                <>
                  <p className="text-lg font-medium">No matching schedules found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search term or clear the filter
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">No schedules available</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first schedule to see analytics
                  </p>
                  <Link href="/schedules/new" className="mt-4">
                    <Button>Create Schedule</Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <LoadingBackdrop isOpen={isLoading} />
    </div>
  );
}
