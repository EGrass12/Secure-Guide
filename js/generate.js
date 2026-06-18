const urlParams = new URLSearchParams(window.location.search);
let stepParam = Number(urlParams.get('step')) - 1 || 0;
let currentPage = Math.max(0, stepParam);

const list = document.getElementById("list");
const stepDisplay = document.getElementById("stepDisplay");
const prevEl = document.getElementById("prevEl");
const nextEl = document.getElementById("nextEl");

window.nextPage = () => {
    if (currentPage < steps.length - 1) loadPage(++currentPage);
}

window.prevPage = () => {
    if (currentPage > 0) loadPage(--currentPage);
}

function loadPage(page) {
    if (!Array.isArray(steps) || steps.length === 0) return;

    const maxPage = Math.min(steps.length - 1, Math.max(0, page));
    if (page !== maxPage) {
        const url = new URL(window.location);
        url.searchParams.set("step", maxPage + 1);
        window.location.href = url.toString();
        return;
    }

    steps[page].points.forEach((point, i) => {
        var liEl = document.createElement('li');
        var hasMdLink = /^(?=.*\[)(?=.*\])(?=.*\()(?=.*\)).*$/.test(point);

        if (hasMdLink) {
            var textAreaTag = document.createElement("textarea");
            textAreaTag.textContent = point;
            point = textAreaTag.innerHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

            var elements = point.match(/\[.*?\)/g);
            if (elements && elements.length > 0) {
                for (const el of elements) {
                    let text = el.match(/\[(.*?)\]/)[1];
                    let url = el.match(/\((.*?)\)/)[1];
                    let aTag = document.createElement("a");
                    
                    let isExternal = false;
                    let targetUrl = "#";
                    
                    if (url.startsWith("http://") || url.startsWith("https://")) {
                        try {
                            let parsedUrl = new URL(url);
                            if (parsedUrl.hostname === "egrass12.github.io") {
                                let pathname = parsedUrl.pathname;
                                let filename = pathname.substring(pathname.lastIndexOf('/') + 1);
                                if (!filename) {
                                    targetUrl = "./index.html";
                                } else if (!filename.endsWith(".html")) {
                                    targetUrl = "./" + filename + ".html";
                                } else {
                                    targetUrl = "./" + filename;
                                }
                            } else {
                                isExternal = true;
                            }
                        } catch (e) {
                            isExternal = true;
                        }
                    } else {
                        if (url.startsWith("./") || url.startsWith("../") || !url.includes(":")) {
                            let cleanUrl = url;
                            if (cleanUrl.startsWith("./")) {
                                cleanUrl = cleanUrl.substring(2);
                            }
                            if (cleanUrl.startsWith("/")) {
                                cleanUrl = cleanUrl.substring(1);
                            }
                            if (cleanUrl && !cleanUrl.endsWith(".html") && !cleanUrl.includes(".") && !cleanUrl.includes("#")) {
                                targetUrl = "./" + cleanUrl + ".html";
                            } else {
                                targetUrl = url;
                            }
                        } else {
                            isExternal = true;
                        }
                    }
                    
                    if (isExternal) {
                        aTag.href = "javascript:void(0)";
                        aTag.style.cursor = "default";
                        aTag.style.textDecoration = "none";
                        aTag.style.color = "inherit";
                    } else {
                        aTag.href = targetUrl;
                        aTag.target = '_blank';
                    }
                    aTag.textContent = text;
                    point = point.replace(el, aTag.outerHTML);
                }
            }
        }

        if (list.children[i]) {
            list.children[i].style.animation = 'fadeInAndOut .35s';
            setTimeout(() => {
                list.children[i].innerHTML = point;
                setTimeout(() => list.children[i].style.animation = '', 75)
            }, 175)
        } else {
            liEl.innerHTML = point;
            list.append(liEl)
        }
    });

    prevEl.toggleAttribute("disabled", currentPage === 0);
    nextEl.toggleAttribute("disabled", currentPage === steps.length - 1);

    stepDisplay.textContent = `Step ${currentPage + 1} of ${steps.length}`;
    history.pushState('', '', currentPage === 0 ? location.pathname : `?step=${currentPage + 1}`);
}

loadPage(currentPage);