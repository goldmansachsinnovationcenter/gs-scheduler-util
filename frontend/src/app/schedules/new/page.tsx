"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, Server, Users } from "lucide-react";
import Link from "next/link";
import { LoadingBackdrop } from "@/components/ui/backdrop";
import { scheduleApi } from "@/lib/api";

const formSchema = z.object({
  frequency: z.enum(["once", "repetitive"]),
  dayOfWeek: z.string().optional(),
  dayOfMonth: z.string().optional(),
  weekOfMonth: z.string().optional(),
  monthOfYear: z.string().optional(),
  hourOfDay: z.string().optional(),
  minuteOfHour: z.string().optional(),
  
  httpMethod: z.enum(["GET", "POST"]),
  payload: z.string().optional(),
  workflowIdentifier: z.string().min(1, "Workflow identifier is required"),
  shouldRetry: z.boolean().default(false),
  maxRetries: z.string().optional(),
  
  description: z.string().min(1, "Description is required"),
  automationRequestId: z.string().min(1, "Automation request ID is required"),
  targetApplication: z.string().min(1, "Target application is required"),
  contactPersons: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(1, "Phone number is required"),
    })
  ).min(2, "At least two contact persons are required"),
  communicationDL: z.string().min(1, "Communication DL is required"),
});

type ContactPerson = {
  name: string;
  email: string;
  phone: string;
};

type FormValues = z.infer<typeof formSchema>;

export default function NewSchedulePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("cronJob");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
    { name: "", email: "", phone: "" },
    { name: "", email: "", phone: "" },
  ]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      frequency: "repetitive",
      httpMethod: "GET",
      shouldRetry: false,
      contactPersons: contactPersons,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await scheduleApi.create(data);
      router.push("/");
    } catch (error) {
      console.error("Failed to create schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addContactPerson = () => {
    setContactPersons([...contactPersons, { name: "", email: "", phone: "" }]);
    const currentContactPersons = form.getValues("contactPersons") || [];
    form.setValue("contactPersons", [...currentContactPersons, { name: "", email: "", phone: "" }]);
  };
  
  const removeContactPerson = (index: number) => {
    if (contactPersons.length <= 2) return; // Ensure at least two contact persons
    const newContactPersons = [...contactPersons];
    newContactPersons.splice(index, 1);
    setContactPersons(newContactPersons);
    form.setValue("contactPersons", newContactPersons);
  };
  
  const daysOfWeek = [
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
    { value: "7", label: "Sunday" },
  ];
  
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
  
  const weeksOfMonth = Array.from({ length: 5 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
  
  const monthsOfYear = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => ({
    value: String(i),
    label: String(i),
  }));
  
  const minutesOfHour = Array.from({ length: 60 }, (_, i) => ({
    value: String(i),
    label: String(i),
  }));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Schedule</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule Configuration</CardTitle>
          <CardDescription>
            Configure your API call schedule with the following details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cronJob">
                    <Clock className="mr-2 h-4 w-4" />
                    Cron Job
                  </TabsTrigger>
                  <TabsTrigger value="apiCall">
                    <Server className="mr-2 h-4 w-4" />
                    API Call
                  </TabsTrigger>
                  <TabsTrigger value="owner">
                    <Users className="mr-2 h-4 w-4" />
                    Owner Details
                  </TabsTrigger>
                </TabsList>
                
                {/* Cron Job Expression Inputs */}
                <TabsContent value="cronJob" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Frequency</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="once" id="once" />
                                <label htmlFor="once" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Once
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="repetitive" id="repetitive" />
                                <label htmlFor="repetitive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  Repetitive
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("frequency") === "repetitive" && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dayOfWeek"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day of Week</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day of week" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {daysOfWeek.map((day) => (
                                    <SelectItem key={day.value} value={day.value}>
                                      {day.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dayOfMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day of Month</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day of month" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {daysOfMonth.map((day) => (
                                    <SelectItem key={day.value} value={day.value}>
                                      {day.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="weekOfMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Week of Month</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select week of month" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {weeksOfMonth.map((week) => (
                                    <SelectItem key={week.value} value={week.value}>
                                      {week.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="monthOfYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Month of Year</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select month of year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {monthsOfYear.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                      {month.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="hourOfDay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hour of Day</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select hour of day" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {hoursOfDay.map((hour) => (
                                    <SelectItem key={hour.value} value={hour.value}>
                                      {hour.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="minuteOfHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minute of Hour</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select minute of hour" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {minutesOfHour.map((minute) => (
                                    <SelectItem key={minute.value} value={minute.value}>
                                      {minute.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setActiveTab("apiCall")}>
                      Next: API Call Details
                    </Button>
                  </div>
                </TabsContent>
                
                {/* API Call Details */}
                <TabsContent value="apiCall" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="httpMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>HTTP Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="GET" id="get" />
                                <label htmlFor="get" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  GET
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="POST" id="post" />
                                <label htmlFor="post" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  POST
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("httpMethod") === "POST" && (
                      <FormField
                        control={form.control}
                        name="payload"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payload (JSON)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='{"key": "value"}'
                                className="font-mono"
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter a valid JSON object to be used as the payload for the POST call.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="workflowIdentifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workflow Identifier</FormLabel>
                          <FormControl>
                            <Input placeholder="workflow-id" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be substituted into the URL: https://abc.bcp.com/execute/workflow/&lt;WORKFLOW_IDENTIFIER&gt;
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="shouldRetry"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Retry on Failure
                            </FormLabel>
                            <FormDescription>
                              Should the API call be retried if it fails?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("shouldRetry") && (
                      <FormField
                        control={form.control}
                        name="maxRetries"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Retries</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="10" placeholder="3" {...field} />
                            </FormControl>
                            <FormDescription>
                              How many times should the API call be retried before giving up?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("cronJob")}>
                      Back: Cron Job
                    </Button>
                    <Button type="button" onClick={() => setActiveTab("owner")}>
                      Next: Owner Details
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Schedule Owner Details */}
                <TabsContent value="owner" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the purpose of this schedule"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of the schedule with its purpose.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="automationRequestId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Automation Request ID</FormLabel>
                          <FormControl>
                            <Input placeholder="REQ-12345" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the linked automation request ID.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetApplication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Application/Deployment</FormLabel>
                          <FormControl>
                            <Input placeholder="Application name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Specify the targeted application or deployment.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base">Contact Persons</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addContactPerson}
                        >
                          Add Contact
                        </Button>
                      </div>
                      
                      <FormDescription>
                        Add at least two contact persons who can be reached in case of issues.
                      </FormDescription>
                      
                      {contactPersons.map((_, index) => (
                        <div key={index} className="space-y-4 p-4 border rounded-md">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Contact Person {index + 1}</h4>
                            {contactPersons.length > 2 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeContactPerson(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.email`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="john.doe@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`contactPersons.${index}.phone`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="communicationDL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Communication Distribution List</FormLabel>
                          <FormControl>
                            <Input placeholder="team-dl@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the distribution list email to share communications in case of issues.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("apiCall")}>
                      Back: API Call
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      Create Schedule
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Loading backdrop for visual feedback during state changes */}
      <LoadingBackdrop isOpen={isSubmitting} />
    </div>
  );
}
