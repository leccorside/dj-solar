import { Route, Routes } from 'react-router-dom';

function ScaffoldHome() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0d0f10] px-8 text-center text-white">
      <img src="/logo-dj-solar.png" alt="DJ Solar — Energia Solar" className="w-56" />
      <h1 className="text-2xl font-bold">DJ Solar — Energia Solar</h1>
      <p className="text-white/70">
        Fundação do monorepo concluída (Passo 1). O conteúdo desta página será
        administrável via CMS a partir dos próximos passos.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<ScaffoldHome />} />
    </Routes>
  );
}
