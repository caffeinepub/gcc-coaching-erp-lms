import { useState } from 'react';
import RoleGate from '../../components/auth/RoleGate';
import { useCreateClass, useCreateCourse, useRegisterStudent, useCreateLesson, useGetClasses } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { VideoSource } from '../../backend';

export default function DemoDataPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { data: existingClasses } = useGetClasses();
  const createClass = useCreateClass();
  const createCourse = useCreateCourse();
  const registerStudent = useRegisterStudent();
  const createLesson = useCreateLesson();

  const hasExistingData = existingClasses && existingClasses.length > 0;

  const createDemoData = async () => {
    if (hasExistingData) {
      toast.error('Demo data already exists. Clear existing data first.');
      return;
    }

    setIsCreating(true);
    setStatus('idle');

    try {
      // Create classes
      const class10Id = await createClass.mutateAsync({
        name: 'Class 10',
        description: 'Secondary level mathematics and science',
      });

      const class12Id = await createClass.mutateAsync({
        name: 'Class 12',
        description: 'Senior secondary level preparation',
      });

      // Create courses
      await createCourse.mutateAsync({
        classId: class10Id,
        name: 'Mathematics Advanced',
        description: 'Advanced mathematics course for Class 10',
      });

      // Create a demo student (using a test principal)
      await registerStudent.mutateAsync({
        principal: '2vxsx-fae',
        firstName: 'Demo',
        lastName: 'Student',
        classId: class10Id,
        courseId: null,
      });

      // Create a demo lesson
      await createLesson.mutateAsync({
        title: 'Introduction to Quadratic Equations',
        description: 'Learn the basics of quadratic equations and how to solve them',
        classId: class10Id,
        courseId: null,
        videoSource: VideoSource.external,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      });

      setStatus('success');
      toast.success('Demo data created successfully!');
    } catch (error: any) {
      console.error('Error creating demo data:', error);
      setStatus('error');
      toast.error(error.message || 'Failed to create demo data');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Demo Data</h1>
          <p className="text-muted-foreground">Quickly populate your system with sample data</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Create Demo Dataset</CardTitle>
                <CardDescription>
                  This will create sample classes, courses, a student, and a lesson to help you explore the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasExistingData && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You already have classes in your system. Demo data creation is disabled to prevent duplicates.
                </AlertDescription>
              </Alert>
            )}

            {status === 'success' && (
              <Alert className="border-green-200 bg-green-50 text-green-900">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Demo data created successfully! You can now explore the system with sample data.
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to create demo data. Please try again or check the console for errors.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">What will be created:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>2 Classes (Class 10, Class 12)</li>
                <li>1 Course (Mathematics Advanced)</li>
                <li>1 Demo Student</li>
                <li>1 Sample Lesson</li>
              </ul>
            </div>

            <Button
              onClick={createDemoData}
              disabled={isCreating || hasExistingData || status === 'success'}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Demo Data...
                </>
              ) : (
                'Create Demo Data'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
