import { useState } from 'react';
import RoleGate from '../../components/auth/RoleGate';
import { useGetLessons, useCreateLesson, useGetClasses, useGetCourses } from '../../hooks/useQueries';
import { LoadingState, ErrorState } from '../../components/common/States';
import EmptyStateCard from '../../components/common/EmptyStateCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Video, Plus, Loader2, ExternalLink, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { VideoSource } from '../../backend';
import type { Id } from '../../backend';

export default function RecordedLessonsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterClassId, setFilterClassId] = useState<Id | null>(null);
  const [filterCourseId, setFilterCourseId] = useState<Id | null>(null);

  const { data: lessons, isLoading, error } = useGetLessons(filterClassId, filterCourseId);
  const { data: classes } = useGetClasses();
  const { data: courses } = useGetCourses(filterClassId);
  const createMutation = useCreateLesson();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    courseId: '',
    videoSource: 'external' as 'external' | 'uploaded',
    videoUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        classId: formData.classId,
        courseId: formData.courseId || null,
        videoSource: formData.videoSource === 'external' ? VideoSource.external : VideoSource.uploaded,
        videoUrl: formData.videoUrl,
      });
      toast.success('Lesson created successfully');
      setDialogOpen(false);
      setFormData({ title: '', description: '', classId: '', courseId: '', videoSource: 'external', videoUrl: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create lesson');
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load lessons" />;

  const hasClasses = classes && classes.length > 0;

  return (
    <RoleGate requireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recorded Lessons</h1>
            <p className="text-muted-foreground">Upload and manage video lessons</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!hasClasses}>
                <Plus className="mr-2 h-4 w-4" />
                Add Lesson
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
                <DialogDescription>Create a new recorded lesson</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Introduction to Algebra"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the lesson"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classId">Class</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => setFormData({ ...formData, classId: value, courseId: '' })}
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
                <div className="space-y-2">
                  <Label>Video Source</Label>
                  <RadioGroup
                    value={formData.videoSource}
                    onValueChange={(value: 'external' | 'uploaded') => setFormData({ ...formData, videoSource: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="external" id="external" />
                      <Label htmlFor="external" className="font-normal cursor-pointer">
                        External URL (YouTube, Vimeo, etc.)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="uploaded" id="uploaded" />
                      <Label htmlFor="uploaded" className="font-normal cursor-pointer">
                        Upload Video File
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">
                    {formData.videoSource === 'external' ? 'Video URL' : 'Video File URL'}
                  </Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder={formData.videoSource === 'external' ? 'https://youtube.com/watch?v=...' : 'Upload URL'}
                    required
                  />
                  {formData.videoSource === 'uploaded' && (
                    <p className="text-xs text-muted-foreground">Note: File upload functionality coming soon</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Lesson'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!hasClasses ? (
          <EmptyStateCard
            icon={<Video className="h-8 w-8 text-muted-foreground" />}
            title="No classes available"
            description="Create classes first before adding lessons"
            action={{
              label: 'Go to Classes',
              onClick: () => (window.location.hash = '#/admin/classes'),
            }}
          />
        ) : lessons && lessons.length === 0 ? (
          <EmptyStateCard
            icon={<Video className="h-8 w-8 text-muted-foreground" />}
            title="No lessons yet"
            description="Add your first recorded lesson to get started"
            action={{
              label: 'Add Lesson',
              onClick: () => setDialogOpen(true),
            }}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4">
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons?.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{lesson.title}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {lesson.videoSource === VideoSource.external ? (
                          <ExternalLink className="h-3 w-3" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="space-y-1">
                        <p className="text-xs">Class: {lesson.classId}</p>
                        {lesson.courseId && <p className="text-xs">Course: {lesson.courseId}</p>}
                        <p className="mt-2">{lesson.description}</p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </RoleGate>
  );
}
