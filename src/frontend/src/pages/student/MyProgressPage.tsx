import RoleGate from '../../components/auth/RoleGate';
import { useGetLessons, useGetCallerProgress } from '../../hooks/useQueries';
import { LoadingState, ErrorState } from '../../components/common/States';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import { useMemo } from 'react';

export default function MyProgressPage() {
  const { identity } = useInternetIdentity();
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useGetLessons();
  const { data: progressData, isLoading: progressLoading, error: progressError } = useGetCallerProgress();

  const isLoading = lessonsLoading || progressLoading;
  const error = lessonsError || progressError;

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
    const total = lessons?.length || 0;
    const completed = lessons?.filter((lesson) => progressMap.get(lesson.id) === true).length || 0;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percentage };
  }, [lessons, progressMap]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load progress data" />;

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

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

        {/* Lessons List */}
        {lessons && lessons.length === 0 ? (
          <EmptyStateCard
            icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
            title="No lessons available"
            description="Your instructor hasn't uploaded any lessons for your class yet"
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Lesson Progress</CardTitle>
              <CardDescription>Your completion status for each lesson</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
      </div>
    </RoleGate>
  );
}
