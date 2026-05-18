import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "fr";

type Dict = Record<string, { ar: string; fr: string }>;

export const T: Dict = {
  // header / nav
  brand: { ar: "المرصة", fr: "Elmersa" },
  tagline: { ar: "إعلانات موريتانيا", fr: "Annonces Mauritanie" },
  home: { ar: "الرئيسية", fr: "Accueil" },
  addAd: { ar: "إضافة إعلان أو منتج", fr: "Ajouter une annonce ou un produit" },
  adminPanel: { ar: "لوحة المشرف", fr: "Tableau de bord" },
  logout: { ar: "تسجيل خروج", fr: "Déconnexion" },
  language: { ar: "اللغة", fr: "Langue" },

  // home
  heroTitle: { ar: "منصة المرصة", fr: "Plateforme Elmersa" },
  heroSubtitle: {
    ar: "أكبر منصة إعلانات في موريتانيا: بيع، كراء، خدمات. انشر إعلانك مجانًا الآن.",
    fr: "La plus grande plateforme d'annonces en Mauritanie : vente, location, services. Publiez gratuitement.",
  },
  searchPlaceholder: { ar: "ابحث عن إعلان أو منتج...", fr: "Rechercher une annonce ou un produit..." },
  city: { ar: "المدينة", fr: "Ville" },
  allCities: { ar: "كل المدن", fr: "Toutes les villes" },
  category: { ar: "الفئة", fr: "Catégorie" },
  allCategories: { ar: "كل الفئات", fr: "Toutes les catégories" },
  priceFrom: { ar: "السعر من", fr: "Prix min" },
  priceTo: { ar: "إلى", fr: "Prix max" },
  noResults: { ar: "لا توجد إعلانات مطابقة.", fr: "Aucune annonce correspondante." },
  featured: { ar: "مميز", fr: "Vedette" },
  noImage: { ar: "لا توجد صورة", fr: "Pas d'image" },

  // post ad
  postAdTitle: { ar: "إضافة إعلان أو منتج جديد", fr: "Ajouter une annonce ou un produit" },
  goPro: { ar: "لجعل إعلانك يظهر في الأعلى، انتقل إلى خطة PRO", fr: "Pour mettre votre annonce en avant, passez au PRO" },
  upgradeToPro: { ar: "ترقية إلى PRO", fr: "Passer au PRO" },
  adTitle: { ar: "عنوان الإعلان *", fr: "Titre de l'annonce *" },
  adTitlePh: { ar: "مثال: سيارة تويوتا 2018", fr: "Ex: Toyota 2018" },
  description: { ar: "الوصف *", fr: "Description *" },
  descriptionPh: { ar: "تفاصيل الإعلان...", fr: "Détails de l'annonce..." },
  price: { ar: "السعر (MRU) *", fr: "Prix (MRU) *" },
  whatsapp: { ar: "رقم واتساب *", fr: "Numéro WhatsApp *" },
  selectCity: { ar: "اختر مدينة", fr: "Choisir une ville" },
  selectCategory: { ar: "اختر فئة", fr: "Choisir une catégorie" },
  images: { ar: "الصور * (حد أقصى 8)", fr: "Images * (max 8)" },
  uploadImages: { ar: "اضغط لاختيار الصور", fr: "Cliquez pour choisir des images" },
  publish: { ar: "نشر الإعلان", fr: "Publier" },
  add: { ar: "إضافة", fr: "Ajouter" },
  cancel: { ar: "إلغاء", fr: "Annuler" },

  // ad detail
  contactWhatsapp: { ar: "تواصل عبر واتساب", fr: "Contacter via WhatsApp" },
  upgradeThisAd: { ar: "ترقية هذا الإعلان إلى مميز", fr: "Mettre cette annonce en vedette" },
  adNotFound: { ar: "الإعلان غير موجود", fr: "Annonce introuvable" },
  featuredAd: { ar: "إعلان مميز", fr: "Annonce en vedette" },

  // upgrade
  upgradePro: { ar: "ترقية إلى PRO", fr: "Passer au PRO" },
  upgradeDesc: { ar: "إعلانك يظهر في الأعلى ويتلقى مشاهدات أكثر", fr: "Votre annonce sera mise en avant et obtiendra plus de vues" },
  upgradePrice: { ar: "سعر الترقية", fr: "Prix de la mise en avant" },
  amountDue: { ar: "المبلغ الذي يجب دفعه", fr: "Montant à payer" },
  paymentMethods: { ar: "طرق الدفع المتاحة", fr: "Méthodes de paiement disponibles" },
  sendAmountTo: { ar: "أرسل المبلغ إلى الرقم", fr: "Envoyez le montant au numéro" },
  copy: { ar: "نسخ", fr: "Copier" },
  sendProof: { ar: "إرسال إثبات الدفع", fr: "Envoyer la preuve de paiement" },
  adToUpgrade: { ar: "الإعلان المراد ترقيته *", fr: "Annonce à mettre en vedette *" },
  chooseAd: { ar: "اختر إعلانك", fr: "Choisir votre annonce" },
  paymentMethod: { ar: "طريقة الدفع *", fr: "Méthode de paiement *" },
  paymentProof: { ar: "صورة إثبات الدفع *", fr: "Image de la preuve *" },
  notes: { ar: "ملاحظات", fr: "Notes" },
  send: { ar: "إرسال", fr: "Envoyer" },
  noAdsToUpgrade: { ar: "ليس لديك إعلانات قابلة للترقية", fr: "Vous n'avez pas d'annonces à mettre en vedette" },
  freeDisabledTitle: { ar: "النشر المجاني معطل حاليًا", fr: "La publication gratuite est désactivée" },
  freeDisabledDesc: { ar: "لإتمام نشر هذا الإعلان يجب دفع المبلغ التالي وإرفاق إثبات الدفع", fr: "Pour publier cette annonce, veuillez payer le montant suivant et joindre la preuve" },
  payAndPublish: { ar: "ادفع وانشر الإعلان", fr: "Payer et publier" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof typeof T) => string;
  dir: "rtl" | "ltr";
  fmtNumber: (n: number | string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    return (localStorage.getItem("lang") as Lang) || "ar";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const value: I18nCtx = {
    lang,
    setLang,
    t: (k) => T[k]?.[lang] ?? String(k),
    dir: lang === "ar" ? "rtl" : "ltr",
    // Always use Western (French) digits — explicit user request
    fmtNumber: (n) => Number(n).toLocaleString("en-US"),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe fallback if used outside provider
    return {
      lang: "ar",
      setLang: () => {},
      t: (k) => T[k]?.ar ?? String(k),
      dir: "rtl",
      fmtNumber: (n) => Number(n).toLocaleString("en-US"),
    };
  }
  return ctx;
}

// Tracks which ads were posted from this device (ownership without DB changes)
export const ownership = {
  add(adId: string) {
    if (typeof window === "undefined") return;
    const list = ownership.list();
    if (!list.includes(adId)) {
      list.push(adId);
      localStorage.setItem("ownedAds", JSON.stringify(list));
    }
  },
  list(): string[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ownedAds") || "[]");
    } catch {
      return [];
    }
  },
  owns(adId: string): boolean {
    return ownership.list().includes(adId);
  },
};
