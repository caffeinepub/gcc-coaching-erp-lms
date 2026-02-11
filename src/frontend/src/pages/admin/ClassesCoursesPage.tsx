import { useState } from 'react';
import RoleGate from '../../components/auth/RoleGate';
import { useGetClasses, useCreateClass, useGetCourses, useCreateCourse } from '../../hooks/useQueries';
import { LoadingState, ErrorState } from '../../components/common/States';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import ClassSubscriptionSettingsDialog from '../../components/admin/ClassSubscriptionSettingsDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Loader2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import type { Id } from '../../backend';

export default function ClassesCoursesPage() {
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<Id | null>(null);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [subscriptionClassId, setSubscriptionClassId] = useState<Id | null>(null);
  const [subscriptionClassName, setSubscriptionClassName] = useState('');

  const { data: classes, isLoading: classesLoading, error: classesError } = useGetClasses();
  const { data: courses, isLoading: coursesLoading } = useGetCourses(selectedClassId);
  const createClassMutation = useCreateClass();
  const createCourseMutation = useCreateCourse();

  const [classForm, setClassForm] = useState({ name: '', description: '' });
  const [courseForm, setCourseForm] = useState({ classId: '', name: '', description: '' });

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClassMutation.mutateAsync(classForm);
      toast.success('Class created successfully');
      setClassDialogOpen(false);
      setClassForm({ name: '', description: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create class');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourseMutation.mutateAsync(courseForm);
      toast.success('Course created successfully');
      setCourseDialogOpen(false);
      setCourseForm({ classId: '', name: '', description: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create course');
    }
  };

  const handleOpenSubscriptionSettings = (classId: Id, className: string) => {
    setSubscriptionClassId(classId);
    setSubscriptionClassName(className);
    setSubscriptionDialogOpen(true);
  };

  if (classesLoading) return <LoadingState />;
  if (classesError) return <ErrorState message="Failed to load classes" />;

  const hasClasses = classes && classes.length > 0;

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Classes & Courses</h1>
            <p className="text-muted-foreground">Organize your academic structure</p>
          </div>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Class</DialogTitle>
                    <DialogDescription>Add a new class or grade level</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateClass} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name</Label>
                      <Input
                        id="className"
                        value={classForm.name}
                        onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                        placeholder="e.g., Class 10, Grade 12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="classDescription">Description</Label>
                      <Textarea
                        id="classDescription"
                        value={classForm.description}
                        onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                        placeholder="Brief description of the class"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={createClassMutation.isPending}>
                      {createClassMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Class'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {!hasClasses ? (
              <EmptyStateCard
                icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
                title="No classes yet"
                description="Create your first class to get started organizing your coaching structure"
                action={{
                  label: 'Create Class',
                  onClick: () => setClassDialogOpen(true),
                }}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle>{cls.name}</CardTitle>
                        <Badge variant={cls.active ? 'default' : 'secondary'}>
                          {cls.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription>{cls.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleOpenSubscriptionSettings(cls.id, cls.name)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Subscription & Payment
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!hasClasses}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>Add a course or batch within a class</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseClass">Class</Label>
                      <Select
                        value={courseForm.classId}
                        onValueChange={(value) => setCourseForm({ ...courseForm, classId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes?.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        value={courseForm.name}
                        onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                        placeholder="e.g., Science Batch A, Math Advanced"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseDescription">Description</Label>
                      <Textarea
                        id="courseDescription"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        placeholder="Brief description of the course"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={createCourseMutation.isPending}>
                      {createCourseMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Course'
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {!hasClasses ? (
              <EmptyStateCard
                icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
                title="No classes available"
                description="Create classes first before adding courses"
                action={{
                  label: 'Go to Classes',
                  onClick: () => {},
                }}
              />
            ) : (
              <div className="space-y-4">
                <Select value={selectedClassId || ''} onValueChange={(value) => setSelectedClassId(value || null)}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {coursesLoading ? (
                  <LoadingState />
                ) : courses && courses.length === 0 ? (
                  <EmptyStateCard
                    icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
                    title="No courses yet"
                    description="Create your first course or batch within a class"
                    action={{
                      label: 'Create Course',
                      onClick: () => setCourseDialogOpen(true),
                    }}
                  />
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses?.map((course) => (
                      <Card key={course.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">{course.name}</CardTitle>
                            <Badge variant={course.active ? 'default' : 'secondary'}>
                              {course.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <CardDescription>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">
                                Class: {classes?.find((c) => c.id === course.classId)?.name}
                              </p>
                              <p>{course.description}</p>
                            </div>
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {subscriptionClassId && (
          <ClassSubscriptionSettingsDialog
            classId={subscriptionClassId}
            className={subscriptionClassName}
            open={subscriptionDialogOpen}
            onOpenChange={setSubscriptionDialogOpen}
          />
        )}
      </div>
    </RoleGate>
  );
}
