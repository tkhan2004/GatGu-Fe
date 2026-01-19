const API_BASE_URL = 'http://localhost:8000';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.refreshPromise = null;
    }

    // Token management
    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    setAccessToken(token) {
        localStorage.setItem('access_token', token);
    }

    getRefreshToken() {
        return localStorage.getItem('refresh_token');
    }

    setRefreshToken(token) {
        localStorage.setItem('refresh_token', token);
    }

    getToken() {
        return this.getAccessToken();
    }

    setToken(token) {
        this.setAccessToken(token);
    }

    removeTokens() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    removeToken() {
        this.removeTokens();
    }

    // User data persistence
    getStoredUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    setStoredUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Token refresh logic
    async refreshAccessToken() {
        // Prevent multiple simultaneous refresh requests
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        this.refreshPromise = (async () => {
            try {
                const response = await fetch(`${this.baseURL}/users/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });

                if (!response.ok) {
                    throw new Error('Token refresh failed');
                }

                const data = await response.json();
                this.setAccessToken(data.access_token);

                // Update refresh token if provided
                if (data.refresh_token) {
                    this.setRefreshToken(data.refresh_token);
                }

                return data.access_token;
            } catch (error) {
                // Refresh failed, clear all tokens
                this.removeTokens();
                throw error;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getAccessToken();

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token && !options.skipAuth) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            let response = await fetch(url, config);

            // Handle 401 Unauthorized - try to refresh token
            if (response.status === 401 && !options.skipAuth && !options._isRetry) {
                try {
                    await this.refreshAccessToken();

                    // Retry request with new token
                    const newToken = this.getAccessToken();
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    config._isRetry = true;

                    response = await fetch(url, config);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    window.location.href = '/login';
                    throw new Error('Session expired. Please login again.');
                }
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
                throw new Error(error.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await this.request('/users/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
            skipAuth: true,
        });

        // Store tokens
        this.setAccessToken(response.access_token);
        if (response.refresh_token) {
            this.setRefreshToken(response.refresh_token);
        }

        // Fetch and store user data
        const user = await this.getCurrentUser();
        this.setStoredUser(user);

        return response;
    }

    async register(userData) {
        const response = await this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            skipAuth: true,
        });
        return response;
    }

    async getCurrentUser() {
        return await this.request('/users/me');
    }

    async updateUser(userData) {
        const response = await this.request('/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
        this.setStoredUser(response);
        return response;
    }

    async forgotPassword(email) {
        return await this.request('/users/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
            skipAuth: true,
        });
    }

    async resetPassword(email, newPassword, code) {
        return await this.request('/users/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, new_password: newPassword, code }),
            skipAuth: true,
        });
    }

    async getStatisticsSummary(period = null) {
        const params = period ? `?period=${period}` : '';
        return await this.request(`/statistics/summary${params}`);
    }

    async getMyTrips(limit = 10, period = null) {
        const params = new URLSearchParams();
        params.append('limit', limit);
        if (period) params.append('period', period);
        return await this.request(`/statistics/trips?${params}`);
    }

    async getTripDetails(tripId) {
        return await this.request(`/statistics/trips/${tripId}`);
    }

    async getDrivingStats() {
        return await this.request('/statistics/durations');
    }

    async getCalendarCheckin(month, year) {
        return await this.request(`/statistics/calendar?month=${month}&year=${year}`);
    }

    async startTrip() {
        return await this.request('/trips/start', {
            method: 'POST',
        });
    }

    async endTrip() {
        return await this.request('/trips/end', {
            method: 'POST',
        });
    }

    async createDetectionLog(tripId, logData) {
        return await this.request(`/trips/${tripId}/logs`, {
            method: 'POST',
            body: JSON.stringify(logData),
        });
    }

    async createDetectionAutoTrip(logData) {
        return await this.request('/trips/detections', {
            method: 'POST',
            body: JSON.stringify(logData),
        });
    }

    async sendAlert(alertData) {
        return await this.request('/ai/alert', {
            method: 'POST',
            body: JSON.stringify(alertData),
        });
    }

    async getContacts() {
        return await this.request('/contacts/');
    }

    async createContact(contactData) {
        return await this.request('/contacts/', {
            method: 'POST',
            body: JSON.stringify(contactData),
        });
    }

    async updateContact(contactId, contactData) {
        return await this.request(`/contacts/${contactId}`, {
            method: 'PUT',
            body: JSON.stringify(contactData),
        });
    }

    async deleteContact(contactId) {
        return await this.request(`/contacts/${contactId}`, {
            method: 'DELETE',
        });
    }

    logout() {
        this.removeTokens();
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getAccessToken();
    }
}

export default new ApiService();
