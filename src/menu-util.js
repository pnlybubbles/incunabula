function updateMenu (idPath, baseMenuItem, prop) {
  const item = idPath.reduce((p, c) => {
    return getMenu(p.submenu, c)
  }, baseMenuItem)
  Object.keys(prop).forEach((k) => {
    item[k] = prop[k]
  })
}

function getMenu (target, id) {
  return target.items.find(v => v.id === id)
}

module.exports = {
  updateMenu,
  getMenu
}
