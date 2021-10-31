<template><h1 id="manual-installation" tabindex="-1"><a class="header-anchor" href="#manual-installation" aria-hidden="true">#</a> Manual installation</h1>
<p>We strongly recommend using <RouterLink to="/docs/getting-started/">hello-endify</RouterLink> to scaffold an app but if you really need to set up Endify by yourself this is a good place to start.</p>
<h2 id="install" tabindex="-1"><a class="header-anchor" href="#install" aria-hidden="true">#</a> Install</h2>
<ol>
<li>Create a project directory or navigate to existing one:</li>
</ol>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">mkdir</span> hello-world <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> hello-world
</code></pre></div><ol start="2">
<li>Create an empty package.json or run init command:</li>
</ol>
<div class="language-bash ext-sh"><pre v-pre class="language-bash"><code><span class="token function">npm</span> init 
</code></pre></div><ol start="3">
<li>Install required dependencies</li>
</ol>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">npm</span> i @endify/cli @endify/core @endify/server @endify/vue 
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>Note that @endify/vue is optional if you want to create server only application, however @endify/server is always required, even if you only need client side app.</p>
</div>
<ol start="4">
<li>Create <code>endify.config.js</code> inside the root folder of your project and export a default config object or a function</li>
</ol>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span>resolve<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'path'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span>ServerLauncher<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'@endify/server/launcher'</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span>VueLauncher<span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'@endify/vue/launcher'</span><span class="token punctuation">)</span>

module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    launchers<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token keyword">new</span> <span class="token class-name">ServerLauncher</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        entry<span class="token operator">:</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">'src/server'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        inspectPort<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token keyword">new</span> <span class="token class-name">VueLauncher</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        entry<span class="token operator">:</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">'src/client'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        template<span class="token operator">:</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">'src/client/template'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div></template>
