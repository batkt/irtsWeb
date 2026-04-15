import { useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";

const fetcher = (
  url,
  token,
  query,
  { search, jagsaalt, ...khuudaslalt },
  order
) =>
  axios(token)
    .get(url, {
      params: {
        query: {
          $or: [
            { ajiltniiNer: { $regex: search, $options: "i" } },
            { ajiltniiNer: { $regex: search, $options: "i" } },
          ],
          ...query,
        },
        order,
        ...khuudaslalt,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

function useIrts(token, query, order) {
  const [khuudaslalt, setIrtsiinKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token ? ["/irts", token, query, khuudaslalt, order] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    setIrtsiinKhuudaslalt,
    irtsniiGaralt: data,
    irtsMutate: mutate,
  };
}

export default useIrts;
