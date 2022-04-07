const toggleMute = (tabId) => {
	chrome.tabs.get(parseInt(tabId), async (tab) => {
		let muted = !tab.mutedInfo.muted;
		await chrome.tabs.update(parseInt(tabId), { muted });

		document.getElementById(tabId).classList.toggle('inactive');
	});
};

const togglePlay = (tabId) => {
	const id = tabId.substring(2, tabId.length);
	chrome.tabs.executeScript(parseInt(id), {
		code: `
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
		`,
	});
	document.getElementById(tabId).classList.toggle('inactive');
};

const getHtml = (tab) => {
	let temp = '';
	if (tab.mutedInfo.muted) {
		temp = 'inactive';
	}

	const txt = `
	<div class="tab-item">
		<div class="tab-title">${tab.title}</div>
		
		<div class="button-container">
			<button id="${tab.id}" type="button" class="mute-toggle ${temp}">M</button>
		</div>
	</div>`;
	return txt;
};

const getHtmlForYT = (tab) => {
	let temp = '';
	if (tab.mutedInfo.muted) {
		temp = 'inactive';
	}

	const txt = `
	<div class="tab-item youtube-item">
		<div class="tab-title">${tab.title}</div>
		<div class="button-container">
			<button id="p:${tab.id}" type="button" class="play-toggle ${temp}">P</button>
			<button id="${tab.id}" type="button" class="mute-toggle ${temp}">M</button>
		</div>
	</div>`;
	return txt;
};

var tabsContainer = document.getElementById('tabs');

chrome.tabs.query({}, function (tabs) {
	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i];
		if (tab.url.includes('youtube.com/watch?v=')) {
			tabsContainer.innerHTML += getHtmlForYT(tab);
		} else {
			tabsContainer.innerHTML += getHtml(tab);
		}
	}

	const buttons = document.getElementsByClassName('mute-toggle');
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		button.addEventListener('click', () => {
			toggleMute(button.id);
		});
	}

	const buttonsPlay = document.getElementsByClassName('play-toggle');
	for (let i = 0; i < buttonsPlay.length; i++) {
		const button = buttonsPlay[i];
		button.addEventListener('click', () => {
			togglePlay(button.id);
		});
	}
});
