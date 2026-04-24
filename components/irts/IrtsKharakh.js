import { DatePicker, message, Select } from "antd";
import React, { useEffect, useImperativeHandle, useState } from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { toInteger } from "lodash";

function IrtsZasakh({ data, destroy, token, barilgiinId }, ref) {
  const [ognoo, setOgnoo] = useState(moment(data.ognoo || new Date()));
  const [tsag, setTsag] = useState({
    irsenTsag: moment(!!data.irsenTsag ? data.irsenTsag : ""),
    yawsanTsag: moment(!!data.yawsanTsag ? data.yawsanTsag : ""),
    chuluuDuussan: moment(
      !!data.chuluuniiTurul ? data.chuluuniiTurul?.duusakhOgnoo : "",
    ),
    chuluuEhelsen: moment(
      !!data.chuluuniiTurul ? data.chuluuniiTurul?.ekhlekhOgnoo : "",
    ),
    tasalsanDuussan: moment(
      !!data.tasalsanTurul ? data.tasalsanTurul?.duusakhOgnoo : "",
    ),
    tasalsanEhelsen: moment(
      !!data.tasalsanTurul ? data.tasalsanTurul?.ekhlekhOgnoo : "",
    ),
  });

  const [valueStewerlekh, setValueStewerlekh] = useState(undefined);
  const [ajiltan, setAjiltan] = useState(undefined);
  const [tuluv, setTuluv] = useState([]);
  const [tuluvSongolt, setTuluvSongolt] = useState([]);
  const [salbariinStag, setSalbariinStag] = useState({
    khaakhTsag: moment(ognoo).format("YYYY-MM-DD 18:00:00"),
    neekhTsag: moment(ognoo).format("YYYY-MM-DD 09:00:00"),
  });
  const [tailbar, setTailbar] = useState({
    chuluunii: undefined,
    tasalsan: undefined,
  });
  useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    [],
  );

  function tsagKhorwuulegch(params) {
    const data =
      params.charAt(0) + params.charAt(1) + params.charAt(3) + params.charAt(4);
    return data;
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);
  useEffect(() => {
    const oruulakhData = [];
    if (data === "new") {
      setTuluvSongolt([
        { value: 1, ner: "Ажилласан" },
        { value: 2, ner: "Чөлөөтэй" },
        { value: 3, ner: "Тасалсан" },
      ]);
    } else {
      if (!!data.irsenTsag) {
        oruulakhData.push({
          dugar: 1,
          ognoo: tsagKhorwuulegch(moment(data?.irsenTsag).format("HH:mm")),
        });
      } else {
        tuluvSongolt.push({ value: 1, ner: "Ажилласан" });
      }
      setAjiltan({ ner: data.ajiltniiNer, _id: data.ajiltniiId });
      if (!!data.tasalsanTurul) {
        oruulakhData.push({
          dugar: 3,
          ognoo: tsagKhorwuulegch(
            moment(data.tasalsanTurul?.ekhlekhOgnoo).format("HH:mm"),
          ),
        });
      } else {
        tuluvSongolt.push({ value: 3, ner: "Тасалсан" });
      }
      if (!!data.chuluuniiTurul) {
        oruulakhData.push({
          dugar: 2,
          ognoo: tsagKhorwuulegch(
            moment(data.tasalsanTurul?.ekhlekhOgnoo).format("HH:mm"),
          ),
        });
      } else {
        tuluvSongolt.push({ value: 2, ner: "Чөлөөтэй" });
      }

      if (oruulakhData.length > 0) {
        setTuluv(
          oruulakhData
            .sort((a, b) => a.ognoo - b.ognoo)
            .map((a) => {
              return a.dugar;
            }),
        );
      }
      setTuluvSongolt(tuluvSongolt);
      setTailbar({
        tasalsan: !!data.tasalsanTurul ? data.tasalsanTurul.tailbar : undefined,
        chuluunii: !!data.chuluuniiTurul
          ? data.chuluuniiTurul.tailbar
          : undefined,
      });
    }
  }, []);

  useEffect(() => {
    if (data === "new") {
      setTsag({
        irsenTsag: moment(ognoo).format(
          `YYYY-MM-DD ${salbariinStag.neekhTsag}:00`,
        ),
        yawsanTsag: moment(ognoo).format(
          `YYYY-MM-DD ${salbariinStag.khaakhTsag}:00`,
        ),
        chuluuDuussan: moment(ognoo).format(`YYYY-MM-DD 00:00:00`),
        chuluuEhelsen: moment(ognoo).format(`YYYY-MM-DD 00:00:00`),
        tasalsanDuussan: moment(ognoo).format(`YYYY-MM-DD 00:00:00`),
        tasalsanEhelsen: moment(ognoo).format(`YYYY-MM-DD 00:00:00`),
      });
    }
    uilchilgee(token)
      .post("/ajillakhTsagAvya", {
        ognoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
        barilgiinId: barilgiinId,
      })
      .then(({ data }) => {
        setSalbariinStag(data);
      });
  }, [ognoo]);
  return (
    <div className=" flex flex-col justify-center px-4 ">
      <div className="flex w-full justify-between border-b px-3 py-2">
        <div className="dark:text-gray-200">Төлөв</div>
        {
          <div
            className={`flex cursor-pointer items-center gap-2 font-medium ${
              data.tuluv === "kheviin"
                ? "text-green-500"
                : data.tuluv === "khotsorson"
                ? "text-pink-500"
                : data.tuluv === "chuluu"
                ? "text-blue-500"
                : data.tuluv === "tasalsan"
                ? "text-red-500"
                : data.tuluv === "hagas"
                ? "text-yellow-500"
                : "text-gray-400"
            }`}
          >
            {data.tuluv === "kheviin" ? (
              <CheckCircleOutlined />
            ) : data.tuluv === "khotsorson" ? (
              <ExclamationCircleOutlined />
            ) : data.tuluv === "chuluu" ? (
              <MinusCircleOutlined />
            ) : data.tuluv === "tasalsan" ? (
              <CloseCircleOutlined />
            ) : data.tuluv === "hagas" ? (
              <img
                src="/halfCircle.svg"
                style={{ height: "15px", width: "15px" }}
              />
            ) : (
              <QuestionCircleOutlined />
            )}
            {data.tuluv === "kheviin"
              ? "Мундаг"
              : data.tuluv === "khotsorson"
              ? "Хоцорсон"
              : data.tuluv === "chuluu"
              ? "Чөлөөтэй"
              : data.tuluv === "tasalsan"
              ? "Тасалсан"
              : data.tuluv === "hagas"
              ? "Хагас"
              : "Тодорхойгүй"}
          </div>
        }
      </div>
      <div
        className={`flex w-full items-center justify-between border-b bg-opacity-5 px-3 py-2 ${
          data.tuluv === "kheviin"
            ? "bg-green-500"
            : data.tuluv === "khotsorson"
            ? "bg-pink-500"
            : data.tuluv === "chuluu"
            ? "bg-blue-500"
            : data.tuluv === "tasalsan"
            ? "bg-red-500"
            : data.tuluv === "hagas"
            ? "bg-yellow-500"
            : "bg-gray-400"
        }`}
      >
        <div className="dark:text-gray-200">Огноо</div>
        <div className="dark:text-gray-200">
          {moment(data.ognoo).format("YYYY-MM-DD")}
        </div>
      </div>
      {data.irsenTsag && data.yawsanTsag && (
        <div className="flex w-full justify-between border-b px-3 py-2">
          <div className="dark:text-gray-200">Ирсэн цаг</div>
          <div className="dark:text-gray-200">
            {moment(data.irsenTsag).format("HH:mm:ss")}
          </div>
        </div>
      )}
      {data.irsenTsag && data.yawsanTsag && (
        <div
          className={`flex w-full items-center justify-between border-b bg-opacity-5 px-3 py-2 ${
            data.tuluv === "kheviin"
              ? "bg-green-500"
              : data.tuluv === "khotsorson"
              ? "bg-pink-500"
              : data.tuluv === "chuluu"
              ? "bg-blue-500"
              : data.tuluv === "tasalsan"
              ? "bg-red-500"
              : data.tuluv === "hagas"
              ? "bg-yellow-500"
              : "bg-gray-400"
          }`}
        >
          <div className="dark:text-gray-200">Гарсан цаг</div>
          <div className="dark:text-gray-200">
            {moment(data.yawsanTsag).format("HH:mm:ss")}
          </div>
        </div>
      )}
      <div className="flex w-full justify-between border-b px-3 py-2">
        <div className="dark:text-gray-200">Хоцорсон цаг</div>
        <div className="dark:text-gray-200">
          {data?.khotsorsonMinut > 0 ? (
            <div>
              {!!data.khotsorsonMinut && data.khotsorsonMinut / 60 < 10 && "0"}
              {!!data.khotsorsonMinut && toInteger(data.khotsorsonMinut / 60)}:
              {!!data.khotsorsonMinut && data.khotsorsonMinut % 60 < 10 && "0"}
              {!!data.khotsorsonMinut && data.khotsorsonMinut % 60}{" "}
            </div>
          ) : (
            <div>--:--</div>
          )}
        </div>
      </div>
      <div
        className={`flex w-full items-center justify-between border-b bg-opacity-5 px-3 py-2 ${
          data.tuluv === "kheviin"
            ? "bg-green-500"
            : data.tuluv === "khotsorson"
            ? "bg-pink-500"
            : data.tuluv === "chuluu"
            ? "bg-blue-500"
            : data.tuluv === "tasalsan"
            ? "bg-red-500"
            : data.tuluv === "hagas"
            ? "bg-yellow-500"
            : "bg-gray-400"
        }`}
      >
        <div className="dark:text-gray-200">Ажилласан цаг</div>
        {data.ajillasanMinut > 0 ? (
          <div className="dark:text-gray-200">
            {!!data.ajillasanMinut && data.ajillasanMinut / 60 < 10 && "0"}
            {!!data.ajillasanMinut && toInteger(data.ajillasanMinut / 60)}
            {!data.ajillasanMinut && "--"}:
            {!!data.ajillasanMinut && data.ajillasanMinut % 60 < 10 && "0"}
            {!!data.ajillasanMinut && data.ajillasanMinut % 60}
            {!data.ajillasanMinut && "--"}
          </div>
        ) : (
          <div>--:--</div>
        )}
      </div>
      {!!data.tasalsanTurul && (
        <div className="flex w-full justify-between border-b px-3 py-2">
          <div className="dark:text-gray-200">Тасалсан цаг</div>
          <div className="dark:text-gray-200">
            {moment(data.tasalsanTurul.ekhlekhOgnoo).format("HH:mm")} -{" "}
            {moment(data.tasalsanTurul.duusakhOgnoo).format("HH:mm")}
          </div>
        </div>
      )}
      {!!data.chuluuniiTurul && (
        <div
          className={
            !!data.tasalsanTurul
              ? `flex w-full items-center justify-between border-b bg-opacity-5 px-3 py-2 ${
                  data.tuluv === "kheviin"
                    ? "bg-green-500"
                    : data.tuluv === "khotsorson"
                    ? "bg-pink-500"
                    : data.tuluv === "chuluu"
                    ? "bg-blue-500"
                    : data.tuluv === "tasalsan"
                    ? "bg-red-500"
                    : data.tuluv === "hagas"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`
              : "flex w-full justify-between border-b px-3 py-2"
          }
        >
          <div className="dark:text-gray-200">Чөлөөтэй цаг</div>
          <div className="dark:text-gray-200">
            {moment(data.chuluuniiTurul.ekhlekhOgnoo).format("HH:mm")} -{" "}
            {moment(data.chuluuniiTurul.duusakhOgnoo).format("HH:mm")}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(IrtsZasakh);
