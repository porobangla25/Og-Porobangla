'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BookOpen } from 'lucide-react';

import { generateMockTest, type GenerateMockTestOutput } from '@/ai/flows/generate-mock-tests';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';
import { FeatureCard } from '@/components/feature-card';
import { OutputDisplay } from '@/components/output-display';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic is required'),
  numMcq: z.number().min(0).max(20),
  numShortAnswer: z.number().min(0).max(10),
  numLongAnswer: z.number().min(0).max(5),
  numNumerical: z.number().min(0).max(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.enum(['English', 'Bengali', 'Mixed Bangla-English']),
}).refine(data => data.numMcq + data.numShortAnswer + data.numLongAnswer + data.numNumerical > 0, {
  message: 'At least one question must be requested.',
  path: ['numMcq'],
});


type FormValues = z.infer<typeof formSchema>;

export default function MockTestPage() {
  const [output, setOutput] = useState<GenerateMockTestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      numMcq: 5,
      numShortAnswer: 3,
      numLongAnswer: 1,
      numNumerical: 0,
      difficulty: 'medium',
      language: 'English',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setOutput(null);
    try {
      const result = await generateMockTest(values);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate mock test. Please try again.',
      });
    }
    setIsLoading(false);
  }

  const mockTestForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Kinematics" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

        <div className="space-y-6 pt-4">
          <FormField
            control={form.control}
            name="numMcq"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multiple Choice Questions: {field.value}</FormLabel>
                <FormControl>
                  <Slider defaultValue={[field.value]} onValueChange={(v) => field.onChange(v[0])} max={20} step={1} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numShortAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Answer Questions: {field.value}</FormLabel>
                <FormControl>
                  <Slider defaultValue={[field.value]} onValueChange={(v) => field.onChange(v[0])} max={10} step={1} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numLongAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long Answer Questions: {field.value}</FormLabel>
                <FormControl>
                  <Slider defaultValue={[field.value]} onValueChange={(v) => field.onChange(v[0])} max={5} step={1} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numNumerical"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numerical Problems: {field.value}</FormLabel>
                <FormControl>
                  <Slider defaultValue={[field.value]} onValueChange={(v) => field.onChange(v[0])} max={10} step={1} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormMessage>{form.formState.errors.numMcq?.message}</FormMessage>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Mock Test'}
        </Button>
      </form>
    </Form>
  );

  const outputContent = (
    <Tabs defaultValue="question-paper" className="w-full">
      <TabsList>
        <TabsTrigger value="question-paper">Question Paper</TabsTrigger>
        <TabsTrigger value="answer-key">Answer Key</TabsTrigger>
        <TabsTrigger value="solutions">Detailed Solutions</TabsTrigger>
      </TabsList>
      <TabsContent value="question-paper" className="mt-4">
        {output?.questionPaper && <OutputDisplay content={output.questionPaper} />}
      </TabsContent>
      <TabsContent value="answer-key" className="mt-4">
        {output?.answerKey && <OutputDisplay content={output.answerKey} />}
      </TabsContent>
      <TabsContent value="solutions" className="mt-4">
        {output?.detailedSolutions && <OutputDisplay content={output.detailedSolutions} />}
      </TabsContent>
    </Tabs>
  );

  return (
    <FeatureCard
      title="AI Mock Test Generator"
      description="Create a custom mock test with various question types and difficulties."
      icon={<BookOpen className="size-8" />}
      form={mockTestForm}
      isLoading={isLoading}
      hasOutput={!!output}
      outputTitle="Generated Mock Test"
      output={outputContent}
    />
  );
}
