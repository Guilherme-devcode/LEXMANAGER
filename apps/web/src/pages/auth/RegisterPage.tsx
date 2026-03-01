import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, ArrowRight, Building2, User } from 'lucide-react';

export default function RegisterPage() {
  const { registerTenant } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nomeTenant: '',
    emailTenant: '',
    nomeUsuario: '',
    emailUsuario: '',
    senha: '',
    cnpj: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await registerTenant({
        nomeTenant: form.nomeTenant,
        emailTenant: form.emailTenant,
        nomeUsuario: form.nomeUsuario,
        emailUsuario: form.emailUsuario,
        senha: form.senha,
        cnpj: form.cnpj || undefined,
      });
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Erro ao criar cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 relative mesh-bg"
    >
      {/* Background orbs */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-50"
        style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-xl relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 animate-fade-up">
          <LexLogoSmall />
          <span className="font-display text-lg font-semibold text-gold">LexManager Pro</span>
        </div>

        <div className="animate-fade-up anim-delay-75 mb-6">
          <h1 className="font-display text-4xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Criar escritório
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Já tem conta?{' '}
            <Link to="/login" className="hover:underline" style={{ color: 'var(--gold-400)' }}>
              Entrar
            </Link>
          </p>
        </div>

        {error && (
          <div
            className="mb-5 flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm animate-scale-in"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5',
            }}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up anim-delay-150">

          {/* Section: Escritório */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4" style={{ color: 'var(--gold-500)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Dados do Escritório
              </span>
            </div>
            <div className="h-px" style={{ background: 'var(--border-soft)' }} />

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome do escritório *</label>
                <input type="text" className="form-input" required {...field('nomeTenant')} placeholder="Escritório Jurídico Silva & Associados" />
              </div>
              <div>
                <label className="form-label">Email institucional *</label>
                <input type="email" className="form-input" required {...field('emailTenant')} placeholder="contato@escritorio.com" />
              </div>
              <div>
                <label className="form-label">CNPJ</label>
                <input type="text" className="form-input" placeholder="00.000.000/0001-00" {...field('cnpj')} />
              </div>
            </div>
          </div>

          {/* Section: Sócio */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4" style={{ color: 'var(--gold-500)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Sócio Administrador
              </span>
            </div>
            <div className="h-px" style={{ background: 'var(--border-soft)' }} />

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome completo *</label>
                <input type="text" className="form-input" required {...field('nomeUsuario')} placeholder="Dr. João da Silva" />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" required {...field('emailUsuario')} placeholder="joao@escritorio.com" />
              </div>
              <div>
                <label className="form-label">Senha *</label>
                <input type="password" className="form-input" required minLength={8} {...field('senha')} placeholder="••••••••" />
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.
            </p>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full group">
            {isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-ink-900/40 border-t-ink-900 animate-spin" />
                <span>Criando escritório...</span>
              </>
            ) : (
              <>
                <span>Criar escritório</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs animate-fade-up anim-delay-300" style={{ color: 'var(--text-muted)' }}>
          Ao criar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}

function LexLogoSmall() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="url(#rg)" strokeWidth="1.5" />
      <path d="M10 16h12M16 10v12" stroke="url(#rg)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 13l10 6M21 13l-10 6" stroke="url(#rg)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <defs>
        <linearGradient id="rg" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8c64a" />
          <stop offset="1" stopColor="#a8893c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
