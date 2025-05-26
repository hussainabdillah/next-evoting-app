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


const FormSchema = z.object({
  isElectionActive: z.boolean(),
  schedule: z.object({
    from: z.date({ required_error: "Start date is required" }),
    to: z.date({ required_error: "End date is required" }),
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

  // skeleton loading ui
    if (isLoading) {
      return (
        <PageContainer scrollable={true}>
          <main className="flex-1 p-8 overflow-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl font-bold mb-6">Manage Election</h1>
              {/* <Skeleton className="h-24 w-full rounded-lg" /> Election status */}
              <Skeleton className="h-24 w-full rounded-lg" /> {/* Calendar date range */}
              {/* button */}
              {/* <div className="flex justify-end">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div> */}
            </div>
          </main>
        </PageContainer>
      )
    }

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-6">Manage Election</h1>

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
              <FormField
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
              />

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
                        onClick={form.handleSubmit((data) => {
                          onSubmit(data)
                          setIsDialogOpen(false)
                        })}
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
      </main>
    </PageContainer>
  )
}
