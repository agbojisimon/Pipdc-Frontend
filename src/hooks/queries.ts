import { useQuery } from '@tanstack/react-query';
import { agentService } from '../services/agentService';
import { blogService } from '../services/blogService';
import { enquiryService } from '../services/enquiryService';
import { propertyService } from '../services/propertyService';
import { userService } from '../services/userService';
import type { PropertyFilters } from '../types';

export const queryKeys = {
  propertyList: (filters: PropertyFilters) => ['properties', filters] as const,
  featuredProperties: ['properties', 'featured'] as const,
  property: (slug: string) => ['properties', 'slug', slug] as const,
  similarProperties: (id: number) => ['properties', id, 'similar'] as const,
  agentProperties: (agentId: number) => ['properties', 'agent', agentId] as const,
  agents: ['agents'] as const,
  agent: (id: number) => ['agents', id] as const,
  enquiries: ['enquiries'] as const,
  blogPosts: ['blog'] as const,
  users: ['users'] as const,
  savedIds: ['saved-properties', 'ids'] as const,
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

export function useBlogPosts() {
  return useQuery({ queryKey: queryKeys.blogPosts, queryFn: blogService.list });
}

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => userService.list({ pageSize: 100 }),
  });
}
