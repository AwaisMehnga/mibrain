<x-layouts.guest title="Verify email">
    <div class="mx-auto w-full max-w-md rounded-[1.75rem] border border-border/70 bg-secondary/80 p-6 shadow-float backdrop-blur-xl sm:p-8">
        <div class="mb-8">
            <a href="{{ route('home') }}" class="inline-flex items-center rounded-full border border-border bg-primary/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-fg-secondary">
                Mibrain
            </a>
            <h1 class="mt-5 font-display text-4xl text-fg">Verify your email</h1>
            <p class="mt-3 text-sm leading-6 text-fg-secondary">
                Check your inbox for the verification link before continuing.
            </p>
        </div>

        @if ($status)
            <div class="mb-6 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                {{ $status }}
            </div>
        @endif

        <form method="POST" action="{{ route('verification.send') }}" class="space-y-4">
            @csrf

            <button type="submit" class="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 font-semibold text-fg-inverse transition hover:opacity-90">
                Resend verification email
            </button>
        </form>

        <form method="POST" action="{{ route('logout') }}" class="mt-4">
            @csrf
            <button type="submit" class="inline-flex w-full items-center justify-center rounded-xl border border-border bg-transparent px-4 py-3 font-semibold text-fg transition hover:border-accent/60 hover:bg-accent/10">
                Log out
            </button>
        </form>
    </div>
</x-layouts.guest>