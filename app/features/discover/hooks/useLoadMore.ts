import { useCallback } from 'react';
import { useNavigation, useSearchParams } from 'react-router';

// 더보기 버튼 기반 페이지네이션 훅으로 변경
export function useLoadMore(currentPage: number, hasMore: boolean = true) {
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const loadNextPage = useCallback(() => {
    if (navigation.state === 'idle' && hasMore) {
      // 다음 페이지 로드
      const nextPage = currentPage + 1;
      const nextCount = 20 * nextPage;

      searchParams.set('page', nextPage.toString());
      searchParams.set('count', nextCount.toString());
      // 페이지 클릭시 scroll이 맨 위로 가는 것을 막아주는 옵션 true
      setSearchParams(searchParams, { preventScrollReset: true });
    }
  }, [currentPage, navigation.state, hasMore, searchParams]);

  return {
    loadNextPage,
    isLoadingMore: navigation.state === 'loading',
    canLoadMore: hasMore && navigation.state === 'idle',
  };
}
