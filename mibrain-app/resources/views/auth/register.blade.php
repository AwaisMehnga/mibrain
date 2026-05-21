<x-layouts.guest title="Create account">
    <div class="mx-auto w-full max-w-md rounded-[1.75rem] border border-border/70 bg-secondary/80 p-6 shadow-float backdrop-blur-xl sm:p-8">
        <div class="mb-8">
            <a href="{{ route('home') }}" class="inline-flex items-center rounded-full border border-border bg-primary/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-fg-secondary">
                Mibrain
            </a>
            <h1 class="mt-5 font-display text-4xl text-fg">Create your account</h1>
            <p class="mt-3 text-sm leading-6 text-fg-secondary">
                Set up access with a simple Blade form.
            </p>
        </div>

        <x-auth.validation-errors class="mb-6" />

        <form method="POST" action="{{ route('register') }}" class="space-y-5">
            @csrf

            <div>
                <label for="name" class="mb-2 block text-sm font-medium text-fg-secondary">Name</label>
                <input id="name" name="name" type="text" value="{{ old('name') }}" required autofocus autocomplete="name" class="w-full rounded-xl border border-border bg-primary/80 px-4 py-3 text-fg outline-none transition placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <div>
                <label for="email" class="mb-2 block text-sm font-medium text-fg-secondary">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email') }}" required autocomplete="email" class="w-full rounded-xl border border-border bg-primary/80 px-4 py-3 text-fg outline-none transition placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <div>
                <label for="password" class="mb-2 block text-sm font-medium text-fg-secondary">Password</label>
                <input id="password" name="password" type="password" required autocomplete="new-password" class="w-full rounded-xl border border-border bg-primary/80 px-4 py-3 text-fg outline-none transition placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <div>
                <label for="password_confirmation" class="mb-2 block text-sm font-medium text-fg-secondary">Confirm password</label>
                <input id="password_confirmation" name="password_confirmation" type="password" required autocomplete="new-password" class="w-full rounded-xl border border-border bg-primary/80 px-4 py-3 text-fg outline-none transition placeholder:text-fg-muted focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <button type="submit" class="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 font-semibold text-fg-inverse transition hover:opacity-90">
                Create account
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-fg-secondary">
            Already have an account?
            <a href="{{ route('login') }}" class="font-medium text-accent hover:underline">Sign in</a>
        </p>
    </div>
</x-layouts.guest>