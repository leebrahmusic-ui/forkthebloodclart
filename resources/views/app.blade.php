<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>MD Gas Leeds</title>

    <link rel="icon" type="image/png" href="/favicon.png">

    <meta name="google-site-verification" content="wLUarvIp56ViGMNQbLZEaqNp-EkVEQlmVwu76LIcUDI" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <script>
        (function() {
            var root = document.documentElement;
            root.classList.remove('dark');
            document.body && document.body.classList.remove('dark');
            try {
                localStorage.removeItem('theme');
                localStorage.removeItem('color-theme');
            } catch (e) {}
        })();
    </script>
    @php($gtmId = 'GTM-MWWXBWFC')

    @if ($gtmId)
        <!-- Google Tag Manager -->
        <script>
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-MWWXBWFC');
        </script>
        <!-- End Google Tag Manager -->
    @endif


    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased {{ request()->routeIs('book.quote.new') ? '' : 'force-purple-theme' }}">
    @inertia
</body>

@php($gtmId = 'GTM-MWWXBWFC')

@if ($gtmId)
    <!-- Google Tag Manager (noscript) -->
    <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MWWXBWFC" height="0" width="0"
            style="display:none;visibility:hidden"></iframe>
    </noscript>
    <!-- End Google Tag Manager (noscript) -->
@endif


</html>
