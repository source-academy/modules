import { useEffect, useState } from 'react';


export const useFetchFromSimulation = <T> (fetchFn:() => T, fetchInterval: number) => {
  const [fetchTime, setFetchTime] = useState<Date | null>(null);
  const [fetchedData, setFetchedData] = useState<T | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = fetchFn();
      setFetchedData(data);
      setFetchTime(new Date());
    }, fetchInterval);

    return () => clearInterval(interval);
  });

  return [fetchTime, fetchedData] as const;
};
