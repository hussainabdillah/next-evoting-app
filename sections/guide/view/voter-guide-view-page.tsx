'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BarChart, CheckCircle, ChevronRight, HelpCircle, Home, List, Settings, Users, Vote } from 'lucide-react'
import PageContainer from '@/components/layout/page-container'
import { votingSteps, faqs } from '@/constants/data'

export default function VoterGuide() {
  const [activeStep, setActiveStep] = useState(0)
  const stepSectionRef = useRef<HTMLDivElement>(null)

  return (
    <PageContainer scrollable>
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">

          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white rounded-lg p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Voter Guide</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              Your comprehensive guide to participating in the democratic process through our secure e-voting system.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button 
              variant="default" className="bg-white/10 text-white border-white/20 hover:bg-white/20" size="lg" asChild>
                <Link href="#quick-start">Quick Start Guide</Link>
              </Button>
              {/* <Button
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                size="lg"
                asChild
              >
                <Link href="/help">Need Help?</Link>
              </Button> */}
            </div>
          </section>

          {/* Quick Navigation */}
          <Card className="mb-8" id="quick-start">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Navigation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {votingSteps.map((section, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-between h-auto py-3 px-4"
                    onClick={() => {
                      setActiveStep(index)
                      setTimeout(() => {
                        stepSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }, 100)
                    }}
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <span>{section.title}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Tabs */}
          <section className="mb-8" ref={stepSectionRef}>
            <h2 className="text-2xl font-bold mb-6">Step-by-Step Voting Guide</h2>
            <Tabs value={activeStep.toString()} onValueChange={(val) => setActiveStep(parseInt(val))}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                {votingSteps.map((section, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    <span className="hidden md:inline">{section.title}</span>
                    <span className="md:hidden">Step {index + 1}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {votingSteps.map((section, i) => (
                <TabsContent key={i} value={i.toString()} className="border dark:border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{section.description}</p>

                  <div className="space-y-8">
                    {section.steps.map((step, j) => (
                      <div key={j} className="border rounded-lg overflow-hidden dark:border-gray-700">
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                          <h4 className="font-medium flex items-center">
                            <div className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm">
                              {j + 1}
                            </div>
                            {step.link ? (
                              <a
                                href={step.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {step.title}
                              </a>
                            ) : (
                              step.title
                            )}
                          </h4>
                        </div>
                        <div className="p-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-gray-700 dark:text-gray-300 mb-4">{step.description}</p>
                              <div className="bg-amber-50 border border-amber-200 rounded p-3 flex dark:bg-amber-900 dark:border-amber-700">
                                <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-300 mr-2 mt-0.5" />
                                <p className="text-sm text-amber-800 dark:text-amber-200">{step.tips}</p>
                              </div>
                            </div>
                            <div className="order-first md:order-last mb-4 md:mb-0">
                              <Image
                                src={step.image || "/placeholder.svg"}
                                alt={`Illustration for ${step.title}`}
                                width={500}
                                height={300}
                                className="rounded-lg border dark:border-gray-700 shadow-sm w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    {i > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveStep(i - 1)
                          setTimeout(() => {
                            stepSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 100)
                        }}
                      >
                        Previous: {votingSteps[i - 1].title}
                      </Button>
                    )}
                    <div className="flex-1" />
                    {i < votingSteps.length - 1 && (
                      <Button
                        onClick={() => {
                          setActiveStep(i + 1)
                          setTimeout(() => {
                            stepSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 100)
                        }}
                      >
                        Next: {votingSteps[i + 1].title}
                      </Button>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* FAQ */}
          {/* <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="border rounded-lg dark:border-gray-700">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="px-4 hover:no-underline dark:text-white">
                    <span className="text-left">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 dark:text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section> */}

          {/* Additional Resources */}
          {/* <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border mb-8 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <List className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-300" />, href: "/candidates", label: "View Candidate Profiles" },
                { icon: <Vote className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-300" />, href: "/voting-demo", label: "Try Voting Demo" },
                { icon: <HelpCircle className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-300" />, href: "/help", label: "Contact Support" }
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex items-center dark:text-blue-300">
                    {item.icon}
                    <Link href={item.href} className="hover:underline dark:text-blue-300">
                      {item.label}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section> */}

          {/* CTA */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 dark:from-green-900 dark:to-emerald-900 dark:border-green-700">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Ready to Vote?</h3>
                <p className="text-green-700 dark:text-green-200">The election is currently open.</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white" size="lg" asChild>
                <Link href="/dashboard/vote">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Go to Voting Page
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageContainer>
  )
}