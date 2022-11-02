chrome.commands.onCommand.addListener((command) => {
	if (command === 'play-toggle') {
		chrome.tabs.query({}, (tabs) => {
			for (let i = 0; i < tabs.length; i++) {
				const tab = tabs[i];
				if (!tab.url.includes('youtube.com/watch?v=')) continue;
				chrome.scripting.executeScript({
					func: () => {
						document.dispatchEvent(
							new KeyboardEvent('keydown', {
								key: 'k',
								keyCode: 75,
								code: 'KeyK',
								which: 75,
								shiftKey: false,
								ctrlKey: false,
								metaKey: false,
							})
						);
					},
					target: {
						tabId: tab.id,
					},
				});
				return;
			}
		});
		return;
	}
});
