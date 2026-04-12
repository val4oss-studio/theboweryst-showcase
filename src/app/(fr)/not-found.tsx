import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page introuvable</h2>
      <Link href="/">Retour à l&apos;accueil</Link>
    </div>
  )
}
