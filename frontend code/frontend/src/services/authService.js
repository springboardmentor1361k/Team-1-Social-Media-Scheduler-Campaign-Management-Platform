import api from './api';

const authService = {
  /*  login: async (email, password) => {
      try {
        // const response = await api.post('/login', { email, password });
        const response = await api.post('/auth/login', { email, password });
        // return response.data;
        return {
          token: "demo-token",
          user: {
            id: response.data.user.id,
            name: response.data.user.username,
            email: response.data.user.email
          }
        };
  
      } catch (error) {
        console.warn("[API MOCK] Backend not reachable, using mock login details.");
  
        // Validation simulations
        if (!email.includes('@')) {
          throw new Error('Invalid email address format.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
  
        // Successful mock response
        return {
          token: "mock-jwt-token-12345",
          user: {
            id: "usr_100",
            name: "Jane Doe",
            email: email,
            phone: "+1 555-019-2834",
            companyName: "SocialPilot Corp",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          }
        };
      }
    }, */
  /*login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log("LOGIN RESPONSE:", response.data);
      return response.data;
    } catch (error) {
      console.log("LOGIN ERROR:", error.response);
      throw error;
    }
  },   */
  login: async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // Backend expects email in the username field
      formData.append("password", password);

      const response = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("LOGIN RESPONSE:", response.data);
      return {
        token: response.data.access_token,
        user: response.data.user
      };
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || null,
        company_name: userData.companyName || null
      });

      console.log("REGISTER RESPONSE:", response.data);
      return {
        token: response.data.access_token,
        user: response.data.user
      };
    } catch (error) {
      console.log("REGISTER ERROR:", error.response);
      throw error;
    }
  },

  /*  register: async (userData) => {
      try {
        // const response = await api.post('/register', userData);
        const response = await api.post('/auth/register', userData);
        // return response.data;
        return {
          token: "demo-token",
          user: {
            username: userData.username,
            email: userData.email
          }
        };
      } catch (error) {
        console.warn("[API MOCK] Backend not reachable, using mock register details.");
  
        if (!userData.email.includes('@')) {
          throw new Error('Invalid email address format.');
        }
        if (userData.password !== userData.confirmPassword) {
          // Wait, password confirmation check is done inside component, but service check is clean.
        }
  
        return {
          token: "mock-jwt-token-67890",
          user: {
            id: "usr_101",
            name: userData.name || "Anonymous User",
            email: userData.email,
            phone: userData.phone || "+1 555-000-0000",
            companyName: userData.companyName || "My Business",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          }
        };
      }
    }, */

  logout: () => {
    // Synchronous logout cleanup
    console.log("Logged out successfully");
  }
};

export default authService;
