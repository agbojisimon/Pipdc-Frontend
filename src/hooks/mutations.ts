import { useMutation, useQueryClient } from '@tanstack/react-query';
import { agentService } from '../services/agentService';
import { authService } from '../services/authService';
import { blogService } from '../services/blogService';
import { enquiryService } from '../services/enquiryService';
import { messageService } from '../services/messageService';
import { propertyService } from '../services/propertyService';
import { queryKeys } from './queries';

function useInvalidate(prefixes: string[][]) {
  const queryClient = useQueryClient();
  return () => {
    prefixes.forEach((prefix) => {
      void queryClient.invalidateQueries({ queryKey: prefix });
    });
  };
}

export function useCreateProperty() {
  const invalidate = useInvalidate([['properties'], ['agents'], ['dashboard']]);
  return useMutation({ mutationFn: (payload: Record<string, unknown>) => propertyService.create(payload), onSuccess: invalidate });
}

export function useUpdateProperty() {
  const invalidate = useInvalidate([['properties'], ['agents'], ['dashboard']]);
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => propertyService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useSetFeatured() {
  const invalidate = useInvalidate([['properties'], ['dashboard']]);
  return useMutation({
    mutationFn: ({ id, featured }: { id: number; featured: boolean }) => propertyService.setFeatured(id, featured),
    onSuccess: invalidate,
  });
}

export function useDeleteProperty() {
  const invalidate = useInvalidate([['properties'], ['agents'], ['dashboard'], ['saved-properties']]);
  return useMutation({ mutationFn: (id: number) => propertyService.remove(id), onSuccess: invalidate });
}

export function useCreateAgent() {
  const invalidate = useInvalidate([['agents'], ['users'], ['dashboard']]);
  return useMutation({ mutationFn: (payload: Record<string, unknown>) => agentService.create(payload), onSuccess: invalidate });
}

export function useUpdateAgent() {
  const invalidate = useInvalidate([['agents'], ['users'], ['dashboard']]);
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => agentService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteAgent() {
  const invalidate = useInvalidate([['agents'], ['users'], ['dashboard']]);
  return useMutation({ mutationFn: (id: number) => agentService.remove(id), onSuccess: invalidate });
}

export function useUpdateEnquiry() {
  const invalidate = useInvalidate([['enquiries'], ['dashboard']]);
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { fullName: string; email: string; phone?: string | null; message: string; status: string } }) =>
      enquiryService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteEnquiry() {
  const invalidate = useInvalidate([['enquiries'], ['dashboard']]);
  return useMutation({ mutationFn: (id: number) => enquiryService.remove(id), onSuccess: invalidate });
}

export function useNotifyAgent() {
  const invalidate = useInvalidate([['enquiries'], ['dashboard']]);
  return useMutation({ mutationFn: (id: number) => enquiryService.notifyAgent(id), onSuccess: invalidate });
}

export function useCreateBlogPost() {
  const invalidate = useInvalidate([['blog']]);
  return useMutation({ mutationFn: (payload: Record<string, unknown>) => blogService.create(payload), onSuccess: invalidate });
}

export function useUpdateBlogPost() {
  const invalidate = useInvalidate([['blog']]);
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => blogService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteBlogPost() {
  const invalidate = useInvalidate([['blog']]);
  return useMutation({ mutationFn: (id: number) => blogService.remove(id), onSuccess: invalidate });
}

export function useAddRole() {
  const invalidate = useInvalidate([['users'], ['agents'], ['dashboard']]);
  return useMutation({
    mutationFn: (payload: { email: string; role: string }) => authService.addRole(payload),
    onSuccess: invalidate,
  });
}

export function useRemoveRole() {
  const invalidate = useInvalidate([['users'], ['agents'], ['dashboard']]);
  return useMutation({
    mutationFn: (payload: { email: string; role: string }) => authService.removeRole(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateProfile() {
  const invalidate = useInvalidate([['dashboard']]);
  return useMutation({
    mutationFn: (payload: { firstName: string; lastName: string; phoneNumber?: string | null }) => authService.updateProfile(payload),
    onSuccess: invalidate,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) => messageService.send(conversationId, content),
    onSuccess: (_data, { conversationId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) });
    },
  });
}

export function useSendFirstMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enquiryId, content }: { enquiryId: number; content: string }) => messageService.sendByEnquiry(enquiryId, content),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversation(data.conversation.id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversationByEnquiry(data.conversation.enquiryId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.messages(data.conversation.id) });
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) => messageService.markRead(conversationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}
