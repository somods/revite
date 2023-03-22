import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";

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

    console.log(
        111,
        import.meta.env.VITE_API_URL,
        import.meta.env.VITE_SOMODS_API_URL,
        IS_REVOLT,
    );

    const createServer = useCallback(
        () =>
            modalController.push({
                type: "create_server",
            }),
        [],
    );

    return (
        <ServerList
            client={client}
            active={server_id}
            createServer={createServer}
            permit={state.notifications}
            home={state.layout.getLastHomePath}
            servers={state.ordering.orderedServers}
            reorder={state.ordering.reorderServer}
            showDiscovery={IS_REVOLT}
        />
    );
});
