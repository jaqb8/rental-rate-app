"use client";
import type { Session, User } from "lucia";
import { createContext, useContext, useState } from "react";

interface SessionProviderProps {
  user: User | null;
  session: Session | null;
  updateUserData: (newUserData: User | null) => void;
  clearSessionContext: () => void;
}

const SessionContext = createContext<SessionProviderProps | undefined>(
  undefined,
);

export const SessionProvider = ({
  children,
  initialValue,
}: {
  children: React.ReactNode;
  initialValue: { user: User | null; session: Session | null };
}) => {
  const [sessionData, setSessionData] = useState(initialValue);

  const updateUserData = (newUserData: User | null) => {
    if (!sessionData.user) {
      return;
    }
    setSessionData({
      ...sessionData,
      user: {
        ...sessionData.user,
        name: newUserData?.name ?? sessionData.user.name,
        image: newUserData?.image ?? sessionData.user.image,
      },
    });
  };

  const clearSessionContext = () => {
    setSessionData({
      user: null,
      session: null,
    });
  };

  const value = {
    ...sessionData,
    updateUserData,
    clearSessionContext,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return sessionContext;
};
