// Tiny durable store: orders in one JSON file (atomic writes), messages as JSON lines.
// Fine for a studio's volume. Swap for Postgres/Mongo if you outgrow it.
import fs from 'node:fs'
import path from 'node:path'

export function createStore(dir) {
  fs.mkdirSync(dir, { recursive: true })
  const ordersFile = path.join(dir, 'orders.json')
  let orders = {}
  try { orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8')) } catch { /* first run */ }

  const flush = () => {
    const tmp = ordersFile + '.tmp'
    fs.writeFileSync(tmp, JSON.stringify(orders, null, 2))
    fs.renameSync(tmp, ordersFile)
  }
  const append = (name, obj) =>
    fs.appendFileSync(path.join(dir, name), JSON.stringify({ at: new Date().toISOString(), ...obj }) + '\n')

  return {
    getOrder: (id) => orders[id],
    saveOrder(order) { orders[order.id] = order; flush(); return order },
    updateOrder(id, patch) {
      if (!orders[id]) return null
      orders[id] = { ...orders[id], ...patch }; flush(); return orders[id]
    },
    append,
  }
}
