export type UserI = {
  id: string;
  username: string;
  role: "USER" | "ADMIN";
  logo: string;
  institution_id: number;
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

export type ministryI = {
  id: string;
  name: string;
};

export type institutionResponseI = institutionI & {
  id: string;
  ministry: ministryI;
};

export type categoryI = {
  name: string;
};
export type categoryWithId = categoryI & {
  id: string;
};
