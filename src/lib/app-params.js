// Decoupled from Base44
export const appParams = {
  appId: process.env.NEXT_PUBLIC_APP_ID || "",
  token: typeof window !== "undefined" ? window.localStorage.getItem("axis_access_token") : null,
  functionsVersion: "",
  appBaseUrl: "",
};

export default appParams;
