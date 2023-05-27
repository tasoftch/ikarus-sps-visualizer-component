import {Plugin} from "./plugin";
import {Visualizer} from "../visualizer";

const $ = window.jQuery;

export class BrickStatusHandlerPlugin extends Plugin {
    install(context, options) {
        context.on("updatestatus", ({anID, status, el})=>this.statusHandler(anID, status, el))
    }

    statusHandler(anID, status, element) {
        const $element = $(element);

        $element
            .removeClass("status-on")
            .removeClass('status-off')
            .removeClass('status-hand')
            .removeClass('status-res-1')
            .removeClass('status-res-2')
            .removeClass('status-panel')
            .removeClass("status-err");
        if(status & Visualizer.STATUS_OFF)
            $element.addClass('status-off');
        if(status & Visualizer.STATUS_ON)
            $element.addClass('status-on');
        if(status & Visualizer.STATUS_ERROR)
            $element.addClass('status-err');
        if(status & Visualizer.STATUS_HAND_OFF)
            $element.addClass('status-hand').addClass("status-off").removeClass("status-on");
        if(status & Visualizer.STATUS_HAND_ON)
            $element.addClass('status-hand').addClass("status-on").removeClass('status-off');
        if(status & Visualizer.STATUS_PANEL)
            $element.addClass('status-panel');
        if(status & Visualizer.STATUS_RESERVED_1)
            $element.addClass('status-res-1');
        if(status & Visualizer.STATUS_RESERVED_2)
            $element.addClass('status-res-2');
    }

    get name() {
        return "status-handler";
    }
}