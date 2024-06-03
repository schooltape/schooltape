<script>
  import {Route,router} from 'tinro';
  router.mode.hash(); // enables hash navigation method
  import Home from './pages/Home.svelte';
  import Plugins from './pages/Plugins.svelte';
  import Themes from './pages/Themes.svelte';
  import Snippets from './pages/Snippets.svelte';
</script>


<body class="grid">
  <main class="flex flex-col items-center bg-gradient-to-b from-ctp-base to-ctp-crust p-6">
    <div class="mb-6 flex rounded-xl px-4 py-2 text-ctp-text">
      <a href="/" class="navbutton-left bg-ctp-pink/50">Settings</a>
      <a href="/plugins" class="navbutton-center bg-ctp-overlay0/50">Plugins</a>
      <a href="/themes" class="navbutton-center bg-ctp-overlay0/50">Themes</a>
      <a href="/snippets" class="navbutton-right bg-ctp-overlay0/50">Snippets</a>
    </div>
    <Route path="/"><Home /></Route>
    <Route path="/plugins"><Plugins /></Route>
    <Route path="/themes"><Themes /></Route>
    <Route path="/snippets"><Snippets /></Route>
  </main>
</body>
