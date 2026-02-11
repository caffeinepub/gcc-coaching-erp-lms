import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, Student, Teacher } from '../backend';

export function useCurrentUser() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  const roleQuery = useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  const studentQuery = useQuery<Student | null>({
    queryKey: ['myStudentProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyStudentProfile();
    },
    enabled: !!actor && !actorFetching && !!identity && profileQuery.data !== null,
    retry: false,
  });

  const teacherQuery = useQuery<Teacher | null>({
    queryKey: ['myTeacherProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyTeacherProfile();
    },
    enabled: !!actor && !actorFetching && !!identity && profileQuery.data !== null,
    retry: false,
  });

  const isAuthenticated = !!identity;
  const isAdmin = roleQuery.data === true;
  const isTeacher = !isAdmin && teacherQuery.data !== null;
  const isStudent = !isAdmin && !isTeacher && studentQuery.data !== null;

  return {
    userProfile: profileQuery.data,
    isLoading: actorFetching || profileQuery.isLoading || roleQuery.isLoading,
    isFetched: !!actor && profileQuery.isFetched && roleQuery.isFetched,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    studentProfile: studentQuery.data,
    teacherProfile: teacherQuery.data,
  };
}
