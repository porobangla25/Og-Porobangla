import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface FeatureCardProps {
  title: string;
  description: string;
  form: React.ReactNode;
  output: React.ReactNode;
  isLoading: boolean;
  hasOutput: boolean;
  outputTitle?: string;
  icon?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  form,
  output,
  isLoading,
  hasOutput,
  outputTitle = 'Generated Output',
  icon,
}: FeatureCardProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {icon}
            <div>
              <CardTitle className="font-headline text-3xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>{form}</CardContent>
      </Card>
      
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{outputTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : hasOutput ? (
            output
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
              <p>Your generated content will appear here.</p>
              <p>Fill out the form above and click generate to start.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
