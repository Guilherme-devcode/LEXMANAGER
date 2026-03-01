import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff, AlertCircle, ArrowRight, Sun, Moon, Scale } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-[46%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'var(--accent)' }}
      >
        {/* Background circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/10" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-display font-bold text-lg">LexManager Pro</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            <span className="text-white/90 text-xs font-medium">Plataforma jurídica completa</span>
          </div>
          <h2 className="text-white font-display font-bold text-3xl lg:text-4xl leading-tight">
            Gestão jurídica<br />inteligente e<br />segura
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            Processos, prazos, financeiro e documentos centralizados em uma única plataforma.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Processos', 'Prazos', 'Financeiro', 'Documentos'].map((f) => (
              <span key={f} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 text-white/90">
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-white/40 text-xs">LexManager Pro © 2025</p>
      </div>

      {/* ── Right form panel ── */}
      <div
        className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10 relative"
        style={{ background: 'var(--bg-page)' }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 icon-btn"
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Scale className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              LexManager Pro
            </span>
          </div>

          {/* Heading */}
          <div className="mb-7 animate-fade-up">
            <h1 className="font-display font-bold text-2xl sm:text-3xl mb-1.5" style={{ color: 'var(--text-primary)' }}>
              Bem-vindo de volta
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
                Criar escritório
              </Link>
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              className="mb-5 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm animate-scale-in"
              style={{
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up anim-delay-75">
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
                  className="form-input pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1 group">
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
