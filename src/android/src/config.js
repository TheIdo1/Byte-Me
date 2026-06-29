import Constants from 'expo-constants';

// Auto-derives the API host from the Expo dev server's own IP address.
// When Expo runs on any machine, it knows its LAN IP via hostUri (e.g. "192.168.1.42:8082").
// We extract that IP and point to the web-server on port 8081 — no manual config needed.
function getApiUrl() {
  if (!__DEV__) {
    // Replace with your production URL when deploying
    return 'https://your-api-host.com/api';
  }
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:8081/api`;
  }
  return 'http://localhost:8081/api';
}

export const API_BASE_URL = getApiUrl();
