export const state = () => ({
  expanded: true,
})

export const mutations = {
  setExpanded(state, value) {
    state.expanded = value
  }
}
