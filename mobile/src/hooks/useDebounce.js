// hooks/useDebounce.js
// Delays updating a value until the person stops typing for `delay` ms.
// Used by DiscoverScreen so search doesn't fire an API call on every keystroke.
import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
