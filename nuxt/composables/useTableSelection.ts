export function useTableSelection<T extends { id: string | number }>(getItems: () => T[]) {
  const selected = ref<(string | number)[]>([])
  const items = computed(getItems)

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
