import { useNavigate } from '@tanstack/react-router';
import RoleGate from '../../components/auth/RoleGate';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, DollarSign, FileText, BarChart3, ArrowRight } from 'lucide-react';

export default function StudentPortalHomePage() {
  const navigate = useNavigate();
  const { studentProfile } = useCurrentUser();

  const sections = [
    {
      title: 'My Lessons',
      description: 'Access your recorded class videos',
      icon: Video,
      path: '/student/lessons',
      color: 'text-purple-600',
    },
    {
      title: 'My Fees',
      description: 'View your fee status and payment history',
      icon: DollarSign,
      path: '/student/fees',
      color: 'text-yellow-600',
    },
    {
      title: 'My Tests',
      description: 'Take assigned tests and quizzes',
      icon: FileText,
      path: '/student/tests',
      color: 'text-red-600',
    },
    {
      title: 'My Results',
      description: 'Check your test scores and performance',
      icon: BarChart3,
      path: '/student/results',
      color: 'text-indigo-600',
    },
  ];

  return (
    <RoleGate requireStudent>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background border p-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
          {studentProfile && (
            <p className="text-lg text-muted-foreground">
              {studentProfile.firstName} {studentProfile.lastName} • {studentProfile.classId}
              {studentProfile.courseId && ` • ${studentProfile.courseId}`}
            </p>
          )}
        </div>

        {/* Quick Access Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.path} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg bg-muted p-3 ${section.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="mt-4">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => navigate({ to: section.path })}
                  >
                    Go to {section.title}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </RoleGate>
  );
}
