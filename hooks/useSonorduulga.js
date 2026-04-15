import { notification } from "antd";
import axios, { socket, aldaaBarigch } from "services/uilchilgee";
import useSWR from "swr";
import Sonorduulga from "components/sonorduulga";
import { useEffect, useState } from "react";
import { useAuth } from "services/auth";

const fetcher = (
  url,
  token,
  baiguullagiinId,
  salbariinId,
  ajiltniiId,
  { jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      params: {
        ...khuudaslalt,
        query: { baiguullagiinId, salbariinId ,
          $or :[
            {baiguullagiinId, salbariinId
            },
            {
               $and : [
                  {
                   khuleenAvagchiinId : ajiltniiId
                  },
                  {
                     turul : {
                        $in : ["daalgavar","setgegdel"]
                     }
                  }]
            }],},
        order: { ognoo: -1 },
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

const tooFetcher = (
  url,
  token,
  baiguullagiinId,
  { jagsaalt, ...khuudaslalt }
) =>
  axios(token)
    .get(url, {
      params: {
        baiguullagiinId,
      },
    })
    .then((res) => res.data)
    .catch(aldaaBarigch);

var sonorduulgaId = null;

function useSonorduulga(token, ajiltanId, salbariinId) {
  const { baiguullaga, ajiltan } = useAuth();

  const [khuudaslalt, setKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 20,
    jagsaalt: [],
  });
  const { data, mutate } = useSWR(
    !!token && !!baiguullaga?._id
      ? ["/sonorduulga", token, baiguullaga?._id, salbariinId, ajiltan?._id, khuudaslalt]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  const too = useSWR(
    !!token && !!baiguullaga?._id
      ? [
        "/sonorduulgaKharaaguiTooAvya",
        token,
        baiguullaga?._id,
        salbariinId,
        khuudaslalt,
      ]
      : null,
    tooFetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (baiguullaga?._id) {
      socket().on(`baiguullaga${baiguullaga?._id}`, (sonorduulga) => {
        const key = `${Math.floor(Math.random() * 100)}+${Date.now()}`;
        mutate();
        too.mutate();
        if (!!sonorduulga && (!!sonorduulga?.turul || !!sonorduulga?.notifTurul) && sonorduulgaId !== sonorduulga?._id && (ajiltan?.erkh === "Admin" || !!ajiltan?.salbaruud?.find(a=> a === sonorduulga?.salbariinId))) {
          function onClose() {
            notification.close(key);
          }
          sonorduulgaId = sonorduulga?._id;
          if (sonorduulga?.turul === "daalgavar" || sonorduulga?.turul === "setgegdel") {
            if (ajiltan._id === sonorduulga.khuleenAvagchiinId) {
              notification.open({
                key: key,
                message: (
                  <Sonorduulga token={token} ajiltan={ajiltan} {...sonorduulga} onClose={onClose} />
                ),
                closeIcon: () => null,
                duration: 100000,
              });
            }
          } else {
            notification.open({
              key: key,
              message: (
                <Sonorduulga token={token} ajiltan={ajiltan} {...sonorduulga} onClose={onClose} />
              ),
              closeIcon: () => null,
              duration: 100000,
            });
          }
        }
      });
    }
    return () => {
      socket().off(`baiguullaga${baiguullaga?._id}`);
    };
  }, [baiguullaga]);
    useEffect(()=>{
        if(!!ajiltanId)
            socket().on(`ajiltan${ajiltanId}`, (res) => {
                if(res.type==='logout'&&res?.ip){
                    message.warn(''+res.ip+' IP-тай төхөөрөмжөөс давхар нэвтэрсэн тул таны холболт саллаа.', 5);
                    setTimeout(()=>{
                        window.location.href = "/";
                    },4000)
                }
            });
        return () => {
            socket().off(`ajiltan${ajiltanId}`);
        };
    },[ajiltanId]);

  function refresh() {
    setKhuudaslalt({
      ...{
        khuudasniiDugaar: 1,
        khuudasniiKhemjee: 20,
        jagsaalt: [],
      },
    });
  }

  return {
    setKhuudaslalt,
    sonorduulga: data,
    kharaaguiToo: too.data,
    sonorduulgaMutate: mutate,
    jagsaalt: khuudaslalt.jagsaalt,
    refresh,
  };
}

export default useSonorduulga;
