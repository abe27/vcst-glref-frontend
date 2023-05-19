/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { Noto_Sans_Thai } from "next/font/google";

const fonts = Noto_Sans_Thai({ weight: "400", subsets: ["latin"] });
import {
  Avatar,
  Dropdown,
  Navbar,
  Text,
  styled,
  useTheme,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { icons } from "./elements/Icons";
import Link from "next/link";

const Box = styled("div", {
  boxSizing: "border-box",
});

const AcmeLogo = () => (
  <svg
    className=""
    fill="none"
    height="36"
    viewBox="0 0 32 32"
    width="36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect fill="var(--secondary)" height="100%" rx="16" width="100%" />
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const MainLayout = ({
  children,
  title = process.env.APP_NAME,
  description = process.env.APP_DESCRIPTION,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { isDark } = useTheme();

  const collapseItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  const verifyToken = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", session?.user.accessToken);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const res = await fetch(`${process.env.API_HOST}/verify`, requestOptions);
      if (!res.ok) {
        router.push("/auth");
      }
    } catch {}
  };

  const handleUserMenu = (actionKey) => {
    try {
      console.log(actionKey.actionKey);
      router.push(`/${actionKey.actionKey}`);
    } catch {}
  };

  const handleFeatureMenu = (actionKey) => {
    try {
      console.log(actionKey.actionKey);
      router.push(`/feature/${actionKey.actionKey}`);
    } catch {}
  };

  useEffect(() => {
    if (session?.user) {
      verifyToken();
    }
  }, [session]);
  return (
    <div className={fonts.className}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen">
        <Box
          css={{
            maxW: "100%",
          }}
        >
          <Navbar shouldHideOnScroll isBordered={isDark} variant="sticky">
            <Navbar.Brand>
              <AcmeLogo />
              <Link href="/">
                <Text b color="inherit" hideIn="xs">
                  {process.env.APP_NAME}
                </Text>
              </Link>
            </Navbar.Brand>
            <Navbar.Content hideIn="xs" variant="underline">
              <Navbar.Link href="/">Home</Navbar.Link>
              <Dropdown isBordered>
                <Navbar.Item>
                  <Dropdown.Button
                    auto
                    light
                    css={{
                      px: 0,
                      dflex: "center",
                      svg: { pe: "none" },
                    }}
                    iconRight={icons.chevron}
                    ripple={false}
                  >
                    Features
                  </Dropdown.Button>
                </Navbar.Item>
                <Dropdown.Menu
                  aria-label="ACME features"
                  css={{
                    $$dropdownMenuWidth: "340px",
                    $$dropdownItemHeight: "70px",
                    "& .nextui-dropdown-item": {
                      py: "$4",
                      // dropdown item left icon
                      svg: {
                        color: "$secondary",
                        mr: "$4",
                      },
                      // dropdown item title
                      "& .nextui-dropdown-item-content": {
                        w: "100%",
                        fontWeight: "$semibold",
                      },
                    },
                  }}
                  onAction={(actionKey) => handleFeatureMenu({ actionKey })}
                >
                  <Dropdown.Item
                    key="adjust"
                    showFullDescription
                    description="จัดการข้อมูลการรับสินค้าเข้าคลัง"
                    icon={icons.edit}
                  >
                    Receive Invoice Adjust
                  </Dropdown.Item>
                  {/* <Dropdown.Item
                    key="usage_metrics"
                    showFullDescription
                    description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
                    icon={icons.activity}
                  >
                    Usage Metrics
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="production_ready"
                    showFullDescription
                    description="ACME runs on ACME, join us and others serving requests at web scale."
                    icon={icons.flash}
                  >
                    Production Ready
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="99_uptime"
                    showFullDescription
                    description="Applications stay on the grid with high availability and high uptime guarantees."
                    icon={icons.server}
                  >
                    +99% Uptime
                  </Dropdown.Item>
                  <Dropdown.Item
                    key="supreme_support"
                    showFullDescription
                    description="Overcome any challenge with a supporting team ready to respond."
                    icon={icons.user}
                  >
                    +Supreme Support
                  </Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
              <Navbar.Link href="/stock">Stock</Navbar.Link>
            </Navbar.Content>
            <Navbar.Content
              css={{
                "@xs": {
                  w: "12%",
                  jc: "flex-end",
                },
              }}
            >
              <Dropdown placement="bottom-right">
                <Navbar.Item>
                  <Dropdown.Trigger>
                    <Avatar
                      bordered
                      as="button"
                      size="md"
                      src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&rounded=true&size=150&name=${session?.user.fullName}&bold=true`}
                    />
                  </Dropdown.Trigger>
                </Navbar.Item>
                <Dropdown.Menu
                  aria-label="User menu actions"
                  color="primary"
                  onAction={(actionKey) => handleUserMenu({ actionKey })}
                >
                  <Dropdown.Item key="profile" css={{ height: "$18" }}>
                    <Text b color="inherit" css={{ d: "flex" }}>
                      {session?.user.userName}
                    </Text>
                    <Text b color="inherit" css={{ d: "flex" }}>
                      {session?.user.email}
                    </Text>
                  </Dropdown.Item>
                  <Dropdown.Item key="profile" withDivider>
                    My Profile
                  </Dropdown.Item>
                  <Dropdown.Item key="system">System Settings</Dropdown.Item>
                  {/* <Dropdown.Item key="analytics" withDivider>
                    Analytics
                  </Dropdown.Item> */}
                  {/* <Dropdown.Item key="system">System</Dropdown.Item>
                  <Dropdown.Item key="configurations">
                    Configurations
                  </Dropdown.Item> */}
                  <Dropdown.Item key="help" withDivider>
                    Help & Feedback
                  </Dropdown.Item>
                  <Dropdown.Item key="logout" withDivider color="error">
                    Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Content>
          </Navbar>
          <div className="pl-14 pr-14 my-6 pb-4 ">{children}</div>
        </Box>
      </div>
    </div>
  );
};

export default MainLayout;
