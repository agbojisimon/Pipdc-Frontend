import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Tag, Bed, Wallet } from 'lucide-react';
import { Select } from '../ui/Input';
import { Button } from '../ui/Button';
import type { PropertyFilters, PropertyType, PropertyStatus } from '../../types';
import { plateauLocations } from '../../services/mockData';

interface SearchFilterProps {
  filters: PropertyFilters;
  onChange: (next: PropertyFilters) => void;
  onSearch?: () => void;
  compact?: boolean;
}

const propertyTypes: (PropertyType | 'All')[] = [
  'All', 'Detached House', 'Semi-Detached', 'Terrace', 'Apartment', 'Penthouse', 'Villa', 'Mansion', 'Land', 'Commercial', 'Townhouse',
];
const statuses: (PropertyStatus | 'All')[] = ['All', 'For Sale', 'For Lease', 'Sold', 'Off Market'];

export function SearchFilter({ filters, onChange, onSearch, compact }: SearchFilterProps) {
  const navigate = useNavigate();

  const handleSearch = () => {
    onSearch?.();
    if (!onSearch) navigate('/properties');
  };

  return (
    <div className={compact ? 'grid gap-3' : 'grid gap-3 md:grid-cols-2 lg:grid-cols-6'}>
      <div className="lg:col-span-1">
        <Select
          aria-label="Location"
          value={filters.location ?? 'All'}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        >
          <option value="All">All Locations</option>
          {plateauLocations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
      </div>
      <div className="lg:col-span-1">
        <Select
          aria-label="Property type"
          value={filters.type ?? 'All'}
          onChange={(e) => onChange({ ...filters, type: e.target.value as PropertyType | 'All' })}
        >
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
          ))}
        </Select>
      </div>
      <div className="lg:col-span-1">
        <Select
          aria-label="Status"
          value={filters.status ?? 'All'}
          onChange={(e) => onChange({ ...filters, status: e.target.value as PropertyStatus | 'All' })}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'Sale / Lease' : s}</option>
          ))}
        </Select>
      </div>
      <div className="lg:col-span-1">
        <Select
          aria-label="Bedrooms"
          value={filters.bedrooms ?? 0}
          onChange={(e) => onChange({ ...filters, bedrooms: Number(e.target.value) || undefined })}
        >
          <option value={0}>Any Beds</option>
          <option value={1}>1+ Beds</option>
          <option value={2}>2+ Beds</option>
          <option value={3}>3+ Beds</option>
          <option value={4}>4+ Beds</option>
          <option value={5}>5+ Beds</option>
        </Select>
      </div>
      <div className="lg:col-span-1">
        <Select
          aria-label="Max price"
          value={filters.maxPrice ?? 0}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) || undefined })}
        >
          <option value={0}>Any Price</option>
          <option value={30000000}>Up to ₦30M</option>
          <option value={60000000}>Up to ₦60M</option>
          <option value={100000000}>Up to ₦100M</option>
          <option value={200000000}>Up to ₦200M</option>
          <option value={500000000}>Up to ₦500M</option>
        </Select>
      </div>
      <div className="lg:col-span-1">
        <Button onClick={handleSearch} size="md" className="w-full" leftIcon={<Search className="h-4 w-4" />}>
          Search
        </Button>
      </div>
    </div>
  );
}

export function SearchFilterCard(props: SearchFilterProps) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-700">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-50 text-forest-600">
          <Search className="h-4 w-4" />
        </span>
        Find your property
      </div>
      <SearchFilter {...props} />
    </div>
  );
}

// silence unused imports for tree-shaking friendliness
void MapPin; void Home; void Tag; void Bed; void Wallet;
