<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { user, signOut } = useAuth()
const { groups, loading, fetchGroups } = useGroups()
const { formatCurrency } = useCurrency()

const showCreateModal = ref(false)
const showJoinModal = ref(false)

onMounted(() => {
  fetchGroups()
})
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/dashboard" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Icon name="heroicons:squares-2x2-solid" class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-semibold tracking-tight">Splito</span>
        </NuxtLink>

        <div class="flex items-center gap-4">
          <button
            @click="showJoinModal = true"
            class="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Icon name="heroicons:link" class="w-4 h-4" />
            Join Group
          </button>
          <button
            @click="showCreateModal = true"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Icon name="heroicons:plus" class="w-4 h-4" />
            <span class="hidden sm:inline">New Group</span>
          </button>

          <!-- User Menu -->
          <div class="relative group">
            <button class="flex items-center gap-2 p-1 rounded-full hover:bg-stone-100 transition-colors">
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="w-8 h-8 rounded-full"
              />
              <div v-else class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <span class="text-sm font-medium text-brand-700">{{ user?.name?.[0] }}</span>
              </div>
            </button>

            <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div class="px-4 py-2 border-b border-stone-100">
                <p class="font-medium text-sm truncate">{{ user?.name }}</p>
                <p class="text-xs text-stone-500 truncate">{{ user?.email }}</p>
              </div>
              <button
                @click="signOut"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-8">
      <!-- Welcome Banner -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-stone-900">
          Welcome back, {{ user?.name?.split(' ')[0] }}
        </h1>
        <p class="text-stone-600">Manage your shared expenses and settle up with friends.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-stone-200 p-6 animate-pulse">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-stone-200"></div>
            <div class="flex-1">
              <div class="h-4 bg-stone-200 rounded w-2/3 mb-2"></div>
              <div class="h-3 bg-stone-100 rounded w-1/2"></div>
            </div>
          </div>
          <div class="h-px bg-stone-100 my-4"></div>
          <div class="h-8 bg-stone-100 rounded"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="groups.length === 0" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand-100 flex items-center justify-center">
          <Icon name="heroicons:user-group" class="w-10 h-10 text-brand-600" />
        </div>
        <h2 class="text-xl font-semibold mb-2">No groups yet</h2>
        <p class="text-stone-600 mb-6 max-w-sm mx-auto">
          Create your first group to start tracking shared expenses with friends, roommates, or travel buddies.
        </p>
        <div class="flex items-center justify-center gap-4">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Icon name="heroicons:plus" class="w-5 h-5" />
            Create Group
          </button>
          <button
            @click="showJoinModal = true"
            class="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
          >
            <Icon name="heroicons:link" class="w-5 h-5" />
            Join Group
          </button>
        </div>
      </div>

      <!-- Groups Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="group in groups"
          :key="group.id"
          :to="`/groups/${group.id}`"
          class="group bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:border-brand-200 transition-all duration-200"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/20">
                {{ group.name[0] }}
              </div>
              <div>
                <h3 class="font-semibold text-stone-900 group-hover:text-brand-600 transition-colors">
                  {{ group.name }}
                </h3>
                <p class="text-sm text-stone-500">{{ group.memberCount }} members</p>
              </div>
            </div>
          </div>

          <p v-if="group.description" class="text-sm text-stone-600 mb-4 line-clamp-2">
            {{ group.description }}
          </p>

          <div class="h-px bg-stone-100 my-4"></div>

          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-1 text-stone-500">
              <Icon name="heroicons:receipt-percent" class="w-4 h-4" />
              <span>{{ group.expenseCount }} expenses</span>
            </div>
            <span class="font-medium text-brand-600">{{ group.defaultCurrency }}</span>
          </div>

          <!-- Member Avatars -->
          <div class="flex items-center -space-x-2 mt-4">
            <div
              v-for="(member, i) in group.members.slice(0, 4)"
              :key="member.id"
              class="w-8 h-8 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-xs font-medium overflow-hidden"
            >
              <img v-if="member.avatar" :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
              <span v-else>{{ member.name[0] }}</span>
            </div>
            <div
              v-if="group.members.length > 4"
              class="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-600"
            >
              +{{ group.members.length - 4 }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </main>

    <!-- Create Group Modal Placeholder -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showCreateModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <h2 class="text-xl font-semibold mb-4">Create New Group</h2>
          <p class="text-stone-600 mb-4">Group creation form coming soon...</p>
          <button
            @click="showCreateModal = false"
            class="w-full py-2 bg-stone-100 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Join Group Modal Placeholder -->
    <Teleport to="body">
      <div v-if="showJoinModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="showJoinModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <h2 class="text-xl font-semibold mb-4">Join a Group</h2>
          <p class="text-stone-600 mb-4">Enter the invite code from your friend...</p>
          <button
            @click="showJoinModal = false"
            class="w-full py-2 bg-stone-100 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
