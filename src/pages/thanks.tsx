// src/pages/thanks.tsx
import Head from "next/head";

export default function Thanks() {
  return (
    <>
      <Head>
        <title>Thanks | FilmHub</title>
        <meta name="description" content="Your action was completed successfully." />
      </Head>

      <main className="max-w-xl mx-auto p-6" aria-labelledby="thanks-title">
        <h1 id="thanks-title" className="text-2xl font-bold mb-2">
          Thanks!
        </h1>
        <p role="status" aria-live="polite">
          Your action was completed.
        </p>
      </main>
    </>
  );
}
