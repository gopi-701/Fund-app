import Cookies from "js-cookie";

export const getDemoUser = () => {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    const decoded = JSON.parse(json);

    if (decoded.username === "gopi" || decoded.name === "gopi") {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
