import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdCard, type Ad } from "@/components/AdCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elmersa / المرصة" },
      { name: "description", content: "Annonces Mauritanie - إعلانات موريتانيا" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  const [ads, setAds] = useState<Ad[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityId, setCityId] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    supabase.from("cities").select("id,name").order("name").then(({ data }) => setCities(data || []));
    supabase.from("categories").select("id,name").order("name").then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      let q = supabase
        .from("ads")
        .select("id,title,description,price,whatsapp,images,is_featured,created_at,city:cities(name),category:categories(name),city_id,category_id")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(60);
      if (cityId !== "all") q = q.eq("city_id", cityId);
      if (categoryId !== "all") q = q.eq("category_id", categoryId);
      if (minPrice) q = q.gte("price", Number(minPrice));
      if (maxPrice) q = q.lte("price", Number(maxPrice));
      const { data } = await q;
      setAds((data as any) || []);
      setLoading(false);
    };
    fetchAds();
  }, [cityId, categoryId, minPrice, maxPrice]);

  const filtered = useMemo(() => {
    if (!search.trim()) return ads;
    const s = search.trim().toLowerCase();
    return ads.filter((a) => a.title.toLowerCase().includes(s) || a.description.toLowerCase().includes(s));
  }, [ads, search]);

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-6 overflow-hidden rounded-2xl bg-[var(--gradient-primary)] p-6 text-primary-foreground shadow-[var(--shadow-elevated)] sm:p-10">
        <h1 className="text-2xl font-extrabold sm:text-4xl">{t("heroTitle")}</h1>
        <p className="mt-2 max-w-2xl text-sm opacity-90 sm:text-base">{t("heroSubtitle")}</p>
        <div className="relative mt-5 max-w-2xl">
          <Search className="absolute start-3 top-1/2 size-5 -translate-y-1/2 text-primary" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 ps-10 text-base text-foreground shadow-lg"
          />
        </div>
      </section>

      <div className="mb-4 grid gap-2 rounded-xl border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <Select value={cityId} onValueChange={setCityId}>
          <SelectTrigger><SelectValue placeholder={t("city")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCities")}</SelectItem>
            {cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger><SelectValue placeholder={t("category")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="number" placeholder={t("priceFrom")} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input type="number" placeholder={t("priceTo")} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <Input placeholder={t("searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
          <SlidersHorizontal className="mx-auto mb-3 size-8" />
          {t("noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((ad) => <AdCard key={ad.id} ad={ad} />)}
        </div>
      )}
    </div>
  );
}
