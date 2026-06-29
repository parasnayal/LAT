// import { QuestionGeneratorPage } from "@/features/questions/generator";

// export default function () {
//   return <QuestionGeneratorPage />;
// }

// import AgentController from "@/components/AgentController";

import AgentController from "@/features/AgentController";

export default function AdminQuestionGeneratorPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-ink text-3xl font-bold sm:text-4xl">LAT Question Generator</h1>
        <p className="mt-2 text-base font-medium text-zinc-600">
          KVS/PARAKH Baseline Assessment AI Agent
        </p>
      </header>
      <AgentController />
    </main>
  );
}
