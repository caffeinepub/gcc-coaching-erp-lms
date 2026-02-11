import { useState } from 'react';
import RoleGate from '../../components/auth/RoleGate';
import { useGetStudents, useRegisterStudent, useGetClasses, useGetCourses } from '../../hooks/useQueries';
import { LoadingState, ErrorState } from '../../components/common/States';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Id } from '../../backend';

export default function StudentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterClassId, setFilterClassId] = useState<Id | null>(null);
  const [filterCourseId, setFilterCourseId] = useState<Id | null>(null);

  const { data: students, isLoading, error } = useGetStudents(filterClassId, filterCourseId);
  const { data: classes } = useGetClasses();
  const { data: courses } = useGetCourses(filterClassId);
  const registerMutation = useRegisterStudent();

  const [formData, setFormData] = useState({
    principal: '',
    firstName: '',
    lastName: '',
    classId: '',
    courseId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({
        principal: formData.principal,
        firstName: formData.firstName,
        lastName: formData.lastName,
        classId: formData.classId,
        courseId: formData.courseId || null,
      });
      toast.success('Student registered successfully');
      setDialogOpen(false);
      setFormData({ principal: '', firstName: '', lastName: '', classId: '', courseId: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to register student');
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load students" />;

  const hasClasses = classes && classes.length > 0;

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">Manage student registrations and assignments</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!hasClasses}>
                <Plus className="mr-2 h-4 w-4" />
                Register Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Student</DialogTitle>
                <DialogDescription>Add a new student to the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal ID</Label>
                  <Input
                    id="principal"
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                    placeholder="Enter student's principal ID"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classId">Class</Label>
                  <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value, courseId: '' })}>
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
                {formData.classId && courses && courses.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="courseId">Course (Optional)</Label>
                    <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Register Student'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!hasClasses ? (
          <EmptyStateCard
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="No classes available"
            description="You need to create classes first before registering students"
            action={{
              label: 'Go to Classes',
              onClick: () => window.location.hash = '#/admin/classes',
            }}
          />
        ) : students && students.length === 0 ? (
          <EmptyStateCard
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="No students yet"
            description="Get started by registering your first student"
            action={{
              label: 'Register Student',
              onClick: () => setDialogOpen(true),
            }}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>View and manage registered students</CardDescription>
              <div className="flex gap-4 pt-4">
                <Select value={filterClassId || ''} onValueChange={(value) => { setFilterClassId(value || null); setFilterCourseId(null); }}>
                  <SelectTrigger className="w-[200px]">
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
                {filterClassId && courses && courses.length > 0 && (
                  <Select value={filterCourseId || ''} onValueChange={(value) => setFilterCourseId(value || null)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.classId}</TableCell>
                      <TableCell>{student.courseId || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={student.active ? 'default' : 'secondary'}>
                          {student.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </RoleGate>
  );
}
