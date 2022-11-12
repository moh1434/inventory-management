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

export const useValidationRules = () => {
  return { required, notEmpty, phoneNumber };
};
