const required =
  (field = "this field") =>
  (v: string) =>
    !!v || `${field} is required`;

const notEmpty =
  (field = "this field") =>
  (v: string) =>
    (v && v.length > 0) || `${field} can't be empty`;

const phoneNumber = (v: string) =>
  (typeof v === "string" &&
    v.length == 11 &&
    v.startsWith("07") &&
    !!Number(v)) ||
  "Phone must starts with '07', and contains 11 number";

const images = [
  (files: File[]) => Array.isArray(files) || "Invalid values",
  (files: File[]) =>
    (Array.isArray(files) && files.length <= 4) ||
    "you can't upload more than 4 images",
  (files: File[]) =>
    (Array.isArray(files) &&
      (files.length === 0 ||
        files.some((file: File) => file.size < 4000000))) ||
    "Image size should be less than 4 MB",
];

export const useValidationRules = () => {
  return { required, notEmpty, phoneNumber, images };
};
