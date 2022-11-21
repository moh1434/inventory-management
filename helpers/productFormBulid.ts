import { productWithIdAndUploadImages } from "~~/types";

export function productFormBuild(
  data: Pick<
    productWithIdAndUploadImages,
    "name" | "description" | "categoryId" | "imageFiles" | "images" | "items"
  >
) {
  const formData = new FormData();
  data.imageFiles.forEach((image: File) => {
    formData.append("imageFiles", image);
  });
  data.images.forEach((imageStr, i) => {
    formData.append(`images[${i}]`, imageStr);
  });
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("categoryId", data.categoryId);

  data.items.forEach((item, i) => {
    formData.append(`items[${i}][code]`, item.code);
    formData.append(`items[${i}][status]`, item.status);
  });

  return formData;
}
