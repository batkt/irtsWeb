import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useAuth } from "services/auth";
import { url } from "services/uilchilgee";
import KhuviinMedeelel from "components/pageComponents/tokhirgoo/KhuviinMedeelel";
import NuutsUgSolikh from "components/pageComponents/tokhirgoo/NuutsUgSolikh";
import UndsenMedeelel from "components/pageComponents/tokhirgoo/UndsenMedeelel";

import { useMemo, useState } from "react";

import {
  BuildFilled,
  DatabaseOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import NevtreltiinTuukh from "components/pageComponents/tokhirgoo/NevtreltiinTuukh";
import { useTranslation } from "react-i18next";
import { TbLego, TbTicket } from "react-icons/tb";

function AjiltanBurtgel({ token }) {
  const { t } = useTranslation();
  const {
    ajiltan,
    ajiltanMutate,
    baiguullaga,
    barilgiinId,
    baiguullagaMutate,
  } = useAuth();
  const [songogdsonTsonkhniiIndex, setSongogdsonTsonkhniiIndex] = useState(0);

  const tokhirgoo = useMemo(() => {
    if (ajiltan?.erkh === "Admin")
      return [
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-settings mr-2 h-4 w-4"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ),
          text: "Үндсэн тохиргоо",
          tsonkh: UndsenMedeelel,
        },
        {
          icon: (
            <div className="mr-2 flex items-center justify-center text-base">
              <HistoryOutlined />
            </div>
          ),
          text: "Нэвтрэлтийн түүх",
          tsonkh: NevtreltiinTuukh,
        },
      ];
    else
      return [
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-activity mr-2 h-4 w-4"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          ),
          text: "Хувийн мэдээлэл",
          tsonkh: KhuviinMedeelel,
        },
        {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-lock mr-2 h-4 w-4"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          ),
          text: "Нууц үг солих",
          tsonkh: NuutsUgSolikh,
        },
      ];
  }, [ajiltan, baiguullaga, barilgiinId]);

  const Tsonkh = useMemo(() => {
    return tokhirgoo[songogdsonTsonkhniiIndex]?.tsonkh;
  }, [tokhirgoo, songogdsonTsonkhniiIndex]);

  return (
    <Admin
      title="Тохиргоо"
      khuudasniiNer="tokhirgoo"
      className="grid grid-cols-12 gap-6 px-4 pb-5"
    >
      <div className="col-span-12 mt-5 flex flex-col-reverse lg:col-span-3 lg:block xl:col-span-3">
        <div className="box mt-5 lg:mt-0">
          <div className="relative flex items-center p-5">
            <div className="image-fit h-12 w-12">
              <img
                alt={ajiltan?.ner}
                src={
                  ajiltan?.zurgiinNer
                    ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                    : ((ajiltan?.register?.replace(/^\D+/g, "") % 100) / 10) %
                        2 <
                      1
                    ? "/profileFemale.svg"
                    : "/profile.svg"
                }
                className="h-12 w-12 rounded-full ring-2 ring-green-600 ring-opacity-50"
              />
            </div>
            <div className="ml-4 mr-auto">
              <div className="text-base font-medium">{`${ajiltan?.ovog} ${ajiltan?.ner}`}</div>
              <div className="text-gray-600">{ajiltan?.albanTushaal}</div>
            </div>
          </div>
          <div className="dark:border-dark-5 border-t border-gray-200 p-5 text-green-600">
            {tokhirgoo?.map((mur, index) => (
              <div
                className={`mt-5 flex cursor-pointer items-center ${
                  index === songogdsonTsonkhniiIndex
                    ? "text-yellow-500 dark:text-white"
                    : ""
                } `}
                onClick={() => setSongogdsonTsonkhniiIndex(index)}
              >
                {mur.icon} {t(mur.text)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-12 grid grid-cols-12 gap-5 md:col-span-12 lg:col-span-9">
        {ajiltan && (
          <Tsonkh
            {...{
              ajiltan,
              ajiltanMutate,
              baiguullaga,
              barilgiinId,
              baiguullagaMutate,
              token,
              setSongogdsonTsonkhniiIndex,
            }}
          />
        )}
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
