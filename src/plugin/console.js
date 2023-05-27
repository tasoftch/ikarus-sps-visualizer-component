/*
 * Copyright (c) 2019 TASoft Applications, Th. Abplanalp <info@tasoft.ch>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {Plugin} from "./plugin";

let _defaultTemplate = "<span class=\"date\" data-format='dd.mm.yy G:i:s'></span>\n" +
    "            <span class=\"brick\"></span>\n" +
    "            <span class=\"code\"></span>\n" +
    "            <span class=\"text\"></span>\n" +
    "            <button>Quit</button>\n";

const $ = window.jQuery;

export class ConsolePlugin extends Plugin {
    constructor(container, template) {
        super('console');
        this.container = container;
        this.template = template ? template : _defaultTemplate;
        this.alertViewMap = new Map();
    }

    install(visualizer) {
        visualizer.on("createalert", a=>this.createAlert(a));
        visualizer.on("removealert", a=>this.removeAlert(a));
    }

    createAlert(alert) {
        let $html = $(typeof this.template === 'function' ? this.template.call(this, alert) : this.template);
        const div = document.createElement("div");
        $(div).html($html);

        let date;

        $(div).find(".date").each(function() {
            if(!date) {
                let ms;
                if((ms = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/i.exec(alert.date))) {
                    date = new Date(ms[1], ms[2]-1, ms[3], ms[4], ms[5], ms[6]);
                } else
                    date = new Date();
            }
            $(this).html( window.Skyline.Date.format($(this).attr("data-format") || "dd.mm.yyyy", date) );
        });

        $(div).find(".brick").html(alert.brick);
        $(div).find(".code").html(alert.code);
        $(div).find(".text").html(alert.message);

        const $self = this;
        $(div).find("button").on("click", function() {
            $self.visualizer.quitAlert( alert.uid )
        });


        div.className = "report";
        console.log(alert.level);

        if(alert.level === 1)
            div.classList.add('alert-secondary');
        else if(alert.level === 2)
            div.classList.add('alert-warning');
        else
            div.classList.add('alert-danger');
        div.id = 'alert-'+alert.uid;
        this.alertViewMap.set( alert.uid, div );
        this.container.appendChild(div);
    }

    removeAlert(alert) {
        console.log("REMOVE "+alert.uid);

        const view = this.alertViewMap.get(alert.uid);
        if(view)
            this.container.removeChild(view);
        this.alertViewMap.delete(alert.uid);
    }
}