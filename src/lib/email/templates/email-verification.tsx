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

interface EmailVerificationTemplateProps {
  verificationLink: string;
}

export const EmailVerificationTemplate = ({
  verificationLink,
}: EmailVerificationTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verify your email for Rate Your Landlord</Preview>
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: "#007291",
            },
          },
        },
      }}
    >
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={header}>Rate Your Landlord</Heading>
          </Section>
          <Section style={contentSection}>
            <Heading as="h2" style={title}>
              Verify Your Email
            </Heading>
            <Text style={text}>
              Thank you for signing up with Rate Your Landlord. To complete your
              registration, please verify your email address by clicking the
              button below:
            </Text>
            <div className="flex justify-center">
              <Button style={button} href={verificationLink}>
                Verify Email Address
              </Button>
            </div>
            <Text style={text} className="pt-4">
              If the button above doesn&apos;t work, you can also verify your
              email by copying and pasting the following link into your browser:
            </Text>
            <Text style={link}>
              <Link href={verificationLink}>{verificationLink}</Link>
            </Text>
            <Text style={text}>
              If you didn&apos;t create an account with Rate Your Landlord, you
              can safely ignore this email.
            </Text>
          </Section>
          <Hr style={hr} />
          <Section style={footerSection}>
            <Text style={footer}>
              © 2024 Rate Your Landlord. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailVerificationTemplate;

const main = {
  backgroundColor: "#1a1a1a",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#000000",
};

const headerSection = {
  padding: "20px",
  backgroundColor: "#4a148c",
  textAlign: "center" as const,
};

const header = {
  margin: "0",
  fontSize: "24px",
  color: "#ffffff",
  fontWeight: "bold",
};

const contentSection = {
  padding: "40px 30px 0 30px",
};

const title = {
  margin: "0 0 20px",
  fontSize: "28px",
  textAlign: "center" as const,
  color: "#ffffff",
};

const text = {
  margin: "0 0 20px",
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#cccccc",
};

const button = {
  backgroundColor: "#9c27b0",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "50%",
  padding: "10px 0",
};

const link = {
  ...text,
  color: "#9c27b0",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#333333",
  margin: "20px 0",
};

const footerSection = {
  padding: "20px",
  backgroundColor: "#3c3c3c",
  textAlign: "center" as const,
};

const footer = {
  margin: "0",
  fontSize: "12px",
  color: "#888888",
};
