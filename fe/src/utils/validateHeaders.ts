const REQUIRED_HEADERS = ['name', 'type'];

export function getMissingHeaders(headers: string[]): string[] {
  return REQUIRED_HEADERS.filter((h) => !headers.includes(h));
}
