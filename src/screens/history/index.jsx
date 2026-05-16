import { Link } from 'react-router'

export default function History() {
  return (
    <div className="px-5 py-5 space-y-4">
      <h1 className="text-2xl font-display text-fg">History</h1>
      <section className="rounded-lg bg-secondary p-4">
        <p className="text-[13px] text-fg-secondary">Current attack in progress</p>
        <p className="mt-1 text-[16px] font-semibold text-fg">Started at 11:42 AM</p>
        <Link
          to="/log/end-attack"
          className="mt-4 inline-flex rounded-md bg-danger px-4 py-2 text-[13px] font-semibold text-fg btn-press"
        >
          End Attack
        </Link>
      </section>
    </div>
  )
}
