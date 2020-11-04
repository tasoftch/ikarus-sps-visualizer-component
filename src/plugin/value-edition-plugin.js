import {Plugin} from "./plugin";
import {QuitEdit} from "../quit-edit";

const $ = window.jQuery;

export class ValueEditionPlugin extends Plugin {
    install(context, options) {
        if(!$)
            throw new Error("Can not install value edition plugin without jQuery installed before.");

        $("span[data-editable]").each(function() {
            this.value_editor = new QuitEdit(this, context);
        })
    }
}