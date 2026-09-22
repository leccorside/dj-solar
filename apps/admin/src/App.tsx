import { Route, Routes } from 'react-router-dom';

function ScaffoldDashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-8 text-center text-slate-800">
      <img src="/logo-dj-solar.png" alt="DJ Solar" className="w-48" />
      <h1 className="text-2xl font-bold">Painel Administrativo — DJ Solar</h1>
      <p className="text-slate-500">
        Fundação do monorepo concluída (Passo 1). Autenticação e módulos do CMS
        chegam nos próximos passos.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<ScaffoldDashboard />} />
    </Routes>
  );
}
