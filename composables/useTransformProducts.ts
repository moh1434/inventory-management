import cloneDeep from "clone-deep";
import { Ref } from "nuxt/dist/app/compat/capi";
import { productTransformedWithId, productWithId } from "~~/types";

export function useTransformProducts(products: Ref<productWithId[]>) {
  const productsTransformed = computed(() => {
    const productsTransformed: productTransformedWithId[] = cloneDeep(
      products.value
    ) as any[];
    products.value.forEach((product, index) => {
      if (productsTransformed[index].description) {
        productsTransformed[index].description = productsTransformed[
          index
        ].description.slice(0, 32);
      }
      if (!productsTransformed[index].itemsByStatus) {
        productsTransformed[index]["itemsByStatus"] = {
          NEW: 0,
          USED: 0,
          BROKEN: 0,
        };
      }
      product.items.forEach((item) => {
        productsTransformed[index].itemsByStatus[item.status]++;
      });
    });
    return productsTransformed;
  });

  return { productsTransformed };
}
