import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs';
import { Badge } from '@/common/components/ui/badge';
import type { DiscoverFilters, FilterCounts } from '../types';
import { CATEGORIES, SORT_OPTIONS } from '../types';

interface FilterBarProps {
  filters: DiscoverFilters;
  filterCounts?: FilterCounts;
  categories?: string[];
  onChange: (filters: Partial<DiscoverFilters>) => void;
}

export function FilterBar({ filters, filterCounts, categories, onChange }: FilterBarProps) {
  return (
    <div className="bg-background/95 backdrop-blur sticky top-0 z-10 border-b">
      <div className="pb-4">
        <div className="flex items-center gap-3">
          {/* 카테고리 필터 */}
          <Select
            value={filters.category || 'ALL'}
            onValueChange={(value) => onChange({ category: value === 'ALL' ? null : value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                모든 카테고리
                {filterCounts?.categories && (
                  <span className="ml-2 text-muted-foreground">({filterCounts.total})</span>
                )}
              </SelectItem>
              {categories?.map((cat) => {
                const count = filterCounts?.categories?.find((c) => c.category === cat)?.count;
                return (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORIES[cat as keyof typeof CATEGORIES] || cat}
                    {count !== undefined && (
                      <span className="ml-2 text-muted-foreground">({count})</span>
                    )}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* <Tabs
            value={filters.region}
            onValueChange={(value) => onChange({ region: value as 'ALL' | 'KR' | 'ROW' })}
          >
            <TabsList>
              <TabsTrigger value="ALL">
                전체
                {filterCounts?.regions && (
                  <Badge variant="secondary" className="ml-1 px-1 text-xs">
                    {filterCounts.total}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="KR">
                한국
                {filterCounts?.regions && (
                  <Badge variant="secondary" className="ml-1 px-1 text-xs">
                    {filterCounts.regions.find((r) => r.region === 'KR')?.count || 0}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="ROW">
                글로벌
                {filterCounts?.regions && (
                  <Badge variant="secondary" className="ml-1 px-1 text-xs">
                    {filterCounts.regions.find((r) => r.region === 'ROW')?.count || 0}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs> */}

          <Tabs
            value={filters.status}
            onValueChange={(value) => onChange({ status: value as 'ALL' | 'SUBSCRIBED' | 'NEW' })}
          >
            <TabsList>
              <TabsTrigger value="ALL">
                전체
                {filterCounts?.statuses?.ALL !== undefined && (
                  <Badge variant="secondary" className="ml-1 px-1 text-xs">
                    {filterCounts.statuses.ALL}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="SUBSCRIBED">
                구독중
                {filterCounts?.statuses?.SUBSCRIBED !== undefined && (
                  <Badge variant="secondary" className="ml-1 px-1 text-xs">
                    {filterCounts.statuses.SUBSCRIBED}
                  </Badge>
                )}
              </TabsTrigger>
              {/* <TabsTrigger value="NEW">
                신규
                {filterCounts?.statuses?.NEW !== undefined && (
                  <Badge variant="secondary" className="ml-1 px-1 text-xs">
                    {filterCounts.statuses.NEW}
                  </Badge>
                )}
              </TabsTrigger> */}
            </TabsList>
          </Tabs>

          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              onChange({
                sortBy: sortBy as any,
                sortOrder: sortOrder as 'asc' | 'desc',
              });
            }}
          >
            <SelectTrigger className="w-[180px] ml-auto">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
