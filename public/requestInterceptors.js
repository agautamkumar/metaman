// chrome.webRequest.onBeforeSendHeaders.addListener(
//   details => {
//     const headers = details.requestHeaders;
//     const indexOfOriginHeader = headers.findIndex(details => "Origin" === details.name);

//     if (indexOfOriginHeader === -1)
//       headers.push({
//         name: "Origin",
//         value: "https://www.facebook.com",
//       });
//     else headers[indexOfOriginHeader].value = "https://www.facebook.com";

//     return { requestHeaders: headers };
//   },
//   {
//     urls: ["*://www.facebook.com/*"],
//   },
//   ["requestHeaders", "blocking", "extraHeaders"],
// );

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   details => {
//     const headers = details.requestHeaders;
//     const indexOfOriginHeader = headers.findIndex(details => "Origin" === details.name);

//     if (indexOfOriginHeader === -1)
//       headers.push({
//         name: "Origin",
//         value: "https://mbasic.facebook.com",
//       });
//     else headers[indexOfOriginHeader].value = "https://mbasic.facebook.com";

//     return { requestHeaders: headers };
//   },
//   {
//     urls: ["*://mbasic.facebook.com/*"],
//   },
//   ["requestHeaders", "blocking", "extraHeaders"],
// );

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   details => {
//     const headers = details.requestHeaders;
//     const indexOfOriginHeader = headers.findIndex(details => "Origin" === details.name);

//     if (indexOfOriginHeader === -1)
//       headers.push({
//         name: "Origin",
//         value: "https://upload.facebook.com",
//       });
//     else headers[indexOfOriginHeader].value = "https://upload.facebook.com";

//     return { requestHeaders: headers };
//   },
//   {
//     urls: ["*://upload.facebook.com/_mupload_/photo/x/*"],
//   },
//   ["requestHeaders", "blocking", "extraHeaders"],
// );

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   details => {
//     const headers = details.requestHeaders;
//     const indexOfOriginHeader = headers.findIndex(details => "Origin" === details.name);

//     if (indexOfOriginHeader === -1)
//       headers.push({
//         name: "Origin",
//         value: "https://www.facebook.com",
//       });
//     else headers[indexOfOriginHeader].value = "https://www.facebook.com";

//     return { requestHeaders: headers };
//   },
//   {
//     urls: ["*://upload.facebook.com/ajax/react_composer/attachments/*"],
//   },
//   ["requestHeaders", "blocking", "extraHeaders"],
// );

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   details => {
//     const headers = details.requestHeaders;
//     const indexOfOriginHeader = headers.findIndex(details => "Origin" === details.name);

//     if (indexOfOriginHeader === -1)
//       headers.push({
//         name: "Origin",
//         value: "https://m.facebook.com",
//       });
//     else headers[indexOfOriginHeader].value = "https://m.facebook.com";

//     return { requestHeaders: headers };
//   },
//   {
//     urls: ["*://m.facebook.com/*"],
//   },
//   ["requestHeaders", "blocking", "extraHeaders"],
// );
