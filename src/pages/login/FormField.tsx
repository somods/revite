import { UseFormMethods } from "react-hook-form";

import { Text, Localizer } from "preact-i18n";

import { Category, InputBox } from "@revoltchat/ui";

import { I18nError } from "../../context/Locale";

type FieldType =
    | "email"
    | "username"
    | "password"
    | "invite"
    | "current_password"
    | "sms_captcha"
    | "phone_number";

type Props = Omit<JSX.HTMLAttributes<HTMLInputElement>, "children" | "as"> & {
    type: FieldType;
    showOverline?: boolean;
    register: UseFormMethods["register"];
    error?: string;
    name?: string;
};

export default function FormField({
    type,
    register,
    showOverline,
    error,
    name,
    ...props
}: Props) {
    return (
        <>
            {showOverline && (
                <Category compact>
                    <I18nError error={error}>
                        {type === "phone_number" ? (
                            <Text id="1" children="手机号" />
                        ) : type === "sms_captcha" ? (
                            <Text id="1" children="验证码" />
                        ) : (
                            <Text id={`login.${type}`} />
                        )}
                    </I18nError>
                </Category>
            )}
            <Localizer>
                <InputBox
                    placeholder={
                        (type === "phone_number" ? (
                            <Text id="111" children="请输入手机号" />
                        ) : type === "sms_captcha" ? (
                            <Text id="111" children="请输入验证码" />
                        ) : (
                            <Text id={`login.enter.${type}`} />
                        )) as unknown as string
                    }
                    name={
                        type === "current_password" ? "password" : name ?? type
                    }
                    type={
                        type === "invite" || type === "username"
                            ? "text"
                            : type === "current_password"
                            ? "password"
                            : type
                    }
                    // See https://github.com/mozilla/contain-facebook/issues/783
                    className="fbc-has-badge"
                    ref={register(
                        type === "password" || type === "current_password"
                            ? {
                                  validate: (value: string) =>
                                      value.length === 0
                                          ? "RequiredField"
                                          : value.length < 8
                                          ? "TooShort"
                                          : value.length > 1024
                                          ? "TooLong"
                                          : undefined,
                              }
                            : type === "email"
                            ? {
                                  required: "RequiredField",
                                  pattern: {
                                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                      message: "InvalidEmail",
                                  },
                              }
                            : type === "username"
                            ? {
                                  validate: (value: string) =>
                                      value.length === 0
                                          ? "RequiredField"
                                          : value.length < 2
                                          ? "TooShort"
                                          : value.length > 32
                                          ? "TooLong"
                                          : undefined,
                              }
                            : type === "phone_number"
                            ? {
                                  required: "RequiredField",
                                  pattern: {
                                      value: /^1[3456789]\d{9}$/,
                                      message: "InvalidPhoneNumber",
                                  },
                              }
                            : type === "sms_captcha"
                            ? {
                                  validate: (value: string) =>
                                      value.length === 0
                                          ? "RequiredField"
                                          : value.length < 4
                                          ? "InvalidVerificationCode"
                                          : value.length > 4
                                          ? "InvalidVerificationCode"
                                          : undefined,
                              }
                            : { required: "RequiredField" },
                    )}
                    {...props}
                />
            </Localizer>
        </>
    );
}
