export function gridFilter(a: any, model: any) {
  if (!Object.hasOwn(model, "items")) return true;
  if (!Object.hasOwn(model.items, "operator")) return true;
  if (!Object.hasOwn(model.items, "field")) return true;
  if (!Object.hasOwn(model.items, "value")) return true;
  const {
    operator,
    field,
    value,
  }: { operator: string; field: string; value: string } = model.items[0];
  if (!value) return true;
  const valueUp = value.toUpperCase();
  if (operator === "contains") {
    if (typeof a[field] === "string") {
      return a[field].toUpperCase().includes(valueUp);
    } else {
      return false;
    }
  }
  return true;
}
