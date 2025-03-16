import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const Auth = ({ closeAuthModal }) => {
  console.log("Rendering Auth component...");
  const { user, isAuthenticated, signUp, signIn, logOut, updateUserProfile } = useAuth();
  console.log("Auth context:", { user, isAuthenticated });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Используем данные из user для заполнения полей
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");

  // Обновляем поля, если user изменился
  useEffect(() => {
    if (user) {
      setName(user?.name ?? "");
      setPhone(user?.phone ?? "");
      setAddress(user?.address ?? "");
    }
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      if (isRegistering) {
        await signUp(email, password);
        setSuccessMessage("Registration successful! Please fill in your profile details.");
      } else {
        await signIn(email, password);
        setSuccessMessage("Login successful!");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await updateUserProfile(name, phone, address);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <button onClick={closeAuthModal} style={modalStyles.closeButton}>X</button>
        <h1>{user ? "Profile Settings" : isRegistering ? "Registration" : "Login"}</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        {/* Поля профиля отображаются, если пользователь авторизован */}
        {user && (
          <>
            <h2>Profile</h2>
            <form onSubmit={handleSaveProfile}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Save Profile</button>
            </form>
            <button onClick={logOut}>Log out</button>
          </>
        )}

        {/* Форма авторизации/регистрации отображается, если пользователь не авторизован */}
        {!user && (
          <>
            <form onSubmit={handleAuth}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">{isRegistering ? "Register" : "Login"}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Добавляем определение modalStyles
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    opacity: 1,
    animation: "fadeIn 0.3s ease-in-out",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "20px",
    width: "300px",
    position: "relative",
    animation: "slideIn 0.5s ease-in-out",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  }
};

export default Auth;