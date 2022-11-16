//From: https://next.vuetifyjs.com/en/components/forms/#misc
export type vuetifyFormI = {
  /** will validate all inputs and return if they are all valid or not. */
  validate: () => boolean;
  /** will clear all inputs and reset their validation errors. */
  reset: () => void;
  /** will only reset input validation and not alter their state. */
  resetValidation: () => void;
};

export type UserI = {
  id: string;
  username: string;
  role: "USER" | "ADMIN";
  logo: string;
  institution_id: number;
};

export type ministryI = {
  name: string;
};
export type ministryWithId = ministryI & {
  id: string;
};

export type institutionI = {
  name: string;
  city: string;
  location: string;
  image: string;
  phoneNumber: string;
  ministryId: string;
};

export type institutionFormI = {
  institution: institutionI;
  username: string;
  password: string;
};

export type institutionWithIdI = institutionI & {
  id: string;
};

export type institutionResponseI = institutionI & {
  id: string;
  ministry: ministryWithId;
};

export type categoryI = {
  name: string;
};
export type categoryWithId = categoryI & {
  id: string;
};

//
export type itemStatusI = "USED" | "NEW" | "BROKEN";

export interface itemCodeStatus {
  code: string;
  status: itemStatusI;
}
export type itemI = itemCodeStatus & {
  productId: string;
};
export type itemWithID = itemI & {
  id: string;
};
export type productI = {
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  institutionId: string;
  items: itemWithID[];
  category: categoryWithId;
};
export type productWithId = productI & {
  id: string;
};

type count = number;
export type itemsByStatus = {
  [statusKey in itemStatusI]: count;
};
export type productTransformedI = productWithId & {
  itemsByStatus: itemsByStatus;
};
//
