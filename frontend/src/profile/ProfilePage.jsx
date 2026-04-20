import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useProfileStore } from "../store/useProfileStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function ProfileHeader() {
  return (
    <div className="bg-surface border border-primary/10 rounded-2xl p-6 shadow-sm">
      <p className="text-xs tracking-[0.35em] text-primary/70 uppercase mb-2">
        My Account
      </p>

      <h1 className="text-3xl md:text-4xl font-serif text-accent mb-2">
        Profile Settings
      </h1>

      <p className="text-text/70">
        Manage your personal details, address, and security settings.
      </p>
    </div>
  );
}

function PersonalInfoCard() {
  const { userProfile, updateUserProfile } = useProfileStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    await updateUserProfile(formData);
    alert("Profile updated successfully");
  };

  return (
    <div className="bg-surface border border-primary/10 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-6">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          placeholder="Full Name"
        />

        <input
          value={userProfile?.email || ""}
          disabled
          className="input opacity-70 cursor-not-allowed"
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input"
          placeholder="Phone Number"
        />
      </div>

      <p className="text-xs text-text/60 mt-2">
        Email cannot be changed for security reasons
      </p>

      <button
        onClick={handleUpdate}
        className="mt-6 bg-primary text-bg px-6 py-3 rounded-md text-sm tracking-wide hover:opacity-90 transition"
      >
        UPDATE PROFILE
      </button>
    </div>
  );
}

function AddressCard() {
  const {
    addresses,
    addNewAddress,
    updateUserAddress,
    deleteUserAddress,
  } = useProfileStore();

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async () => {
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }

    await addNewAddress(newAddress);

    setNewAddress({
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });

    alert("Address added successfully");
  };

  const handleMakeDefault = async (address) => {
    await updateUserAddress(address._id, {
      ...address,
      isDefault: true,
    });

    alert("Default address updated");
  };

  return (
    <div className="bg-surface border border-primary/10 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-6">
        My Addresses
      </h2>

      {/* Existing Addresses */}
      <div className="space-y-4 mb-8">
        {addresses.length === 0 ? (
          <p className="text-text/60">
            No saved addresses found
          </p>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-xl p-4 ${
                address.isDefault
                  ? "border-primary bg-primary/5"
                  : "border-primary/10"
              }`}
            >
              <p className="font-medium">
                {address.street}
              </p>

              <p className="text-sm text-text/70">
                {address.city}, {address.state}
              </p>

              <p className="text-sm text-text/70">
                {address.pincode}
              </p>

              <div className="flex gap-3 mt-4">
                {!address.isDefault && (
                  <button
                    onClick={() =>
                      handleMakeDefault(address)
                    }
                    className="text-sm border border-primary px-4 py-2 rounded hover:bg-primary hover:text-bg transition"
                  >
                    Make Default
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteUserAddress(address._id)
                  }
                  className="text-sm border border-red-300 px-4 py-2 rounded hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>

              {address.isDefault && (
                <p className="text-xs text-primary mt-3">
                  Default Address
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add New Address */}
      <h3 className="text-lg font-medium mb-4">
        Add New Address
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="street"
          value={newAddress.street}
          onChange={handleChange}
          placeholder="Street Address"
          className="input md:col-span-2"
        />

        <input
          name="city"
          value={newAddress.city}
          onChange={handleChange}
          placeholder="City"
          className="input"
        />

        <input
          name="state"
          value={newAddress.state}
          onChange={handleChange}
          placeholder="State"
          className="input"
        />

        <input
          name="pincode"
          value={newAddress.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="input"
        />
      </div>

      <button
        onClick={handleAddAddress}
        className="mt-6 border border-primary px-6 py-3 rounded-md text-sm hover:bg-primary hover:text-bg transition"
      >
        ADD ADDRESS
      </button>
    </div>
  );
}

function SecurityCard() {
  return (
    <div className="bg-surface border border-primary/10 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-6">
        Security
      </h2>

      <div className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          className="input"
        />

        <input
          type="password"
          placeholder="New Password"
          className="input"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="input"
        />
      </div>

      <button className="mt-6 bg-accent text-bg px-6 py-3 rounded-md text-sm tracking-wide hover:opacity-90 transition">
        CHANGE PASSWORD
      </button>
    </div>
  );
}

function AccountActions() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-surface border border-primary/10 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-6">
        Account Actions
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/my-orders")}
          className="border border-primary px-6 py-3 rounded-md text-sm hover:bg-primary hover:text-bg transition"
        >
          View My Orders
        </button>

        <button
          onClick={handleLogout}
          className="border border-red-300 px-6 py-3 rounded-md text-sm hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const {
    fetchUserProfile,
    fetchUserAddresses,
  } = useProfileStore();

  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchUserProfile();
    fetchUserAddresses();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-text">
          Please login to view your profile
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-bg text-text min-h-screen px-4 md:px-8 lg:px-12 py-10 space-y-8">
        <ProfileHeader />
        <PersonalInfoCard />
        <AddressCard />
        <SecurityCard />
        <AccountActions />
      </div>
    </>
  );
}