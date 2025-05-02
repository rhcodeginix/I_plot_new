import axios from "axios";

export const VIPPS_CONFIG = {
  clientId: "4a0aa1b1-00f1-4f64-a458-e8b2f47386f3",
  redirectUri: "https://fjellheimhytta.mintomt.no",
  scope: "openid name phoneNumber address email birthDate",
  apiSubscriptionKey: "ae44421e7dad472292635ce6df2ed534",
  authEndpoint: "https://api.vipps.no/access-management-1.0/access/oauth2/auth",
  tokenEndpoint:
    "https://api.vipps.no/access-management-1.0/access/oauth2/token",
  userInfoEndpoint: "https://api.vipps.no/vipps-userinfo-api/userinfo",
};

export const generateState = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const storeState = (state: string): void => {
  localStorage.setItem("vippsAuthState", state);
};

export const validateState = (returnedState: string): boolean => {
  const storedState = localStorage.getItem("vippsAuthState");
  return storedState === returnedState;
};

export const getVippsLoginUrl = (): string => {
  const state = generateState();
  storeState(state);

  const params = new URLSearchParams({
    client_id: VIPPS_CONFIG.clientId,
    redirect_uri: VIPPS_CONFIG.redirectUri,
    response_type: "code",
    scope: VIPPS_CONFIG.scope,
    state: state,
  });

  return `${VIPPS_CONFIG.authEndpoint}?${params.toString()}`;
};

export const exchangeCodeForTokens = async (code: string): Promise<any> => {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", VIPPS_CONFIG.redirectUri);
    params.append("client_id", VIPPS_CONFIG.clientId);

    const response = await axios.post(VIPPS_CONFIG.tokenEndpoint, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Ocp-Apim-Subscription-Key": VIPPS_CONFIG.apiSubscriptionKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    throw error;
  }
};

export const getUserInfo = async (accessToken: string): Promise<any> => {
  try {
    const response = await axios.get(VIPPS_CONFIG.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Ocp-Apim-Subscription-Key": VIPPS_CONFIG.apiSubscriptionKey,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const storeTokens = (tokens: any): void => {
  localStorage.setItem("vippsAccessToken", tokens.access_token);
  localStorage.setItem("vippsIdToken", tokens.id_token);
  localStorage.setItem("vippsRefreshToken", tokens.refresh_token || "");
  localStorage.setItem(
    "vippsTokenExpiresAt",
    (Date.now() + tokens.expires_in * 1000).toString()
  );
};

export const isVippsAuthenticated = (): boolean => {
  const expiresAt = localStorage.getItem("vippsTokenExpiresAt");
  const accessToken = localStorage.getItem("vippsAccessToken");
  const userInfo = localStorage.getItem("vippsUserInfo");

  const isAuthenticated =
    !!accessToken &&
    !!expiresAt &&
    !!userInfo &&
    Date.now() < parseInt(expiresAt);

  return isAuthenticated;
};

export const logoutVipps = (): void => {
  localStorage.removeItem("vippsAccessToken");
  localStorage.removeItem("vippsIdToken");
  localStorage.removeItem("vippsRefreshToken");
  localStorage.removeItem("vippsTokenExpiresAt");
  localStorage.removeItem("vippsAuthState");
  localStorage.removeItem("vippsUserInfo");
};

export const parseUrlParams = (url: string): URLSearchParams => {
  const parsedUrl = new URL(url);

  if (parsedUrl.hash) {
    return new URLSearchParams(parsedUrl.hash.substring(1));
  }

  return new URLSearchParams(parsedUrl.search);
};
