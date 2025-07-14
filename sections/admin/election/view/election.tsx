"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { DateTimePicker } from "../date-picker"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import PageContainer from "@/components/layout/page-container"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { Breadcrumbs } from "@/components/breadcrumbs"


const FormSchema = z.object({
  isElectionActive: z.boolean(),
  schedule: z.object({
    from: z.date({ required_error: "Start date is required" }),
    to: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.to > data.from, {
    message: "End date must be after start date",
    path: ["to"],
  }),
})

export default function ElectionManagementPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [initialSchedule, setInitialSchedule] = useState({
    isElectionActive: true,
    schedule: {
      from: new Date(),
      to: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  });

  // Breadcrumbs data
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/admin' },
    { title: 'Election Management', link: '/admin/election' },
  ];

  useEffect(() => {
    const fetchElectionSettings = async () => {
      const docSnap = await getDoc(doc(db, "election", "settings"));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setInitialSchedule({
          isElectionActive: data.isElectionActive,
          schedule: {
            from: new Date(data.schedule.from),
            to: new Date(data.schedule.to),
          },
        });
        form.reset({
          isElectionActive: data.isElectionActive,
          schedule: {
            from: new Date(data.schedule.from),
            to: new Date(data.schedule.to),
          },
        });
      }
      setIsLoading(false)
    };

    fetchElectionSettings();
  }, []);


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialSchedule,
    // {
    //   isElectionActive: true,
    //   schedule: {
    //     from: new Date(),
    //     to: new Date(new Date().setDate(new Date().getDate() + 7)),
    //   },
    // },
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Handler untuk submit form tanpa validation cek
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await setDoc(doc(db, "election", "settings"), {
      isElectionActive: data.isElectionActive,
      schedule: {
        from: data.schedule.from.toISOString(),
        to: data.schedule.to.toISOString(),
      },
    })

    toast({
      title: "Election settings applied",
      description: "Election settings have been updated successfully.",
    })
  }

  // implementasi untuk validation check
  // const onSubmit = async (data: z.infer<typeof FormSchema>) => {
  //   try {
  //     // Manual validation check (optional - schema sudah handle ini)
  //     if (data.schedule.from >= data.schedule.to) {
  //       toast({
  //         title: "Invalid Schedule",
  //         description: "End date and time must be after start date and time.",
  //         variant: "destructive",
  //       })
  //       return
  //     }

  //     // Check if dates are in the past
  //     if (data.schedule.from < new Date()) {
  //       toast({
  //         title: "Invalid Start Date",
  //         description: "Start date cannot be in the past.",
  //         variant: "destructive",
  //       })
  //       return
  //     }

  //     await setDoc(doc(db, "election", "settings"), {
  //       isElectionActive: data.isElectionActive,
  //       schedule: {
  //         from: data.schedule.from.toISOString(),
  //         to: data.schedule.to.toISOString(),
  //       },
  //     })

  //     toast({
  //       title: "Election settings applied",
  //       description: "Election settings have been updated successfully.",
  //     })
  //   } catch (error) {
  //     console.error("Error updating election settings:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to update election settings. Please try again.",
  //       variant: "destructive",
  //     })
  //   }
  // }

    // Handler untuk AlertDialog confirmation dengan error handling
    const handleConfirmSubmit = async () => {
      try {
        // Trigger form validation
        const isValid = await form.trigger()
        
        if (!isValid) {
          // Get form errors
          const errors = form.formState.errors
          
          if (errors.schedule?.message) {
            toast({
              title: "Invalid Schedule",
              description: errors.schedule.message,
              variant: "destructive",
            })
          } else if (errors.schedule?.from?.message) {
            toast({
              title: "Invalid Start Date",
              description: errors.schedule.from.message,
              variant: "destructive",
            })
          } else if (errors.schedule?.to?.message) {
            toast({
              title: "Invalid End Date", 
              description: errors.schedule.to.message,
              variant: "destructive",
            })
          } else {
            toast({
              title: "Validation Error",
              description: "Please check all fields and try again.",
              variant: "destructive",
            })
          }
          
          setIsDialogOpen(false)
          return
        }
  
        // If validation passes, submit the form
        const formData = form.getValues()
        await onSubmit(formData)
        setIsDialogOpen(false)
        
      } catch (error) {
        console.error("Form submission error:", error)
        toast({
          title: "Submission Error",
          description: "An error occurred while saving. Please try again.",
          variant: "destructive",
        })
        setIsDialogOpen(false)
      }
    }

  // skeleton loading ui
    if (isLoading) {
      return (
        <PageContainer scrollable={true}>
          <div className="space-y-4">
            {/* Breadcrumbs skeleton */}
            <Breadcrumbs items={breadcrumbItems} />
            
            {/* Title and description skeleton */}
            <h1 className="text-3xl font-bold tracking-tight">Election Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage election schedule for the current election.
            </p>
            
            {/* Form fields skeleton */}
            <div className="space-y-6">
              {/* Start Date & Time skeleton */}
              <div className="rounded-lg border p-4 space-y-4">
                <Skeleton className="h-6 w-32" /> {/* Label */}
                <Skeleton className="h-4 w-48" /> {/* Description */}
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    {/* <Skeleton className="h-4 w-20" /> */}
                    <Skeleton className="h-8 w-full" /> {/* Date picker */}
                  </div>
                  <div className="min-w-[120px] space-y-3">
                    {/* <Skeleton className="h-4 w-12" /> */}
                    <Skeleton className="h-8 w-full" /> {/* Time input */}
                  </div>
                </div>
              </div>
              
              {/* End Date & Time skeleton */}
              <div className="rounded-lg border p-4 space-y-4">
                <Skeleton className="h-6 w-28" /> {/* Label */}
                <Skeleton className="h-4 w-52" /> {/* Description */}
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    {/* <Skeleton className="h-4 w-18" /> */}
                    <Skeleton className="h-8 w-full" /> {/* Date picker */}
                  </div>
                  <div className="min-w-[120px] space-y-3">
                    {/* <Skeleton className="h-4 w-12" /> */}
                    <Skeleton className="h-8 w-full" /> {/* Time input */}
                  </div>
                </div>
              </div>
              
              {/* Button skeleton */}
              <div className="flex justify-end">
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        </PageContainer>
      )
    }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold tracking-tight">Election Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage election schedule for the current election.
            </p>
            <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Election Status */}
              {/* <FormField
                control={form.control}
                name="isElectionActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Election Status</FormLabel>
                      <FormDescription>
                        Enable or disable the election process.
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
              /> */}

              {/* Election Schedule */}
              {/* <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-4">
                    <FormLabel className="text-base mb-2 block">Election Schedule</FormLabel>
                    <FormDescription>
                        Set Date schedule for the election start and finished.
                      </FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Start Date & Time */}
              <FormField
                control={form.control}
                name="schedule.from"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-4">
                    <FormLabel className="text-base mb-2 block">
                      Election Start
                    </FormLabel>
                    <FormDescription>
                      Set when the election will start.
                    </FormDescription>
                    <FormControl>
                      <DateTimePicker
                        label="Start"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select start date and time"
                        minDate={new Date()}
                        id="election-start"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date & Time */}
              <FormField
                control={form.control}
                name="schedule.to"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-4">
                    <FormLabel className="text-base mb-2 block">
                      Election End
                    </FormLabel>
                    <FormDescription>
                      Set when the election will end.
                    </FormDescription>
                    <FormControl>
                      <DateTimePicker
                        label="End"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select end date and time"
                        minDate={form.watch("schedule.from") || new Date()}
                        id="election-end"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Schedule Summary */}
              {/* <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-base font-medium mb-2">Election Schedule Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Start:</span>{" "}
                    {form.watch("schedule.from") 
                      ? format(form.watch("schedule.from"), "EEEE, MMMM d, yyyy 'at' h:mm aa")
                      : "Not set"
                    }
                  </p>
                  <p>
                    <span className="font-medium">End:</span>{" "}
                    {form.watch("schedule.to") 
                      ? format(form.watch("schedule.to"), "EEEE, MMMM d, yyyy 'at' h:mm aa")
                      : "Not set"
                    }
                  </p>
                  {form.watch("schedule.from") && form.watch("schedule.to") && (
                    <p className="text-blue-600 dark:text-blue-400">
                      <span className="font-medium">Duration:</span>{" "}
                      {Math.ceil(
                        (form.watch("schedule.to").getTime() - form.watch("schedule.from").getTime()) 
                        / (1000 * 60 * 60 * 24)
                      )}{" "}
                      day(s)
                    </p>
                  )}
                </div>
              </div> */}

          <div className="flex justify-end">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button">Apply Changes</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apply Election Settings?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will update the election status and schedule. Are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmSubmit}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </Form>
      </div>
    </PageContainer>
  )
}
