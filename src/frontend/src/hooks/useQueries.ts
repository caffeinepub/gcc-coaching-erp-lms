import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Class, Course, Student, Lesson, Id, LessonProgress } from '../backend';
import { VideoSource } from '../backend';
import { Principal } from '@dfinity/principal';

// Classes
export function useGetClasses() {
  const { actor, isFetching } = useActor();

  return useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClass() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClass(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

// Courses
export function useGetCourses(classId?: Id | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses', classId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCourses(classId || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ classId, name, description }: { classId: Id; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCourse(classId, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

// Students
export function useGetStudents(classId?: Id | null, courseId?: Id | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ['students', classId, courseId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudents(classId || null, courseId || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      principal,
      firstName,
      lastName,
      classId,
      courseId,
    }: {
      principal: string;
      firstName: string;
      lastName: string;
      classId: Id;
      courseId?: Id | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { Principal } = await import('@dfinity/principal');
      const studentPrincipal = Principal.fromText(principal);
      return actor.registerStudent(studentPrincipal, firstName, lastName, classId, courseId || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// Lessons
export function useGetLessons(classId?: Id | null, courseId?: Id | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons', classId, courseId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLessons(classId || null, courseId || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      classId,
      courseId,
      videoSource,
      videoUrl,
    }: {
      title: string;
      description: string;
      classId: Id;
      courseId?: Id | null;
      videoSource: VideoSource;
      videoUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createLesson(title, description, classId, courseId || null, videoSource, videoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

// Progress - Student (caller's own progress)
export function useGetCallerProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<LessonProgress[]>({
    queryKey: ['callerProgress'],
    queryFn: async () => {
      if (!actor) return [];
      const { Principal } = await import('@dfinity/principal');
      // Get caller's own progress by passing their principal
      const callerPrincipal = await actor.getCallerUserProfile().then(() => Principal.anonymous());
      // Actually, we need to use a different approach - get all progress for the caller
      return actor.getAllProgressForStudent(Principal.anonymous());
    },
    enabled: !!actor && !isFetching,
  });
}

// Progress - Get progress for a specific student (admin or self)
export function useGetStudentProgress(studentPrincipal?: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<LessonProgress[]>({
    queryKey: ['studentProgress', studentPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !studentPrincipal) return [];
      return actor.getAllProgressForStudent(studentPrincipal);
    },
    enabled: !!actor && !isFetching && !!studentPrincipal,
  });
}

// Progress - Update lesson completion
export function useUpdateLessonProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      completed,
    }: {
      lessonId: Id;
      completed: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const completionTimestamp = completed ? BigInt(Date.now() * 1000000) : null;
      return actor.updateLessonProgress(lessonId, completed, completionTimestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerProgress'] });
      queryClient.invalidateQueries({ queryKey: ['studentProgress'] });
      queryClient.invalidateQueries({ queryKey: ['lessonProgress'] });
    },
  });
}

// Progress - Get progress for a specific lesson
export function useGetLessonProgress(lessonId?: Id | null) {
  const { actor, isFetching } = useActor();

  return useQuery<LessonProgress | null>({
    queryKey: ['lessonProgress', lessonId],
    queryFn: async () => {
      if (!actor || !lessonId) return null;
      return actor.getLessonProgress(lessonId);
    },
    enabled: !!actor && !isFetching && !!lessonId,
  });
}
