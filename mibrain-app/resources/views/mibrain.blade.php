<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="color-scheme" content="dark">

    <title>{{ config('app.name', 'Laravel') }}</title>

    @viteReactRefresh
    @vite([
      'resources/js/mibrain/App.jsx',
    ])
  </head>
  <body class="m-0 min-h-screen bg-primary text-fg antialiased" style="-webkit-text-size-adjust: 100%; text-size-adjust: 100%;">
    <div id="mibrain"></div>
  </body>
</html>