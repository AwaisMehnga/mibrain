@props(['title' => null])

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="dark">

        <title>{{ $title ?? config('app.name', 'Laravel') }}</title>

        @vite(['resources/js/index.css'])
    </head>
    <body class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(127,182,155,0.16),_transparent_34%),linear-gradient(180deg,#060608_0%,#0b120f_55%,#060608_100%)] text-fg antialiased">
        <div class="relative min-h-screen overflow-hidden">
            <div class="pointer-events-none absolute inset-0 opacity-80">
                <div class="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-accent/10 blur-3xl"></div>
                <div class="absolute bottom-[-7rem] right-[-5rem] h-72 w-72 rounded-full bg-fg/5 blur-3xl"></div>
            </div>

            <main class="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
                {{ $slot }}
            </main>
        </div>
    </body>
</html>