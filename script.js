const toggleMute = (tabId) => {
	chrome.tabs.get(parseInt(tabId), async (tab) => {
		let muted = !tab.mutedInfo.muted;
		await chrome.tabs.update(parseInt(tabId), { muted });

		document.getElementById(tabId).classList.toggle('inactive');
	});
};

const getHtml = (tab) => {
	let temp = '';
	if (tab.mutedInfo.muted) {
		temp = 'inactive';
	}

	const txt = `<div class="tab-item"><div class="tab-title">${tab.title}</div>
	<button id="${tab.id}" type="button" class="mute-toggle ${temp}">M</button>
	</div>`;
	return txt;
};

var tabsContainer = document.getElementById('tabs');

chrome.tabs.query({}, function (tabs) {
	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i];
		tabsContainer.innerHTML += getHtml(tab);
	}

	const buttons = document.getElementsByClassName('mute-toggle');
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		button.addEventListener('click', () => {
			toggleMute(button.id);
		});
	}
});
