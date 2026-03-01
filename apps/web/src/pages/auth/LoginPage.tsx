import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel – animated emblem ── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col relative overflow-hidden mesh-bg noise-overlay">
        {/* Background gradient orbs */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,70,200,0.06) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10 flex items-center gap-3">
          <LexLogo size={36} />
          <span className="font-display text-xl font-semibold text-gold-shimmer select-none">
            LexManager Pro
          </span>
        </div>

        {/* Central emblem */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 gap-10">
          <div className="lex-emblem">
            <div className="lex-ring-dot" />
            <div className="lex-ring lex-ring-1" />
            <div className="lex-ring lex-ring-2" />
            <div className="lex-ring lex-ring-3" />
            <div className="lex-ring lex-ring-4" />
            {/* Center icon */}
            <div
              className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                border: '1px solid rgba(201,168,76,0.3)',
                boxShadow: '0 0 32px rgba(201,168,76,0.2)',
              }}
            >
              <ScalesIcon />
            </div>
          </div>

          <div className="text-center max-w-sm animate-fade-up anim-delay-300">
            <h2 className="font-display text-3xl font-semibold leading-snug mb-3" style={{ color: 'var(--text-primary)' }}>
              Gestão jurídica<br />
              <em className="text-gold not-italic">inteligente e segura</em>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Processos, prazos, financeiro e documentos<br />em uma plataforma unificada.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-10">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>LexManager Pro © 2025 — Todos os direitos reservados</p>
        </div>

        {/* Right edge fade */}
        <div
          className="absolute inset-y-0 right-0 w-24 pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, var(--bg-base))' }}
        />
      </div>

      {/* ── Right panel – login form ── */}
      <div
        className="flex flex-1 items-center justify-center p-8 relative"
        style={{ background: 'var(--bg-base)' }}
      >
        {/* Subtle top-right glow */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden animate-fade-up">
            <LexLogo size={28} />
            <span className="font-display text-lg font-semibold text-gold">LexManager Pro</span>
          </div>

          {/* Header */}
          <div className="animate-fade-up mb-8">
            <h1 className="font-display text-4xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Bem-vindo
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Entre na sua conta para continuar.{' '}
              <Link to="/cadastro" className="hover:underline transition-colors" style={{ color: 'var(--gold-400)' }}>
                Criar escritório
              </Link>
            </p>
          </div>

          {/* Error */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up anim-delay-150">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="seu@email.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="form-label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full relative overflow-hidden group"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-ink-900/40 border-t-ink-900 animate-spin" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer link */}
          <p className="mt-8 text-center text-xs animate-fade-up anim-delay-300" style={{ color: 'var(--text-muted)' }}>
            Primeiro acesso?{' '}
            <Link to="/cadastro" className="hover:underline" style={{ color: 'var(--gold-500)' }}>
              Cadastre seu escritório gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Inline SVG components ── */
function LexLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="url(#logoGrad)" strokeWidth="1.5" />
      <path d="M10 16h12M16 10v12" stroke="url(#logoGrad)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 13l10 6M21 13l-10 6" stroke="url(#logoGrad)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <defs>
        <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8c64a" />
          <stop offset="1" stopColor="#a8893c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ScalesIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v18M5 21h14" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 6L5 9l-2 4c0 2 3 3 4.5 1.5M12 6l7 3 2 4c0 2-3 3-4.5 1.5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
