const API_BASE_URL = ""; // ✅ USE PROXY

// Auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers = {
    "Accept": "application/json"
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const apiService = {

  // ======================
  // AUTH
  // ======================
  login: async ({ email, password, role }) => {
    try {
      const res = await fetch(`/api/auth/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password, role: role || "adopter" })
      });

      const text = await res.text();
      console.log("LOGIN RAW:", text);

      return JSON.parse(text);

    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Failed to connect to server" };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`/api/auth/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const text = await res.text();
      console.log("REGISTER RAW:", text);

      return JSON.parse(text);

    } catch (err) {
      console.error("Register error:", err);
      return { success: false };
    }
  },

  // ======================
  // PETS
  // ======================
  getPets: async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();

      const res = await fetch(
        `/api/pets/get_pets.php${query ? `?${query}` : ""}`
      );

      const text = await res.text();
      console.log("PETS RAW:", text);

      return JSON.parse(text)?.data || [];

    } catch (err) {
      console.error("Pets error:", err);
      return [];
    }
  },

  getPetById: async (id) => {
    try {
      const res = await fetch(`/api/pets/get_pet_by_id.php?id=${id}`);
      const text = await res.text();

      return JSON.parse(text)?.data || null;

    } catch (err) {
      console.error("Pet error:", err);
      return null;
    }
  },

  addPet: async (formData) => {
    try {
      const res = await fetch(`/api/pets/addPet.php`, {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      return JSON.parse(text);

    } catch (err) {
      console.error("Add pet error:", err);
      return { success: false };
    }
  },

  deletePet: async (id) => {
    try {
      const res = await fetch(`/api/pets/delete_pet.php`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `id=${encodeURIComponent(id)}`
      });

      const text = await res.text();
      return JSON.parse(text);

    } catch (err) {
      console.error("Delete pet error:", err);
      return { success: false };
    }
  },

  // ======================
  // ADOPTION
  // ======================
  submitScreening: async (data) => {
    try {
      const res = await fetch(`/api/screening/submit.php`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });

      const text = await res.text();
      console.log("SCREENING RAW:", text);

      return JSON.parse(text);

    } catch (err) {
      console.error("Application error:", err);
      return { success: false };
    }
  },

  // ======================
  // 💰 PAYMENT
  // ======================
  getUsers: async () => {
    try {
      const res = await fetch(`/api/users/get_users.php`);
      const text = await res.text();
      return JSON.parse(text)?.data || [];
    } catch (err) {
      console.error("Users error:", err);
      return [];
    }
  },

  getScreeningRequests: async () => {
    try {
      const res = await fetch(`/api/screening/get_screening_requests.php`);
      const text = await res.text();
      console.log("SCREENING REQUESTS RAW:", text);
      return JSON.parse(text);
    } catch (err) {
      console.error("Screening requests error:", err);
      return { success: false, applications: [] };
    }
  },

  approveScreening: async (id) => {
    try {
      const res = await fetch(`/api/screening/approve_screening.php`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ screening_id: id })
      });
      const text = await res.text();
      return JSON.parse(text);
    } catch (err) {
      console.error("Approve error:", err);
      return { success: false };
    }
  },

  rejectScreening: async (id) => {
    try {
      const res = await fetch(`/api/screening/reject_screening.php`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ screening_id: id })
      });
      const text = await res.text();
      return JSON.parse(text);
    } catch (err) {
      console.error("Reject error:", err);
      return { success: false };
    }
  },

  submitPayment: async ({ request_id }) => {
    try {
      console.log("🚀 Initiating payment for request_id:", request_id);
      const res = await fetch(`/payments/payment.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ request_id })
      });

      const text = await res.text();
      console.log("💰 PAYMENT RAW RESPONSE:", text);
      console.log("📊 Response status:", res.status, res.statusText);

      const data = JSON.parse(text);
      console.log("✅ Parsed payment response:", data);
      return data;

    } catch (err) {
      console.error("❌ Payment network error:", err);
      return { success: false, message: "Network error - check if backend server is running", debug: err.message };
    }
  },

  // New API method for frontend-initiated payment with phone/amount
  initiatePayment: async ({ request_id, phoneNumber, amount }) => {
    try {
      console.log("🚀 Initiating frontend payment:", { request_id, phoneNumber, amount });
      const res = await fetch(`/api/payment/initiate_payment.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ request_id, phone: phoneNumber, amount })
      });

      const text = await res.text();
      console.log("💰 INITIATE PAYMENT RAW:", text);
      console.log("📊 Response status:", res.status, res.statusText);

      const data = JSON.parse(text);
      console.log("✅ Parsed initiate response:", data);
      return data;

    } catch (err) {
      console.error("❌ Initiate payment network error:", err);
      return { success: false, message: "Network error - ensure XAMPP running", debug: err.message };
    }
  }

};

export default apiService;
