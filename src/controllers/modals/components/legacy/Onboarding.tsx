import { SubmitHandler, useForm } from "react-hook-form";

import styles from "./Onboarding.module.scss";
import { Text } from "preact-i18n";
import { useState } from "preact/hooks";

import { Button, Preloader } from "@revoltchat/ui";

// import wideSVG from "/assets/wide.svg";
import background from "./assets/onboarding_background.svg";

import FormField from "../../../../pages/login/FormField";
import { takeError } from "../../../client/jsx/error";
import { ModalProps } from "../../types";

interface FormInputs {
    username: string;
}

export function OnboardingModal({
    callback,
    ...props
}: ModalProps<"onboarding">) {
    const { handleSubmit, register } = useForm<FormInputs>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<FormInputs> = ({ username }) => {
        setLoading(true);
        callback(username, true)
            .then(() => props.onClose())
            .catch((err: unknown) => {
                setError(takeError(err));
                setLoading(false);
            });
    };

    return (
        <div className={styles.onboarding}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>{"【MOD摩兜】欢迎各位小主！！！"}</h1>
                </div>
                <div className={styles.form}>
                    {loading ? (
                        <Preloader type="spinner" />
                    ) : (
                        <>
                            <p>
                                {/* 欢迎页面修改 */}
                                {
                                    "欢迎使用【MOD摩兜】，这是一款免费、简洁、实用、开放的游戏语音组队交友平台，我们是一支热爱游戏的团队，会持续深耕优化摩兜，利用更多样的功能，更完善的服务，更便捷的方式，为您带来更纯粹更好用的摩兜，当前版本还拥有很多不便，那我们会持续更迭和改进，如有部分不足，影响了您的体验，我们深感歉意，下面请开始注册您的名字吧，在当前版本下暂时还不能改昵称哦，请慎重！"
                                }
                                {/* {"It's time to choose a username."}
                                <br />
                                {
                                    "Others will be able to find, recognise and mention you with this name, so choose wisely."
                                }
                                <br />
                                {
                                    "You can change it at any time in your User Settings."
                                } */}
                            </p>
                            <form
                                onSubmit={
                                    handleSubmit(
                                        onSubmit,
                                    ) as unknown as JSX.GenericEventHandler<HTMLFormElement>
                                }>
                                <div>
                                    <FormField
                                        type="username"
                                        register={register}
                                        showOverline
                                        error={error}
                                    />
                                </div>
                                <Button palette="accent">{"确定"}</Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <img src={background} />
        </div>
    );
}
