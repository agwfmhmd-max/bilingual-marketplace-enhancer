import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Upload, X, Crown, Copy } from "lucide-react";
import { z } from "zod";
import { useI18n, ownership } from "@/lib/i18n";

const PAYMENT_METHODS = ["بنكيلي", "السداد مصرفي", "كليك", "رصيدي", "أمانتي"];

export const Route = createFileRoute("/post-ad")({
  head: () => ({
    meta: [{ title: "Add ad or product - Elmersa" }, { name: "description", content: "Publish your ad for free on Elmersa." }],
  }),
  component: PostAdPage,
});

const schema = z.object({
  title: z.string().trim().min(3, "errTitleShort").max(120),
  description: z.string().trim().min(10, "errDescShort").max(2000),
  price: z.number().min(0, "errPriceInvalid"),
  whatsapp: z.string().trim().min(6, "errWhatsappInvalid").max(20),
});

function PostAdPage() {
  const navigate = useNavigate();
  const { t, fmtNumber } = useI18n();
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [settings, setSettings] = useState<{ pro_price: number; free_post_enabled: boolean; payment_phone: string } | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cityId, setCityId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [newCity, setNewCity] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [addingCity, setAddingCity] = useState(false);
  const [addingCat, setAddingCat] = useState(false);

  // Inline payment (shown when free posting is disabled)
  const [payMethod, setPayMethod] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [payNotes, setPayNotes] = useState("");

  const freeDisabled = !!settings && !settings.free_post_enabled;

  const copyPhone = () => {
    if (!settings) return;
    navigator.clipboard.writeText(settings.payment_phone);
    toast.success(t("copy"));
  };

  useEffect(() => {
    supabase.from("cities").select("id,name").order("name").then(({ data }) => setCities(data || []));
    supabase.from("categories").select("id,name").order("name").then(({ data }) => setCategories(data || []));
    supabase.from("settings").select("pro_price,free_post_enabled,payment_phone").eq("id", 1).single().then(({ data }) => setSettings(data));
  }, []);

  const addCity = async () => {
    const name = newCity.trim();
    if (!name) return;
    const { data, error } = await supabase.from("cities").insert({ name }).select("id,name").single();
    if (error) { toast.error(t("errCityAdd")); return; }
    setCities((p) => [...p, data].sort((a, b) => a.name.localeCompare(b.name)));
    setCityId(data.id);
    setNewCity("");
    setAddingCity(false);
    toast.success(t("okCityAdd"));
  };

  const addCat = async () => {
    const name = newCategory.trim();
    if (!name) return;
    const { data, error } = await supabase.from("categories").insert({ name }).select("id,name").single();
    if (error) { toast.error(t("errCategoryAdd")); return; }
    setCategories((p) => [...p, data].sort((a, b) => a.name.localeCompare(b.name)));
    setCategoryId(data.id);
    setNewCategory("");
    setAddingCat(false);
    toast.success(t("okCategoryAdd"));
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 8));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ title, description, price: Number(price), whatsapp });
    if (!parsed.success) { toast.error(t(parsed.error.issues[0].message as any)); return; }
    if (!cityId) { toast.error(t("errChooseCity")); return; }
    if (!categoryId) { toast.error(t("errChooseCategory")); return; }
    if (files.length === 0) { toast.error(t("errAddImage")); return; }
    if (freeDisabled) {
      if (!payMethod) { toast.error(t("paymentMethod")); return; }
      if (!proofFile) { toast.error(t("paymentProof")); return; }
    }

    setSubmitting(true);
    try {
      // Upload images
      const urls: string[] = [];
      for (const f of files) {
        const ext = f.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("ads-images").upload(path, f, { cacheControl: "3600", upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("ads-images").getPublicUrl(path);
        urls.push(pub.publicUrl);
      }

      const { data: ad, error } = await supabase.from("ads").insert({
        title: parsed.data.title,
        description: parsed.data.description,
        price: parsed.data.price,
        whatsapp: parsed.data.whatsapp,
        city_id: cityId,
        category_id: categoryId,
        images: urls,
      }).select("id").single();
      if (error) throw error;
      ownership.add(ad.id);

      // If free posting is disabled, also create a payment record for this ad
      if (freeDisabled && settings && proofFile) {
        const ext = proofFile.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("payment-proofs").upload(path, proofFile);
        if (upErr) throw upErr;
        const { data: signed } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 60 * 60 * 24 * 365);
        const proofUrl = signed?.signedUrl || path;
        await supabase.from("payments").insert({
          ad_id: ad.id,
          amount: settings.pro_price,
          method: payMethod,
          proof_url: proofUrl,
          notes: payNotes || null,
        });
      }

      toast.success(t("publish"));
      navigate({ to: "/ad/$adId", params: { adId: ad.id } });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || t("errGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-extrabold">{t("postAdTitle")}</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-warning/40 bg-warning/10 p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Crown className="size-5 text-warning" />
          {t("goPro")}
        </div>
        <Link
          to="/upgrade"
          className="inline-flex items-center gap-1 rounded-md bg-warning px-3 py-2 text-sm font-bold text-warning-foreground shadow hover:opacity-90"
        >
          <Crown className="size-4" /> {t("upgradeToPro")}
        </Link>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <div className="space-y-1.5">
          <Label>{t("adTitle")}</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("adTitlePh")} />
        </div>
        <div className="space-y-1.5">
          <Label>{t("description")}</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder={t("descriptionPh")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{t("price")}</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <Label>{t("whatsapp")}</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={t("whatsappPh")} dir="ltr" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{t("city")} *</Label>
            {addingCity ? (
              <div className="flex gap-2">
                <Input value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder={t("cityNamePh")} />
                <Button type="button" onClick={addCity}>{t("add")}</Button>
                <Button type="button" variant="ghost" onClick={() => setAddingCity(false)}>{t("cancel")}</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={cityId} onValueChange={setCityId}>
                  <SelectTrigger><SelectValue placeholder={t("selectCity")} /></SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={() => setAddingCity(true)} aria-label={t("addCity")}>
                  <Plus className="size-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>{t("category")} *</Label>
            {addingCat ? (
              <div className="flex gap-2">
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder={t("categoryNamePh")} />
                <Button type="button" onClick={addCat}>{t("add")}</Button>
                <Button type="button" variant="ghost" onClick={() => setAddingCat(false)}>{t("cancel")}</Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder={t("selectCategory")} /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={() => setAddingCat(true)} aria-label={t("addCategory")}>
                  <Plus className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>{t("images")}</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 p-6 text-sm text-muted-foreground hover:bg-muted/50">
            <Upload className="size-6" />
            {t("uploadImages")}
            <input type="file" multiple accept="image/*" onChange={onFiles} className="hidden" />
          </label>
          {files.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md border">
                  <img src={URL.createObjectURL(f)} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {freeDisabled && settings && (
          <div className="space-y-4 rounded-xl border-2 border-warning bg-warning/5 p-4">
            <div className="text-center">
              <div className="font-bold text-warning">{t("freeDisabledTitle")}</div>
              <p className="mt-1 text-xs text-muted-foreground">{t("freeDisabledDesc")}</p>
            </div>
            <div className="rounded-lg bg-warning/15 p-3 text-center">
              <div className="text-xs text-muted-foreground">{t("amountDue")}</div>
              <div className="text-3xl font-extrabold text-warning" dir="ltr">
                {fmtNumber(settings.pro_price)} <span className="text-base text-muted-foreground">MRU</span>
              </div>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <div className="mb-2 text-xs font-semibold">{t("paymentMethods")}</div>
              <div className="mb-3 flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <span key={m} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">{m}</span>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-md bg-background p-2">
                <div>
                  <div className="text-[10px] text-muted-foreground">{t("sendAmountTo")}</div>
                  <div className="text-lg font-extrabold" dir="ltr">{settings.payment_phone}</div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={copyPhone}><Copy className="size-4" /> {t("copy")}</Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t("paymentMethod")}</Label>
              <Select value={payMethod} onValueChange={setPayMethod}>
                <SelectTrigger><SelectValue placeholder={t("paymentMethod")} /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("paymentProof")}</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 p-4 text-sm text-muted-foreground hover:bg-muted/50">
                <Upload className="size-5" />
                {t("uploadImages")}
                <input type="file" accept="image/*" onChange={(e) => setProofFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {proofFile && (
                <div className="relative mt-2 inline-block">
                  <img src={URL.createObjectURL(proofFile)} alt="" className="h-32 rounded-md border" />
                  <button type="button" onClick={() => setProofFile(null)} className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground">
                    <X className="size-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>{t("notes")}</Label>
              <Input value={payNotes} onChange={(e) => setPayNotes(e.target.value)} />
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting} size="lg">
          {submitting && <Loader2 className="size-4 animate-spin" />} {freeDisabled ? t("payAndPublish") : t("publish")}
        </Button>
      </form>
    </div>
  );
}
