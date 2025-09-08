import React, { useEffect, useMemo, useState } from 'react';
import { certificationsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, Plus, Trash2, UploadCloud } from 'lucide-react';

type CertType = 'COURSE' | 'INTERNSHIP';

const Certifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [active, setActive] = useState<CertType>('COURSE');
  const [allItems, setAllItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const load = async () => {
    if (!user?.email) return;
    const res = await certificationsApi.my(user.email);
    if (res.success) {
      setAllItems(res.data || []);
    } else {
      toast({ title: 'Error', description: res.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const filtered = useMemo(() => {
    const byType = allItems.filter((x: any) => active === 'COURSE' ? x.category === 'CERT_COURSE' : x.category === 'CERT_INTERNSHIP');
    if (!search.trim()) return byType;
    const q = search.toLowerCase();
    return byType.filter((x: any) => (x.title || '').toLowerCase().includes(q) || (x.description || '').toLowerCase().includes(q));
  }, [allItems, active, search]);

  const onUpload = async () => {
    if (!user?.email || !file || !title.trim()) {
      toast({ title: 'Missing info', description: 'Title and file are required', variant: 'destructive' });
      return;
    }
    setIsUploading(true);
    try {
      const form = new FormData();
      form.append('userEmail', user.email);
      form.append('type', active);
      form.append('title', title);
      if (desc) form.append('description', desc);
      form.append('file', file);
      const res = await certificationsApi.upload(form);
      if (res.success) {
        setTitle(''); setDesc(''); setFile(null);
        toast({ title: 'Uploaded', description: 'Certification saved' });
        await load();
      } else {
        toast({ title: 'Error', description: res.message, variant: 'destructive' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!user?.email) return;
    const res = await certificationsApi.delete(id, user.email);
    if (res.success) {
      toast({ title: 'Deleted' });
      load();
    } else {
      toast({ title: 'Error', description: res.message, variant: 'destructive' });
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Certifications</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your course and internship certifications.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={active} onValueChange={(v) => setActive(v as CertType)}>
          <TabsList>
            <TabsTrigger value="COURSE">Courses</TabsTrigger>
            <TabsTrigger value="INTERNSHIP">Internships</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <Input
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-3"
            />
          </div>
          <Button variant="default" onClick={() => setShowUpload((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" />
            Add certification
            <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
          </Button>
        </div>
      </div>

      {/* Upload panel (inline, not a card) */}
      {showUpload && (
        <div className="mt-4 rounded-xl border bg-background/50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
            <div className="sm:col-span-2">
              <Textarea placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowUpload(false); }}>
              Cancel
            </Button>
            <Button onClick={onUpload} disabled={isUploading}>
              <UploadCloud className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        </div>
      )}

      {/* List header */}
      <div className="mt-6 text-xs uppercase text-muted-foreground tracking-wider">{filtered.length} item{filtered.length === 1 ? '' : 's'}</div>
      <Separator className="my-2" />

      {/* Items list - modern rows, no cards */}
      <div className="divide-y rounded-xl border">
        {filtered.map((it: any) => (
          <div key={it.id} className="group flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-base font-medium">{it.title}</span>
                <Badge variant="secondary" className="uppercase">
                  {it.category === 'CERT_INTERNSHIP' ? 'Internship' : 'Course'}
                </Badge>
                {it.status && (
                  <Badge className="uppercase">{it.status}</Badge>
                )}
              </div>
              {it.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{it.description}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {it.startDate && <span>Start: {it.startDate}</span>}
                {it.endDate && <span>End: {it.endDate}</span>}
                {it.createdAt && <span>Added: {new Date(it.createdAt).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button variant="destructive" size="sm" onClick={() => onDelete(it.id)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-16 text-center text-muted-foreground">
            No certifications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Certifications;


