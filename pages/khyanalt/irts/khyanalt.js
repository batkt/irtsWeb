import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, message, Table, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  MinusCircleOutlined,
  PrinterOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import dayjs from "utils/dayjs";
import { useReactToPrint } from "react-to-print";
import uilchilgee, { url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import IrtsKharakh from "components/irts/IrtsKharakh";
import { modal } from "components/ant/Modal";

function khyanalt({ token }) {
  const { baiguullaga, barilgiinId } = useAuth();
  const printRef = React.useRef(null);
  const [ognoo, setOgnoo] = useState(null);
  const [data, setData] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const erstKharakhRef = React.useRef(null);

  useEffect(() => {
    if (!ognoo) {
      setOgnoo(dayjs().format("YYYY-MM-01 00:00:00"));
    }
  }, []);

  useEffect(() => {
    if (!ognoo) return;
    uilchilgee(token)
      .post("/irtsiinMedeeSaraarAvya", {
        ekhlekhOgnoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo)
          .add(1, "month")
          .subtract(1, "day")
          .format("YYYY-MM-DD 23:59:59"),
        barilgiinId: barilgiinId,
      })
      .then(({ data }) => {
        if (!!data) {
          setData(data);
        }
      });
    const sariinUrt = moment(ognoo)
      .add(1, "months")
      .subtract(1, "days")
      .format("DD");
    if (!!ognoo && !!sariinUrt) {
      setCalendar(sariinUrt);
    } else setCalendar(31);
  }, [ognoo, barilgiinId]);

  function delegrenguiKharakh(sar, ner, udur) {
    uilchilgee(token)
      .get("/irts", {
        params: {
          query: {
            ajiltniiNer: ner.ajiltniiNer,
            ognoo: moment(sar).format(
              `YYYY-MM-${
                udur?.udur < 10 ? "0" + udur?.udur : udur?.udur
              } 00:00:00`,
            ),
          },
        },
      })
      .then(({ data }) => {
        const footer = [
          <div className="flex w-full justify-end">
            <Button
              type="sideKick"
              onClick={() => erstKharakhRef.current.khaaya()}
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
                className="flex w-full items-center text-left text-gray-500  dark:text-gray-200"
                style={{ minWidth: "10rem" }}
              >
                <div className="flex items-center">
                  <div className="mx-4 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black shadow-md ring-2">
                    <img
                      src={
                        !!ner?.zurgiinNer
                          ? `${url}/ajiltniiZuragAvya/${baiguullaga?._id}/${ner?.zurgiinNer}`
                          : "/profile.svg"
                      }
                      className="h-full object-cover"
                    />
                  </div>
                  {ner?.ajiltniiNer}
                </div>
              </div>
            ),
          content: (
            <IrtsKharakh
              barilgiinId={barilgiinId}
              data={data?.jagsaalt[0]}
              ref={erstKharakhRef}
              token={token}
            />
          ),
          footer,
        });
      });
  }

  const columns = useMemo(() => {
    const data = [
      {
        title: "Ажилтан",
        dataIndex: "ajiltniiNer",
        width: "12rem",
        align: "center",
        render: (a, mur) => {
          return (
            <div className="flex items-center">
              <div className="mx-4 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black shadow-md ring-2">
                <img
                  src={
                    !!mur._id?.zurgiinNer
                      ? `${url}/ajiltniiZuragAvya/${baiguullaga?._id}/${mur._id?.zurgiinNer}`
                      : "/profile.svg"
                  }
                  className="h-full object-cover"
                />
              </div>
              {mur._id?.ajiltniiNer}
            </div>
          );
        },
      },
    ];
    for (let index = 1; index <= calendar; index++) {
      data.push({
        title: index,
        width: "2.5rem",
        dataIndex: "irts",
        render: (c, b) => {
          return (
            <Tooltip
              title={
                <div
                  className={`${
                    b.irts.find((b) => b.udur === index)?.tuluv === "kheviin"
                      ? "text-green-500"
                      : b.irts.find((b) => b.udur === index)?.tuluv ===
                        "khotsorson"
                      ? "text-pink-500"
                      : b.irts.find((b) => b.udur === index)?.tuluv === "chuluu"
                      ? "text-blue-500"
                      : b.irts.find((b) => b.udur === index)?.tuluv ===
                        "tasalsan"
                      ? "text-red-500"
                      : b.irts.find((b) => b.udur === index)?.tuluv === "hagas"
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  {b.irts.find((b) => b.udur === index)?.tuluv === "kheviin"
                    ? "Мундаг"
                    : b.irts.find((b) => b.udur === index)?.tuluv ===
                      "khotsorson"
                    ? "Хоцорсон"
                    : b.irts.find((b) => b.udur === index)?.tuluv === "chuluu"
                    ? "Чөлөөтэй"
                    : b.irts.find((b) => b.udur === index)?.tuluv === "tasalsan"
                    ? "Тасалсан"
                    : b.irts.find((b) => b.udur === index)?.tuluv === "hagas"
                    ? "Хагас"
                    : !!b.irts.find((b) => b.udur === index)
                    ? "Тодорхойгүй"
                    : "бүртгэлгүй"}
                </div>
              }
            >
              <div
                onClick={() => {
                  const udur = b.irts.find((b) => b.udur === index);
                  !!udur
                    ? delegrenguiKharakh(ognoo, b._id, udur)
                    : message.warn(
                        `Ажилтны ${moment(ognoo).format(
                          `YYYY-MM-${index < 10 ? "0" + index : index}`,
                        )} эрц бүртгэлгүй байна`,
                      );
                }}
                className={`cursor-pointer ${
                  b.irts.find((b) => b.udur === index)?.tuluv === "kheviin"
                    ? "text-green-500"
                    : b.irts.find((b) => b.udur === index)?.tuluv ===
                      "khotsorson"
                    ? "text-pink-500"
                    : b.irts.find((b) => b.udur === index)?.tuluv === "chuluu"
                    ? "text-blue-500"
                    : b.irts.find((b) => b.udur === index)?.tuluv === "tasalsan"
                    ? "text-red-500"
                    : b.irts.find((b) => b.udur === index)?.tuluv === "hagas"
                    ? "text-yellow-500"
                    : !!b.irts.find((b) => b.udur === index)
                    ? "text-gray-500 dark:text-gray-200"
                    : " text-gray-200"
                }`}
              >
                {b.irts.find((b) => b.udur === index)?.tuluv === "kheviin" ? (
                  <CheckCircleOutlined />
                ) : b.irts.find((b) => b.udur === index)?.tuluv ===
                  "khotsorson" ? (
                  <ExclamationCircleOutlined />
                ) : b.irts.find((b) => b.udur === index)?.tuluv === "chuluu" ? (
                  <MinusCircleOutlined />
                ) : b.irts.find((b) => b.udur === index)?.tuluv ===
                  "tasalsan" ? (
                  <CloseCircleOutlined />
                ) : b.irts.find((b) => b.udur === index)?.tuluv === "hagas" ? (
                  <div className="flex w-full justify-center">
                    <img
                      src="/halfCircle.svg"
                      style={{ height: "15px", width: "15px" }}
                    />
                  </div>
                ) : !!b.irts.find((b) => b.udur === index) ? (
                  <QuestionCircleOutlined />
                ) : (
                  <div className="flex w-full justify-center opacity-20">
                    <svg
                      fill="black"
                      width={"15px"}
                      height={"15px"}
                      viewBox="0 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="rgba(229, 231, 235)"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>circle</title>{" "}
                        <path d="M16 0.75c-8.422 0-15.25 6.828-15.25 15.25s6.828 15.25 15.25 15.25c8.422 0 15.25-6.828 15.25-15.25v0c-0.010-8.418-6.832-15.24-15.249-15.25h-0.001zM16 28.75c-7.042 0-12.75-5.708-12.75-12.75s5.708-12.75 12.75-12.75c7.042 0 12.75 5.708 12.75 12.75v0c-0.008 7.038-5.712 12.742-12.749 12.75h-0.001z"></path>{" "}
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </Tooltip>
          );
        },
        align: "center",
      });
    }

    return data;
  }, [baiguullaga, calendar]);

  const columnsForExcel = useMemo(() => {
    const data = [
      {
        title: "Ажилтан",
        dataIndex: "ajiltniiNer",
        render: (a, mur) => {
          return mur._id?.ajiltniiNer;
        },
      },
    ];
    for (let index = 1; index <= calendar; index++) {
      data.push({
        title: `${index}`,
        dataIndex: "irts",
        render: (c, b) => {
          return b.irts.find((b) => b.udur === index)?.tuluv === "kheviin"
            ? "Мундаг"
            : b.irts.find((b) => b.udur === index)?.tuluv === "khotsorson"
            ? "Хоцорсон"
            : b.irts.find((b) => b.udur === index)?.tuluv === "chuluu"
            ? "Чөлөөтэй"
            : b.irts.find((b) => b.udur === index)?.tuluv === "tasalsan"
            ? "Тасалсан"
            : b.irts.find((b) => b.udur === index)?.tuluv === "hagas"
            ? "Хагас"
            : !!b.irts.find((b) => b.udur === index)
            ? "Тодорхойгүй"
            : "бүртгэлгүй";
        },
      });
    }

    return data;
  }, [baiguullaga, calendar]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Admin
      tsonkhniiId={"6447293028c37d7cdda1160e"}
      title="Хяналт"
      khuudasniiNer="irtsKhyanalt"
      className="p-0 md:p-4"
    >
      <div className="box col-span-12 p-3">
        <div className="grid w-full grid-cols-1 items-center justify-between gap-3 py-5 sm:flex">
          <div className=" flex gap-3">
            <DatePicker
              allowClear={false}
              value={moment(ognoo)}
              onChange={(v) => setOgnoo(v)}
              placeholder="Сар сонгох"
              className="flex w-full sm:w-auto lg:w-52"
              picker="month"
            />
            <Button type="primary">Хайх</Button>
          </div>
          <div className="flex gap-3">
            <Button
              className="w-full sm:w-auto"
              onClick={handlePrint}
              type="sideKick"
              icon={<PrinterOutlined />}
            >
              Хэвлэх
            </Button>
            <Button
              className="w-full sm:w-auto"
              type="sideKick"
              onClick={() => {
                const { Excel } = require("antd-table-saveas-excel");
                const excel = new Excel();
                excel
                  .addSheet("харилцагч")
                  .addColumns(columnsForExcel)
                  .addDataSource(data)
                  .saveAs("Ирц хяналт.xlsx");
              }}
              icon={<FileExcelOutlined />}
            >
              {" "}
              Excel татах
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pb-3 font-medium sm:grid-cols-3 lg:flex">
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircleOutlined /> Мундаг
          </div>
          <div className="flex items-center gap-2 text-pink-500">
            <ExclamationCircleOutlined /> Хоцорсон
          </div>
          <div className="flex items-center gap-2 text-blue-500">
            <MinusCircleOutlined /> Чөлөөтэй
          </div>
          <div className="flex items-center gap-2 text-red-500">
            <CloseCircleOutlined /> Тасалсан
          </div>
          <div className="flex items-center gap-2 text-yellow-500">
            <img
              src="/halfCircle.svg"
              style={{ height: "15px", width: "15px" }}
            />{" "}
            Хагас
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-200">
            <QuestionCircleOutlined /> Тодорхойгүй
          </div>
        </div>
        <Table
          scroll={{ y: "calc( 100vh - 20rem )" }}
          bordered
          size="small"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        <div className="hidden">
          <Table
            ref={printRef}
            bordered
            size="small"
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default khyanalt;
