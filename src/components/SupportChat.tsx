import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCountry } from '@/contexts/CountryContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { checkRateLimit } from '@/utils/rateLimiter';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const SupportChat = () => {
  const { user } = useAuth();
  const { isUSA } = useCountry();
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [sending, setSending] = useState(false);

  // Load user tickets
  useEffect(() => {
    if (!user || !open) return;
    const load = async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (data) setTickets(data);
    };
    load();
  }, [user, open]);

  // Load messages
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
      .channel(`user-ticket-${selectedTicket.id}`)
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

  const createTicket = async () => {
    if (!newSubject.trim() || !user) return;

    const { allowed, retryAfterMs } = checkRateLimit('support-ticket');
    if (!allowed) {
      toast.error(`Aguarde ${Math.ceil(retryAfterMs / 1000)}s antes de criar outro ticket`);
      return;
    }

    const subject = newSubject.trim().slice(0, 200).replace(/[<>]/g, '');
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({ user_id: user.id, subject })
      .select()
      .single();

    if (error) {
      toast.error(isUSA ? 'Error creating ticket' : 'Erro ao criar ticket');
    } else if (data) {
      setTickets(prev => [data, ...prev]);
      setSelectedTicket(data);
      setNewSubject('');
      setShowNewTicket(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || !user) return;

    const { allowed } = checkRateLimit('support-msg');
    if (!allowed) {
      toast.error(isUSA ? 'Too many messages. Wait a moment.' : 'Muitas mensagens. Aguarde um momento.');
      return;
    }

    setSending(true);
    const { error } = await supabase.from('support_messages').insert({
      ticket_id: selectedTicket.id,
      sender_id: user.id,
      content: newMessage.trim().slice(0, 2000),
    });
    if (error) {
      toast.error(isUSA ? 'Error sending message' : 'Erro ao enviar mensagem');
    } else {
      setNewMessage('');
    }
    setSending(false);
  };

  const formatTime = (d: string) => new Date(d).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });

  if (!user) return null;

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Suporte"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            {selectedTicket ? (
              <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(null)}>
                <X className="w-4 h-4" />
              </Button>
            ) : null}
            <h2 className="text-lg font-bold text-foreground flex-1">
              {selectedTicket ? selectedTicket.subject : (isUSA ? 'Support' : 'Suporte')}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => { setOpen(false); setSelectedTicket(null); setShowNewTicket(false); }}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {selectedTicket ? (
            /* Message view */
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3 max-w-lg mx-auto">
                  {messages.map(m => {
                    const isMe = m.sender_id === user.id;
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                          {!isMe && <p className="text-[10px] font-bold mb-1 text-primary">Suporte</p>}
                          <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatTime(m.created_at)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {messages.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      {isUSA ? 'Send a message to start the conversation' : 'Envie uma mensagem para iniciar a conversa'}
                    </p>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2 max-w-lg mx-auto">
                  <Input
                    placeholder={isUSA ? 'Type your message...' : 'Digite sua mensagem...'}
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
              </div>
            </>
          ) : (
            /* Ticket list */
            <div className="flex-1 p-4 space-y-3 max-w-lg mx-auto w-full">
              {showNewTicket ? (
                <div className="space-y-3 p-4 rounded-xl bg-card border border-border">
                  <Input
                    placeholder={isUSA ? 'Subject of your question...' : 'Assunto da sua dúvida...'}
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createTicket()}
                    maxLength={200}
                    autoFocus
                    className="bg-muted border-border"
                  />
                  <div className="flex gap-2">
                    <Button onClick={createTicket} disabled={!newSubject.trim()} className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                      {isUSA ? 'Create' : 'Criar'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                      {isUSA ? 'Cancel' : 'Cancelar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowNewTicket(true)} className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  {isUSA ? 'New question' : 'Nova dúvida'}
                </Button>
              )}

              {tickets.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="w-full text-left p-3 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground flex-1 truncate">{t.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === 'open' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-green-500/20 text-green-600'}`}>
                      {t.status === 'open' ? (isUSA ? 'Open' : 'Aberto') : (isUSA ? 'Closed' : 'Fechado')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(t.created_at)}</p>
                </button>
              ))}

              {tickets.length === 0 && !showNewTicket && (
                <p className="text-center text-muted-foreground py-8">
                  {isUSA ? 'No questions yet. Create one!' : 'Nenhuma dúvida ainda. Crie uma!'}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SupportChat;
