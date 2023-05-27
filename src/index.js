/*
 * Copyright (c) 2020 TASoft Applications, Th. Abplanalp <info@tasoft.ch>
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

import {Visualizer} from './visualizer'
import {QuitEdit} from "./quit-edit";
import {APICommunication, Communication, CommunicationInstance, WebSocketCommunication} from "./communication";
import {BrickStatusHandlerPlugin} from "./plugin/brick-status-handler-plugin";
import {BrickMasterStatusPlugin} from "./plugin/brick-master-status-plugin";
import {Plugin} from "./plugin/plugin";
import {ValueEditionPlugin} from "./plugin/value-edition-plugin";
import {BrickPanelPlugin} from "./plugin/BrickPanelPlugin";
import {ConsolePlugin} from "./plugin/console";

(($, IK)=>{
    if(!IK)
        IK = window.Ikarus = {};
    Object.assign(IK, {
        Visualizer,
        QuitEdit,
        Communication,
        APICommunication,
        WebSocketCommunication,
        CommunicationInstance,
        Plugin,
        BrickStatusHandlerPlugin,
        BrickMasterStatusPlugin,
        BrickPanelPlugin,
        ValueEditionPlugin,
        ConsolePlugin
    })

    $.fn.quikEdit = function(visualizer) {
        this.each(function() {
            this.quickEdit = new Ikarus.QuitEdit(this, visualizer);
        });
    }
})(window.jQuery, window.Ikarus);