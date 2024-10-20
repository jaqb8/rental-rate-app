import { render } from "@react-email/render";
import { env } from "@/env";
import { createTransport, type TransportOptions } from "nodemailer";
import type { ComponentProps } from "react";
import { EmailVerificationTemplate } from "./templates/email-verification";
import { emailQueue } from "@/redis/email-worker";

export enum EmailTemplate {
  EmailVerification = "EmailVerification",
}

export type PropsMap = {
  [EmailTemplate.EmailVerification]: ComponentProps<
    typeof EmailVerificationTemplate
  >;
};

export const getEmailTemplate = async <T extends EmailTemplate>(
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  switch (template) {
    case EmailTemplate.EmailVerification:
      return {
        subject: "Verify your email address",
        body: await render(
          <EmailVerificationTemplate
            {...(props as PropsMap[EmailTemplate.EmailVerification])}
          />,
        ),
      };
    default:
      throw new Error("Invalid email template");
  }
};

const smtpConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
};

export const transporter = createTransport(smtpConfig as TransportOptions);

export const sendMail = async <T extends EmailTemplate>({
  to,
  template,
  props,
}: {
  to: string;
  template: T;
  props: PropsMap[NoInfer<T>];
}) => {
  const { subject, body } = await getEmailTemplate(template, props);
  await emailQueue.add("sendMail", { to, subject, body });
};
