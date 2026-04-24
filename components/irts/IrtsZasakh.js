import { DatePicker, Input, message, Select } from "antd";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import dayjs from "utils/dayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { isArray } from "lodash";

function SongogdsonTurulKharakh({
  a,
  i,
  data,
  setTuluv,
  tuluv,
  ognoo,
  tsag,
  setTsag,
  tailbar,
  setTailbar,
  setTuluvSongolt,
  tuluvSongolt,
  salbariinStag,
  tsagKhorwuulegch,
}) {
  function ekhlekhTsagOorchilokh(newValue) {
    // Keep as dayjs object, combine date from ognoo with time from newValue
    const combinedDateTime = dayjs(ognoo)
      .hour(dayjs(newValue).hour())
      .minute(dayjs(newValue).minute())
      .second(dayjs(newValue).second());

    const salbarKhaakhtsag = tsagKhorwuulegch(salbariinStag.khaakhTsag);
    const salbarEkhlekh = tsagKhorwuulegch(salbariinStag.neekhTsag);
    const newValueToo = tsagKhorwuulegch(combinedDateTime.format("HH:mm"));
    const duusakhTsag =
      a === 1
        ? tsagKhorwuulegch(dayjs(tsag.yawsanTsag).format("HH:mm"))
        : a === 2
        ? tsagKhorwuulegch(dayjs(tsag.chuluuDuussan).format("HH:mm"))
        : tsagKhorwuulegch(dayjs(tsag.tasalsanDuussan).format("HH:mm"));

    if (a === 1) {
      if (Number(duusakhTsag) < Number(newValueToo)) {
        tsag.yawsanTsag = combinedDateTime;
      }
      isArray(tuluv) && tuluv[i - 1] === 2
        ? (tsag.chuluuDuussan = combinedDateTime)
        : (tsag.tasalsanDuussan = combinedDateTime);
      setTsag({ ...tsag, irsenTsag: combinedDateTime });
    } else if (Number(salbarEkhlekh) - 1 > Number(newValueToo)) {
      message.warning("Ажил эхлэх цагаас хэтэрсэн байна.");
      return;
    } else if (Number(salbarKhaakhtsag) < Number(newValueToo)) {
      message.warning("Ажил дуусах цагаас хэтэрсэн байна.");
      return;
    } else if (a === 2) {
      if (Number(duusakhTsag) < Number(newValueToo)) {
        tsag.chuluuDuussan = combinedDateTime;
      }
      isArray(tuluv) && tuluv[i - 1] === 1
        ? (tsag.yawsanTsag = combinedDateTime)
        : (tsag.tasalsanDuussan = combinedDateTime);
      setTsag({ ...tsag, chuluuEhelsen: combinedDateTime });
    } else {
      if (Number(duusakhTsag) < Number(newValueToo)) {
        tsag.tasalsanDuussan = combinedDateTime;
      }
      isArray(tuluv) && tuluv[i - 1] === 1
        ? (tsag.yawsanTsag = combinedDateTime)
        : (tsag.chuluuDuussan = combinedDateTime);
      setTsag({ ...tsag, tasalsanEhelsen: combinedDateTime });
    }
  }

  function duusakhTsagOorchilokh(newValue) {
    // Keep as dayjs object, combine date from ognoo with time from newValue
    const combinedDateTime = dayjs(ognoo)
      .hour(dayjs(newValue).hour())
      .minute(dayjs(newValue).minute())
      .second(dayjs(newValue).second());

    const salbarKhaakhtsag = tsagKhorwuulegch(salbariinStag.khaakhTsag);
    const salbarEkhlekh = tsagKhorwuulegch(salbariinStag.neekhTsag);
    const newValueToo = tsagKhorwuulegch(combinedDateTime.format("HH:mm"));
    const ekhlekhTsag =
      a === 1
        ? tsagKhorwuulegch(dayjs(tsag.irsenTsag).format("HH:mm"))
        : a === 2
        ? tsagKhorwuulegch(dayjs(tsag.chuluuEhelsen).format("HH:mm"))
        : tsagKhorwuulegch(dayjs(tsag.tasalsanEhelsen).format("HH:mm"));
    if (Number(ekhlekhTsag) > Number(newValueToo)) {
      message.warn("Эхлэх цагаас бага байх боломжгүй");
      return;
    }

    if (a === 1) {
      isArray(tuluv) && tuluv.length - 1 > i && tuluv[i + 1] === 2
        ? (tsag.chuluuEhelsen = combinedDateTime)
        : tuluv[i + 1] === 3
        ? (tsag.tasalsanEhelsen = combinedDateTime)
        : (tsag.yawsanTsag = combinedDateTime);
      setTsag({ ...tsag, yawsanTsag: combinedDateTime });
      if (Number(salbarKhaakhtsag) < Number(newValueToo)) {
        setTuluv(tuluv.filter((a, index) => index <= i));
        const utga = tuluv.filter((a, index) => index > i);
        utga.forEach((a, i) =>
          tuluvSongolt.push(
            a === 1
              ? { value: 1, ner: "Ажилласан" }
              : a === 2
              ? { value: 2, ner: "Чөлөөтэй" }
              : { value: 3, ner: "Тасалсан" },
          ),
        );
        setTuluvSongolt(tuluvSongolt);
      }
    } else if (Number(salbarEkhlekh) - 1 > Number(newValueToo)) {
      message.warning("Ажил эхлэх цагаас хэтэрсэн байна.");
      return;
    } else if (Number(salbarKhaakhtsag) < Number(newValueToo)) {
      message.warning("Ажил дуусах цагаас хэтэрсэн байна.");
      return;
    } else if (a === 2) {
      isArray(tuluv) && tuluv.length - 1 > i && tuluv[i + 1] === 1
        ? (tsag.irsenTsag = combinedDateTime)
        : tuluv[i + 1] === 3
        ? (tsag.tasalsanEhelsen = combinedDateTime)
        : (tsag.chuluuDuussan = combinedDateTime);
      setTsag({ ...tsag, chuluuDuussan: combinedDateTime });
    } else {
      isArray(tuluv) && tuluv.length - 1 > i && tuluv[i + 1] === 1
        ? (tsag.irsenTsag = combinedDateTime)
        : tuluv[i + 1] === 3
        ? (tsag.chuluuEhelsen = combinedDateTime)
        : (tsag.tasalsanDuussan = combinedDateTime);
      setTsag({ ...tsag, tasalsanDuussan: combinedDateTime });
    }
  }

  return (
    <div
      className="relative w-full space-y-3 rounded-md border bg-white p-2 pb-5 pt-0 shadow-md dark:bg-gray-800"
      key={i}
    >
      <div
        className="absolute -right-1 -top-3 text-xl transition-colors hover:text-red-400"
        onClick={() => {
          setTuluv(tuluv.filter((c, u) => u !== i)),
            setTuluvSongolt([
              ...tuluvSongolt,
              a === 1
                ? { value: 1, ner: "Ажилласан" }
                : a === 2
                ? { value: 2, ner: "Чөлөөтэй" }
                : { value: 3, ner: "Тасалсан" },
            ]);
        }}
      >
        <CloseCircleOutlined />
      </div>
      <div
        className={`flex items-center justify-center gap-1 ${
          a === 1
            ? "text-green-500"
            : a === 2
            ? "text-blue-500"
            : "text-red-500"
        }`}
      >
        -{" "}
        {a === 1 ? (
          <CheckCircleOutlined />
        ) : a === 2 ? (
          <MinusCircleOutlined />
        ) : (
          <CloseCircleOutlined />
        )}
        <div>{a === 1 ? "Ажилласан" : a === 2 ? "Чөлөөтэй" : "Тасалсан"} -</div>
      </div>
      <LocalizationProvider
        className="dark:text-gray-200"
        dateAdapter={AdapterDayjs}
      >
        <div className="flex gap-5">
          <MobileTimePicker
            orientation="landscape"
            ampm={false}
            toolbarTitle={
              <div className="-space-y-5 dark:text-gray-200">
                <p className="absolute text-lg">
                  {a === 1 ? "Ирсэн" : "Эхэлсэн"} цаг
                </p>
                <div className="absolute bottom-0 text-xs">
                  <p className="flex">
                    Салбарын нээх цаг: {salbariinStag.neekhTsag}
                  </p>
                  <p className="flex">
                    Салбарын хаах цаг: {salbariinStag.khaakhTsag}
                  </p>
                </div>
              </div>
            }
            label={
              <div className="truncate text-lg dark:text-gray-200">
                {a === 1 ? "Ирсэн" : "Эхэлсэн"} цаг
              </div>
            }
            value={
              a === 1
                ? tsag.irsenTsag
                : a === 2
                ? tsag.chuluuEhelsen
                : tsag.tasalsanEhelsen
            }
            onChange={(newValue) => {
              ekhlekhTsagOorchilokh(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <MobileTimePicker
            orientation="landscape"
            toolbarTitle={
              <div className="-space-y-5 dark:text-gray-200">
                <p className="absolute text-lg">
                  {a === 1 ? "Гарсан" : "Дууссан"} цаг
                </p>
                <div className="absolute bottom-0 text-xs">
                  <p className="flex">
                    Салбарын нээх цаг: {salbariinStag.neekhTsag}
                  </p>
                  <p className="flex">
                    Салбарын хаах цаг: {salbariinStag.khaakhTsag}
                  </p>
                </div>
              </div>
            }
            ampm={false}
            label={
              <div className="truncate text-lg dark:text-gray-200">
                {a === 1 ? "Гарсан" : "Дууссан"} цаг
              </div>
            }
            value={
              a === 1
                ? tsag.yawsanTsag
                : a === 2
                ? tsag.chuluuDuussan
                : tsag.tasalsanDuussan
            }
            onChange={(newValue) => {
              duusakhTsagOorchilokh(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
      </LocalizationProvider>
      {(a === 2 || a === 3) && (
        <div className="w-full">
          <Input
            value={a === 2 ? tailbar.chuluunii : tailbar.tasalsan}
            onChange={(v) =>
              a === 2
                ? setTailbar({ ...tailbar, chuluunii: v.target.value })
                : setTailbar({ ...tailbar, tasalsan: v.target.value })
            }
            className="w-full"
            placeholder={`${a === 2 ? "Чөлөө авсан" : "Тасалсан"} шалтгаан`}
          />
        </div>
      )}
    </div>
  );
}
function IrtsZasakh(
  {
    data,
    destroy,
    token,
    baiguullaga,
    barilgiinId,
    irtsMutate,
    ajilchdiinGaralt,
    setAjiltniiKhuudaslalt,
  },
  ref,
) {
  const [ognoo, setOgnoo] = useState(dayjs(data.ognoo || new Date()));
  const [tsag, setTsag] = useState({
    irsenTsag: !!data.irsenTsag ? dayjs(data.irsenTsag) : null,
    yawsanTsag: !!data.yawsanTsag ? dayjs(data.yawsanTsag) : null,
    chuluuDuussan: !!data.chuluuniiTurul
      ? dayjs(data.chuluuniiTurul?.duusakhOgnoo)
      : null,
    chuluuEhelsen: !!data.chuluuniiTurul
      ? dayjs(data.chuluuniiTurul?.ekhlekhOgnoo)
      : null,
    tasalsanDuussan: !!data.tasalsanTurul
      ? dayjs(data.tasalsanTurul?.duusakhOgnoo)
      : null,
    tasalsanEhelsen: !!data.tasalsanTurul
      ? dayjs(data.tasalsanTurul?.ekhlekhOgnoo)
      : null,
  });

  const [valueStewerlekh, setValueStewerlekh] = useState(undefined);
  const [ajiltan, setAjiltan] = useState(undefined);
  const [tuluv, setTuluv] = useState([]);
  const [tuluvSongolt, setTuluvSongolt] = useState([]);
  const [salbariinStag, setSalbariinStag] = useState({
    khaakhTsag: "18:00",
    neekhTsag: "09:00",
  });
  const [tailbar, setTailbar] = useState({
    chuluunii: undefined,
    tasalsan: undefined,
  });
  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        if (
          Number(dayjs(ognoo).format("YYYYMMDD")) >
          Number(dayjs(new Date()).format("YYYYMMDD"))
        ) {
          message.warn("Болоогүй өдрийн ирц бүртгэх боломжгүй");
          return;
        }
        if (
          !!tuluv.find((a) => a === 1) &&
          Number(tsagKhorwuulegch(dayjs(tsag.yawsanTsag).format("HH:mm"))) <=
            Number(tsagKhorwuulegch(dayjs(tsag.irsenTsag).format("HH:mm")))
        ) {
          message.warn("Гарсан цаг ирсэн цагаас бага байх боломжгүй");
          return;
        }
        if (
          !!tuluv.find((a) => a === 3) &&
          Number(
            tsagKhorwuulegch(dayjs(tsag.tasalsanDuussan).format("HH:mm")),
          ) <=
            Number(
              tsagKhorwuulegch(dayjs(tsag.tasalsanEhelsen).format("HH:mm")),
            )
        ) {
          message.warn("Эхэлсэн цаг дууссан цагаас бага байх боломжгүй");
          return;
        }
        if (
          !!tuluv.find((a) => a === 2) &&
          Number(tsagKhorwuulegch(dayjs(tsag.chuluuDuussan).format("HH:mm"))) <=
            Number(tsagKhorwuulegch(dayjs(tsag.chuluuEhelsen).format("HH:mm")))
        ) {
          message.warn("Эхэлсэн цаг дууссан цагаас бага байх боломжгүй");
          return;
        }
        if (!!tuluv.find((a) => a === 1) && !tsag.irsenTsag) {
          message.warn("Ажилласан цагийн мэдээлэл дутуу байна");
          return;
        }
        if (
          !!tuluv.find((a) => a === 2) &&
          (!tsag.chuluuEhelsen || !tsag.chuluuDuussan)
        ) {
          message.warn("Чөлөөний цагийн мэдээлэл дутуу байна");
          return;
        }
        if (
          !!tuluv.find((a) => a === 3) &&
          (!tsag.tasalsanDuussan || !tsag.tasalsanDuussan)
        ) {
          message.warn("Тасалсан цагийн мэдээлэл дутуу байна");
          return;
        }
        if (data === "new" && ajiltan === undefined) {
          message.warning("Ажилтан сонгоно уу");
          return;
        }
        if (tuluv.length < 1) {
          message.warning("Мэдээллээ бүрэн оруулна уу");
          return;
        }
        const khadgalakhData = {
          ajiltniiId: ajiltan._id,
          ajiltniiNer: ajiltan.ner,
          ognoo: dayjs(ognoo).format("YYYY-MM-DD 00:00:00"),
          barilgiinId: barilgiinId,
        };
        if (!!tuluv.find((a) => a === 1)) {
          ognooShalgakh(tsag.irsenTsag, "irsenTsag");
          !!tsag.yawsanTsag && ognooShalgakh(tsag.yawsanTsag, "yawsanTsag");
          (khadgalakhData.irsenTsag = dayjs(tsag.irsenTsag).format(
            "YYYY-MM-DD HH:mm:ss",
          )),
            (khadgalakhData.yawsanTsag = tsag.yawsanTsag
              ? dayjs(tsag.yawsanTsag).format("YYYY-MM-DD HH:mm:ss")
              : "");
        }
        if (!!tuluv.find((a) => a === 2)) {
          ognooShalgakh(tsag.chuluuEhelsen, "chuluuDuussan");
          ognooShalgakh(tsag.chuluuDuussan, "chuluuDuussan");
          khadgalakhData.chuluuniiTurul = {
            tailbar: tailbar.chuluunii,
            ekhlekhOgnoo: dayjs(tsag.chuluuEhelsen).format(
              "YYYY-MM-DD HH:mm:ss",
            ),
            duusakhOgnoo: dayjs(tsag.chuluuDuussan).format(
              "YYYY-MM-DD HH:mm:ss",
            ),
          };
        }
        if (!!tuluv.find((a) => a === 3)) {
          ognooShalgakh(tsag.tasalsanEhelsen, "tasalsanEhelsen");
          ognooShalgakh(tsag.tasalsanDuussan, "tasalsanDuussan");
          khadgalakhData.tasalsanTurul = {
            tailbar: tailbar.tasalsan,
            ekhlekhOgnoo: dayjs(tsag.tasalsanEhelsen).format(
              "YYYY-MM-DD HH:mm:ss",
            ),
            duusakhOgnoo: dayjs(tsag.tasalsanDuussan).format(
              "YYYY-MM-DD HH:mm:ss",
            ),
          };
        }
        uilchilgee(token)
          .post("/irtsZasya", khadgalakhData)
          .then(({ data }) => {
            if (data === "Amjilttai") {
              message.success("Амжилттай хадгаллаа");
              destroy();
              irtsMutate();
            }
          })
          .catch((e) => aldaaBarigch(e));
      },
      khaaya() {
        destroy();
      },
    }),
    [data, ajiltan, tsag, ognoo, tailbar, tuluv, barilgiinId],
  );
  function songogdsonTuluvinOgnooSetlekh(
    ekhlekh,
    duusakh,
    oorchlokhDuusakh,
    duusakhSetlekhgueBaih,
  ) {
    if (duusakhSetlekhgueBaih === true) {
      setTsag({ ...tsag, [ekhlekh]: oorchlokhDuusakh, [duusakh]: null });
    } else
      setTsag({
        ...tsag,
        [ekhlekh]: oorchlokhDuusakh,
        [duusakh]: dayjs(
          `${dayjs(ognoo).format("YYYY-MM-DD")} ${salbariinStag.khaakhTsag}:00`,
        ),
      });
  }
  function ognooShalgakh(params, ner) {
    if (
      Number(dayjs(params).format("YYYYMMDD")) !==
      Number(dayjs(ognoo).format("YYYYMMDD"))
    ) {
      tsag[ner] = dayjs(ognoo)
        .hour(dayjs(params).hour())
        .minute(dayjs(params).minute())
        .second(dayjs(params).second());
    }
  }

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
          ognoo: tsagKhorwuulegch(dayjs(data?.irsenTsag).format("HH:mm")),
        });
      } else {
        tuluvSongolt.push({ value: 1, ner: "Ажилласан" });
      }
      setAjiltan({ ner: data.ajiltniiNer, _id: data.ajiltniiId });
      if (!!data.tasalsanTurul) {
        oruulakhData.push({
          dugar: 3,
          ognoo: tsagKhorwuulegch(
            dayjs(data.tasalsanTurul?.ekhlekhOgnoo).format("HH:mm"),
          ),
        });
      } else {
        tuluvSongolt.push({ value: 3, ner: "Тасалсан" });
      }
      if (!!data.chuluuniiTurul) {
        oruulakhData.push({
          dugar: 2,
          ognoo: tsagKhorwuulegch(
            dayjs(data.tasalsanTurul?.ekhlekhOgnoo).format("HH:mm"),
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
    uilchilgee(token)
      .post("/ajillakhTsagAvya", {
        ognoo: dayjs(ognoo).format("YYYY-MM-DD 00:00:00"),
        barilgiinId: barilgiinId,
      })
      .then(({ data }) => {
        setSalbariinStag(data);
      });
  }, [ognoo]);
  return (
    <div className=" flex flex-col justify-center gap-5 px-10 ">
      {data === "new" && (
        <div className="flex items-center">
          <Select
            onSearch={(search) =>
              setAjiltniiKhuudaslalt((a) => ({ ...a, search }))
            }
            showSearch
            allowClear
            onChange={(v) =>
              setAjiltan(ajilchdiinGaralt?.jagsaalt.find((a) => a._id === v))
            }
            className=" w-full"
            placeholder="Ажилтан сонгох"
          >
            {ajilchdiinGaralt?.jagsaalt.map((a, i) => {
              return (
                <Select.Option key={i} value={a._id}>
                  {a.ovog.charAt(0)}.{a.ner}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      )}
      <DatePicker
        allowClear={false}
        disabled={data !== "new"}
        value={ognoo}
        onChange={(v) => setOgnoo(v)}
        className="w-full"
        placeholder="Огноо"
      />
      <Select
        value={valueStewerlekh}
        onChange={(v) => {
          setTuluv([...tuluv, v]);
          setTuluvSongolt(tuluvSongolt.filter((a) => a.value !== v));
          setValueStewerlekh(null);
          tuluv.length > 0
            ? v === 1
              ? tuluv[tuluv.length - 1] === 2
                ? songogdsonTuluvinOgnooSetlekh(
                    "irsenTsag",
                    "yawsanTsag",
                    tsag.chuluuDuussan,
                  )
                : tuluv[tuluv.length - 1] === 3 &&
                  songogdsonTuluvinOgnooSetlekh(
                    "irsenTsag",
                    "yawsanTsag",
                    tsag.tasalsanDuussan,
                  )
              : v === 2
              ? tuluv[tuluv.length - 1] === 1
                ? songogdsonTuluvinOgnooSetlekh(
                    "chuluuEhelsen",
                    "chuluuDuussan",
                    tsag.yawsanTsag,
                  )
                : tuluv[tuluv.length - 1] === 3 &&
                  songogdsonTuluvinOgnooSetlekh(
                    "chuluuEhelsen",
                    "chuluuDuussan",
                    tsag.tasalsanDuussan,
                  )
              : v === 3 && tuluv[tuluv.length - 1] === 2
              ? songogdsonTuluvinOgnooSetlekh(
                  "tasalsanEhelsen",
                  "tasalsanDuussan",
                  tsag.chuluuDuussan,
                )
              : tuluv[tuluv.length - 1] === 1 &&
                songogdsonTuluvinOgnooSetlekh(
                  "tasalsanEhelsen",
                  "tasalsanDuussan",
                  tsag.yawsanTsag,
                )
            : v === 1
            ? songogdsonTuluvinOgnooSetlekh(
                "irsenTsag",
                "yawsanTsag",
                dayjs(
                  `${dayjs(ognoo).format("YYYY-MM-DD")} ${
                    salbariinStag.neekhTsag
                  }:00`,
                ),
                true,
              )
            : v === 2
            ? songogdsonTuluvinOgnooSetlekh(
                "chuluuEhelsen",
                "chuluuDuussan",
                dayjs(
                  `${dayjs(ognoo).format("YYYY-MM-DD")} ${
                    salbariinStag.neekhTsag
                  }:00`,
                ),
              )
            : v === 3 &&
              songogdsonTuluvinOgnooSetlekh(
                "tasalsanEhelsen",
                "tasalsanDuussan",
                dayjs(
                  `${dayjs(ognoo).format("YYYY-MM-DD")} ${
                    salbariinStag.neekhTsag
                  }:00`,
                ),
              );
        }}
        className=" w-full"
        placeholder="Ирц төлөвөөр оруулах"
      >
        {tuluvSongolt.map((a, i) => {
          return (
            <Select.Option key={i} value={a.value}>
              <div
                className={
                  a.value === 1
                    ? "text-green-500"
                    : a.value === 2
                    ? "text-blue-500"
                    : "text-red-500"
                }
              >
                {a.ner}
              </div>
            </Select.Option>
          );
        })}
      </Select>
      <div
        className="w-full overflow-y-auto rounded-xl border bg-gray-50 p-1 dark:bg-gray-800 dark:text-gray-200"
        style={{ maxHeight: "calc( 100vh - 30rem )" }}
      >
        {tuluv.length > 0 ? (
          <div className="flex  w-full flex-col gap-2 p-2 ">
            {tuluv.map((a, i) => {
              return (
                <SongogdsonTurulKharakh
                  tsagKhorwuulegch={tsagKhorwuulegch}
                  salbariinStag={salbariinStag}
                  setTuluvSongolt={setTuluvSongolt}
                  tuluvSongolt={tuluvSongolt}
                  tailbar={tailbar}
                  setTailbar={setTailbar}
                  tsag={tsag}
                  setTsag={setTsag}
                  ognoo={ognoo}
                  tuluv={tuluv}
                  setTuluv={setTuluv}
                  data={data}
                  a={a}
                  i={i}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex w-full justify-center p-5 text-gray-400">
            Ирц төлөвөөр нь оруулна уу.
          </div>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(IrtsZasakh);
