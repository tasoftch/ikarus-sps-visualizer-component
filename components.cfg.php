<?php

use Skyline\Component\Config\AbstractComponent;
use Skyline\Component\Config\CSSComponent;
use Skyline\Component\Config\JavaScriptComponent;

return [
	"Visualizer" => [
		'js' => new JavaScriptComponent(
			...AbstractComponent::makeLocalFileComponentArguments(
				"/Public/js/ikarus-visualizer.min.js",
				__DIR__ . "/dist/ikarus-visualizer.min.js"
			)
		),
		'css' => new CSSComponent(
			...AbstractComponent::makeLocalFileComponentArguments(
				"/Public/css/ikarus-visualizer.min.css",
				__DIR__ . "/dist/ikarus-visualizer.min.css"
			)
		)
	]
];