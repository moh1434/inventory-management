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

const images = (isRequired = false) => {
  const requiredRule = isRequired
    ? (files: File[]) => files.length > 0 || "Images are required"
    : () => true;

  const rules = [
    (files: File[]) => Array.isArray(files) || "Invalid values",
    requiredRule,
    (files: File[]) =>
      files.length <= 4 || "you can't upload more than 4 images",
    (files: File[]) =>
      files.every((file: File) => file.size < 4000000) ||
      "Image size should be less than 4 MB",
  ];

  return rules;
};

function password(password: string) {
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password.length > 8
  );
}

export const useValidationRules = () => {
  return { required, notEmpty, phoneNumber, images, password };
};
