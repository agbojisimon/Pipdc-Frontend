import { useQuery } from '@tanstack/react-query';
import { agentService } from '../services/agentService';
import { blogService } from '../services/blogService';
import { dashboardService } from '../services/dashboardService';
import { enquiryService } from '../services/enquiryService';
import { propertyService } from '../services/propertyService';
import { savedPropertyService } from '../services/savedPropertyService';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { primaryRole } from '../utils/roles';
import type { PropertyFilters } from '../types';

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
  blogPosts: ['blog'] as const,
  blogPostsAll: ['blog', 'all'] as const,
  blogPost: (slug: string) => ['blog', 'slug', slug] as const,
  users: ['users'] as const,
  savedIds: ['saved-properties', 'ids'] as const,
  savedProperties: ['saved-properties'] as const,
  dashboard: (role: string) => ['dashboard', role] as const,
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

export function useDashboard() {
  const { user } = useAuth();
  const role = primaryRole(user?.roles);
  return useQuery({
    queryKey: queryKeys.dashboard(role),
    queryFn: dashboardService.get,
    enabled: Boolean(user),
  });
}
