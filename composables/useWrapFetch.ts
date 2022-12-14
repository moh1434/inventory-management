import { FetchOptions } from "ohmyfetch";
import { tryCatch } from "~~/helpers/tryCatch";
import { alertsTypes, useAlerts } from "./useAlerts";
export async function useWrapFetch<response>(
  url: string,
  opts: FetchOptions = {},
  alertTypeWhenError: alertsTypes | null = "error"
) {
  if (!opts["headers"]) opts["headers"] = {};
  // const authHeader = `Bearer ${useToken().token.value}`;
  opts.headers = Object.assign(opts.headers, {
    ...(useRequestHeaders(["cookie"]) as HeadersInit),
    // "Content-Type": "application/json", //if you return this header, you will not be able to upload image in FormOroducts.vue onCreateProductClick()
  });

  //
  const config = useRuntimeConfig();
  if (!opts.baseURL) {
    opts.baseURL = config.public.baseURL;
  }
  opts.credentials = "include";

  const theResponse = await tryCatch<response>(async () => $fetch(url, opts));
  if (alertTypeWhenError && theResponse.error) {
    // if (theResponse.error.response.status == 401) {
    //TODO: uncomment this? it depends on the backend

    // }
    const { setAlert } = useAlerts();
    const messages: string[] | string | undefined =
      theResponse?.error?.response?._data?.message;
    if (Array.isArray(messages)) {
      messages.forEach((msg: string) => {
        setAlert(msg, alertTypeWhenError);
      });
    } else if (typeof messages == "string") {
      setAlert(messages, alertTypeWhenError);
    } else {
      setAlert(theResponse.error, alertTypeWhenError);
    }
  }
  return theResponse;
}
