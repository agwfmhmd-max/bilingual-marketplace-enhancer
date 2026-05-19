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
  adTitlePh: { ar: "مثال: سيارة تويوتا 2018", fr: "Ex : Toyota 2018" },
  description: { ar: "الوصف *", fr: "Description *" },
  descriptionPh: { ar: "تفاصيل الإعلان...", fr: "Détails de l'annonce..." },
  price: { ar: "السعر (MRU) *", fr: "Prix (MRU) *" },
  whatsapp: { ar: "رقم واتساب *", fr: "Numéro WhatsApp *" },
  whatsappPh: { ar: "22200000000", fr: "22200000000" },
  selectCity: { ar: "اختر مدينة", fr: "Choisir une ville" },
  selectCategory: { ar: "اختر فئة", fr: "Choisir une catégorie" },
  cityNamePh: { ar: "اسم المدينة", fr: "Nom de la ville" },
  categoryNamePh: { ar: "اسم الفئة", fr: "Nom de la catégorie" },
  addCity: { ar: "إضافة مدينة", fr: "Ajouter une ville" },
  addCategory: { ar: "إضافة فئة", fr: "Ajouter une catégorie" },
  images: { ar: "الصور * (حد أقصى 8)", fr: "Images * (max 8)" },
  uploadImages: { ar: "اضغط لاختيار الصور", fr: "Cliquez pour choisir des images" },
  publish: { ar: "نشر الإعلان", fr: "Publier l'annonce" },
  add: { ar: "إضافة", fr: "Ajouter" },
  cancel: { ar: "إلغاء", fr: "Annuler" },
  errTitleShort: { ar: "العنوان قصير", fr: "Le titre est trop court" },
  errDescShort: { ar: "الوصف قصير", fr: "La description est trop courte" },
  errPriceInvalid: { ar: "السعر غير صالح", fr: "Prix invalide" },
  errWhatsappInvalid: { ar: "رقم غير صالح", fr: "Numéro invalide" },
  errChooseCity: { ar: "اختر المدينة", fr: "Choisissez une ville" },
  errChooseCategory: { ar: "اختر الفئة", fr: "Choisissez une catégorie" },
  errAddImage: { ar: "أضف صورة واحدة على الأقل", fr: "Ajoutez au moins une image" },
  errCityAdd: { ar: "تعذر إضافة المدينة", fr: "Impossible d'ajouter la ville" },
  okCityAdd: { ar: "تمت إضافة المدينة", fr: "Ville ajoutée" },
  errCategoryAdd: { ar: "تعذر إضافة الفئة", fr: "Impossible d'ajouter la catégorie" },
  okCategoryAdd: { ar: "تمت إضافة الفئة", fr: "Catégorie ajoutée" },
  errGeneric: { ar: "حدث خطأ أثناء النشر", fr: "Une erreur s'est produite lors de la publication" },

  // ad detail
  contactWhatsapp: { ar: "تواصل عبر واتساب", fr: "Contacter via WhatsApp" },
  upgradeThisAd: { ar: "ترقية هذا الإعلان إلى مميز", fr: "Mettre cette annonce en vedette" },
  adNotFound: { ar: "الإعلان غير موجود", fr: "Annonce introuvable" },
  featuredAd: { ar: "إعلان مميز", fr: "Annonce en vedette" },
  waGreeting: { ar: "السلام عليكم، بخصوص إعلانك: ", fr: "Bonjour, à propos de votre annonce : " },

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
  okSent: { ar: "تم الإرسال", fr: "Envoyé avec succès" },
  noAdsToUpgrade: { ar: "ليس لديك إعلانات قابلة للترقية", fr: "Vous n'avez pas d'annonces à mettre en vedette" },
  freeDisabledTitle: { ar: "النشر المجاني معطل حاليًا", fr: "La publication gratuite est désactivée" },
  freeDisabledDesc: { ar: "لإتمام نشر هذا الإعلان يجب دفع المبلغ التالي وإرفاق إثبات الدفع", fr: "Pour publier cette annonce, veuillez payer le montant suivant et joindre la preuve" },
  payAndPublish: { ar: "ادفع وانشر الإعلان", fr: "Payer et publier l'annonce" },

  // admin
  adminTitle: { ar: "لوحة المشرف", fr: "Tableau de bord" },
  tabAds: { ar: "الإعلانات", fr: "Annonces" },
  tabPayments: { ar: "المدفوعات", fr: "Paiements" },
  tabSettings: { ar: "الإعدادات", fr: "Paramètres" },
  inactive: { ar: "معطل", fr: "Désactivée" },
  removeFeatured: { ar: "إزالة تمييز", fr: "Retirer la vedette" },
  feature: { ar: "تمييز", fr: "Mettre en vedette" },
  disable: { ar: "تعطيل", fr: "Désactiver" },
  enable: { ar: "تفعيل", fr: "Activer" },
  confirmDelete: { ar: "حذف هذا الإعلان نهائيًا؟", fr: "Supprimer définitivement cette annonce ?" },
  okDeleted: { ar: "تم الحذف", fr: "Supprimé" },
  okAdDisabled: { ar: "تم تعطيل الإعلان", fr: "Annonce désactivée" },
  okAdEnabled: { ar: "تم تفعيل الإعلان", fr: "Annonce activée" },
  okFeatureRemoved: { ar: "تم إزالة التمييز", fr: "Vedette retirée" },
  okFeatured: { ar: "تم تمييز الإعلان", fr: "Annonce mise en vedette" },
  noPayments: { ar: "لا توجد مدفوعات", fr: "Aucun paiement" },
  paymentProofLabel: { ar: "إثبات الدفع", fr: "Preuve de paiement" },
  zoom: { ar: "تكبير الصورة", fr: "Agrandir l'image" },
  approve: { ar: "موافقة", fr: "Approuver" },
  reject: { ar: "رفض", fr: "Rejeter" },
  approved: { ar: "مقبول", fr: "Approuvé" },
  rejected: { ar: "مرفوض", fr: "Rejeté" },
  pending: { ar: "قيد المراجعة", fr: "En attente" },
  noteLabel: { ar: "ملاحظة", fr: "Note" },
  okApproved: { ar: "تمت الموافقة والإعلان أصبح مميزًا", fr: "Approuvé, annonce mise en vedette" },
  okRejected: { ar: "تم رفض الطلب", fr: "Demande rejetée" },
  proPrice: { ar: "سعر PRO (MRU)", fr: "Prix PRO (MRU)" },
  paymentPhone: { ar: "رقم الدفع", fr: "Numéro de paiement" },
  enableFreePosts: { ar: "تفعيل النشر المجاني", fr: "Activer la publication gratuite" },
  enableFreePostsDesc: { ar: "عند الإيقاف لا يستطيع المستخدمون نشر إعلانات مجانية", fr: "Lorsqu'il est désactivé, les utilisateurs ne peuvent pas publier d'annonces gratuites" },
  saveSettings: { ar: "حفظ الإعدادات", fr: "Enregistrer" },
  okSettingsSaved: { ar: "تم حفظ الإعدادات", fr: "Paramètres enregistrés" },
  errSaveSettings: { ar: "فشل الحفظ", fr: "Échec de l'enregistrement" },
  errOpenProof: { ar: "تعذّر فتح صورة الإثبات", fr: "Impossible d'ouvrir l'image" },
  openInNewTab: { ar: "فتح في تبويب جديد", fr: "Ouvrir dans un nouvel onglet" },
  download: { ar: "تحميل", fr: "Télécharger" },

  // admin login dialog
  adminLogin: { ar: "دخول المشرف", fr: "Connexion administrateur" },
  adminLoginDesc: { ar: "قم بإدخال بيانات المشرف للوصول إلى لوحة التحكم.", fr: "Saisissez vos identifiants pour accéder au tableau de bord." },
  email: { ar: "البريد الإلكتروني", fr: "Adresse e-mail" },
  password: { ar: "كلمة المرور", fr: "Mot de passe" },
  login: { ar: "دخول", fr: "Se connecter" },
  errInvalid: { ar: "بيانات غير صحيحة", fr: "Identifiants incorrects" },
  errNotAdmin: { ar: "هذا الحساب لا يملك صلاحيات المشرف", fr: "Ce compte n'a pas les droits administrateur" },
  okWelcome: { ar: "مرحبًا بك في لوحة المشرف", fr: "Bienvenue dans le tableau de bord" },

  // 404
  pageNotFound: { ar: "الصفحة غير موجودة", fr: "Page introuvable" },
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
    fmtNumber: (n) => Number(n).toLocaleString("en-US"),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
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
