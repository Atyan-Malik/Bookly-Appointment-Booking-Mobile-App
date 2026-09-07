// hooks/usePagination.js
// Wraps a list-style API call (one that returns { items, pagination }) with
// "load more" support for FlatList's onEndReached.
import { useCallback, useState } from 'react';
import { getErrorMessage } from '../utils/errorMessage';

export function usePagination(fetchPage, extraParams = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (reset = true) => {
      const targetPage = reset ? 1 : page + 1;
      reset ? setIsLoading(true) : setIsLoadingMore(true);
      setError(null);
      try {
        const result = await fetchPage({ ...extraParams, page: targetPage });
        setItems((prev) => (reset ? result.items : [...prev, ...result.items]));
        setPage(targetPage);
        setHasMore(targetPage < (result.pagination?.pages ?? 1));
      } catch (e) {
        setError(getErrorMessage(e));
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, JSON.stringify(extraParams)]
  );

  const loadMore = useCallback(() => {
    if (!isLoadingMore && !isLoading && hasMore) load(false);
  }, [isLoadingMore, isLoading, hasMore, load]);

  const refresh = useCallback(() => load(true), [load]);

  return { items, isLoading, isLoadingMore, hasMore, error, loadMore, refresh };
}

export default usePagination;
