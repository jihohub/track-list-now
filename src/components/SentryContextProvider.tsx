import * as Sentry from "@sentry/nextjs";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface ExtendedUser extends User {
  id: number;
  email: string;
  name?: string | null;
}

const createSentryUser = (user: ExtendedUser): Sentry.User => {
  const sentryUser: Sentry.User = {
    id: user.id,
  };

  // null이 아닌 경우에만 추가
  if (user.email) {
    sentryUser.email = user.email;
  }

  if (user.name) {
    sentryUser.username = user.name;
  }

  return sentryUser;
};

const SentryContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const sentryUser = createSentryUser(session.user as ExtendedUser);
      Sentry.setUser(sentryUser);
    } else {
      Sentry.setUser(null);
    }
  }, [session]);

  return children;
};

export default SentryContextProvider;
