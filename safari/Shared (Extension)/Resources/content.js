browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);

	
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

});

const observer = new MutationObserver((mutationsList, observer) => {
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			mutation.addedNodes.forEach(node => {
				// Check if the added node itself is the SVG we're interested in
				if (node.tagName === 'svg' && node.ariaLabel === 'View activity' && !node.hasAttribute('data-processed')) {
					updateSVG(node);
				}

				// If the added node is an element, check its descendants
				if (node.nodeType === Node.ELEMENT_NODE) {
					const svgElements = node.querySelectorAll('svg[aria-label="View activity"]:not([data-processed])');
					svgElements.forEach(svg => updateSVG(svg));
				}
			});
		}
	}
});

observer.observe(document.body, { childList: true, subtree: true });

function updateSVG(svg) {
	console.log('Found SVG: ', svg);

	// Mark this SVG as processed to avoid reprocessing
	svg.setAttribute('data-processed', 'true');

	// Update the SVG or its ancestors as needed
	svg.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML += "<div style=\"display: flex; height: 20px; width: 100%; background: red;\"></div>";
}
