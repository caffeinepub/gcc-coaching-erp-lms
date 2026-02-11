import RoleGate from '../../components/auth/RoleGate';
import { useGetLessons, useGetCallerProgress, useUpdateLessonProgress } from '../../hooks/useQueries';
import { useGetClassSubscriptionConfig, useHasClassSubscription } from '../../hooks/useSubscriptions';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { LoadingState, ErrorState } from '../../components/common/States';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import SubscriptionPaywallCard from '../../components/student/SubscriptionPaywallCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, ExternalLink, CheckCircle2, Circle, Lock, Info } from 'lucide-react';
import { VideoSource } from '../../backend';
import { useMemo } from 'react';
import { toast } from 'sonner';

export default function MyLessonsPage() {
  const { studentProfile } = useCurrentUser();
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useGetLessons();
  const { data: progressData, isLoading: progressLoading } = useGetCallerProgress();
  const updateProgress = useUpdateLessonProgress();

  const studentClassId = studentProfile?.classId;
  const { data: subscriptionConfig } = useGetClassSubscriptionConfig(studentClassId);
  const { data: hasSubscription } = useHasClassSubscription(studentProfile?.id, studentClassId);

  const isLoading = lessonsLoading || progressLoading;

  // Create a map of lesson progress for quick lookup
  const progressMap = useMemo(() => {
    const map = new Map<string, boolean>();
    progressData?.forEach((progress) => {
      map.set(progress.lessonId, progress.completed);
    });
    return map;
  }, [progressData]);

  // Determine which lessons are locked by paywall
  const lessonsWithLockStatus = useMemo(() => {
    if (!lessons || !subscriptionConfig || !subscriptionConfig.paywallEnabled || hasSubscription) {
      return lessons?.map((l) => ({ lesson: l, isLocked: false })) || [];
    }

    // Paywall is enabled and student doesn't have subscription
    // Only first 2 lessons are accessible
    return lessons.map((l, index) => ({
      lesson: l,
      isLocked: index >= 2,
    }));
  }, [lessons, subscriptionConfig, hasSubscription]);

  const lockedCount = lessonsWithLockStatus.filter((l) => l.isLocked).length;
  const showPaywall = subscriptionConfig?.paywallEnabled && !hasSubscription && lockedCount > 0;

  const handleToggleCompletion = async (lessonId: string, currentStatus: boolean) => {
    try {
      await updateProgress.mutateAsync({
        lessonId,
        completed: !currentStatus,
      });
      toast.success(!currentStatus ? 'Lesson marked as completed!' : 'Lesson marked as pending');
    } catch (error: any) {
      console.error('Failed to update progress:', error);
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to update this lesson');
      } else {
        toast.error('Failed to update lesson progress');
      }
    }
  };

  if (isLoading) return <LoadingState />;
  if (lessonsError) return <ErrorState message="Failed to load lessons" />;

  return (
    <RoleGate requireStudent>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Lessons</h1>
          <p className="text-muted-foreground">Access your recorded class videos</p>
        </div>

        {showPaywall && studentProfile && subscriptionConfig && (
          <SubscriptionPaywallCard
            classId={studentClassId!}
            className={studentProfile.classId}
            studentId={studentProfile.id}
            studentName={`${studentProfile.firstName} ${studentProfile.lastName}`}
            config={subscriptionConfig}
            hasSubscription={hasSubscription || false}
          />
        )}

        {lockedCount > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>{lockedCount} lesson{lockedCount > 1 ? 's' : ''} locked.</strong> Subscribe to unlock all content.
            </AlertDescription>
          </Alert>
        )}

        {lessons && lessons.length === 0 ? (
          <EmptyStateCard
            icon={<Video className="h-8 w-8 text-muted-foreground" />}
            title="No lessons available"
            description="Your instructor hasn't uploaded any lessons for your class yet"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessonsWithLockStatus.map(({ lesson, isLocked }) => {
              const isCompleted = progressMap.get(lesson.id) === true;
              return (
                <Card
                  key={lesson.id}
                  className={`hover:shadow-md transition-shadow ${isLocked ? 'opacity-60' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        {lesson.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {!isLocked && (
                          <>
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </>
                        )}
                        <Badge variant="outline">
                          {lesson.videoSource === VideoSource.external ? (
                            <ExternalLink className="h-3 w-3" />
                          ) : (
                            <Video className="h-3 w-3" />
                          )}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      <p className="mt-2">{lesson.description}</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isLocked ? (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Subscribe to unlock this lesson
                      </div>
                    ) : (
                      <>
                        {lesson.videoUrl && (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            Watch Video <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <Button
                          variant={isCompleted ? 'outline' : 'default'}
                          size="sm"
                          className="w-full"
                          onClick={() => handleToggleCompletion(lesson.id, isCompleted)}
                          disabled={updateProgress.isPending}
                        >
                          {updateProgress.isPending ? (
                            'Updating...'
                          ) : isCompleted ? (
                            'Mark as Pending'
                          ) : (
                            'Mark as Completed'
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </RoleGate>
  );
}
