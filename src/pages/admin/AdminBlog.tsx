import { useEffect, useState } from "react";
import { supabase } from "@/data/legacy/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff, Rss } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  status: string;
  published_at: string | null;
  reading_minutes: number | null;
  meta_description: string | null;
}

const empty: Partial<BlogPost> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "translation",
  tags: [],
  status: "draft",
  reading_minutes: 5,
  meta_description: "",
};

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("فشل تحميل المقالات");
    setPosts((data ?? []) as BlogPost[]);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.title || !editing?.slug || !editing?.content) {
      toast.error("العنوان والرابط والمحتوى مطلوبة");
      return;
    }
    const payload: any = {
      ...editing,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published_at:
        editing.status === "published" && !editing.published_at
          ? new Date().toISOString()
          : editing.published_at,
    };
    delete payload.id;

    const op = editing.id
      ? supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : supabase.from("blog_posts").insert(payload);

    const { error } = await op;
    if (error) {
      toast.error(`خطأ: ${error.message}`);
      return;
    }
    toast.success(editing.id ? "تم التحديث" : "تم الإنشاء");
    setEditing(null);
    setTagsInput("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف هذا المقال نهائياً؟")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("تم الحذف");
      load();
    }
  };

  const togglePublish = async (p: BlogPost) => {
    const newStatus = p.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: newStatus,
        published_at:
          newStatus === "published" && !p.published_at
            ? new Date().toISOString()
            : p.published_at,
      })
      .eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success(newStatus === "published" ? "تم النشر" : "تم إلغاء النشر");
      load();
    }
  };

  const startEdit = (p?: BlogPost) => {
    setEditing(p ? { ...p } : { ...empty });
    setTagsInput((p?.tags ?? []).join(", "));
  };

  const rssUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/rss-feed`;

  return (
    <div className="container mx-auto p-6 max-w-6xl" dir="rtl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">إدارة المدونة</h1>
          <p className="text-muted-foreground text-sm mt-1">
            المقالات المنشورة تظهر تلقائياً في RSS
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <a href={rssUrl} target="_blank" rel="noopener noreferrer">
              <Rss className="h-4 w-4 ml-2" /> عرض RSS
            </a>
          </Button>
          <Button onClick={() => startEdit()}>
            <Plus className="h-4 w-4 ml-2" /> مقال جديد
          </Button>
        </div>
      </div>

      {editing && (
        <Card className="p-6 mb-6 border-primary">
          <h2 className="text-xl font-bold mb-4">
            {editing.id ? "تعديل مقال" : "مقال جديد"}
          </h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>العنوان *</Label>
                <Input
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div>
                <Label>الرابط المختصر (slug) *</Label>
                <Input
                  value={editing.slug || ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="my-article-slug"
                />
              </div>
            </div>

            <div>
              <Label>الملخص</Label>
              <Textarea
                rows={2}
                value={editing.excerpt || ""}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              />
            </div>

            <div>
              <Label>المحتوى الكامل (HTML) *</Label>
              <Textarea
                rows={10}
                value={editing.content || ""}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>التصنيف</Label>
                <select
                  className="w-full border rounded-md p-2 bg-background"
                  value={editing.category || "general"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  <option value="translation">ترجمة</option>
                  <option value="research">أبحاث</option>
                  <option value="news">أخبار</option>
                  <option value="general">عام</option>
                </select>
              </div>
              <div>
                <Label>الحالة</Label>
                <select
                  className="w-full border rounded-md p-2 bg-background"
                  value={editing.status || "draft"}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
              <div>
                <Label>دقائق القراءة</Label>
                <Input
                  type="number"
                  value={editing.reading_minutes || 5}
                  onChange={(e) =>
                    setEditing({ ...editing, reading_minutes: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div>
              <Label>صورة الغلاف (URL)</Label>
              <Input
                value={editing.cover_image || ""}
                onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
              />
            </div>

            <div>
              <Label>الكلمات المفتاحية (مفصولة بفاصلة)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ترجمة, بحث, SPSS"
              />
            </div>

            <div>
              <Label>وصف SEO</Label>
              <Textarea
                rows={2}
                value={editing.meta_description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, meta_description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={save}>حفظ</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>إلغاء</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3">
        {posts.map((p) => (
          <Card key={p.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={p.status === "published" ? "default" : "secondary"}>
                  {p.status === "published" ? "منشور" : p.status === "draft" ? "مسودة" : "مؤرشف"}
                </Badge>
                <Badge variant="outline">{p.category}</Badge>
              </div>
              <h3 className="font-bold truncate">{p.title}</h3>
              <p className="text-sm text-muted-foreground truncate">/{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => togglePublish(p)}>
                {p.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">لا توجد مقالات بعد</p>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
