"use client"

import * as React from "react"
import { ChevronDownIcon, CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  label: string
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  id?: string
}

export function DateTimePicker({
  label,
  value,
  onChange,
  placeholder = "Select date and time",
  minDate,
  id
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [time, setTime] = React.useState(value ? format(value, "HH:mm") : "10:00")

  // Update time when value changes externally
  React.useEffect(() => {
    if (value) {
      setTime(format(value, "HH:mm"))
    }
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Combine selected date with current time
      const [hours, minutes] = time.split(':').map(Number)
      const newDate = new Date(selectedDate)
      newDate.setHours(hours, minutes, 0, 0)
      onChange(newDate)
      setOpen(false)
    } else {
      onChange(undefined)
    }
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
    if (value) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(value)
      newDate.setHours(hours, minutes, 0, 0)
      onChange(newDate)
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 flex-1">
        {/* <Label htmlFor={`${id}-date`} className="px-1">
          {label} - Date
        </Label> */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`${id}-date`}
              className="w-full justify-between font-normal"
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "MMM dd, yyyy") : placeholder}
              </div>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              // fromYear={new Date().getFullYear()}
              // toYear={new Date().getFullYear() + 5}
              disabled={(date) => minDate ? date < minDate : date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        {/* <Label htmlFor={`${id}-time`} className="px-1">
          Time
        </Label> */}
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="time"
            id={`${id}-time`}
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="pl-10 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </div>
  )
}