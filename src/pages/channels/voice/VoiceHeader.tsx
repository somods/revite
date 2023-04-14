import {
    BarChartAlt2,
    Microphone,
    MicrophoneOff,
    PhoneOff,
    VolumeFull,
    VolumeMute,
} from "@styled-icons/boxicons-solid";
import { observer } from "mobx-react-lite";
import styled from "styled-components/macro";

import { Text } from "preact-i18n";
import { useMemo, useEffect } from "preact/hooks";

import { Button } from "@revoltchat/ui";

import { voiceState, VoiceStatus } from "../../../lib/vortex/VoiceState";

import Tooltip from "../../../components/common/Tooltip";
import UserIcon from "../../../components/common/user/UserIcon";
import { useClient } from "../../../controllers/client/ClientController";
import { modalController } from "../../../controllers/modals/ModalController";

interface Props {
    id: string;
}

const VoiceBase = styled.div`
    margin-top: 48px;
    padding: 20px;
    background: var(--secondary-background);

    .status {
        flex: 1 0;
        display: flex;
        position: absolute;
        align-items: center;

        padding: 10px;
        font-size: 13px;
        font-weight: 500;
        user-select: none;
        gap: 6px;

        color: var(--success);
        border-radius: var(--border-radius);
        background: var(--primary-background);

        svg {
            cursor: help;
        }
    }

    display: flex;
    flex-direction: column;

    overflow-y: scroll;

    .participants {
        margin: 40px 20px;
        justify-content: center;
        user-select: none;
        display: flex;
        flex-flow: row wrap;
        gap: 16px;

        div:hover img {
            opacity: 0.8;
        }

        .disconnected {
            opacity: 0.5;
        }
    }

    .actions {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    .shortcutkey {
        font-size: 12px;
        text-align: center;
        margin-top: 14px;
        color: #b6b6b6;
    }
`;

export default observer(({ id }: Props) => {
    if (voiceState.roomId !== id) return null;

    const client = useClient();
    const self = client.users.get(client.user!._id);

    const keys = Array.from(voiceState.participants.keys());
    const users = useMemo(() => {
        return keys.map((key) => client.users.get(key));
        // eslint-disable-next-line
    }, [keys]);
    // Enable or disable voice shortcut keys
    useEffect(() => {
        const onKeyDown = async (event: KeyboardEvent) => {
            if (
                event.ctrlKey &&
                event.keyCode === 192 &&
                voiceState.status === VoiceStatus.CONNECTED
            ) {
                if (voiceState.isProducing("audio")) {
                    voiceState.stopProducing("audio");
                } else {
                    voiceState.startProducing("audio");
                }
            }
        };
        window.addEventListener("keydown", onKeyDown); // 添加全局事件
        return () => {
            window.removeEventListener("keydown", onKeyDown); // 销毁
        };
    });

    return (
        <VoiceBase>
            <div className="participants">
                {users && users.length !== 0
                    ? users.map((user, index) => {
                          const user_id = keys![index];
                          return (
                              <div key={user_id}>
                                  <UserIcon
                                      size={80}
                                      target={user}
                                      status={false}
                                      voice={
                                          client.user?._id === user_id &&
                                          voiceState.isDeaf()
                                              ? "deaf"
                                              : voiceState.participants!.get(
                                                    user_id,
                                                )?.audio
                                              ? undefined
                                              : "muted"
                                      }
                                      onClick={() =>
                                          modalController.push({
                                              type: "user_profile",
                                              user_id,
                                          })
                                      }
                                  />
                              </div>
                          );
                      })
                    : self !== undefined && (
                          <div key={self._id} className="disconnected">
                              <UserIcon
                                  size={80}
                                  target={self}
                                  status={false}
                              />
                          </div>
                      )}
            </div>
            <div className="status">
                <BarChartAlt2 size={16} />
                {voiceState.status === VoiceStatus.CONNECTED && (
                    <Text id="app.main.channel.voice.connected" />
                )}
            </div>
            <div className="actions">
                <Tooltip content={"断开"} placement={"top"}>
                    <Button palette="error" onClick={voiceState.disconnect}>
                        <PhoneOff width={20} />
                    </Button>
                </Tooltip>
                {voiceState.isProducing("audio") ? (
                    <Tooltip content={"麦克风静音"} placement={"top"}>
                        <Button
                            onClick={() => voiceState.stopProducing("audio")}>
                            <Microphone width={20} />
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip content={"取消麦克风静音"} placement={"top"}>
                        <Button
                            onClick={() => voiceState.startProducing("audio")}>
                            <MicrophoneOff width={20} />
                        </Button>
                    </Tooltip>
                )}
                {voiceState.isDeaf() ? (
                    <Tooltip content={"开启声音"} placement={"top"}>
                        <Button onClick={() => voiceState.stopDeafen()}>
                            <VolumeMute width={20} />
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip content={"关闭声音"} placement={"top"}>
                        <Button onClick={() => voiceState.startDeafen()}>
                            <VolumeFull width={20} />
                        </Button>
                    </Tooltip>
                )}
            </div>
            <div className="shortcutkey">
                <Microphone width={13} />
                <span>
                    麦克风快捷键“ CTRL + ~ ”如遇游戏快捷键冲突 请更改游戏内设置
                </span>
            </div>
        </VoiceBase>
    );
});
