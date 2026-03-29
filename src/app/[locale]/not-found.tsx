import Link from 'next/link'

export default function NotFound() {
  const link_txt = 'Retour à l\'accueil';
  return (
    <div>
      <h2>Page introuvable</h2>
      <Link href="/fr">`${link_txt}`</Link>
    </div>
  )
}
