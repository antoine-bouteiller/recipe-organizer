import { Link } from '@tanstack/react-router'

export const NotFound = () => (
  <div className="space-y-2 p-2">
    <div className="text-gray-600 dark:text-gray-400">
      <p>La page que vous cherchez n&apos;existe pas.</p>
    </div>
    <p className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => globalThis.history.back()}
        className="bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm"
      >
        Retour
      </button>
      <Link
        to="/"
        className="bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm"
      >
        Retour à l&apos;accueil
      </Link>
    </p>
  </div>
)
