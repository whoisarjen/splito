export interface GroupMember {
  id: string
  userId: string
  name: string
  avatar: string | null
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
}

export interface Group {
  id: string
  name: string
  description: string | null
  defaultCurrency: string
  settlementCurrency: string | null
  imageUrl: string | null
  inviteCode: string
  createdAt: string
  memberCount: number
  expenseCount: number
  members: GroupMember[]
}

interface GroupsState {
  groups: Group[]
  selectedGroup: Group | null
  loading: boolean
  error: string | null
}

export function useGroups() {
  const state = useState<GroupsState>('groups', () => ({
    groups: [],
    selectedGroup: null,
    loading: false,
    error: null,
  }))

  const groups = computed(() => state.value.groups)
  const selectedGroup = computed(() => state.value.selectedGroup)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)

  async function fetchGroups() {
    state.value.loading = true
    state.value.error = null

    try {
      const data = await $fetch<Group[]>('/api/groups')
      state.value.groups = data
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch groups'
    } finally {
      state.value.loading = false
    }
  }

  async function fetchGroup(id: string) {
    state.value.loading = true
    state.value.error = null

    try {
      const data = await $fetch<Group>(`/api/groups/${id}`)
      state.value.selectedGroup = data as Group
      return data
    } catch (err: any) {
      state.value.error = err.message || 'Failed to fetch group'
      return null
    } finally {
      state.value.loading = false
    }
  }

  async function createGroup(data: {
    name: string
    description?: string
    defaultCurrency: string
    settlementCurrency?: string
  }) {
    state.value.loading = true
    state.value.error = null

    try {
      const group = await $fetch<Group>('/api/groups', {
        method: 'POST',
        body: data,
      })
      state.value.groups.unshift(group)
      return group
    } catch (err: any) {
      state.value.error = err.message || 'Failed to create group'
      return null
    } finally {
      state.value.loading = false
    }
  }

  async function joinGroup(inviteCode: string) {
    state.value.loading = true
    state.value.error = null

    try {
      const result = await $fetch<{ groupId: string; alreadyMember: boolean }>(
        `/api/groups/join/${inviteCode}`,
        { method: 'POST' }
      )
      // Refresh groups list
      await fetchGroups()
      return result
    } catch (err: any) {
      state.value.error = err.message || 'Failed to join group'
      return null
    } finally {
      state.value.loading = false
    }
  }

  function selectGroup(group: Group | null) {
    state.value.selectedGroup = group
  }

  return {
    groups,
    selectedGroup,
    loading,
    error,
    fetchGroups,
    fetchGroup,
    createGroup,
    joinGroup,
    selectGroup,
  }
}
