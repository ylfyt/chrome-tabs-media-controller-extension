const toggleMute = (tabId) => {
	chrome.tabs.get(parseInt(tabId), async (tab) => {
		let muted = !tab.mutedInfo.muted;
		await chrome.tabs.update(parseInt(tabId), { muted });
	});
};

const prev = (tabId) => {
	const id = tabId.substring(2, tabId.length);
	chrome.tabs.executeScript(parseInt(id), {
		code: `
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'P',
        keyCode: 80,
        which: 80,
        shiftKey: true,
        ctrlKey: false,
        metaKey: false,
      })
    );
		`,
	});
};

const next = (tabId) => {
	const id = tabId.substring(2, tabId.length);
	chrome.tabs.executeScript(parseInt(id), {
		code: `
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'N',
        keyCode: 78,
        which: 78,
        shiftKey: true,
        ctrlKey: false,
        metaKey: false,
      })
    );
		`,
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
};

const getHtml = (tab) => {
	const txt = `
	<div class="tab-item">
		<div class="tab-title">${tab.title}</div>
		<div class="button-container">
      <div class="youtube-controller">
      </div>
			<button id="${tab.id}" type="button" class="mute-toggle control">&#9888;</button>
		</div>
	</div>`;
	return txt;
};

const getHtmlForYT = (tab, prev = false) => {
	const txt = `
	<div class="tab-item youtube-item">
		<div class="tab-title">${tab.title}</div>
		<div class="button-container">
      <div class="youtube-controller">
        <button id="s:${tab.id}" type="button" class="control prev ${prev ? 'visible' : 'invisible'}">&#10094;</button>
        <button id="p:${tab.id}" type="button" class="play-toggle control">&#9737;</button>
        <button id="n:${tab.id}" type="button" class="control next">&#10095;</button>
      </div>
			<button id="${tab.id}" type="button" class="mute-toggle control">&#9888;</button>
		</div>
	</div>`;
	return txt;
};

const tabsContainer = document.getElementById('tabs');

chrome.tabs.query({}, function (tabs) {
	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i];
		if (tab.url.includes('youtube.com/watch?v=')) {
			if (tab.url.includes('list=')) {
				tabsContainer.innerHTML += getHtmlForYT(tab, true);
			} else {
				tabsContainer.innerHTML += getHtmlForYT(tab);
			}
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

	const nextButtons = document.getElementsByClassName('next');
	for (let i = 0; i < nextButtons.length; i++) {
		const button = nextButtons[i];
		button.addEventListener('click', () => {
			next(button.id);
		});
	}

	const prevButtons = document.getElementsByClassName('prev');
	for (let i = 0; i < prevButtons.length; i++) {
		const button = prevButtons[i];
		button.addEventListener('click', () => {
			prev(button.id);
		});
	}
});
