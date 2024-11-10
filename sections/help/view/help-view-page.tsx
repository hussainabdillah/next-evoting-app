'use client'

import { useState } from 'react'
import PageContainer from '@/components/layout/page-container'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BarChart, HelpCircle, Home, Mail, MessageSquare, Phone, Settings, Users, Vote } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"


const faqs = [
  {
    question: "How do I register to vote?",
    answer: "To register to vote, you need to be a citizen and meet your state's residency requirements. Visit our 'Voter Registration' page to fill out the online form or find information on how to register by mail or in person."
  },
  {
    question: "What do I need to bring with me to vote?",
    answer: "Requirements vary by state, but generally you should bring a valid form of identification such as a driver's license, state ID, or passport. Check our 'Voting Requirements' page for specific information for your area."
  },
  {
    question: "How does the e-voting system ensure my vote is secure?",
    answer: "Our e-voting system uses state-of-the-art encryption and blockchain technology to ensure the security and integrity of your vote. Each vote is anonymized and cannot be traced back to individual voters, while still allowing for accurate vote counting and verification."
  },
  {
    question: "What if I encounter technical issues while voting?",
    answer: "If you experience any technical issues, please contact our support team immediately through the 'Contact Us' form on this page or call our helpline. We have technicians available to assist you throughout the voting period."
  },
  {
    question: "Can I change my vote after I've submitted it?",
    answer: "Once you've submitted your vote, it cannot be changed. Please review your selections carefully before final submission. If you believe there's been an error, contact our support team immediately."
  }
]

export default function HelpViewPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this information to your backend
    console.log('Support request', { name, email, message })
    toast({
      title: "Support Request Sent",
      description: "We've received your message and will get back to you soon.",
    })
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <PageContainer scrollable={true}>
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Help & Support</CardTitle>
              <CardDescription className="text-center">Find answers to common questions or contact our support team</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Contact Support</CardTitle>
                <CardDescription>Have a question not answered in the FAQ? Reach out to our support team.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your Name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help you?" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Additional Support Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>Call us: (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>Email: support@evoting-system.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <span>Live Chat: Available 9AM-5PM EST</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <Link href="/faq" className="underline">View Full FAQ</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageContainer>
  )
}