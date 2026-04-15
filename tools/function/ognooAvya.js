import { parseCookies } from "nookies";
import uilchilgee from "services/uilchilgee";

import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (url, token) =>
  uilchilgee(token)
    .get(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);
function ognooAvya(token) {
  const { hitoken } = parseCookies();
  const { data } = useSWR(
    !!token || !!hitoken ? ["/ognooAvya", token || hitoken] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return data;
}

export default ognooAvya;
