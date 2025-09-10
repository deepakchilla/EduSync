import { useEffect, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, MessageSquare, User, BookOpen } from "lucide-react";
import { chatApi } from "@/services/api";

interface Thread {
  id: number;
  facultyName: string;
  subject?: string;
  lastMessage: string;
  lastAt: string;
}

interface ChatMessage {
  id: number;
  sender: "student" | "faculty";
  content: string;
  at: string;
}

export default function Chat() {
  const { isAuthenticated, user } = useAuth();
  const [isLoading] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadId, setThreadId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number>(1);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({
    1: [
      { id: 1, sender: "faculty", content: "Hi! Do you have doubts in DSA?", at: "10:00" },
      { id: 2, sender: "student", content: "Yes, trees traversal order.", at: "10:03" },
      { id: 3, sender: "faculty", content: "Start with inorder and practice.", at: "10:05" },
    ],
    2: [
      { id: 1, sender: "faculty", content: "Your ER diagram looks good.", at: "14:10" },
      { id: 2, sender: "student", content: "Thank you, professor!", at: "14:20" },
    ],
  });
  const [draft, setDraft] = useState<string>("");

  const currentThread = threads.find(t => t.id === activeId);
  const currentMessages = messages[activeId] ?? [];

  const handleSend = async () => {
    if (!draft.trim() || !threadId || !user?.id) return;
    try {
      await chatApi.sendMessage(threadId, user.id as any, 'STUDENT', draft.trim());
      const next: ChatMessage = {
        id: (currentMessages.at(-1)?.id ?? 0) + 1,
        sender: "student",
        content: draft.trim(),
        at: new Date().toLocaleTimeString(),
      };
      setMessages({ ...messages, [activeId]: [...currentMessages, next] });
      setDraft("");
    } catch (_e) {
      // Fallback to local append to avoid breaking UI
      const next: ChatMessage = {
        id: (currentMessages.at(-1)?.id ?? 0) + 1,
        sender: "student",
        content: draft.trim(),
        at: new Date().toLocaleTimeString(),
      };
      setMessages({ ...messages, [activeId]: [...currentMessages, next] });
      setDraft("");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Load target counterpart based on role
        // Student should see faculty (e.g., Vijaya)
        // Faculty should see students (e.g., Deepak)
        const isFaculty = user?.role === 'FACULTY';
        const listRes = isFaculty ? await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/chat/students`).then(r=>r.json()) : await chatApi.listFaculty();
        const list = (listRes.data ?? []).map((u: any) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }));
        const target = list[0];
        if (!target) return;

        // Create or reuse a thread
        if (!isFaculty) {
          const created = await chatApi.createThread(user!.id as any, target.id, 'General');
          if (created?.data?.id) {
            setThreadId(created.data.id);
          }
          const initial: Thread = { id: 1, facultyName: target.name, subject: 'General', lastMessage: 'Say hello to start', lastAt: new Date().toLocaleString() };
          setThreads([initial]);
          setActiveId(1);
        } else {
          // Faculty view: show first student (Deepak)
          const initial: Thread = { id: 1, facultyName: list[0].name, subject: 'General', lastMessage: 'Say hello to start', lastAt: new Date().toLocaleString() };
          setThreads([initial]);
          setActiveId(1);
        }
      } catch {
        // keep page usable
      }
    })();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={isAuthenticated} user={user} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading chat...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={isAuthenticated} user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Chat with Faculty</h1>
              <p className="text-muted-foreground">Reach out to your professors anytime</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Threads list */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conversations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {threads.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`w-full text-left border rounded-md p-3 transition ${activeId === t.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 text-white p-2 rounded-md">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{t.facultyName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[180px]">{t.lastMessage}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{t.lastAt}</div>
                  </div>
                  {t.subject && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-blue-900 text-white"><BookOpen className="h-3 w-3 mr-1" /> {t.subject}</Badge>
                    </div>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Chat panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentThread ? `Chat with ${currentThread.facultyName}` : 'Select a conversation'}</span>
                {currentThread?.subject && <Badge variant="secondary">{currentThread.subject}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[50vh] overflow-y-auto rounded-md border bg-muted/30 p-4 space-y-3">
                {currentMessages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-lg text-sm shadow-sm ${m.sender === 'student' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`}>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                      <div className={`text-[10px] mt-1 ${m.sender === 'student' ? 'opacity-80' : 'text-muted-foreground'}`}>{m.at}</div>
                    </div>
                  </div>
                ))}
                {currentMessages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No messages yet</div>
                )}
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!draft.trim()} className="h-10 px-4">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


