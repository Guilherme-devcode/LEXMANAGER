import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertCircle, ArrowRight, Building2, User, Scale, Sun, Moon } from 'lucide-react';

export default function RegisterPage() {
  const { registerTenant } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nomeTenant: '', emailTenant: '', nomeUsuario: '', emailUsuario: '', senha: '', cnpj: '',
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
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-10 relative" style={{ background: 'var(--bg-page)' }}>
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 icon-btn"
        title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="w-full max-w-lg animate-fade-up">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Scale className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>LexManager Pro</span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl sm:text-3xl mb-1.5" style={{ color: 'var(--text-primary)' }}>
            Criar seu escritório
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>Entrar</Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-5 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm animate-scale-in"
            style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section: Escritório */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                <Building2 className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Dados do Escritório
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome do escritório *</label>
                <input type="text" className="form-input" required placeholder="Silva & Associados" {...field('nomeTenant')} />
              </div>
              <div>
                <label className="form-label">Email institucional *</label>
                <input type="email" className="form-input" required placeholder="contato@escritorio.com" {...field('emailTenant')} />
              </div>
              <div>
                <label className="form-label">CNPJ</label>
                <input type="text" className="form-input" placeholder="00.000.000/0001-00" {...field('cnpj')} />
              </div>
            </div>
          </div>

          {/* Section: Sócio */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                <User className="h-3.5 w-3.5" style={{ color: 'var(--accent)' }} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Sócio Administrador
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="form-label">Nome completo *</label>
                <input type="text" className="form-input" required placeholder="Dr. João da Silva" {...field('nomeUsuario')} />
              </div>
              <div>
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" required placeholder="joao@escritorio.com" {...field('emailUsuario')} />
              </div>
              <div>
                <label className="form-label">Senha *</label>
                <input type="password" className="form-input" required minLength={8} placeholder="Mín. 8 caracteres" {...field('senha')} />
              </div>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              A senha deve ter ao menos 8 caracteres, incluindo maiúscula, minúscula e número.
            </p>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full group">
            {isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Criando escritório...
              </>
            ) : (
              <>
                Criar escritório
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
