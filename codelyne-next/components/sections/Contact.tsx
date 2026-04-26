"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  company: z.string().min(2, "Company name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          subject: "General Enquiry",
          type: "enquiry",
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSubmitted(true);
      toast({
        title: "Enquiry Sent!",
        description: "Codelyne Technologies team will connect you soon.",
      });

      setTimeout(() => {
        setIsSubmitted(false);
        form.reset();
      }, 5000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Ready to <span className="text-primary text-glow">Innovate?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Schedule a 24-hour demo or speak with our engineering team about your specific requirements. We build for the future, today.
            </p>

            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl border-l-4 border-l-primary flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Enterprise Consultation</h4>
                  <p className="text-sm text-gray-400">Get a tailored roadmap for your AI integration.</p>
                </div>
              </div>
              <div className="glass-card p-6 rounded-xl border-l-4 border-l-purple-500 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Rapid Prototyping</h4>
                  <p className="text-sm text-gray-400">See your concept come to life in record time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 md:p-10 rounded-2xl border-white/10 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <h3 className="text-2xl font-bold text-white mb-6">Send Enquiry</h3>

            {isSubmitted ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-gray-400">Our team will be in touch with you shortly.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-white/5 border-white/10 text-white focus:border-primary/50" data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="company" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Tech Corp" {...field} className="bg-white/5 border-white/10 text-white focus:border-primary/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="bg-white/5 border-white/10 text-white focus:border-primary/50" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 99999 99999" {...field} className="bg-white/5 border-white/10 text-white focus:border-primary/50" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about your project requirements..." className="bg-white/5 border-white/10 text-white focus:border-primary/50 min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-background font-bold h-12" data-testid="btn-submit-contact">
                    Send Request
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
