import { Link } from '@tanstack/react-router'

export const NotFound = () => (
  <div className="space-y-2 p-2">
    <div
      className={`
        text-gray-600
        dark:text-gray-400
      `}
    >
      <p>La page que vous cherchez n&apos;existe pas.</p>
    </div>
    <p className="flex flex-wrap items-center gap-2">
      <button
        className={`
          rounded bg-emerald-500 px-2 py-1 text-sm font-black text-white
          uppercase
        `}
        onClick={() => globalThis.history.back()}
      >
        Retour
      </button>
      <Link
        className={`
          rounded bg-cyan-600 px-2 py-1 text-sm font-black text-white uppercase
        `}
        to="/"
      >
        Retour à l&apos;accueil
      </Link>
    </p>
  </div>
)
