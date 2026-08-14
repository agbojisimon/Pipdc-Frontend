import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { useCreateProperty, useUpdateProperty } from '../../hooks/mutations';
import { useToast } from '../ui/Toast';
import { extractApiError } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { propertyStatusLabel } from '../../utils/propertyStatus';
import type { Property, PropertyType } from '../../types';

const propertyTypes: PropertyType[] = [
  'Detached House',
  'Semi-Detached',
  'Terrace',
  'Apartment',
  'Penthouse',
  'Villa',
  'Mansion',
  'Land',
  'Commercial',
  'Townhouse',
  'Residential',
  'Industrial',
  'Mixed',
];

const statuses = ['For Sale', 'For Lease', 'Sold', 'Off Market'] as const;

const optionalNumber = z.number({ message: 'Enter a valid number' }).int().min(0).optional();
const optionalDecimal = z.number({ message: 'Enter a valid number' }).min(0).optional();

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  slug: z.string().optional(),
  price: z.number({ message: 'Enter a valid price' }).min(0),
  currency: z.string().min(1, 'Currency is required'),
  period: z.string().optional(),
  status: z.enum(statuses),
  type: z.string().min(1, 'Type is required'),
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  size: optionalDecimal,
  sizeUnit: z.string().min(1, 'Size unit is required'),
  lotSize: optionalDecimal,
  yearBuilt: optionalNumber,
  address: z.string().min(5, 'Address is required'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  area: z.string().optional(),
  latitude: z.number({ message: 'Enter a valid number' }).min(-90).max(90).optional(),
  longitude: z.number({ message: 'Enter a valid number' }).min(-180).max(180).optional(),
  amenities: z.string().optional(),
  images: z.string().optional(),
  featured: z.boolean(),
  agentId: z.union([z.literal(''), z.number({ message: 'Select an agent' }).int().positive()]).optional(),
});

type PropertyFormValues = z.infer<typeof schema>;

const toOptionalNumber = (value: unknown) => (value === '' || value === null || value === undefined ? undefined : Number(value));

interface PropertyFormProps {
  open: boolean;
  property: Property | null;
  agents: { id: number; fullName: string }[];
  onClose: () => void;
}

