'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, CalendarFold } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface CountdownProps {
  schedule: { from: Date; to: Date } | null
  title?: string
  description?: string
  linkText?: string
  linkUrl?: string
}

export default function ElectionCountdown({
  schedule,
  title = "Countdown",
  description = "Get ready to cast your vote in the upcoming election!",
  linkText = "Voter Information",
  linkUrl = "/voter-info"
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [status, setStatus] = useState<"before" | "during" | "after" | "loading">("loading")
  
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!schedule) return
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = schedule.to.getTime() - now.getTime()
      
      if (difference <= 0) {
        setIsExpired(true)
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft())
    
    // Update every second
    const timer = setInterval(() => {
      const now = new Date()
      if (now < schedule.from) {
        setStatus("before")
        return
      } else if (now > schedule.to) {
        setStatus("after")
        return
      } else {
        setStatus("during")
      }
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    // Clear interval on unmount
    return () => clearInterval(timer)
  }, [schedule])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
            <CalendarFold className="mr-2" />
            {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* state when loading data using skeleton */}
        {status === "loading" && (
          <div className="space-y-4">
            {/* Box info skeleton */}
            <Skeleton className="p-4 rounded-lg">
              <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </Skeleton>

            {/* Paragraph skeleton */}
            <div className="text-center">
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>

            {/* Button skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        )}

        {/* state when date now is behind schedule (not started yet) */}
        {status === "before" && (
          <>
          <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg text-center font-semibold">
            <p className="font-bold">The election has not started yet.</p>
            <p className="text-sm">Will begin at {schedule?.from.
            toLocaleDateString(
              "en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              }
            )}
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p>The Election is not started yet! You can see the guide here before election.</p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <a href={linkUrl} className="flex items-center justify-center">
              {linkText}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          </>
        )}

        {/* state when date now is after schedule (already finish) */}
        {status === "after" && (
          <>
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg text-center font-semibold">
            <p className="font-bold">The election has finished!</p>
            <p className="text-sm">Thank you for participating.</p>
          </div>
          <div className="text-center text-gray-600">
            <p>The Election is currently closed! You can now see the result here.</p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <a href="/dashboard/results" className="flex items-center justify-center">
              See Results
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          </>
        )}

        {/* state when date now is during schedule */}
        {status === "during" && (
            <>
              <div className="grid grid-cols-4 gap-2 bg-gray-900 text-white rounded-lg p-4 shadow-lg">
                {["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => {
                  const value = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][idx]
                  return (
                    <div key={label} className="flex flex-col items-center">
                      <span className="text-3xl font-bold">{String(value).padStart(2, "0")}</span>
                      <span className="text-xs text-gray-400">{label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="text-center text-gray-600">
                <p>{description}</p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href={linkUrl} className="flex items-center justify-center">
                  {linkText}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </>
          )}
      </CardContent>
    </Card>
  )
}