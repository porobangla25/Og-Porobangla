import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays, FileText, MessageSquare } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <FileText className="size-8 text-primary" />,
    title: 'AI Note Generator',
    description: 'Generate structured notes with examples, exam tips, and more. Perfect for quick revision.',
    href: '/notes',
  },
  {
    icon: <BookOpen className="size-8 text-primary" />,
    title: 'AI Mock Test Generator',
    description: 'Create mock tests with various question types and difficulty levels to test your knowledge.',
    href: '/mock-tests',
  },
  {
    icon: <MessageSquare className="size-8 text-primary" />,
    title: 'Chat with Vidyasagar',
    description: 'An AI tutor for Maths, Physics, and Chemistry that guides you to the answer without giving it away.',
    href: '/tutor',
  },
  {
    icon: <CalendarDays className="size-8 text-primary" />,
    title: 'AI Study Planner',
    description: 'Get a personalized, day-wise study plan that adapts to your progress and schedule.',
    href: '/planner',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-dashboard');

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none">
                    Welcome to <span className="text-primary">Porobangla AI</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your personal AI-powered study assistant. Generate notes, create mock tests, chat with an AI tutor, and plan your study schedule—all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/notes">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/40 dark:bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Unlock Your Potential</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Leverage the power of AI to study smarter, not harder. Our suite of tools is designed to help you succeed.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col transition-transform transform hover:-translate-y-2">
                  <CardHeader className="flex-1">
                    <div className="mb-4 flex items-center justify-center rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-center font-headline">{feature.title}</CardTitle>
                    <CardDescription className="text-center">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href={feature.href} className="w-full">
                      <Button variant="outline" className="w-full">
                        Go to feature <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
