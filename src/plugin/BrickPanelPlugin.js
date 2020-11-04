import {Plugin} from "./plugin";

const $ = window.jQuery;


export class BrickPanelPlugin extends Plugin {
    install(context, options) {
        if(!$)
            throw new Error("Can not install brick panel plugin without jQuery installed before.");

        $(".brick[data-panel]").on("click", function() {
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

            $(content).find("button").attr("disabled", 'disabled');

            if($(this).hasClass("status-on") || $(this).hasClass("status-off")) {
                $(content).find("button").attr("disabled", false);
            }

            $(this).popover({
                title : $(this).attr('title'),
                content : content,
                html:true
            }).popover("show").on("hidden.bs.popover", function() {
                $(this).popover('dispose');
            });
        });
    }
}
