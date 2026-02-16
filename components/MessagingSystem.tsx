
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Send, Inbox, AlertOctagon, Trash2, Search, Plus, 
  ChevronRight, ArrowLeft, Filter, User, Bell, Clock,
  MoreVertical, Check, CheckCheck, X
} from 'lucide-react';
import { InternalMessage } from '../types';

const STORAGE_KEY = 'sm_internal_messages';

const MessagingSystem: React.FC = () => {
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'alerts'>('inbox');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Novo estado de composição
  const [composeData, setComposeData] = useState({
    recipientId: '',
    subject: '',
    content: '',
    type: 'NORMAL' as 'NORMAL' | 'ALERT'
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      const initial: InternalMessage[] = [
        {
          id: 'msg-1',
          senderId: 'admin',
          senderName: 'Direção Central',
          senderRole: 'ADMIN',
          recipientId: 'current-user',
          subject: 'Boas-vindas ao Sistema',
          content: 'Bem-vindo ao novo módulo de comunicações internas do School Manager Academy SM@.',
          type: 'SYSTEM',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: 'msg-2',
          senderId: 'prof-1',
          senderName: 'Prof. Adilson',
          senderRole: 'TEACHER',
          recipientId: 'current-user',
          subject: 'Pautas do 1º Trimestre',
          content: 'Por favor, valide as pautas da 12ª Classe até o final do dia.',
          type: 'NORMAL',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true
        }
      ];
      setMessages(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  const saveMessages = (newMessages: InternalMessage[]) => {
    setMessages(newMessages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
  };

  const filteredMessages = useMemo(() => {
    let base = messages;
    if (activeTab === 'inbox') base = messages.filter(m => m.recipientId === 'current-user');
    if (activeTab === 'sent') base = messages.filter(m => m.senderId === 'current-user');
    if (activeTab === 'alerts') base = messages.filter(m => m.type === 'ALERT');

    return base.filter(m => 
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.senderName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messages, activeTab, searchTerm]);

  const unreadCount = messages.filter(m => !m.read && m.recipientId === 'current-user').length;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage: InternalMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'Administrador Principal',
      senderRole: 'SUPER_ADMIN',
      recipientId: composeData.recipientId,
      subject: composeData.subject,
      content: composeData.content,
      type: composeData.type as any,
      timestamp: new Date().toISOString(),
      read: false
    };

    saveMessages([newMessage, ...messages]);
    setIsComposing(false);
    setComposeData({ recipientId: '', subject: '', content: '', type: 'NORMAL' });
  };

  const markAsRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    saveMessages(updated);
    setSelectedMessageId(id);
  };

  const deleteMessage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Excluir esta mensagem?')) {
      saveMessages(messages.filter(m => m.id !== id));
      if (selectedMessageId === id) setSelectedMessageId(null);
    }
  };

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Central de Comunicações</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">Mensagens Internas e Alertas Críticos da Rede</p>
        </div>
        <button 
          onClick={() => setIsComposing(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={18} /> Nova Mensagem
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* SIDEBAR TABS & LIST */}
        <div className="w-full lg:w-[450px] flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden shrink-0">
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 space-y-6">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button onClick={() => setActiveTab('inbox')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'inbox' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                <Inbox size={14} /> Recebidos {unreadCount > 0 && <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[8px]">{unreadCount}</span>}
              </button>
              <button onClick={() => setActiveTab('sent')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'sent' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                <Send size={14} /> Enviados
              </button>
              <button onClick={() => setActiveTab('alerts')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'alerts' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-400'}`}>
                <AlertOctagon size={14} /> Alertas
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar conversas..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-xs font-bold border border-transparent focus:border-blue-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {filteredMessages.map((msg) => (
              <button 
                key={msg.id}
                onClick={() => markAsRead(msg.id)}
                className={`w-full p-5 rounded-[2.2rem] text-left transition-all border flex items-start gap-4 relative group ${
                  selectedMessageId === msg.id 
                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200' 
                    : 'bg-white dark:bg-slate-900 border-transparent hover:bg-slate-50'
                } ${!msg.read && msg.recipientId === 'current-user' ? 'ring-2 ring-blue-500/10' : ''}`}
              >
                {!msg.read && msg.recipientId === 'current-user' && <div className="absolute top-6 right-6 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>}
                
                <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-sm ${msg.type === 'ALERT' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {msg.senderName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-sm font-black truncate uppercase ${!msg.read && msg.recipientId === 'current-user' ? 'text-slate-900 dark:text-white' : 'text-slate-600'}`}>
                      {activeTab === 'sent' ? `Para: ${msg.recipientId}` : msg.senderName}
                    </h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs font-black text-slate-400 mb-2 truncate">{msg.subject}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{msg.content}</p>
                </div>
              </button>
            ))}

            {filteredMessages.length === 0 && (
              <div className="py-20 text-center opacity-20">
                <Mail size={48} className="mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma mensagem aqui</p>
              </div>
            )}
          </div>
        </div>

        {/* MESSAGE DETAIL VIEW */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-[1.8rem] flex items-center justify-center text-white font-black text-2xl shadow-xl">
                    {selectedMessage.senderName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-black uppercase rounded-lg">{selectedMessage.senderName} • {selectedMessage.senderRole}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10}/> {new Date(selectedMessage.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => deleteMessage(e, selectedMessage.id)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={20} /></button>
                </div>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                <div className={`p-10 rounded-[3rem] text-lg font-medium leading-relaxed ${selectedMessage.type === 'ALERT' ? 'bg-rose-50 border border-rose-100 text-rose-900' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'}`}>
                  {selectedMessage.content}
                </div>

                <div className="mt-12 flex gap-4">
                  <button className="px-10 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Responder</button>
                  <button className="px-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest">Encaminhar</button>
                </div>
              </div>

              <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <CheckCheck size={14} className="text-blue-500" /> Protocolo de Leitura Confirmado • SM@ Comm
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-20">
               <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
                  <Inbox size={64} className="text-slate-400" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-[0.3em]">Seleccione uma Conversa</h3>
               <p className="mt-4 text-sm font-bold uppercase tracking-widest">Seu fluxo de trabalho centralizado começa aqui.</p>
            </div>
          )}
        </div>
      </div>

      {/* COMPOSE MODAL */}
      {isComposing && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[4rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-600/10 text-blue-600 rounded-[2rem]"><Plus size={28} /></div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Nova Comunicação</h2>
               </div>
               <button onClick={() => setIsComposing(false)} className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-3xl transition-all"><X size={24}/></button>
            </div>

            <form onSubmit={handleSendMessage} className="p-12 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Destinatário (ID ou Nome)</label>
                    <input required value={composeData.recipientId} onChange={e => setComposeData({...composeData, recipientId: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Diretor Geral" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tipo de Mensagem</label>
                    <select value={composeData.type} onChange={e => setComposeData({...composeData, type: e.target.value as any})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none appearance-none cursor-pointer">
                       <option value="NORMAL">Mensagem Padrão</option>
                       <option value="ALERT">Alerta Urgente (Vermelho)</option>
                    </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assunto da Mensagem</label>
                  <input required value={composeData.subject} onChange={e => setComposeData({...composeData, subject: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="Título resumido..." />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Corpo da Mensagem</label>
                  <textarea required rows={6} value={composeData.content} onChange={e => setComposeData({...composeData, content: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2.5rem] px-8 py-6 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none custom-scrollbar" placeholder="Escreva aqui..." />
               </div>

               <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsComposing(false)} className="flex-1 py-5 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
                  <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                    <Send size={18} /> Disparar Mensagem
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingSystem;
