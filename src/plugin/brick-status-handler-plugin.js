import {Plugin} from "./plugin";
import {Visualizer} from "../visualizer";

const $ = window.jQuery;

export class BrickStatusHandlerPlugin extends Plugin {
    install(context, options) {
        context.on("updatestatus", ({anID, status, el})=>this.statusHandler(anID, status, el))
    }

    statusHandler(anID, status, element) {
        const $element = $(element);

        $element.removeClass("status-on").removeClass('status-off').removeClass('status-hand').removeClass("status-err");
        if(status & Visualizer.STATUS_OFF)
            $element.addClass('status-off');
        if(status & Visualizer.STATUS_ON)
            $element.addClass('status-on');
        if(status & Visualizer.STATUS_ERROR)
            $element.addClass('status-err');
        if(status & Visualizer.STATUS_HAND)
            $element.addClass('status-hand');
    }
}