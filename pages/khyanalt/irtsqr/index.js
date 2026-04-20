import Admin from "../../../components/Admin";
import shalgaltKhiikh from "../../../services/shalgaltKhiikh";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "services/auth";
import setTime from "tools/function/setTime";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { notification } from "antd";

// ИРЦ - Attendance page component
function IrtsQR({ token }) {
  const [checked, setChecked] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [burtguulsenTsag, setBurtguulsenTsag] = useState("");
  const { sonorduulga, ajiltan, baiguullaga, unuudriinIrts, barilgiinId } =
    useAuth();

  const tsag = useMemo(() => {
    const today = new Date().getDay().toString();

    return baiguullaga?.barilguud
      ?.find((a) => a._id.toString() === barilgiinId)
      ?.ajillakhUdruud?.find(
        (x) => x.udruud.includes(today), // ✔ илүү ойлгомжтой
      );
  }, [baiguullaga, barilgiinId]);

  const buttonState = useMemo(() => {
    const hasYawsanTsag = !!unuudriinIrts?.data?.yawsanTsag;
    const hasIrsenTsag = !!unuudriinIrts?.data?.irsenTsag;
    const hasTsainiiGarsan = !!unuudriinIrts?.data?.tsainiiGarsanTsag;
    const hasTsainiiIrsen = !!unuudriinIrts?.data?.tsainiiIrsenTsag;

    const now = new Date();
    const tsainiiNeekhTsag = new Date();
    const khaakhTsag = new Date();

    setTime(tsainiiNeekhTsag, tsag?.tsainiiNeekhTsag); // 12:00
    setTime(khaakhTsag, tsag?.khaakhTsag); // 17:00

    if (hasYawsanTsag) return null;
    if (!hasIrsenTsag) return "orokh";
    if (now >= tsainiiNeekhTsag) {
      if (!hasTsainiiGarsan) return "tsainiiGarakh"; // Цайны гарах

      // Цайны гарсан цагаас + 1 цаг хүртэл орох боломжтой
      const orohBoolomjtoi = new Date(unuudriinIrts.data.tsainiiGarsanTsag);
      orohBoolomjtoi.setHours(orohBoolomjtoi.getHours() + 1);

      if (!hasTsainiiIrsen && now <= orohBoolomjtoi) return "tsainiiOrokh"; // Цайны орох

      // Цайны орсны дараа гарах
      if (hasTsainiiIrsen && now >= khaakhTsag) return "garakh";

      return "waiting";
    }
    if (now >= khaakhTsag) return "garakh";

    return "garakh"; // Цайны цаг болоогүй үед үргэлж гарах боломжтой
  }, [unuudriinIrts, tsag]);

  const irtsUgukhEsekh = useMemo(() => {
    return buttonState !== null;
  }, [buttonState]);

  useEffect(() => {
    if (buttonState === "garakh") {
      setCountdown(5);
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [buttonState]);

  useEffect(() => {
    // Countdown from 5 to 0 only for "Гарах" (exit)
    if (buttonState === "garakh" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (buttonState === "garakh" && countdown === 0) {
      setIsButtonDisabled(false);
    }
  }, [countdown, buttonState]);

  const tsagBurtgel = async () => {
    if (buttonState === "waiting") {
      notification.warning({
        message: "Сануулга",
        description: "Дахин бүртгүүлэх боломжтой цаг: 12:00-16:59",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Хэрэглэгчийн IP авах
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();
      console.log("Хэрэглэгчийн IP:", ip);

      const ua = navigator.userAgent;
      console.log("User Agent:", ua);

      const tokhiromjiinMedeelel = {
        userAgent: ua,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        platform: navigator.platform,
        isOnline: navigator.onLine,
      };

      // Backend руу илгээж шалгуулах
      const response = await uilchilgee(token).post("/check-wifi", {
        barilgiinId,
        ip,
        buttonState,
        tokhiromjiinMedeelel: tokhiromjiinMedeelel,
      });

      const result = await response.data;
      if (!result.zuvshurulusen) {
        setIsLoading(false);
        notification.warn({
          message: "Анхааруулга",
          description:
            result.message || "Та зөвшөөрөгдсөн WiFi сүлжээнд байхгүй байна.",
        });
        return;
      }

      ilgeekh(ip, buttonState, tokhiromjiinMedeelel);
    } catch (error) {
      setIsLoading(false);

      notification.error({
        message: "Алдаа",
        description: "Сүлжээний алдаа гарлаа. Дахин оролдоно уу." + error,
      });
    }
  };

  const ilgeekh = (ip, action, tokhiromjiinMedeelel) => {
    const urn =
      action === "garakh" ? "/garsanTsagBurtguulye" : "/irtsBurtguulye";

    uilchilgee(token)
      .post(urn, {
        barilgiinId: barilgiinId,
        ip: ip,
        tokhiromjiinMedeelel: tokhiromjiinMedeelel,
      })
      .then(({ data }) => {
        console.log("Бүртгэлийн үр дүн:", JSON.stringify(data));
        if (data === "Amjilttai") {
          unuudriinIrts.mutate();
          // Dialog нээх
          setBurtguulsenTsag(
            new Date().toLocaleTimeString("mn-MN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
          setSuccessDialog(true);
        } else {
          if (!data.zuvshurulusen) {
            setIsLoading(false);
            notification.warn({
              message: "Анхааруулга",
              description: data.message,
            });
            return;
          }
        }
        setIsLoading(false);
      })
      .catch((e) => aldaaBarigch(e));
  };

  return (
    <Admin
      title="Ирц QR"
      khuudasniiNer="irtsqr"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setAjiltniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      tsonkhniiId={"61c2c6571c2830c4e6f90c95"}
      loading={waiting}
    >
      <div className="box col-span-12 p-5 md:col-span-6 xl:col-span-3">
        <div className="w-full max-w-sm px-3 pb-28">
          {/* Profile */}
          <div className="mt-3 rounded-2xl bg-white p-4 text-center shadow transition active:scale-95">
            <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-gray-300"></div>

            <div className="font-bold">
              {ajiltan?.ner} <span className="text-green-600">✓</span>
            </div>

            <div className="mt-3 flex gap-2 p-4">
              <div className="flex-1 rounded-lg border p-2">
                <div className="text-xs text-gray-400">Ирэх</div>
                <div className="font-bold text-green-600">
                  {tsag?.neekhTsag}
                </div>
              </div>

              <div className="flex-1 rounded-lg border border-orange-400 bg-orange-50 p-2">
                <div className="text-xs text-gray-400">Гарах</div>
                <div className="font-bold text-orange-500">
                  {tsag?.khaakhTsag}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded-xl border border-green-600 bg-white p-3 text-center">
              <div className="font-bold text-green-600">0</div>
              <div className="text-xs text-gray-400">Хэвийн</div>
            </div>

            <div className="flex-1 rounded-xl border border-orange-400 bg-orange-50 p-3 text-center">
              <div className="font-bold text-orange-500">0</div>
              <div className="text-xs text-gray-400">Хоцролт</div>
            </div>

            <div className="flex-1 rounded-xl border border-red-500 bg-white p-3 text-center">
              <div className="font-bold text-red-500">0</div>
              <div className="text-xs text-gray-400">Бүртгэгүй</div>
            </div>
          </div>
          {irtsUgukhEsekh && (
            <button
              disabled={isButtonDisabled || buttonState === "waiting"}
              onClick={() => {
                if (!isButtonDisabled && buttonState !== "waiting") {
                  tsagBurtgel();
                }
              }}
              className={`
      w-full rounded-md py-4 transition-opacity
      ${buttonState === "garakh" ? "bg-orange-100" : "bg-blue-100"}
      ${
        isButtonDisabled || buttonState === "waiting"
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer opacity-100"
      }
    `}
            >
              <div className="flex items-center justify-center">
                <strong
                  className={`text-lg font-bold
          ${buttonState === "garakh" ? "text-orange-500" : "text-blue-500"}
        `}
                >
                  {isButtonDisabled && buttonState === "garakh"
                    ? `${countdown} секунд`
                    : buttonState === "garakh"
                    ? "Гарах"
                    : buttonState === "dahinBurtguulye"
                    ? "Дахин бүртгүүлэх"
                    : buttonState === "waiting"
                    ? "Цайны цаг"
                    : "Орох"}
                </strong>
              </div>
            </button>
          )}
        </div>
      </div>
      {successDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[80%] max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="h-10 w-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Текст */}
            <h2 className="mb-2 text-lg font-bold text-gray-800">
              Ирц амжилттай бүртгэлээ
            </h2>
            <p className="mb-6 text-3xl font-bold text-blue-500">
              {burtguulsenTsag}
            </p>

            {/* Товч */}
            <button
              onClick={() => setSuccessDialog(false)}
              className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white"
            >
              Хаах
            </button>
          </div>
        </div>
      )}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default IrtsQR;
