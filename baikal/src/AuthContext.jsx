import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    deleteUser, 
    onAuthStateChanged, 
    EmailAuthProvider, 
    reauthenticateWithCredential 
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children, adminId }) => {
    const [user, setUser] = useState(null);
    const isAuthenticated = !!user;

    
    const isAdmin = user?.uid === adminId;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userProfile = await loadUserProfile(currentUser.uid);
                    setUser({ ...currentUser, ...userProfile });
                } catch (error) {
                    console.error("Error loading user profile:", error);
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const loadUserProfile = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                console.warn("User profile not found");
                return {};
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
            return {};
        }
    };

    const signUp = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            const userProfile = { id: newUser.uid, name: "", phone: "", address: "", role: "user" }; // Добавляем role по умолчанию
            await setDoc(doc(db, "users", newUser.uid), userProfile);
            setUser({ ...newUser, ...userProfile });
            return newUser;
        } catch (error) {
            console.error("Sign up error:", error);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userProfile = await loadUserProfile(userCredential.user.uid);
            setUser({ ...userCredential.user, ...userProfile });
            return userCredential.user;
        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    };

    const logOut = async () => {
        await signOut(auth);
        setUser(null);
    };

    const updateUserProfile = async (name, phone, address) => {
        if (!user) throw new Error("User not authenticated");
        try {
            await setDoc(doc(db, "users", user.uid), { name, phone, address }, { merge: true });
            setUser((prevUser) => ({ ...prevUser, name, phone, address }));
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            isAdmin, 
            signUp, 
            signIn, 
            logOut, 
            updateUserProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);