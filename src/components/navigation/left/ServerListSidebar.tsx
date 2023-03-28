//
import { Compass } from "@styled-icons/boxicons-solid";
import Tippy, { TippyProps } from "@tippyjs/react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";

import { useCallback } from "preact/hooks";

import { ServerList } from "@revoltchat/ui";

import { useApplicationState } from "../../../mobx/State";

import { useClient } from "../../../controllers/client/ClientController";
import { modalController } from "../../../controllers/modals/ModalController";
import { IS_REVOLT } from "../../../version";

/**
 * Server list sidebar shim component
 */
export default observer(() => {
    const client = useClient();
    const state = useApplicationState();
    const { server: server_id } = useParams<{ server?: string }>();

    const createServer = useCallback(
        () =>
            modalController.push({
                type: "create_server",
            }),
        [],
    );

    return (
        <>
            <ServerList
                client={client}
                active={server_id}
                createServer={createServer}
                permit={state.notifications}
                home={state.layout.getLastHomePath}
                servers={state.ordering.orderedServers}
                reorder={state.ordering.reorderServer}
                showDiscovery={false}
            />
            <Link
                to="/discover"
                style={{
                    position: "absolute",
                    top: "183px",
                    left: "12px",
                }}>
                <Tippy
                    animation="shift-away"
                    placement="right"
                    content="Discover">
                    <div>
                        <Compass size={32} />
                    </div>
                </Tippy>
            </Link>
        </>
    );
});
