import {Plugin} from "./plugin";

const $ = window.jQuery;

const _defOptions = {
    pw_prompt: "Please enter the password to confirm the action:",
    pw_denied: "Action not sent: Password is wrong"
};


export class BrickPanelPlugin extends Plugin {
    install(context, options) {
        options = $.extend({}, _defOptions, options||{});

        if(!$)
            throw new Error("Can not install brick panel plugin without jQuery installed before.");

        const panel_service = this;

        $(".brick[data-panel]").on("click", function() {
            if(typeof panel_service.current_panel !== "undefined") {
                panel_service.current_panel.popover("hide");
                panel_service.current_panel = undefined;
            }

            let content = $( "#" + $(this).attr("data-panel")).html();
            content = content.replace(/&amp;id;/ig, $(this).attr("id"));
            content = content.replace(/&amp;info;/ig, $(this).attr("data-info"));
            content = content.replace(/&amp;domain;/ig, $(this).attr("data-domain"));
            content = content + ' <button type="button" onclick="$(this).parent().parent().popover(\'hide\')" class="close" style="position: absolute; top: 0.25rem; right: 0.25rem" aria-label="Close">\n' +
                '  <span aria-hidden="true">&times;</span>\n' +
                '</button>';

            const brick_id = this.id;
            content = $(content);
            content.find("button[data-control]").on("click", function () {
                context.sendControl($(this).attr("data-control"), brick_id);
            });

            const read_args = (args) => {
                if(!args || args.length === 0) {
                    args = "{}";
                }
                const OBJ = JSON.parse( args );
                OBJ.brick = brick_id;
                return JSON.stringify( OBJ );
            };

            content.find("button[data-command]").on('click', function() {
                let args = read_args( $(this).attr("data-arguments") );
                context.sendCommand($(this).attr("data-command"), args);
            });

            content.find("button[data-procedure]").on('click', function() {
                let args = read_args( $(this).attr("data-arguments") );
                context.callProcedure($(this).attr("data-procedure"), args);
            });

            $(content).find("button").attr("disabled", 'disabled');

            if($(this).hasClass("status-on") || $(this).hasClass("status-off")) {
                $(content).find("button").attr("disabled", false);
            }

            panel_service.current_panel = $(this).popover({
                title : $(this).attr('title'),
                content : content,
                html:true
            }).popover("show").on("hidden.bs.popover", function() {
                $(this).popover('dispose');
                context.closePanel( brick_id );
            });

            context.openPanel( brick_id );
        });
    }
}
