# Ikarus SPS Visualizer
The visualizer package ships with a css and a js library to let you design a virtual visualisation of what happens in your SPS in real time.

This package is delivered to straightly include in a Skyline CMS Application.

### Installation
```bin
$ composer require ikarus/visualizer-component
```

### Usage
You can define a Skyline Template like:  
```my-template.view.phtml```
`````html
<?php
/**
 * @title My Template
 * @require jQuery
 * @require API
 * @require Visualizer
 */
?>
<div class="content">
    <div class="ikarus console w-60 h-3" id="ikarus-console"></div>
    <div class="ikarus canvas w-60 h-45" id="ikarus-canvas">...</div>
    <script type="application/javascript">
        const VISUALIZER = new Ikarus.Visualizer(new Ikarus.APICommunication('/api/v1/my-sps-server', 'domain1 domain2'), 250, 'my-id');
    
        VISUALIZER.use(new Ikarus.BrickStatusHandlerPlugin());
        VISUALIZER.use(new Ikarus.BrickMasterStatusPlugin());
        VISUALIZER.use(new Ikarus.ValueEditionPlugin());
        VISUALIZER.use(new Ikarus.BrickPanelPlugin());
        VISUALIZER.use (new Ikarus.ConsolePlugin(document.getElementById('ikarus-console')));

        VISUALIZER.updateFromCommunication(true);
    </script>
</div>
`````