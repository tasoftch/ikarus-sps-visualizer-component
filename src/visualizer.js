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

import {Context} from "./core/context";
import {VisualEvents} from "./events";
import {Alert} from "./alert";


const $ = window.jQuery;

let _visualizer;
const _formatters = {
    'null': ()=>{return '-.-'},
    'time_s': (s)=>{ return s + "s"; },
    "time_min": (v)=> { return window.Skyline.String.format("%d:%02d", Math.floor(v/60), v%60); },
    "time_h": (v)=> { v=Math.floor(v/60); return window.Skyline.String.format("%d:%02d", Math.floor(v/60), v%60); }
};

export class Visualizer extends Context {
    static get CONTROL_MANUAL_ON() { return 'on'; }
    static get CONTROL_MANUAL_OFF() { return 'on'; }
    static get CONTROL_MANUAL_AUTO() { return 'on'; }

    static get STATUS_OFF() { return 1; }
    static get STATUS_ON() { return 2; }
    static get STATUS_ERROR() { return 4; }
    static get STATUS_HAND() { return 8; }


    static get mainVisualizer() { return _visualizer; }

    static get formatters() { return _formatters; }

    use(plugin, params) {
        super.use(plugin, params);
        plugin.visualizer = this;
    }

    constructor(communication, updateInterval, id, schedule) {
        super(id, new VisualEvents());
        this.interval = updateInterval;
        _visualizer = this;
        this.alertMap = new Map();
        this.communication = communication;

        if(schedule)
            this.updateFromCommunication(true);
    }

    updateFromCommunication(reschedule) {
        if(!this.communication)
            throw new Error("Ikarus visualizer requires a communication instance.");

        let fd = new FormData();
        this.communication.post('fetch', fd)
            .success((data) => {
                this.updateFromJSON(data.response);
                if(reschedule)
                    window.setTimeout(()=>this.updateFromCommunication(true), this.interval);
            })
            .error((err) => {
                this.trigger('error', err)
            })
    }

    updateFromJSON(response) {
        if (!this.trigger('beforeupdate', response)) return;

        if(!$)
            throw new Error("Ikarus visualizer requires jQuery component.");

        if(response.alerts && response.alerts.length > 0) {
            const alertIDs = [];

            for(const idx in response.alerts) {
                const a = response.alerts[idx];
                if(a.uid) {
                    alertIDs.push(a.uid);

                    if(!this.alertMap.has(a.uid)) {
                        const al = new Alert(a);
                        this.alertMap.set(a.uid, al);
                        this.trigger('createalert', al);
                    }
                }
            }

            this.alertMap.forEach(a=>{
                const i = alertIDs.indexOf(a.uid);
                if(i === -1) {
                    this.trigger('removealert', a);
                    this.alertMap.delete(a.uid);
                }
            });
        } else {
            this.alertMap.forEach(a=>{
                this.trigger('removealert', a);
                this.alertMap.delete(a.uid);
            });
        }

        for(const anID in response) {
            if(response.hasOwnProperty(anID)) {
                const $obj = $("#"+anID);
                if($obj.length < 1 || $obj.hasClass("editing")) {
                    continue;
                }

                let info = response[anID];
                if(info !== undefined) {
                    if(typeof info === "string" || typeof info === "number") {
                        info = this.formatValue(info, $obj.attr("data-formatter"), $obj[0]);
                        $obj.html(info);
                        continue;
                    }

                    if(typeof info.status === 'number') {
                        this.trigger('updatestatus', {anID, status: info.status, el: $obj[0]});
                        delete info.status;
                    }


                    for(const ikey in info) {
                        const $el = $obj.find("[data-ikey='"+ikey+"']");
                        if($el.length > 0 && !$el.hasClass("editing")) {
                            $el.html(
                                this.formatValue(info[ikey], $el.attr("data-formatter"), $el[0])
                            );
                        }
                    }
                }
            }
        }

        this.trigger('afterupdate');
    }

    formatValue(value, formatter, element) {
        if(undefined !== formatter && formatter.length) {
            if(formatter.charAt(0) === '@') {
                formatter = formatter.substr(1);
                formatter = _formatters[ formatter ];
                if(typeof formatter === 'function')
                    return formatter(value, element);
                return value;
            }

            let m = $(element).attr("data-multiplyer") * 1;
            if(m > 1)
                value *= m;

            return window.Skyline.String.format(formatter, value);
        }

        return value;
    }

    sendControl(control, brick_id) {
        if (!this.trigger('sendcontrol', control, brick_id)) return;

        var fd = new FormData();

        fd.append("type", control);
        fd.append('key', brick_id);

        this.communication.post('ctl', fd)
            .success((data)=> {
                this.trigger('sentcontrol', data);
            })
            .error((data) => {
                this.trigger('error', data);
            });
    }

    sendCommand(command, args) {
        if (!this.trigger('sendcommand', command, args)) return;

        var fd = new FormData();

        fd.append("cmd", command);
        fd.append('info', JSON.stringify( args ? args : []));

        this.communication.post('putc', fd)
            .success((data)=> {
                this.trigger('sentcommand', data);
            })
            .error((data) => {
                this.trigger('error', data);
            });
    }

    sendValue(value, id, success, failed) {
        if (!this.trigger('sendvalue', value, id)) return;
        var fd = new FormData();

        fd.append("value", value);
        fd.append('key', id);

        this.communication.post('putv', fd)
            .success((data)=> {
                this.trigger('sentvalue', data);
                if(success)
                    success(data.value);
            })
            .error((data) => {
                this.trigger('error', data);
                if(failed)
                    failed(data);
            });
    }

    callProcedure(name, args) {
        if (!this.trigger('callprocedure', name, args)) return;
        var fd = new FormData();
        fd.append("name", name);
        if(args)
            fd.append('arguments', JSON.stringify( args ));

        this.communication.post('cproc', fd)
            .success((data)=> {
                this.trigger('procedurecalled', data);
            })
            .error((data) => {
                this.trigger('error', data);
            });
    }

    quitAlert(id) {
        var fd = new FormData();
        fd.append('key', id);

        this.communication.post('quit', fd)
            .success((data)=> {
                this.trigger('quitalert', data);
                const al = this.alertMap.get(id instanceof Alert ? id.uid : id);
                if(typeof al.quitCallback === 'function')
                    al.quitCallback.call(al, data);
            })
            .error((data) => {
                this.trigger('error', data);
            });
    }
}