import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import Image from "next/image";

interface EmailVerificationTemplateProps {
  verificationLink: string;
}

export const EmailVerificationTemplate = ({
  verificationLink,
}: EmailVerificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verify your email for Rental Rate</Preview>
    <Tailwind>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading
              className="flex items-center justify-center gap-2"
              style={logo}
            >
              <img
                src="https://app.rentalrate.me/rental_logo2.svg"
                width={40}
                height={40}
                alt="logo"
                className="h-8 w-8 text-cyan-500"
              />
              Rental Rate
            </Heading>
          </Section>

          <Section style={contentSection}>
            <Heading as="h2" style={title}>
              Welcome to Rental Rate
            </Heading>
            <Text style={subtitle}>Verify Your Email Address</Text>
            <Text style={text}>
              Thanks for joining! To ensure the security of your account and get
              started, please verify your email address.
            </Text>

            <Button style={button} href={verificationLink}>
              Verify Email
            </Button>

            <Text style={smallText}>Or copy this link into your browser:</Text>
            <Text style={link}>
              <Link href={verificationLink} style={linkText}>
                {verificationLink}
              </Link>
            </Text>

            <div style={securityNote}>
              <Text style={securityText}>
                If you didn&apos;t create an account with Rental Rate, please
                ignore this email.
              </Text>
            </div>
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Text style={footer}>
              © 2024 Rental Rate. All rights reserved.
            </Text>
            <Text style={footerLinks}>
              <Link href="#" style={footerLink}>
                Privacy Policy
              </Link>
              {" • "}
              <Link href="#" style={footerLink}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailVerificationTemplate;

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  margin: "40px auto",
  padding: "0",
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

const logoSection = {
  backgroundColor: "#111827",
  padding: "32px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0",
  fontSize: "32px",
  color: "#ffffff",
  fontWeight: "700",
  letterSpacing: "-0.5px",
};

const contentSection = {
  padding: "48px 40px",
};

const title = {
  margin: "0",
  fontSize: "24px",
  fontWeight: "700",
  color: "#111827",
  textAlign: "center" as const,
  letterSpacing: "-0.5px",
};

const subtitle = {
  fontSize: "18px",
  color: "#4B5563",
  textAlign: "center" as const,
  margin: "16px 0 24px",
  fontWeight: "500",
};

const text = {
  margin: "0 0 24px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  maxWidth: "240px",
  margin: "32px auto",
  padding: "12px 0",
  transition: "background-color 0.2s ease-in-out",
};

const smallText = {
  fontSize: "14px",
  color: "#6B7280",
  textAlign: "center" as const,
  margin: "24px 0 8px",
};

const link = {
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const linkText = {
  color: "#111827",
  fontSize: "14px",
  textDecoration: "underline",
};

const securityNote = {
  backgroundColor: "#F3F4F6",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "32px",
};

const securityText = {
  margin: "0",
  fontSize: "14px",
  color: "#4B5563",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#E5E7EB",
  margin: "0",
};

const footerSection = {
  padding: "24px 40px",
  backgroundColor: "#F9FAFB",
};

const footer = {
  fontSize: "14px",
  color: "#6B7280",
  textAlign: "center" as const,
  margin: "0 0 8px",
};

const footerLinks = {
  fontSize: "14px",
  color: "#6B7280",
  textAlign: "center" as const,
  margin: "0",
};

const footerLink = {
  color: "#6B7280",
  textDecoration: "underline",
};
