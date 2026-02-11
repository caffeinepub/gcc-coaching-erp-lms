import RoleGate from '../../components/auth/RoleGate';
import { useGetStudents, useGetLessons, useGetStudentProgress } from '../../hooks/useQueries';
import { LoadingState, ErrorState } from '../../components/common/States';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, CheckCircle2, Circle, Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Student } from '../../backend';

export default function ProgressPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { data: students, isLoading: studentsLoading, error: studentsError } = useGetStudents();
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useGetLessons();
  const {
    data: progressData,
    isLoading: progressLoading,
    error: progressError,
  } = useGetStudentProgress(selectedStudent?.principal || null);

  const isLoading = studentsLoading || lessonsLoading;
  const error = studentsError || lessonsError;

  // Create a map of lesson progress for quick lookup
  const progressMap = useMemo(() => {
    const map = new Map<string, boolean>();
    progressData?.forEach((progress) => {
      map.set(progress.lessonId, progress.completed);
    });
    return map;
  }, [progressData]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!selectedStudent) return { total: 0, completed: 0, pending: 0, percentage: 0 };

    const total = lessons?.length || 0;
    const completed = lessons?.filter((lesson) => progressMap.get(lesson.id) === true).length || 0;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percentage };
  }, [lessons, progressMap, selectedStudent]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load data" />;

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Progress</h1>
          <p className="text-muted-foreground">View and track individual student progress</p>
        </div>

        {/* Student Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Student</CardTitle>
            <CardDescription>Choose a student to view their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedStudent?.id || ''}
              onValueChange={(value) => {
                const student = students?.find((s) => s.id === value);
                setSelectedStudent(student || null);
              }}
            >
              <SelectTrigger className="w-full md:w-[400px]">
                <SelectValue placeholder="Select a student..." />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* No Student Selected State */}
        {!selectedStudent && (
          <EmptyStateCard
            icon={<Users className="h-8 w-8 text-muted-foreground" />}
            title="No student selected"
            description="Please select a student from the dropdown above to view their progress"
          />
        )}

        {/* Student Progress Display */}
        {selectedStudent && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Lessons</CardDescription>
                  <CardTitle className="text-3xl">{summary.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Completed</CardDescription>
                  <CardTitle className="text-3xl text-green-600">{summary.completed}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Pending</CardDescription>
                  <CardTitle className="text-3xl text-amber-600">{summary.pending}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Progress</CardDescription>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    {summary.percentage}%
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Progress Error State */}
            {progressError && (
              <ErrorState message="Failed to load student progress. The student may not have access to view this data." />
            )}

            {/* Lessons List */}
            {!progressError && lessons && lessons.length === 0 ? (
              <EmptyStateCard
                icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
                title="No lessons available"
                description="No lessons have been created for this student's class yet"
              />
            ) : (
              !progressError && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Progress for {selectedStudent.firstName} {selectedStudent.lastName}
                    </CardTitle>
                    <CardDescription>Completion status for each lesson</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {progressLoading ? (
                      <LoadingState message="Loading progress..." />
                    ) : (
                      <div className="space-y-3">
                        {lessons?.map((lesson) => {
                          const isCompleted = progressMap.get(lesson.id) === true;
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {isCompleted ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{lesson.title}</h4>
                                  <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                                </div>
                              </div>
                              <Badge variant={isCompleted ? 'default' : 'outline'} className="ml-4">
                                {isCompleted ? 'Completed' : 'Pending'}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            )}
          </>
        )}
      </div>
    </RoleGate>
  );
}
