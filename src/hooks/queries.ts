import { useQuery } from '@tanstack/react-query';
import { agentService } from '../services/agentService';
import { blogService } from '../services/blogService';
import { conversationService } from '../services/conversationService';
import { dashboardService } from '../services/dashboardService';
import { enquiryService } from '../services/enquiryService';
import { messageService } from '../services/messageService';
import { propertyService } from '../services/propertyService';
import { savedPropertyService } from '../services/savedPropertyService';
import { userService } from '../services/userService';
import { developmentService } from '../services/developmentService';
import { useAuth } from '../contexts/AuthContext';
import { primaryRole } from '../utils/roles';
import type { PropertyFilters } from '../types';
import type { DevelopmentProjectFilters, DevelopmentTrackingFilters } from '../types/development';

export const queryKeys = {
  propertyList: (filters: PropertyFilters) => ['properties', filters] as const,
  featuredProperties: ['properties', 'featured'] as const,
  property: (slug: string) => ['properties', 'slug', slug] as const,
  similarProperties: (id: number) => ['properties', id, 'similar'] as const,
  agentProperties: (agentId: number) => ['properties', 'agent', agentId] as const,
  agents: ['agents'] as const,
  agent: (id: number) => ['agents', id] as const,
  myAgent: ['agents', 'me'] as const,
  enquiries: ['enquiries'] as const,
  myEnquiries: ['enquiries', 'mine'] as const,
  agentEnquirySummaries: ['enquiries', 'agents', 'summary'] as const,
  agentEnquiries: (agentId: number) => ['enquiries', 'agents', agentId] as const,
  propertyEnquiries: (propertyId: number) => ['enquiries', 'property', propertyId] as const,
  blogPosts: ['blog'] as const,
  blogPostsAll: ['blog', 'all'] as const,
  blogPost: (slug: string) => ['blog', 'slug', slug] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  agentSummary: (id: number) => ['agents', id, 'summary'] as const,
  savedIds: ['saved-properties', 'ids'] as const,
  savedProperties: ['saved-properties'] as const,
  dashboard: (role: string) => ['dashboard', role] as const,
  conversations: ['conversations'] as const,
  conversation: (id: number) => ['conversations', id] as const,
  conversationByEnquiry: (enquiryId: number) => ['conversations', 'enquiry', enquiryId] as const,
  messages: (conversationId: number) => ['conversations', conversationId, 'messages'] as const,
  developmentProjects: (filters?: DevelopmentProjectFilters) => ['development-projects', filters] as const,
  featuredDevelopmentProjects: ['development-projects', 'featured'] as const,
  developmentProject: (slug: string) => ['development-projects', 'slug', slug] as const,
  developmentProjectById: (id: number) => ['development-projects', id] as const,
  developmentUnits: (projectId: number) => ['development-projects', projectId, 'units'] as const,
  developmentUpdates: (projectId: number) => ['development-projects', projectId, 'updates'] as const,
  developmentTracking: (filters?: DevelopmentProjectFilters) => ['development-tracking', filters] as const,
  adminDevelopmentTracking: (filters?: DevelopmentTrackingFilters) => ['admin-development-tracking', filters] as const,
};

export function useFeaturedProperties() {
  return useQuery({ queryKey: queryKeys.featuredProperties, queryFn: propertyService.featured });
}

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: queryKeys.propertyList(filters),
    queryFn: () => propertyService.list(filters),
  });
}

export function useProperty(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.property(slug ?? ''),
    queryFn: () => propertyService.getBySlug(slug!),
    enabled: Boolean(slug),
  });
}

export function useSimilarProperties(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.similarProperties(id ?? 0),
    queryFn: () => propertyService.similar(id!),
    enabled: Boolean(id),
  });
}

export function useAgents() {
  return useQuery({
    queryKey: queryKeys.agents,
    queryFn: () => agentService.list({ pageSize: 100 }),
  });
}

export function useAgent(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.agent(id ?? 0),
    queryFn: () => agentService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useMyAgent(enabled = true) {
  return useQuery({
    queryKey: queryKeys.myAgent,
    queryFn: agentService.me,
    enabled,
  });
}

export function useAgentProperties(agentId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.agentProperties(agentId ?? 0),
    queryFn: () => propertyService.list({ agentId, pageSize: 100 }),
    enabled: Boolean(agentId),
  });
}

export function useEnquiries() {
  return useQuery({
    queryKey: queryKeys.enquiries,
    queryFn: () => enquiryService.list({ pageSize: 100 }),
  });
}

