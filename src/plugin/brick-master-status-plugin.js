
import {BrickStatusHandlerPlugin} from "./brick-status-handler-plugin";
import {Visualizer} from "../visualizer";

export class BrickMasterStatusPlugin extends BrickStatusHandlerPlugin {

    statusHandler(anID, status, element) {
        const fn = (el) => {
            super.statusHandler(anID, status & ~Visualizer.STATUS_HAND_ON & ~Visualizer.STATUS_HAND_OFF, el);
        }
        $(element).parent().find(".brick[data-master='"+anID+"']").each(function() {
            fn(this);
        });
    }

}