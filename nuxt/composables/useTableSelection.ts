import type { Ref, ComputedRef } from 'vue'

export function useTableSelection<T extends { id: string | number }>(getItems: () => (T[] | Ref<T[]> | ComputedRef<T[]>)) {
  const selected = ref<(string | number)[]>([])
  const items = computed(() => {
    const result = getItems()
    if (result && typeof result === 'object' && 'value' in result) {
      return (result as Ref<T[]>).value
    }
    return result as T[]
  })

  const allSelected = computed(() =>
    items.value.length > 0 && selected.value.length === items.value.length
  )

  function toggleAll() {
    if (allSelected.value) {
      selected.value = []
    } else {
      selected.value = items.value.map(item => item.id)
    }
  }

  function toggleOne(id: string | number) {
    const idx = selected.value.indexOf(id)
    if (idx === -1) {
      selected.value.push(id)
    } else {
      selected.value.splice(idx, 1)
    }
  }

  function isSelected(id: string | number) {
    return selected.value.includes(id)
  }

  function clearSelection() {
    selected.value = []
  }

  return {
    selected: readonly(selected),
    allSelected,
    toggleAll,
    toggleOne,
    isSelected,
    clearSelection,
    selectedCount: computed(() => selected.value.length),
  }
}
