export default (markup, head, state, apiUrl) => {
  const safeHead = head || {
    htmlAttributes: '',
    meta: '',
    title: '',
    script: '',
    link: '',
    style: '',
  }
  return `<!DOCTYPE html>
<html ${safeHead.htmlAttributes.toString()}>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${safeHead.meta.toString()}
    ${safeHead.title.toString()}
    ${safeHead.script.toString()}
    ${safeHead.style.toString()}
    ${safeHead.link.toString()}
  </head>
  <body ${safeHead.bodyAttributes.toString()}>
    <div id="react-container">${markup}</div>
    <script id="initial-state-script">
      window.API_URL="${apiUrl}";
      window.INITIAL_STATE=${JSON.stringify(state).replace(/</g, '\\u003c')};
    </script>
  </body>
</html>`
}
