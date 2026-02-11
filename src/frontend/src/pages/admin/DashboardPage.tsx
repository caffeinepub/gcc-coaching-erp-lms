import { useNavigate } from '@tanstack/react-router';
import RoleGate from '../../components/auth/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Video, DollarSign, FileText, BarChart3, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Students',
      description: 'Manage student registrations and assignments',
      icon: Users,
      path: '/admin/students',
      color: 'text-blue-600',
    },
    {
      title: 'Classes & Courses',
      description: 'Organize classes and course batches',
      icon: BookOpen,
      path: '/admin/classes',
      color: 'text-green-600',
    },
    {
      title: 'Recorded Lessons',
      description: 'Upload and manage video lessons',
      icon: Video,
      path: '/admin/lessons',
      color: 'text-purple-600',
    },
    {
      title: 'Fee Management',
      description: 'Track student fees and payments',
      icon: DollarSign,
      path: '/admin/fees',
      color: 'text-yellow-600',
    },
    {
      title: 'Test Series',
      description: 'Create and manage tests',
      icon: FileText,
      path: '/admin/tests',
      color: 'text-red-600',
    },
    {
      title: 'Results',
      description: 'View test results and analytics',
      icon: BarChart3,
      path: '/admin/results',
      color: 'text-indigo-600',
    },
  ];

  return (
    <RoleGate requireAdmin>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background border">
          <div className="relative z-10 p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Welcome to your coaching classes management system. Manage students, classes, lessons, fees, and tests all in one place.
            </p>
          </div>
          <img
            src="/assets/generated/dashboard-hero.dim_1600x600.png"
            alt="Dashboard"
            className="absolute right-0 top-0 h-full w-auto opacity-20 object-cover"
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
