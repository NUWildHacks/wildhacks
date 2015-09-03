function addClass(e,t){var n=e.className.indexOf(t);return n>-1?e:(e.className=e.className+" "+t.trim(),e)}function removeClass(e,t){var n=e.className.indexOf(t);return 0>n?e:(e.className=e.className.replace(t.trim(),"").replace("  "," "),e)}function extend(e){function t(e){return e.addClass=function(t){return addClass(e,t)},e.removeClass=function(t){return removeClass(e,t)},e}return e.addClass&&e.removeClass?e:e instanceof NodeList?([].forEach.call(e,t),e):t(e)}function qq(e){return document.querySelectorAll(e)}function formula_sync_server(e,t){var n=new XMLHttpRequest;n.open("PUT",formula_sync_url),n.setRequestHeader("Content-Type","application/json; charset=utf-8"),n.onreadystatechange=function(){4==n.readyState&&200==n.status?(console.log("synced"),t&&t()):n.status&&200!=n.status&&console.log("sync seems to have failed")},n.send(JSON.stringify(e))}function formula_load_server(e){var t=new XMLHttpRequest;t.open("GET",formula_sync_url),t.onreadystatechange=function(){4==t.readyState&&200==t.status?(console.log("loaded from server"),e&&e(JSON.parse(t.responseText))):t.status&&200!=t.status&&console.log("server load fail")},t.send()}function formula_cache_init(){var e=location.hash.substr(1).split(":"),t=e[0],n=e[1],a={},a=store.get("formula_progress")||a;formula_load_server(function(e){a[n]&&a[n]==t||(a={},a[n]=t);for(var o in e)e[o]&&!a[o]&&(a[o]=e[o]);store.set("formula_progress",a),formula_sync_server(a)})}function formula_get_data(e){var t={},n={};return store&&(n=store.get("formula_progress")||n,t.last_cache_time=n.last_cache_time),[].forEach.call(e,function(e){var a="radio"==e.type?e.name:e.id||e.type,o=n[a];"checkbox"==e.type?t[a]=e.checked=o:"radio"==e.type?(t[a]=o,e.checked=o==e.value):o&&!e.value.trim()?(t[a]=e.value=o,e.onchange()):t[a]=e.value}),t}function formula_cache_set(e){var t=store.get("formula_progress");if("radio"==e.type)t[e.name]=e.value||e.checked;else var n="checkbox"==e.type?e.checked:e.value.trim();t[e.id||e.type]=n,store.set("formula_progress",t)}function formula_cache_data(e){if(!store)return console.warn("localStorage not supported, progress will not be saved.");var t=formula_get_data(e),n=store.get("formula_progress")||{};if(!(Date.now()-n.last_cache_time<1e3)){var a=!1;for(var o in t){var l=n[o],i=t[o];l!=i&&(a=!0,n[o]=t[o])}a&&(n.last_cache_time=Date.now(),store.set("formula_progress",n),formula_sync_server(n,function(){formula_notify&&formula_notify.notify("Changes saved.")}))}}function formula_set_validators(e){e=e||{};for(var t in e)formula_validators[t]=e[t]}function formula_validate_input(e){var t=!1,n=e.value.trim(),a=e.type,o=e.id,l=formula_validators;if(a in l)console.log("Validating "+a+"..."),console.log("With: ",l[a]),t=l[a](e,n);else{var i=a+"_"+o;i in l?(console.log("Validating type/id "+i+"..."),console.log("With: ",l[i]),t=l[i](e,n)):(console.log("Validating "+a+"..."),console.log("With: failover validator"),t=n.length>0)}return console.log(e.nextElementSibling&&e.nextElementSibling.textContent+" valid? "+t),t?e.addClass("valid"):e.removeClass("valid"),e.required?t:!0}function formula_inputs_valid(e){function t(e){return e===!0}return[].map.call(e,formula_validate_input).every(t)}function formula_page_is_valid(e){formula_cache_data(e),formula_animator.tilt()}function formula_page_is_invalid(){formula_animator.unTilt()}function formula_validate(e,t,n,a){this.go&&(clearTimeout(this.go),delete this.go),this.go=setTimeout(function(){n=n||formula_page_is_valid,a=a||formula_page_is_invalid,formula_inputs_valid(e)?n(e):a()},t||500)}function formula_get_pills(e){function t(e){return!e}var n=e.parentElement,a=n.getElementsByClassName("pill-left")[0],o=n.getElementsByClassName("pill-right")[0],l=[a,o];return l.every(t)?!1:l}function formula_value_with_pills(e){var t=formula_get_pills(e),n=e.value.trim();if(!t)return n;var a=t[0]&&t[0].children[0].textContent,o=t[1]&&t[1].children[0].textContent;return a&&0!=n.indexOf(a)&&(n=a+n),o&&n.indexOf(o)!=n.length-o.length&&(n+=o),n.trim()}function formula_form_setup_google_submit(e){e.action=formula_google_endpoint,e.target="dupe-frame",e.onsubmit=function(e){e.preventDefault(),e.stopPropagation()}}function formula_submit(){var e=(qq(".formula form")[0],qq(".formula form input, .formula form textarea")),t=formula_get_data(e);[].forEach.call(e,function(e){if(formula_get_pills(e)){{var n=e.id||e.type;t[n]}t[n]=formula_value_with_pills(e)}}),formula_sync_server(t),formula_animator.punchTicket()}function adjustPadding(){var e=qq(".input-group input~*, .input-group textarea~*, .input-group select~*"),t=15,n=0,a=t,o=t;[].forEach.call(e,function(e){var l=e.parentElement.children,i=l.length,r=l[i-1],s=l[0];s.type&&-1===["text","email","tel"].indexOf(s.type)||(/pill-left|glance/g.test(e.classList)&&(a+=e.offsetWidth),/pill-right/g.test(e.classList)&&(o+=e.offsetWidth),"LABEL"===e.nodeName&&(n=e.offsetWidth),e===r&&(console.log("STOP"),console.log(s),s.style.paddingLeft=a+"px",s.style.paddingRight=o+"px",s.style.width=n+"px",a=o=t))})}function closeWarning(e){var t=e.target.parentElement.parentElement;extend(t),t.addClass("dismissed")}function formula_setup_inputs(e){function t(){var e=this;0===e.value.length?e.removeClass("focus"):e.addClass("focus")}function n(){var e=this;e.previousElementSibling.addClass("focus"),e.previousElementSibling.focus()}console.log(e),extend(e),[].forEach.call(e,function(e){var a=e.nextElementSibling;a&&(a.onclick=n,e.onchange=e.onblur=t,e.value.length>0&&e.addClass("focus"))});var a=qq(".page");[].forEach.call(a,function(e){var t=[].slice.call(e.getElementsByTagName("input")),n=[].slice.call(e.getElementsByTagName("select")),a=[].slice.call(e.getElementsByTagName("textarea"));t=t.concat(a),t=t.concat(n),console.log(t);var o=function(){formula_validate(t,200)},l=function(){/checkbox|radio/.test(this.type)&&formula_cache_set(this),o()};[].forEach.call(t,function(e){e.onclick=l,e.onkeydown=function(e){return 13===e.keyCode?(e.preventDefault(),e.stopPropagation(),!1):(formula_animator.unTilt(),this.timeout&&clearTimeout(this.timeout)&&delete this.timeout,this.timeout=setTimeout(function(){o()},500),void 0)}})})}var formula_sync_url="/application-session/"+location.hash.substr(1).split(":")[1]||"",formula_animator=function(){function e(e,t,a){var o,l,i=[500,100,500];a instanceof Object&&(o=a.pre,l=a.post),i=n.calculateTimings(i),t instanceof Function?(i=l,l=o,o=t,t=e.nextElementSibling):o instanceof Function&&!l&&(l=o,o=null),t&&-1!==t.className.indexOf("page")&&(e.addClass("prev"),t.addClass("next"),e.style.opacity="1",n.reset(),n.formula.addClass("shuffle"),o&&o(),setTimeout(function(){t.addClass("current"),e.removeClass("current")},i[0]),setTimeout(function(){t.removeClass("next"),e.removeClass("prev"),n.formula.removeClass("shuffle"),l&&l()},i[1]),setTimeout(function(){e.style.opacity=""},i[2]))}function t(e){var t=document.createElement("STYLE").style.backgroundPosition="0% ";document.getElementById("formula-container").style.backgroundPosition=t+e+"%"}var n={};return n.formula=extend(qq(".formula")[0]),n.punchTicket=function(){var e=n.formula;e.removeClass("persp"),setTimeout(function(){e.addClass("punched")},500),setTimeout(function(){e.addClass("end")},3e3)},n.tilt=function(){var e=n.formula;e.addClass("persp")},n.unTilt=function(){var e=n.formula;e.removeClass("persp")},n.reset=function(){n.formula.removeClass("persp").removeClass("end").removeClass("punched").removeClass("shuffle").removeClass("reverse")},n.calculateTimings=function(e){var t=0;return e.map(function(e){return t+=e})},n.nextPage=function(n,a,o,l){a instanceof Function&&(l=a,a=null),e(n,a,{post:l}),t(o)},n.previousPage=function(a,o,l,i){o instanceof Function&&(i=o,o=null);var r=function(){n.formula.addClass("reverse")},s=function(){n.formula.removeClass("reverse"),i instanceof Function&&i()};e(a,o,{pre:r,post:s}),t(l)},n}(),formula_notify=function(){var e={};return e.notifyWindow=document.createElement("div"),extend(e.notifyWindow),e.notifyWindow.addClass("formula-notify-window"),e.notifyWindow.isAppended=!1,e.notify=function(t,n){e.notifyWindow.isAppended||document.body.appendChild(e.notifyWindow),e.notifyWindow.textContent=t,e.notifyWindow.style.display="block",setTimeout(function(){e.notifyWindow.style.opacity=1,setTimeout(function(){e.notifyWindow.style.opacity=0,setTimeout(function(){e.notifyWindow.style.display="none"},200)},n||2e3)},200)},e}(),formula_default_validators={email:function(e,t){return/\w+@[A-z0-9.\-]+/.test(t)},password:function(e,t){var n=/[_\-!@#$%^&* `~]/;return t.length>8&&/\d+/.test(t)&&n.test(t)},text_name:function(e,t){var n=t.split(/\s+/);return t.length>0&&2==n.length&&n[0].length>0&&n[1].length>0},tel:function(e,t){var n=t.split(/[-\s.]/);console.log(n);var a=n[0].replace(/[()]/g,"");return 3==n.length&&3==a.length&&!isNaN(parseInt(a))&&3==n[1].length&&!isNaN(parseInt(n[1]))&&4==n[2].length&&!isNaN(parseInt(n[2]))||/\d{10}/.test(t)&&!isNaN(parseInt(t))},text_year:function(e,t){return/\d{4}/.test(t)&&parseInt(t)>=2015},checkbox:function(e){var t=e.parentElement.children,n=!1;return[].forEach.call(t,function(e){e.checked&&(n=!0)}),n},radio:function(){return!0}},formula_validators=formula_default_validators;window.onload=function(){function e(e,n){if(n){var n=extend(n),o=n.getElementsByTagName("input"),l=n.getElementsByTagName("select"),i=n.getElementsByTagName("textarea");o=[].slice.call(o).concat([].slice.call(i)),o=[].slice.call(o).concat([].slice.call(l)),formula_animator.nextPage(e,n,a+=100/6,function(){formula_validate(o),o[0].focus()})}else formula_inputs_valid(t)?formula_submit():alert("Looks like something isn't quite right. Try going back and checking that all the textboxes are filled it, and all answers have little green check marks next to them.")}var t=qq(".formula input, .formula textarea, .formula select"),n=qq(".next-btn")[0],a=0;n.onclick=function(){var t=extend(qq(".page.current")[0]),n=t.nextElementSibling;e(t,n)};var o=qq(".back-btn");[].forEach.call(o,function(e){var t=extend(e.parentElement),n=t.previousElementSibling;if(n){var n=extend(n),o=n.getElementsByTagName("input"),l=n.getElementsByTagName("select"),i=n.getElementsByTagName("textarea");o=[].slice.call(o).concat([].slice.call(i)),o=[].slice.call(o).concat([].slice.call(l)),e.onclick=function(){formula_animator.previousPage(t,n,a-=100/6,function(){o[0].focus(),formula_validate(o)})}}else alert("There's nothing to go back to! This is the beginning!")}),formula_cache_init(),formula_setup_inputs(t,e),formula_get_data(t);var l=qq(".page.current input");formula_validate(l),adjustPadding(),window.onresize=adjustPadding;var i=qq('a[do*="close-warning"]')[0];i.onclick=closeWarning;var r=document.getElementById("resume-btn");filepicker.setKey("AV96DZseeSYOldbUvmYwGz"),r.onclick=function(){filepicker.pick({mimetypes:["text/plain","text/richtext","application/pdf","text/pdf"],container:"window",services:["COMPUTER","GMAIL","BOX","DROPBOX","GOOGLE_DRIVE","SKYDRIVE","EVERNOTE","CLOUDDRIVE"]},function(e){var t=qq(".page.current input");r.previousElementSibling.value=JSON.stringify(e),formula_validate(t)},function(e){console.log(e.toString())})};var s=qq(".thanks")[0];s.onclick=function(e){return e.preventDefault(),e.stopPropagation(),!1}};