export function PropertyForm({ open, property, agents, onClose }: PropertyFormProps) {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('Admin') ?? false;
  const isAgent = user?.roles.includes('Agent') ?? false;
  const { notify } = useToast();
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const isEditing = Boolean(property);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<PropertyFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) return;
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        slug: property.slug ?? '',
        price: property.price,
        currency: property.currency,
        period: property.period ?? '',
        status: property.status,
        type: property.type,
        bedrooms: property.bedrooms ?? undefined,
        bathrooms: property.bathrooms ?? undefined,
        size: property.size ?? undefined,
        sizeUnit: property.sizeUnit,
        lotSize: property.lotSize ?? undefined,
        yearBuilt: property.yearBuilt ?? undefined,
        address: property.address,
        state: property.state,
        city: property.city,
        area: property.area ?? '',
        latitude: property.latitude ?? undefined,
        longitude: property.longitude ?? undefined,
        amenities: (property.amenities ?? []).join('\n'),
        images: (property.images ?? []).join('\n'),
        featured: property.featured,
        agentId: property.agentId,
      });
    } else {
      reset({
        title: '',
        description: '',
        slug: '',
        price: undefined,
        currency: 'NGN',
        period: '',
        status: 'For Sale',
        type: 'Apartment',
        bedrooms: undefined,
        bathrooms: undefined,
        size: undefined,
        sizeUnit: 'sqm',
        lotSize: undefined,
        yearBuilt: undefined,
        address: '',
        state: '',
        city: '',
        area: '',
        latitude: undefined,
        longitude: undefined,
        amenities: '',
        images: '',
        featured: false,
        agentId: '',
      });
    }
  }, [open, property, reset]);

  const parseList = (value?: string): string[] =>
    (value ?? '')
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

  const onSubmit = async (data: PropertyFormValues) => {
    const agentId = isAdmin && typeof data.agentId === 'number' ? data.agentId : undefined;
    if (isAdmin && !agentId) {
      setError('agentId', { message: 'Select an agent to assign this property to.' });
      return;
    }

    const payload: Record<string, unknown> = {
      title: data.title,
      description: data.description,
      slug: data.slug?.trim() || undefined,
      price: data.price,
      currency: data.currency,
      period: data.period?.trim() || undefined,
      status: data.status,
      type: data.type,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      size: data.size,
      sizeUnit: data.sizeUnit,
      lotSize: data.lotSize,
      yearBuilt: data.yearBuilt,
      address: data.address,
      state: data.state,
      city: data.city,
      area: data.area?.trim() || undefined,
      latitude: data.latitude,
      longitude: data.longitude,
      amenities: parseList(data.amenities),
      images: parseList(data.images),
      featured: isAdmin ? data.featured : false,
      agentId,
    };

    try {
      if (isEditing && property) {
        await updateProperty.mutateAsync({ id: property.id, payload });
        notify({ type: 'success', title: 'Property updated', description: `"${data.title}" was updated.` });
      } else {
        await createProperty.mutateAsync(payload);
        notify({ type: 'success', title: 'Property created', description: `"${data.title}" was listed.` });
      }
      onClose();
    } catch (err) {
      notify({ type: 'error', title: 'Could not save property', description: extractApiError(err) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Property' : 'Add Property'}
      description={isEditing ? 'Update the listing details below.' : 'Fill in the listing details to publish a new property.'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Title" placeholder="e.g. 3-Bedroom Detached House in Abuja" error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" placeholder="Describe the property, its features and surroundings." className="min-h-[100px]" error={errors.description?.message} {...register('description')} />

        <div className="grid grid-cols-[1fr_1fr] gap-3 sm:gap-4">
          <Input label="Price" type="number" step="any" placeholder="0" error={errors.price?.message} {...register('price', { setValueAs: toOptionalNumber })} />
          <Select label="Currency" error={errors.currency?.message} {...register('currency')}>
            {['NGN', 'USD', 'EUR', 'GBP'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Period (for rentals)" placeholder="e.g. Per annum" error={errors.period?.message} {...register('period')} />
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            {statuses.map((s) => (
              <option key={s} value={s}>{propertyStatusLabel(s)}</option>
            ))}
          </Select>
          <Select label="Type" error={errors.type?.message} {...register('type')}>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <Input label="Bedrooms" type="number" placeholder="e.g. 4" error={errors.bedrooms?.message} {...register('bedrooms', { setValueAs: toOptionalNumber })} />
          <Input label="Bathrooms" type="number" placeholder="e.g. 3" error={errors.bathrooms?.message} {...register('bathrooms', { setValueAs: toOptionalNumber })} />
          <Input label="Year built" type="number" placeholder="e.g. 2022" error={errors.yearBuilt?.message} {...register('yearBuilt', { setValueAs: toOptionalNumber })} />
          <Input label="Size" type="number" step="any" placeholder="e.g. 400" error={errors.size?.message} {...register('size', { setValueAs: toOptionalNumber })} />
          <Select label="Size unit" error={errors.sizeUnit?.message} {...register('sizeUnit')}>
            {['sqm', 'sqft', 'acres', 'hectares'].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
          <Input label="Lot size" type="number" step="any" placeholder="e.g. 800" error={errors.lotSize?.message} {...register('lotSize', { setValueAs: toOptionalNumber })} />
        </div>

        <Input label="Address" placeholder="Street address" error={errors.address?.message} {...register('address')} />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="City" placeholder="e.g. Abuja" error={errors.city?.message} {...register('city')} />
          <Input label="State" placeholder="e.g. FCT" error={errors.state?.message} {...register('state')} />
          <Input label="Area" placeholder="Neighbourhood / district" error={errors.area?.message} {...register('area')} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Latitude" type="number" step="any" placeholder="e.g. 9.0765" error={errors.latitude?.message} {...register('latitude', { setValueAs: toOptionalNumber })} />
          <Input label="Longitude" type="number" step="any" placeholder="e.g. 7.3986" error={errors.longitude?.message} {...register('longitude', { setValueAs: toOptionalNumber })} />
          <Input label="Slug (optional)" placeholder="Auto-generated from title if blank" error={errors.slug?.message} {...register('slug')} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Textarea label="Amenities (one per line)" placeholder={'Air conditioning\nGarage\nSwimming pool'} className="min-h-[80px]" error={errors.amenities?.message} {...register('amenities')} />
          <Textarea label="Images (one image URL per line)" placeholder={'https://.../photo1.jpg\nhttps://.../photo2.jpg'} className="min-h-[80px]" error={errors.images?.message} {...register('images')} />
        </div>

        {isAdmin && (
          <>
            <Select label="Assigned agent" error={errors.agentId?.message} {...register('agentId', { setValueAs: toOptionalNumber })}>
              <option value="">Select an agent</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.fullName}</option>
              ))}
            </Select>
            <label className="inline-flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-forest-500 focus:ring-forest-500" {...register('featured')} />
              Featured listing
            </label>
          </>
        )}

        {isAgent && !isAdmin && (
          <p className="text-xs text-ink-500">The property will be assigned to your agent profile.</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>{isEditing ? 'Save changes' : 'Publish property'}</Button>
        </div>
      </form>
    </Modal>
  );
}
