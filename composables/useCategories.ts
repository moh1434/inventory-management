import { categoryWithId } from "~~/types";

export function useCategories() {
  const categories = useState<categoryWithId[]>("getCategories", () => []);

  if (categories.value.length == 0) {
    useWrapFetch<categoryWithId[]>("category").then(({ result, error }) => {
      if (error) {
        return;
      }
      categories.value = result ?? [];
    });
  }

  return { categories };
}
