import bcrypt from "bcryptjs";

export const localUsersStore = new Map();

export const initLocalStore = async () => {
  if (localUsersStore.size === 0) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const demoUser = {
      _id: "u001_priya",
      name: "Priya Sharma",
      email: "priya@email.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "customer",
      loyaltyTier: "Gold",
      loyaltyPoints: 120,
      isEmailVerified: true,
      isActive: true,
      preferences: { newsletter: false, sms: false, push: false },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    localUsersStore.set("priya@email.com", demoUser);
    localUsersStore.set("priya@example.com", { ...demoUser, email: "priya@example.com" });
    localUsersStore.set("admin@suiis.com", {
      ...demoUser,
      _id: "u002_admin",
      name: "Admin",
      email: "admin@suiis.com",
      role: "admin",
    });
  }
};

initLocalStore();
