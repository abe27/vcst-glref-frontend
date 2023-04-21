import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import https from "https";

// console.log(process.env.JWT_SECRET)
// console.log(process.env.API_HOST)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "xpw-project",
      credentials: {},
      async authorize(credentials, req) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        });

        // const urlencoded = new URLSearchParams();
        // urlencoded.append("username", credentials.username);
        // urlencoded.append("password", credentials.password);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const res = await fetch(
          `${process.env.API_HOST}/login`,
          requestOptions
        );
        if (res.status === 200) {
          const data = await res.json();
          if (data) {
            return data;
          }
        } else {
          console.dir(res);
        }
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: "24h",
  },
  pages: {
    signIn: "/auth",
    signOut: "/auth",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          userId: user.data.user.id,
          userName: user.data.user.username,
          fullName: `${user.data.user.first_name} ${user.data.user.last_name}`,
          email: user.data.user.email,
          isAdmin: user.data.user.permission.title === "Administrator",
          avatar_url: user.data.user.avatar_url,
          accessToken: `${user.data.type} ${user.data.token}`,
          company: user.data.user.company,
          position: user.data.user.position,
          section: user.data.user.section,
          department: user.data.user.department,
          permission: user.data.user.permission,
          whs: user.data.user.whs,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.userId = token.userId;
      session.user.userName = token.userName;
      session.user.fullName = token.fullName;
      session.user.email = token.email;
      session.user.isAdmin = token.isAdmin;
      session.user.avatar_url = token.avatar_url;
      session.user.accessToken = token.accessToken;
      session.error = token.error;
      session.user.company = token.company;
      session.user.position = token.position;
      session.user.section = token.section;
      session.user.department = token.department;
      session.user.permission = token.permission;
      session.user.whs = token.whs;
      return session;
    },
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
