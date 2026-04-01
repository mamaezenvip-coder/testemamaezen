import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, ArrowLeft, Send, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  last_seen_at: string | null;
  created_at: string;
}

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile | null;
}

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user || !isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  // Load profiles
  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setProfiles(data);
    };
    load();

    // Realtime profiles
    const channel = supabase
      .channel('admin-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  // Load tickets
  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('*, profiles!support_tickets_user_id_fkey(*)')
        .order('updated_at', { ascending: false });
      if (data) setTickets(data as unknown as Ticket[]);
    };
    load();

    const channel = supabase
      .channel('admin-tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  // Load messages for selected ticket
  useEffect(() => {
    if (!selectedTicket) return;
    const load = async () => {
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    load();

    const channel = supabase
      .channel(`ticket-${selectedTicket.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `ticket_id=eq.${selectedTicket.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedTicket]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || !user) return;
    setSending(true);
    const { error } = await supabase.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender_id: user.id,
      content: newMessage.trim().slice(0, 2000),
    });
    if (error) {
      toast.error('Erro ao enviar mensagem');
    } else {
      setNewMessage('');
    }
    setSending(false);
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    if (error) toast.error('Erro ao atualizar status');
    else toast.success(`Ticket ${status === 'closed' ? 'fechado' : 'reaberto'}`);
  };

  const formatDate = (d: string) => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  if (authLoading || adminLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!isAdmin) return null;

  const statusIcon = (s: string) => {
    if (s === 'open') return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
    if (s === 'closed') return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
    return <XCircle className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--bg-gradient-start))] via-[hsl(var(--bg-gradient-middle))] to-[hsl(var(--bg-gradient-end))]">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
          <Badge variant="secondary" className="ml-auto">{profiles.length} usuários</Badge>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-2 bg-card/80 border border-border">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Usuários
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Suporte
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-4">
            <Card className="bg-card/80 border-border">
              <ScrollArea className="h-[70vh]">
                <div className="p-4 space-y-2">
                  {profiles.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {(p.display_name || p.email || '?')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.display_name || 'Sem nome'}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground">Entrou</p>
                        <p className="text-xs text-foreground">{formatDate(p.created_at)}</p>
                      </div>
                    </div>
                  ))}
                  {profiles.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Nenhum usuário ainda</p>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Chat/Support Tab */}
          <TabsContent value="chat" className="mt-4">
            {selectedTicket ? (
              <Card className="bg-card/80 border-border">
                <div className="p-3 border-b border-border flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(null)}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedTicket.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedTicket.profiles as Profile | null | undefined)?.display_name || (selectedTicket.profiles as Profile | null | undefined)?.email || 'Usuário'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateTicketStatus(selectedTicket.id, selectedTicket.status === 'open' ? 'closed' : 'open')}
                  >
                    {selectedTicket.status === 'open' ? 'Fechar' : 'Reabrir'}
                  </Button>
                </div>

                <ScrollArea className="h-[50vh] p-4">
                  <div className="space-y-3">
                    {messages.map(m => {
                      const isMe = m.sender_id === user?.id;
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatDate(m.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                    {messages.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Nenhuma mensagem</p>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t border-border flex gap-2">
                  <Input
                    placeholder="Responder..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    maxLength={2000}
                    className="bg-muted border-border"
                  />
                  <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="bg-card/80 border-border">
                <ScrollArea className="h-[70vh]">
                  <div className="p-4 space-y-2">
                    {tickets.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className="w-full text-left p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {statusIcon(t.status)}
                          <span className="text-sm font-medium text-foreground flex-1 truncate">{t.subject}</span>
                          <Badge variant={t.status === 'open' ? 'default' : 'secondary'} className="text-[10px]">
                            {t.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {(t.profiles as Profile | null | undefined)?.display_name || (t.profiles as Profile | null | undefined)?.email || 'Usuário'}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">{formatDate(t.created_at)}</span>
                        </div>
                      </button>
                    ))}
                    {tickets.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Nenhum ticket de suporte</p>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
