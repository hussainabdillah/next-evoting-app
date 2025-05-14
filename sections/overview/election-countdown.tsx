'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, CalendarFold } from 'lucide-react'

interface CountdownProps {
  targetDate: Date
  title?: string
  description?: string
  linkText?: string
  linkUrl?: string
}

export default function ElectionCountdown({
  targetDate,
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
  
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      
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
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    // Clear interval on unmount
    return () => clearInterval(timer)
  }, [targetDate])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
            <CalendarFold className="mr-2" />
            {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isExpired ? (
          <div className="grid grid-cols-4 gap-2 bg-gray-900 text-white rounded-lg p-4 shadow-lg">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-xs text-gray-400">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs text-gray-400">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-xs text-gray-400">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-xs text-gray-400">Seconds</span>
            </div>
          </div>
        ) : (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
            <p className="font-bold">The election has started!</p>
            <p className="text-sm">You can now cast your vote.</p>
          </div>
        )}
        
        <div className="text-center text-gray-600">
          <p>{description}</p>
        </div>
        
        <Button variant="outline" className="w-full" asChild>
          <a href={linkUrl} className="flex items-center justify-center">
            {linkText}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}