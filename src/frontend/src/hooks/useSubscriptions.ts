import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Id, GetSubscriptionConfig } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

// Admin: Get subscription config for a class
export function useGetClassSubscriptionConfig(classId?: Id | null) {
  const { actor, isFetching } = useActor();

  return useQuery<GetSubscriptionConfig | null>({
    queryKey: ['classSubscriptionConfig', classId],
    queryFn: async () => {
      if (!actor || !classId) return null;
      return actor.getClassSubscriptionConfig(classId);
    },
    enabled: !!actor && !isFetching && !!classId,
  });
}

// Admin: Set subscription config for a class
export function useSetClassSubscriptionConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      paywallEnabled,
      priceSatoshis,
      qrImage,
    }: {
      classId: Id;
      paywallEnabled: boolean;
      priceSatoshis: bigint;
      qrImage: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setClassSubscriptionConfig(classId, paywallEnabled, priceSatoshis, qrImage);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['classSubscriptionConfig', variables.classId] });
      queryClient.invalidateQueries({ queryKey: ['classSubscriptionConfig'] });
    },
  });
}

// Student: Check if student has subscription for a class
export function useHasClassSubscription(studentId?: Id | null, classId?: Id | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasClassSubscription', studentId, classId],
    queryFn: async () => {
      if (!actor || !studentId || !classId) return false;
      return actor.hasClassSubscription(studentId, classId);
    },
    enabled: !!actor && !isFetching && !!studentId && !!classId,
  });
}

// Admin: Activate subscription for a student
export function useActivateClassSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, classId }: { studentId: Id; classId: Id }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.activateClassSubscription(studentId, classId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hasClassSubscription', variables.studentId, variables.classId] });
      queryClient.invalidateQueries({ queryKey: ['hasClassSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['pendingSubscriptionClaims'] });
    },
  });
}

// Local storage for pending payment claims (since backend doesn't have a claim submission endpoint yet)
const CLAIMS_STORAGE_KEY = 'subscription_payment_claims';

export interface PaymentClaim {
  id: string;
  studentId: Id;
  studentName: string;
  classId: Id;
  className: string;
  reference: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Student: Submit a payment claim
export function useSubmitPaymentClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      studentName,
      classId,
      className,
      reference,
    }: {
      studentId: Id;
      studentName: string;
      classId: Id;
      className: string;
      reference: string;
    }) => {
      // Store claim in local storage
      const claims = getStoredClaims();
      const newClaim: PaymentClaim = {
        id: `${studentId}-${classId}-${Date.now()}`,
        studentId,
        studentName,
        classId,
        className,
        reference,
        timestamp: Date.now(),
        status: 'pending',
      };
      claims.push(newClaim);
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
      return newClaim;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSubscriptionClaims'] });
      queryClient.invalidateQueries({ queryKey: ['myPaymentClaims'] });
    },
  });
}

// Helper to get stored claims
function getStoredClaims(): PaymentClaim[] {
  try {
    const stored = localStorage.getItem(CLAIMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Admin: Get all pending payment claims
export function useGetPendingPaymentClaims() {
  return useQuery<PaymentClaim[]>({
    queryKey: ['pendingSubscriptionClaims'],
    queryFn: async () => {
      const claims = getStoredClaims();
      return claims.filter((c) => c.status === 'pending');
    },
  });
}

// Student: Get my payment claims for a class
export function useGetMyPaymentClaims(studentId?: Id | null, classId?: Id | null) {
  return useQuery<PaymentClaim[]>({
    queryKey: ['myPaymentClaims', studentId, classId],
    queryFn: async () => {
      if (!studentId || !classId) return [];
      const claims = getStoredClaims();
      return claims.filter((c) => c.studentId === studentId && c.classId === classId);
    },
    enabled: !!studentId && !!classId,
  });
}

// Admin: Approve a payment claim
export function useApprovePaymentClaim() {
  const queryClient = useQueryClient();
  const activateSubscription = useActivateClassSubscription();

  return useMutation({
    mutationFn: async ({ claimId }: { claimId: string }) => {
      const claims = getStoredClaims();
      const claim = claims.find((c) => c.id === claimId);
      if (!claim) throw new Error('Claim not found');

      // Activate subscription in backend
      await activateSubscription.mutateAsync({
        studentId: claim.studentId,
        classId: claim.classId,
      });

      // Update claim status
      claim.status = 'approved';
      localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(claims));
      return claim;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSubscriptionClaims'] });
      queryClient.invalidateQueries({ queryKey: ['myPaymentClaims'] });
      queryClient.invalidateQueries({ queryKey: ['hasClassSubscription'] });
    },
  });
}
