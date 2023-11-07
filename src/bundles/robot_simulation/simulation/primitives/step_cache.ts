// TODO: INCOMPLETE

type CacheEntry<T> = {
  value:T;
  valid:boolean;
};

export type CacheSchema = Record<string, any>;

export class StepCache<Schema extends CacheSchema> {
  private cache: Record<string, CacheEntry<any>> = {};

  // Get a value from the cache. If it's invalidated, it will mark it as valid again
  get<K extends keyof Schema>(key: K): Schema[K] {
    const entry = this.cache[key as string];
    if (!entry.valid) {
      entry.valid = true;
    }
    return entry.value;
  }


  // Invalidate all cache entries
  invalidateAll(): void {
    for (const key in this.cache) {
      this.cache[key].valid = false;
    }
  }
}
