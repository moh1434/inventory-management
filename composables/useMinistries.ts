import { ministryWithId } from "~~/types";

export function useMinistries() {
  const ministries = useState<ministryWithId[]>("ministry", () => []);

  if (ministries.value.length == 0) {
    useWrapFetch<ministryWithId[]>("ministry").then(({ result, error }) => {
      if (error) {
        return;
      }
      ministries.value = result ?? [];
    });
  }

  return { ministries };
}
