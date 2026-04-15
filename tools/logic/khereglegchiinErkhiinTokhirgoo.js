import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BiBellPlus, BiDesktop, BiCommentError, BiUser } from "react-icons/bi";
import { BsGraphUp, BsPcDisplay } from "react-icons/bs";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { TbReportMoney } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { GrPlan } from "react-icons/gr";
import { TbLego } from "react-icons/tb";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { toast } from "sonner";
import { t } from "i18next";
import {
  MobileOutlined,
  PhoneOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { TbBoxSeam, TbChartBar, TbSmartHome, TbUsers } from "react-icons/tb";
import { MdMonitorHeart } from "react-icons/md";
export const tsonknuud = [
  {
    key: "/khyanalt/irtsqr",
    ner: "Барилга бүртгэл",
    tailbar:
      "Байгууллага систем ашиглах барилгын мэдээллийн үүнд бүртгэж өгөх юм. Түүний дагуу ажилтан болон удирдах албаны хүмүүс барилга тус бүрийн үйл ажиллагаатай танилцах, явцын мэдээллийг харж болох юм. Мөн олон барилга бүртгэх боломжтой.\n",
    tokhirgoo: [
      {
        ner: "Барилга бүртгэх эрх",
        utga: "barilgaBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/ajiltan/tokhirgoo",
    ner: "Ажилтанд эрх олгох",
    tailbar: "",
    tokhirgoo: [],
    nuuya: true,
  },
  {
    key: "/khyanalt/ajiltan/ajiltanBurtgel",
    ner: "Ажилтан бүртгэл",
    tailbar:
      "Барилгын үйл ажиллагааг хариуцсан ажилчдын бүртгэл мэдээлэл болон ажлын эрх үүргийг оруулж тохиргоо хийх боломжтой.\n",
    tokhirgoo: [
      {
        ner: "Ажилтан бүртгэх эрх",
        utga: "ajiltanBurtgekhEsekh",
      },
    ],
  },
];

export const khereglegchiinErkhuud = [
  {
    erkh: "ZokhionBaiguulagch",
    tailbar: "Зохион байгуулагч",
    tsonkhnuud: [
      "/khyanalt/geree/gereeBurtgel",
      "/khyanalt/geree/gereeBaiguulakh",
      "/khyanalt/geree/zagvar",
      "/khyanalt/talbaiBurtgel/talbaiBurtgekh",
      "/khyanalt/khariltsagchBurtgel",
      "/khyanalt/medegdel",
      "khyanalt/anket",
    ],
  },
  {
    erkh: "Sankhuu",
    tailbar: "Санхүү",
    tsonkhnuud: [
      "/khyanalt/togloom/togloomTuv",
      "/khyanalt/tulburTootsoo",
      "/khyanalt/eBarimt",
      "/khyanalt/tulburTootsoo/khungulult",
      "/khyanalt/medegdel",
      "/khyanalt/tulburTootsoo/guilgeeniiTuukh",
    ],
  },
];

export function undsenKhuudasOlyo(url) {
  if (url.includes("khyanalt/tokhirgoo")) return "khyanalt/tokhirgoo";
  if (!!tsonknuud.find((a) => url === a.key))
    return tsonknuud.find((a) => url === a.key)?.key;
  return tsonknuud.find((a) => url.includes(a.key))?.key;
}

export function ekhniiTsonkhruuOchyo(ajiltan, token) {
  uilchilgee(token)
    .post("/erkhiinMedeelelAvya")
    .then(({ data }) => {
      localStorage.setItem(
        "baiguulgiinErkhiinJagsaalt",
        JSON.stringify(data?.moduluud),
      );
      var AdminErkhShalgakh = data?.moduluud?.find(
        (b) => b.zam === "/khyanalt/irtsqr",
      );
      var erkhShalgakh = ajiltan.tsonkhniiErkhuud.filter((element) => {
        return data?.moduluud?.find((b) => b.zam === element);
      });
      if (ajiltan?.erkh === "Admin") {
        if (AdminErkhShalgakh !== undefined) {
          toast.success(t("Тавтай морил"), {
            duration: 3000,
          });
          window.location.href = "/khyanalt/irtsqr";
        } else if (data?.moduluud?.length > 0) {
          toast.success(t("Тавтай морил"), {
            duration: 3000,
          });
          window.location.href = data?.moduluud[0]?.zam;
        } else {
          toast.warning("Байгууллагын эрхийн тохиргоог шалгуулна уу", {
            duration: 5000,
          });
        }
      } else if (erkhShalgakh.length > 0) {
        toast.success(t("Тавтай морил"), {
          duration: 3000,
        });
        window.location.href = erkhShalgakh[0];
      } else if (ajiltan?.tsonkhniiErkhuud?.length > 0) {
        // If user has permissions but they don't match modules, redirect to first permission anyway
        toast.success(t("Тавтай морил"), {
          duration: 3000,
        });
        window.location.href = ajiltan.tsonkhniiErkhuud[0];
      } else {
        toast.error("Ажилтны эрхийн тохиргоо хийгдээгүй байна", {
          duration: 5000,
        });
      }
    })
    .catch(aldaaBarigch);
}

export const khuudasnuud = [
  {
    ner: "ИРЦ",
    khuudasniiNer: "irts",
    href: "/khyanalt/irtsqr",
    icon: <FiHome className="text-2xl" />,
    align: "center",
  },
  {
    ner: "Ажилтан бүртгэл",
    khuudasniiNer: "ajiltanBurtgel",
    href: "/khyanalt/ajiltan/ajiltanBurtgel",
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
        className="feather feather-users"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
];

function useErkh(ajiltan, baiguulgiinErkhiinJagsaalt) {
  if (!ajiltan) return [];
  var erkhteiTsonkhnuud = khuudasnuud.filter((a) => {
    if (a.href === "/khyanalt/daalgavar/admin") {
      a.href = "/khyanalt/daalgavar";
    }
    return baiguulgiinErkhiinJagsaalt?.find(
      (b) =>
        b.zam === a.href || (a.sub && a.sub?.find((c) => c.href === b.zam)),
    );
  });
  erkhteiTsonkhnuud.forEach((a) => {
    if (a.sub && a.sub.length > 0) {
      a.sub = a.sub.filter((d) =>
        baiguulgiinErkhiinJagsaalt.find((e) => e.zam === d.href),
      );
    }
  });
  return erkhteiTsonkhnuud
    ?.map((x) => {
      if (x.href.includes("khyanalt/tokhirgoo")) return x;
      if (ajiltan.erkh === "Admin") {
        if (x.href === "/khyanalt/daalgavar")
          x.href = "/khyanalt/daalgavar/admin";
        return x;
      } else if (x.sub?.length > 0) {
        x.sub = x.sub.filter(
          (g) => !!ajiltan?.tsonkhniiErkhuud?.find((a) => a === g.href),
        );
        return x;
      } else if (!!ajiltan?.tsonkhniiErkhuud?.find((a) => x.href === a))
        return x;
    })
    .filter((x) => !!x);
}

export default useErkh;
