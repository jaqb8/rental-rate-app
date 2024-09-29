"use client";
import type { Session, User } from "lucia";
import { createContext, useContext, useState } from "react";

interface SessionProviderProps {
  user: User | null;
  session: Session | null;
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
  initialValue: Omit<SessionProviderProps, "clearSessionContext">;
}) => {
  const [sessionData, setSessionData] = useState(initialValue);

  const clearSessionContext = () => {
    setSessionData({
      user: null,
      session: null,
    });
  };

  const value = {
    ...sessionData,
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
