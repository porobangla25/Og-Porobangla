'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FileText } from 'lucide-react';

import { generateStructuredNotes, type GenerateStructuredNotesOutput } from '@/ai/flows/generate-structured-notes';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FeatureCard } from '@/components/feature-card';
import { OutputDisplay } from '@/components/output-display';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
  language: z.enum(['English', 'Bengali', 'Mixed Bangla-English']),
});

type FormValues = z.infer<typeof formSchema>;

export default function NoteGeneratorPage() {
  const [output, setOutput] = useState<GenerateStructuredNotesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      language: 'English',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateStructuredNotes(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate notes. Please try again.',
      });
    }
    setIsLoading(false);
  }

  const noteGeneratorForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Photosynthesis" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Bengali">Bengali</SelectItem>
                    <SelectItem value="Mixed Bangla-English">Mixed (Banglish)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Notes'}
        </Button>
      </form>
    </Form>
  );

  return (
    <FeatureCard
      title="AI Note Generator"
      description="Generate structured, teacher-style notes on any topic."
      icon={<FileText className="size-8" />}
      form={noteGeneratorForm}
      isLoading={isLoading}
      hasOutput={!!output?.notes}
      outputTitle="Generated Notes"
      output={
        output?.notes ? (
          <OutputDisplay content={output.notes} />
        ) : null
      }
    />
  );
}
