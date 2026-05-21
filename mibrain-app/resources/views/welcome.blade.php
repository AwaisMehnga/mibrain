<x-layouts.guest title="{{ config('app.name', 'Laravel') }}">
    <div class="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <section class="flex min-h-[34rem] flex-col justify-between rounded-[2rem] border border-border/70 bg-secondary/70 p-8 shadow-float backdrop-blur-xl sm:p-10">
            <div>
                <span class="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                    Mibrain
                </span>
                <h1 class="mt-6 max-w-xl font-display text-4xl leading-tight text-fg sm:text-5xl lg:text-6xl">
                    Calm, focused support for the moments that matter.
                </h1>
                <p class="mt-5 max-w-2xl text-base leading-7 text-fg-secondary sm:text-lg">
                    Track symptoms, log patterns, and keep your care workflow in one place. Use the built-in auth screens to get started, then wire the product experience however you want.
                </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-2xl border border-border bg-primary/60 p-4">
                    <p class="text-xs uppercase tracking-[0.25em] text-fg-muted">Access</p>
                    <p class="mt-2 font-mono text-2xl text-fg">24/7</p>
                </div>
                <div class="rounded-2xl border border-border bg-primary/60 p-4">
                    <p class="text-xs uppercase tracking-[0.25em] text-fg-muted">Focus</p>
                    <p class="mt-2 font-mono text-2xl text-fg">Clear</p>
                </div>
                <div class="rounded-2xl border border-border bg-primary/60 p-4">
                    <p class="text-xs uppercase tracking-[0.25em] text-fg-muted">Style</p>
                    <p class="mt-2 font-mono text-2xl text-fg">Blade</p>
                </div>
            </div>
        </section>

        <section class="flex items-center justify-center rounded-[2rem] border border-border/70 bg-primary/85 p-6 shadow-float backdrop-blur-xl sm:p-8">
            <div class="w-full max-w-md rounded-[1.75rem] border border-border bg-tertiary/70 p-6 sm:p-8">
                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Get started</p>
                <h2 class="mt-3 font-display text-3xl text-fg">Choose an entry point</h2>
                <p class="mt-3 text-sm leading-6 text-fg-secondary">
                    The auth flow is now Blade-first, so you can replace the UI without touching the route structure.
                </p>

                <div class="mt-8 grid gap-3">
                    <a href="{{ route('login') }}" class="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 font-semibold text-fg-inverse transition hover:opacity-90">
                        Sign in
                    </a>
                    <a href="{{ route('register') }}" class="inline-flex items-center justify-center rounded-xl border border-border bg-transparent px-4 py-3 font-semibold text-fg transition hover:border-accent/60 hover:bg-accent/10">
                        Create account
                    </a>
                </div>
            </div>
        </section>
    </div>
</x-layouts.guest>