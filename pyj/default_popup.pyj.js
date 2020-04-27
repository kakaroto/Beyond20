from elementmaker import E;
from settings import options_list, createHTMLOptionEx;
from utils import isFVTT, injectPageScript;

function createOptionList() {
    $("main").prepend(E.ul(class_="list-group beyond20-options", createHTMLOptionEx("donate", options_list["donate"], true)));
    $(".beyond20-options").push(E.li(class_="list-group-item beyond20-option",
                                       E.a(id="openOptions", class_="list-content", href='//',
                                           E.h4("Beyond20 Options");
                                           );
                                       }
                                       );
                                  }
                                  }
                                  );
    }
    }
    }
    }
    }
    }
    }
    }
    img = $("//donate").find("img");
    img.attr({
        "src": img.attr("src").replace("donate.png", "donate32.png"),
        "width": 32,
        "height": 32;
    });
    $("//openOptions").bind('click', (ev) => {
        chrome.runtime.openOptionsPage();
    }
    );

}
function setupHTML() {
    createOptionList();
    $(document).on('click', 'a', (ev) => {
        href = this.getAttribute('href');
        if (len(href) > 0 && href != "//") {
            window.open(this.href);
        }
        return false;
    }
    );

}
function actOnCurrentTab(tab) {
    if (isFVTT(tab.title)) {
        // If FVTT, then inject the actual popup, instead of the default one.;
        chrome.runtime.sendMessage({"action": "activate-icon", "tab": tab});
        injectPageScript("src/popup.js");
    } else {
        setupHTML();

}
}
if (chrome.tabs != undefined) {
    chrome.tabs.query({"active": true, "currentWindow": true}, (tabs) => actOnCurrentTab(tabs[0]));
} else {
    chrome.runtime.sendMessage({"action": "get-current-tab"}, actOnCurrentTab);
