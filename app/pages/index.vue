<script setup lang="ts">
const { signIn, isAuthenticated, fetchUser, checkOAuthError } = useAuth()

onMounted(async () => {
  checkOAuthError()
  await fetchUser()
})

watch(isAuthenticated, (value) => {
  if (value) {
    navigateTo('/dashboard')
  }
})

const features = [
  {
    icon: 'heroicons:globe-alt',
    title: 'Multi-Currency',
    description: 'Track in any currency. Settle in yours.',
  },
  {
    icon: 'heroicons:sparkles',
    title: 'Smart Settlements',
    description: 'One payment. All debts cleared.',
  },
  {
    icon: 'heroicons:users',
    title: 'Group Expenses',
    description: 'Trips, roommates, dinners. All covered.',
  },
  {
    icon: 'heroicons:code-bracket-square',
    title: 'Open Source',
    description: 'Transparent. Self-hostable. Yours.',
  },
]

const steps = [
  { num: '01', title: 'Create a group', desc: 'Invite friends with a simple link' },
  { num: '02', title: 'Add expenses', desc: 'Log who paid, split how you want' },
  { num: '03', title: 'Settle up', desc: 'See who owes what, pay your share' },
]
</script>

<template>
  <div class="bg-zinc-950 text-white min-h-screen overflow-hidden">
    <!-- Noise Texture Overlay -->
    <div class="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')"></div>

    <!-- Floating Geometric Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl animate-drift"></div>
      <div class="absolute top-[60%] right-[15%] w-96 h-96 rounded-full bg-emerald-400/5 blur-3xl animate-drift-slow"></div>
      <div class="absolute bottom-[20%] left-[30%] w-48 h-48 rounded-full bg-amber-500/5 blur-3xl animate-drift-reverse"></div>
    </div>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M4 12h16M12 4v16"/>
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight">Splito</span>
        </div>

        <div class="flex items-center gap-6">
          <a href="https://github.com/whoisarjen/splito" target="_blank"
             class="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
            <Icon name="mdi:github" class="w-5 h-5" />
            GitHub
          </a>
          <button @click="signIn"
                  class="px-5 py-2.5 bg-white text-zinc-900 rounded-full text-sm font-semibold hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95">
            Sign in
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center pt-24 pb-20 px-6 lg:px-12">
      <div class="max-w-7xl mx-auto w-full">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Left: Content -->
          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 animate-fade-in">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              100% Open Source
            </div>

            <h1 class="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight mb-8 animate-fade-in-up">
              Split expenses,
              <br />
              <span class="relative inline-block">
                <span class="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-400">
                  not friendships
                </span>
                <span class="absolute -bottom-2 left-0 right-0 h-3 bg-emerald-500/20 -skew-x-6"></span>
              </span>
            </h1>

            <p class="text-lg sm:text-xl text-zinc-400 max-w-lg mb-10 leading-relaxed animate-fade-in-up animation-delay-100">
              The open-source way to track shared expenses. Multi-currency support. Smart settlements. Zero drama.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-200">
              <button @click="signIn"
                      class="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-semibold text-lg hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-emerald-500/25">
                <Icon name="mdi:google" class="w-5 h-5" />
                Continue with Google
                <Icon name="heroicons:arrow-right-20-solid" class="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <a href="#features"
                 class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800/50 text-zinc-300 rounded-2xl font-semibold text-lg hover:bg-zinc-800 hover:text-white transition-all border border-zinc-700/50">
                Learn more
              </a>
            </div>

            <!-- Stats -->
            <div class="flex items-center gap-8 mt-14 pt-10 border-t border-zinc-800/50 animate-fade-in-up animation-delay-300">
              <div>
                <div class="text-3xl font-bold text-white">Free</div>
                <div class="text-sm text-zinc-500">Forever</div>
              </div>
              <div class="w-px h-12 bg-zinc-800"></div>
              <div>
                <div class="text-3xl font-bold text-white">26+</div>
                <div class="text-sm text-zinc-500">Currencies</div>
              </div>
              <div class="w-px h-12 bg-zinc-800"></div>
              <div>
                <div class="text-3xl font-bold text-white">MIT</div>
                <div class="text-sm text-zinc-500">Licensed</div>
              </div>
            </div>
          </div>

          <!-- Right: Visual -->
          <div class="relative hidden lg:block animate-fade-in-up animation-delay-200">
            <!-- Background glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent rounded-3xl blur-3xl"></div>

            <!-- Card Stack -->
            <div class="relative">
              <!-- Back card -->
              <div class="absolute -top-4 -left-4 right-8 bottom-8 bg-zinc-800/50 rounded-3xl border border-zinc-700/50 rotate-[-3deg]"></div>

              <!-- Main card -->
              <div class="relative bg-zinc-900 rounded-3xl border border-zinc-800 p-8 shadow-2xl">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-xl">B</div>
                    <div>
                      <div class="font-semibold text-lg">Berlin Trip 2025</div>
                      <div class="text-sm text-zinc-500">5 members</div>
                    </div>
                  </div>
                  <div class="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Active</div>
                </div>

                <!-- Expenses -->
                <div class="space-y-3 mb-8">
                  <div class="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/30">
                    <div class="flex items-center gap-4">
                      <div class="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Icon name="heroicons:home" class="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <div class="font-medium">Airbnb Mitte</div>
                        <div class="text-xs text-zinc-500">Paid by Sarah</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold">€420.00</div>
                      <div class="text-xs text-zinc-500">4 way split</div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/30">
                    <div class="flex items-center gap-4">
                      <div class="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Icon name="heroicons:ticket" class="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div class="font-medium">Museum Island</div>
                        <div class="text-xs text-zinc-500">Paid by You</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold">€76.00</div>
                      <div class="text-xs text-zinc-500">4 way split</div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/30">
                    <div class="flex items-center gap-4">
                      <div class="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Icon name="heroicons:shopping-bag" class="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div class="font-medium">Groceries</div>
                        <div class="text-xs text-zinc-500">Paid by Mike</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold">€89.50</div>
                      <div class="text-xs text-zinc-500">5 way split</div>
                    </div>
                  </div>
                </div>

                <!-- Balance -->
                <div class="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                  <div>
                    <div class="text-sm text-zinc-400 mb-1">Your balance</div>
                    <div class="text-2xl font-bold text-emerald-400">+€47.25</div>
                  </div>
                  <button class="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-400 transition-colors">
                    Settle up
                  </button>
                </div>
              </div>

              <!-- Floating notification -->
              <div class="absolute -top-6 -right-6 px-4 py-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl animate-bounce-subtle">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Icon name="heroicons:check" class="w-4 h-4 text-emerald-400" />
                  </div>
                  <div class="text-sm">
                    <span class="font-medium">Mike</span>
                    <span class="text-zinc-500"> settled €23.40</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 animate-bounce">
        <span class="text-xs uppercase tracking-widest">Scroll</span>
        <Icon name="heroicons:chevron-down" class="w-5 h-5" />
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="relative py-32 px-6 lg:px-12">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Everything you need.
            <br />
            <span class="text-zinc-500">Nothing you don't.</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(feature, i) in features" :key="feature.title"
               class="group relative p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
              <Icon :name="feature.icon" class="w-7 h-7 text-emerald-400" />
            </div>
            <h3 class="text-xl font-semibold mb-3">{{ feature.title }}</h3>
            <p class="text-zinc-400 leading-relaxed">{{ feature.description }}</p>

            <!-- Hover glow -->
            <div class="absolute inset-0 rounded-3xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="relative py-32 px-6 lg:px-12 overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 32px 32px;"></div>
      </div>

      <div class="max-w-7xl mx-auto relative">
        <div class="text-center mb-20">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 text-zinc-400 text-sm font-medium mb-6">
            <Icon name="heroicons:play-circle" class="w-4 h-4" />
            How it works
          </div>
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Three steps to
            <span class="text-emerald-400">harmony</span>
          </h2>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="step.num"
               class="relative group">
            <!-- Connector line -->
            <div v-if="i < 2" class="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-zinc-700 to-transparent z-0"></div>

            <div class="relative p-10 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all group-hover:-translate-y-1 duration-300">
              <div class="absolute -top-5 -left-2 text-8xl font-black text-zinc-800/50 select-none">{{ step.num }}</div>
              <div class="relative">
                <div class="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg mb-6">
                  {{ i + 1 }}
                </div>
                <h3 class="text-2xl font-semibold mb-3">{{ step.title }}</h3>
                <p class="text-zinc-400 text-lg">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Source Banner -->
    <section class="relative py-24 px-6 lg:px-12">
      <div class="max-w-5xl mx-auto">
        <div class="relative p-12 lg:p-16 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-500/20 overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div class="relative text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 mb-8">
              <Icon name="mdi:github" class="w-10 h-10" />
            </div>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Built in the open
            </h2>
            <p class="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
              Splito is 100% open source under MIT license. View the code, self-host your instance, or contribute to make it better for everyone.
            </p>

            <a href="https://github.com/whoisarjen/splito" target="_blank"
               class="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 rounded-2xl font-semibold text-lg hover:bg-zinc-100 transition-all hover:scale-105">
              <Icon name="mdi:github" class="w-6 h-6" />
              Star on GitHub
              <Icon name="heroicons:arrow-up-right" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative py-16 px-6 lg:px-12 border-t border-zinc-800/50">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-4 gap-12 mb-16">
          <!-- Brand -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M4 12h16M12 4v16"/>
                </svg>
              </div>
              <span class="text-xl font-bold">Splito</span>
            </div>
            <p class="text-zinc-400 max-w-sm mb-6">
              The open-source expense sharing app that helps friends split costs fairly and settle up simply.
            </p>
            <div class="flex items-center gap-4">
              <a href="https://github.com/whoisarjen/splito" target="_blank" class="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <Icon name="mdi:github" class="w-5 h-5" />
              </a>
              <a href="https://twitter.com/whoisarjen" target="_blank" class="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                <Icon name="mdi:twitter" class="w-5 h-5" />
              </a>
            </div>
          </div>

          <!-- Links -->
          <div>
            <h4 class="font-semibold mb-4 text-sm uppercase tracking-wider text-zinc-500">Product</h4>
            <ul class="space-y-3">
              <li><a href="#features" class="text-zinc-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="text-zinc-400 hover:text-white transition-colors">Self-hosting</a></li>
              <li><a href="#" class="text-zinc-400 hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4 text-sm uppercase tracking-wider text-zinc-500">Resources</h4>
            <ul class="space-y-3">
              <li><a href="https://github.com/whoisarjen/splito" class="text-zinc-400 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="https://github.com/whoisarjen/splito" class="text-zinc-400 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" class="text-zinc-400 hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>&copy; {{ new Date().getFullYear() }} Splito. Open source under MIT license.</p>
          <p>Made with <span class="text-red-500">♥</span> by <a href="https://whoisarjen.com" target="_blank" class="text-zinc-400 hover:text-white transition-colors">@whoisarjen</a></p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=cabinet-grotesk@400,500,700&display=swap');

:root {
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'Cabinet Grotesk', sans-serif;
}

body {
  font-family: var(--font-body);
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}

@keyframes drift-slow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 20px) scale(1.05); }
}

@keyframes drift-reverse {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, 30px) scale(1.1); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

.animate-drift {
  animation: drift 20s ease-in-out infinite;
}

.animate-drift-slow {
  animation: drift-slow 25s ease-in-out infinite;
}

.animate-drift-reverse {
  animation: drift-reverse 22s ease-in-out infinite;
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Selection */
::selection {
  background: rgb(16 185 129 / 0.3);
  color: white;
}
</style>
