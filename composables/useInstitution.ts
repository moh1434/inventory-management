import { institutionWithIdI } from "~~/types";

export function useInstitutions() {
  const institutions = useState<institutionWithIdI[]>(
    "getInstitution",
    () => []
  );

  if (institutions.value.length == 0) {
    useWrapFetch<institutionWithIdI[]>("institution").then(
      ({ result, error }) => {
        if (error) {
          return;
        }
        institutions.value = result ?? [];
      }
    );
  }

  return { institutions };
}
