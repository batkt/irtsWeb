import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Pagination,
  Popover,
  Select,
  Tooltip,
  Table,
} from "antd";
import {
  CaretUpOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  FileExcelOutlined,
  PlusOutlined,
  PrinterOutlined,
  StarOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import IrtsZasakh from "components/irts/IrtsZasakh";
import moment from "moment";
import dayjs from "utils/dayjs";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { useAuth } from "services/auth";
import useIrts from "hooks/useIrts";
import { isArray, toInteger } from "lodash";
import { url } from "services/uilchilgee";
import useOrder from "tools/function/useOrder";
import { useReactToPrint } from "react-to-print";
import IrtsKharakh from "components/irts/IrtsKharakh";
import BaganiinSongolt from "components/table/BaganiinSongolt";
import { useTranslation } from "react-i18next";

function TableGarchig({ mur, i, onChangeTable }) {
  const [sort, setSort] = useState(undefined);
  useEffect(() => {
    onChangeTable(undefined, undefined, { field: mur.field, order: sort });
  }, [sort]);
  return (
    <th
      key={i}
      style={{ minWidth: mur.minWidth }}
      onClick={() => {
        mur.field !== "noSort" &&
          setSort(
            sort === undefined
              ? "descend"
              : sort === "descend"
              ? "ascend"
              : undefined,
          );
      }}
      className={`px-4 py-3 ${mur.full} select-none ${
        mur?.mobileHide && "hidden md:table-cell"
      } relative ${
        mur.field !== "noSort" && "cursor-pointer hover:bg-blue-200"
      } transition-colors dark:hover:bg-gray-900`}
    >
      {mur.name}{" "}
      <div
        className={`absolute right-2 top-0 flex h-full items-center text-black transition-opacity dark:text-gray-300 ${
          sort === undefined && "text-opacity-30 dark:text-opacity-30"
        }`}
      >
        {mur.field !== "noSort" && (
          <CaretUpOutlined
            className="transition-all"
            style={
              sort === "descend"
                ? { rotate: "180deg" }
                : sort === "ascend"
                ? { rotate: "360deg" }
                : { rotate: "90deg" }
            }
          />
        )}
      </div>
    </th>
  );
}

function jagsaalt({ token }) {
  const { baiguullaga, barilgiinId } = useAuth();
  const printRef = React.useRef(null);
  const { order, onChangeTable } = useOrder({ ognoo: -1 });
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()]);
  const [shuult, setShuult] = useState({
    ajiltniiId: undefined,
    tuluv: undefined,
  });
  const erstRef = React.useRef(null);
  const erstKharakhRef = React.useRef(null);
  const [shineBagana, setShineBagana] = useState([]);
  const { t } = useTranslation();

  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    if (!ekhlekhOgnoo) {
      const today = dayjs();
      setEkhlekhOgnoo([today, today]);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const query = useMemo(() => {
    return {
      ajiltniiId: shuult.ajiltniiId,
      ognoo: isArray(ekhlekhOgnoo)
        ? {
            $gte: ekhlekhOgnoo[0].format("YYYY-MM-DD 00:00:00"),
            $lte: ekhlekhOgnoo[1].format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      barilgiinId: barilgiinId,
      tuluv: shuult.tuluv === "todorhoigue" ? { $exists: false } : shuult.tuluv,
    };
  }, [barilgiinId, ekhlekhOgnoo, shuult]);

  const { ajilchdiinGaralt, setAjiltniiKhuudaslalt } = useAjiltniiJagsaalt(
    token,
    baiguullaga?._id,
  );
  const { setIrtsiinKhuudaslalt, irtsniiGaralt, irtsMutate } = useIrts(
    token,
    query,
    order,
  );

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        width: "2.5rem",
        align: "center",
        fixed: "left",
        render: (text, record, index) => index + 1,
      },
      {
        align: "center",
        fixed: "left",
        title: "Ажилтан",
        dataIndex: "ajiltniiNer",
        minWidth: "10rem",
      },
      {
        title: t("Огноо"),
        dataIndex: "ognoo",
        ellipsis: true,
        width: "1.5rem",
        align: "center",
        render(ognoo) {
          return moment(ognoo).format("YYYY-MM-DD");
        },
      },
      {
        title: "Ирсэн",
        dataIndex: "irsenTsag",
        ellipsis: true,
        align: "center",
        render: (irsenTsag) => {
          return !!irsenTsag ? (
            moment(irsenTsag).format("HH:mm:ss")
          ) : (
            <span style={{ fontFamily: "monospace" }}>--:--:--</span>
          );
        },
      },
      {
        title: "Гарсан",
        dataIndex: "yawsanTsag",
        ellipsis: true,
        align: "center",
        render: (yawsanTsag) => {
          return yawsanTsag ? (
            moment(yawsanTsag).format("HH:mm:ss")
          ) : (
            <span style={{ fontFamily: "monospace" }}>--:--:--</span>
          );
        },
      },
      {
        title: "Гарсан (Ц)",
        dataIndex: "tsainiiGarsanTsag",
        ellipsis: true,
        align: "center",
        render: (tsainiiGarsanTsag) => {
          return !!tsainiiGarsanTsag ? (
            moment(tsainiiGarsanTsag).format("HH:mm:ss")
          ) : (
            <span style={{ fontFamily: "monospace" }}>--:--:--</span>
          );
        },
      },
      {
        title: "Ирсэн цаг (Ц)",
        dataIndex: "tsainiiIrsenTsag",
        ellipsis: true,
        align: "center",
        render: (tsainiiIrsenTsag) => {
          return !!tsainiiIrsenTsag ? (
            moment(tsainiiIrsenTsag).format("HH:mm:ss")
          ) : (
            <span style={{ fontFamily: "monospace" }}>--:--:--</span>
          );
        },
      },
      {
        title: "Ажилласан",
        dataIndex: "ajillasanMinut",
        ellipsis: true,
        align: "center",
        render: (ajillasanMinut) => {
          return ajillasanMinut > 0 ? (
            `${!!ajillasanMinut && ajillasanMinut / 60 < 10 ? "0" : ""}${
              !!ajillasanMinut && toInteger(ajillasanMinut / 60)
            }:${!!ajillasanMinut && ajillasanMinut % 60 < 10 ? "0" : ""}${
              !!ajillasanMinut && ajillasanMinut % 60
            }`
          ) : (
            <span style={{ fontFamily: "monospace" }}>--:--</span>
          );
        },
      },
      {
        title: "Хоцорсон",
        dataIndex: "khotsorsonMinut",
        ellipsis: true,
        align: "center",
        render: (khotsorsonMinut) => {
          return khotsorsonMinut > 0 ? (
            `${!!khotsorsonMinut && khotsorsonMinut / 60 < 10 ? "0" : ""}${
              !!khotsorsonMinut && toInteger(khotsorsonMinut / 60)
            }:${!!khotsorsonMinut && khotsorsonMinut % 60 < 10 ? "0" : ""}${
              !!khotsorsonMinut && khotsorsonMinut % 60
            }`
          ) : (
            <span style={{ fontFamily: "monospace" }}>--:--</span>
          );
        },
      },
      {
        title: "Хоцорсон (Ц)",
        dataIndex: "khotsorsonMinutTsainiiTsag",
        ellipsis: true,
        align: "center",
        render: (khotsorsonMinutTsainiiTsag) => {
          return khotsorsonMinutTsainiiTsag > 0 ? (
            `${
              !!khotsorsonMinutTsainiiTsag &&
              khotsorsonMinutTsainiiTsag / 60 < 10
                ? "0"
                : ""
            }${
              !!khotsorsonMinutTsainiiTsag &&
              toInteger(khotsorsonMinutTsainiiTsag / 60)
            }:${
              !!khotsorsonMinutTsainiiTsag &&
              khotsorsonMinutTsainiiTsag % 60 < 10
                ? "0"
                : ""
            }${!!khotsorsonMinutTsainiiTsag && khotsorsonMinutTsainiiTsag % 60}`
          ) : (
            <span style={{ fontFamily: "monospace" }}>--:--</span>
          );
        },
      },
      {
        title: "Төлөв",
        dataIndex: "tuluv",
        ellipsis: true,
        align: "center",
        render: (tuluv) => {
          return tuluv === "kheviin"
            ? "Мундаг"
            : tuluv === "khotsorson"
            ? "Хоцорсон"
            : tuluv === "chuluu"
            ? "Чөлөөтэй"
            : tuluv === "tasalsan"
            ? "Тасалсан"
            : tuluv === "hagas"
            ? "Хагас"
            : "Тодорхойгүй";
        },
      },
      {
        title: "Үйлдэл",
        dataIndex: "noSort",
        width: "12rem",
        align: "center",
        render: (v, mur) => {
          return (
            <div className="flex items-center justify-center gap-3">
              <div
                className="flex cursor-pointer items-center gap-1 font-medium text-gray-600 hover:text-black dark:text-gray-300"
                onClick={() => irstZasah(mur)}
              >
                <CheckSquareOutlined />
                <div>Засах</div>
              </div>
              <div
                className="flex cursor-pointer items-center gap-1 font-medium text-green-600 hover:text-green-400"
                onClick={() => irstKharakh(mur)}
              >
                <EyeOutlined />
                <div>Харах</div>
              </div>
            </div>
          );
        },
      },
    ];
    return [...jagsaalt, ...shineBagana];
  }, []);

  const data = [
    {
      name: "Ажилтан",
      minWidth: "10rem",
      full: "w-full text-left",
      field: "ajiltniiNer",
    },
    {
      name: "Огноо",
      minWidth: "8rem",
      full: "w-full",
      field: "ognoo",
      mobileHide: true,
    },
    {
      name: "Ирсэн цаг",
      minWidth: "8rem",
      full: "w-full",
      field: "irsenTsag",
      mobileHide: true,
    },
    {
      name: "Гарсан цаг",
      minWidth: "8rem",
      full: "w-full",
      field: "yawsanTsag",
      mobileHide: true,
    },
    {
      name: "Гарсан цаг (Цайны цаг)",
      minWidth: "8rem",
      full: "w-full",
      field: "tsainiiGarsanTsag",
      mobileHide: true,
    },
    {
      name: "Ирсэн цаг (Цайны цаг)",
      minWidth: "8rem",
      full: "w-full",
      field: "tsainiiIrsenTsag",
      mobileHide: true,
    },
    {
      name: "Ажилласан цаг",
      minWidth: "8rem",
      full: "w-full",
      field: "ajillasanMinut",
      mobileHide: true,
    },
    {
      name: "Хоцорсон цаг",
      minWidth: "6rem",
      full: "w-full",
      field: "khotsorsonMinut",
      mobileHide: true,
    },
    {
      name: "Хоцорсон (Цайны цаг)",
      minWidth: "6rem",
      full: "w-full",
      field: "khotsorsonMinutTsainiiTsag",
      mobileHide: true,
    },
    {
      name: "Төлөв",
      minWidth: "8rem",
      full: "w-full",
      field: "khotsorsonMinut",
      mobileHide: true,
    },
    {
      name: "Төрөл",
      minWidth: "5rem",
      full: "w-full",
      field: "noSort",
      mobileHide: true,
    },
    { name: "Үйлдэл", minWidth: "12rem", full: "w-full", field: "noSort" },
  ];

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  function irstZasah(data) {
    const footer = [
      <div className="flex w-full justify-end">
        <Button type="sideKick" onClick={() => erstRef.current?.khaaya()}>
          Хаах
        </Button>
        <Button type="primary" onClick={() => erstRef.current?.khadgalya()}>
          Хадгалах
        </Button>
      </div>,
    ];
    modal({
      title:
        data === "new" ? (
          <div>Ирц оруулах</div>
        ) : (
          <div
            className="flex w-full items-center text-left text-gray-600  dark:text-gray-200"
            style={{ minWidth: "10rem" }}
          >
            <div className="mx-4 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full shadow-md ring-2">
              <img
                src={
                  !!ajilchdiinGaralt?.jagsaalt.find(
                    (a) => a._id === data.ajiltniiId,
                  )?.zurgiinNer
                    ? `${url}/ajiltniiZuragAvya/${
                        ajilchdiinGaralt?.jagsaalt.find(
                          (a) => a._id === data.ajiltniiId,
                        ).baiguullagiinId
                      }/${
                        ajilchdiinGaralt?.jagsaalt.find(
                          (a) => a._id === data.ajiltniiId,
                        ).zurgiinNer
                      }`
                    : "/profile.svg"
                }
                className=" h-full"
              />
            </div>
            <div className="flex h-10 flex-col font-semibold">
              {data.ajiltniiNer}
              <p className="text-sm font-normal text-gray-400">
                {!!ajilchdiinGaralt?.jagsaalt.find(
                  (a) => a._id === data.ajiltniiId,
                )?.albanTushaal
                  ? ajilchdiinGaralt?.jagsaalt.find(
                      (a) => a._id === data.ajiltniiId,
                    ).albanTushaal
                  : "Албан тушаал"}
              </p>
            </div>
          </div>
        ),
      content: (
        <IrtsZasakh
          barilgiinId={barilgiinId}
          ajilchdiinGaralt={ajilchdiinGaralt}
          setAjiltniiKhuudaslalt={setAjiltniiKhuudaslalt}
          data={data}
          ref={erstRef}
          token={token}
          baiguullaga={baiguullaga}
          irtsMutate={irtsMutate}
        />
      ),
      footer,
    });
  }

  function minuutiigTsagBolgoh(minute) {
    const tsag = Math.floor(minute / 60);
    const min = minute % 60;

    const formattedHours = tsag < 10 ? `0${tsag}` : tsag;
    const formattedMins = min < 10 ? `0${min}` : min;

    return `${formattedHours}:${formattedMins}`;
  }

  function ajillasanTsagBolonIluuTsagBasHotsroltOloh(t) {
    var result = 0;
    if (t === "ajillasanTsag") {
      irtsniiGaralt?.jagsaalt.map((e) => {
        if (e.ajillasanMinut === undefined) {
          result = result + 0;
        } else {
          result = result + e.ajillasanMinut;
        }
      });
      return minuutiigTsagBolgoh(result);
    } else if (t === "iluuTsag") {
      irtsniiGaralt?.jagsaalt.map((e) => {
        if (e.ertIrsenMinut === undefined) {
          result = result + 0;
        } else {
          result = result + e.ertIrsenMinut;
        }
      });
      return minuutiigTsagBolgoh(result);
    } else {
      irtsniiGaralt?.jagsaalt.map((e) => {
        if (e.ertIrsenMinut === undefined) {
          result = result + 0;
        } else {
          result = result + e.khotsorsonMinut;
        }
      });
      return minuutiigTsagBolgoh(result);
    }
  }

  function irstKharakh(data) {
    const footer = [
      <div className="flex w-full justify-end">
        <Button
          type="sideKick"
          onClick={() => erstKharakhRef.current?.khaaya()}
        >
          Хаах
        </Button>
      </div>,
    ];
    modal({
      title:
        data === "new" ? (
          <div>Ирц оруулах</div>
        ) : (
          <div
            className="flex w-full items-center text-left text-gray-600  dark:text-gray-200"
            style={{ minWidth: "10rem" }}
          >
            <div className="mx-4 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full shadow-md ring-2">
              <img
                src={
                  !!ajilchdiinGaralt?.jagsaalt.find(
                    (a) => a._id === data.ajiltniiId,
                  )?.zurgiinNer
                    ? `${url}/ajiltniiZuragAvya/${
                        ajilchdiinGaralt?.jagsaalt.find(
                          (a) => a._id === data.ajiltniiId,
                        ).baiguullagiinId
                      }/${
                        ajilchdiinGaralt?.jagsaalt.find(
                          (a) => a._id === data.ajiltniiId,
                        ).zurgiinNer
                      }`
                    : "/profile.svg"
                }
                className=" h-full"
              />
            </div>
            <div className="flex h-10 flex-col font-semibold">
              {data.ajiltniiNer}
              <p className="text-sm font-normal text-gray-400">
                {!!ajilchdiinGaralt?.jagsaalt.find(
                  (a) => a._id === data.ajiltniiId,
                )?.albanTushaal
                  ? ajilchdiinGaralt?.jagsaalt.find(
                      (a) => a._id === data.ajiltniiId,
                    ).albanTushaal
                  : "Албан тушаал"}
              </p>
            </div>
          </div>
        ),
      content: (
        <IrtsKharakh
          barilgiinId={barilgiinId}
          data={data}
          ref={erstKharakhRef}
          token={token}
        />
      ),
      footer,
    });
  }

  return (
    <Admin
      tsonkhniiId={"644728ff28c37d7cdda115fc"}
      onSearch={(search) => setIrtsiinKhuudaslalt((kh) => ({ ...kh, search }))}
      title="Жагсаалт"
      khuudasniiNer="irtsJagsaalt"
      className="p-0 pb-10 md:p-4 md:pb-0"
    >
      <div className="col-span-12 p-4">
        <div className="grid w-full grid-cols-1 justify-between gap-2 py-1 sm:flex sm:gap-4">
          <div className=" grid grid-cols-2 gap-2 sm:gap-4 xl:flex">
            <div className="col-span-2 flex items-center gap-2">
              <div className="hidden xl:block">Огноо:</div>
              <DatePicker.RangePicker
                key="date-range-picker"
                className="w-full"
                placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                allowClear={false}
                value={ekhlekhOgnoo}
                format={"YYYY-MM-DD"}
                onChange={(v) => setEkhlekhOgnoo(v)}
                getPopupContainer={(trigger) => trigger.parentElement}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden xl:block">Ажилтан:</div>
              <Select
                allowClear
                onChange={(v) => setShuult({ ...shuult, ajiltniiId: v })}
                className="w-full dark:text-white sm:w-36 dark:[&_.ant-select-selection-placeholder]:text-white"
                placeholder="Ажилтан"
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
            <div className="flex items-center gap-2">
              <div className="hidden xl:block">Төлөв:</div>
              <Select
                onChange={(v) => {
                  setShuult({ ...shuult, tuluv: v });
                }}
                allowClear={true}
                className="w-full sm:w-36 dark:[&_.ant-select-selection-placeholder]:text-white"
                placeholder="Сонгох"
              >
                <Select.Option value={"kheviin"}>
                  <div className="text-green-500">Мундаг</div>
                </Select.Option>
                <Select.Option value={"khotsorson"}>
                  <div className="text-pink-500">Хоцорсон</div>
                </Select.Option>
                <Select.Option value={"chuluu"}>
                  <div className="text-blue-500">Чөлөөтэй</div>
                </Select.Option>
                <Select.Option value={"tasalsan"}>
                  <div className="text-red-500">Тасалсан</div>
                </Select.Option>
                <Select.Option value={"hagas"}>
                  <div className="text-yellow-500">Хагас</div>
                </Select.Option>
                <Select.Option value={"todorhoigue"}>
                  <div className="text-gray-400">Тодорхойгүй</div>
                </Select.Option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 2xl:flex">
            <BaganiinSongolt
              shineBagana={shineBagana}
              setShineBagana={setShineBagana}
              columns={[
                {
                  title: t("Төрөл"),
                  width: "8rem",
                  dataIndex: "noSort",
                  summary: true,
                  align: "center",
                  render: (a) => {
                    return (
                      <Popover
                        content={
                          <div className="w-64 divide-y dark:text-gray-200">
                            <div className="flex w-full justify-between font-medium">
                              <div>Бүртгэлийн төрөл:</div>
                              <div>
                                {!!mur?.orsonTurul?.ajiltniiId
                                  ? "Гараас"
                                  : "App"}
                              </div>
                            </div>
                            {!!mur?.orsonTurul?.ajiltniiId ? (
                              <div className="flex w-full justify-between font-medium">
                                <div>Бүртгэсэн ажилтны нэр:</div>
                                <div>{mur?.orsonTurul?.ajiltniiNer}</div>
                              </div>
                            ) : (
                              <div className="flex w-full justify-between font-medium">
                                <div>Бүртгэлийн хэлбэр:</div>
                                <div>
                                  {!!mur?.orsonTurul?.tukhuruumjiinId
                                    ? "Wifi"
                                    : "Location"}
                                </div>
                              </div>
                            )}
                          </div>
                        }
                      >
                        <div className="flex text-xl text-blue-600">
                          <EyeOutlined />
                        </div>
                      </Popover>
                    );
                  },
                },
              ]}
            />
            <Button
              onClick={() => irstZasah("new")}
              className="col-span-2"
              type="primary"
              icon={<PlusOutlined />}
            >
              Ирц оруулах
            </Button>
            <Button
              onClick={handlePrint}
              type="sideKick"
              icon={<PrinterOutlined />}
            >
              Хэвлэх
            </Button>
            <Button
              type="sideKick"
              icon={<FileExcelOutlined />}
              onClick={() => {
                const { Excel } = require("antd-table-saveas-excel");
                const excel = new Excel();
                excel
                  .addSheet("харилцагч")
                  .addColumns([
                    {
                      title: "Ажилтан",
                      dataIndex: "ajiltniiNer",
                      ellipsis: true,
                    },
                    {
                      title: "Огноо",
                      dataIndex: "ognoo",
                      ellipsis: true,
                      render: (ognoo) => {
                        return moment(ognoo).format("YYYY-MM-DD");
                      },
                    },
                    {
                      title: "Ирсэн цаг",
                      dataIndex: "irsenTsag",
                      ellipsis: true,
                      render: (irsenTsag) => {
                        return !!irsenTsag
                          ? moment(irsenTsag).format("HH:mm:ss")
                          : "--:--:--";
                      },
                    },
                    {
                      title: "Гарсан цаг",
                      dataIndex: "yawsanTsag",
                      ellipsis: true,
                      render: (yawsanTsag) => {
                        return !!yawsanTsag
                          ? moment(yawsanTsag).format("HH:mm:ss")
                          : "--:--:--";
                      },
                    },
                    {
                      title: "Ажилласан минут",
                      dataIndex: "ajillasanMinut",
                      ellipsis: true,
                      render: (ajillasanMinut) => {
                        return ajillasanMinut > 0
                          ? `${
                              !!ajillasanMinut && ajillasanMinut / 60 < 10
                                ? "0"
                                : ""
                            }${
                              !!ajillasanMinut && toInteger(ajillasanMinut / 60)
                            }:${
                              !!ajillasanMinut && ajillasanMinut % 60 < 10
                                ? "0"
                                : ""
                            }${!!ajillasanMinut && ajillasanMinut % 60}`
                          : "--:--";
                      },
                    },
                    {
                      title: "Хоцорсон минут",
                      dataIndex: "khotsorsonMinut",
                      ellipsis: true,
                      render: (khotsorsonMinut) => {
                        return khotsorsonMinut > 0
                          ? `${
                              !!khotsorsonMinut && khotsorsonMinut / 60 < 10
                                ? "0"
                                : ""
                            }${
                              !!khotsorsonMinut &&
                              toInteger(khotsorsonMinut / 60)
                            }:${
                              !!khotsorsonMinut && khotsorsonMinut % 60 < 10
                                ? "0"
                                : ""
                            }${!!khotsorsonMinut && khotsorsonMinut % 60}`
                          : "--:--";
                      },
                    },
                    {
                      title: "Төлөв",
                      dataIndex: "tuluv",
                      ellipsis: true,
                      render: (tuluv) => {
                        return tuluv === "kheviin"
                          ? "Мундаг"
                          : tuluv === "khotsorson"
                          ? "Хоцорсон"
                          : tuluv === "chuluu"
                          ? "Чөлөөтэй"
                          : tuluv === "tasalsan"
                          ? "Тасалсан"
                          : tuluv === "hagas"
                          ? "Хагас"
                          : "Тодорхойгүй";
                      },
                    },
                  ])
                  .addDataSource(irtsniiGaralt?.jagsaalt)
                  .saveAs("Ирцийн жагсаалт.xlsx");
              }}
            >
              Excel татах
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            scroll={{ x: "max-content", y: "calc(100vh - 32rem)" }}
            size="small"
            bordered
            columns={columns}
            loading={!irtsniiGaralt}
            dataSource={irtsniiGaralt?.jagsaalt}
            rowKey={(a) => a._id}
            className="t-head"
            pagination={{
              current: irtsniiGaralt?.khuudasniiDugaar,
              total: irtsniiGaralt?.niitMur,
              pageSizeOptions: [10, 20, 100, 200, 500],
              defaultPageSize: 100,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
                setIrtsiinKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                }));
              },
            }}
          />
        </div>
        <div className="hidden">
          <table ref={printRef} className="printTable w-full overflow-hidden">
            <thead className="border-y">
              <tr className="border-y pl-1">
                {data.map((mur, i) => (
                  <TableGarchig onChangeTable={onChangeTable} mur={mur} i={i} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y overflow-hidden">
              {ekhlekhOgnoo &&
                irtsniiGaralt?.jagsaalt.map((mur, i) => {
                  var albanTushaal = ajilchdiinGaralt?.jagsaalt.find(
                    (a) => a._id === mur.ajiltniiId,
                  )?.albanTushaal;
                  return (
                    <tr
                      className={`transition-colors hover:bg-blue-200 ${
                        i % 2 === 0
                          ? "bg-blue-50 dark:bg-blue-900 dark:hover:bg-blue-800"
                          : "bg-white dark:bg-gray-800 dark:hover:bg-gray-900"
                      }`}
                      key={i}
                    >
                      <td
                        className="px-4 py-3 text-left align-middle text-gray-600 dark:text-gray-200"
                        style={{ minWidth: "10rem" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-14 items-center justify-center overflow-hidden rounded-full shadow-md ring-2">
                            <img
                              src={
                                !!ajilchdiinGaralt?.jagsaalt.find(
                                  (a) => a._id === mur.ajiltniiId,
                                )?.zurgiinNer
                                  ? `${url}/ajiltniiZuragAvya/${
                                      ajilchdiinGaralt?.jagsaalt.find(
                                        (a) => a._id === mur.ajiltniiId,
                                      ).baiguullagiinId
                                    }/${
                                      ajilchdiinGaralt?.jagsaalt.find(
                                        (a) => a._id === mur.ajiltniiId,
                                      ).zurgiinNer
                                    }`
                                  : "/profile.svg"
                              }
                              className="h-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold">
                              {mur.ajiltniiNer}
                            </div>
                            <Tooltip
                              title={
                                albanTushaal?.length > 12 && (
                                  <div>{albanTushaal}</div>
                                )
                              }
                            >
                              <div className="truncate text-sm font-normal text-gray-400">
                                {!!albanTushaal ? albanTushaal : "Албан тушаал"}
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-center align-middle text-sm"
                        style={{ minWidth: "10rem" }}
                      >
                        {moment(mur.ognoo).format("YYYY-MM-DD")}
                      </td>
                      <td
                        className="px-4 py-3 text-center align-middle text-sm"
                        style={{ minWidth: "10rem" }}
                      >
                        {mur.irsenTsag
                          ? moment(mur.irsenTsag).format("HH:mm:ss")
                          : "--:--:--"}
                      </td>
                      <td
                        className="px-4 py-3 text-center align-middle text-sm"
                        style={{ minWidth: "10rem" }}
                      >
                        {!!mur.yawsanTsag
                          ? moment(mur.yawsanTsag).format("HH:mm:ss")
                          : "--:--:--"}
                      </td>
                      <td
                        className="px-4 py-3 text-center align-middle text-sm"
                        style={{ minWidth: "10rem" }}
                      >
                        <div>
                          {mur?.ajillasanMinut > 0 ? (
                            <div>
                              {!!mur.ajillasanMinut &&
                                mur.ajillasanMinut / 60 < 10 &&
                                "0"}
                              {!!mur.ajillasanMinut &&
                                toInteger(mur.ajillasanMinut / 60)}
                              :
                              {!!mur.ajillasanMinut &&
                                mur.ajillasanMinut % 60 < 10 &&
                                "0"}
                              {!!mur.ajillasanMinut && mur.ajillasanMinut % 60}{" "}
                            </div>
                          ) : (
                            <div>--:--</div>
                          )}
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 text-center align-middle text-sm"
                        style={{ minWidth: "10rem" }}
                      >
                        {mur?.khotsorsonMinut > 0
                          ? `${
                              mur.khotsorsonMinut / 60 < 10 ? "0" : ""
                            }${toInteger(mur.khotsorsonMinut / 60)}:${
                              mur.khotsorsonMinut % 60 < 10 ? "0" : ""
                            }${mur.khotsorsonMinut % 60}`
                          : "--:--"}
                      </td>
                      <td
                        className="px-4 py-3 text-center align-middle text-sm"
                        style={{ minWidth: "10rem" }}
                      >
                        {
                          <div
                            className={`flex w-24 cursor-pointer items-center gap-2 font-medium ${
                              mur.tuluv === "kheviin"
                                ? "text-green-500"
                                : mur.tuluv === "khotsorson"
                                ? "text-pink-500"
                                : mur.tuluv === "chuluu"
                                ? "text-blue-500"
                                : mur.tuluv === "tasalsan"
                                ? "text-red-500"
                                : mur.tuluv === "hagas"
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                          >
                            {mur.tuluv === "kheviin" ? (
                              <CheckCircleOutlined />
                            ) : mur.tuluv === "khotsorson" ? (
                              <ExclamationCircleOutlined />
                            ) : mur.tuluv === "chuluu" ? (
                              <MinusCircleOutlined />
                            ) : mur.tuluv === "tasalsan" ? (
                              <CloseCircleOutlined />
                            ) : mur.tuluv === "hagas" ? (
                              <img
                                src="/halfCircle.svg"
                                style={{ height: "15px", width: "15px" }}
                              />
                            ) : (
                              <QuestionCircleOutlined />
                            )}
                            {mur.tuluv === "kheviin"
                              ? "Мундаг"
                              : mur.tuluv === "khotsorson"
                              ? "Хоцорсон"
                              : mur.tuluv === "chuluu"
                              ? "Чөлөөтэй"
                              : mur.tuluv === "tasalsan"
                              ? "Тасалсан"
                              : mur.tuluv === "hagas"
                              ? "Хагас"
                              : "Тодорхойгүй"}
                          </div>
                        }
                      </td>
                      <td
                        className="px-4 py-3 text-center align-middle text-sm"
                        style={{ minWidth: "5rem" }}
                      >
                        <Popover
                          content={
                            <div className="w-64 divide-y dark:text-gray-200">
                              <div className="flex w-full justify-between font-medium">
                                <div>Бүртгэлийн төрөл:</div>
                                <div>
                                  {!!mur?.orsonTurul?.ajiltniiId
                                    ? "Гараас"
                                    : "App"}
                                </div>
                              </div>
                              {!!mur?.orsonTurul?.ajiltniiId ? (
                                <div className="flex w-full justify-between font-medium">
                                  <div>Бүртгэсэн ажилтны нэр:</div>
                                  <div>{mur?.orsonTurul?.ajiltniiNer}</div>
                                </div>
                              ) : (
                                <div className="flex w-full justify-between font-medium">
                                  <div>Бүртгэлийн хэлбэр:</div>
                                  <div>
                                    {!!mur?.orsonTurul?.tukhuruumjiinId
                                      ? "Wifi"
                                      : "Location"}
                                  </div>
                                </div>
                              )}
                            </div>
                          }
                        >
                          <div className="flex text-xl text-blue-600">
                            <EyeOutlined />
                          </div>
                        </Popover>
                      </td>
                      <td
                        className="table-report__action px-4 py-3 text-center align-middle text-sm md:table-cell"
                        style={{ minWidth: "12rem" }}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div
                            className="flex cursor-pointer items-center gap-1 font-medium text-gray-600 hover:text-black dark:text-gray-300"
                            onClick={() => irstZasah(mur)}
                          >
                            <CheckSquareOutlined />
                            <div>Засах</div>
                          </div>
                        </div>
                        <div
                          className="flex cursor-pointer items-center justify-start gap-1 font-medium text-green-600 hover:text-green-400"
                          onClick={() => irstKharakh(mur)}
                        >
                          <EyeOutlined />
                          <div>Харах</div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {shuult.ajiltniiId === undefined &&
        shuult.tuluv === undefined ? null : (
          <>
            <div className=" grid grid-cols-12 space-x-2 ">
              <div className="col-span-2 flex justify-between border-b-2 border-gray-400 p-2">
                <div className="col-span-1 font-bold">Нийт ажилласан цаг:</div>
                <div className="col-span-1 text-green-500">
                  {ajillasanTsagBolonIluuTsagBasHotsroltOloh("ajillasanTsag")}
                </div>
              </div>
            </div>
            <div className=" grid grid-cols-12 space-x-2 ">
              <div className="col-span-2 flex justify-between border-b-2 border-gray-400 p-2">
                <div className="col-span-1 font-bold">Нийт хоцорсон цаг:</div>
                <div className="col-span-1 text-green-500">
                  {ajillasanTsagBolonIluuTsagBasHotsroltOloh("khotsorsonMinut")}
                </div>
              </div>
            </div>
            <div className=" grid grid-cols-12 space-x-2 ">
              <div className="col-span-2 flex justify-between border-b-2 border-gray-400 p-2">
                <div className="col-span-1 font-bold">Нийт эрт ирсэн цаг:</div>
                <div className="col-span-1 text-green-500">
                  {ajillasanTsagBolonIluuTsagBasHotsroltOloh("iluuTsag")}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default jagsaalt;
