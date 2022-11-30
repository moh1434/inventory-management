import { productWithId } from "~~/types";

export function useMyProducts() {
  const products = useState<productWithId[]>("getProducts", () => []);

  if (products.value.length == 0) {
    useWrapFetch<productWithId[]>("/products/me").then(({ result, error }) => {
      if (error) {
        return;
      }
      products.value = result ?? [];
    });
  }

  return { products };
}
