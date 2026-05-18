import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Crown, Loader2, Upload, X, Copy } from "lucide-react";
import { useI18n, ownership } from "@/lib/i18n";

export const Route = createFileRoute("/upgrade")({
  head: () => ({ meta: [{ title: "PRO - Elmersa" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    ad: typeof search.ad === "string" ? search.ad : undefined,
  }),
  component: UpgradePage,
});

const PAYMENT_METHODS = ["بنكيلي", "السداد مصرفي", "كليك", "رصيدي", "أمانتي"];

function UpgradePage() {
  const { t, fmtNumber } = useI18n();
  const search = Route.useSearch();
  const [settings, setSettings] = useState<{ pro_price: number; payment_phone: string } | null>(null);
  const [ads, setAds] = useState<{ id: string; title: string }[]>([]);
  const [adId, setAdId] = useState<string>(search.ad || "");
  const [method, setMethod] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("pro_price,payment_phone").eq("id", 1).single().then(({ data }) => setSettings(data));
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let admin = false;
      if (session?.user) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
        admin = !!data?.some((r: any) => r.role === "admin");
        setIsAdmin(admin);
      }
      let q = supabase.from("ads").select("id,title").eq("is_active", true).eq("is_featured", false).order("created_at", { ascending: false }).limit(200);
      if (!admin) {
        const owned = ownership.list();
        if (owned.length === 0) { setAds([]); return; }
        q = q.in("id", owned);
      }
      const { data } = await q;
      setAds(data || []);
    });
  }, []);

  const copyPhone = () => {
    if (!settings) return;
    navigator.clipboard.writeText(settings.payment_phone);
    toast.success(t("copy"));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adId) { toast.error(t("adToUpgrade")); return; }
    if (!method) { toast.error(t("paymentMethod")); return; }
    if (!file) { toast.error(t("paymentProof")); return; }
    if (!settings) return;

    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("payment-proofs").upload(path, file);
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 60 * 60 * 24 * 365);
      const proofUrl = signed?.signedUrl || path;

      const { error } = await supabase.from("payments").insert({
        ad_id: adId,
        amount: settings.pro_price,
        method,
        proof_url: proofUrl,
        notes: notes || null,
      });
      if (error) throw error;

      toast.success(t("send"));
      setAdId(""); setMethod(""); setFile(null); setNotes("");
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 overflow-hidden rounded-2xl bg-[var(--gradient-primary)] p-6 text-primary-foreground shadow-[var(--shadow-elevated)]">
        <div className="flex items-center gap-3">
          <Crown className="size-8" />
          <div>
            <h1 className="text-2xl font-extrabold">{t("upgradePro")}</h1>
            <p className="text-sm opacity-90">{t("upgradeDesc")}</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-white/15 p-4 text-center backdrop-blur">
          <div className="text-xs opacity-90">{t("amountDue")}</div>
          <div className="text-4xl font-extrabold" dir="ltr">
            {settings ? fmtNumber(settings.pro_price) : "..."} <span className="text-lg">MRU</span>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-xl border-2 border-warning bg-warning/10 p-4 text-center">
        <div className="text-sm font-medium text-foreground">{t("amountDue")}</div>
        <div className="mt-1 text-3xl font-extrabold text-warning" dir="ltr">
          {settings ? fmtNumber(settings.pro_price) : "..."} <span className="text-base text-muted-foreground">MRU</span>
        </div>
      </div>

      <div className="mb-4 rounded-xl border bg-card p-5">
        <h2 className="mb-3 font-bold">{t("paymentMethods")}</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <span key={m} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">{m}</span>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
          <div>
            <div className="text-xs text-muted-foreground">{t("sendAmountTo")}</div>
            <div className="text-xl font-extrabold" dir="ltr">{settings?.payment_phone || "..."}</div>
          </div>
          <Button variant="outline" size="sm" onClick={copyPhone}><Copy className="size-4" /> {t("copy")}</Button>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-bold">{t("sendProof")}</h2>
        <div className="space-y-1.5">
          <Label>{t("adToUpgrade")}</Label>
          {!isAdmin && ads.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              {t("noAdsToUpgrade")}
            </div>
          ) : (
            <Select value={adId} onValueChange={setAdId}>
              <SelectTrigger><SelectValue placeholder={t("chooseAd")} /></SelectTrigger>
              <SelectContent>
                {ads.map((a) => <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>{t("paymentMethod")}</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger><SelectValue placeholder={t("paymentMethod")} /></SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t("paymentProof")}</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 p-6 text-sm text-muted-foreground hover:bg-muted/50">
            <Upload className="size-6" />
            {t("uploadImages")}
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
          </label>
          {file && (
            <div className="relative mt-2 inline-block">
              <img src={URL.createObjectURL(file)} alt="" className="h-32 rounded-md border" />
              <button type="button" onClick={() => setFile(null)} className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground">
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>{t("notes")}</Label>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />} {t("send")}
        </Button>
      </form>
    </div>
  );
}
