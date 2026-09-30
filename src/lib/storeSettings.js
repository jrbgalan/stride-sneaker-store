const KEY = "axis-store-settings";

export const DEFAULT_SETTINGS = {
  store_name: "AXIS",
  contact_email: "support@axis.com",
  shipping_fee: 12,
  free_shipping_threshold: 100,
  tax_rate: 0.08,
};

export function getSettings() {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(s) {
  localStorage.setItem(KEY, JSON.stringify({ ...getSettings(), ...s }));
}