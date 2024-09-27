export function camelCaseToSentence(input) {
  if (!input) return;
  return input.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function capitalize(input) {
  if (!input) return;
  return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
}
