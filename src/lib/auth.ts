// Authentication utilities using localStorage

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  membershipPlan: 'Basic' | 'Premium' | 'VIP';
  membershipStatus: 'Active' | 'Expired' | 'Pending';
  membershipExpiry: string;
  joinDate: string;
  role: 'member' | 'admin';
}

export interface PaymentHistory {
  id: string;
  userId: string;
  amount: number;
  date: string;
  plan: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const USERS_KEY = 'gym_users';
const CURRENT_USER_KEY = 'gym_current_user';
const PAYMENTS_KEY = 'gym_payments';

// Initialize with default admin
const initializeDefaultData = () => {
  const users = getUsers();
  if (users.length === 0) {
    const adminUser: User = {
      id: 'admin-001',
      fullName: 'Admin User',
      email: 'admin@gym.com',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      emergencyContact: '0987654321',
      membershipPlan: 'VIP',
      membershipStatus: 'Active',
      membershipExpiry: '2099-12-31',
      joinDate: new Date().toISOString(),
      role: 'admin',
    };
    saveUsers([adminUser]);
  }
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const login = (email: string, password: string): User | null => {
  // Simple password check - in real app this would be hashed
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    // For demo: admin password is 'admin123', member password is 'member123'
    const expectedPassword = user.role === 'admin' ? 'admin123' : 'member123';
    if (password === expectedPassword) {
      setCurrentUser(user);
      return user;
    }
  }
  return null;
};

export const logout = () => {
  setCurrentUser(null);
};

export const register = (userData: Omit<User, 'id' | 'joinDate' | 'role' | 'membershipStatus' | 'membershipExpiry'>): User => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error('Email already registered');
  }

  // Calculate membership expiry (1 year from now)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const newUser: User = {
    ...userData,
    id: `member-${Date.now()}`,
    joinDate: new Date().toISOString(),
    membershipStatus: 'Active',
    membershipExpiry: expiryDate.toISOString(),
    role: 'member',
  };

  users.push(newUser);
  saveUsers(users);

  // Add initial payment record
  addPayment({
    userId: newUser.id,
    amount: getMembershipPrice(newUser.membershipPlan),
    plan: newUser.membershipPlan,
    status: 'Completed',
  });

  return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    setCurrentUser(users[index]);
  }

  return users[index];
};

export const deleteUser = (userId: string): boolean => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  
  if (filtered.length === users.length) return false;
  
  saveUsers(filtered);
  return true;
};

// Payment functions
export const getPayments = (): PaymentHistory[] => {
  const data = localStorage.getItem(PAYMENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addPayment = (payment: Omit<PaymentHistory, 'id' | 'date'>) => {
  const payments = getPayments();
  const newPayment: PaymentHistory = {
    ...payment,
    id: `pay-${Date.now()}`,
    date: new Date().toISOString(),
  };
  payments.push(newPayment);
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
};

export const getUserPayments = (userId: string): PaymentHistory[] => {
  return getPayments().filter(p => p.userId === userId);
};

export const getMembershipPrice = (plan: string): number => {
  const prices: Record<string, number> = {
    'Basic': 20000,
    'Premium': 30000,
    'VIP': 45000,
  };
  return prices[plan] || 0;
};

// Initialize default data on load
initializeDefaultData();