export function useMyEnquiries() {
  return useQuery({
    queryKey: queryKeys.myEnquiries,
    queryFn: () => enquiryService.mine({ pageSize: 100 }),
  });
}

export function useAgentEnquirySummaries() {
  return useQuery({
    queryKey: queryKeys.agentEnquirySummaries,
    queryFn: () => enquiryService.agentSummaries({ pageSize: 100 }),
  });
}

export function useAgentEnquiries(agentId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.agentEnquiries(agentId ?? 0),
    queryFn: () => enquiryService.byAgent(agentId!, { pageSize: 100 }),
    enabled: Boolean(agentId),
  });
}

export function usePropertyEnquiries(propertyId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.propertyEnquiries(propertyId ?? 0),
    queryFn: () => enquiryService.byProperty(propertyId!, { pageSize: 100 }),
    enabled: Boolean(propertyId),
  });
}

export function useBlogPosts() {
  return useQuery({ queryKey: queryKeys.blogPosts, queryFn: blogService.list });
}

export function useAllBlogPosts() {
  return useQuery({
    queryKey: queryKeys.blogPostsAll,
    queryFn: () => blogService.listManaged({ pageSize: 100 }),
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.blogPost(slug ?? ''),
    queryFn: () => blogService.getBySlug(slug!),
    enabled: Boolean(slug),
  });
}

export function useSavedProperties() {
  return useQuery({
    queryKey: queryKeys.savedProperties,
    queryFn: () => savedPropertyService.list({ pageSize: 100 }),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => userService.list({ pageSize: 100 }),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user(id ?? ''),
    queryFn: () => userService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useAgentSummary(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.agentSummary(id ?? 0),
    queryFn: () => agentService.getSummary(id!),
    enabled: Boolean(id),
  });
}

export function useDashboard() {
  const { user } = useAuth();
  const role = primaryRole(user?.roles);
  return useQuery({
    queryKey: queryKeys.dashboard(role),
    queryFn: dashboardService.get,
    enabled: Boolean(user),
  });
}

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => conversationService.list({ pageSize: 100 }),
  });
}

export function useConversation(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.conversation(id ?? 0),
    queryFn: () => conversationService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useEnquiryConversationState(enquiryId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.conversationByEnquiry(enquiryId ?? 0),
    queryFn: () => conversationService.getStateByEnquiry(enquiryId!),
    enabled: Boolean(enquiryId),
  });
}

export function useMessages(conversationId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId ?? 0),
    queryFn: () => messageService.list(conversationId!),
    enabled: Boolean(conversationId),
  });
}

// ── Development Projects ─────────────────────────────────────────────────

export function useDevelopmentProjects(filters?: DevelopmentProjectFilters) {
  return useQuery({
    queryKey: queryKeys.developmentProjects(filters),
    queryFn: () => developmentService.browse(filters),
  });
}

export function useDevelopmentProject(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.developmentProject(slug ?? ''),
    queryFn: () => developmentService.getPublicBySlug(slug!),
    enabled: Boolean(slug),
  });
}

export function useFeaturedDevelopmentProjects() {
  return useQuery({
    queryKey: queryKeys.featuredDevelopmentProjects,
    queryFn: () => developmentService.browse({ featured: true, pageSize: 6 }),
  });
}

export function useAdminDevelopmentProjects(filters?: DevelopmentProjectFilters) {
  return useQuery({
    queryKey: queryKeys.developmentProjects(filters),
    queryFn: () => developmentService.list(filters),
  });
}

export function useAdminDevelopmentProject(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.developmentProjectById(id ?? 0),
    queryFn: () => developmentService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useDevelopmentUnits(projectId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.developmentUnits(projectId ?? 0),
    queryFn: () => developmentService.listUnits(projectId!),
    enabled: Boolean(projectId),
  });
}

export function useDevelopmentUpdates(projectId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.developmentUpdates(projectId ?? 0),
    queryFn: () => developmentService.listUpdates(projectId!),
    enabled: Boolean(projectId),
  });
}

export function useDevelopmentTracking(filters?: DevelopmentProjectFilters) {
  return useQuery({
    queryKey: queryKeys.developmentTracking(filters),
    queryFn: () => developmentService.getTracked(filters),
  });
}

export function useAdminDevelopmentTracking(filters?: DevelopmentTrackingFilters) {
  return useQuery({
    queryKey: queryKeys.adminDevelopmentTracking(filters),
    queryFn: () => developmentService.adminListTracking(filters),
  });
}
