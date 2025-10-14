import { useState, useEffect } from 'react';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Form } from 'react-router';

interface DiscoverHeaderProps {
  onSearch: (search: string) => void;
  currentSearch: string;
}

export function DiscoverHeader({ onSearch, currentSearch }: DiscoverHeaderProps) {
  const [searchInput, setSearchInput] = useState(currentSearch);

  // 초기값 동기화
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(searchInput);
    }
  };

  return (
    <div>
      <div className="flex items-start gap-4 justify-between mb-4 lg:mb-6 flex-col lg:flex-row lg:items-center">
        <h1 className="text-[28px] font-bold">뉴스레터 찾기</h1>
        <Form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="뉴스레터를 찾아보세요"
            className="w-64 border-0"
          />
          {/* FIXME: debounce */}
          <Button type="submit">검색</Button>
        </Form>
      </div>
    </div>
  );
}
