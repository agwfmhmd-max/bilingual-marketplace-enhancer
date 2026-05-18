import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, MessageCircle, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, ownership } from "@/lib/i18n";

export const Route = createFileRoute("/ad/$adId")({
  component: AdDetailPage,
});

function AdDetailPage() {
  const { adId } = Route.useParams();
  const { t, fmtNumber, lang } = useI18n();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase
      .from("ads")
      .select("*, city:cities(name), category:categories(name)")
      .eq("id", adId)
      .single()
      .then(({ data }) => {
        setAd(data);
        setLoading(false);
      });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
          setIsAdmin(!!data?.some((r: any) => r.role === "admin"));
        });
      }
    });
  }, [adId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!ad) return <div className="container mx-auto p-8 text-center">{t("adNotFound")}</div>;

  const isOwner = ownership.owns(ad.id);
  const canUpgrade = (isOwner || isAdmin) && !ad.is_featured;
  const waLink = `https://wa.me/${ad.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    (lang === "ar" ? "السلام عليكم، بخصوص إعلانك: " : "Bonjour, à propos de votre annonce : ") + ad.title
  )}`;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="aspect-[4/3] bg-muted">
              {ad.images?.[activeImg] ? (
                <img src={ad.images[activeImg]} alt={ad.title} className="size-full object-contain" />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">{t("noImage")}</div>
              )}
            </div>
            {ad.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-2">
                {ad.images.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`size-16 shrink-0 overflow-hidden rounded-md border-2 ${i === activeImg ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            {ad.is_featured && (
              <div className="inline-flex items-center gap-1 rounded-full bg-warning px-3 py-1 text-xs font-bold text-warning-foreground">
                <Star className="size-3 fill-current" /> {t("featuredAd")}
              </div>
            )}
            <h1 className="text-2xl font-extrabold">{ad.title}</h1>
            <div className="text-3xl font-extrabold text-primary" dir="ltr">
              {fmtNumber(ad.price)} <span className="text-sm font-medium text-muted-foreground">MRU</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> {ad.city?.name}</span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{ad.category?.name}</span>
              <span className="inline-flex items-center gap-1"><Calendar className="size-4" /> {new Date(ad.created_at).toLocaleDateString(lang === "ar" ? "ar" : "fr-FR")}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7">{ad.description}</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full bg-success text-success-foreground hover:bg-success/90" size="lg">
                <MessageCircle className="size-5" /> {t("contactWhatsapp")}
              </Button>
            </a>
            {canUpgrade && (
              <Link to="/upgrade" search={{ ad: ad.id } as any} className="block">
                <Button variant="outline" className="w-full border-warning text-warning" size="lg">
                  <Star className="size-4" /> {t("upgradeThisAd")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
