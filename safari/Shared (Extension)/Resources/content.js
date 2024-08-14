/* eslint-disable */

// Configuration object
const config = {
	hideImageThreads: true,
	// Add more feature flags here as needed
};

// Create a button to toggle the extension
function createToggleButton() {
	const button = document.createElement("button");
	button.textContent = "Toggle Hide Image Threads";
	button.style.position = "fixed";
	button.style.top = "10px";
	button.style.right = "10px";
	button.style.zIndex = "9999";
	button.addEventListener("click", toggleHideImageThreads);
	document.body.appendChild(button);
}

// Toggle the hideImageThreads feature
function toggleHideImageThreads() {
	config.hideImageThreads = !config.hideImageThreads;
	updateThreadVisibility();
}

// Update visibility of all processed threads
function updateThreadVisibility() {
	processedNodes.forEach((node) => {
		if (node.hasMedia) {
			node.style.display = config.hideImageThreads ? "none" : "";
		}
	});
}

const processedNodes = new Set();

const observer = new MutationObserver((mutationsList) => {
	for (let mutation of mutationsList) {
		if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE && !processedNodes.has(node)) {
					console.log("New node detected:", node);
					processPotentialThreadContainer(node);
				}
			});
		}
	}
});

observer.observe(document.body, { childList: true, subtree: true });

function processPotentialThreadContainer(node) {
	const xpath = '//*[@id="barcelona-page-layout"]/div/div/div[2]/div[1]/div[3]/div/div[1]';
	const threadContainers = getElementsByXPath(xpath, node);

	threadContainers.forEach((threadContainer) => {
		threadContainer.childNodes.forEach((childNode) => {
			if (childNode.nodeType === Node.ELEMENT_NODE && !processedNodes.has(childNode)) {
				console.log("Processing child node of thread container:", childNode);
				processThread(childNode);
			}
		});
	});
}

function getElementsByXPath(xpath, contextNode = document) {
	const result = [];
	const nodesSnapshot = document.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
		result.push(nodesSnapshot.snapshotItem(i));
	}
	return result;
}

function processThread(node) {
	processedNodes.add(node);

	const hasNonProfileImage = Array.from(node.querySelectorAll('img')).some(img => {
		const altText = img.getAttribute('alt') || '';
		return !altText.toLowerCase().includes('profile picture');
	});

	node.hasMedia = hasNonProfileImage;  // Store this information on the node

	if (hasNonProfileImage) {
		console.log('Non-profile image detected in thread:', node);
		if (config.hideImageThreads) {
			node.style.display = 'none';
		}
	} else {
		console.log('Text-only or profile-picture-only thread detected:', node);
	}
}


// Initial setup
createToggleButton();
processPotentialThreadContainer(document);
