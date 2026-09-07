// hooks/useApi.js
// Generic "call this async function, track loading/error/data" hook so
// screens don't hand-roll the same three useState calls every time.
//
// Usage:
//   const { data, isLoading, error, refetch } = useApi(
//     () => professionalService.getById(id),
//     [id]
//   );
import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../utils/errorMessage';

export function useApi(apiFn, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFn();
      setData(result);
      return result;
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (immediate) execute().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
}

export default useApi;
