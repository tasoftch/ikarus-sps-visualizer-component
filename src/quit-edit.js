import {Visualizer} from "./visualizer";

const _defaultReaders = {
    def: function() { return $(this).text(); },
}

const _defaultWriters = {
    def: function(newValue, success) { $(this).html(newValue); },
}

const $ = window.jQuery;
let _changeInterval = 2500;


export class QuitEdit {
    static get editableTagReaders() { return _defaultReaders; }
    static get editableTagWriters() { return _defaultWriters; }
    static get EDITOR_CHANGE_INTERVAL() {return _changeInterval;}
    static set EDITOR_CHANGE_INTERVAL(intv) { _changeInterval = intv; }

    constructor(element, visualizer) {
        this.$element = $(element);
        this.$element.addClass("value-editable active");

        this.visualizer = visualizer ? visualizer : Visualizer.mainVisualizer;

        const reset = ()=>{
            this.$element.removeClass("editing");
            let writer = QuitEdit.editableTagWriters[ this.$element[0].tagName.toLowerCase() ];
            if(!writer)
                writer = QuitEdit.editableTagWriters.def;
            writer.call(element, this.oldValue, false);
        };

        this.$element.on("dblclick touch", () => {
            this.$element.addClass("editing");

            let reader = QuitEdit.editableTagReaders[ this.$element[0].tagName.toLowerCase() ];
            if(!reader)
                reader = QuitEdit.editableTagReaders.def;
            this.oldValue = reader.call(element);

            let type = this.$element.attr("data-editable");
            type = type ? type: 'text';
            this.$element.html("<input type='"+type+"' value='"+this.oldValue+"'>");
            this.$element.find("input").focus();
        })
            .on("change", ()=>{
                this.$element.removeClass("editing");
                var text = this.$element.find("input").val();
                var key = this.$element.attr("id");

                let writer = QuitEdit.editableTagWriters[ this.$element[0].tagName.toLowerCase() ];
                if(!writer)
                    writer = QuitEdit.editableTagWriters.def;

                let error = () => {
                    this.$element.removeClass("sending").addClass("error");
                    window.setTimeout(() => { this.$element.removeClass("error"); }, QuitEdit.EDITOR_CHANGE_INTERVAL);
                    writer.call(element, this.oldValue, false);
                };

                let success = (data) => {
                    this.$element.removeClass("sending").addClass("success");
                    window.setTimeout(() => { this.$element.removeClass("success"); }, QuitEdit.EDITOR_CHANGE_INTERVAL);
                    if(data !== undefined)
                        writer.call(element, data, true);
                    else
                        writer.call(element, "", false);
                };

                if(!key) {
                    console.error("Can not put value without attribute id", this.$element[0]);
                    error();
                }
                else {
                    this.$element.addClass("sending");
                    let multi = this.$element.attr("data-emultiplyer");
                    if(multi > 1)
                        text *= multi;
                    this.visualizer.sendValue(text, key, success, error);
                }

                this.$element.blur();
            })
            .on('focusout', ()=>{
                reset();
            }).on("keyup", (e)=>{
               if((e.which||e.keyCode) === 27) {
                   reset();
               }
        })
        ;
    }
}