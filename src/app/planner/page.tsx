'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, CalendarDays, X, PlusCircle } from 'lucide-react';

import { generateStudyPlanner, type GenerateStudyPlannerOutput } from '@/ai/flows/generate-study-planner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FeatureCard } from '@/components/feature-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: 'Start date is required.' }),
    to: z.date({ required_error: 'End date is required.' }),
  }),
  subjects: z.array(z.string()).min(1, 'At least one subject is required.'),
  revisionDaysInterval: z.number().min(1).max(14),
  mockTestDays: z.array(z.date()),
  missedDays: z.number().min(0).optional(),
  progress: z.number().min(0).max(100).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function StudyPlannerPage() {
  const [output, setOutput] = useState<GenerateStudyPlannerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [subjectInput, setSubjectInput] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjects: ['Maths', 'Physics', 'Chemistry'],
      revisionDaysInterval: 7,
      mockTestDays: [],
      missedDays: 0,
      progress: 50,
    },
  });

  function addSubject() {
    if (subjectInput.trim()) {
      const currentSubjects = form.getValues('subjects');
      form.setValue('subjects', [...currentSubjects, subjectInput.trim()]);
      setSubjectInput('');
    }
  }

  function removeSubject(index: number) {
    const currentSubjects = form.getValues('subjects');
    form.setValue('subjects', currentSubjects.filter((_, i) => i !== index));
  }

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setOutput(null);

    const payload = {
      ...values,
      startDate: format(values.dateRange.from, 'yyyy-MM-dd'),
      endDate: format(values.dateRange.to, 'yyyy-MM-dd'),
      mockTestDays: values.mockTestDays.map(d => format(d, 'yyyy-MM-dd')),
    };

    try {
      const result = await generateStudyPlanner(payload);
      setOutput(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate study plan. Please try again.',
      });
    }
    setIsLoading(false);
  }

  const plannerForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Study Period</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value?.from && 'text-muted-foreground')}
                      >
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                            </>
                          ) : (
                            format(field.value.from, 'LLL dd, y')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="range" selected={field.value} onSelect={field.onChange} numberOfMonths={2} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mockTestDays"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Mock Test Days</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <span>{field.value?.length ? `${field.value.length} days selected` : "Select mock test dates"}</span>
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="multiple" min={1} selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormDescription>Select specific days for mock tests.</FormDescription>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjects</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a subject"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); }}}
                />
                <Button type="button" onClick={addSubject}><PlusCircle className="mr-2 h-4 w-4"/> Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {field.value.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                    {subject}
                    <button type="button" onClick={() => removeSubject(index)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20">
                      <X className="h-3 w-3"/>
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-6 pt-4">
            <FormField
                control={form.control}
                name="revisionDaysInterval"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Revision Interval: Every {field.value} days</FormLabel>
                    <FormControl>
                    <Slider defaultValue={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1} max={14} step={1} />
                    </FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Overall Progress: {field.value || 0}%</FormLabel>
                    <FormControl>
                    <Slider defaultValue={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} max={100} step={5} />
                    </FormControl>
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="missedDays"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Study Days Missed: {field.value || 0}</FormLabel>
                    <FormControl>
                    <Slider defaultValue={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} max={30} step={1} />
                    </FormControl>
                </FormItem>
                )}
            />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Plan'}
        </Button>
      </form>
    </Form>
  );

  const outputContent = (
    <Accordion type="single" collapsible className="w-full">
      {output?.timetable.map((day, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger>
            <div className="flex justify-between items-center w-full pr-4">
              <span>Day {index + 1}: {format(new Date(day.date), 'EEEE, LLL dd')}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-4">
                <ul className="list-disc pl-5 space-y-1">
                  {day.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <FeatureCard
      title="AI Study Planner"
      description="Generate a day-wise timetable adjustable to your progress."
      icon={<CalendarDays className="size-8" />}
      form={plannerForm}
      isLoading={isLoading}
      hasOutput={!!output?.timetable?.length}
      outputTitle="Your Study Timetable"
      output={outputContent}
    />
  );
}
