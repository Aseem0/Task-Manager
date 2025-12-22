const API_URL = "http://127.0.0.1:8000/api/users/";

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const signup = async (userData) => {
  const accessToken = localStorage.getItem("accessToken");
  const res = await fetch(`${API_URL}register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Only admins/managers can register
    },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  const res = await fetch(`${API_URL}token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  return res.json();
};
