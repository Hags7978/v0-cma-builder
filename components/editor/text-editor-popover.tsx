"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface TextEditorPopoverProps {
  content: string
  onSave: (content: string) => void
  children: React.ReactNode
}

export function TextEditorPopover({ content, onSave, children }: TextEditorPopoverProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setValue(content)
      setTimeout(() => textareaRef.current?.focus(), 0)
    }
  }, [open, content])

  const handleSave = () => {
    onSave(value)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-3">
        <div className="space-y-3">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[100px] resize-none"
            placeholder="Enter text..."
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave} className="gap-2">
              <Check className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
