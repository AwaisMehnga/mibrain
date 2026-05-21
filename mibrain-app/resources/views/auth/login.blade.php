<x-layouts.guest title="Sign in">
    <div class="mx-auto w-full max-w-md rounded-[1.75rem] border border-border/70 bg-secondary/80 p-6 shadow-float backdrop-blur-xl sm:p-8">
        <div class="mb-8">
            <a href="{{ route('home') }}" class="inline-flex items-center rounded-full border border-border bg-primary/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-fg-secondary">
                Mibrain
            </a>
            <h1 class="mt-5 font-display text-4xl text-fg">Welcome back</h1>
            <p class="mt-3 text-sm leading-6 text-fg-secondary">
                Sign in to continue to your dashboard.
            </p>
        </div>

        @if ($status)
            <div class="mb-6 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                {{ $status }}
            </div>
        @endif

        <x-auth.validation-errors class="mb-6" />

        <form method="POST" action="{{ route('login') }}" class="space-y-5">
            @csrf

            <div>
                <label for="email" class="mb-2 block text-sm font-medium text-fg-secondary">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required autofocus autocomplete="email" class="w-full rounded-xl border border-border bg-primary/80 px-4 py-3 text-fg outline-none transition placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <div>
                <label for="password" class="mb-2 block text-sm font-medium text-fg-secondary">Password</label>
                <input id="password" name="password" type="password" required autocomplete="current-password" class="w-full rounded-xl border border-border bg-primary/80 px-4 py-3 text-fg outline-none transition placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <div class="flex items-center justify-between gap-4 text-sm">
                <label class="inline-flex items-center gap-2 text-fg-secondary">
                    <input type="checkbox" name="remember" class="h-4 w-4 rounded border-border bg-primary text-accent focus:ring-accent" />
                    Remember me
                </label>

                @if ($canResetPassword)
                    <a href="{{ route('password.request') }}" class="font-medium text-accent hover:underline">
                        Forgot password?
                    </a>
                @endif
            </div>

            <button type="submit" class="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 font-semibold text-fg-inverse transition hover:opacity-90">
                Sign in
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-fg-secondary">
            New here?
            <a href="{{ route('register') }}" class="font-medium text-accent hover:underline">Create an account</a>
        </p>
    </div>
</x-layouts.guest>