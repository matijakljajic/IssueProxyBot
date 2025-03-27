<script lang="ts">
	import { setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
</script>

<h1>{m.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => setLocale('en')}>{m.locale_en()}</button>
	<button onclick={() => setLocale('es')}>{m.locale_es()}</button>
	<button onclick={() => setLocale('sr')}>{m.locale_sr()}</button>
	<button onclick={() => setLocale('de')}>{m.locale_de()}</button>
	<button onclick={() => setLocale('fr')}>{m.locale_fr()}</button>
	<button onclick={() => setLocale('zh')}>{m.locale_zh()}</button>
	<button onclick={() => setLocale('it')}>{m.locale_it()}</button>
	<button onclick={() => setLocale('ru')}>{m.locale_ru()}</button>
</div>
