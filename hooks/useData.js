import useSWR from "swr";
import axios, { aldaaBarigch } from "services/uilchilgee";

const fetcher = (url, token) =>
  axios(token)
    .post(url)
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useData(token) {
  const { data, mutate, isValidating } = useSWR(
    !!token ? [`/unuudriinIrtsAvya`, token] : null,
    fetcher,
  );

  return { data, mutate, isValidating };
}

export default useData;
