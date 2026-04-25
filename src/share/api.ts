// API HELPER
export class API {
  protected async request<T>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
  }
}
